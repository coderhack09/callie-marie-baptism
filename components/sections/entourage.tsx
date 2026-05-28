"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { principalSponsors as staticSponsors } from "@/content/site"
import { Loader2 } from "lucide-react"
import Image from "next/image"

// ── Palette — aligned with loader/Hero.tsx ────────────────────────────────────
const DARK_NAVY   = "#1C3050"
const GOLD        = "#C4965A"
const NAVY_MUTE   = "rgba(65,90,115,0.78)"

const FROSTED_CARD = {
  background: "rgba(255,255,255,0.30)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1.5px solid rgba(43,74,107,0.22)",
  boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
} as const

function OrnamentDivider({ width = "240px" }: { width?: string }) {
  return (
    <div className="flex items-center justify-center gap-2" style={{ maxWidth: width, margin: "0 auto" }}>
      <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
      <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)", flexShrink: 0 }} />
      <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
    </div>
  )
}

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 380, h: 380, top: "4%",  left: "2%",  color: "rgba(120,175,215,1)", opacity: 0.08, blur: 100 },
    { w: 260, h: 260, top: "18%", left: "70%", color: "rgba(196,152,88,1)",  opacity: 0.08, blur: 80  },
    { w: 300, h: 300, top: "55%", left: "8%",  color: "rgba(196,152,88,1)",  opacity: 0.07, blur: 90  },
    { w: 220, h: 220, top: "70%", left: "76%", color: "rgba(120,175,215,1)", opacity: 0.08, blur: 70  },
    { w: 170, h: 170, top: "38%", left: "44%", color: "rgba(196,152,88,1)",  opacity: 0.06, blur: 60  },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {orbs.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.w, height: o.h,
            top: o.top, left: o.left,
            background: o.color,
            opacity: o.opacity,
            filter: `blur(${o.blur}px)`,
          }}
        />
      ))}
    </div>
  )
}

interface PrincipalSponsor {
  MalePrincipalSponsor: string
  FemalePrincipalSponsor: string
}

/** Returns true if a name appears to carry a female title */
function isFemaleTitle(name: string): boolean {
  return /^(Mrs\.|Dra\.|Miss\b|Ma\.\s|Vice\s|Madam\b)/i.test(name.trim())
}

function mapStaticSponsors(): PrincipalSponsor[] {
  return staticSponsors
    .filter((s) => s.name || s.spouse)
    .map(({ name, spouse }) => ({
      MalePrincipalSponsor: name || "",
      FemalePrincipalSponsor: spouse || "",
    }))
}

/** Separate raw sponsor pairs into two flat lists: Ninong and Ninang */
function splitSponsors(sponsors: PrincipalSponsor[]): {
  ninongs: string[]
  ninangs: string[]
} {
  const ninongs: string[] = []
  const ninangs: string[] = []

  for (const s of sponsors) {
    const male = s.MalePrincipalSponsor.trim()
    const female = s.FemalePrincipalSponsor.trim()

    if (male) {
      if (isFemaleTitle(male)) {
        ninangs.push(male)
      } else {
        ninongs.push(male)
      }
    }
    if (female) {
      ninangs.push(female)
    }
  }

  return { ninongs, ninangs }
}

/** Split a flat name list into left/right columns; odd count centers the last name */
function splitIntoTwoColumns(names: string[]): {
  left: string[]
  right: string[]
  center?: string
} {
  if (names.length === 0) return { left: [], right: [] }
  if (names.length % 2 === 1) {
    const center = names[names.length - 1]
    const rest = names.slice(0, -1)
    const mid = rest.length / 2
    return { left: rest.slice(0, mid), right: rest.slice(mid), center }
  }
  const mid = names.length / 2
  return { left: names.slice(0, mid), right: names.slice(mid) }
}

const NAME_STYLE = {
  fontFamily: '"Fahkwang", sans-serif',
  fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)",
  color: DARK_NAVY,
  lineHeight: 1.65,
} as const

function GodparentNameGrid({
  names,
  isVisible,
  rowOffset = 0,
}: {
  names: string[]
  isVisible: boolean
  rowOffset?: number
}) {
  const { left, right, center } = splitIntoTwoColumns(names)
  const maxRows = Math.max(left.length, right.length)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-0">
        <div className="text-center sm:text-left space-y-2 sm:space-y-2.5">
          {left.map((name, i) => (
            <p
              key={`l-${name}-${i}`}
              className="transition-all duration-700"
              style={{
                ...NAME_STYLE,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "none" : "translateY(8px)",
                transitionDelay: `${Math.min((rowOffset + i) * 40, 900)}ms`,
              }}
            >
              {name}
            </p>
          ))}
        </div>
        <div className="text-center sm:text-left space-y-2 sm:space-y-2.5">
          {right.map((name, i) => (
            <p
              key={`r-${name}-${i}`}
              className="transition-all duration-700"
              style={{
                ...NAME_STYLE,
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "none" : "translateY(8px)",
                transitionDelay: `${Math.min((rowOffset + left.length + i) * 40, 900)}ms`,
              }}
            >
              {name}
            </p>
          ))}
        </div>
      </div>
      {center ? (
        <p
          className="text-center transition-all duration-700"
          style={{
            ...NAME_STYLE,
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "none" : "translateY(8px)",
            transitionDelay: `${Math.min((rowOffset + maxRows) * 40, 900)}ms`,
          }}
        >
          {center}
        </p>
      ) : null}
    </div>
  )
}

function GodparentSection({
  title,
  names,
  isVisible,
  rowOffset = 0,
}: {
  title: string
  names: string[]
  isVisible: boolean
  rowOffset?: number
}) {
  if (names.length === 0) return null

  return (
    <div className="text-center">
      <h3
        style={{
          fontFamily: '"LeJourScript", cursive',
          fontSize: "clamp(1.5rem, 5vw, 2.4rem)",
          color: DARK_NAVY,
          lineHeight: 1.15,
          marginBottom: "1.25rem",
        }}
      >
        {title}
      </h3>
      <GodparentNameGrid names={names} isVisible={isVisible} rowOffset={rowOffset} />
    </div>
  )
}

export function Entourage() {
  const [sponsors, setSponsors] = useState<PrincipalSponsor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const fetchSponsors = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/principal-sponsor", { cache: "no-store" })
      if (!res.ok) throw new Error("Failed to load")
      const data: PrincipalSponsor[] = await res.json()
      const list =
        Array.isArray(data) && data.length > 0
          ? data.filter((s) => s.MalePrincipalSponsor || s.FemalePrincipalSponsor)
          : mapStaticSponsors()
      setSponsors(list)
    } catch {
      setSponsors(mapStaticSponsors())
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSponsors()
    const handleUpdate = () => setTimeout(fetchSponsors, 1000)
    window.addEventListener("entourageUpdated", handleUpdate)
    return () => window.removeEventListener("entourageUpdated", handleUpdate)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.06 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current) }
  }, [])

  const { ninongs, ninangs } = splitSponsors(sponsors)

  return (
    <div className="relative w-full overflow-hidden">

      {/* Solid base */}
      <div className="absolute inset-0 -z-10" style={{ background: "#FFFFFF" }} />

      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 45% at 50% 30%, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.6) 45%, transparent 75%)",
      }} />

      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "linear-gradient(to top, rgba(120,175,215,0.10) 0%, rgba(120,175,215,0.04) 25%, transparent 55%)",
      }} />

      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden style={{
        background: `
          radial-gradient(ellipse 50% 40% at 50% 28%, rgba(196,152,88,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 38% 32% at 50% 78%, rgba(120,175,215,0.08) 0%, transparent 65%)
        `,
      }} />

      <BokehOrbs />

      <section
        ref={sectionRef}
        id="entourage"
        className="relative z-10 py-12 md:py-16 lg:py-20 overflow-hidden"
      >
        {/* Corner florals */}
        <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
          <Image src="/decoration/left-top-removebg-preview.png"    alt="" width={180} height={180} className="absolute top-0 left-0  w-auto h-auto max-w-[100px] sm:max-w-[140px] md:max-w-[180px] opacity-40" />
          <Image src="/decoration/right-top-removebg-preview.png"   alt="" width={180} height={180} className="absolute top-0 right-0 w-auto h-auto max-w-[100px] sm:max-w-[140px] md:max-w-[180px] opacity-40" />
          <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={180} height={180} className="absolute bottom-0 left-0  w-auto h-auto max-w-[100px] sm:max-w-[140px] md:max-w-[180px] opacity-40" />
          <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={180} height={180} className="absolute bottom-0 right-0 w-auto h-auto max-w-[100px] sm:max-w-[140px] md:max-w-[180px] opacity-40" />
        </div>

        {/* ── Section header ──────────────────────────────────────────── */}
        <div
          className={`relative z-30 max-w-3xl mx-auto px-4 sm:px-6 mb-7 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <OrnamentDivider />

          <h2
            className="mt-4"
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 600,
              fontSize: "clamp(1.6rem, 7vw, 3.2rem)",
              color: NAVY_MUTE,
              lineHeight: 1.1,
              letterSpacing: "0.02em",
            }}>
            My Godparents
          </h2>

          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
            color: NAVY_MUTE,
            lineHeight: 1.75,
            maxWidth: "36rem",
            margin: "1rem auto 0",
          }}>
            Mommy and Daddy chose these wonderful people to guide me with love, faith, and prayers as I grow.
          </p>
        </div>

        {/* ── Sponsors Card ───────────────────────────────────────────── */}
        <div
          className={`relative z-30 max-w-4xl mx-auto px-3 sm:px-5 pb-6 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={FROSTED_CARD}
          >
            {isLoading ? (
              <div className="p-5 sm:p-7 md:p-9 space-y-6">
                {Array.from({ length: 2 }).map((_, section) => (
                  <div key={section} className="space-y-3">
                    <div className="h-8 rounded-lg mx-auto animate-pulse" style={{ width: "45%", background: "rgba(43,74,107,0.08)" }} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-5 rounded-lg animate-pulse" style={{ width: `${70 + (i % 3) * 8}%`, background: "rgba(43,74,107,0.08)" }} />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="flex justify-center pt-2 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD, opacity: 0.65 }} />
                  <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "0.82rem", color: NAVY_MUTE, fontStyle: "italic" }}>Loading godparents…</span>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6 md:p-8 space-y-10 sm:space-y-12">

                <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

                <GodparentSection
                  title="My Ninangs"
                  names={ninangs}
                  isVisible={isVisible}
                  rowOffset={0}
                />

                {ninangs.length > 0 && ninongs.length > 0 && (
                  <div className="py-1">
                    <OrnamentDivider width="100%" />
                  </div>
                )}

                <GodparentSection
                  title="My Ninongs"
                  names={ninongs}
                  isVisible={isVisible}
                  rowOffset={ninangs.length}
                />

                <div className="pt-2">
                  <OrnamentDivider width="100%" />
                </div>

              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
