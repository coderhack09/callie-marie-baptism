"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { principalSponsors as staticSponsors } from "@/content/site"
import { Loader2 } from "lucide-react"
import Image from "next/image"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP      = "#3D2810"
const MEDIUM    = "#8C6035"
const GOLD      = "#B8822A"
const BABY_BLUE = "#3FA3C8"
const IVORY     = "#FEF9F3"
const BLUSH     = "#EED4BC"

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 380, h: 380, top: "4%",  left: "2%",  color: BABY_BLUE, opacity: 0.09, blur: 100 },
    { w: 260, h: 260, top: "18%", left: "70%", color: GOLD,      opacity: 0.09, blur: 80  },
    { w: 300, h: 300, top: "55%", left: "8%",  color: BLUSH,     opacity: 0.12, blur: 90  },
    { w: 220, h: 220, top: "70%", left: "76%", color: BABY_BLUE, opacity: 0.09, blur: 70  },
    { w: 170, h: 170, top: "38%", left: "44%", color: GOLD,      opacity: 0.07, blur: 60  },
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
  const maxRows = Math.max(ninongs.length, ninangs.length)

  return (
    <div className="relative w-full overflow-hidden">

      {/* Solid ivory base */}
      <div className="absolute inset-0 -z-10" style={{ background: IVORY }} />

      {/* Multi-stop tinted vertical gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(180deg,
          rgba(215,237,248,0.50) 0%,
          rgba(251,244,234,0.0)  22%,
          rgba(213,238,248,0.32) 50%,
          rgba(251,244,234,0.0)  75%,
          rgba(238,212,188,0.38) 100%
        )`,
      }} />

      {/* Diagonal warm-to-cool wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(105deg, rgba(238,212,188,0.18) 0%, transparent 40%, rgba(213,238,248,0.18) 100%)`,
      }} />

      {/* Fine diagonal shimmer */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `repeating-linear-gradient(
          125deg,
          transparent 0px,
          transparent 160px,
          rgba(255,255,255,0.22) 160px,
          rgba(255,255,255,0.22) 162px
        )`,
      }} />

      {/* Soft dot grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(63,163,200,0.09) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      {/* Corner radial accent glows */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden style={{
        background: `
          radial-gradient(ellipse 50% 40% at 0%   0%,   rgba(213,238,248,0.35) 0%, transparent 60%),
          radial-gradient(ellipse 40% 35% at 100% 0%,   rgba(238,212,188,0.28) 0%, transparent 55%),
          radial-gradient(ellipse 45% 38% at 0%   100%, rgba(238,212,188,0.25) 0%, transparent 55%),
          radial-gradient(ellipse 40% 35% at 100% 100%, rgba(213,238,248,0.30) 0%, transparent 55%)
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
          {/* Eyebrow label */}
          <p className="garamond uppercase mb-1" style={{ fontSize: "clamp(0.52rem, 1.8vw, 0.66rem)", letterSpacing: "0.48em", color: BABY_BLUE }}>
            Principal Sponsors
          </p>

          {/* Ornament divider */}
          <div className="flex items-center justify-center gap-3 my-2">
            <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to left, rgba(126,200,227,0.4), transparent)` }} />
            <span style={{ color: BABY_BLUE, fontSize: "7px", opacity: 0.75 }}>✦</span>
            <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to right, rgba(126,200,227,0.4), transparent)` }} />
          </div>

          {/* Main title two-column layout */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center mt-3">
            {/* Ninong side */}
            <div className="text-right pr-3 sm:pr-5">
              <p className="garamond uppercase mb-1" style={{ fontSize: "clamp(0.50rem, 1.6vw, 0.60rem)", letterSpacing: "0.38em", color: BABY_BLUE, paddingRight: "0.38em" }}>
                Male Sponsors
              </p>
              <p className="gistesy" style={{ fontSize: "clamp(1.8rem, 6vw, 3.2rem)", color: DEEP, lineHeight: 1.0, overflow: "visible" }}>
                Ninong
              </p>
            </div>

            {/* Center ornament */}
            <div className="flex flex-col items-center gap-1.5 px-3 sm:px-4">
              <div className="w-px h-6" style={{ background: `linear-gradient(to bottom, transparent, ${BABY_BLUE}55)` }} />
              <span style={{ color: BABY_BLUE, fontSize: "8px", opacity: 0.75 }}>✦</span>
              <div className="w-px h-6" style={{ background: `linear-gradient(to top, transparent, ${BABY_BLUE}55)` }} />
            </div>

            {/* Ninang side */}
            <div className="text-left pl-3 sm:pl-5">
              <p className="garamond uppercase mb-1" style={{ fontSize: "clamp(0.50rem, 1.6vw, 0.60rem)", letterSpacing: "0.38em", color: BABY_BLUE }}>
                Female Sponsors
              </p>
              <p className="gistesy" style={{ fontSize: "clamp(1.8rem, 6vw, 3.2rem)", color: DEEP, lineHeight: 1.0, overflow: "visible" }}>
                Ninang
              </p>
            </div>
          </div>

          {/* Subtitle */}
          <p className="garamond mt-4 max-w-lg mx-auto" style={{ fontSize: "clamp(0.78rem, 2.4vw, 0.90rem)", color: `${DEEP}99`, lineHeight: 1.75, fontStyle: "italic" }}>
            Those who walk with us in faith, guiding little Kaezar with their love and prayers.
          </p>
        </div>

        {/* ── Sponsors Card ───────────────────────────────────────────── */}
        <div
          className={`relative z-30 max-w-3xl mx-auto px-3 sm:px-5 pb-6 transition-all duration-1000 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "rgba(254,249,243,0.90)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(184,130,42,0.22)",
              boxShadow: "0 20px 56px rgba(61,40,16,0.13), 0 4px 16px rgba(61,40,16,0.06)",
            }}
          >
            {isLoading ? (
              /* ── Loading skeleton ── */
              <div className="p-5 sm:p-7 md:p-9 space-y-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-[1fr_24px_1fr] gap-x-2 animate-pulse">
                    <div className="h-5 rounded-lg ml-auto" style={{ width: `${55 + (i % 3) * 12}%`, background: "rgba(63,163,200,0.12)" }} />
                    <div />
                    <div className="h-5 rounded-lg" style={{ width: `${50 + (i % 4) * 10}%`, background: "rgba(63,163,200,0.12)" }} />
                  </div>
                ))}
                <div className="flex justify-center pt-4 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: BABY_BLUE, opacity: 0.5 }} />
                  <span className="garamond" style={{ fontSize: "0.82rem", color: MEDIUM, fontStyle: "italic" }}>Loading sponsors…</span>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-6 md:p-8">

                {/* Column sub-headers inside card */}
                <div className="grid grid-cols-[1fr_28px_1fr] mb-3">
                  {/* <p className="garamond text-right pr-3 sm:pr-5 uppercase"
                    style={{ fontSize: "clamp(0.48rem, 1.5vw, 0.58rem)", letterSpacing: "0.36em", color: `${BABY_BLUE}bb`, paddingRight: "0.36em" }}>
                    Ninong
                  </p> */}
                  <div />
                  {/* <p className="garamond text-left pl-3 sm:pl-5 uppercase"
                    style={{ fontSize: "clamp(0.48rem, 1.5vw, 0.58rem)", letterSpacing: "0.36em", color: `${BABY_BLUE}bb` }}>
                    Ninang
                  </p> */}
                </div>

                {/* Thin divider below sub-headers */}
                <div className="h-px mb-3" style={{ background: `linear-gradient(to right, transparent, rgba(63,163,200,0.20), transparent)` }} />

                {/* Names grid */}
                <div className="grid grid-cols-[1fr_28px_1fr] gap-y-0">
                  {Array.from({ length: maxRows }).map((_, i) => {
                    const ninong = ninongs[i]
                    const ninang = ninangs[i]
                    const delay = `${Math.min(i * 45, 900)}ms`

                    return (
                      <React.Fragment key={i}>
                        {/* Ninong cell */}
                        <div
                          className="text-right pr-3 sm:pr-5 py-2 sm:py-2.5 rounded-l-xl transition-all duration-700"
                          style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "none" : "translateX(-12px)",
                            transitionDelay: delay,
                          }}
                        >
                          {ninong ? (
                            <p className="garamond" style={{ fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: DEEP, lineHeight: 1.55, fontWeight: 500 }}>
                              {ninong}
                            </p>
                          ) : <div className="h-6" />}
                        </div>

                        {/* Center divider */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-px h-full" style={{ background: `rgba(63,163,200,0.15)` }} />
                        </div>

                        {/* Ninang cell */}
                        <div
                          className="text-left pl-3 sm:pl-5 py-2 sm:py-2.5 rounded-r-xl transition-all duration-700"
                          style={{
                            opacity: isVisible ? 1 : 0,
                            transform: isVisible ? "none" : "translateX(12px)",
                            transitionDelay: delay,
                          }}
                        >
                          {ninang ? (
                            <p className="garamond" style={{ fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: DEEP, lineHeight: 1.55, fontWeight: 500 }}>
                              {ninang}
                            </p>
                          ) : <div className="h-6" />}
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>

                {/* Footer ornament */}
                <div className="flex items-center gap-3 mt-6 sm:mt-7">
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD}55)` }} />
                  <span style={{ color: GOLD, fontSize: "7px", opacity: 0.65 }}>✦</span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${GOLD}55)` }} />
                </div>

              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
