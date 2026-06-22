"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Copy,
  ExternalLink,
  Send,
  Check,
  Search,
  Sparkles,
  Heart,
  Link2,
  Crown,
  Share2,
  ImageIcon,
} from "lucide-react"
import { siteConfig } from "@/content/site"
import { OG_IMAGE_PATH } from "@/lib/og-image"
import { getProposalLink, PROJECT_SITE_HOST } from "@/lib/site-url"
import {
  PROPOSAL_ROLES,
  PROPOSAL_SPONSOR_ROLE_SLOTS,
  countFilledNamesByProposalRoles,
  getRoleSingular,
} from "@/lib/proposal-roles"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const CATEGORY_TABS = ["all", "Ninong", "Ninang"] as const

interface PrincipalSponsorRow {
  MalePrincipalSponsor?: string
  FemalePrincipalSponsor?: string
}

export function ProposalDashboard() {
  const [sponsorRows, setSponsorRows] = useState<PrincipalSponsorRow[]>([])
  const [isCountsLoading, setIsCountsLoading] = useState(true)
  const [copiedRoleId, setCopiedRoleId] = useState<string | null>(null)
  const [categoryTab, setCategoryTab] = useState<(typeof CATEGORY_TABS)[number]>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedInviteRole, setSelectedInviteRole] = useState<
    (typeof PROPOSAL_ROLES)[number] | null
  >(null)
  const [inviteeName, setInviteeName] = useState("")
  const [copiedInviteText, setCopiedInviteText] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [canNativeShare, setCanNativeShare] = useState(false)

  const copyToClipboard = async (text: string) => {
    setCopyError(null)
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      try {
        const textarea = document.createElement("textarea")
        textarea.value = text
        textarea.setAttribute("readonly", "")
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        const ok = document.execCommand("copy")
        document.body.removeChild(textarea)
        if (!ok) throw new Error("copy failed")
        return true
      } catch {
        setCopyError("Could not copy — please select and copy manually.")
        return false
      }
    }
  }

  const handleCopyLink = async (roleId: string) => {
    const ok = await copyToClipboard(getProposalLink(roleId))
    if (ok) {
      setCopiedRoleId(roleId)
      setTimeout(() => setCopiedRoleId(null), 2500)
    }
  }

  const openInviteModal = (role: (typeof PROPOSAL_ROLES)[number]) => {
    setSelectedInviteRole(role)
    setInviteeName("")
    setCopiedInviteText(false)
  }

  const closeInviteModal = () => {
    setSelectedInviteRole(null)
    setInviteeName("")
    setCopiedInviteText(false)
  }

  const buildInviteMessage = (
    role: (typeof PROPOSAL_ROLES)[number],
    recipientName = inviteeName
  ) => {
    const namePrefix = recipientName.trim() ? `Hi ${recipientName.trim()}! ` : "Hi! "
    const roleSingular = getRoleSingular(role.title)
    const url = getProposalLink(role.id)
    const child = siteConfig.couple.child
    const parents = siteConfig.couple.parents
    const date = siteConfig.ceremony.date

    return `${namePrefix}${parents} would be absolutely honored if you would stand as ${child}'s ${roleSingular} at her christening on ${date}! ✨\n\nBecause you are such a wonderful example of faith, love, and devotion, they would love for you to guide her in this sacred role.\n\nRead their formal proposal here and let them know your thoughts:\n${url}`
  }

  const getInviteMessage = () => {
    if (!selectedInviteRole) return ""
    return buildInviteMessage(selectedInviteRole)
  }

  const handleCopyInviteText = async () => {
    const ok = await copyToClipboard(getInviteMessage())
    if (ok) {
      setCopiedInviteText(true)
      setTimeout(() => setCopiedInviteText(false), 2500)
    }
  }

  const handleNativeShare = async (role: (typeof PROPOSAL_ROLES)[number]) => {
    if (!navigator.share) return
    setCopyError(null)
    const url = getProposalLink(role.id)
    const message = buildInviteMessage(role)
    try {
      await navigator.share({
        title: `Will you be ${siteConfig.couple.child}'s ${getRoleSingular(role.title)}?`,
        text: message.replace(url, "").trim(),
        url,
      })
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return
      setCopyError("Share failed — try copying the link instead.")
    }
  }

  const fetchSheetCounts = async () => {
    setIsCountsLoading(true)
    try {
      const sponsorsRes = await fetch("/api/principal-sponsor", { cache: "no-store" })

      if (sponsorsRes.ok) {
        const data = await sponsorsRes.json()
        setSponsorRows(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error("Error fetching sponsor counts:", error)
    } finally {
      setIsCountsLoading(false)
    }
  }

  useEffect(() => {
    fetchSheetCounts()
    setCanNativeShare(typeof navigator !== "undefined" && typeof navigator.share === "function")

    const handleEntourageUpdate = () => {
      setTimeout(fetchSheetCounts, 1000)
    }

    window.addEventListener("entourageUpdated", handleEntourageUpdate)
    return () => window.removeEventListener("entourageUpdated", handleEntourageUpdate)
  }, [])

  const filteredRoles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return PROPOSAL_ROLES.filter((role) => {
      const matchesCategory =
        categoryTab === "all" || role.title.toLowerCase() === categoryTab.toLowerCase()
      const matchesSearch =
        !query ||
        role.title.toLowerCase().includes(query) ||
        role.category.toLowerCase().includes(query) ||
        role.roleCategory.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [categoryTab, searchQuery])

  const { filledSponsors: filledSponsorCount } = countFilledNamesByProposalRoles([], sponsorRows)

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-gradient-to-br from-[#FFF8F0] via-white to-[#F9FAFB] p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#A67C52]/15 text-[#8B6F47]">
              <Heart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">Godparent Proposals</h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#6B7280]">
                Share a unique proposal link for Ninong or Ninang. When someone accepts, their name
                syncs to Principal Sponsors in Google Sheets — ready for your christening invitation.
              </p>
            </div>
          </div>
          <Link
            href="/"
            target="_blank"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#6B4423] shadow-sm transition-colors hover:bg-[#FFF8F0]"
          >
            <ExternalLink className="h-4 w-4" />
            Preview Site
          </Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs text-[#6B7280]">
            <Crown className="h-3.5 w-3.5 text-[#A67C52]" />
            <span>
              <strong className="text-[#6B4423]">
                {isCountsLoading ? "…" : filledSponsorCount}
              </strong>{" "}
              godparents · {PROPOSAL_SPONSOR_ROLE_SLOTS} proposal roles
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs text-[#6B7280]">
            <Link2 className="h-3.5 w-3.5 text-[#A67C52]" />
            <span>
              <strong className="text-[#6B4423]">{PROPOSAL_ROLES.length}</strong> proposal links
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-dashed border-[#E5E7EB] bg-white/80 px-3 py-1.5 text-[10px] text-[#9CA3AF]">
            Live from Google Sheets
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-[#E5E7EB] bg-[#FFFBF7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#A67C52]/10 text-[#8B6F47]">
            <ImageIcon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6B4423]">Link preview on Messenger &amp; Viber</p>
            <p className="mt-0.5 text-xs leading-relaxed text-[#6B7280]">
              Shared links always use{" "}
              <span className="font-mono text-[#6B4423]">{PROJECT_SITE_HOST}</span> — not another
              domain. If a preview is missing after deploy, refresh it in the{" "}
              <a
                href="https://developers.facebook.com/tools/debug/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#8B6F47] underline underline-offset-2 hover:text-[#6B4423]"
              >
                Facebook Sharing Debugger
              </a>
              .
            </p>
          </div>
        </div>
        <img
          src={OG_IMAGE_PATH}
          alt="Link preview thumbnail"
          width={120}
          height={63}
          className="hidden shrink-0 rounded-md border border-[#E5E7EB] object-cover sm:block"
        />
      </div>

      {copyError && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          {copyError}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setCategoryTab(tab)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold tracking-wide uppercase transition-all ${
                categoryTab === tab
                  ? "border-[#A67C52] bg-[#A67C52] text-white shadow-sm"
                  : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#D4B5A0] hover:text-[#6B4423]"
              }`}
            >
              {tab === "all" ? "All Roles" : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-3 left-3 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm focus:ring-2 focus:ring-[#A67C52]/30 focus:outline-none"
          />
        </div>
      </div>

      {filteredRoles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] py-16 text-center">
          <Search className="mx-auto mb-3 h-10 w-10 text-[#D1D5DB]" />
          <p className="font-medium text-[#6B7280]">No roles match your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filteredRoles.map((role) => {
            const isCopied = copiedRoleId === role.id
            const link = getProposalLink(role.id)

            return (
              <div
                key={role.id}
                className="group flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-all hover:border-[#D4B5A0]/60 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-base font-semibold text-[#111827]">{role.title}</h4>
                    <p className="mt-0.5 text-xs text-[#9CA3AF]">{role.roleCategory}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-[#E5E7EB] bg-[#FFF8F0] px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#8B6F47] uppercase">
                    Godparent
                  </span>
                </div>

                <p className="mb-4 line-clamp-3 flex-1 text-xs leading-relaxed text-[#6B7280]">
                  {role.description}
                </p>

                <div className="mb-4 rounded-lg border border-[#F3F4F6] bg-[#F9FAFB] px-3 py-2">
                  <p className="truncate font-mono text-[10px] text-[#9CA3AF]">{link}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(role.id)}
                    className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all ${
                      isCopied
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-[#E5E7EB] bg-white text-[#6B4423] hover:bg-[#FFF8F0]"
                    }`}
                  >
                    {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {isCopied ? "Copied!" : "Copy Link"}
                  </button>

                  {canNativeShare && (
                    <button
                      onClick={() => handleNativeShare(role)}
                      className="cursor-pointer rounded-lg border border-[#E5E7EB] bg-white p-2.5 text-[#6B7280] transition-all hover:bg-[#F9FAFB] hover:text-[#6B4423]"
                      title="Share link"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => openInviteModal(role)}
                    className="cursor-pointer rounded-lg border border-[#A67C52]/30 bg-[#FFF8F0] p-2.5 text-[#8B6F47] transition-all hover:border-[#A67C52] hover:bg-[#A67C52] hover:text-white"
                    title="Invite helper"
                  >
                    <Send className="h-4 w-4" />
                  </button>

                  <Link
                    href={`/will-you-be-proposal/${role.id}`}
                    target="_blank"
                    className="rounded-lg border border-[#E5E7EB] bg-white p-2.5 text-[#6B7280] transition-all hover:bg-[#F9FAFB] hover:text-[#6B4423]"
                    title="Open proposal page"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog
        open={!!selectedInviteRole}
        onOpenChange={(open) => {
          if (!open) closeInviteModal()
        }}
      >
        <DialogContent className="flex w-full max-w-lg flex-col gap-0 overflow-hidden border-[#E5E7EB] bg-white p-0 sm:max-w-xl">
          <div className="border-b border-[#F3F4F6] bg-gradient-to-r from-[#FFF8F0] to-white px-6 py-5 pr-12">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="flex items-center gap-2 text-[#6B4423]">
                <Sparkles className="h-5 w-5 text-[#A67C52]" />
                Invite Helper
              </DialogTitle>
              <DialogDescription className="text-sm text-[#6B7280]">
                {selectedInviteRole
                  ? `Compose a personal message for ${selectedInviteRole.title}`
                  : "Compose a godparent proposal invite message"}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="min-w-0 space-y-4 px-6 py-5">
            <div className="min-w-0">
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Recipient name
              </label>
              <input
                type="text"
                placeholder="e.g. Tito James / Tita Maria"
                value={inviteeName}
                onChange={(e) => setInviteeName(e.target.value)}
                className="box-border w-full min-w-0 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#A67C52]/30 focus:outline-none"
              />
            </div>

            <div className="min-w-0">
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-[#6B7280] uppercase">
                Message preview
              </label>
              <textarea
                readOnly
                rows={8}
                value={getInviteMessage()}
                className="box-border w-full min-w-0 resize-none overflow-x-hidden rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap text-[#374151] focus:outline-none"
              />
            </div>

            {selectedInviteRole && (
              <div className="min-w-0 rounded-xl border border-[#E5E7EB] bg-[#FFF8F0] px-4 py-3">
                <p className="text-[10px] font-semibold tracking-wider text-[#8B6F47] uppercase">
                  Proposal link
                </p>
                <p className="mt-1 break-all font-mono text-xs text-[#6B7280]">
                  {getProposalLink(selectedInviteRole.id)}
                </p>
                <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#E5E7EB] bg-white p-2">
                  <img
                    src={OG_IMAGE_PATH}
                    alt="Messenger link preview"
                    width={96}
                    height={50}
                    className="rounded border border-[#F3F4F6] object-cover"
                  />
                  <p className="text-[10px] leading-relaxed text-[#9CA3AF]">
                    This image appears when the link is pasted in Messenger, Viber, or iMessage.
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="shrink-0 border-t border-[#F3F4F6] bg-[#F9FAFB] px-6 py-4 sm:justify-between">
            <button
              type="button"
              onClick={closeInviteModal}
              className="cursor-pointer rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-xs font-semibold tracking-wide text-[#6B7280] uppercase hover:text-[#6B4423]"
            >
              Cancel
            </button>
            <div className="flex flex-wrap items-center gap-2">
              {canNativeShare && selectedInviteRole && (
                <button
                  type="button"
                  onClick={() => handleNativeShare(selectedInviteRole)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-xs font-semibold tracking-wide text-[#6B4423] uppercase transition-all hover:bg-[#FFF8F0]"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
              )}
              <button
                type="button"
                onClick={handleCopyInviteText}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#A67C52] bg-[#A67C52] px-5 py-2.5 text-xs font-semibold tracking-wide text-white uppercase transition-all hover:bg-[#8B6F47]"
              >
                {copiedInviteText ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedInviteText ? "Copied!" : "Copy Message"}
              </button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <p className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 text-xs leading-relaxed text-[#9CA3AF]">
        Confirmed responses auto-sync to{" "}
        <span className="font-mono text-[#6B7280]">googleAPI.sponsors</span> (PrincipalSponsors
        sheet) — Ninong names in the male column, Ninang names in the female column.
      </p>
    </div>
  )
}
