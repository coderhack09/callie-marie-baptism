"use client"

import { useState, useEffect, useMemo } from "react"
import { RefreshCw, TrendingUp, Users, Crown } from "lucide-react"
import Counter from "@/components/Counter"
import { siteConfig } from "@/content/site"
import { C, text } from "@/components/loader/christening-theme"
import { CornerFloralDecor } from "@/components/loader/ChristeningDecor"
import { ChristeningParticles } from "@/components/loader/ChristeningParticles"

const cardStyle = {
  background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 48%, ${C.champagne} 100%)`,
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
} as const

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
const childFirst = siteConfig.couple.child.trim().split(" ")[0]

function countPlaces(n: number): number[] {
  if (n >= 100) return [100, 10, 1]
  if (n >= 10) return [10, 1]
  return [1]
}

function AnimatedGuestCount({ value, pulse }: { value: number; pulse: boolean }) {
  const places = useMemo(() => countPlaces(Math.max(value, 1)), [value])
  const fontSize = 52

  return (
    <div
      className="flex items-center justify-center"
      style={{
        transform: pulse ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.35s ease-out",
      }}
    >
      <Counter
        value={value}
        places={places}
        fontSize={fontSize}
        padding={2}
        gap={2}
        textColor={C.roseDeep}
        fontWeight={700}
        borderRadius={0}
        horizontalPadding={0}
        gradientHeight={0}
        gradientFrom="transparent"
        gradientTo="transparent"
        counterStyle={{ backgroundColor: "transparent" }}
        digitStyle={{
          fontFamily: '"Cinzel", serif',
          color: C.roseDeep,
          letterSpacing: "0.04em",
          minWidth: "0.65ch",
        }}
      />
    </div>
  )
}

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
    <section id="guests" className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-20">
      <ChristeningParticles scoped opacity={0.35} />
      <CornerFloralDecor opacity={0.68} sizeClass="w-20 sm:w-32 md:w-40 lg:w-48" />

      {/* Header — solid card */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-block rounded-3xl px-8 py-7 sm:px-12 sm:py-9 isolate" style={cardStyle}>
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.58rem, 2vw, 0.72rem)",
            fontWeight: 600,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: C.goldDeep,
            marginBottom: "0.5rem",
            paddingRight: "0.36em",
          }}>
            Our Cherished Guests
          </p>

          <h2 style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            fontSize: "clamp(1.8rem, 7vw, 3rem)",
            color: C.roseDeep,
            lineHeight: 1.1,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "0.5rem",
          }}>
            Book of Guests
          </h2>

          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
            color: text.body,
            lineHeight: 1.8,
            fontStyle: "italic",
            maxWidth: "32rem",
            margin: "0 auto",
          }}>
            Meet the cherished souls joining us in blessing {childFirst} — your presence makes our day truly complete.
          </p>
        </div>
      </div>

      <div className="relative z-10 pb-4 sm:pb-8">

        {/* Stats card */}
        <div className="text-center mb-7 sm:mb-9 px-4 sm:px-6">
          <div className="relative max-w-md mx-auto">
            <div className="relative rounded-3xl px-5 py-6 sm:px-8 sm:py-8 isolate" style={cardStyle}>
              <button
                onClick={() => fetchGuests(true)}
                disabled={isRefreshing}
                className="absolute top-3 right-3 p-2 rounded-full transition-all duration-300 disabled:opacity-50 hover:scale-110"
                style={{ background: C.blushSoft, border: `1px solid ${C.blushDeep}` }}
                title="Refresh"
                aria-label="Refresh guest count"
              >
                <RefreshCw
                  className={`h-4 w-4 transition-transform duration-500 ${isRefreshing ? "animate-spin" : ""}`}
                  style={{ color: C.goldDeep }}
                />
              </button>

              <p style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.55rem, 1.9vw, 0.68rem)",
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: text.caption,
                marginBottom: "0.75rem",
              }}>
                Total Attending
              </p>

              <div className="flex items-center justify-center gap-3 mb-2">
                <AnimatedGuestCount value={totalGuests} pulse={showIncrease} />
                {showIncrease && (
                  <TrendingUp className="h-5 w-5 animate-bounce flex-shrink-0" style={{ color: C.goldDeep }} />
                )}
              </div>

              <p style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.95rem, 2.8vw, 1.15rem)",
                fontWeight: 600,
                color: C.roseDeep,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "0.15rem",
              }}>
                {totalGuests === 1 ? "Guest" : "Guests"}
              </p>
              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.82rem, 2.5vw, 0.96rem)",
                color: text.body,
                fontStyle: "italic",
                marginBottom: "1rem",
              }}>
                Celebrating with us
              </p>

              <div className="h-px mx-8 mb-4" style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, opacity: 0.5 }} />

              <div className="flex items-center justify-center gap-6 sm:gap-10">
                <div className="text-center">
                  <p style={{
                    fontFamily: '"Cinzel", serif',
                    fontWeight: 700,
                    fontSize: "clamp(1.5rem, 5vw, 2rem)",
                    color: C.goldDeep,
                    lineHeight: 1,
                    marginBottom: "0.25rem",
                  }}>
                    {rsvpCount}
                  </p>
                  <p style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: "clamp(0.52rem, 1.8vw, 0.65rem)",
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: text.label,
                  }}>
                    {rsvpCount === 1 ? "RSVP" : "RSVPs"}
                  </p>
                </div>
                <div className="w-px h-10" style={{ background: C.blushDeep }} />
                <div className="text-center">
                  <p style={{
                    fontFamily: '"Cinzel", serif',
                    fontWeight: 700,
                    fontSize: "clamp(1.5rem, 5vw, 2rem)",
                    color: C.goldDeep,
                    lineHeight: 1,
                    marginBottom: "0.25rem",
                  }}>
                    {confirmedGuests.reduce((s, g) => s + (g.companions?.length || 0), 0)}
                  </p>
                  <p style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: "clamp(0.52rem, 1.8vw, 0.65rem)",
                    fontWeight: 600,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: text.label,
                  }}>
                    Companions
                  </p>
                </div>
              </div>

              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.78rem, 2.4vw, 0.92rem)",
                color: text.caption,
                fontStyle: "italic",
                marginTop: "1rem",
                lineHeight: 1.65,
              }}>
                Thank you for confirming — your presence means the world to us.
              </p>
            </div>
          </div>
        </div>

        {/* Guest cards */}
        {confirmedGuests.length > 0 && (
          <div className="max-w-2xl mx-auto px-3 sm:px-5">
            <div
              className={`space-y-3 sm:space-y-4 ${isTransitioning ? "animate-guest-roll-out" : ""}`}
              style={{ transformStyle: "preserve-3d" }}
            >
              {getVisibleGuests().map((guest, index) => (
                <div
                  key={`${guest.id}-${currentIndex}-${index}`}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 isolate ${justEntered ? "animate-guest-roll-in" : ""}`}
                  style={{
                    ...cardStyle,
                    ...(justEntered ? { animationDelay: `${index * 120}ms`, backfaceVisibility: "hidden" } : {}),
                  }}
                >
                  <div className="h-[2px] w-full" style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, opacity: 0.45 }} />

                  <div className="p-3 sm:p-4 md:p-5">
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                      <div className="relative flex-shrink-0">
                        <div
                          className="w-11 h-11 rounded-full flex items-center justify-center shadow-md"
                          style={{
                            background: `linear-gradient(135deg, ${C.goldDeep} 0%, ${C.gold} 100%)`,
                            boxShadow: "0 4px 14px rgba(201,168,108,0.28)",
                          }}
                        >
                          <span style={{
                            fontFamily: '"Cinzel", serif',
                            color: C.pearl,
                            fontWeight: 600,
                            fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)",
                          }}>
                            {getInitials(guest.name)}
                          </span>
                        </div>
                        {guest.isVip && (
                          <div
                            className="absolute -top-0.5 -right-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow border-2"
                            style={{ background: C.goldDeep, borderColor: C.pearl }}
                          >
                            <Crown className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-white fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 style={{
                          fontFamily: '"Cinzel", serif',
                          fontSize: "clamp(0.88rem, 2.6vw, 1.05rem)",
                          color: C.roseDeep,
                          fontWeight: 600,
                          lineHeight: 1.45,
                        }}>
                          {guest.name}
                        </h3>
                        {guest.role && (
                          <p style={{
                            fontFamily: '"Fahkwang", sans-serif',
                            fontSize: "clamp(0.78rem, 2.2vw, 0.9rem)",
                            color: text.caption,
                            fontStyle: "italic",
                          }}>
                            {guest.role}
                          </p>
                        )}
                      </div>

                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border flex-shrink-0"
                        style={{ background: C.blushSoft, borderColor: C.blushDeep }}
                      >
                        <Users className="h-3 w-3" style={{ color: C.goldDeep }} />
                        <span style={{
                          fontFamily: '"Cinzel", serif',
                          fontSize: "clamp(0.72rem, 2vw, 0.85rem)",
                          color: C.roseDeep,
                          fontWeight: 700,
                        }}>
                          {guest.allowedGuests}
                        </span>
                      </div>
                    </div>

                    {guest.companions && guest.companions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <span className="w-full" style={{
                          fontFamily: '"Cinzel", serif',
                          fontSize: "clamp(0.52rem, 1.8vw, 0.62rem)",
                          fontWeight: 600,
                          color: text.label,
                          letterSpacing: "0.28em",
                          textTransform: "uppercase",
                          marginBottom: "0.15rem",
                        }}>
                          Companions
                        </span>
                        {guest.companions.map((c, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border"
                            style={{ background: C.pearl, borderColor: C.blushDeep }}
                          >
                            <span style={{
                              fontFamily: '"Cinzel", serif',
                              fontSize: "clamp(0.72rem, 2.2vw, 0.85rem)",
                              color: C.roseDeep,
                              fontWeight: 500,
                            }}>
                              {c.name}
                            </span>
                            {c.relationship && (
                              <span style={{
                                fontFamily: '"Fahkwang", sans-serif',
                                fontSize: "clamp(0.72rem, 2vw, 0.82rem)",
                                color: text.caption,
                                fontStyle: "italic",
                              }}>
                                · {c.relationship}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

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
                        background: active ? C.goldDeep : C.blushDeep,
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
    </section>
  )
}
