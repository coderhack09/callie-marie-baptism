"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, MapPin, Calendar, Clock, Heart, Music2, Twitter } from "lucide-react"
import Image from "next/image"
import { siteConfig } from "@/content/site"
import { C, text } from "@/components/loader/christening-theme"
import { CornerFloralDecor } from "@/components/loader/ChristeningDecor"

const cardStyle = {
  background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 48%, ${C.champagne} 100%)`,
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
} as const

const goldLine = `linear-gradient(to right, transparent, ${C.gold}, transparent)`

const toTitleCase = (str: string) =>
  str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

function GoldRule({ width = "240px" }: { width?: string }) {
  return (
    <div className="h-px mx-auto" style={{ maxWidth: width, background: goldLine, opacity: 0.55 }} />
  )
}

function BokehOrbs() {
  const orbs = [
    { w: 380, h: 380, top: "4%",  left: "2%",  color: "rgba(232,196,204,1)", opacity: 0.10, blur: 100 },
    { w: 260, h: 260, top: "18%", left: "70%", color: "rgba(201,168,108,1)",  opacity: 0.09, blur: 80  },
    { w: 300, h: 300, top: "55%", left: "8%",  color: "rgba(201,168,108,1)",  opacity: 0.08, blur: 90  },
    { w: 220, h: 220, top: "70%", left: "76%", color: "rgba(232,196,204,1)", opacity: 0.09, blur: 70  },
    { w: 170, h: 170, top: "38%", left: "44%", color: "rgba(201,168,108,1)",  opacity: 0.07, blur: 60  },
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

  return (
    <footer id="footer" className="relative w-full overflow-hidden">

      {/* Layered solid base — original footer background style */}
      <div className="absolute inset-0 -z-10" style={{ background: C.ivory }} />

      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 45% at 50% 30%, rgba(255,253,249,0.95) 0%, rgba(250,232,236,0.45) 45%, transparent 75%)`,
      }} />

      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(to top, rgba(232,196,204,0.12) 0%, rgba(247,239,228,0.06) 25%, transparent 55%)`,
      }} />

      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden style={{
        background: `
          radial-gradient(ellipse 50% 40% at 50% 28%, rgba(201,168,108,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 38% 32% at 50% 78%, rgba(232,196,204,0.10) 0%, transparent 65%)
        `,
      }} />

      <BokehOrbs />
      <CornerFloralDecor opacity={0.65} sizeClass="w-20 sm:w-32 md:w-40 lg:w-48" />

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
            color: C.goldDeep,
            lineHeight: 1.0,
            marginBottom: "0.35rem",
            filter: "drop-shadow(0 2px 8px rgba(201,168,108,0.22))",
          }}>
            {childName}
          </p>
          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
            color: text.body,
            fontStyle: "italic",
            letterSpacing: "0.04em",
          }}>
            {toTitleCase(siteConfig.ceremony.location || siteConfig.reception.location)}
          </p>

          <div className="mt-4 sm:mt-5 w-full max-w-xs">
            <GoldRule />
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
                <div className="h-px w-full mb-4" style={{ background: goldLine, opacity: 0.5 }} />

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: C.goldDeep, boxShadow: "0 2px 8px rgba(201,168,108,0.28)" }}>
                      <Calendar className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: C.roseDeep, fontWeight: 500 }}>
                      {ceremonyDate} · {siteConfig.ceremony.day}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: C.roseDeep, boxShadow: "0 2px 8px rgba(107,61,79,0.22)" }}>
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: text.body, lineHeight: 1.75 }}>
                      {toTitleCase(ceremonyVenue)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: C.goldDeep, boxShadow: "0 2px 8px rgba(201,168,108,0.28)" }}>
                      <Clock className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: text.body }}>
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
                <div className="h-px w-full mb-4" style={{ background: goldLine, opacity: 0.5 }} />

                <div className="mb-1" style={{ fontSize: "2.2rem", color: C.goldDeep, opacity: 0.18, fontFamily: "Georgia, serif", lineHeight: 1 }}>
                  &#8220;
                </div>
                <blockquote style={{
                  fontFamily: '"Fahkwang", sans-serif',
                  fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                  color: text.body,
                  fontStyle: "italic",
                  lineHeight: 1.75,
                  minHeight: "clamp(3.5rem, 10vw, 5rem)",
                }}>
                  {displayedText}
                  <span
                    className="inline-block w-px h-4 ml-0.5 animate-pulse align-middle"
                    style={{ backgroundColor: C.goldDeep }}
                  >|</span>
                </blockquote>
                <div className="flex items-center gap-1.5 mt-3">
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.goldDeep, opacity: 0.68 }} />
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.goldDeep, opacity: 0.40 }} />
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: C.goldDeep, opacity: 0.68 }} />
                </div>
              </motion.div>
            </motion.div>

            {/* ── Col 3: event detail tiles ── */}
            <motion.div className="space-y-4" variants={fadeInUp}>
              {isSameVenue ? (
                <motion.div className="rounded-3xl p-4 sm:p-5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                  <div className="h-px w-full mb-3" style={{ background: goldLine, opacity: 0.5 }} />
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: C.goldDeep, boxShadow: "0 2px 10px rgba(201,168,108,0.28)" }}>
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1rem, 3.5vw, 1.4rem)", color: C.goldDeep }}>Christening &amp; Reception</h4>
                  </div>
                  <div className="space-y-2 pl-0.5">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C.goldDeep }} />
                      <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: text.body, lineHeight: 1.75 }}>
                        {toTitleCase(siteConfig.ceremony.location || siteConfig.reception.location)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.goldDeep }} />
                      <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: text.body }}>
                        {ceremonyTime} · {receptionTime}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  <motion.div className="rounded-3xl p-4 sm:p-4.5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <div className="h-px w-full mb-3" style={{ background: goldLine, opacity: 0.5 }} />
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: C.goldDeep, boxShadow: "0 2px 10px rgba(201,168,108,0.28)" }}>
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1rem, 3.5vw, 1.4rem)", color: C.goldDeep }}>Christening Ceremony</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C.goldDeep }} />
                        <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: text.body, lineHeight: 1.75 }}>
                          {toTitleCase(siteConfig.ceremony.location)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.goldDeep }} />
                        <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: text.body }}>{ceremonyTime}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div className="rounded-3xl p-4 sm:p-4.5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <div className="h-px w-full mb-3" style={{ background: goldLine, opacity: 0.5 }} />
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: C.roseDeep, boxShadow: "0 2px 10px rgba(107,61,79,0.22)" }}>
                        <Heart className="w-4 h-4 text-white" fill="white" />
                      </div>
                      <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1rem, 3.5vw, 1.4rem)", color: C.goldDeep }}>Celebration Reception</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: C.goldDeep }} />
                        <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: text.body, lineHeight: 1.75 }}>
                          {toTitleCase(siteConfig.reception.location)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.goldDeep }} />
                        <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: text.body }}>{receptionTime}</span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* RSVP deadline */}
              <motion.div className="rounded-3xl p-4 sm:p-4.5" style={cardStyle} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <div className="h-px w-full mb-3" style={{ background: goldLine, opacity: 0.5 }} />
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: C.goldDeep, boxShadow: "0 2px 10px rgba(201,168,108,0.28)" }}>
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1rem, 3.5vw, 1.4rem)", color: C.goldDeep }}>RSVP Deadline</h4>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.goldDeep }} />
                    <span style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: C.roseDeep }}>
                      {siteConfig.details.rsvp.deadline}
                    </span>
                  </div>
                  <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: text.body, fontStyle: "italic", paddingLeft: "1.375rem" }}>
                    Please confirm your attendance by this date.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Col 4: quick links + social ── */}
            <motion.div className="space-y-6" variants={fadeInUp}>

              {/* Quick links */}
              <div className="rounded-3xl p-4 sm:p-5" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: goldLine, opacity: 0.5 }} />
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: C.goldDeep }} />
                  <h4 style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)", color: text.label, letterSpacing: "0.30em", textTransform: "uppercase" }}>
                    Quick Links
                  </h4>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  {nav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1.5 group"
                      style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)", color: text.body }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = C.goldDeep }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = text.body }}
                    >
                      <span className="w-1 h-1 rounded-full flex-shrink-0 opacity-50" style={{ background: C.goldDeep }} />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Stay connected */}
              <div className="rounded-3xl p-4 sm:p-5" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: goldLine, opacity: 0.5 }} />
                <div className="flex items-center gap-2 mb-3.5">
                  <div className="w-1 h-5 rounded-full flex-shrink-0" style={{ background: C.goldDeep }} />
                  <h4 style={{ fontFamily: '"Cinzel", serif', fontWeight: 500, fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)", color: text.label, letterSpacing: "0.30em", textTransform: "uppercase" }}>
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
                        background: C.blushSoft,
                        borderColor: C.blushDeep,
                        color: C.roseDeep,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = C.goldDeep; e.currentTarget.style.borderColor = C.goldDeep; e.currentTarget.style.color = C.pearl }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = C.blushSoft; e.currentTarget.style.borderColor = C.blushDeep; e.currentTarget.style.color = C.roseDeep }}
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
              <GoldRule width="100%" />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 pb-2">
              <div className="text-center md:text-left">
                <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: text.body }}>
                  © {year} — {parentNames} — crafted with love, prayers, and gratitude.
                </p>
                <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: text.body, opacity: 0.85, fontStyle: "italic", marginTop: "0.2rem" }}>
                  In celebration of {childName}&apos;s christening.
                </p>
              </div>

              <div className="text-center md:text-right space-y-0.5">
                <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: text.body }}>
                  Developed by{" "}
                  <a
                    href="https://lance28-beep.github.io/portfolio-website/"
                    target="_blank" rel="noopener noreferrer"
                    className="underline transition-colors duration-200"
                    style={{ color: C.goldDeep }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.roseDeep }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = C.goldDeep }}
                  >
                    Lance Valle
                  </a>
                </p>
                <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: text.body }}>
                  Want a site like this?{" "}
                  <a
                    href="https://www.facebook.com/WeddingInvitationNaga"
                    target="_blank" rel="noopener noreferrer"
                    className="underline transition-colors duration-200"
                    style={{ color: C.goldDeep }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.roseDeep }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = C.goldDeep }}
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
