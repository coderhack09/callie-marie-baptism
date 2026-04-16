"use client"

import { useState, useEffect } from "react"
import { Heart, RefreshCw, TrendingUp, Users, Calendar, Crown } from "lucide-react"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"
const CREAM  = "var(--color-motif-cream)"

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
  const [totalGuests, setTotalGuests]       = useState(0)
  const [rsvpCount, setRsvpCount]           = useState(0)
  const [confirmedGuests, setConfirmedGuests] = useState<Guest[]>([])
  const [isRefreshing, setIsRefreshing]     = useState(false)
  const [showIncrease, setShowIncrease]     = useState(false)
  const [currentIndex, setCurrentIndex]     = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [justEntered, setJustEntered]       = useState(false)

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
    <div
      id="guests"
      className="relative z-10 py-8 sm:py-12 md:py-16 overflow-hidden"
      style={{ backgroundColor: CREAM }}
    >
      {/* Soft background texture */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{ background: "linear-gradient(160deg, var(--color-motif-cream) 0%, color-mix(in srgb, var(--color-motif-soft) 18%, transparent) 50%, var(--color-motif-cream) 100%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse 70% 40% at 50% 10%, var(--color-motif-soft) 0%, transparent 60%)" }}
        />
      </div>

      {/* ── Section Header ──────────────────────────────────────────── */}
      <div className="relative z-10 text-center mb-6 sm:mb-8 md:mb-10 px-4">

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
          Our Cherished Guests
        </p>

        {/* Ornament */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, rgba(207,160,107,0.4), transparent)" }} />
          <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.7 }}>✦</span>
          <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, rgba(207,160,107,0.4), transparent)" }} />
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
          Book of Guests
        </h2>

        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.78rem, 2.8vw, 0.96rem)",
            color: MEDIUM,
            fontStyle: "italic",
            lineHeight: 1.85,
            maxWidth: "440px",
            margin: "0 auto clamp(0.5rem, 1.5vw, 0.8rem)",
          }}
        >
          Meet the cherished souls joining us in blessing Niahna Celestine — your presence makes our day truly complete.
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(to left, rgba(207,160,107,0.45), transparent)" }} />
          <span style={{ color: "#D4B896", fontSize: "5px" }}>◆</span>
          <div className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(to right, rgba(207,160,107,0.45), transparent)" }} />
        </div>
      </div>

      {/* ── Stats card ──────────────────────────────────────────────── */}
      <div className="relative z-10 text-center mb-5 sm:mb-7 px-4 sm:px-6">
        <div className="relative max-w-md mx-auto">
          <div
            className="relative rounded-xl sm:rounded-2xl p-4 sm:p-5 border"
            style={{
              background: "rgba(255,247,240,0.88)",
              borderColor: `rgba(207,160,107,0.25)`,
              boxShadow: `0 6px 28px rgba(139,111,90,0.10)`,
            }}
          >
            {/* Refresh button */}
            <button
              onClick={() => fetchGuests(true)}
              disabled={isRefreshing}
              className="absolute top-2 right-2 p-1.5 rounded-full transition-all duration-300 disabled:opacity-50 hover:scale-110 group"
              style={{ background: "rgba(207,160,107,0.10)" }}
              title="Refresh"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 transition-transform duration-500 ${isRefreshing ? "animate-spin" : "group-hover:rotate-180"}`}
                style={{ color: ACCENT }}
              />
            </button>

            {/* Count */}
            <div className="flex items-center justify-center gap-2 mb-1">
              <span
                className="amsterdam-one"
                style={{
                  fontSize: "clamp(2rem, 8vw, 3.2rem)",
                  color: DEEP,
                  lineHeight: 1,
                  transition: "transform 0.3s",
                  transform: showIncrease ? "scale(1.12)" : "scale(1)",
                }}
              >
                {totalGuests}
              </span>
              {showIncrease && <TrendingUp className="h-5 w-5 animate-bounce" style={{ color: ACCENT }} />}
              <p className="garamond" style={{ fontSize: "clamp(0.82rem, 2.8vw, 1rem)", color: DEEP, lineHeight: 1.3 }}>
                {totalGuests === 1 ? "Guest" : "Guests"}<br />
                <span style={{ fontSize: "0.85em", color: MEDIUM, fontStyle: "italic" }}>Celebrating With Us</span>
              </p>
            </div>

            <p className="garamond" style={{ fontSize: "clamp(0.68rem, 2vw, 0.8rem)", color: MEDIUM, marginBottom: "0.25rem" }}>
              {rsvpCount} {rsvpCount === 1 ? "RSVP entry" : "RSVP entries"}
            </p>
            <p className="garamond" style={{ fontSize: "clamp(0.65rem, 1.8vw, 0.76rem)", color: MEDIUM, fontStyle: "italic", opacity: 0.85 }}>
              Thank you for confirming — your presence means the world to us.
            </p>
          </div>
        </div>
      </div>

      {/* ── Guest Cards ─────────────────────────────────────────────── */}
      {confirmedGuests.length > 0 && (
        <div className="relative z-10 max-w-2xl mx-auto px-3 sm:px-5">
          <div
            className={`space-y-3 sm:space-y-4 ${isTransitioning ? "animate-guest-roll-out" : ""}`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {getVisibleGuests().map((guest, index) => (
              <div
                key={`${guest.id}-${currentIndex}-${index}`}
                className={`relative rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl ${justEntered ? "animate-guest-roll-in" : ""}`}
                style={{
                  background: "rgba(255,247,240,0.92)",
                  borderColor: `rgba(207,160,107,0.22)`,
                  boxShadow: "0 3px 16px rgba(139,111,90,0.08)",
                  ...(justEntered ? { animationDelay: `${index * 120}ms`, backfaceVisibility: "hidden" } : {}),
                }}
              >
                {/* Soft top accent line */}
                <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.40), transparent)` }} />

                <div className="p-3 sm:p-4 md:p-5">

                  {/* ── Guest identity row ── */}
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md"
                        style={{ background: `linear-gradient(135deg, ${ACCENT}, ${DEEP})` }}
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
                        style={{ fontSize: "clamp(0.85rem, 3vw, 1.05rem)", color: DEEP, fontWeight: 700 }}
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
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full border flex-shrink-0"
                      style={{ background: "rgba(207,160,107,0.10)", borderColor: "rgba(207,160,107,0.30)" }}
                    >
                      <Users className="h-2.5 w-2.5" style={{ color: ACCENT }} />
                      <span className="garamond" style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)", color: DEEP, fontWeight: 600 }}>
                        {guest.allowedGuests}
                      </span>
                    </div>
                  </div>

                  {/* ── Message — focal point ── */}
                  {guest.message && guest.message.trim() !== "" && (
                    <div
                      className="relative rounded-lg sm:rounded-xl mb-3 sm:mb-4 py-4 sm:py-5 px-4 sm:px-6 text-center overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,247,240,0.6) 0%, rgba(212,184,150,0.12) 50%, rgba(255,247,240,0.6) 100%)",
                        border: `1px solid rgba(207,160,107,0.28)`,
                      }}
                    >
                      {/* Large decorative opening quote */}
                      <div
                        className="absolute top-1 left-3 leading-none select-none pointer-events-none"
                        style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", color: ACCENT, opacity: 0.18, fontFamily: "Georgia, serif", lineHeight: 1 }}
                        aria-hidden
                      >
                        &#8220;
                      </div>
                      {/* Large decorative closing quote */}
                      <div
                        className="absolute bottom-0 right-3 leading-none select-none pointer-events-none"
                        style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", color: ACCENT, opacity: 0.18, fontFamily: "Georgia, serif", lineHeight: 1 }}
                        aria-hidden
                      >
                        &#8221;
                      </div>

                      {/* Message text */}
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

                      {/* Soft accent dot below */}
                      <div className="flex justify-center mt-2.5">
                        <span style={{ color: ACCENT, fontSize: "5px", opacity: 0.6 }}>◆</span>
                      </div>
                    </div>
                  )}

                  {/* ── Companions ── */}
                  {guest.companions && guest.companions.length > 0 && (
                    <div
                      className="flex flex-wrap gap-1 sm:gap-1.5 mb-2.5 sm:mb-3"
                    >
                      <span className="garamond w-full" style={{ fontSize: "clamp(0.58rem, 1.6vw, 0.66rem)", color: MEDIUM, letterSpacing: "0.28em", textTransform: "uppercase", marginBottom: "0.2rem" }}>
                        Companions
                      </span>
                      {guest.companions.map((c, i) => (
                        <div
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border"
                          style={{ background: "rgba(207,160,107,0.07)", borderColor: "rgba(207,160,107,0.25)" }}
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
                  <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t" style={{ borderColor: "rgba(207,160,107,0.18)" }}>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-2.5 w-2.5 opacity-60" style={{ color: ACCENT }} />
                      <span className="garamond opacity-70" style={{ fontSize: "clamp(0.58rem, 1.6vw, 0.68rem)", color: MEDIUM }}>
                        Confirmed {formatDate(guest.updatedAt)}
                      </span>
                    </div>
                    <Heart className="h-2.5 w-2.5 sm:h-3 sm:w-3" style={{ color: ACCENT, opacity: 0.5 }} />
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.25), transparent)` }} />
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
                      background: active ? ACCENT : "rgba(207,160,107,0.30)",
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
  )
}
