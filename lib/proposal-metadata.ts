import type { Metadata } from "next"
import { siteConfig } from "@/content/site"
import { OG_IMAGE_PATH, OG_IMAGE_URL } from "@/lib/og-image"
import { getSiteCanonicalBase } from "@/lib/site-url"

const canonicalBase = getSiteCanonicalBase()
const childName = siteConfig.couple.child
const parents = siteConfig.couple.parents

export function buildProposalMetadata(options?: {
  roleTitle?: string
  path?: string
}): Metadata {
  const roleTitle = options?.roleTitle
  const path = options?.path ?? "/will-you-be-proposal"
  const url = `${canonicalBase}${path}`

  const title = roleTitle
    ? `Will You Be ${childName}'s ${roleTitle}?`
    : `Will You Be ${childName}'s Godparent?`

  const description = roleTitle
    ? `${parents} lovingly invite you to be ${childName}'s ${roleTitle}. Open this special proposal and share your heartfelt response.`
    : `${parents} have a special godparent proposal for you. Open your link to view the invitation and respond.`

  const ogTitle = `${title} | ${childName}'s Christening`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: `${childName} Christening`,
      locale: "en_PH",
      type: "website",
      images: [
        {
          url: OG_IMAGE_URL,
          secureUrl: OG_IMAGE_URL,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: roleTitle
            ? `Will you be ${childName}'s ${roleTitle}? — Christening Proposal`
            : `${childName} Christening Godparent Proposal`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [OG_IMAGE_URL],
    },
  }
}

export { OG_IMAGE_PATH, OG_IMAGE_URL }
