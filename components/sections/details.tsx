"use client"

import { Section } from "@/components/section"
import { useState, useEffect, type ReactNode } from "react"
import { motion } from "motion/react"
import { QRCodeSVG } from "qrcode.react"
import { siteConfig } from "@/content/site"
import Image from "next/image"
import {
  Clock,
  Copy,
  Check,
  Navigation,
  Heart,
  Camera,
  MapPin,
  CalendarPlus,
  Shirt,
  ShieldCheck,
  Baby,
} from "lucide-react"

// ── Palette — aligned with loader/Hero.tsx ────────────────────────────────────
const NAVY        = "#2B4A6B"
const DARK_NAVY   = "#1C3050"
const GOLD        = "#C4965A"
const NAVY_MUTE   = "rgba(65,90,115,0.78)"
const STEEL       = "rgba(72,112,148,0.72)"
const GOLD_BORDER = "rgba(196,152,88,0.28)"

const childName = siteConfig.couple.child

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
}

// ── Shared sub-components ─────────────────────────────────────────────────────
function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-2" style={{ maxWidth: "240px", margin: "0 auto" }}>
      <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
      <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)", flexShrink: 0 }} />
      <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
    </div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p style={{
      fontFamily: '"Cinzel", serif',
      fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
      letterSpacing: "0.40em",
      textTransform: "uppercase",
      color: "rgba(72,112,148,0.80)",
      marginBottom: "0.4rem",
      paddingRight: "0.40em",
    }}>
      {text}
    </p>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 style={{
      fontFamily: '"Cinzel", serif',
      fontSize: "clamp(1.8rem, 7vw, 3.4rem)",
      color: NAVY,
      lineHeight: 1.1,
      marginTop: "0.5rem",
      filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
    }}>
      {children}
    </h3>
  )
}

interface ReminderCardProps {
  eyebrow: string
  title: string
  icon: ReactNode
  children: ReactNode
  index: number
}

function ReminderCard({ eyebrow, title, icon, children, index }: ReminderCardProps) {
  return (
    <motion.div
      custom={index} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}
      className="rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{
        background: "rgba(255,255,255,0.30)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1.5px solid rgba(43,74,107,0.22)",
        boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: "2px",
        background: "linear-gradient(to right, transparent, rgba(196,152,88,0.45), transparent)",
      }} />
      <div className="flex flex-col items-center mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center mb-2.5"
          style={{ background: "rgba(196,152,88,0.10)", border: "1.5px solid rgba(196,152,88,0.35)" }}>
          {icon}
        </div>
        <p style={{
          fontFamily: '"Cinzel", serif',
          fontSize: "clamp(0.50rem, 1.7vw, 0.60rem)",
          letterSpacing: "0.36em",
          textTransform: "uppercase",
          color: STEEL,
          marginBottom: "0.2rem",
          paddingRight: "0.36em",
          textAlign: "center",
        }}>
          {eyebrow}
        </p>
        <h4 style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          fontSize: "clamp(1.1rem, 4vw, 1.6rem)",
          color: DARK_NAVY,
          lineHeight: 1.15,
          textAlign: "center",
        }}>
          {title}
        </h4>
      </div>
      {children}
    </motion.div>
  )
}

// ── Calendar helper ───────────────────────────────────────────────────────────
function buildGoogleCalendarUrl(title: string, dateStr: string, timeStr: string, location: string) {
  const start = new Date(`${dateStr} ${timeStr}`)
  const end   = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const fmt   = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")
  const params = new URLSearchParams({
    action: "TEMPLATE", text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Join us for ${title}`,
    location,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 380, h: 380, top: "5%",  left: "2%",  color: "rgba(120,175,215,1)", opacity: 0.08, blur: 100 },
    { w: 260, h: 260, top: "20%", left: "70%", color: "rgba(196,152,88,1)",  opacity: 0.08, blur: 80  },
    { w: 300, h: 300, top: "52%", left: "10%", color: "rgba(196,152,88,1)",  opacity: 0.07, blur: 90  },
    { w: 220, h: 220, top: "68%", left: "74%", color: "rgba(120,175,215,1)", opacity: 0.08, blur: 70  },
    { w: 180, h: 180, top: "38%", left: "44%", color: "rgba(196,152,88,1)",  opacity: 0.06, blur: 60  },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {orbs.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.w,
            height: o.h,
            top: o.top,
            left: o.left,
            background: o.color,
            opacity: o.opacity,
            filter: `blur(${o.blur}px)`,
          }}
        />
      ))}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function Details() {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [currentReceptionImageIndex, setCurrentReceptionImageIndex] = useState(0)
  const receptionImages = siteConfig.reception.image

  useEffect(() => {
    if (receptionImages.length <= 1) return
    const timer = setInterval(() => setCurrentReceptionImageIndex((p) => (p + 1) % receptionImages.length), 3000)
    return () => clearInterval(timer)
  }, [receptionImages.length])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems((prev) => new Set(prev).add(itemId))
      setTimeout(() => setCopiedItems((prev) => { const s = new Set(prev); s.delete(itemId); return s }), 2000)
    } catch (err) { console.error("Failed to copy text: ", err) }
  }

  const ceremonyVenueName  = siteConfig.ceremony.location
  const ceremonyAddress    = siteConfig.ceremony.venue
  const ceremonyVenue      = `${ceremonyVenueName}, ${ceremonyAddress}`
  const ceremonyMapsLink   = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ceremonyVenue)}`
  const receptionVenueName = siteConfig.reception.location
  const receptionAddress   = siteConfig.reception.venue
  const receptionVenue     = `${receptionVenueName}, ${receptionAddress}`
  const receptionMapsLink  = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(receptionVenue)}`
  const ceremonyCalendarUrl = buildGoogleCalendarUrl(`${childName}'s Christening`, siteConfig.ceremony.date, siteConfig.ceremony.time, ceremonyVenue)

  const openInMaps = (link: string) => window.open(link, "_blank", "noopener,noreferrer")

  // ── Date block ──────────────────────────────────────────────────────────────
  const renderDateBlock = (dateStr: string, dayLabel: string, timeLabel: string) => (
    <div className="text-center mb-6 sm:mb-8">
      <p style={{
        fontFamily: '"Cinzel", serif',
        fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
        letterSpacing: "0.40em",
        textTransform: "uppercase",
        color: "rgba(72,112,148,0.80)",
        marginBottom: "0.4rem",
        paddingRight: "0.40em",
      }}>
        {dayLabel}
      </p>
      <p style={{
        fontFamily: '"LeJourScript", cursive',
        fontSize: "clamp(1.8rem, 7vw, 3.2rem)",
        color: GOLD,
        lineHeight: 1.1,
      }}>
        {new Date(dateStr).toLocaleString("default", { month: "long" })}
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-3">
        <p style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          fontSize: "clamp(2.4rem, 10vw, 4.8rem)",
          color: DARK_NAVY,
          lineHeight: 1,
        }}>
          {new Date(dateStr).getDate()}
        </p>
        <div className="h-10 sm:h-14 w-px" style={{ background: "linear-gradient(to bottom, transparent, rgba(196,152,88,0.55), transparent)" }} />
        <p style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 300,
          fontSize: "clamp(1.1rem, 3.8vw, 1.8rem)",
          color: NAVY,
          lineHeight: 1,
        }}>
          {new Date(dateStr).getFullYear()}
        </p>
      </div>
      <OrnamentDivider />
      <p style={{
        fontFamily: '"Fahkwang", sans-serif',
        fontSize: "clamp(0.88rem, 2.8vw, 1.05rem)",
        color: NAVY,
        letterSpacing: "0.08em",
        marginTop: "0.75rem",
      }}>
        {timeLabel}
      </p>
    </div>
  )

  // ── Location block ───────────────────────────────────────────────────────────
  const renderLocationBlock = (venueName: string, address: string, mapsLink: string, copyId: string, fullVenue: string) => (
    <div
      className="rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5"
      style={{
        background: "rgba(255,255,255,0.30)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1.5px solid rgba(43,74,107,0.22)",
        boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: "2px",
        background: "linear-gradient(to right, transparent, rgba(196,152,88,0.45), transparent)",
      }} />
      <div className="flex items-start gap-3">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />
        <div className="flex-1 min-w-0">
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.50rem, 1.7vw, 0.60rem)",
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "rgba(72,112,148,0.80)",
            marginBottom: "0.3rem",
            paddingRight: "0.36em",
          }}>
            Location
          </p>
          <p style={{ fontFamily: '"Cinzel", serif', fontWeight: 600, fontSize: "clamp(0.82rem, 2.8vw, 1rem)", color: DARK_NAVY, lineHeight: 1.5 }}>{venueName}</p>
          {/* <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2.2vw, 0.86rem)", color: NAVY_MUTE, lineHeight: 1.5 }}>{address}</p> */}
        </div>
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="p-1.5 sm:p-2 rounded-lg border shadow-sm" style={{ background: "#fff", borderColor: GOLD_BORDER }}>
            <QRCodeSVG value={mapsLink} size={72} level="M" includeMargin={false} fgColor={NAVY} bgColor="#ffffff" />
          </div>
          <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.58rem, 1.6vw, 0.66rem)", color: NAVY_MUTE, fontStyle: "italic", maxWidth: "72px", textAlign: "center" }}>
            Scan for map
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button onClick={() => openInMaps(mapsLink)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:opacity-90 hover:scale-[1.01] active:scale-[0.98]"
          style={{
            background: DARK_NAVY,
            color: "#fff",
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.72rem, 2.4vw, 0.86rem)",
            letterSpacing: "0.08em",
          }}>
          <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Get Directions</span>
        </button>
        <button onClick={() => copyToClipboard(fullVenue, copyId)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
          style={{
            background: "rgba(255,255,255,0.55)",
            borderColor: GOLD_BORDER,
            color: NAVY,
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.72rem, 2.4vw, 0.86rem)",
            letterSpacing: "0.08em",
          }}>
          {copiedItems.has(copyId) ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 flex-shrink-0" />}
          <span>{copiedItems.has(copyId) ? "Copied!" : "Copy Address"}</span>
        </button>
      </div>
    </div>
  )

  return (
    <Section id="details" className="relative py-16 sm:py-20 md:py-24 overflow-hidden" bgColor="none">

      {/* ── Solid base ── */}
      <div className="absolute inset-0 -z-10" style={{ background: "#FFFFFF" }} />

      {/* Center spotlight */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 45% at 50% 30%, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.6) 45%, transparent 75%)",
      }} />

      {/* Bottom water wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "linear-gradient(to top, rgba(120,175,215,0.10) 0%, rgba(120,175,215,0.04) 25%, transparent 55%)",
      }} />

      <BokehOrbs />

      {/* Center radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 28%, rgba(196,152,88,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 38% 32% at 50% 78%, rgba(120,175,215,0.08) 0%, transparent 65%)
          `,
        }} />
      </div>

      {/* Balloon decorations */}
      {/* <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <Image src="/decoration/balloons-half.png" alt="" width={300} height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[190px] md:max-w-[230px] opacity-60" priority={false} />
      </div>
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <Image src="/decoration/balloons-half.png" alt="" width={300} height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[190px] md:max-w-[230px] opacity-60 scale-x-[-1]" priority={false} />
      </div> */}

      {/* Corner florals */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <Image src="/decoration/left-top-removebg-preview.png"    alt="" width={200} height={200} aria-hidden className="absolute top-0 left-0  w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
        <Image src="/decoration/right-top-removebg-preview.png"   alt="" width={200} height={200} aria-hidden className="absolute top-0 right-0 w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
        <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={200} height={200} aria-hidden className="absolute bottom-0 left-0  w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
        <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={200} height={200} aria-hidden className="absolute bottom-0 right-0 w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION HEADER
      ══════════════════════════════════════════════════════════════ */}
      <motion.div className="relative z-10 text-center mb-14 sm:mb-18 px-4 sm:px-6"
        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <SectionLabel text="All You Need to Know" />
        <OrnamentDivider />
        <h2 style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 600,
          fontSize: "clamp(2.2rem, 10vw, 4.8rem)",
          color: NAVY,
          lineHeight: 1.1,
          marginTop: "0.75rem",
          marginBottom: "0.75rem",
          filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
        }}>
          Day of Grace
        </h2>
        <OrnamentDivider />
        <p style={{
          fontFamily: '"Fahkwang", sans-serif',
          fontSize: "clamp(0.80rem, 2.6vw, 0.96rem)",
          color: NAVY_MUTE,
          fontStyle: "italic",
          lineHeight: 1.9,
          maxWidth: "460px",
          margin: "0.75rem auto 0",
        }}>
          Every sacred detail, lovingly prepared for MY blessed celebration.
        </p>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          VENUE CARDS
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16 space-y-8 sm:space-y-12">

        {/* Ceremony */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          className="relative group rounded-3xl overflow-hidden transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.30)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1.5px solid rgba(43,74,107,0.22)",
            boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
          }}>
          <div className="relative w-full h-56 sm:h-64 md:h-80 overflow-hidden">
            <Image src={siteConfig.ceremony.image} alt={siteConfig.ceremony.location} fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 right-4">
              <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.50rem, 1.7vw, 0.60rem)", letterSpacing: "0.36em", textTransform: "uppercase", color: "rgb(255, 255, 255)", marginBottom: "0.2rem" }}>
                Christening Venue
              </p>
              {/* <h3 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1.4rem, 5vw, 2.4rem)", color: "#FFFFFF", lineHeight: 1.1 }}>
                {siteConfig.ceremony.location}
              </h3> */}
              <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.68rem, 2.3vw, 0.84rem)", color: "rgba(255,255,255,0.82)", marginTop: "0.15rem" }}>
                {siteConfig.ceremony.venue}
              </p>
            </div>
          </div>
          <div
            className="p-4 sm:p-6 md:p-8"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {renderDateBlock(siteConfig.ceremony.date, siteConfig.ceremony.day, siteConfig.ceremony.time)}
            {renderLocationBlock(ceremonyVenueName, ceremonyAddress, ceremonyMapsLink, "ceremony", ceremonyVenue)}
            <button onClick={() => window.open(ceremonyCalendarUrl, "_blank", "noopener,noreferrer")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
              style={{
                background: "rgba(255,255,255,0.55)",
                border: `1.5px solid ${GOLD_BORDER}`,
                color: NAVY,
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.72rem, 2.4vw, 0.86rem)",
                letterSpacing: "0.08em",
              }}>
              <CalendarPlus className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
              <span>Add to Calendar</span>
            </button>
          </div>
        </motion.div>

        {/* Reception */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          className="relative group rounded-3xl overflow-hidden transition-all duration-300"
          style={{
            background: "rgba(255,255,255,0.30)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1.5px solid rgba(43,74,107,0.22)",
            boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
          }}>
          <div className="relative w-full h-56 sm:h-64 md:h-80 overflow-hidden">
            {receptionImages.map((src, idx) => (
              <div key={src} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentReceptionImageIndex ? "opacity-100" : "opacity-0"}`}>
                <Image src={src} alt={siteConfig.reception.venue} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px" priority={idx === 0} />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
            {receptionImages.length > 1 && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {receptionImages.map((_, idx) => (
                  <span key={idx} className={`block h-1.5 rounded-full transition-all duration-300 ${idx === currentReceptionImageIndex ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
                ))}
              </div>
            )}
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 right-4 z-20">
              <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.50rem, 1.7vw, 0.60rem)", letterSpacing: "0.36em", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", marginBottom: "0.2rem" }}>
                Reception Venue
              </p>
              {/* <h3 style={{ fontFamily: '"LeJourScript", cursive', fontSize: "clamp(1.4rem, 5vw, 2.4rem)", color: "#FFFFFF", lineHeight: 1.1 }}>
                {siteConfig.reception.location}
              </h3> */}
              <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.68rem, 2.3vw, 0.84rem)", color: "rgba(255,255,255,0.82)", marginTop: "0.15rem" }}>
                {siteConfig.reception.venue}
              </p>
            </div>
          </div>
          <div
            className="p-4 sm:p-6 md:p-8"
            style={{
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <div className="text-center mb-5">
              <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)", letterSpacing: "0.40em", textTransform: "uppercase", color: "rgba(72,112,148,0.80)", marginBottom: "0.3rem", paddingRight: "0.40em" }}>
                Starts at
              </p>
              <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.88rem, 2.8vw, 1.05rem)", color: NAVY, letterSpacing: "0.08em" }}>
                {siteConfig.reception.time}
              </p>
            </div>
            {renderLocationBlock(receptionVenueName, receptionAddress, receptionMapsLink, "reception", receptionVenue)}
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DRESS CODE
      ══════════════════════════════════════════════════════════════ */}
      <motion.div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16"
        custom={2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
        <div className="text-center mb-6">
          <SectionLabel text="What to Wear" />
          <OrnamentDivider />
          <SectionTitle>Guest Attire</SectionTitle>
        </div>

        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.30)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1.5px solid rgba(43,74,107,0.22)",
            boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div
              className="p-5 sm:p-6 flex flex-col items-center text-center gap-3 border-b sm:border-b-0 sm:border-r"
              style={{ background: "rgba(255,255,255,0.35)", borderColor: "rgba(43,74,107,0.12)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm" style={{ background: "rgba(196,152,88,0.10)", borderColor: "rgba(196,152,88,0.35)" }}>
                <Shirt className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div>
                <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.50rem, 1.7vw, 0.60rem)", letterSpacing: "0.36em", textTransform: "uppercase", color: "rgba(72,112,148,0.80)", marginBottom: "0.25rem" }}>Godparents</p>
                <h4 style={{ fontFamily: '"Cinzel", serif', fontWeight: 700, fontSize: "clamp(1.1rem, 4vw, 1.6rem)", color: DARK_NAVY, lineHeight: 1.15 }}>Semi-Formal</h4>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.70)", border: `1.5px solid ${GOLD_BORDER}` }}>
                <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(196,152,88,0.35)" }} />
                <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)", color: NAVY }}>White attire</span>
              </div>
              <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: NAVY_MUTE, lineHeight: 1.7 }}>
                Godparents are kindly requested to wear semi-formal attire in white.
              </p>
            </div>

            <div
              className="p-5 sm:p-6 flex flex-col items-center text-center gap-3"
              style={{ background: "rgba(255,255,255,0.20)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm" style={{ background: "rgba(120,175,215,0.10)", borderColor: "rgba(43,74,107,0.22)" }}>
                <Shirt className="w-5 h-5" style={{ color: NAVY }} />
              </div>
              <div>
                <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.50rem, 1.7vw, 0.60rem)", letterSpacing: "0.36em", textTransform: "uppercase", color: "rgba(72,112,148,0.80)", marginBottom: "0.25rem" }}>Guests</p>
                <h4 style={{ fontFamily: '"Cinzel", serif', fontWeight: 700, fontSize: "clamp(1.1rem, 4vw, 1.6rem)", color: DARK_NAVY, lineHeight: 1.15 }}>Any Shade of Blue</h4>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {["#B8DFF0", "#7EC8E3", "#4CA9D0", "#2E86AB", "#1A6B9A"].map((c) => (
                  <div key={c} className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-sky-200" style={{ backgroundColor: c }} />
                ))}
              </div>
              <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: NAVY_MUTE, lineHeight: 1.7 }}>
                Guests are warmly invited to wear any shade of blue.
              </p>
            </div>
          </div>

          <div
            className="p-4 sm:p-6 border-t"
            style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(43,74,107,0.12)" }}
          >
            {/* <div className="flex items-center justify-center gap-2 mb-4">
              <p className="garamond uppercase" style={{ fontSize: "clamp(0.52rem, 1.8vw, 0.64rem)", letterSpacing: "0.42em", color: STEEL }}>Color Reference</p>
            </div> */}
            {/* <div className="relative w-full aspect-[5/4] sm:aspect-[4/3] max-w-xl mx-auto rounded-xl overflow-hidden border" style={{ borderColor: GOLD_BORDER }}>
              <Image src={siteConfig.dressCode.guests.photo} alt="Guest attire palette" fill
                className="object-contain bg-white/60 p-2 sm:p-3"
                sizes="(max-width: 640px) 95vw, (max-width: 1024px) 85vw, 672px" />
            </div> */}
            {/* <p className="garamond text-center mt-4 leading-relaxed max-w-lg mx-auto" style={{ fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)", color: `${NAVY}bb` }}>
              {siteConfig.dressCode.guests.notes}
            </p> */}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          GENTLE REMINDERS
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <SectionLabel text="A Few Kind Notes" />
          <OrnamentDivider />
          <SectionTitle>Gentle Reminders</SectionTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <ReminderCard eyebrow="A Sacred Moment" title="Unplugged Christening"
            icon={<Camera className="w-5 h-5" style={{ color: GOLD }} />} index={0}>
            <p className="text-center" style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.82rem, 2.6vw, 0.95rem)", color: NAVY_MUTE, lineHeight: 1.85 }}>
              We are hosting a mostly unplugged christening. You are welcome to take a few photos, but please keep it minimal and avoid blocking our official photographer so every precious moment is beautifully captured. Photos will be shared after the celebration.
            </p>
          </ReminderCard>

          <ReminderCard eyebrow="Be On Time" title="Arrival"
            icon={<Clock className="w-5 h-5" style={{ color: GOLD }} />} index={1}>
            <p className="text-center" style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.82rem, 2.6vw, 0.95rem)", color: NAVY_MUTE, lineHeight: 1.85 }}>
              Please arrive at least 30 minutes early. The ceremony begins at{" "}
              <span style={{ color: DARK_NAVY, fontWeight: 600 }}>{siteConfig.ceremony.time}</span>, so kindly be seated by{" "}
              <span style={{ color: DARK_NAVY, fontWeight: 600 }}>{siteConfig.ceremony.guestsTime}</span>.
            </p>
          </ReminderCard>
{/* 
          <ReminderCard eyebrow="Kind Request" title="Dear Ninongs & Ninangs"
            icon={<Heart className="w-5 h-5" style={{ color: STEEL }} fill={STEEL} />} index={2}>
            <p className="garamond text-center" style={{ fontSize: "clamp(0.82rem, 2.8vw, 0.95rem)", color: `${NAVY}cc`, lineHeight: 1.85 }}>
              We kindly ask for a{" "}
              <span style={{ color: NAVY, fontWeight: 600 }}>PHP 200 church fee</span>{" "}
              to help with the ceremony. Payment via GCash is welcome.
            </p>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden border shadow-sm" style={{ background: "#fff", borderColor: GOLD_BORDER }}>
                <Image src={gcashQr.src} alt={`${gcashQr.label} QR code`} fill className="object-contain p-2" sizes="144px" />
              </div>
              <p className="garamond text-xs sm:text-sm" style={{ color: `${NAVY}88` }}>{gcashQr.accountNumber}</p>
            </div>
          </ReminderCard> */}

          {/* Baby Health Note */}
          <ReminderCard eyebrow="A Little Note from Me" title="Baby's Health"
            icon={<Baby className="w-5 h-5" style={{ color: GOLD }} />} index={3}>
            <div className="text-center space-y-2" style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.82rem, 2.6vw, 0.95rem)", color: NAVY_MUTE, lineHeight: 1.85 }}>
              <p>My immune system is still tiny and growing, so please come only if you&apos;re feeling healthy and well.</p>
              <p>Please sanitize your hands before carrying me and kindly avoid kissing me for now.</p>
              <p style={{ color: DARK_NAVY }}>Thank you for helping keep me safe on my special day! 🤍</p>
            </div>
          </ReminderCard>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          CLOSING MESSAGE
      ══════════════════════════════════════════════════════════════ */}
      <motion.div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-6"
        custom={5} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
        <div
          className="rounded-3xl p-6 sm:p-10 text-center overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.30)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1.5px solid rgba(43,74,107,0.22)",
            boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
            <Heart className="w-5 h-5" fill={GOLD} style={{ color: GOLD, filter: "drop-shadow(0 0 6px rgba(196,152,88,0.35))" }} />
            <div className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
          </div>

          <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.92rem, 2.8vw, 1.05rem)", color: NAVY_MUTE, lineHeight: 1.95, fontStyle: "italic", marginBottom: "1rem" }}>
          I can’t wait to celebrate, smile, sleep through photos, and make beautiful memories with all of you!
          </p>

          <p style={{ fontFamily: '"LeJourScript", cursive', fontSize: "clamp(1.6rem, 6.5vw, 2.8rem)", color: GOLD, lineHeight: 1.1 }}>
            With love,
          </p>
          <p style={{ fontFamily: '"Cinzel", serif', fontWeight: 700, fontSize: "clamp(1.8rem, 7vw, 3.2rem)", color: DARK_NAVY, lineHeight: 1.1, marginTop: "0.25rem" }}>
            Kaezar
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
            <ShieldCheck className="w-5 h-5" style={{ color: GOLD, opacity: 0.75 }} />
            <div className="h-px w-12 sm:w-20" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
          </div>
        </div>
      </motion.div>

    </Section>
  )
}
