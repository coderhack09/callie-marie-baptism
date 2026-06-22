import { type NextRequest, NextResponse } from "next/server"
import { siteConfig } from "@/content/site"
import { getProposalRoleById } from "@/lib/proposal-roles"
import type { ProposalResponse, ProposalSubmitPayload } from "@/lib/proposal-types"

const PROPOSAL_SCRIPT_URL = siteConfig.googleAPI.proposalResponses
const SPONSORS_SCRIPT_URL = siteConfig.googleAPI.sponsors

type GasResult = { ok: boolean; data?: Record<string, unknown>; error?: string }

function normalizeResponse(row: Record<string, unknown>): ProposalResponse | null {
  const r = row as Record<string, string | undefined>
  const role = r.role ?? r.Role ?? ""
  const name = r.name ?? r.Name ?? ""
  const status = (r.status ?? r.Status ?? "") as ProposalResponse["status"]
  const submittedAt = r.submittedAt ?? r.SubmittedAt ?? r.timestamp ?? r.Timestamp ?? ""
  const category =
    r.category ?? r.Category ?? r.roleCategory ?? r.RoleCategory ?? ""
  const id = r.id ?? r.Id ?? `${role}-${submittedAt}-${name}`

  if (!role && !category && !name) return null
  if (status !== "Confirmed" && status !== "Declined") return null

  return {
    id,
    role,
    name,
    status,
    submittedAt,
    category,
  }
}

async function parseGasResponse(response: Response): Promise<GasResult> {
  try {
    const data = (await response.json()) as Record<string, unknown>
    if (!response.ok || typeof data.error === "string") {
      return { ok: false, data, error: String(data.error ?? `HTTP ${response.status}`) }
    }
    return { ok: true, data }
  } catch {
    if (!response.ok) {
      return { ok: false, error: `HTTP ${response.status}` }
    }
    return { ok: true }
  }
}

async function postToGas(url: string, body: Record<string, unknown>): Promise<GasResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return parseGasResponse(response)
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

function isSponsorRole(roleId: string) {
  const roleDef = getProposalRoleById(roleId)
  return roleDef?.type === "sponsor-ninong" || roleDef?.type === "sponsor-ninang"
}

async function syncConfirmedToSheet(payload: ProposalSubmitPayload): Promise<GasResult> {
  const roleDef = getProposalRoleById(payload.role)
  if (!roleDef || payload.status !== "Confirmed" || !payload.name.trim()) {
    return { ok: true }
  }

  if (!SPONSORS_SCRIPT_URL) {
    return { ok: false, error: "Sponsors script URL is not configured" }
  }

  if (roleDef.type === "sponsor-ninong") {
    return postToGas(SPONSORS_SCRIPT_URL, {
      action: "create",
      MalePrincipalSponsor: payload.name.trim(),
      FemalePrincipalSponsor: "",
    })
  }

  if (roleDef.type === "sponsor-ninang") {
    return postToGas(SPONSORS_SCRIPT_URL, {
      action: "create",
      MalePrincipalSponsor: "",
      FemalePrincipalSponsor: payload.name.trim(),
    })
  }

  return { ok: true }
}

export async function GET() {
  try {
    if (!PROPOSAL_SCRIPT_URL) {
      return NextResponse.json([], { status: 200 })
    }

    const response = await fetch(`${PROPOSAL_SCRIPT_URL}?action=proposals`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch proposal responses")
    }

    const data = await response.json()

    if (Array.isArray(data)) {
      const parsed = data
        .map((row) => normalizeResponse(row as Record<string, unknown>))
        .filter((row): row is ProposalResponse => row !== null)
      return NextResponse.json(parsed, { status: 200 })
    }

    const rows = (data?.proposals ?? data?.GoogleSheetData ?? []) as Record<string, unknown>[]
    if (Array.isArray(rows)) {
      const parsed = rows
        .map((row) => normalizeResponse(row))
        .filter((row): row is ProposalResponse => row !== null)
      return NextResponse.json(parsed, { status: 200 })
    }

    return NextResponse.json([], { status: 200 })
  } catch (error) {
    console.error("Error fetching proposal responses:", error)
    return NextResponse.json(
      { error: "Failed to fetch proposal responses" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ProposalSubmitPayload
    const { role, name, status, submittedAt } = body

    if (!role || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (status !== "Confirmed" && status !== "Declined") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const roleDef = getProposalRoleById(role)
    if (!roleDef) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const payload: ProposalSubmitPayload = {
      role,
      name: name?.trim() || (status === "Declined" ? "Declined Godparent Offer" : ""),
      status,
      submittedAt: submittedAt || new Date().toISOString(),
    }

    let logSaved = false
    let sponsorSynced = false

    if (PROPOSAL_SCRIPT_URL) {
      const logResult = await postToGas(PROPOSAL_SCRIPT_URL, {
        action: "proposal",
        role: payload.role,
        name: payload.name,
        status: payload.status,
        submittedAt: payload.submittedAt,
        category: roleDef.roleCategory,
        id: `${role}-${Date.now()}`,
      })
      logSaved = logResult.ok
      sponsorSynced =
        status === "Confirmed" &&
        isSponsorRole(role) &&
        Boolean(logResult.data?.sponsorSync)
    }

    if (status === "Confirmed" && payload.name && !sponsorSynced && isSponsorRole(role)) {
      const syncResult = await syncConfirmedToSheet(payload)
      sponsorSynced = syncResult.ok
      if (!syncResult.ok) {
        return NextResponse.json(
          { error: syncResult.error ?? "Failed to sync godparent to sponsors sheet" },
          { status: 502 }
        )
      }
    }

    if (!logSaved && status === "Declined" && PROPOSAL_SCRIPT_URL) {
      return NextResponse.json(
        { error: "Failed to save proposal response" },
        { status: 502 }
      )
    }

    if (status === "Confirmed" && isSponsorRole(role) && !logSaved && !sponsorSynced) {
      return NextResponse.json(
        { error: "Failed to save godparent response" },
        { status: 502 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        logSaved,
        synced: sponsorSynced,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error saving proposal response:", error)
    return NextResponse.json(
      { error: "Failed to save proposal response" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!PROPOSAL_SCRIPT_URL) {
      return NextResponse.json({ error: "Proposal responses not configured" }, { status: 503 })
    }

    const body = await request.json()
    const { id } = body

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "id is required" }, { status: 400 })
    }

    const result = await postToGas(PROPOSAL_SCRIPT_URL, {
      action: "delete-proposal",
      id: id.trim(),
    })

    if (!result.ok) {
      throw new Error(result.error ?? "Failed to delete proposal response")
    }

    return NextResponse.json(result.data ?? { success: true }, { status: 200 })
  } catch (error) {
    console.error("Error deleting proposal response:", error)
    return NextResponse.json(
      { error: "Failed to delete proposal response" },
      { status: 500 }
    )
  }
}
