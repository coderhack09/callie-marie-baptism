import { siteConfig } from "@/content/site"
import type { ProposalResponse } from "@/lib/proposal-types"

export type GoogleScriptKey =
  | "message"
  | "guestList"
  | "guestRequest"
  | "entourage"
  | "sponsors"
  | "proposalResponses"
  | "weddingDetails"

export function getGoogleScriptUrl(key: GoogleScriptKey, query?: Record<string, string>): string {
  const base = siteConfig.googleAPI[key]
  if (!query || Object.keys(query).length === 0) return base
  return `${base}?${new URLSearchParams(query).toString()}`
}

/** Browser-safe GET — no custom headers (avoids CORS preflight). */
export async function fetchGoogleScript<T>(
  key: GoogleScriptKey,
  query?: Record<string, string>
): Promise<T> {
  const response = await fetch(getGoogleScriptUrl(key, query), { cache: "no-store" })
  if (!response.ok) {
    throw new Error(`Failed to fetch ${key}: HTTP ${response.status}`)
  }
  const data = await response.json()
  if (data && typeof data === "object" && "error" in data && (data as { error?: string }).error) {
    throw new Error(String((data as { error: string }).error))
  }
  return data as T
}

export async function postGoogleScript<T>(
  key: GoogleScriptKey,
  body: unknown,
  query?: Record<string, string>
): Promise<T> {
  // text/plain avoids CORS preflight; GAS still parses JSON from postData.contents
  const response = await fetch(getGoogleScriptUrl(key, query), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    throw new Error(`Failed to post ${key}: HTTP ${response.status}`)
  }
  const data = await response.json()
  if (data && typeof data === "object" && "error" in data && (data as { error?: string }).error) {
    throw new Error(String((data as { error: string }).error))
  }
  return data as T
}

export async function createGuestOnSheet(
  body: Omit<Guest, "id"> & Pick<Guest, "status">
): Promise<unknown> {
  return postGoogleScript("guestList", {
    action: "create",
    name: body.name.trim(),
    role: body.role?.trim() || "Guest",
    email: body.email?.trim() || "",
    contact: body.contact?.trim() || "",
    message: body.message?.trim() || "",
    allowedGuests: parseInt(String(body.allowedGuests)) || 1,
    companions: body.companions || [],
    tableNumber: body.tableNumber?.trim() || "",
    isVip: body.isVip === true,
    status: body.status,
    addedBy: body.addedBy?.trim() || "",
  })
}

export async function updateGuestOnSheet(guest: Guest): Promise<unknown> {
  return postGoogleScript("guestList", {
    action: "update",
    id: String(guest.id),
    name: guest.name,
    role: guest.role?.trim() || "Guest",
    email: guest.email || "",
    contact: guest.contact || "",
    message: guest.message || "",
    allowedGuests: guest.allowedGuests,
    companions: guest.companions || [],
    tableNumber: guest.tableNumber || "",
    isVip: guest.isVip === true,
    status: guest.status,
    addedBy: guest.addedBy || "",
  })
}

export async function deleteGuestOnSheet(id: string | number): Promise<unknown> {
  return postGoogleScript("guestList", { action: "delete", id: String(id) })
}

export interface Guest {
  id: string | number
  name: string
  role: string
  email?: string
  contact?: string
  message?: string
  allowedGuests: number
  companions: { name: string; relationship: string }[]
  tableNumber: string
  isVip: boolean
  status: "pending" | "confirmed" | "declined" | "request"
  addedBy?: string
  createdAt?: string
  updatedAt?: string
}

export function normalizeGuests(data: unknown): Guest[] {
  if (!Array.isArray(data)) return []
  return data
    .filter((guest) => guest && typeof guest === "object")
    .map((guest: Record<string, unknown>) => ({
      ...guest,
      id: String(guest.id ?? ""),
      name: String(guest.name ?? ""),
      role: String(guest.role || "Guest"),
      email: String(guest.email || ""),
      contact: String(guest.contact || ""),
      message: String(guest.message || ""),
      allowedGuests: parseInt(String(guest.allowedGuests)) || 1,
      companions: Array.isArray(guest.companions) ? guest.companions : [],
      tableNumber: String(guest.tableNumber || ""),
      isVip: guest.isVip === true || guest.isVip === "TRUE",
      status: (guest.status as Guest["status"]) || "pending",
      addedBy: String(guest.addedBy || ""),
      createdAt: String(guest.createdAt || ""),
      updatedAt: String(guest.updatedAt || ""),
    })) as Guest[]
}

export interface GuestRequest {
  Name: string
  Email: string
  Phone: string
  RSVP: string
  Guest: string
  Message: string
}

function normalizeProposalResponse(row: Record<string, unknown>): ProposalResponse | null {
  const role = String(row.role ?? row.Role ?? "")
  const name = String(row.name ?? row.Name ?? "")
  const status = String(row.status ?? row.Status ?? "")
  const submittedAt = String(
    row.submittedAt ?? row.SubmittedAt ?? row.timestamp ?? row.Timestamp ?? ""
  )
  const category = String(
    row.category ?? row.Category ?? row.roleCategory ?? row.RoleCategory ?? ""
  )
  const id = String(row.id ?? row.Id ?? `${role}-${submittedAt}-${name}`)

  if (!role && !category && !name) return null
  if (status !== "Confirmed" && status !== "Declined") return null

  return {
    id,
    role,
    name,
    status: status as ProposalResponse["status"],
    submittedAt,
    category,
  }
}

export async function fetchProposalResponses(): Promise<ProposalResponse[]> {
  const data = await fetchGoogleScript<unknown>("proposalResponses", { action: "proposals" })
  if (!Array.isArray(data)) return []
  return data
    .map((row) => normalizeProposalResponse(row as Record<string, unknown>))
    .filter((row): row is ProposalResponse => row !== null)
}

export async function submitProposalResponse(payload: {
  role: string
  name: string
  status: ProposalResponse["status"]
  submittedAt: string
  category: string
}): Promise<void> {
  await postGoogleScript("proposalResponses", {
    action: "proposal",
    role: payload.role,
    name: payload.name,
    status: payload.status,
    submittedAt: payload.submittedAt,
    category: payload.category,
    id: `${payload.role}-${Date.now()}`,
  })
}

export function normalizeGuestRequests(data: unknown): GuestRequest[] {
  const safeString = (value: unknown): string => {
    if (value === null || value === undefined) return ""
    return String(value).trim()
  }

  if (!Array.isArray(data)) return []
  return data.map((request: Record<string, unknown>) => ({
    Name: safeString(request.Name ?? request.name),
    Email: safeString(request.Email ?? request.email),
    Phone: safeString(request.Phone ?? request.phone),
    RSVP: safeString(request.RSVP ?? request.rsvp),
    Guest: safeString(request.Guest ?? request.guest),
    Message: safeString(request.Message ?? request.message),
  }))
}
