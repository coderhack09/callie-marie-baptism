"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, MapPin, Calendar, Clock, Heart, Music2, Twitter, Sparkles } from "lucide-react"
import Image from "next/image"
import { siteConfig } from "@/content/site"
// ── Motif palette (aligned with BookOfGuests / Messages / FAQ / SnapShare) ────
const DEEP      = "#3D2810"
const MEDIUM    = "#8C6035"
const GOLD      = "#B8822A"
const BABY_BLUE = "#3FA3C8"
const BLUE_MID  = "#7BBEDD"
const IVORY     = "#FEF9F3"
const BLUSH     = "#EED4BC"

const toTitleCase = (str: string) =>
  str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 260, h: 260, top: "5%",  left: "2%",  color: BABY_BLUE, opacity: 0.07, blur: 80 },
    { w: 200, h: 200, top: "20%", left: "74%", color: GOLD,      opacity: 0.08, blur: 65 },
    { w: 220, h: 220, top: "60%", left: "5%",  color: BLUSH,     opacity: 0.09, blur: 75 },
    { w: 160, h: 160, top: "70%", left: "77%", color: BABY_BLUE, opacity: 0.07, blur: 58 },
    { w: 130, h: 130, top: "40%", left: "46%", color: GOLD,      opacity: 0.05, blur: 48 },
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

  // Shared card style
  const cardStyle: React.CSSProperties = {
    background: "rgba(254,249,243,0.92)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: `1.5px solid ${BABY_BLUE}28`,
    boxShadow: `0 6px 24px ${BABY_BLUE}12, 0 2px 8px rgba(61,40,16,0.05), inset 0 1px 0 rgba(255,255,255,0.75)`,
  }

  return (
    <footer id="footer" className="relative w-full overflow-hidden">

      {/* Solid ivory base */}
      <div className="absolute inset-0 -z-10" style={{ background: IVORY }} />

      {/* Multi-stop tinted vertical gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(180deg,
          rgba(213,238,248,0.38) 0%,
          rgba(251,244,234,0.0)  20%,
          rgba(238,212,188,0.26) 55%,
          rgba(251,244,234,0.0)  78%,
          rgba(213,238,248,0.32) 100%
        )`,
      }} />

      {/* Diagonal warm-to-cool wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(112deg, rgba(238,212,188,0.12) 0%, transparent 44%, rgba(213,238,248,0.12) 100%)`,
      }} />

      {/* Fine diagonal shimmer */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `repeating-linear-gradient(125deg, transparent 0px, transparent 160px, rgba(255,255,255,0.16) 160px, rgba(255,255,255,0.16) 162px)`,
      }} />

      {/* Soft dot grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(63,163,200,0.07) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      {/* Corner radial glows */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden style={{
        background: `
          radial-gradient(ellipse 50% 38% at 0%   0%,   rgba(213,238,248,0.28) 0%, transparent 60%),
          radial-gradient(ellipse 40% 34% at 100% 0%,   rgba(238,212,188,0.22) 0%, transparent 55%),
          radial-gradient(ellipse 44% 36% at 0%   100%, rgba(238,212,188,0.20) 0%, transparent 55%),
          radial-gradient(ellipse 40% 34% at 100% 100%, rgba(213,238,248,0.24) 0%, transparent 55%)
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
          <p
            className="gistesy"
            style={{
              fontSize: "clamp(1.6rem, 6vw, 2.8rem)",
              color: DEEP,
              lineHeight: 1.15,
              overflow: "visible",
              paddingTop: "0.08em",
              marginBottom: "0.3rem",
            }}
          >
            {childName}
          </p>
          <p
            className="garamond"
            style={{ fontSize: "clamp(0.68rem, 2vw, 0.82rem)", color: MEDIUM, fontStyle: "italic", letterSpacing: "0.04em" }}
          >
            {toTitleCase(siteConfig.ceremony.location || siteConfig.reception.location)}
          </p>

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 mt-4 sm:mt-5">
            <div className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to left, ${GOLD}88, transparent)` }} />
            <Sparkles className="h-3.5 w-3.5 opacity-55" style={{ color: GOLD }} />
            <span style={{ color: GOLD, fontSize: "9px", opacity: 0.8 }}>✦</span>
            <Sparkles className="h-3.5 w-3.5 opacity-55" style={{ color: GOLD }} />
            <div className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to right, ${GOLD}88, transparent)` }} />
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
              <div className="rounded-2xl p-4 sm:p-5" style={cardStyle}>
                <div className="h-[2px] w-full rounded-full mb-4"
                  style={{ background: `linear-gradient(to right, transparent, ${GOLD}77, ${BABY_BLUE}66, transparent)` }} />

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: BABY_BLUE, boxShadow: `0 2px 8px ${BABY_BLUE}44` }}>
                      <Calendar className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="garamond" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)", color: DEEP, fontWeight: 600 }}>
                      {ceremonyDate} · {siteConfig.ceremony.day}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: BABY_BLUE, boxShadow: `0 2px 8px ${BABY_BLUE}44` }}>
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="garamond" style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.86rem)", color: DEEP, lineHeight: 1.65 }}>
                      {toTitleCase(ceremonyVenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: GOLD, boxShadow: `0 2px 8px ${GOLD}44` }}>
                      <Clock className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="garamond" style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.86rem)", color: DEEP }}>
                      Ceremony: {ceremonyTime} &nbsp;·&nbsp; Reception: {receptionTime}
                    </span>
                  </div>
                </div>
              </div>

              {/* Typewriter quote card */}
              <motion.div
                className="rounded-2xl p-4 sm:p-5 md:p-6 flex-1"
                style={cardStyle}
                whileHover={{ scale: 1.012 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-[2px] w-full rounded-full mb-4"
                  style={{ background: `linear-gradient(to right, transparent, ${BLUE_MID}77, transparent)` }} />

                <div className="mb-1" style={{ fontSize: "2.2rem", color: BABY_BLUE, opacity: 0.20, fontFamily: "Georgia, serif", lineHeight: 1 }}>
                  &#8220;
                </div>
                <blockquote
                  className="garamond"
                  style={{
                    fontSize: "clamp(0.8rem, 2.6vw, 0.96rem)",
                    color: DEEP,
                    fontStyle: "italic",
                    lineHeight: 1.9,
                    minHeight: "clamp(3.5rem, 10vw, 5rem)",
                  }}
                >
                  {displayedText}
                  <span
                    className="inline-block w-px h-4 ml-0.5 animate-pulse align-middle"
                    style={{ backgroundColor: BABY_BLUE }}
                  >|</span>
                </blockquote>
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BABY_BLUE, opacity: 0.65 }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: GOLD, opacity: 0.45 }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BABY_BLUE, opacity: 0.65 }} />
                </div>
              </motion.div>
            </motion.div>

            {/* ── Col 3: event detail tiles ── */}
            <motion.div className="space-y-4" variants={fadeInUp}>
              {isSameVenue ? (
                <motion.div className="rounded-2xl p-4 sm:p-5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <div className="h-[2px] w-full rounded-full mb-3" style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}55, transparent)` }} />
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: BABY_BLUE, boxShadow: `0 2px 10px ${BABY_BLUE}44` }}>
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="gistesy" style={{ fontSize: "clamp(0.95rem, 3vw, 1.15rem)", color: DEEP }}>Christening &amp; Reception</h4>
                  </div>
                  <div className="space-y-2 pl-0.5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: BABY_BLUE }} />
                      <span className="garamond" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)", color: DEEP, lineHeight: 1.65 }}>
                        {toTitleCase(siteConfig.ceremony.location || siteConfig.reception.location)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                      <span className="garamond" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)", color: DEEP }}>
                        {ceremonyTime} · {receptionTime}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div className="rounded-2xl p-4 sm:p-4.5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <div className="h-[2px] w-full rounded-full mb-3" style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}55, transparent)` }} />
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: BABY_BLUE, boxShadow: `0 2px 10px ${BABY_BLUE}44` }}>
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="gistesy" style={{ fontSize: "clamp(0.9rem, 2.8vw, 1.05rem)", color: DEEP }}>Christening Ceremony</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: BABY_BLUE }} />
                        <span className="garamond" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP, lineHeight: 1.65 }}>
                          {toTitleCase(siteConfig.ceremony.location)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                        <span className="garamond" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP }}>{ceremonyTime}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div className="rounded-2xl p-4 sm:p-4.5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <div className="h-[2px] w-full rounded-full mb-3" style={{ background: `linear-gradient(to right, transparent, ${GOLD}55, transparent)` }} />
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: GOLD, boxShadow: `0 2px 10px ${GOLD}44` }}>
                        <Heart className="w-4 h-4 text-white" fill="white" />
                      </div>
                      <h4 className="gistesy" style={{ fontSize: "clamp(0.9rem, 2.8vw, 1.05rem)", color: DEEP }}>Celebration Reception</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: BABY_BLUE }} />
                        <span className="garamond" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP, lineHeight: 1.65 }}>
                          {toTitleCase(siteConfig.reception.location)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                        <span className="garamond" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP }}>{receptionTime}</span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* RSVP deadline */}
              <motion.div className="rounded-2xl p-4 sm:p-4.5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className="h-[2px] w-full rounded-full mb-3" style={{ background: `linear-gradient(to right, transparent, ${GOLD}55, transparent)` }} />
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: GOLD, boxShadow: `0 2px 10px ${GOLD}44` }}>
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="gistesy" style={{ fontSize: "clamp(0.9rem, 2.8vw, 1.05rem)", color: DEEP }}>RSVP Deadline</h4>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GOLD }} />
                    <span className="garamond font-semibold" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP }}>
                      {siteConfig.details.rsvp.deadline}
                    </span>
                  </div>
                  <p className="garamond" style={{ fontSize: "clamp(0.64rem, 1.7vw, 0.74rem)", color: MEDIUM, fontStyle: "italic", paddingLeft: "1.375rem" }}>
                    Please confirm your attendance by this date.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Col 4: quick links + social ── */}
            <motion.div className="space-y-6" variants={fadeInUp}>

              {/* Quick links */}
              <div className="rounded-2xl p-4 sm:p-5" style={cardStyle}>
                <div className="h-[2px] w-full rounded-full mb-4"
                  style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}55, transparent)` }} />
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: BABY_BLUE }} />
                  <h4 className="garamond font-bold" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP, letterSpacing: "0.30em", textTransform: "uppercase" }}>
                    Quick Links
                  </h4>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  {nav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="garamond flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1.5 group"
                      style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.88rem)", color: MEDIUM }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = BABY_BLUE)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = MEDIUM)}
                    >
                      <span className="w-1 h-1 rounded-full flex-shrink-0 opacity-50" style={{ background: GOLD }} />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Stay connected */}
              <div className="rounded-2xl p-4 sm:p-5" style={cardStyle}>
                <div className="h-[2px] w-full rounded-full mb-4"
                  style={{ background: `linear-gradient(to right, transparent, ${GOLD}55, transparent)` }} />
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: GOLD }} />
                  <h4 className="garamond font-bold" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP, letterSpacing: "0.30em", textTransform: "uppercase" }}>
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
                        background: `${BABY_BLUE}12`,
                        borderColor: `${BABY_BLUE}33`,
                        color: DEEP,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = BABY_BLUE; e.currentTarget.style.borderColor = BABY_BLUE; e.currentTarget.style.color = "white" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = `${BABY_BLUE}12`; e.currentTarget.style.borderColor = `${BABY_BLUE}33`; e.currentTarget.style.color = DEEP }}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ══════════════════════════════════════════════════════════════
              BOTTOM DIVIDER + COPYRIGHT
          ══════════════════════════════════════════════════════════════ */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center justify-center gap-3 mb-6 sm:mb-7">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${GOLD}44)` }} />
              <span style={{ color: BLUE_MID, fontSize: "5px", opacity: 0.7 }}>◆</span>
              <span style={{ color: GOLD, fontSize: "8px", opacity: 0.65 }}>✦</span>
              <Heart className="h-3 w-3 opacity-50" style={{ color: BABY_BLUE }} />
              <span style={{ color: GOLD, fontSize: "8px", opacity: 0.65 }}>✦</span>
              <span style={{ color: BLUE_MID, fontSize: "5px", opacity: 0.7 }}>◆</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${GOLD}44)` }} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 pb-2">
              <div className="text-center md:text-left">
                <p className="garamond" style={{ fontSize: "clamp(0.65rem, 1.8vw, 0.76rem)", color: MEDIUM }}>
                  © {year} — {parentNames} — crafted with love, prayers, and gratitude.
                </p>
                <p className="garamond" style={{ fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", color: MEDIUM, opacity: 0.8, fontStyle: "italic", marginTop: "0.2rem" }}>
                  In celebration of {childName}&apos;s christening.
                </p>
              </div>

              <div className="text-center md:text-right space-y-0.5">
                <p className="garamond" style={{ fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", color: MEDIUM, opacity: 0.9 }}>
                  Developed by{" "}
                  <a
                    href="https://lance28-beep.github.io/portfolio-website/"
                    target="_blank" rel="noopener noreferrer"
                    className="underline transition-colors duration-200"
                    style={{ color: BABY_BLUE }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = DEEP)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = BABY_BLUE)}
                  >
                    Lance Valle
                  </a>
                </p>
                <p className="garamond" style={{ fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", color: MEDIUM, opacity: 0.9 }}>
                  Want a site like this?{" "}
                  <a
                    href="https://www.facebook.com/WeddingInvitationNaga"
                    target="_blank" rel="noopener noreferrer"
                    className="underline transition-colors duration-200"
                    style={{ color: GOLD }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = DEEP)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = GOLD)}
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
