"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { principalSponsors as staticSponsors } from "@/content/site"
import { Loader2 } from "lucide-react"
import { C, text } from "@/components/loader/christening-theme"
import { CornerFloralDecor } from "@/components/loader/ChristeningDecor"
import { ChristeningParticles } from "@/components/loader/ChristeningParticles"

const cardStyle = {
  background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 48%, ${C.champagne} 100%)`,
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
} as const

interface PrincipalSponsor {
  MalePrincipalSponsor: string
  FemalePrincipalSponsor: string
}

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
  fontSize: "clamp(0.82rem, 2.6vw, 0.96rem)",
  color: text.body,
  lineHeight: 1.7,
  fontWeight: 500,
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
  className = "",
}: {
  title: string
  names: string[]
  isVisible: boolean
  rowOffset?: number
  className?: string
}) {
  if (names.length === 0) return null

  return (
    <div className={`text-center ${className}`}>
      <h3
        style={{
          fontFamily: '"LeJourScript", cursive',
          fontSize: "clamp(1.5rem, 5vw, 2.4rem)",
          color: C.roseDeep,
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
    const node = sectionRef.current
    if (node) observer.observe(node)
    return () => { if (node) observer.unobserve(node) }
  }, [])

  const { ninongs, ninangs } = splitSponsors(sponsors)

  return (
    <section
      ref={sectionRef}
      id="entourage"
      className="relative overflow-hidden py-14 sm:py-20 md:py-24"
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

      {/* Section header */}
      <div
        className={`relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-8 sm:mb-10 text-center transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p style={{
          fontFamily: '"Cinzel", serif',
          fontSize: "clamp(0.65rem, 2.4vw, 0.82rem)",
          fontWeight: 600,
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color: C.goldDeep,
          marginBottom: "0.6rem",
          paddingRight: "0.36em",
        }}>
          Guided by Faith &amp; Love
        </p>

        <h2 style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          fontSize: "clamp(1.8rem, 7.5vw, 3.2rem)",
          color: C.roseDeep,
          lineHeight: 1.1,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          My Godparents
        </h2>

        <p style={{
          fontFamily: '"Fahkwang", sans-serif',
          fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
          color: text.body,
          lineHeight: 1.8,
          maxWidth: "36rem",
          margin: "0.9rem auto 0",
        }}>
          Mommy and Daddy chose these wonderful people to guide me with love, faith, and prayers as I grow.
        </p>
      </div>

      {/* Sponsors card */}
      <div
        className={`relative z-10 max-w-4xl mx-auto px-3 sm:px-5 pb-2 transition-all duration-1000 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="relative rounded-3xl overflow-hidden isolate" style={cardStyle}>
          <div
            className="pointer-events-none absolute inset-[1px] rounded-[inherit]"
            aria-hidden
            style={{ border: "1px solid rgba(201,168,108,0.18)" }}
          />

          {isLoading ? (
            <div className="relative p-5 sm:p-7 md:p-9 space-y-6">
              {Array.from({ length: 2 }).map((_, section) => (
                <div key={section} className="space-y-3">
                  <div className="h-8 rounded-lg mx-auto animate-pulse" style={{ width: "45%", background: C.blushSoft }} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="h-5 rounded-lg animate-pulse" style={{ width: `${70 + (i % 3) * 8}%`, background: C.blushSoft }} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex justify-center pt-2 gap-2">
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: C.goldDeep }} />
                <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "0.88rem", color: text.caption, fontStyle: "italic" }}>
                  Loading godparents…
                </span>
              </div>
            </div>
          ) : (
            <div className="relative p-4 sm:p-6 md:p-8 space-y-10 sm:space-y-12">
              <GodparentSection
                title="My Ninangs"
                names={ninangs}
                isVisible={isVisible}
                rowOffset={0}
                className="mt-8 sm:mt-10 md:mt-12"
              />

              <GodparentSection
                title="My Ninongs"
                names={ninongs}
                isVisible={isVisible}
                rowOffset={ninangs.length}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
