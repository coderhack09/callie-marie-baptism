import { siteConfig } from "@/content/site"

export const PROJECT_SITE_HOST =
  (process.env.NEXT_PUBLIC_SITE_URL ?? "https://callie-marie-baptism.weddinginvitationrsvp.com/")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "")

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://callie-marie-baptism.weddinginvitationrsvp.com/"

export function getProposalLink(roleId: string): string {
  const base = siteUrl.replace(/\/$/, "")
  return `${base}/will-you-be-proposal/${roleId}`
}

export function getSiteCanonicalBase(): string {
  return siteUrl.replace(/\/$/, "")
}

export const childDisplayName = siteConfig.couple.child
