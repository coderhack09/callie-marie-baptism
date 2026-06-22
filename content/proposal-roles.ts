import type { ProposalRoleDefinition } from "@/lib/proposal-types"

/**
 * Godparent proposal roles — Ninong and Ninang only.
 * Confirmed responses sync to PrincipalSponsors in Google Sheets.
 */
export const proposalRoleDefinitions: ProposalRoleDefinition[] = [
  {
    id: "principal-sponsor-ninong",
    title: "Ninong",
    category: "Principal Sponsor",
    type: "sponsor-ninong",
    roleCategory: "Principal Sponsors",
    description:
      "To guide her in faith as a second father — with wisdom, prayers, and love.",
  },
  {
    id: "principal-sponsor-ninang",
    title: "Ninang",
    category: "Principal Sponsor",
    type: "sponsor-ninang",
    roleCategory: "Principal Sponsors",
    description:
      "To guide her in faith as a second mother — with love, counsel, and prayers.",
  },
]

export const proposalRoleIdAliases: Record<string, string> = {
  ninong: "principal-sponsor-ninong",
  ninang: "principal-sponsor-ninang",
}
