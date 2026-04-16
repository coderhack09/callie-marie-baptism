"use client"

import { useState, useEffect } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, MapPin, Calendar, Clock, Heart, Music2, Twitter } from "lucide-react"
import { siteConfig } from "@/content/site"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"

const toTitleCase = (str: string) =>
  str.toLowerCase().split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

const DECO_FILTER =
  "brightness(0) saturate(100%) invert(62%) sepia(40%) saturate(400%) hue-rotate(5deg) brightness(95%) contrast(90%)"

export function Footer() {
  const year          = new Date().getFullYear()
  const ceremonyDate  = siteConfig.ceremony.date
  const ceremonyTime  = siteConfig.ceremony.time
  const receptionTime = siteConfig.reception.time
  const ceremonyVenue = siteConfig.ceremony.venue
  const receptionVenue = siteConfig.reception.venue
  const isSameVenue   = ceremonyVenue === receptionVenue
  const childName     = siteConfig.couple.child ?? `${siteConfig.couple.brideNickname} & ${siteConfig.couple.groomNickname}`
  const brideNickname = siteConfig.couple.brideNickname
  const groomNickname = siteConfig.couple.groomNickname

  const quotes = [
    `"Children are a heritage from the Lord, offspring a reward from Him." — Psalm 127:3`,
    "Today we celebrate Niahna Celestine's first blessing — a sacred moment of grace, faith, and gratitude shared with those we love.",
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
    { label: "Home",        href: "#home" },
    { label: "Details",     href: "#details" },
    { label: "Gallery",     href: "#gallery" },
    { label: "RSVP",        href: "#guest-list" },
    { label: "Messages",    href: "#messages" },
  ] as const

  return (
    <div className="relative w-full" style={{ backgroundColor: "var(--color-motif-cream)" }}>
      {/* Layered background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 opacity-[0.22]"
          style={{ background: "linear-gradient(165deg, var(--color-motif-cream) 0%, rgba(212,184,150,0.14) 40%, rgba(207,160,107,0.06) 70%, rgba(139,111,90,0.03) 100%)" }} />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse 80% 45% at 50% 0%, rgba(207,160,107,0.5) 0%, transparent 60%)" }} />
      </div>

      <footer className="relative z-10 overflow-hidden">

        {/* Corner florals */}
        <div className="absolute left-0 top-0 z-0 pointer-events-none">
          {/* <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={280} height={280}
            className="w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] opacity-40 scale-y-[-1]"
            priority={false} style={{ filter: DECO_FILTER }} /> */}
        </div>
        <div className="absolute right-0 top-0 z-0 pointer-events-none">
          {/* <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={280} height={280}
            className="w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] opacity-40 scale-x-[-1] scale-y-[-1]"
            priority={false} style={{ filter: DECO_FILTER }} /> */}
        </div>
        <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
          {/* <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={280} height={280}
            className="w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] opacity-40"
            priority={false} style={{ filter: DECO_FILTER }} /> */}
        </div>
        <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
          {/* <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={280} height={280}
            className="w-auto h-auto max-w-[120px] sm:max-w-[160px] md:max-w-[200px] opacity-40 scale-x-[-1]"
            priority={false} style={{ filter: DECO_FILTER }} /> */}
        </div>

        {/* ── Monogram / header ── */}
        <div className="relative z-10 flex flex-col items-center pt-8 sm:pt-10 md:pt-12 mb-6 sm:mb-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }}>
            <div className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-68 md:h-68 lg:w-72 lg:h-72 opacity-90">
              <CloudinaryImage
                src={siteConfig.couple.monogram}
                alt={`${childName} monogram`}
                fill
                className="object-contain"
                priority={false}
              />
            </div>
          </motion.div>

          {/* Child name + venue */}
          <div className="mt-3 sm:mt-4 text-center">
            <p
              className="gistesy"
              style={{
                fontSize: "clamp(1.5rem, 5.5vw, 2.6rem)",
                color: DEEP,
                lineHeight: 1.2,
                overflow: "visible",
                paddingTop: "0.08em",
                marginBottom: "0.2rem",
                textShadow: "0 2px 16px rgba(139,111,90,0.10)",
              }}
            >
              {childName}
            </p>
            <p
              className="garamond"
              style={{ fontSize: "clamp(0.68rem, 2vw, 0.82rem)", color: MEDIUM, fontStyle: "italic", letterSpacing: "0.03em" }}
            >
              {toTitleCase(siteConfig.ceremony.location || siteConfig.reception.location)}
            </p>
          </div>

          {/* Ornament divider */}
          <div className="flex items-center gap-3 mt-3 sm:mt-4">
            <div className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to left, rgba(207,160,107,0.45), transparent)" }} />
            <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.7 }}>✦</span>
            <div className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to right, rgba(207,160,107,0.45), transparent)" }} />
          </div>
        </div>

        {/* ── Main grid ── */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-8 sm:pb-10">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8 mb-7 sm:mb-8"
            variants={staggerChildren} initial="initial" animate="animate"
          >

            {/* ── Col 1-2: intro + typewriter quote ── */}
            <motion.div className="lg:col-span-2" variants={fadeInUp}>
              <div className="mb-5 sm:mb-6">
                <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
                  {/* <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ background: "rgba(207,160,107,0.14)" }}>
                    <Heart className="w-5 h-5" style={{ color: ACCENT }} fill={ACCENT} />
                  </div>
                  <h3
                    className="gistesy"
                    style={{ fontSize: "clamp(1.5rem, 5vw, 2.4rem)", color: DEEP, lineHeight: 1.15, overflow: "visible", paddingTop: "0.08em" }}
                  >
                    Niahna Celestine
                  </h3> */}
                </div>

                <div className="space-y-2 sm:space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" style={{ color: ACCENT }} />
                    <span className="garamond" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: DEEP }}>{ceremonyDate}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                    <span className="garamond" style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.84rem)", color: DEEP, lineHeight: 1.6 }}>
                      {toTitleCase(ceremonyVenue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Typewriter quote card */}
              <motion.div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border"
                style={{
                  background: "rgba(255,247,240,0.88)",
                  borderColor: "rgba(207,160,107,0.22)",
                  boxShadow: "0 8px 30px rgba(139,111,90,0.08)",
                }}
                whileHover={{ scale: 1.015 }}
                transition={{ duration: 0.3 }}
              >
                {/* Opening quote mark */}
                <div className="mb-1" style={{ fontSize: "2rem", color: ACCENT, opacity: 0.25, fontFamily: "Georgia, serif", lineHeight: 1 }}>
                  &#8220;
                </div>
                <blockquote
                  className="garamond"
                  style={{
                    fontSize: "clamp(0.8rem, 2.6vw, 0.95rem)",
                    color: DEEP,
                    fontStyle: "italic",
                    lineHeight: 1.85,
                    minHeight: "clamp(3.5rem, 10vw, 5rem)",
                  }}
                >
                  {displayedText}
                  <span className="inline-block w-px h-4 ml-0.5 animate-pulse align-middle" style={{ backgroundColor: ACCENT }}>|</span>
                </blockquote>
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.7 }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.45 }} />
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT, opacity: 0.7 }} />
                </div>
              </motion.div>
            </motion.div>

            {/* ── Col 3: event detail tiles ── */}
            <motion.div className="space-y-3 sm:space-y-4" variants={fadeInUp}>
              {isSameVenue ? (
                <motion.div
                  className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border"
                  style={{ background: "rgba(255,247,240,0.88)", borderColor: "rgba(207,160,107,0.22)", boxShadow: "0 6px 22px rgba(139,111,90,0.07)" }}
                  whileHover={{ y: -3 }} transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-2 sm:gap-2.5 mb-2.5 sm:mb-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, ${ACCENT}, ${DEEP})` }}>
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="gistesy" style={{ fontSize: "clamp(0.95rem, 3vw, 1.15rem)", color: DEEP }}>Christening &amp; Reception</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                      <span className="garamond" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)", color: DEEP, lineHeight: 1.6 }}>
                        {toTitleCase(siteConfig.ceremony.location || siteConfig.reception.location)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACCENT }} />
                      <span className="garamond" style={{ fontSize: "clamp(0.7rem, 2vw, 0.8rem)", color: DEEP }}>
                        {ceremonyTime} · {receptionTime}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Ceremony */}
                  <motion.div
                    className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border"
                    style={{ background: "rgba(255,247,240,0.88)", borderColor: "rgba(207,160,107,0.22)", boxShadow: "0 6px 22px rgba(139,111,90,0.07)" }}
                    whileHover={{ y: -3 }} transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${ACCENT}, ${DEEP})` }}>
                        <Clock className="w-4 h-4 text-white" />
                      </div>
                      <h4 className="gistesy" style={{ fontSize: "clamp(0.9rem, 2.8vw, 1.05rem)", color: DEEP }}>Christening Ceremony</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                        <span className="garamond" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP, lineHeight: 1.6 }}>
                          {toTitleCase(siteConfig.ceremony.location)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACCENT }} />
                        <span className="garamond" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP }}>{ceremonyTime}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Reception */}
                  <motion.div
                    className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border"
                    style={{ background: "rgba(255,247,240,0.88)", borderColor: "rgba(207,160,107,0.22)", boxShadow: "0 6px 22px rgba(139,111,90,0.07)" }}
                    whileHover={{ y: -3 }} transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${MEDIUM}, ${DEEP})` }}>
                        <Heart className="w-4 h-4 text-white" fill="white" />
                      </div>
                      <h4 className="gistesy" style={{ fontSize: "clamp(0.9rem, 2.8vw, 1.05rem)", color: DEEP }}>Celebration Reception</h4>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                        <span className="garamond" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP, lineHeight: 1.6 }}>
                          {toTitleCase(siteConfig.reception.location)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACCENT }} />
                        <span className="garamond" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP }}>{receptionTime}</span>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}

              {/* RSVP deadline */}
              <motion.div
                className="rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border"
                style={{ background: "rgba(255,247,240,0.88)", borderColor: "rgba(207,160,107,0.22)", boxShadow: "0 6px 22px rgba(139,111,90,0.07)" }}
                whileHover={{ y: -3 }} transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}, ${DEEP})` }}>
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="gistesy" style={{ fontSize: "clamp(0.9rem, 2.8vw, 1.05rem)", color: DEEP }}>RSVP Deadline</h4>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: ACCENT }} />
                    <span className="garamond" style={{ fontSize: "clamp(0.68rem, 1.9vw, 0.78rem)", color: DEEP }}>{siteConfig.details.rsvp.deadline}</span>
                  </div>
                  <p className="garamond" style={{ fontSize: "clamp(0.65rem, 1.7vw, 0.74rem)", color: MEDIUM, fontStyle: "italic", paddingLeft: "1.375rem" }}>
                    Please confirm your attendance by this date.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Col 4: links + social ── */}
            <motion.div className="space-y-5 sm:space-y-6" variants={fadeInUp}>

              {/* Quick links */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 rounded-full" style={{ background: `linear-gradient(to bottom, ${ACCENT}, ${DEEP})` }} />
                  <h4 className="garamond font-bold" style={{ fontSize: "clamp(0.72rem, 2vw, 0.84rem)", color: DEEP, letterSpacing: "0.28em", textTransform: "uppercase" }}>
                    Quick Links
                  </h4>
                </div>
                <div className="space-y-1.5 sm:space-y-2">
                  {nav.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="garamond block transition-all duration-200 hover:translate-x-1"
                      style={{ fontSize: "clamp(0.75rem, 2.2vw, 0.88rem)", color: MEDIUM }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = MEDIUM)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Social */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1 h-6 rounded-full" style={{ background: `linear-gradient(to bottom, ${ACCENT}, ${DEEP})` }} />
                  <h4 className="garamond font-bold" style={{ fontSize: "clamp(0.72rem, 2vw, 0.84rem)", color: DEEP, letterSpacing: "0.28em", textTransform: "uppercase" }}>
                    Stay Connected
                  </h4>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { href: "https://www.facebook.com", Icon: Facebook, label: "Facebook" },
                    { href: "https://www.instagram.com", Icon: Instagram, label: "Instagram" },
                    { href: "https://www.youtube.com",   Icon: Music2,    label: "YouTube" },
                    { href: "https://x.com",             Icon: Twitter,   label: "Twitter" },
                  ].map(({ href, Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border transition-all duration-200 hover:scale-110"
                      style={{
                        background: "rgba(207,160,107,0.08)",
                        borderColor: "rgba(207,160,107,0.28)",
                        color: DEEP,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(207,160,107,0.20)"; e.currentTarget.style.borderColor = "rgba(207,160,107,0.50)" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(207,160,107,0.08)"; e.currentTarget.style.borderColor = "rgba(207,160,107,0.28)" }}
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
            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mb-5 sm:mb-6">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(207,160,107,0.35))" }} />
              <span style={{ color: ACCENT, fontSize: "5px", opacity: 0.65 }}>◆</span>
              <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.5 }}>✦</span>
              <span style={{ color: ACCENT, fontSize: "5px", opacity: 0.65 }}>◆</span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(207,160,107,0.35))" }} />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="text-center md:text-left">
                <p className="garamond" style={{ fontSize: "clamp(0.65rem, 1.8vw, 0.76rem)", color: MEDIUM }}>
                  © {year} — Aileen &amp; Arjay — crafted with love, prayers, and gratitude.
                </p>
                <p className="garamond" style={{ fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", color: MEDIUM, opacity: 0.8, fontStyle: "italic", marginTop: "0.2rem" }}>
                  In celebration of Niahna Celestine&apos;s christening.
                </p>
              </div>
              <div className="text-center md:text-right space-y-0.5">
                <p className="garamond" style={{ fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", color: MEDIUM, opacity: 0.9 }}>
                  Developed by{" "}
                  <a
                    href="https://lance28-beep.github.io/portfolio-website/"
                    target="_blank" rel="noopener noreferrer"
                    className="underline transition-colors duration-200"
                    style={{ color: ACCENT }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = DEEP)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = ACCENT)}
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
                    style={{ color: ACCENT }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = DEEP)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = ACCENT)}
                  >
                    Wedding Invitation Naga
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
