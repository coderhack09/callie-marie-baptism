"use client"

import { useState, useEffect } from "react"
import { Heart, RefreshCw, TrendingUp, Users, Calendar, Crown } from "lucide-react"
import Image from "next/image"

// ── Palette — aligned with entourage.tsx ──────────────────────────────────────
const DARK_NAVY = "#1C3050"
const GOLD      = "#C4965A"
const NAVY_MUTE = "rgba(65,90,115,0.78)"

const FROSTED_CARD = {
  background: "rgba(255,255,255,0.30)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1.5px solid rgba(43,74,107,0.22)",
  boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
} as const

const GUEST_CARD = {
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
          style={{ width: o.w, height: o.h, top: o.top, left: o.left, background: o.color, opacity: o.opacity, filter: `blur(${o.blur}px)` }}
        />
      ))}
    </div>
  )
}

interface Guest {
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

const CARDS_PER_VIEW = 4

export function BookOfGuests() {
  const [totalGuests, setTotalGuests]         = useState(0)
  const [rsvpCount, setRsvpCount]             = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([])
  const [isRefreshing, setIsRefreshing]       = useState(false)
  const [showIncrease, setShowIncrease]       = useState(false)
  const [currentIndex, setCurrentIndex]       = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [justEntered, setJustEntered]         = useState(false)

  const getInitials = (name: string) => {
    const w = name.trim().split(" ")
    return w.length >= 2
      ? (w[0][0] + w[w.length - 1][0]).toUpperCase()
      : name.substring(0, 2).toUpperCase()
  }

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "Recently"

  const fetchGuests = async (showLoading = false) => {
    if (showLoading) setIsRefreshing(true)
    try {
      const res = await fetch("/api/guests", { cache: "no-store" })
      if (!res.ok) throw new Error("fetch failed")
      const data: Guest[] = await res.json()
      const attending = data.filter((g) => g.status === "confirmed")
      const sorted = [...attending].sort((a, b) => {
        if (a.isVip && !b.isVip) return -1
        if (!a.isVip && b.isVip) return 1
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      })
      const total = attending.reduce((s, g) => s + (g.allowedGuests || 1), 0)
      if (total > totalGuests && totalGuests > 0) {
        setShowIncrease(true)
        setTimeout(() => setShowIncrease(false), 2000)
      }
      setTotalGuests(total)
      setRsvpCount(attending.length)
      setConfirmedGuests(sorted)
    } catch {
      // silent
    } finally {
      if (showLoading) setTimeout(() => setIsRefreshing(false), 500)
    }
  }

  const getVisibleGuests = () => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return confirmedGuests
    return Array.from({ length: CARDS_PER_VIEW }, (_, i) =>
      confirmedGuests[(currentIndex + i) % confirmedGuests.length]
    )
  }

  useEffect(() => {
    fetchGuests()
    const poll = setInterval(fetchGuests, 30000)
    const onRsvp = () => setTimeout(() => fetchGuests(true), 2000)
    window.addEventListener("rsvpUpdated", onRsvp)
    return () => { clearInterval(poll); window.removeEventListener("rsvpUpdated", onRsvp) }
  }, [totalGuests])

  useEffect(() => {
    if (confirmedGuests.length <= CARDS_PER_VIEW) return
    const iv = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((p) => { const n = p + CARDS_PER_VIEW; return n >= confirmedGuests.length ? 0 : n })
        setIsTransitioning(false)
        setJustEntered(true)
        setTimeout(() => setJustEntered(false), 1100)
      }, 600)
    }, 5000)
    return () => clearInterval(iv)
  }, [confirmedGuests.length])

  return (
    <div id="guests" className="relative w-full overflow-hidden">

      {/* Solid base — aligned with entourage */}
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

      {/* ── Corner floral decorations ── */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <Image src="/decoration/left-top-removebg-preview.png"    alt="" width={200} height={200} className="absolute top-0 left-0  w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
        <Image src="/decoration/right-top-removebg-preview.png"   alt="" width={200} height={200} className="absolute top-0 right-0 w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
        <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={200} height={200} className="absolute bottom-0 left-0  w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
        <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={200} height={200} className="absolute bottom-0 right-0 w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
      </div>

      {/* ── Section header — aligned with entourage ── */}
      <div className="relative z-10 text-center pt-12 sm:pt-16 pb-8 sm:pb-10 px-4 max-w-3xl mx-auto">

        <p style={{
          fontFamily: '"Cinzel", serif',
          fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
          letterSpacing: "0.40em",
          textTransform: "uppercase",
          color: "rgba(72,112,148,0.80)",
          marginBottom: "0.4rem",
          paddingRight: "0.40em",
        }}>
          Our Cherished Guests
        </p>

        <OrnamentDivider />

        <h2 style={{
          fontFamily: '"Cinzel", serif',
          fontSize: "clamp(1.6rem, 5.5vw, 2.8rem)",
          color: GOLD,
          lineHeight: 1.0,
          marginTop: "1rem",
          marginBottom: "0.5rem",
          filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
        }}>
          Book of Guests
        </h2>

        <p style={{
          fontFamily: '"Fahkwang", sans-serif',
          fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
          color: NAVY_MUTE,
          lineHeight: 1.75,
          fontStyle: "italic",
          maxWidth: "32rem",
          margin: "0.75rem auto 0",
        }}>
          Meet the cherished souls joining us in blessing Kaezar — your presence makes our day truly complete.
        </p>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CONTENT CONTAINER — stats + guest cards
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 pb-12 sm:pb-16">

        {/* ── Stats card ──────────────────────────────────────────────── */}
        <div className="text-center mb-7 sm:mb-9 px-4 sm:px-6">
          <div className="relative max-w-sm mx-auto">
            <div
              className="relative rounded-3xl px-5 py-6 sm:px-7 sm:py-7"
              style={FROSTED_CARD}
            >
              {/* Refresh button */}
              <button
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing}
                className="absolute top-3 right-3 p-1.5 rounded-full transition-all duration-300 disabled:opacity-50 hover:scale-110 group"
                style={{ background: "rgba(196,152,88,0.12)" }}
                title="Refresh"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 transition-transform duration-500 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`}
                  style={{ color: GOLD }}
                />
              </button>

              {/* Count */}
              <div className="flex items-center justify-center gap-2.5 mb-1.5">
                <span
                  style={{
                    fontFamily: '"LeJourScript", cursive',
                    fontSize: "clamp(2.4rem, 9vw, 3.6rem)",
                    color: GOLD,
                    lineHeight: 1,
                    transition: "transform 0.3s",
                    transform: showIncrease ? "scale(1.12)" : "scale(1)",
                    filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
                  }}
                >
                  {totalGuests}
                </span>
                {showIncrease && <TrendingUp className="h-5 w-5 animate-bounce" style={{ color: GOLD }} />}
                <div>
                  <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1.22rem, 2.4vw, 0.88rem)", color: DARK_NAVY, lineHeight: 1.25, fontWeight: 500 }}>
                    {totalGuests === 1 ? "Guest" : "Guests"}
                  </p>
                  <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                    Celebrating With Us
                  </p>
                </div>
              </div>

              <div className="h-px my-2.5 mx-6" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

              <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: NAVY_MUTE, marginBottom: "0.2rem" }}>
                {rsvpCount} {rsvpCount === 1 ? "RSVP entry" : "RSVP entries"}
              </p>
              <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, fontStyle: "italic", opacity: 0.85 }}>
                Thank you for confirming — your presence means the world to us.
              </p>
            </div>
          </div>
        </div>

        {/* ── Guest Cards ─────────────────────────────────────────────── */}
        {confirmedGuests.length > 0 && (
          <div className="max-w-2xl mx-auto px-3 sm:px-5">
            <div
              className={`space-y-3 sm:space-y-4 ${isTransitioning ? "animate-guest-roll-out" : ""}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {getVisibleGuests().map((guest, index) => (
                <div
                  key={`${guest.id}-${currentIndex}-${index}`}
                  className={`relative rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-xl ${justEntered ? "animate-guest-roll-in" : ""}`}
                  style={{
                    ...GUEST_CARD,
                    ...(justEntered ? { animationDelay: `${index * 120}ms`, backfaceVisibility: "hidden" } : {}),
                  }}
                >
                  <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

                  <div className="p-3 sm:p-4 md:p-5">

                    {/* ── Guest identity row ── */}
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                          style={{
                            background: GOLD,
                            boxShadow: "0 3px 12px rgba(196,152,88,0.30)",
                            width: "2.75rem",
                            height: "2.75rem",
                          }}
                        >
                          <span style={{ fontFamily: '"Cinzel", serif', color: "white", fontWeight: 500, fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)" }}>
                            {getInitials(guest.name)}
                          </span>
                        </div>
                        {guest.isVip && (
                          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow border-2 border-white">
                            <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white fill-current" />
                          </div>
                        )}
                      </div>

                      {/* Name + meta */}
                      <div className="flex-1 min-w-0">
                        <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: DARK_NAVY, fontWeight: 500, lineHeight: 1.55 }}>
                          {guest.name}
                        </h3>
                        {guest.role && (
                          <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                            {guest.role}
                          </p>
                        )}
                      </div>

                      {/* Guest count badge */}
                      <div
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full border flex-shrink-0"
                        style={{
                          background: "rgba(196,152,88,0.10)",
                          borderColor: "rgba(196,152,88,0.30)",
                        }}
                      >
                        <Users className="h-2.5 w-2.5" style={{ color: GOLD }} />
                        <span style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: DARK_NAVY, fontWeight: 500 }}>
                          {guest.allowedGuests}
                        </span>
                      </div>
                    </div>

              

                    {/* ── Companions ── */}
                    {guest.companions && guest.companions.length > 0 && (
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-3">
                        <span className="w-full" style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)", color: "rgba(72,112,148,0.80)", letterSpacing: "0.30em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                          Companions
                        </span>
                        {guest.companions.map((c, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
                            style={{ background: "rgba(196,152,88,0.08)", borderColor: "rgba(196,152,88,0.25)" }}
                          >
                            <span style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: DARK_NAVY, fontWeight: 500 }}>{c.name}</span>
                            {c.relationship && (
                              <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, fontStyle: "italic" }}>· {c.relationship}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Footer: date + heart ── */}
                    {/* <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t" style={{ borderColor: "rgba(43,74,107,0.12)" }}>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5 opacity-60" style={{ color: GOLD }} />
                        <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, opacity: 0.85 }}>
                          Confirmed {formatDate(guest.updatedAt)}
                        </span>
                      </div>
                      <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3" style={{ color: GOLD, opacity: 0.55 }} />
                    </div> */}
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel indicators */}
            {confirmedGuests.length > CARDS_PER_VIEW && (
              <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6">
                {Array.from({ length: Math.ceil(confirmedGuests.length / CARDS_PER_VIEW) }).map((_, idx) => {
                  const active = Math.floor(currentIndex / CARDS_PER_VIEW) === idx
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsTransitioning(true)
                        setTimeout(() => {
                          setCurrentIndex(idx * CARDS_PER_VIEW)
                          setIsTransitioning(false)
                          setJustEntered(true)
                          setTimeout(() => setJustEntered(false), 1100)
                        }, 600)
                      }}
                      className="h-1.5 sm:h-2 rounded-full transition-all duration-300"
                      style={{
                        width: active ? "1.75rem" : "0.5rem",
                        background: active ? GOLD : "rgba(196,152,88,0.35)",
                      }}
                      aria-label={`Page ${idx + 1}`}
                    />
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
