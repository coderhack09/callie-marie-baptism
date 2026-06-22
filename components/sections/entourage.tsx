"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { principalSponsors as staticSponsors, siteConfig } from "@/content/site"
import { fetchGoogleScript } from "@/lib/google-script-client"
import { Loader2 } from "lucide-react"
import { Cinzel } from "next/font/google"
import { C, text } from "@/components/loader/christening-theme"
import { CornerFloralDecor } from "@/components/loader/ChristeningDecor"
import { ChristeningParticles } from "@/components/loader/ChristeningParticles"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

const cardStyle = {
  background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 48%, ${C.champagne} 100%)`,
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
} as const

const GRID_TWO_COL =
  "grid grid-cols-1 min-[350px]:grid-cols-2 gap-x-3 sm:gap-x-5 md:gap-x-6 gap-y-0.5 sm:gap-y-1"

interface EntourageMember {
  Name: string
  RoleCategory: string
  RoleTitle: string
  Email: string
}

interface DisplayMember {
  name: string
  roleTitle?: string
}

interface PrincipalSponsor {
  MalePrincipalSponsor: string
  FemalePrincipalSponsor: string
}

interface FamilyGroup {
  mothers: DisplayMember[]
  fathers: DisplayMember[]
  siblings: DisplayMember[]
}

/** Title case per word; Unicode-safe for names like Ñe. */
function toTitleCaseDisplayName(name: string): string {
  const lower = name.toLocaleLowerCase("es")
  return lower.replace(
    /(^|[\s'\-])(\p{L})/gu,
    (_, sep: string, letter: string) => sep + letter.toLocaleUpperCase("es")
  )
}

function BlockHeading({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h3
      className={`${cinzel.className} text-center text-[0.75rem] sm:text-[0.82rem] md:text-[0.9rem] tracking-[0.20em] uppercase mb-2 sm:mb-2.5 ${className}`}
      style={{ color: C.roseDeep, fontWeight: 600, lineHeight: 1.25 }}
    >
      {children}
    </h3>
  )
}

function ColumnLabel({
  children,
  align = "center",
  className = "",
}: {
  children: React.ReactNode
  align?: "left" | "center" | "right"
  className?: string
}) {
  const textAlign =
    align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"

  return (
    <p
      className={`${cinzel.className} text-[0.58rem] sm:text-[0.65rem] md:text-[0.72rem] tracking-[0.22em] uppercase ${textAlign} ${className}`}
      style={{ color: C.goldDeep, fontWeight: 600 }}
    >
      {children}
    </p>
  )
}

function SectionTitle({
  children,
  align = "center",
  className = "",
}: {
  children: React.ReactNode
  align?: "left" | "center" | "right"
  className?: string
}) {
  return (
    <ColumnLabel align={align} className={`mb-1 sm:mb-1.5 ${className}`}>
      {children}
    </ColumnLabel>
  )
}

function NameItem({
  member,
  align = "center",
  showRole = false,
  isVisible = true,
  delayMs = 0,
}: {
  member: DisplayMember
  align?: "left" | "center" | "right"
  showRole?: boolean
  isVisible?: boolean
  delayMs?: number
}) {
  if (!member.name.trim()) {
    return <div className="py-0.5" aria-hidden />
  }

  const containerAlign =
    align === "right" ? "items-end" : align === "left" ? "items-start" : "items-center"
  const textAlign =
    align === "right" ? "text-right" : align === "left" ? "text-left" : "text-center"

  return (
    <div
      className={`relative flex flex-col ${containerAlign} justify-center py-0.5 sm:py-0.5 leading-snug group/item transition-all duration-700`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : "translateY(8px)",
        transitionDelay: `${delayMs}ms`,
      }}
    >
      <div
        className="absolute inset-0 rounded-md opacity-0 transition-opacity duration-300 group-hover/item:opacity-100"
        style={{
          background: `linear-gradient(to right, transparent, rgba(201,168,108,0.12), transparent)`,
        }}
      />
      <p
        className={`relative text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] break-words [overflow-wrap:anywhere] ${textAlign} transition-all duration-300`}
        style={{
          fontFamily: '"Fahkwang", sans-serif',
          fontWeight: 500,
          color: C.roseDeep,
          letterSpacing: "0.02em",
          lineHeight: 1.55,
        }}
      >
        {toTitleCaseDisplayName(member.name)}
      </p>
      {showRole && member.roleTitle ? (
        <p
          className={`relative ${cinzel.className} text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] font-medium mt-0.5 leading-tight ${textAlign} tracking-[0.14em] uppercase transition-colors duration-300`}
          style={{ color: C.mauve }}
        >
          {member.roleTitle}
        </p>
      ) : null}
    </div>
  )
}

function TwoColumnLayout({
  children,
  leftTitle,
  rightTitle,
  singleTitle,
  centerContent = false,
}: {
  children: React.ReactNode
  leftTitle?: string
  rightTitle?: string
  singleTitle?: string
  centerContent?: boolean
}) {
  if (singleTitle) {
    return (
      <div className="mb-2 sm:mb-2.5">
        <SectionTitle>{singleTitle}</SectionTitle>
        <div className={`${GRID_TWO_COL} ${centerContent ? "max-w-2xl mx-auto" : ""}`}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <div className="mb-2 sm:mb-2.5">
      <div className={`${GRID_TWO_COL} mb-1.5 sm:mb-2`}>
        {leftTitle ? (
          <ColumnLabel align="right" className="pr-1 sm:pr-2">
            {leftTitle}
          </ColumnLabel>
        ) : null}
        {rightTitle ? (
          <ColumnLabel align="left" className="pl-1 sm:pl-2">
            {rightTitle}
          </ColumnLabel>
        ) : null}
      </div>
      <div className={`${GRID_TWO_COL} ${centerContent ? "max-w-2xl mx-auto" : ""}`}>
        {children}
      </div>
    </div>
  )
}

function SectionDivider() {
  return (
    <div className="flex justify-center py-2 sm:py-3">
      <div
        className="w-full max-w-xs h-px"
        style={{
          background: `linear-gradient(to right, transparent, rgba(201,168,108,0.45), transparent)`,
        }}
      />
    </div>
  )
}

function mapStaticFamily(): FamilyGroup {
  const parts = siteConfig.couple.parents.split(/\s*&\s*/)
  return {
    mothers: parts[0]?.trim() ? [{ name: parts[0].trim() }] : [],
    fathers: parts[1]?.trim() ? [{ name: parts[1].trim() }] : [],
    siblings: [],
  }
}

function mapStaticSponsors(): PrincipalSponsor[] {
  return staticSponsors
    .filter((s) => s.name || s.spouse)
    .map(({ name, spouse }) => ({
      MalePrincipalSponsor: name || "",
      FemalePrincipalSponsor: spouse || "",
    }))
}

function normalizeEntourageMember(raw: Record<string, unknown>): EntourageMember {
  return {
    Name: String(raw.Name ?? raw.name ?? "").trim(),
    RoleCategory: String(raw.RoleCategory ?? raw.roleCategory ?? "").trim(),
    RoleTitle: String(raw.RoleTitle ?? raw.roleTitle ?? "").trim(),
    Email: String(raw.Email ?? raw.email ?? "").trim(),
  }
}

function normalizeEntourageList(data: unknown): EntourageMember[] {
  if (!Array.isArray(data)) return []
  return data
    .filter((row) => row && typeof row === "object")
    .map((row) => normalizeEntourageMember(row as Record<string, unknown>))
    .filter((member) => member.Name)
}

function normalizeSponsor(raw: Record<string, unknown>): PrincipalSponsor {
  return {
    MalePrincipalSponsor: String(
      raw.MalePrincipalSponsor ?? raw.malePrincipalSponsor ?? raw.Ninong ?? raw.ninong ?? ""
    ).trim(),
    FemalePrincipalSponsor: String(
      raw.FemalePrincipalSponsor ?? raw.femalePrincipalSponsor ?? raw.Ninang ?? raw.ninang ?? ""
    ).trim(),
  }
}

function normalizeSponsorList(data: unknown): PrincipalSponsor[] {
  if (!Array.isArray(data)) return []
  return data
    .filter((row) => row && typeof row === "object")
    .map((row) => normalizeSponsor(row as Record<string, unknown>))
    .filter((s) => s.MalePrincipalSponsor || s.FemalePrincipalSponsor)
}

function memberRoleText(member: EntourageMember): string {
  return `${member.RoleCategory} ${member.RoleTitle}`.toLowerCase()
}

function isMother(category: string, title: string, role: string): boolean {
  return (
    category === "mother" ||
    title === "mother" ||
    /\bmother\b/.test(role) ||
    /\bmom\b/.test(role) ||
    /\bmama\b/.test(role)
  )
}

function isFather(category: string, title: string, role: string): boolean {
  return (
    category === "father" ||
    title === "father" ||
    /\bfather\b/.test(role) ||
    /\bdad\b/.test(role) ||
    /\bdaddy\b/.test(role)
  )
}

function isSibling(category: string, title: string, role: string): boolean {
  return (
    category === "sibling" ||
    category === "siblings" ||
    title === "sibling" ||
    title === "siblings" ||
    /\bsiblings?\b/.test(role) ||
    /\bbrother\b/.test(role) ||
    /\bsister\b/.test(role) ||
    /\bkuya\b/.test(role) ||
    /\bate\b/.test(role) ||
    (category === "family" && (/\bbrother\b/.test(title) || /\bsister\b/.test(title)))
  )
}

function isSponsorRole(category: string, title: string): boolean {
  const combined = `${category} ${title}`.toLowerCase()
  return (
    combined.includes("sponsor") ||
    combined.includes("ninong") ||
    combined.includes("ninang") ||
    combined.includes("godparent")
  )
}

function toDisplayMember(member: EntourageMember): DisplayMember {
  return {
    name: member.Name.trim(),
    roleTitle: member.RoleTitle.trim() || undefined,
  }
}

function parseFamilyMembers(members: EntourageMember[]): FamilyGroup {
  const family: FamilyGroup = { mothers: [], fathers: [], siblings: [] }
  const unmatched: EntourageMember[] = []

  for (const member of members) {
    const name = member.Name.trim()
    if (!name) continue

    const category = member.RoleCategory.trim().toLowerCase()
    const title = member.RoleTitle.trim().toLowerCase()
    const role = memberRoleText(member)
    const display = toDisplayMember(member)

    if (isSponsorRole(category, title)) continue

    if (isMother(category, title, role)) {
      family.mothers.push(display)
      continue
    }

    if (isFather(category, title, role)) {
      family.fathers.push(display)
      continue
    }

    if (isSibling(category, title, role) || category === "family" || category === "siblings") {
      family.siblings.push(display)
      continue
    }

    unmatched.push(member)
  }

  for (const member of unmatched) {
    family.siblings.push(toDisplayMember(member))
  }

  return family
}

function renderPairedRows(
  leftItems: DisplayMember[],
  rightItems: DisplayMember[],
  isVisible: boolean,
  rowOffset = 0,
  showRole = false
) {
  const maxLen = Math.max(leftItems.length, rightItems.length)
  const rows = []

  for (let i = 0; i < maxLen; i++) {
    const left = leftItems[i]
    const right = rightItems[i]
    rows.push(
      <React.Fragment key={`pair-row-${rowOffset + i}`}>
        <div className="px-1 sm:px-1.5 md:px-2">
          {left ? (
            <NameItem
              member={left}
              align="right"
              showRole={showRole}
              isVisible={isVisible}
              delayMs={(rowOffset + i) * 50}
            />
          ) : (
            <div className="py-0.5" aria-hidden />
          )}
        </div>
        <div className="px-1 sm:px-1.5 md:px-2">
          {right ? (
            <NameItem
              member={right}
              align="left"
              showRole={showRole}
              isVisible={isVisible}
              delayMs={(rowOffset + i) * 50 + 25}
            />
          ) : (
            <div className="py-0.5" aria-hidden />
          )}
        </div>
      </React.Fragment>
    )
  }

  return rows
}

function FamilySection({
  family,
  isVisible,
}: {
  family: FamilyGroup
  isVisible: boolean
}) {
  const hasParents = family.mothers.length > 0 || family.fathers.length > 0
  const hasSiblings = family.siblings.length > 0

  if (!hasParents && !hasSiblings) return null

  const parentRows = Math.max(family.mothers.length, family.fathers.length)

  return (
    <div className="max-w-2xl mx-auto">
      <BlockHeading className="mt-3 sm:mt-4 md:mt-5">Family</BlockHeading>

      {hasParents ? (
        <TwoColumnLayout leftTitle="Mother" rightTitle="Father">
          {renderPairedRows(family.mothers, family.fathers, isVisible, 0, false)}
        </TwoColumnLayout>
      ) : null}

      {hasSiblings ? (
        <div
          className={hasParents ? "mt-3 sm:mt-3.5 pt-2.5 sm:pt-3 border-t" : ""}
          style={{ borderColor: "rgba(201,168,108,0.20)" }}
        >
          <SectionTitle>Siblings</SectionTitle>
          {family.siblings.length <= 2 ? (
            <div className="max-w-sm mx-auto flex flex-col items-center gap-0.5 sm:gap-1">
              {family.siblings.map((member, index) => (
                <NameItem
                  key={`sibling-${member.name}-${index}`}
                  member={member}
                  align="center"
                  showRole={Boolean(member.roleTitle)}
                  isVisible={isVisible}
                  delayMs={(parentRows + index) * 50}
                />
              ))}
            </div>
          ) : (
            <div className={GRID_TWO_COL}>
              {(() => {
                const half = Math.ceil(family.siblings.length / 2)
                const left = family.siblings.slice(0, half)
                const right = family.siblings.slice(half)
                return renderPairedRows(left, right, isVisible, parentRows, true)
              })()}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

function GodparentsSection({
  sponsors,
  isVisible,
  rowOffset = 0,
}: {
  sponsors: PrincipalSponsor[]
  isVisible: boolean
  rowOffset?: number
}) {
  if (sponsors.length === 0) return null

  const leftItems: DisplayMember[] = sponsors.map((s) => ({
    name: s.MalePrincipalSponsor,
  }))
  const rightItems: DisplayMember[] = sponsors.map((s) => ({
    name: s.FemalePrincipalSponsor,
  }))

  return (
    <div className="max-w-2xl mx-auto">
      <BlockHeading>My God Parents</BlockHeading>
      <TwoColumnLayout leftTitle="Ninong" rightTitle="Ninang">
        {renderPairedRows(leftItems, rightItems, isVisible, rowOffset, false)}
      </TwoColumnLayout>
    </div>
  )
}

export function Entourage() {
  const [family, setFamily] = useState<FamilyGroup>(mapStaticFamily())
  const [sponsors, setSponsors] = useState<PrincipalSponsor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [entourageData, sponsorsData] = await Promise.all([
        fetchGoogleScript<unknown>("entourage").catch(() => []),
        fetchGoogleScript<unknown>("sponsors").catch(() => []),
      ])

      const members = normalizeEntourageList(entourageData)
      const parsedFamily = members.length > 0 ? parseFamilyMembers(members) : mapStaticFamily()

      const hasFamilyData =
        parsedFamily.mothers.length > 0 ||
        parsedFamily.fathers.length > 0 ||
        parsedFamily.siblings.length > 0

      setFamily(hasFamilyData ? parsedFamily : mapStaticFamily())

      const sponsorList = normalizeSponsorList(sponsorsData)
      setSponsors(sponsorList.length > 0 ? sponsorList : mapStaticSponsors())
    } catch {
      setFamily(mapStaticFamily())
      setSponsors(mapStaticSponsors())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const handleUpdate = () => setTimeout(fetchData, 1000)
    window.addEventListener("entourageUpdated", handleUpdate)
    return () => window.removeEventListener("entourageUpdated", handleUpdate)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.06 }
    )
    const node = sectionRef.current
    if (node) observer.observe(node)
    return () => {
      if (node) observer.unobserve(node)
    }
  }, [])

  const familyRowCount =
    Math.max(family.mothers.length, family.fathers.length) + family.siblings.length

  const hasFamily =
    family.mothers.length > 0 || family.fathers.length > 0 || family.siblings.length > 0
  const hasGodparents = sponsors.length > 0

  return (
    <section
      ref={sectionRef}
      id="entourage"
      className="relative overflow-hidden py-12 sm:py-20 md:py-24"
      style={{
        background: `linear-gradient(175deg, ${C.ivory} 0%, ${C.champagne} 32%, ${C.blushSoft} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 15%, rgba(255,253,249,0.92) 0%, transparent 70%),
            radial-gradient(ellipse 35% 28% at 10% 85%, rgba(245,221,224,0.38) 0%, transparent 70%),
            radial-gradient(ellipse 35% 28% at 90% 80%, rgba(232,196,204,0.30) 0%, transparent 70%)
          `,
        }}
      />

      <ChristeningParticles scoped opacity={0.35} />
      <CornerFloralDecor opacity={0.72} sizeClass="w-24 sm:w-36 md:w-44 lg:w-52" />

      <div
        className={`relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-7 sm:mb-10 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p
          style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.62rem, 2.3vw, 0.82rem)",
            fontWeight: 600,
            letterSpacing: "0.30em",
            textTransform: "uppercase",
            color: C.goldDeep,
            marginBottom: "0.55rem",
            paddingRight: "0.30em",
          }}
        >
          Guided by Faith &amp; Love
        </p>

        <h2
          style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            fontSize: "clamp(1.55rem, 7vw, 3.2rem)",
            color: C.roseDeep,
            lineHeight: 1.12,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
          }}
        >
          Family &amp; Godparents
        </h2>

        <p
          style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontSize: "clamp(0.92rem, 3vw, 1.04rem)",
            color: text.body,
            lineHeight: 1.75,
            maxWidth: "34rem",
            margin: "0.85rem auto 0",
            paddingInline: "0.25rem",
          }}
        >
          Surrounded by the love of family and the guidance of godparents who will walk with me in
          faith.
        </p>
      </div>

      <div
        className={`relative z-10 max-w-4xl mx-auto px-3 sm:px-5 pb-2 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden isolate" style={cardStyle}>
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background: `radial-gradient(ellipse 85% 45% at 50% 0%, rgba(245,221,224,0.35) 0%, transparent 65%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-[1px] rounded-[inherit]"
            aria-hidden
            style={{ border: "1px solid rgba(201,168,108,0.18)" }}
          />

          {isLoading ? (
            <div className="relative p-4 sm:p-5 md:p-6 space-y-4">
              {Array.from({ length: 2 }).map((_, section) => (
                <div key={section} className="space-y-3">
                  <div
                    className="h-8 rounded-lg mx-auto animate-pulse"
                    style={{ width: "45%", background: C.blushSoft }}
                  />
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-5 rounded-lg animate-pulse mx-auto"
                        style={{ width: `${78 + (i % 3) * 6}%`, background: C.blushSoft }}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-center pt-2 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: C.goldDeep }} />
                <span
                  style={{
                    fontFamily: '"Fahkwang", sans-serif',
                    fontSize: "clamp(0.84rem, 2.8vw, 0.92rem)",
                    color: text.caption,
                    fontStyle: "italic",
                  }}
                >
                  Loading family &amp; godparents…
                </span>
              </div>
            </div>
          ) : (
            <div
              className="relative space-y-1 sm:space-y-2"
              style={{
                padding: "clamp(0.85rem, 3vw, 1.25rem) clamp(0.75rem, 2.8vw, 1.15rem)",
              }}
            >
              <FamilySection family={family} isVisible={isVisible} />

              {hasFamily && hasGodparents ? <SectionDivider /> : null}

              <GodparentsSection
                sponsors={sponsors}
                isVisible={isVisible}
                rowOffset={familyRowCount}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
