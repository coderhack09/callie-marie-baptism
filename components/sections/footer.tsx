"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, MapPin, Calendar, Clock, Heart, Music2, Twitter } from "lucide-react"
import Image from "next/image"
import { siteConfig } from "@/content/site"

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

const toTitleCase = (str: string) =>
  str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

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

export function Footer() {
  const year           = new Date().getFullYear()
  const ceremonyDate   = siteConfig.ceremony.date
  const ceremonyTime   = siteConfig.ceremony.time
  const receptionTime  = siteConfig.reception.time
  const ceremonyVenue  = siteConfig.ceremony.venue
  const receptionVenue = siteConfig.reception.venue
  const isSameVenue    = ceremonyVenue === receptionVenue
  const childName      = siteConfig.couple.child ?? `${siteConfig.couple.brideNickname} & ${siteConfig.couple.groomNickname}`
  const parentNames    = `${siteConfig.couple.brideNickname} & ${siteConfig.couple.groomNickname}`

  const quotes = [
    `"Children are a heritage from the Lord, offspring a reward from Him." — Psalm 127:3`,
    `Today we celebrate ${childName}'s first blessing — a sacred moment of grace, faith, and gratitude shared with those we love.`,
    "Thank you for your presence, your prayers, and your love. We are truly grateful to celebrate this milestone with you.",
  ]

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [displayedText, setDisplayedText]         = useState("")
  const [isDeleting, setIsDeleting]               = useState(false)
  const [isPaused, setIsPaused]                   = useState(false)

  useEffect(() => {
    if (isPaused) {
      const t = setTimeout(() => setIsPaused(false), 3000)
      return () => clearTimeout(t)
    }
    if (isDeleting) {
      if (displayedText.length > 0) {
        const t = setTimeout(() => setDisplayedText(displayedText.slice(0, -1)), 28)
        return () => clearTimeout(t)
      } else {
        setIsDeleting(false)
        setCurrentQuoteIndex((p) => (p + 1) % quotes.length)
      }
    } else {
      const current = quotes[currentQuoteIndex]
      if (displayedText.length < current.length) {
        const t = setTimeout(() => setDisplayedText(current.slice(0, displayedText.length + 1)), 48)
        return () => clearTimeout(t)
      } else {
        setIsPaused(true)
        setIsDeleting(true)
      }
    }
  }, [displayedText, isDeleting, isPaused, currentQuoteIndex])

  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  }
  const staggerChildren = { animate: { transition: { staggerChildren: 0.18 } } }

  const nav = [
    { label: "Home",     href: "#home"       },
    { label: "Details",  href: "#details"    },
    { label: "RSVP",     href: "#guest-list" },
    { label: "Guests",   href: "#guests"     },
    { label: "Messages", href: "#messages"   },
    { label: "FAQ",      href: "#faq"        },
  ] as const

  const cardStyle: React.CSSProperties = FROSTED_CARD

  return (
    <footer id="footer" className="relative w-full overflow-hidden">

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
        <Image src="/decoration/left-top-removebg-preview.png"    alt="" width={200} height={200} className="absolute top-0 left-0  w-auto h-auto max-w-[90px] sm:max-w-[130px] md:max-w-[170px] opacity-35" />
        <Image src="/decoration/right-top-removebg-preview.png"   alt="" width={200} height={200} className="absolute top-0 right-0 w-auto h-auto max-w-[90px] sm:max-w-[130px] md:max-w-[170px] opacity-35" />
        <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={200} height={200} className="absolute bottom-0 left-0  w-auto h-auto max-w-[90px] sm:max-w-[130px] md:max-w-[170px] opacity-35" />
        <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={200} height={200} className="absolute bottom-0 right-0 w-auto h-auto max-w-[90px] sm:max-w-[130px] md:max-w-[170px] opacity-35" />
      </div>

      <div className="relative z-10">

        {/* ══════════════════════════════════════════════════════════════
            MONOGRAM / HERO HEADER
        ══════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center pt-10 sm:pt-14 mb-8 sm:mb-10 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}
            className="mb-4"
          >
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 opacity-90 drop-shadow-sm">
              <Image
                src={siteConfig.couple.monogram}
                alt={`${childName} monogram`}
                fill
                className="object-contain"
                priority={false}
              />
            </div>
          </motion.div>

          {/* Name */}
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(1.6rem, 5.5vw, 2.8rem)",
            color: GOLD,
            lineHeight: 1.0,
            marginBottom: "0.35rem",
            filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
          }}>
            {childName}
          </p>
          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
            color: NAVY_MUTE,
            fontStyle: "italic",
            letterSpacing: "0.04em",
          }}>
            {toTitleCase(siteConfig.ceremony.location || siteConfig.reception.location)}
          </p>

          <div className="mt-4 sm:mt-5 w-full max-w-xs">
            <OrnamentDivider />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            MAIN GRID
        ══════════════════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-10 sm:pb-12">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 mb-8 sm:mb-10"
            variants={staggerChildren} initial="initial" animate="animate"
          >

            {/* ── Col 1-2: info + typewriter quote ── */}
            <motion.div className="lg:col-span-2 flex flex-col gap-5" variants={fadeInUp}>

              {/* Event summary */}
              <div className="rounded-3xl p-4 sm:p-5" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: GOLD, boxShadow: "0 2px 8px rgba(196,152,88,0.30)" }}>
                      <Calendar className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: DARK_NAVY, fontWeight: 500 }}>
                      {ceremonyDate} · {siteConfig.ceremony.day}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(43,74,107,0.85)", boxShadow: "0 2px 8px rgba(43,74,107,0.20)" }}>
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: NAVY_MUTE, lineHeight: 1.75 }}>
                      {toTitleCase(ceremonyVenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: GOLD, boxShadow: "0 2px 8px rgba(196,152,88,0.30)" }}>
                      <Clock className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: NAVY_MUTE }}>
                      Ceremony: {ceremonyTime} &nbsp;·&nbsp; Reception: {receptionTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Typewriter quote card */}
              <motion.div
                className="rounded-3xl p-4 sm:p-5 md:p-6 flex-1"
                style={cardStyle}
                whileHover={{ scale: 1.012 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-px w-full mb-4" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

                <div className="mb-1" style={{ fontSize: "2.2rem", color: GOLD, opacity: 0.18, fontFamily: "Georgia, serif", lineHeight: 1 }}>
                  &#8220;
                </div>
                <blockquote style={{
                  fontFamily: '"Fahkwang", sans-serif',
                  fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                  color: NAVY_MUTE,
                  fontStyle: "italic",
                  lineHeight: 1.75,
                  minHeight: "clamp(3.5rem, 10vw, 5rem)",
                }}>
                  {displayedText}
                  <span
                    className="inline-block w-px h-4 ml-0.5 animate-pulse align-middle"
                    style={{ backgroundColor: GOLD }}
                  >|</span>
                </blockquote>
                <div className="flex items-center gap-1.5 mt-3">
                  <div style={{ width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)" }} />
                  <div style={{ width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.40)" }} />
                  <div style={{ width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)" }} />
                </div>
              </motion.div>
            </motion.div>

            {/* ── Col 3: event detail tiles ── */}
            <motion.div className="space-y-4" variants={fadeInUp}>
              {isSameVenue ? (
                <motion.div className="rounded-3xl p-4 sm:p-5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <div className="h-px w-full mb-3" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: GOLD, boxShadow: "0 2px 10px rgba(196,152,88,0.30)" }}>
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1rem, 3.5vw, 1.4rem)", color: GOLD }}>Christening &amp; Reception</h4>
                  </div>
                  <div className="space-y-2 pl-0.5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                      <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: NAVY_MUTE, lineHeight: 1.75 }}>
                        {toTitleCase(siteConfig.ceremony.location || siteConfig.reception.location)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                      <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: NAVY_MUTE }}>
                        {ceremonyTime} · {receptionTime}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div className="rounded-3xl p-4 sm:p-4.5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <div className="h-px w-full mb-3" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: GOLD, boxShadow: "0 2px 10px rgba(196,152,88,0.30)" }}>
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1rem, 3.5vw, 1.4rem)", color: GOLD }}>Christening Ceremony</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                        <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: NAVY_MUTE, lineHeight: 1.75 }}>
                          {toTitleCase(siteConfig.ceremony.location)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                        <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: NAVY_MUTE }}>{ceremonyTime}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div className="rounded-3xl p-4 sm:p-4.5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <div className="h-px w-full mb-3" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "rgba(43,74,107,0.85)", boxShadow: "0 2px 10px rgba(43,74,107,0.20)" }}>
                        <Heart className="w-4 h-4 text-white" fill="white" />
                      </div>
                      <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1rem, 3.5vw, 1.4rem)", color: GOLD }}>Celebration Reception</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                        <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: NAVY_MUTE, lineHeight: 1.75 }}>
                          {toTitleCase(siteConfig.reception.location)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                        <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: NAVY_MUTE }}>{receptionTime}</span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* RSVP deadline */}
              <motion.div className="rounded-3xl p-4 sm:p-4.5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className="h-px w-full mb-3" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: GOLD, boxShadow: "0 2px 10px rgba(196,152,88,0.30)" }}>
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1rem, 3.5vw, 1.4rem)", color: GOLD }}>RSVP Deadline</h4>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                    <span style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: DARK_NAVY }}>
                      {siteConfig.details.rsvp.deadline}
                    </span>
                  </div>
                  <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, fontStyle: "italic", paddingLeft: "1.375rem" }}>
                    Please confirm your attendance by this date.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Col 4: quick links + social ── */}
            <motion.div className="space-y-6" variants={fadeInUp}>

              {/* Quick links */}
              <div className="rounded-3xl p-4 sm:p-5" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                  <h4 style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)", color: "rgba(72,112,148,0.80)", letterSpacing: "0.30em", textTransform: "uppercase" }}>
                    Quick Links
                  </h4>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  {nav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1.5 group"
                      style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: NAVY_MUTE }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = GOLD }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = NAVY_MUTE }}
                    >
                      <span className="w-1 h-1 rounded-full flex-shrink-0 opacity-50" style={{ background: GOLD }} />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Stay connected */}
              <div className="rounded-3xl p-4 sm:p-5" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                  <h4 style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)", color: "rgba(72,112,148,0.80)", letterSpacing: "0.30em", textTransform: "uppercase" }}>
                    Stay Connected
                  </h4>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { href: "https://www.facebook.com",  Icon: Facebook,  label: "Facebook"  },
                    { href: "https://www.instagram.com", Icon: Instagram, label: "Instagram" },
                    { href: "https://www.youtube.com",   Icon: Music2,    label: "YouTube"   },
                    { href: "https://x.com",             Icon: Twitter,   label: "Twitter"   },
                  ].map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition-all duration-200 hover:scale-110"
                      style={{
                        background: "rgba(196,152,88,0.10)",
                        borderColor: "rgba(196,152,88,0.30)",
                        color: DARK_NAVY,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = "white" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(196,152,88,0.10)"; e.currentTarget.style.borderColor = "rgba(196,152,88,0.30)"; e.currentTarget.style.color = DARK_NAVY }}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ── Bottom divider + copyright ── */}
          <motion.div variants={fadeInUp}>
            <div className="mb-6 sm:mb-7">
              <OrnamentDivider width="100%" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 pb-2">
              <div className="text-center md:text-left">
                <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE }}>
                  © {year} — {parentNames} — crafted with love, prayers, and gratitude.
                </p>
                <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, opacity: 0.85, fontStyle: "italic", marginTop: "0.2rem" }}>
                  In celebration of {childName}&apos;s christening.
                </p>
              </div>

              <div className="text-center md:text-right space-y-0.5">
                <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE }}>
                  Developed by{" "}
                  <a
                    href="https://lance28-beep.github.io/portfolio-website/"
                    target="_blank" rel="noopener noreferrer"
                    className="underline transition-colors duration-200"
                    style={{ color: GOLD }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = DARK_NAVY }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = GOLD }}
                  >
                    Lance Valle
                  </a>
                </p>
                <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE }}>
                  Want a site like this?{" "}
                  <a
                    href="https://www.facebook.com/WeddingInvitationNaga"
                    target="_blank" rel="noopener noreferrer"
                    className="underline transition-colors duration-200"
                    style={{ color: GOLD }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = DARK_NAVY }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = GOLD }}
                  >
                    Wedding Invitation Naga
                  </a>
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </footer>
  )
}
