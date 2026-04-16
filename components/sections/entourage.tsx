"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { principalSponsors as staticSponsors } from "@/content/site"
import { Loader2 } from "lucide-react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"

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
      // If the "male" slot actually has a female title, put in Ninang instead
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
      { threshold: 0.08 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current) }
  }, [])

  const { ninongs, ninangs } = splitSponsors(sponsors)
  const maxRows = Math.max(ninongs.length, ninangs.length)

  return (
    <div className="relative w-full" style={{ backgroundColor: "var(--color-motif-cream)" }}>
      {/* Background wash */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            background:
              "linear-gradient(145deg, var(--color-motif-cream) 0%, color-mix(in srgb, var(--color-motif-silver) 14%, transparent) 40%, color-mix(in srgb, var(--color-motif-medium) 6%, transparent) 75%, var(--color-motif-cream) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{ background: "radial-gradient(ellipse 70% 45% at 50% 12%, var(--color-motif-soft) 0%, transparent 60%)" }}
        />
      </div>

      <section
        ref={sectionRef}
        id="entourage"
        className="relative z-10 py-10 md:py-14 lg:py-16 overflow-hidden"
      >
        {/* Corner florals */}
        {/* <div className="absolute inset-0 pointer-events-none z-[1]">
          {(["scaleY(-1)", "scaleX(-1) scaleY(-1)", "", "scaleX(-1)"] as const).map((tfm, i) => (
            <CloudinaryImage
              key={i}
              src="/decoration/flower-decoration-left-bottom-corner2.png"
              alt=""
              width={300}
              height={300}
              className={`absolute w-auto h-auto max-w-[130px] sm:max-w-[170px] md:max-w-[210px] opacity-50 ${
                i === 0 ? "top-0 left-0" :
                i === 1 ? "top-0 right-0" :
                i === 2 ? "bottom-0 left-0" :
                          "bottom-0 right-0"
              }`}
              style={{ transform: tfm || undefined }}
              priority={false}
            />
          ))}
        </div> */}

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div
          className={`relative z-30 text-center mb-6 sm:mb-8 md:mb-10 px-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          {/* Eyebrow */}
          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.56rem, 2.2vw, 0.72rem)",
              letterSpacing: "0.48em",
              textTransform: "uppercase",
              color: ACCENT,
              marginBottom: "0.45rem",
              paddingRight: "0.48em",
            }}
          >
            Guided by Love and Faith
          </p>

          {/* Ornament */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className="h-px w-8 sm:w-12"
              style={{ background: "linear-gradient(to left, rgba(207,160,107,0.4), transparent)" }}
            />
            <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.7 }}>✦</span>
            <div
              className="h-px w-8 sm:w-12"
              style={{ background: "linear-gradient(to right, rgba(207,160,107,0.4), transparent)" }}
            />
          </div>

          {/* Title */}
          <h2
            className="gistesy"
            style={{
              fontSize: "clamp(2.4rem, 10vw, 5rem)",
              color: DEEP,
              lineHeight: 1.15,
              overflow: "visible",
              paddingTop: "0.15em",
              marginBottom: "0.4rem",
              textShadow: "0 2px 24px rgba(139,111,90,0.10)",
            }}
          >
            Godparents
          </h2>

          {/* Tagline */}
          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.78rem, 2.8vw, 0.96rem)",
              color: MEDIUM,
              fontStyle: "italic",
              lineHeight: 1.85,
              maxWidth: "460px",
              margin: "0 auto clamp(0.6rem, 2vw, 1rem)",
            }}
          >
            The ninongs and ninangs who lovingly stand as witnesses to Niahna Celestine’s baptism, offering their prayers, guidance, and lifelong support as she begins her journey in faith.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(to left, rgba(207,160,107,0.45), transparent)" }} />
            <span style={{ color: "#D4B896", fontSize: "5px" }}>◆</span>
            <div className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(to right, rgba(207,160,107,0.45), transparent)" }} />
          </div>
        </div>

        {/* ── Sponsors Card ───────────────────────────────────────────── */}
        <div
          className={`relative z-30 max-w-3xl mx-auto px-3 sm:px-5 transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div
            className="relative rounded-xl sm:rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,247,240,0.92)",
              boxShadow: "0 18px 48px rgba(139,111,90,0.14)",
              border: `1px solid rgba(207,160,107,0.22)`,
              backdropFilter: "blur(12px)",
            }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center gap-4 py-24">
                <Loader2 className="h-10 w-10 animate-spin opacity-60" style={{ color: DEEP }} />
                <span className="garamond" style={{ fontSize: "0.9rem", color: MEDIUM, fontStyle: "italic" }}>
                  Loading sponsors…
                </span>
              </div>
            ) : (
              <div className="p-4 sm:p-6 md:p-8">

                {/* Column headers */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-4 sm:mb-5">
                  {/* Ninong header */}
                  <div className="text-right pr-3 sm:pr-5">
                    {/* <p
                      className="garamond"
                      style={{
                        fontSize: "clamp(0.55rem, 1.8vw, 0.68rem)",
                        letterSpacing: "0.38em",
                        textTransform: "uppercase",
                        color: ACCENT,
                        paddingRight: "0.38em",
                        marginBottom: "0.15rem",
                      }}
                    >
                      Male Sponsors
                    </p> */}
                    <p
                      className="gistesy"
                      style={{
                        fontSize: "clamp(1.6rem, 5.5vw, 2.6rem)",
                        color: DEEP,
                        lineHeight: 1.05,
                        overflow: "visible",
                        paddingTop: "0.05em",
                      }}
                    >
                      Ninong
                    </p>
                  </div>

                  {/* Center divider */}
                  <div className="flex flex-col items-center gap-1.5 px-2">
                    {/* <div className="w-px flex-1 min-h-[2rem]" style={{ background: `linear-gradient(to bottom, transparent, ${ACCENT}55, transparent)` }} />
                    <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.6 }}>✦</span>
                    <div className="w-px flex-1 min-h-[2rem]" style={{ background: `linear-gradient(to bottom, transparent, ${ACCENT}55, transparent)` }} /> */}
                  </div>

                  {/* Ninang header */}
                  <div className="text-left pl-3 sm:pl-5">
                    {/* <p
                      className="garamond"
                      style={{
                        fontSize: "clamp(0.55rem, 1.8vw, 0.68rem)",
                        letterSpacing: "0.38em",
                        textTransform: "uppercase",
                        color: ACCENT,
                        paddingRight: "0.38em",
                        marginBottom: "0.15rem",
                      }}
                    >
                      Female Sponsors
                    </p> */}
                    <p
                      className="gistesy"
                      style={{
                        fontSize: "clamp(1.6rem, 5.5vw, 2.6rem)",
                        color: DEEP,
                        lineHeight: 1.05,
                        overflow: "visible",
                        paddingTop: "0.05em",
                      }}
                    >
                      Ninang
                    </p>
                  </div>
                </div>

                {/* Thin separator */}
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  {/* <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.35))` }} />
                  <span style={{ color: "#D4B896", fontSize: "5px" }}>◆</span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, rgba(207,160,107,0.35))` }} /> */}
                </div>

                {/* Names grid */}
                <div className="grid grid-cols-[1fr_auto_1fr] gap-y-1">
                  {Array.from({ length: maxRows }).map((_, i) => {
                    const ninong = ninongs[i]
                    const ninang = ninangs[i]
                    return (
                      <React.Fragment key={i}>
                        {/* Ninong name */}
                        <div className="text-right pr-3 sm:pr-5 py-0.5 sm:py-1">
                          {ninong ? (
                            <p
                              className="garamond"
                              style={{
                                fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)",
                                color: DEEP,
                                lineHeight: 1.45,
                                fontWeight: 500,
                              }}
                            >
                              {ninong}
                            </p>
                          ) : (
                            <div />
                          )}
                        </div>

                        {/* Center line */}
                        <div className="flex justify-center">
                          <div className="w-px h-full" style={{ background: `rgba(207,160,107,0.15)` }} />
                        </div>

                        {/* Ninang name */}
                        <div className="text-left pl-3 sm:pl-5 py-0.5 sm:py-1">
                          {ninang ? (
                            <p
                              className="garamond"
                              style={{
                                fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)",
                                color: DEEP,
                                lineHeight: 1.45,
                                fontWeight: 500,
                              }}
                            >
                              {ninang}
                            </p>
                          ) : (
                            <div />
                          )}
                        </div>
                      </React.Fragment>
                    )
                  })}
                </div>

                {/* Footer ornament */}
                <div className="flex items-center gap-3 mt-5 sm:mt-6">
                  {/* <div className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.30))` }} />
                  <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.55 }}>✦</span>
                  <div className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, rgba(207,160,107,0.30))` }} /> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
