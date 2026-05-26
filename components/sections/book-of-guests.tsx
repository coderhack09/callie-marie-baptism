"use client"

import { useState, useEffect } from "react"
import { Heart, RefreshCw, TrendingUp, Users, Calendar, Crown, Sparkles } from "lucide-react"
import Image from "next/image"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP      = "#3D2810"
const MEDIUM    = "#8C6035"
const GOLD      = "#B8822A"
const BABY_BLUE = "#3FA3C8"
const BLUE_MID  = "#7BBEDD"
const IVORY     = "#FEF9F3"
const BLUSH     = "#EED4BC"

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 320, h: 320, top: "5%",  left: "3%",  color: BABY_BLUE, opacity: 0.08, blur: 90 },
    { w: 240, h: 240, top: "15%", left: "72%", color: GOLD,      opacity: 0.09, blur: 75 },
    { w: 280, h: 280, top: "58%", left: "6%",  color: BLUSH,     opacity: 0.11, blur: 85 },
    { w: 200, h: 200, top: "72%", left: "78%", color: BABY_BLUE, opacity: 0.08, blur: 65 },
    { w: 160, h: 160, top: "40%", left: "46%", color: GOLD,      opacity: 0.06, blur: 55 },
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

      {/* Solid ivory base */}
      <div className="absolute inset-0 -z-10" style={{ background: IVORY }} />

      {/* Multi-stop tinted vertical gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(180deg,
          rgba(213,238,248,0.48) 0%,
          rgba(251,244,234,0.0)  20%,
          rgba(213,238,248,0.30) 50%,
          rgba(251,244,234,0.0)  76%,
          rgba(238,212,188,0.36) 100%
        )`,
      }} />

      {/* Diagonal warm-to-cool wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(108deg, rgba(238,212,188,0.16) 0%, transparent 42%, rgba(213,238,248,0.16) 100%)`,
      }} />

      {/* Fine diagonal shimmer */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `repeating-linear-gradient(125deg, transparent 0px, transparent 160px, rgba(255,255,255,0.20) 160px, rgba(255,255,255,0.20) 162px)`,
      }} />

      {/* Soft dot grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(63,163,200,0.09) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      {/* Corner radial glows */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden style={{
        background: `
          radial-gradient(ellipse 50% 38% at 0%   0%,   rgba(213,238,248,0.32) 0%, transparent 60%),
          radial-gradient(ellipse 40% 34% at 100% 0%,   rgba(238,212,188,0.26) 0%, transparent 55%),
          radial-gradient(ellipse 44% 36% at 0%   100%, rgba(238,212,188,0.24) 0%, transparent 55%),
          radial-gradient(ellipse 40% 34% at 100% 100%, rgba(213,238,248,0.28) 0%, transparent 55%)
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

      {/* ══════════════════════════════════════════════════════════════
          SECTION HEADER — full-width, outside container
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 text-center pt-12 sm:pt-16 pb-8 sm:pb-10 px-4">

        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.56rem, 2.2vw, 0.68rem)",
            letterSpacing: "0.52em",
            textTransform: "uppercase",
            color: BABY_BLUE,
            marginBottom: "0.75rem",
            paddingRight: "0.52em",
          }}
        >
          Our Cherished Guests
        </p>

        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${GOLD}99, transparent)` }} />
          <span style={{ color: GOLD, fontSize: "9px", opacity: 0.9 }}>✦</span>
          <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${GOLD}99, transparent)` }} />
        </div>

        <h2
          className="gistesy"
          style={{
            fontSize: "clamp(2.6rem, 11vw, 5.5rem)",
            color: DEEP,
            lineHeight: 1.05,
            overflow: "visible",
            paddingTop: "0.1em",
            marginBottom: "0.6rem",
          }}
        >
          Book of Guests
        </h2>

        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to left, ${BLUE_MID}cc, transparent)` }} />
          <span style={{ color: BLUE_MID, fontSize: "5px", letterSpacing: "0.25em" }}>◆◆◆</span>
          <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to right, ${BLUE_MID}cc, transparent)` }} />
        </div>

        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.8rem, 2.8vw, 0.98rem)",
            color: MEDIUM,
            fontStyle: "italic",
            lineHeight: 1.9,
            maxWidth: "460px",
            margin: "0 auto",
          }}
        >
          Meet the cherished souls joining us in blessing Kaezar — your presence makes our day truly complete.
        </p>

        {/* Decorative sparkle row */}
        <div className="flex items-center justify-center gap-3 mt-5">
          <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to left, ${GOLD}55, transparent)` }} />
          <Sparkles className="h-3.5 w-3.5 opacity-60" style={{ color: GOLD }} />
          <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to right, ${GOLD}55, transparent)` }} />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CONTENT CONTAINER — stats + guest cards
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 pb-12 sm:pb-16">

        {/* ── Stats card ──────────────────────────────────────────────── */}
        <div className="text-center mb-7 sm:mb-9 px-4 sm:px-6">
          <div className="relative max-w-sm mx-auto">
            <div
              className="relative rounded-2xl px-5 py-6 sm:px-7 sm:py-7"
              style={{
                background: "rgba(254,249,243,0.92)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1.5px solid ${BABY_BLUE}50`,
                boxShadow: `0 10px 40px rgba(63,163,200,0.13), 0 2px 12px rgba(61,40,16,0.07), inset 0 1px 0 rgba(255,255,255,0.80)`,
              }}
            >
              {/* Corner accent dots */}
              <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 rounded-full opacity-50" style={{ background: GOLD }} />
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full opacity-50" style={{ background: GOLD }} />
              <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full opacity-50" style={{ background: BABY_BLUE }} />
              <div className="absolute bottom-2.5 right-2.5 w-1.5 h-1.5 rounded-full opacity-50" style={{ background: BABY_BLUE }} />

              {/* Refresh button */}
              <button
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing}
                className="absolute top-3 right-8 p-1.5 rounded-full transition-all duration-300 disabled:opacity-50 hover:scale-110 group"
                style={{ background: `${BABY_BLUE}18` }}
                title="Refresh"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 transition-transform duration-500 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`}
                  style={{ color: BABY_BLUE }}
                />
              </button>

              {/* Count */}
              <div className="flex items-center justify-center gap-2.5 mb-1.5">
                <span
                  className="amsterdam-one"
                  style={{
                    fontSize: "clamp(2.4rem, 9vw, 3.6rem)",
                    color: BABY_BLUE,
                    lineHeight: 1,
                    transition: "transform 0.3s",
                    transform: showIncrease ? "scale(1.12)" : "scale(1)",
                    textShadow: `0 2px 16px ${BABY_BLUE}44`,
                  }}
                >
                  {totalGuests}
                </span>
                {showIncrease && <TrendingUp className="h-5 w-5 animate-bounce" style={{ color: GOLD }} />}
                <div>
                  <p className="garamond" style={{ fontSize: "clamp(0.85rem, 2.8vw, 1rem)", color: DEEP, lineHeight: 1.25, fontWeight: 700 }}>
                    {totalGuests === 1 ? "Guest" : "Guests"}
                  </p>
                  <p className="garamond" style={{ fontSize: "clamp(0.7rem, 2vw, 0.82rem)", color: MEDIUM, fontStyle: "italic" }}>
                    Celebrating With Us
                  </p>
                </div>
              </div>

              {/* Thin divider */}
              <div className="h-px my-2.5 mx-6" style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}44, transparent)` }} />

              <p className="garamond" style={{ fontSize: "clamp(0.68rem, 2vw, 0.8rem)", color: MEDIUM, marginBottom: "0.2rem" }}>
                {rsvpCount} {rsvpCount === 1 ? "RSVP entry" : "RSVP entries"}
              </p>
              <p className="garamond" style={{ fontSize: "clamp(0.64rem, 1.8vw, 0.75rem)", color: MEDIUM, fontStyle: "italic", opacity: 0.80 }}>
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
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl ${justEntered ? "animate-guest-roll-in" : ""}`}
                  style={{
                    background: "rgba(254,249,243,0.95)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border: `1px solid ${BABY_BLUE}33`,
                    boxShadow: `0 4px 20px rgba(63,163,200,0.10), 0 1px 6px rgba(61,40,16,0.06), inset 0 1px 0 rgba(255,255,255,0.75)`,
                    ...(justEntered ? { animationDelay: `${index * 120}ms`, backfaceVisibility: "hidden" } : {}),
                  }}
                >
                  {/* Top accent stripe */}
                  <div className="h-[2px] w-full" style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}66, transparent)` }} />

                  <div className="p-3 sm:p-4 md:p-5">

                    {/* ── Guest identity row ── */}
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-md"
                          style={{
                            background: `linear-gradient(135deg, ${BABY_BLUE} 0%, ${BLUE_MID} 100%)`,
                            boxShadow: `0 3px 12px ${BABY_BLUE}55`,
                            width: "2.75rem",
                            height: "2.75rem",
                          }}
                        >
                          <span className="garamond text-white font-semibold" style={{ fontSize: "clamp(0.72rem, 2.5vw, 0.88rem)" }}>
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
                        <h3
                          className="garamond leading-tight"
                          style={{ fontSize: "clamp(0.88rem, 3vw, 1.08rem)", color: DEEP, fontWeight: 700 }}
                        >
                          {guest.name}
                        </h3>
                        {guest.role && (
                          <p className="garamond" style={{ fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: MEDIUM, fontStyle: "italic" }}>
                            {guest.role}
                          </p>
                        )}
                      </div>

                      {/* Guest count badge */}
                      <div
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full border flex-shrink-0"
                        style={{
                          background: `${BABY_BLUE}14`,
                          borderColor: `${BABY_BLUE}44`,
                          boxShadow: `0 1px 4px ${BABY_BLUE}22`,
                        }}
                      >
                        <Users className="h-2.5 w-2.5" style={{ color: BABY_BLUE }} />
                        <span className="garamond" style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)", color: DEEP, fontWeight: 600 }}>
                          {guest.allowedGuests}
                        </span>
                      </div>
                    </div>

                    {/* ── Message — focal point ── */}
                    {guest.message && guest.message.trim() !== "" && (
                      <div
                        className="relative rounded-xl mb-3 sm:mb-4 py-4 sm:py-5 px-4 sm:px-6 text-center overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${BABY_BLUE}0a 0%, ${BABY_BLUE}1a 50%, ${BABY_BLUE}0a 100%)`,
                          border: `1px solid ${BABY_BLUE}2e`,
                        }}
                      >
                        {/* Decorative opening quote */}
                        <div
                          className="absolute top-1 left-3 leading-none select-none pointer-events-none"
                          style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", color: BABY_BLUE, opacity: 0.14, fontFamily: "Georgia, serif", lineHeight: 1 }}
                          aria-hidden
                        >
                          &#8220;
                        </div>
                        {/* Decorative closing quote */}
                        <div
                          className="absolute bottom-0 right-3 leading-none select-none pointer-events-none"
                          style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", color: BABY_BLUE, opacity: 0.14, fontFamily: "Georgia, serif", lineHeight: 1 }}
                          aria-hidden
                        >
                          &#8221;
                        </div>

                        <p
                          className="garamond relative z-10"
                          style={{
                            fontSize: "clamp(0.85rem, 3.2vw, 1.08rem)",
                            color: DEEP,
                            fontStyle: "italic",
                            lineHeight: 1.9,
                            textAlign: "center",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {guest.message}
                        </p>

                        <div className="flex justify-center mt-2.5">
                          <span style={{ color: BABY_BLUE, fontSize: "5px", opacity: 0.65 }}>◆</span>
                        </div>
                      </div>
                    )}

                    {/* ── Companions ── */}
                    {guest.companions && guest.companions.length > 0 && (
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-3">
                        <span className="garamond w-full" style={{ fontSize: "clamp(0.58rem, 1.6vw, 0.66rem)", color: BABY_BLUE, letterSpacing: "0.30em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                          Companions
                        </span>
                        {guest.companions.map((c, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
                            style={{ background: `${BABY_BLUE}0d`, borderColor: `${BABY_BLUE}33` }}
                          >
                            <span className="garamond" style={{ fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: DEEP, fontWeight: 500 }}>{c.name}</span>
                            {c.relationship && (
                              <span className="garamond" style={{ fontSize: "clamp(0.56rem, 1.5vw, 0.64rem)", color: MEDIUM, fontStyle: "italic" }}>· {c.relationship}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ── Footer: date + heart ── */}
                    <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t" style={{ borderColor: `${BABY_BLUE}22` }}>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-2.5 w-2.5 opacity-60" style={{ color: BABY_BLUE }} />
                        <span className="garamond opacity-70" style={{ fontSize: "clamp(0.58rem, 1.6vw, 0.68rem)", color: MEDIUM }}>
                          Confirmed {formatDate(guest.updatedAt)}
                        </span>
                      </div>
                      <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3" style={{ color: BABY_BLUE, opacity: 0.55 }} />
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="h-[2px] w-full" style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}44, transparent)` }} />
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
                        background: active ? BABY_BLUE : `${BABY_BLUE}44`,
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
