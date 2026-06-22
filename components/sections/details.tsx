"use client"

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
import { C, roseLine, text } from "@/components/loader/christening-theme"
import { CornerFloralDecor, DiamondRule } from "@/components/loader/ChristeningDecor"
import { ChristeningParticles } from "@/components/loader/ChristeningParticles"

const childName = siteConfig.couple.child
const childFirst = childName.trim().split(" ")[0]

const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
}

const cardStyle = {
  background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 48%, ${C.champagne} 100%)`,
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
} as const

const innerPanelStyle = {
  background: C.ivory,
  borderTop: `1px solid ${C.blushDeep}`,
} as const

const goldAccentLine = `linear-gradient(to right, transparent, ${C.gold}, transparent)`

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p style={{
      fontFamily: '"Cinzel", serif',
      fontSize: "clamp(0.58rem, 2vw, 0.72rem)",
      fontWeight: 600,
      letterSpacing: "0.36em",
      textTransform: "uppercase",
      color: text.label,
      marginBottom: "0.5rem",
      paddingRight: "0.36em",
    }}>
      {children}
    </p>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 style={{
      fontFamily: '"Cinzel", serif',
      fontWeight: 700,
      fontSize: "clamp(1.8rem, 7vw, 3.2rem)",
      color: C.roseDeep,
      lineHeight: 1.15,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      marginTop: "0.5rem",
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
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden isolate"
      style={cardStyle}
    >
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "2px", background: goldAccentLine, opacity: 0.55 }} />
      <div className="flex flex-col items-center mb-4">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center mb-2.5"
          style={{ background: C.blushSoft, border: `1.5px solid ${C.blushDeep}` }}
        >
          {icon}
        </div>
        <p style={{
          fontFamily: '"Cinzel", serif',
          fontSize: "clamp(0.55rem, 1.8vw, 0.66rem)",
          fontWeight: 600,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: text.caption,
          marginBottom: "0.2rem",
          textAlign: "center",
        }}>
          {eyebrow}
        </p>
        <h4 style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          fontSize: "clamp(1.1rem, 4vw, 1.55rem)",
          color: C.roseDeep,
          lineHeight: 1.2,
          textAlign: "center",
        }}>
          {title}
        </h4>
      </div>
      {children}
    </motion.div>
  )
}

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

export function Details() {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [currentReceptionImageIndex, setCurrentReceptionImageIndex] = useState(0)
  const receptionImages = siteConfig.reception.image

  useEffect(() => {
    if (receptionImages.length <= 1) return
    const timer = setInterval(() => setCurrentReceptionImageIndex((p) => (p + 1) % receptionImages.length), 3000)
    return () => clearInterval(timer)
  }, [receptionImages.length])

  const copyToClipboard = async (textVal: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(textVal)
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

  const renderDateBlock = (dateStr: string, dayLabel: string, timeLabel: string) => (
    <div className="text-center mb-6 sm:mb-8">
      <p style={{
        fontFamily: '"Cinzel", serif',
        fontSize: "clamp(0.58rem, 2vw, 0.72rem)",
        fontWeight: 600,
        letterSpacing: "0.36em",
        textTransform: "uppercase",
        color: text.label,
        marginBottom: "0.4rem",
      }}>
        {dayLabel}
      </p>
      <p style={{
        fontFamily: '"LeJourScript", cursive',
        fontSize: "clamp(1.8rem, 7vw, 3.2rem)",
        color: C.goldDeep,
        lineHeight: 1.1,
      }}>
        {new Date(dateStr).toLocaleString("default", { month: "long" })}
      </p>
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-3">
        <p style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          fontSize: "clamp(2.4rem, 10vw, 4.8rem)",
          color: C.roseDeep,
          lineHeight: 1,
        }}>
          {new Date(dateStr).getDate()}
        </p>
        <div className="h-10 sm:h-14 w-px" style={{ background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)` }} />
        <p style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 500,
          fontSize: "clamp(1.1rem, 3.8vw, 1.8rem)",
          color: C.roseText,
          lineHeight: 1,
        }}>
          {new Date(dateStr).getFullYear()}
        </p>
      </div>
      <DiamondRule width="clamp(160px, 50vw, 220px)" margin="0 auto" />
      <p style={{
        fontFamily: '"Fahkwang", sans-serif',
        fontWeight: 500,
        fontSize: "clamp(0.92rem, 2.9vw, 1.08rem)",
        color: text.body,
        letterSpacing: "0.04em",
        marginTop: "0.75rem",
      }}>
        {timeLabel}
      </p>
    </div>
  )

  const renderLocationBlock = (locationName: string, address: string, mapsLink: string, copyId: string, fullVenue: string) => (
    <div className="rounded-2xl p-3 sm:p-4 mb-4 sm:mb-5 relative overflow-hidden" style={cardStyle}>
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "2px", background: goldAccentLine, opacity: 0.55 }} />
      <div className="flex items-start gap-3">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" style={{ color: C.goldDeep }} />
        <div className="flex-1 min-w-0">
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.55rem, 1.8vw, 0.66rem)",
            fontWeight: 600,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: text.caption,
            marginBottom: "0.3rem",
          }}>
            Location
          </p>
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 600,
            fontSize: "clamp(0.88rem, 2.9vw, 1.05rem)",
            color: C.roseDeep,
            lineHeight: 1.45,
            marginBottom: "0.25rem",
          }}>
            {locationName}
          </p>
          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontWeight: 400,
            fontSize: "clamp(0.82rem, 2.6vw, 0.96rem)",
            color: text.body,
            lineHeight: 1.55,
          }}>
            {address}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className="p-1.5 sm:p-2 rounded-lg border shadow-sm" style={{ background: C.pearl, borderColor: C.blushDeep }}>
            <QRCodeSVG value={mapsLink} size={72} level="M" includeMargin={false} fgColor={C.roseDeep} bgColor={C.pearl} />
          </div>
          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontSize: "clamp(0.62rem, 1.8vw, 0.72rem)",
            color: text.caption,
            fontStyle: "italic",
            maxWidth: "72px",
            textAlign: "center",
          }}>
            Scan for map
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          onClick={() => openInMaps(mapsLink)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 hover:opacity-90 hover:scale-[1.01] active:scale-[0.98]"
          style={{
            background: C.roseDeep,
            color: C.pearl,
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.75rem, 2.4vw, 0.88rem)",
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Get Directions</span>
        </button>
        <button
          onClick={() => copyToClipboard(fullVenue, copyId)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
          style={{
            background: C.pearl,
            borderColor: C.blushDeep,
            color: C.roseDeep,
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.75rem, 2.4vw, 0.88rem)",
            fontWeight: 600,
            letterSpacing: "0.06em",
          }}
        >
          {copiedItems.has(copyId) ? <Check className="w-3.5 h-3.5 flex-shrink-0" /> : <Copy className="w-3.5 h-3.5 flex-shrink-0" />}
          <span>{copiedItems.has(copyId) ? "Copied!" : "Copy Address"}</span>
        </button>
      </div>
    </div>
  )

  return (
    <section
      id="details"
      className="relative overflow-hidden py-14 sm:py-20 md:py-24"
      style={{
        background: `linear-gradient(175deg, ${C.ivory} 0%, ${C.champagne} 30%, ${C.blushSoft} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 65% 50% at 50% 20%, rgba(255,253,249,0.92) 0%, transparent 70%),
            radial-gradient(ellipse 35% 28% at 12% 85%, rgba(245,221,224,0.40) 0%, transparent 70%),
            radial-gradient(ellipse 35% 28% at 88% 80%, rgba(232,196,204,0.32) 0%, transparent 70%)
          `,
        }}
      />

      <ChristeningParticles scoped opacity={0.35} />
      <CornerFloralDecor opacity={0.72} sizeClass="w-24 sm:w-36 md:w-44 lg:w-52" />

      {/* Section header */}
      <motion.div
        className="relative z-10 text-center mb-12 sm:mb-16 px-4 sm:px-6 max-w-lg mx-auto"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <SectionLabel>All You Need to Know</SectionLabel>
        <DiamondRule width="clamp(180px, 55vw, 260px)" margin="0 auto 0.75rem" />
        <h2 style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          fontSize: "clamp(2rem, 9vw, 4.2rem)",
          color: C.roseDeep,
          lineHeight: 1.1,
          marginBottom: "0.75rem",
          letterSpacing: "0.04em",
        }}>
          Day of Grace
        </h2>
        <DiamondRule width="clamp(160px, 50vw, 240px)" margin="0 auto" />
        <p style={{
          fontFamily: '"Fahkwang", sans-serif',
          fontWeight: 400,
          fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
          color: text.body,
          fontStyle: "italic",
          lineHeight: 1.85,
          maxWidth: "460px",
          margin: "0.9rem auto 0",
        }}>
          Every sacred detail, lovingly prepared for {childFirst}&apos;s blessed celebration.
        </p>
      </motion.div>

      {/* Venue cards */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16 space-y-8 sm:space-y-12">

        {/* Ceremony */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative group rounded-3xl overflow-hidden transition-all duration-300 isolate"
          style={cardStyle}
        >
          <div className="relative w-full h-56 sm:h-64 md:h-80 overflow-hidden">
            <Image
              src={siteConfig.ceremony.image}
              alt={siteConfig.ceremony.location}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(107,61,79,0.75)] via-[rgba(107,61,79,0.25)] to-transparent" />
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 right-4">
              <p style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.55rem, 1.8vw, 0.66rem)",
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: C.pearl,
                marginBottom: "0.2rem",
              }}>
                Christening Venue
              </p>
              <p style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                fontSize: "clamp(1rem, 3.2vw, 1.45rem)",
                color: C.pearl,
                lineHeight: 1.25,
                marginBottom: "0.25rem",
              }}>
                {siteConfig.ceremony.location}
              </p>
              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.75rem, 2.4vw, 0.92rem)",
                color: "rgba(255,253,249,0.92)",
                lineHeight: 1.5,
              }}>
                {siteConfig.ceremony.venue}
              </p>
            </div>
          </div>
          <div className="p-4 sm:p-6 md:p-8" style={innerPanelStyle}>
            {renderDateBlock(siteConfig.ceremony.date, siteConfig.ceremony.day, siteConfig.ceremony.time)}
            {renderLocationBlock(ceremonyVenueName, ceremonyAddress, ceremonyMapsLink, "ceremony", ceremonyVenue)}
            <button
              onClick={() => window.open(ceremonyCalendarUrl, "_blank", "noopener,noreferrer")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.98]"
              style={{
                background: C.pearl,
                border: `1.5px solid ${C.blushDeep}`,
                color: C.roseDeep,
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.75rem, 2.4vw, 0.88rem)",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              <CalendarPlus className="w-4 h-4 flex-shrink-0" style={{ color: C.goldDeep }} />
              <span>Add to Calendar</span>
            </button>
          </div>
        </motion.div>

        {/* Reception */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="relative group rounded-3xl overflow-hidden transition-all duration-300 isolate"
          style={cardStyle}
        >
          <div className="relative w-full h-56 sm:h-64 md:h-80 overflow-hidden">
            {receptionImages.map((src, idx) => (
              <div key={src} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentReceptionImageIndex ? "opacity-100" : "opacity-0"}`}>
                <Image
                  src={src}
                  alt={siteConfig.reception.location}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"
                  priority={idx === 0}
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(107,61,79,0.75)] via-[rgba(107,61,79,0.25)] to-transparent z-10" />
            {receptionImages.length > 1 && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
                {receptionImages.map((_, idx) => (
                  <span
                    key={idx}
                    className={`block h-1.5 rounded-full transition-all duration-300 ${idx === currentReceptionImageIndex ? "w-5" : "w-1.5"}`}
                    style={{ background: idx === currentReceptionImageIndex ? C.pearl : "rgba(255,253,249,0.45)" }}
                  />
                ))}
              </div>
            )}
            <div className="absolute bottom-4 left-4 md:bottom-5 md:left-5 right-4 z-20">
              <p style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.55rem, 1.8vw, 0.66rem)",
                fontWeight: 600,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(255,253,249,0.88)",
                marginBottom: "0.2rem",
              }}>
                Reception Venue
              </p>
              <p style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                fontSize: "clamp(1rem, 3.2vw, 1.45rem)",
                color: C.pearl,
                lineHeight: 1.25,
                marginBottom: "0.25rem",
              }}>
                {siteConfig.reception.location}
              </p>
              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.75rem, 2.4vw, 0.92rem)",
                color: "rgba(255,253,249,0.92)",
                lineHeight: 1.5,
              }}>
                {siteConfig.reception.venue}
              </p>
            </div>
          </div>
          <div className="p-4 sm:p-6 md:p-8" style={innerPanelStyle}>
            <div className="text-center mb-5">
              <p style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.58rem, 2vw, 0.72rem)",
                fontWeight: 600,
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: text.label,
                marginBottom: "0.3rem",
              }}>
                Starts at
              </p>
              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontWeight: 500,
                fontSize: "clamp(0.92rem, 2.9vw, 1.08rem)",
                color: text.body,
                letterSpacing: "0.04em",
              }}>
                {siteConfig.reception.time}
              </p>
            </div>
            {renderLocationBlock(receptionVenueName, receptionAddress, receptionMapsLink, "reception", receptionVenue)}
          </div>
        </motion.div>
      </div>

      {/* Dress code */}
      {/* <motion.div
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16"
        custom={2}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        <div className="text-center mb-6">
          <SectionLabel>What to Wear</SectionLabel>
          <DiamondRule width="clamp(160px, 50vw, 220px)" margin="0 auto 0.5rem" />
          <SectionTitle>Guest Attire</SectionTitle>
        </div>

        <div className="rounded-3xl overflow-hidden isolate" style={cardStyle}>
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div
              className="p-5 sm:p-6 flex flex-col items-center text-center gap-3 border-b sm:border-b-0 sm:border-r"
              style={{ background: C.pearl, borderColor: C.blushDeep }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm"
                style={{ background: C.blushSoft, borderColor: C.blushDeep }}
              >
                <Shirt className="w-5 h-5" style={{ color: C.goldDeep }} />
              </div>
              <div>
                <p style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(0.55rem, 1.8vw, 0.66rem)",
                  fontWeight: 600,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: text.caption,
                  marginBottom: "0.25rem",
                }}>
                  Godparents
                </p>
                <h4 style={{
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 700,
                  fontSize: "clamp(1.1rem, 4vw, 1.55rem)",
                  color: C.roseDeep,
                  lineHeight: 1.2,
                }}>
                  Semi-Formal
                </h4>
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: C.ivory, border: `1.5px solid ${C.blushDeep}` }}
              >
                <div className="w-4 h-4 rounded-full border shadow-sm" style={{ backgroundColor: C.pearl, borderColor: C.blushDeep }} />
                <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.82rem, 2.5vw, 0.96rem)", color: text.body, fontWeight: 500 }}>
                  White attire
                </span>
              </div>
              <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.82rem, 2.5vw, 0.96rem)", color: text.body, lineHeight: 1.75 }}>
                Godparents are kindly requested to wear semi-formal attire in white.
              </p>
            </div>

            <div className="p-5 sm:p-6 flex flex-col items-center text-center gap-3" style={{ background: C.blushSoft }}>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm"
                style={{ background: C.ivory, borderColor: C.blushDeep }}
              >
                <Shirt className="w-5 h-5" style={{ color: C.roseDeep }} />
              </div>
              <div>
                <p style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(0.55rem, 1.8vw, 0.66rem)",
                  fontWeight: 600,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: text.caption,
                  marginBottom: "0.25rem",
                }}>
                  Guests
                </p>
                <h4 style={{
                  fontFamily: '"Cinzel", serif',
                  fontWeight: 700,
                  fontSize: "clamp(1.1rem, 4vw, 1.55rem)",
                  color: C.roseDeep,
                  lineHeight: 1.2,
                }}>
                  Soft Blush &amp; Neutrals
                </h4>
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {[C.pearl, C.blushSoft, C.blush, C.blushDeep, C.dustyRose].map((c) => (
                  <div key={c} className="w-6 h-6 rounded-full border-2 shadow-sm" style={{ backgroundColor: c, borderColor: C.pearl }} />
                ))}
              </div>
              <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.82rem, 2.5vw, 0.96rem)", color: text.body, lineHeight: 1.75 }}>
                Guests are warmly invited to wear soft blush, champagne, or neutral tones.
              </p>
            </div>
          </div>
        </div>
      </motion.div> */}

      {/* Gentle reminders */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <SectionLabel>A Few Kind Notes</SectionLabel>
          <DiamondRule width="clamp(160px, 50vw, 220px)" margin="0 auto 0.5rem" />
          <SectionTitle>Gentle Reminders</SectionTitle>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <ReminderCard
            eyebrow="A Sacred Moment"
            title="Unplugged Christening"
            icon={<Camera className="w-5 h-5" style={{ color: C.goldDeep }} />}
            index={0}
          >
            <p className="text-center" style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.88rem, 2.7vw, 1rem)", color: text.body, lineHeight: 1.85 }}>
              We are hosting a mostly unplugged christening. You are welcome to take a few photos, but please keep it minimal and avoid blocking our official photographer so every precious moment is beautifully captured. Photos will be shared after the celebration.
            </p>
          </ReminderCard>

          <ReminderCard
            eyebrow="Be On Time"
            title="Arrival"
            icon={<Clock className="w-5 h-5" style={{ color: C.goldDeep }} />}
            index={1}
          >
            <p className="text-center" style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.88rem, 2.7vw, 1rem)", color: text.body, lineHeight: 1.85 }}>
              Please arrive at least 30 minutes early. The ceremony begins at{" "}
              <span style={{ color: C.roseDeep, fontWeight: 600 }}>{siteConfig.ceremony.time}</span>, so kindly be seated by{" "}
              <span style={{ color: C.roseDeep, fontWeight: 600 }}>{siteConfig.ceremony.guestsTime}</span>.
            </p>
          </ReminderCard>

          <ReminderCard
            eyebrow="A Little Note from Me"
            title="Baby's Health"
            icon={<Baby className="w-5 h-5" style={{ color: C.goldDeep }} />}
            index={3}
          >
            <div className="text-center space-y-2" style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.88rem, 2.7vw, 1rem)", color: text.body, lineHeight: 1.85 }}>
              <p>My immune system is still tiny and growing, so please come only if you&apos;re feeling healthy and well.</p>
              <p>Please sanitize your hands before carrying me and kindly avoid kissing me for now.</p>
              <p style={{ color: C.roseDeep, fontWeight: 500 }}>Thank you for helping keep me safe on my special day!</p>
            </div>
          </ReminderCard>
        </div>
      </div>

      {/* Closing message */}
      <motion.div
        className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 pb-6"
        custom={5}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        <div className="rounded-3xl p-6 sm:p-10 text-center overflow-hidden isolate relative" style={cardStyle}>
          <div className="absolute bottom-0 left-0 right-0" style={{ height: "2px", background: goldAccentLine, opacity: 0.55 }} />

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 sm:w-20" style={{ background: roseLine("left", 0.50) }} />
            <Heart className="w-5 h-5" fill={C.goldDeep} style={{ color: C.goldDeep }} />
            <div className="h-px w-12 sm:w-20" style={{ background: roseLine("right", 0.50) }} />
          </div>

          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontSize: "clamp(0.96rem, 2.9vw, 1.08rem)",
            color: text.body,
            lineHeight: 1.95,
            fontStyle: "italic",
            marginBottom: "1rem",
          }}>
            I can&apos;t wait to celebrate, smile, sleep through photos, and make beautiful memories with all of you!
          </p>

          <p style={{
            fontFamily: '"LeJourScript", cursive',
            fontSize: "clamp(1.6rem, 6.5vw, 2.8rem)",
            color: C.goldDeep,
            lineHeight: 1.1,
          }}>
            With love,
          </p>
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            fontSize: "clamp(1.6rem, 6.5vw, 2.8rem)",
            color: C.roseDeep,
            lineHeight: 1.15,
            marginTop: "0.25rem",
            letterSpacing: "0.04em",
          }}>
            {childFirst}
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="h-px w-12 sm:w-20" style={{ background: roseLine("left", 0.50) }} />
            <ShieldCheck className="w-5 h-5" style={{ color: C.goldDeep, opacity: 0.85 }} />
            <div className="h-px w-12 sm:w-20" style={{ background: roseLine("right", 0.50) }} />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
