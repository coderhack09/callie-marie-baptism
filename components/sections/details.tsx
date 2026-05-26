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
  X,
  MapPin,
  CalendarPlus,
  Sparkles,
  Shirt,
  Gift,
  ShieldCheck,
  Mail,
  Baby,
} from "lucide-react"

// ── Palette ───────────────────────────────────────────────────────────────────
const DEEP      = "#3D2810"
const MEDIUM    = "#8C6035"
const ACCENT    = "#B8822A"
const BABY_BLUE = "#3FA3C8"
const BLUE_MID  = "#7BBEDD"
const GOLD      = "#B8822A"
const BLUSH     = "#EED4BC"
const IVORY     = "#FEF9F3"

const childName    = siteConfig.couple.child
const pnbQr        = siteConfig.giftRegistry.QR_2
const benefitPayQr = siteConfig.giftRegistry.QR_3

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
}

// ── Shared sub-components ─────────────────────────────────────────────────────
function OrnamentDivider({ blue = false }: { blue?: boolean }) {
  const color = blue ? BABY_BLUE : ACCENT
  const grad  = blue ? "rgba(126,200,227,0.4)" : "rgba(207,160,107,0.4)"
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to left, ${grad}, transparent)` }} />
      <span style={{ color, fontSize: "7px", opacity: 0.75 }}>✦</span>
      <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to right, ${grad}, transparent)` }} />
    </div>
  )
}

function SectionLabel({ text }: { text: string }) {
  return (
    <p className="garamond" style={{ fontSize: "clamp(0.54rem, 2vw, 0.7rem)", letterSpacing: "0.48em", textTransform: "uppercase", color: BABY_BLUE, marginBottom: "0.4rem", paddingRight: "0.48em" }}>
      {text}
    </p>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="gistesy mt-2" style={{ fontSize: "clamp(2rem, 9vw, 4rem)", color: DEEP, lineHeight: 1.15, overflow: "visible", paddingTop: "0.1em" }}>
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
      className="rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      style={{
        background: "rgba(254,249,243,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(184,130,42,0.16)",
        boxShadow: "0 6px 28px rgba(61,40,16,0.09), 0 2px 8px rgba(61,40,16,0.05)",
      }}
    >
      <div className="flex flex-col items-center mb-4">
        <div className="w-11 h-11 rounded-full flex items-center justify-center mb-2.5 shadow-sm"
          style={{ background: "rgba(63,163,200,0.12)", border: `1.5px solid rgba(123,190,221,0.45)` }}>
          {icon}
        </div>
        <p className="garamond text-center" style={{ fontSize: "clamp(0.54rem, 1.8vw, 0.64rem)", letterSpacing: "0.38em", textTransform: "uppercase", color: BABY_BLUE, marginBottom: "0.2rem", paddingRight: "0.38em" }}>
          {eyebrow}
        </p>
        <h4 className="gistesy text-center" style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)", color: DEEP, lineHeight: 1.1, paddingTop: "0.1em" }}>
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

// ── QR Card ───────────────────────────────────────────────────────────────────
function QrCard({ src, label, accountNumber, onExpand }: {
  src: string; label: string; accountNumber: string; onExpand?: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 w-full">
      <div
        className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border-2 shadow-md transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-lg"
        style={{ background: "#fff", borderColor: BLUE_MID }}
      >
        <Image src={src} alt={`${label} QR code`} fill className="object-contain p-2" sizes="160px" />
        {onExpand && (
          <div className="absolute inset-0 flex items-end justify-center pb-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18), transparent)" }}>
            <span className="garamond px-3 py-0.5 rounded-full text-white" style={{ fontSize: "0.6rem", letterSpacing: "0.06em", background: "rgba(0,0,0,0.38)" }}>
              tap to enlarge
            </span>
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="garamond font-semibold" style={{ fontSize: "clamp(0.82rem, 2.5vw, 0.95rem)", color: DEEP }}>{label}</p>
        <p className="garamond mt-0.5" style={{ fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)", color: `${DEEP}88` }}>{accountNumber}</p>
        {onExpand && (
          <p className="garamond mt-1" style={{ fontSize: "clamp(0.58rem, 1.6vw, 0.66rem)", color: BABY_BLUE, opacity: 0.75, letterSpacing: "0.06em" }}>
            ↑ tap to scan
          </p>
        )}
      </div>
    </div>
  )
}

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 380, h: 380, top: "5%",  left: "2%",  color: BABY_BLUE, opacity: 0.09, blur: 100 },
    { w: 260, h: 260, top: "20%", left: "70%", color: GOLD,      opacity: 0.09, blur: 80  },
    { w: 300, h: 300, top: "52%", left: "10%", color: BLUSH,     opacity: 0.12, blur: 90  },
    { w: 220, h: 220, top: "68%", left: "74%", color: BABY_BLUE, opacity: 0.09, blur: 70  },
    { w: 180, h: 180, top: "38%", left: "44%", color: GOLD,      opacity: 0.07, blur: 60  },
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
  const [showQrModal, setShowQrModal] = useState<{ src: string; label: string; accountNumber: string } | null>(null)
  const receptionImages = siteConfig.reception.image

  useEffect(() => {
    if (receptionImages.length <= 1) return
    const timer = setInterval(() => setCurrentReceptionImageIndex((p) => (p + 1) % receptionImages.length), 3000)
    return () => clearInterval(timer)
  }, [receptionImages.length])

  useEffect(() => {
    if (!showQrModal) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowQrModal(null) }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = "" }
  }, [showQrModal])

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
      <p className="garamond" style={{ fontSize: "clamp(0.58rem, 2vw, 0.72rem)", letterSpacing: "0.4em", textTransform: "uppercase", color: BABY_BLUE, marginBottom: "0.4rem", paddingRight: "0.4em" }}>
        {dayLabel}
      </p>
      <p className="gistesy" style={{ fontSize: "clamp(2rem, 8vw, 3.6rem)", color: MEDIUM, lineHeight: 1.1, paddingTop: "0.1em" }}>
        {new Date(dateStr).toLocaleString("default", { month: "long" })}
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-3">
        <p className="amsterdam-one" style={{ fontSize: "clamp(2.5rem, 10vw, 5rem)", color: DEEP, lineHeight: 1 }}>
          {new Date(dateStr).getDate()}
        </p>
        <div className="h-10 sm:h-14 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${BABY_BLUE}, transparent)` }} />
        <p className="garamond" style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)", color: DEEP, lineHeight: 1, fontWeight: 300 }}>
          {new Date(dateStr).getFullYear()}
        </p>
      </div>
      <OrnamentDivider blue />
      <p className="garamond mt-3" style={{ fontSize: "clamp(0.9rem, 3vw, 1.1rem)", color: DEEP, letterSpacing: "0.1em" }}>
        {timeLabel}
      </p>
    </div>
  )

  // ── Location block ───────────────────────────────────────────────────────────
  const renderLocationBlock = (venueName: string, address: string, mapsLink: string, copyId: string, fullVenue: string) => (
    <div
      className="rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5"
      style={{
        background: "rgba(213,238,248,0.45)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid rgba(123,190,221,0.40)",
        boxShadow: "0 3px 14px rgba(63,163,200,0.08)",
      }}
    >
      <div className="flex items-start gap-3">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: BABY_BLUE }} />
        <div className="flex-1 min-w-0">
          <p className="garamond" style={{ fontSize: "clamp(0.58rem, 1.8vw, 0.68rem)", letterSpacing: "0.32em", textTransform: "uppercase", color: BABY_BLUE, marginBottom: "0.3rem", paddingRight: "0.32em" }}>
            Location
          </p>
          <p className="garamond" style={{ fontSize: "clamp(0.82rem, 2.8vw, 1rem)", color: DEEP, lineHeight: 1.5 }}>{venueName}</p>
          <p className="garamond" style={{ fontSize: "clamp(0.7rem, 2.2vw, 0.84rem)", color: `${DEEP}99`, lineHeight: 1.5 }}>{address}</p>
        </div>
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="p-1.5 sm:p-2 rounded-lg border shadow-sm" style={{ background: "#fff", borderColor: BLUE_MID }}>
            <QRCodeSVG value={mapsLink} size={72} level="M" includeMargin={false} fgColor={DEEP} bgColor="#ffffff" />
          </div>
          <p className="garamond text-center" style={{ fontSize: "clamp(0.58rem, 1.6vw, 0.66rem)", color: `${DEEP}80`, fontStyle: "italic", maxWidth: "72px" }}>
            Scan for map
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button onClick={() => openInMaps(mapsLink)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:opacity-90 hover:scale-[1.01] active:scale-[0.98]"
          style={{ background: BABY_BLUE, color: "#fff" }}>
          <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="garamond" style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.88rem)", letterSpacing: "0.05em" }}>Get Directions</span>
        </button>
        <button onClick={() => copyToClipboard(fullVenue, copyId)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
          style={{ background: "#fff", borderColor: BLUE_MID, color: DEEP }}>
          {copiedItems.has(copyId) ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 flex-shrink-0" />}
          <span className="garamond" style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.88rem)", letterSpacing: "0.05em" }}>
            {copiedItems.has(copyId) ? "Copied!" : "Copy Address"}
          </span>
        </button>
      </div>
    </div>
  )

  return (
    <Section id="details" className="relative py-16 sm:py-20 md:py-24 overflow-hidden" bgColor="none">

      {/* ── Solid base ── */}
      <div className="absolute inset-0 -z-10" style={{ background: IVORY }} />

      {/* Soft tinted gradient layer */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `
          linear-gradient(180deg,
            rgba(215,237,248,0.45) 0%,
            rgba(251,244,234,0.0)  25%,
            rgba(213,238,248,0.30) 50%,
            rgba(251,244,234,0.0)  75%,
            rgba(238,212,188,0.35) 100%
          )
        `,
      }} />

      {/* Fine diagonal shimmer */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `repeating-linear-gradient(
          125deg,
          transparent 0px,
          transparent 160px,
          rgba(255,255,255,0.22) 160px,
          rgba(255,255,255,0.22) 162px
        )`,
      }} />

      <BokehOrbs />

      {/* Center radial glow */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 28%, rgba(63,163,200,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 38% 32% at 50% 78%, rgba(184,130,42,0.08) 0%, transparent 65%)
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
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to left, ${GOLD}88, transparent)` }} />
          <span style={{ color: GOLD, fontSize: "8px", opacity: 0.9 }}>✦</span>
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to right, ${GOLD}88, transparent)` }} />
        </div>
        <h2 className="gistesy mt-1" style={{ fontSize: "clamp(2.6rem, 11vw, 5.5rem)", color: DEEP, lineHeight: 1.1, overflow: "visible", paddingTop: "0.1em", marginBottom: "0.5rem" }}>
          Day of Grace
        </h2>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-6 sm:w-10" style={{ background: `linear-gradient(to left, ${BLUE_MID}cc, transparent)` }} />
          <span style={{ color: BLUE_MID, fontSize: "4px" }}>◆◆◆</span>
          <div className="h-px w-6 sm:w-10" style={{ background: `linear-gradient(to right, ${BLUE_MID}cc, transparent)` }} />
        </div>
        <p className="garamond" style={{ fontSize: "clamp(0.78rem, 2.8vw, 0.96rem)", color: MEDIUM, fontStyle: "italic", lineHeight: 1.9, maxWidth: "460px", margin: "0 auto" }}>
          Every sacred detail, lovingly prepared for the blessed celebration of {childName}&apos;s Christening.
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
            background: "rgba(254,249,243,0.88)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(184,130,42,0.20)",
            boxShadow: "0 16px 52px rgba(61,40,16,0.13), 0 4px 14px rgba(61,40,16,0.07)",
          }}>
          <div className="relative w-full h-56 sm:h-64 md:h-80 overflow-hidden">
            <Image src={siteConfig.ceremony.image} alt={siteConfig.ceremony.location} fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 right-4">
              <p className="garamond" style={{ fontSize: "clamp(0.52rem, 1.8vw, 0.66rem)", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,247,240,0.72)", marginBottom: "0.2rem" }}>
                Christening Venue
              </p>
              <h3 className="gistesy" style={{ fontSize: "clamp(1.5rem, 5.5vw, 2.6rem)", color: "#FEF9F3", lineHeight: 1.1, overflow: "visible", paddingTop: "0.1em" }}>
                {siteConfig.ceremony.location}
              </h3>
              <p className="garamond" style={{ fontSize: "clamp(0.68rem, 2.3vw, 0.84rem)", color: "rgba(255,247,240,0.82)", marginTop: "0.15rem" }}>
                {siteConfig.ceremony.venue}
              </p>
            </div>
          </div>
          <div
            className="p-4 sm:p-6 md:p-8"
            style={{
              background: "rgba(254,249,243,0.92)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {renderDateBlock(siteConfig.ceremony.date, siteConfig.ceremony.day, siteConfig.ceremony.time)}
            {/* <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-5 -mt-2">
              {[
                { icon: Users,    label: "Guests arrive",   time: siteConfig.ceremony.guestsTime },
                { icon: Sparkles, label: "Ceremony starts", time: siteConfig.ceremony.time },
              ].map(({ icon: Icon, label, time }) => (
                <div key={label} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(213,238,248,0.55)", border: `1px solid rgba(123,190,221,0.45)` }}>
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: BABY_BLUE }} />
                  <span className="garamond text-[0.72rem] sm:text-sm" style={{ color: `${DEEP}bb` }}>{label}</span>
                  <span className="garamond text-[0.72rem] sm:text-sm font-semibold" style={{ color: DEEP }}>{time}</span>
                </div>
              ))}
            </div> */}
            {renderLocationBlock(ceremonyVenueName, ceremonyAddress, ceremonyMapsLink, "ceremony", ceremonyVenue)}
            <button onClick={() => window.open(ceremonyCalendarUrl, "_blank", "noopener,noreferrer")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
              style={{ background: "rgba(213,238,248,0.55)", border: `1px solid rgba(123,190,221,0.45)`, color: DEEP }}>
              <CalendarPlus className="w-4 h-4 flex-shrink-0" style={{ color: BABY_BLUE }} />
              <span className="garamond" style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.88rem)", letterSpacing: "0.05em" }}>Add to Calendar</span>
            </button>
          </div>
        </motion.div>

        {/* Reception */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
          className="relative group rounded-3xl overflow-hidden transition-all duration-300"
          style={{
            background: "rgba(254,249,243,0.88)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(184,130,42,0.20)",
            boxShadow: "0 16px 52px rgba(61,40,16,0.13), 0 4px 14px rgba(61,40,16,0.07)",
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
              <p className="garamond" style={{ fontSize: "clamp(0.52rem, 1.8vw, 0.66rem)", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,247,240,0.72)", marginBottom: "0.2rem" }}>
                Reception Venue
              </p>
              <h3 className="gistesy" style={{ fontSize: "clamp(1.5rem, 5.5vw, 2.6rem)", color: "#FEF9F3", lineHeight: 1.1, overflow: "visible", paddingTop: "0.1em" }}>
                {siteConfig.reception.location}
              </h3>
              <p className="garamond" style={{ fontSize: "clamp(0.68rem, 2.3vw, 0.84rem)", color: "rgba(255,247,240,0.82)", marginTop: "0.15rem" }}>
                {siteConfig.reception.venue}
              </p>
            </div>
          </div>
          <div
            className="p-4 sm:p-6 md:p-8"
            style={{
              background: "rgba(254,249,243,0.92)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            <div className="text-center mb-5">
              <p className="garamond" style={{ fontSize: "clamp(0.58rem, 2vw, 0.72rem)", letterSpacing: "0.4em", textTransform: "uppercase", color: BABY_BLUE, marginBottom: "0.3rem", paddingRight: "0.4em" }}>
                Starts at
              </p>
              <p className="garamond" style={{ fontSize: "clamp(0.9rem, 3vw, 1.1rem)", color: DEEP, letterSpacing: "0.1em" }}>
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
          <OrnamentDivider blue />
          <SectionTitle>Guest Attire</SectionTitle>
        </div>

        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(254,249,243,0.85)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(184,130,42,0.18)",
            boxShadow: "0 12px 40px rgba(61,40,16,0.10), 0 3px 10px rgba(61,40,16,0.05)",
          }}
        >
          {/* Gold+blue accent top stripe */}
          {/* <div className="h-[3px] w-full" style={{ background: `linear-gradient(to right, ${GOLD}, ${BABY_BLUE}, ${BLUE_MID})` }} /> */}

          {/* Two role cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Godparents */}
            <div
              className="p-5 sm:p-6 flex flex-col items-center text-center gap-3 border-b sm:border-b-0 sm:border-r"
              style={{ background: "rgba(254,252,248,0.70)", borderColor: "rgba(184,130,42,0.12)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm" style={{ background: "rgba(255,255,255,0.95)", borderColor: "rgba(184,130,42,0.25)" }}>
                <Shirt className="w-5 h-5" style={{ color: GOLD }} />
              </div>
              <div>
                <p className="garamond uppercase mb-1" style={{ fontSize: "clamp(0.52rem, 1.8vw, 0.62rem)", letterSpacing: "0.42em", color: BABY_BLUE }}>Godparents</p>
                <h4 className="gistesy" style={{ fontSize: "clamp(1.3rem, 4.5vw, 1.8rem)", color: DEEP, lineHeight: 1.1 }}>Semi-Formal</h4>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.85)", border: "1px solid rgba(184,130,42,0.20)" }}>
                <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(184,130,42,0.30)" }} />
                <span className="garamond" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)", color: DEEP }}>White attire</span>
              </div>
              <p className="garamond" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: MEDIUM, lineHeight: 1.7 }}>
                Godparents are kindly requested to wear semi-formal attire in white.
              </p>
            </div>

            {/* Guests */}
            <div
              className="p-5 sm:p-6 flex flex-col items-center text-center gap-3"
              style={{ background: "rgba(213,238,248,0.35)" }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm" style={{ background: "rgba(63,163,200,0.12)", borderColor: "rgba(123,190,221,0.5)" }}>
                <Shirt className="w-5 h-5" style={{ color: BABY_BLUE }} />
              </div>
              <div>
                <p className="garamond uppercase mb-1" style={{ fontSize: "clamp(0.52rem, 1.8vw, 0.62rem)", letterSpacing: "0.42em", color: BABY_BLUE }}>Guests</p>
                <h4 className="gistesy" style={{ fontSize: "clamp(1.3rem, 4.5vw, 1.8rem)", color: DEEP, lineHeight: 1.1 }}>Any Shade of Blue</h4>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {["#B8DFF0", "#7EC8E3", "#4CA9D0", "#2E86AB", "#1A6B9A"].map((c) => (
                  <div key={c} className="w-6 h-6 rounded-full border-2 border-white shadow-sm ring-1 ring-sky-200" style={{ backgroundColor: c }} />
                ))}
              </div>
              <p className="garamond" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.9rem)", color: MEDIUM, lineHeight: 1.7 }}>
                Guests are warmly invited to wear any shade of blue.
              </p>
            </div>
          </div>

          {/* Attire palette image */}
          <div
            className="p-4 sm:p-6 border-t"
            style={{ background: "rgba(213,238,248,0.28)", borderColor: "rgba(123,190,221,0.30)" }}
          >
            {/* <div className="flex items-center justify-center gap-2 mb-4">
              <p className="garamond uppercase" style={{ fontSize: "clamp(0.52rem, 1.8vw, 0.64rem)", letterSpacing: "0.42em", color: BABY_BLUE }}>Color Reference</p>
            </div> */}
            {/* <div className="relative w-full aspect-[5/4] sm:aspect-[4/3] max-w-xl mx-auto rounded-xl overflow-hidden border" style={{ borderColor: BLUE_MID }}>
              <Image src={siteConfig.dressCode.guests.photo} alt="Guest attire palette" fill
                className="object-contain bg-white/60 p-2 sm:p-3"
                sizes="(max-width: 640px) 95vw, (max-width: 1024px) 85vw, 672px" />
            </div> */}
            {/* <p className="garamond text-center mt-4 leading-relaxed max-w-lg mx-auto" style={{ fontSize: "clamp(0.8rem, 2.5vw, 0.95rem)", color: `${DEEP}bb` }}>
              {siteConfig.dressCode.guests.notes}
            </p> */}
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          GIFT NOTE
      ══════════════════════════════════════════════════════════════ */}
      <motion.div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16"
        custom={3} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
        <div className="text-center mb-6">
          <SectionLabel text="A Loving Thought" />
          <OrnamentDivider blue />
          <SectionTitle>Gift Note</SectionTitle>
        </div>

        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(254,249,243,0.88)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(184,130,42,0.20)",
            boxShadow: "0 16px 48px rgba(61,40,16,0.12), 0 4px 12px rgba(61,40,16,0.06)",
          }}
        >

          {/* Message */}
          <div className="relative p-6 sm:p-9 text-center overflow-hidden" style={{ background: "rgba(213,238,248,0.30)" }}>
            {/* Decorative oversized quote marks */}
            <span className="absolute top-3 left-5 select-none pointer-events-none"
              style={{ fontSize: "5rem", lineHeight: 1, color: BABY_BLUE, opacity: 0.07, fontFamily: "Georgia, serif" }}>
              &#8220;
            </span>
            <span className="absolute bottom-3 right-5 select-none pointer-events-none"
              style={{ fontSize: "5rem", lineHeight: 1, color: BABY_BLUE, opacity: 0.07, fontFamily: "Georgia, serif" }}>
              &#8221;
            </span>

            {/* Gift icon with glow */}
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-md mx-auto mb-5"
              style={{
                background: "rgba(63,163,200,0.12)",
                border: "2px solid rgba(123,190,221,0.55)",
                boxShadow: "0 0 22px rgba(63,163,200,0.18), 0 2px 8px rgba(63,163,200,0.10)",
              }}
            >
              <Gift className="w-6 h-6" style={{ color: BABY_BLUE }} />
            </div>

            <p className="garamond leading-relaxed mb-3 max-w-xl mx-auto" style={{ fontSize: "clamp(0.92rem, 2.8vw, 1.05rem)", color: DEEP, lineHeight: 1.95, fontStyle: "italic" }}>
              "Your love, prayers, and presence are the greatest gifts I could ever receive."
            </p>
            <p className="garamond leading-relaxed max-w-xl mx-auto" style={{ fontSize: "clamp(0.84rem, 2.6vw, 0.98rem)", color: `${DEEP}bb`, lineHeight: 1.9 }}>
              Should you wish to bless me with something more, Mommy and Daddy would sincerely appreciate a small contribution toward my future and the many adventures waiting for me ahead.
            </p>
          </div>

          {/* Ways to bless */}
          <div className="p-5 sm:p-7 border-t" style={{ background: "rgba(254,249,243,0.82)", borderColor: "rgba(184,130,42,0.14)" }}>
            {/* Section label with side lines */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, rgba(63,163,200,0.35))` }} />
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" style={{ color: BABY_BLUE, opacity: 0.7 }} />
                <p className="garamond uppercase" style={{ fontSize: "clamp(0.52rem, 1.8vw, 0.66rem)", letterSpacing: "0.44em", color: BABY_BLUE }}>
                  Ways to Bless Me
                </p>
                <Sparkles className="w-3 h-3" style={{ color: BABY_BLUE, opacity: 0.7 }} />
              </div>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, rgba(63,163,200,0.35))` }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {/* Envelope */}
              <div
                className="flex flex-col items-center gap-3 p-5 rounded-2xl text-center"
                style={{ background: "rgba(213,238,248,0.38)", border: "1px solid rgba(123,190,221,0.38)" }}
              >
                <div
                  className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-2"
                  style={{ borderColor: "rgba(123,190,221,0.50)", background: "rgba(255,255,255,0.92)" }}
                >
                  <Mail className="w-9 h-9" style={{ color: BABY_BLUE, opacity: 0.75 }} />
                  <p className="garamond" style={{ fontSize: "clamp(0.60rem, 1.6vw, 0.68rem)", color: `${DEEP}88`, letterSpacing: "0.06em" }}>on the day</p>
                </div>
                <div className="text-center">
                  <p className="garamond font-semibold" style={{ fontSize: "clamp(0.82rem, 2.5vw, 0.95rem)", color: DEEP }}>Envelope</p>
                  <p className="garamond mt-1" style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.84rem)", color: `${DEEP}99`, lineHeight: 1.6 }}>
                    A little envelope shared personally on my special day
                  </p>
                </div>
              </div>

              {/* PNB */}
              <div
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:shadow-md"
                style={{ background: "rgba(213,238,248,0.38)", border: "1px solid rgba(123,190,221,0.38)" }}
                onClick={() => setShowQrModal({ src: pnbQr.src, label: pnbQr.label, accountNumber: pnbQr.accountNumber })}
              >
                <QrCard src={pnbQr.src} label={pnbQr.label} accountNumber={pnbQr.accountNumber}
                  onExpand={() => setShowQrModal({ src: pnbQr.src, label: pnbQr.label, accountNumber: pnbQr.accountNumber })} />
              </div>

              {/* BenefitPay */}
              <div
                className="group flex flex-col items-center gap-3 p-5 rounded-2xl text-center cursor-pointer transition-all duration-300 hover:shadow-md"
                style={{ background: "rgba(213,238,248,0.38)", border: "1px solid rgba(123,190,221,0.38)" }}
                onClick={() => setShowQrModal({ src: benefitPayQr.src, label: benefitPayQr.label, accountNumber: benefitPayQr.accountNumber })}
              >
                <QrCard src={benefitPayQr.src} label={benefitPayQr.label} accountNumber={benefitPayQr.accountNumber}
                  onExpand={() => setShowQrModal({ src: benefitPayQr.src, label: benefitPayQr.label, accountNumber: benefitPayQr.accountNumber })} />
              </div>
            </div>
          </div>

          {/* Thank you note */}
          <div className="px-5 sm:px-8 py-5 text-center border-t" style={{ background: "rgba(213,238,248,0.28)", borderColor: "rgba(123,190,221,0.30)" }}>
            <div className="flex items-center justify-center gap-1.5 mb-2">
              {[0.45, 0.65, 0.85].map((op, i) => (
                <Heart key={i} className="w-3 h-3" fill={BABY_BLUE} style={{ color: BABY_BLUE, opacity: op }} />
              ))}
            </div>
            <p className="garamond" style={{ fontSize: "clamp(0.82rem, 2.5vw, 0.95rem)", color: `${DEEP}cc`, fontStyle: "italic", lineHeight: 1.8 }}>
              Thank you for your kindness, love, and generosity toward my future adventures.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          GENTLE REMINDERS
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <SectionLabel text="A Few Kind Notes" />
          <OrnamentDivider blue />
          <SectionTitle>Gentle Reminders</SectionTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <ReminderCard eyebrow="A Sacred Moment" title="Unplugged Christening"
            icon={<Camera className="w-5 h-5" style={{ color: BABY_BLUE }} />} index={0}>
            <p className="garamond text-center" style={{ fontSize: "clamp(0.82rem, 2.8vw, 0.95rem)", color: `${DEEP}cc`, lineHeight: 1.85 }}>
              We are hosting a mostly unplugged christening. You are welcome to take a few photos, but please keep it minimal and avoid blocking our official photographer so every precious moment is beautifully captured. Photos will be shared after the celebration.
            </p>
          </ReminderCard>

          <ReminderCard eyebrow="Be On Time" title="Arrival"
            icon={<Clock className="w-5 h-5" style={{ color: BABY_BLUE }} />} index={1}>
            <p className="garamond text-center" style={{ fontSize: "clamp(0.82rem, 2.8vw, 0.95rem)", color: `${DEEP}cc`, lineHeight: 1.85 }}>
              Please arrive at least 30 minutes early. The ceremony begins at{" "}
              <span style={{ color: DEEP, fontWeight: 600 }}>{siteConfig.ceremony.time}</span>, so kindly be seated by{" "}
              <span style={{ color: DEEP, fontWeight: 600 }}>{siteConfig.ceremony.guestsTime}</span>.
            </p>
          </ReminderCard>
{/* 
          <ReminderCard eyebrow="Kind Request" title="Dear Ninongs & Ninangs"
            icon={<Heart className="w-5 h-5" style={{ color: BABY_BLUE }} fill={BABY_BLUE} />} index={2}>
            <p className="garamond text-center" style={{ fontSize: "clamp(0.82rem, 2.8vw, 0.95rem)", color: `${DEEP}cc`, lineHeight: 1.85 }}>
              We kindly ask for a{" "}
              <span style={{ color: DEEP, fontWeight: 600 }}>PHP 200 church fee</span>{" "}
              to help with the ceremony. Payment via GCash is welcome.
            </p>
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden border shadow-sm" style={{ background: "#fff", borderColor: BLUE_MID }}>
                <Image src={gcashQr.src} alt={`${gcashQr.label} QR code`} fill className="object-contain p-2" sizes="144px" />
              </div>
              <p className="garamond text-xs sm:text-sm" style={{ color: `${DEEP}88` }}>{gcashQr.accountNumber}</p>
            </div>
          </ReminderCard> */}

          {/* Baby Health Note */}
          <ReminderCard eyebrow="A Little Note from Me" title="Baby's Health"
            icon={<Baby className="w-5 h-5" style={{ color: BABY_BLUE }} />} index={3}>
            <div className="garamond text-center space-y-2" style={{ fontSize: "clamp(0.82rem, 2.8vw, 0.95rem)", color: `${DEEP}cc`, lineHeight: 1.85 }}>
              <p>My immune system is still tiny and growing, so please come only if you&apos;re feeling healthy and well.</p>
              <p>Please sanitize your hands before carrying me and kindly avoid kissing me for now.</p>
              <p style={{ color: DEEP }}>Thank you for helping keep me safe on my special day! 🤍</p>
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
            background: "rgba(254,249,243,0.88)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1px solid rgba(184,130,42,0.20)",
            boxShadow: "0 12px 44px rgba(61,40,16,0.11), 0 3px 12px rgba(61,40,16,0.05)",
          }}
        >
          {/* Gold+blue accent stripe */}
          {/* <div className="h-[3px] w-full rounded-full mb-6 mx-auto max-w-[160px]" style={{ background: `linear-gradient(to right, ${GOLD}, ${BABY_BLUE}, ${BLUE_MID})` }} /> */}
          {/* Top ornament */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${GOLD}70, transparent)` }} />
            <Heart className="w-5 h-5" fill={BABY_BLUE} style={{ color: BABY_BLUE, filter: `drop-shadow(0 0 6px rgba(63,163,200,0.45))` }} />
            <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${GOLD}70, transparent)` }} />
          </div>

          <p className="garamond mb-4" style={{ fontSize: "clamp(0.92rem, 3vw, 1.1rem)", color: `${DEEP}cc`, lineHeight: 1.95, fontStyle: "italic" }}>
            Thank you for being part of the story God wrote for our family.
          </p>

          <p className="gistesy" style={{ fontSize: "clamp(1.8rem, 7vw, 3rem)", color: DEEP, lineHeight: 1.1, overflow: "visible", paddingTop: "0.1em" }}>
            With love,
          </p>
          <p className="amsterdam-one" style={{ fontSize: "clamp(2.2rem, 9vw, 3.8rem)", color: BABY_BLUE, lineHeight: 1.1, marginTop: "0.2rem" }}>
            Kaezar
          </p>

          {/* Bottom ornament */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${GOLD}70, transparent)` }} />
            <ShieldCheck className="w-5 h-5" style={{ color: BABY_BLUE, opacity: 0.7 }} />
            <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${GOLD}70, transparent)` }} />
          </div>
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════════════════════════
          QR MODAL
      ══════════════════════════════════════════════════════════════ */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300"
          style={{ backgroundColor: "rgba(30,52,64,0.88)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
          onClick={() => setShowQrModal(null)}
          role="dialog" aria-modal="true" aria-label="QR code"
        >
          <div
            className="relative w-full max-w-xs rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(254,249,243,0.97)",
              border: `2px solid ${BABY_BLUE}`,
              boxShadow: `0 0 60px rgba(63,163,200,0.22), 0 24px 48px rgba(30,52,64,0.35)`,
            }}
          >
            {/* Gradient stripe */}
            {/* <div className="h-[3px] w-full" style={{ background: `linear-gradient(to right, ${GOLD}, ${BABY_BLUE}, ${BLUE_MID})` }} /> */}

            {/* Close */}
            <button
              onClick={() => setShowQrModal(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-xl border transition-all duration-200 hover:scale-110 active:scale-95"
              style={{ background: "rgba(213,238,248,0.70)", borderColor: "rgba(123,190,221,0.55)", color: BABY_BLUE }}
              title="Close (ESC)"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="pt-6 pb-3 px-6 text-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "rgba(63,163,200,0.12)", border: `1.5px solid rgba(123,190,221,0.50)` }}>
                <Gift className="w-4 h-4" style={{ color: BABY_BLUE }} />
              </div>
              <p className="garamond uppercase" style={{ fontSize: "clamp(0.52rem, 1.8vw, 0.64rem)", letterSpacing: "0.44em", color: BABY_BLUE }}>
                Scan to Bless
              </p>
              <p className="gistesy mt-1" style={{ fontSize: "clamp(1.6rem, 6vw, 2.4rem)", color: DEEP, lineHeight: 1.1 }}>
                {showQrModal.label}
              </p>
            </div>

            {/* QR image */}
            <div className="px-8 pb-2 flex items-center justify-center">
              <div
                className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 shadow-md"
                style={{ background: "#fff", borderColor: "rgba(123,190,221,0.60)" }}
              >
                <Image
                  src={showQrModal.src}
                  alt={`${showQrModal.label} QR code`}
                  fill className="object-contain p-3"
                  sizes="320px" priority
                />
              </div>
            </div>

            {/* Account / footer */}
            <div className="px-6 pt-3 pb-6 text-center">
              <p className="garamond" style={{ fontSize: "clamp(0.76rem, 2.4vw, 0.88rem)", color: `${DEEP}99` }}>
                {showQrModal.accountNumber}
              </p>
              <p className="garamond mt-3 italic" style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.82rem)", color: `${DEEP}88`, lineHeight: 1.7 }}>
                Thank you for blessing little Kaezar's future.
              </p>
              <button
                onClick={() => setShowQrModal(null)}
                className="mt-4 garamond px-6 py-2 rounded-full text-white text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: `linear-gradient(135deg, ${BABY_BLUE}, ${BLUE_MID})`, fontSize: "clamp(0.72rem, 2.2vw, 0.82rem)", letterSpacing: "0.06em" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </Section>
  )
}
