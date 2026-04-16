"use client"

import { Section } from "@/components/section"
import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { siteConfig } from "@/content/site"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import {
  Shirt,
  Clock,
  Utensils,
  Copy,
  Check,
  Navigation,
  Heart,
  Camera,
  X,
  MapPin,
} from "lucide-react"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"

export function Details() {
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set())
  const [currentReceptionImageIndex, setCurrentReceptionImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState<string | null>(null)
  const receptionImages = siteConfig.reception.image

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReceptionImageIndex((prev) => (prev + 1) % receptionImages.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItems(prev => new Set(prev).add(itemId))
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(itemId)
          return newSet
        })
      }, 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Venue information from site config
  const ceremonyVenueName = siteConfig.ceremony.location
  const ceremonyAddress = siteConfig.ceremony.venue
  const ceremonyVenue = `${ceremonyVenueName}, ${ceremonyAddress}`
  const ceremonyMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ceremonyVenue)}`

  const receptionVenueName = siteConfig.reception.location
  const receptionAddress = siteConfig.reception.venue
  const receptionVenue = `${receptionVenueName}, ${receptionAddress}`
  const receptionMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(receptionVenue)}`

  const ceremonyLocation = ceremonyVenue
  const receptionLocation = receptionVenue
  const formattedCeremonyDate = siteConfig.ceremony.date
  const formattedReceptionDate = siteConfig.ceremony.date // reception follows ceremony on same day

  const openInMaps = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer')
  }


  return (
    <Section
      id="details"
      className="relative py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden bg-motif-cream"
    >
      {/* Semi-transparent overlay for better text readability */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.25]"
          style={{
            background: 'linear-gradient(165deg, var(--color-motif-cream) 0%, color-mix(in srgb, var(--color-motif-silver) 14%, transparent) 35%, color-mix(in srgb, var(--color-motif-medium) 6%, transparent) 70%, color-mix(in srgb, var(--color-motif-deep) 3%, transparent) 100%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 15%, var(--color-motif-silver) 0%, transparent 55%)' }}
        />
      </div>

      {/* Flower decoration - left bottom corner */}
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/balloons-half.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-65"
          // style={{ filter: DECO_FILTER }}
          priority={false}
        />
      </div>

      {/* Flower decoration - right bottom corner */}
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage
          src="/decoration/balloons-half.png"
          alt=""
          width={300}
          height={300}
          className="w-auto h-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] opacity-65 scale-x-[-1]"
          // style={{ filter: DECO_FILTER }}
          priority={false}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6">

        {/* Eyebrow */}
        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.56rem, 2.2vw, 0.72rem)",
            letterSpacing: "0.48em",
            textTransform: "uppercase",
            color: ACCENT,
            marginBottom: "0.5rem",
            paddingRight: "0.48em",
          }}
        >
          All You Need to Know
        </p>

        {/* Ornament */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.4), transparent)` }} />
          <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.7 }}>✦</span>
          <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.4), transparent)` }} />
        </div>

        {/* Title */}
        <h2
          className="gistesy"
          style={{
            fontSize: "clamp(2.6rem, 11vw, 5.5rem)",
            color: DEEP,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            textShadow: `0 2px 24px rgba(139,111,90,0.10)`,
            marginBottom: "0.6rem",
            overflow: "visible",
            paddingTop: "0.15em",
          }}
        >
          Day of Grace
        </h2>

        {/* Subtitle */}
        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.78rem, 2.8vw, 0.96rem)",
            color: MEDIUM,
            fontStyle: "italic",
            lineHeight: 1.85,
            maxWidth: "460px",
            margin: "0 auto clamp(0.6rem, 2vw, 1rem)",
          }}
        >
          Every sacred detail, lovingly prepared for this blessed celebration
          of Niahna Celestine's Christening.
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-10 sm:w-14" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.45), transparent)` }} />
          <span style={{ color: "#D4B896", fontSize: "5px" }}>◆</span>
          <div className="h-px w-10 sm:w-14" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.45), transparent)` }} />
        </div>
      </div>

      {/* Venue and Event Information */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12 md:mb-16 space-y-6 sm:space-y-10 md:space-y-14">
        
        {/* Ceremony Card */}
        <div className="relative group">
          {/* Subtle champagne glow on hover */}
          <div className="absolute -inset-1 bg-gradient-to-br from-motif-silver/22 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
          
          {/* Main card */}
          <div className="relative bg-motif-cream rounded-xl sm:rounded-2xl overflow-hidden border border-motif-deep/20  shadow-[0_16px_40px_rgba(0,0,0,0.18)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.24)] hover:border-motif-deep/80 transition-all duration-300">
            {/* Venue Image */}
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden">
              <CloudinaryImage
                src={siteConfig.ceremony.image}
                alt={siteConfig.ceremony.location}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              
              {/* Venue name overlay with warm gold accent */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 right-3 sm:right-4 md:right-6">
                <p className="garamond" style={{ fontSize: "clamp(0.55rem, 2vw, 0.7rem)", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,247,240,0.75)", marginBottom: "0.25rem" }}>
                  Christening Venue
                </p>
                <h3 className="gistesy" style={{ fontSize: "clamp(1.6rem, 6vw, 3rem)", color: "var(--color-motif-cream)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.1em" }}>
                  {siteConfig.ceremony.location}
                </h3>
                <p className="garamond" style={{ fontSize: "clamp(0.7rem, 2.5vw, 0.88rem)", color: "rgba(255,247,240,0.85)", letterSpacing: "0.04em", marginTop: "0.2rem" }}>
                  {siteConfig.ceremony.venue}
                </p>
              </div>
            </div>

            {/* Event Details Content */}
            <div className="p-3 sm:p-5 md:p-7 lg:p-9">
              {/* Date Section */}
              <div className="text-center mb-5 sm:mb-8 md:mb-10">
                {/* Day name */}
                <p className="garamond" style={{ fontSize: "clamp(0.6rem, 2.2vw, 0.75rem)", letterSpacing: "0.38em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.4rem", paddingRight: "0.38em" }}>
                  {siteConfig.ceremony.day}
                </p>

                {/* Month */}
                <div className="mb-2 sm:mb-4">
                  <p className="gistesy" style={{ fontSize: "clamp(2rem, 8vw, 4rem)", color: MEDIUM, lineHeight: 1.1, overflow: "visible", paddingTop: "0.1em" }}>
                    {new Date(siteConfig.ceremony.date).toLocaleString('default', { month: 'long' })}
                  </p>
                </div>

                {/* Day and Year */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-7">
                  <p className="amsterdam-one" style={{ fontSize: "clamp(2.5rem, 10vw, 5rem)", color: DEEP, lineHeight: 1 }}>
                    {new Date(siteConfig.ceremony.date).getDate()}
                  </p>
                  <div className="h-10 sm:h-12 md:h-16 w-[1px]" style={{ background: `linear-gradient(to bottom, transparent, ${ACCENT}, transparent)` }} />
                  <p className="garamond" style={{ fontSize: "clamp(1.2rem, 4vw, 2rem)", color: DEEP, lineHeight: 1, fontWeight: 300 }}>
                    {new Date(siteConfig.ceremony.date).getFullYear()}
                  </p>
                </div>

                {/* Ornament */}
                <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
                  <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.4), transparent)` }} />
                  <span style={{ color: ACCENT, fontSize: "6px", opacity: 0.65 }}>✦</span>
                  <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.4), transparent)` }} />
                </div>

                {/* Time */}
                <p className="garamond" style={{ fontSize: "clamp(0.9rem, 3vw, 1.15rem)", color: DEEP, letterSpacing: "0.1em" }}>
                  {siteConfig.ceremony.time}
                </p>
              </div>

              {/* Location Details */}
              <div className="bg-gradient-to-br from-motif-cream/40 to-motif-cream rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border border-motif-deep/15">
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-motif-deep mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="garamond" style={{ fontSize: "clamp(0.6rem, 2vw, 0.72rem)", letterSpacing: "0.32em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.4rem", paddingRight: "0.32em" }}>
                      Location
                    </p>
                    <p className="garamond" style={{ fontSize: "clamp(0.82rem, 2.8vw, 1rem)", color: DEEP, lineHeight: 1.5 }}>
                      {ceremonyVenueName}
                    </p>
                    <p className="garamond" style={{ fontSize: "clamp(0.7rem, 2.2vw, 0.84rem)", color: `${DEEP}b0`, lineHeight: 1.5 }}>
                      {ceremonyAddress}
                    </p>
                  </div>
                  {/* QR Code for Ceremony - Right side */}
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="bg-motif-cream p-1.5 sm:p-2 md:p-2.5 rounded-lg border border-motif-deep/20 shadow-sm">
                      <QRCodeSVG
                        value={ceremonyMapsLink}
                        size={80}
                        level="M"
                        includeMargin={false}
                        fgColor="var(--color-motif-deep)"
                        bgColor="var(--color-motif-cream)"
                      />
                    </div>
                    <p className="garamond" style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)", color: `${DEEP}90`, fontStyle: "italic", textAlign: "center", maxWidth: "80px" }}>
                      Scan for directions
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => openInMaps(ceremonyMapsLink)}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: DEEP, color: "var(--color-motif-cream)" }}
                  aria-label="Get directions to ceremony venue"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="garamond" style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)", letterSpacing: "0.06em" }}>Get Directions</span>
                </button>
                <button
                  onClick={() => copyToClipboard(ceremonyVenue, 'ceremony')}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-motif-cream border border-motif-deep/25 hover:border-motif-deep/45 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ color: DEEP }}
                  aria-label="Copy ceremony venue address"
                >
                  {copiedItems.has('ceremony') ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="garamond" style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)", letterSpacing: "0.06em" }}>{copiedItems.has('ceremony') ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reception Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-br from-motif-silver/22 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />

          <div className="relative elegant-card bg-motif-cream rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.18)] border border-motif-deep/25 premium-shadow hover:border-motif-deep/45 transition-all duration-300">
       
            <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[30rem] overflow-hidden">
              {receptionImages.map((src, index) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentReceptionImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <CloudinaryImage
                    src={src}
                    alt={siteConfig.reception.venue}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1280px"
                    priority={index === 0}
                  />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
              
          
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6 right-3 sm:right-4 md:right-6 z-20">
                <p className="garamond" style={{ fontSize: "clamp(0.55rem, 2vw, 0.7rem)", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,247,240,0.75)", marginBottom: "0.25rem" }}>
                  Reception Venue
                </p>
                <h3 className="gistesy" style={{ fontSize: "clamp(1.6rem, 6vw, 3rem)", color: "var(--color-motif-cream)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.1em" }}>
                  {siteConfig.reception.location}
                </h3>
                <p className="garamond" style={{ fontSize: "clamp(0.7rem, 2.5vw, 0.88rem)", color: "rgba(255,247,240,0.85)", letterSpacing: "0.04em", marginTop: "0.2rem" }}>
                  {siteConfig.reception.venue}
                </p>
              </div>
            </div>

            <div className="p-3 sm:p-5 md:p-7 lg:p-9">
         
              <div className="text-center mb-5 sm:mb-8">
                {siteConfig.reception.time === "To follow after the ceremony" ? (
                  <p className="garamond" style={{ fontSize: "clamp(0.9rem, 3vw, 1.1rem)", color: DEEP, fontStyle: "italic", letterSpacing: "0.04em" }}>
                    To follow after the ceremony
                  </p>
                ) : (
                  <>
                    <p className="garamond" style={{ fontSize: "clamp(0.6rem, 2.2vw, 0.75rem)", letterSpacing: "0.38em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.4rem", paddingRight: "0.38em" }}>
                      {siteConfig.reception.time === "After ceremony" ? "Starts" : "Starts at"}
                    </p>
                    <p className="garamond" style={{ fontSize: "clamp(0.9rem, 3vw, 1.1rem)", color: DEEP, letterSpacing: "0.08em" }}>
                      {siteConfig.reception.time}
                    </p>
                  </>
                )}
              </div>

        
              <div className="bg-gradient-to-br from-motif-cream/40 to-motif-cream rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 border border-motif-deep/15">
                <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-motif-deep mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="garamond" style={{ fontSize: "clamp(0.6rem, 2vw, 0.72rem)", letterSpacing: "0.32em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.4rem", paddingRight: "0.32em" }}>
                      Location
                    </p>
                    <p className="garamond" style={{ fontSize: "clamp(0.82rem, 2.8vw, 1rem)", color: DEEP, lineHeight: 1.5 }}>
                      {receptionVenueName}
                    </p>
                    <p className="garamond" style={{ fontSize: "clamp(0.7rem, 2.2vw, 0.84rem)", color: `${DEEP}b0`, lineHeight: 1.5 }}>
                      {receptionAddress}
                    </p>
                  </div>
              
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <div className="bg-motif-cream p-1.5 sm:p-2 md:p-2.5 rounded-lg border border-motif-deep/20 shadow-sm">
                      <QRCodeSVG
                        value={receptionMapsLink}
                        size={80}
                        level="M"
                        includeMargin={false}
                        fgColor="var(--color-motif-deep)"
                        bgColor="var(--color-motif-cream)"
                      />
                    </div>
                    <p className="garamond" style={{ fontSize: "clamp(0.6rem, 1.8vw, 0.7rem)", color: `${DEEP}90`, fontStyle: "italic", textAlign: "center", maxWidth: "80px" }}>
                      Scan for directions
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => openInMaps(receptionMapsLink)}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: DEEP, color: "var(--color-motif-cream)" }}
                  aria-label="Get directions to reception venue"
                >
                  <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="garamond" style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)", letterSpacing: "0.06em" }}>Get Directions</span>
                </button>
                <button
                  onClick={() => copyToClipboard(receptionVenue, 'reception')}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 md:py-3 bg-motif-cream border border-motif-deep/25 hover:border-motif-deep/45 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ color: DEEP }}
                  aria-label="Copy reception venue address"
                >
                  {copiedItems.has('reception') ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  )}
                  <span className="garamond" style={{ fontSize: "clamp(0.75rem, 2.5vw, 0.9rem)", letterSpacing: "0.06em" }}>{copiedItems.has('reception') ? 'Copied!' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attire Information */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}




        

     {/* Gentle Reminders Container */}
     <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-5 mt-8 sm:mt-12 md:mt-16">
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-motif-cream/40 bg-motif-cream backdrop-blur-lg shadow-[0_18px_40px_color-mix(in_srgb,var(--color-motif-cream)_15%,transparent)]">
          {/* Content */}
          <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10">
            {/* Animated couple photos carousel */}
            {/* <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8">
              {coupleImages.map((image, index) => {
                const isActive = index === currentImageIndex
                // Alternate rotation: -5deg, 5deg, -3deg, 3deg for variety
                const baseRotation = index === 0 ? -5 : index === 1 ? 5 : index === 2 ? -3 : 3
                // Add gentle rotation animation for active image
                const currentRotation = isActive 
                  ? baseRotation + Math.sin(rotationOffset * Math.PI / 180) * 2 
                  : baseRotation
                
                return (
                  <div
                    key={index}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 border-motif-deep/30 shadow-lg transition-all duration-700 ease-in-out ${
                      isActive ? 'scale-110 z-10' : 'scale-100 opacity-70'
                    }`}
                    style={{
                      transform: `rotate(${currentRotation}deg) ${isActive ? 'scale(1.1)' : 'scale(1)'}`,
                    }}
                  >
                    <CloudinaryImage
                      src={image}
                      alt={`Wedding couple ${index + 1}`}
                      fill
                      className={`object-cover transition-opacity duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-70'
                      }`}
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                    />
                  </div>
                )
              })}
            </div> */}

            {/* Title */}
            <p className="garamond text-center" style={{ fontSize: "clamp(0.56rem, 2.2vw, 0.72rem)", letterSpacing: "0.48em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.4rem", paddingRight: "0.48em" }}>
              A Few Kind Notes
            </p>
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to left, rgba(207, 160, 107, 0), transparent)` }} />
              <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.7 }}>✦</span>
              <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to right, rgba(207, 160, 107, 0), transparent)` }} />
            </div>
            <h3
              className="gistesy text-center"
              style={{ fontSize: "clamp(2rem, 9vw, 4.5rem)", color: DEEP, lineHeight: 1.15, overflow: "visible", paddingTop: "0.1em", marginBottom: "clamp(1rem, 3vw, 1.5rem)" }}
            >
              Gentle Reminders
            </h3>

            {/* Reminders List */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-2xl mx-auto">
              {/* Unplugged Christening */}
              <div className="rounded-lg p-4 sm:p-5 md:p-6 border border-motif-accent/20 shadow-sm" style={{ background: "rgba(255,247,240,0.55)" }}>
                <p className="garamond text-center" style={{ fontSize: "clamp(0.55rem, 1.8vw, 0.66rem)", letterSpacing: "0.38em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.25rem", paddingRight: "0.38em" }}>
                  A Sacred Moment
                </p>
                <h4 className="gistesy text-center"
                  style={{ fontSize: "clamp(1.4rem, 5vw, 2.2rem)", color: DEEP, lineHeight: 1.1, overflow: "visible", paddingTop: "0.1em", marginBottom: "0.75rem" }}
                >
                  Unplugged Christening
                </h4>
                <p className="garamond" style={{ fontSize: "clamp(0.82rem, 2.8vw, 0.96rem)", color: `${DEEP}cc`, lineHeight: 1.85, textAlign: "center" }}>
                  We are hosting a mostly unplugged christening. You are welcome to take a few photos, but we kindly ask that it be kept minimal. Please refrain from blocking our official photographer so every precious moment is beautifully captured. We hope you will be fully present with us — professional photos will be shared with you after the celebration. Thank you for your grace and understanding.
                </p>
              </div>

              {/* Arrival */}
              <div className="rounded-lg p-4 sm:p-5 md:p-6 border border-motif-accent/20 shadow-sm" style={{ background: "rgba(255,247,240,0.55)" }}>
                <p className="garamond text-center" style={{ fontSize: "clamp(0.55rem, 1.8vw, 0.66rem)", letterSpacing: "0.38em", textTransform: "uppercase", color: ACCENT, marginBottom: "0.25rem", paddingRight: "0.38em" }}>
                  Be On Time
                </p>
                <h4 className="gistesy text-center"
                  style={{ fontSize: "clamp(1.4rem, 5vw, 2.2rem)", color: DEEP, lineHeight: 1.1, overflow: "visible", paddingTop: "0.1em", marginBottom: "0.75rem" }}
                >
                  Arrival
                </h4>
                <p className="garamond" style={{ fontSize: "clamp(0.82rem, 2.8vw, 0.96rem)", color: `${DEEP}cc`, lineHeight: 1.85, textAlign: "center" }}>
                  To ensure this sacred celebration begins peacefully, we kindly ask that you arrive at least 30 minutes early. The ceremony begins at <span style={{ color: DEEP, fontWeight: 600 }}>{siteConfig.ceremony.time}</span>, so please plan to be seated by <span style={{ color: DEEP, fontWeight: 600 }}>{siteConfig.ceremony.guestsTime}</span>. Your timely presence allows everyone to share in the full blessing of this moment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 backdrop-blur-xl z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-500"
          onClick={() => setShowImageModal(null)}
          style={{ backgroundColor: "rgba(91,102,85,0.96)" }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "var(--color-motif-cream)", opacity: 0.12 }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse"
              style={{ backgroundColor: "var(--color-motif-cream)", opacity: 0.14, animationDelay: "1s" }}
            />
          </div>

          <div
            className="relative max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] bg-motif-deep rounded-3xl overflow-hidden shadow-2xl border-2 animate-in zoom-in-95 duration-500 group"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: "var(--color-motif-cream)" }}
          >
            {/* Decorative top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r"
              style={{ background: "linear-gradient(to right, var(--color-motif-cream), var(--color-motif-cream), var(--color-motif-deep))" }}
            />

            {/* Enhanced close button */}
            <button
              onClick={() => setShowImageModal(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 md:top-6 md:right-6 z-20 hover:bg-motif-accent backdrop-blur-sm p-2.5 sm:p-3 rounded-xl shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl active:scale-95 border-2 group/close"
              title="Close (ESC)"
              style={{ backgroundColor: "var(--color-motif-deep)", borderColor: "var(--color-motif-cream)", color: "var(--color-motif-cream)" }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover/close:text-[#E1D5C7] transition-colors" />
            </button>

            {/* Venue badge */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 z-20">
              <div
                className="flex items-center gap-2 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border-2"
                style={{ backgroundColor: "var(--color-motif-deep)", borderColor: "var(--color-motif-cream)" }}
              >
                {showImageModal === "ceremony" ? (
                  <>
                    <Heart className="w-4 h-4" fill="var(--color-motif-cream)" style={{ color: "var(--color-motif-cream)" }} />
                    <span className="text-xs sm:text-sm font-bold text-motif-cream">
                      Ceremony Venue
                    </span>
                  </>
                ) : (
                  <>
                    <Utensils className="w-4 h-4 text-motif-cream" />
                    <span className="text-xs sm:text-sm font-bold text-motif-cream">
                      Reception Venue
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Image section with enhanced effects */}
            <div
              className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden"
              style={{ backgroundColor: "var(--color-motif-deep)" }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-0" />

              <CloudinaryImage
                src={showImageModal === "ceremony" ? siteConfig.ceremony.image : siteConfig.reception.image[0]}
                alt={showImageModal === "ceremony" ? ceremonyVenueName : receptionVenueName}
                fill
                className="object-contain p-6 sm:p-8 md:p-10 transition-transform duration-700 group-hover:scale-105 z-10"
                sizes="95vw"
                priority
              />
            </div>

            {/* Enhanced content section */}
            <div
              className="garamond p-5 sm:p-6 md:p-8 bg-motif-deep backdrop-blur-sm border-t-2 relative"
              style={{ borderColor: "var(--color-motif-cream)" }}
            >
              {/* Decorative line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-motif-cream/30 to-transparent" />

              <div className="space-y-5">
                {/* Header with venue info */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <h3
                      className="gistesy flex items-center gap-3"
                      style={{ fontSize: "clamp(1.2rem, 4vw, 1.8rem)", color: "var(--color-motif-cream)", lineHeight: 1.1, overflow: "visible", paddingTop: "0.05em" }}
                    >
                      {showImageModal === "ceremony" ? (
                        <Heart className="w-6 h-6 text-motif-cream" fill="var(--color-motif-cream)" />
                      ) : (
                        <Utensils className="w-6 h-6 text-motif-cream" />
                      )}
                      {showImageModal === "ceremony" ? ceremonyVenueName : receptionVenueName}
                    </h3>
                    <div className="flex items-center gap-2 text-sm opacity-70 text-motif-cream">
                      <MapPin className="w-4 h-4 text-motif-cream" />
                      <span>
                        {showImageModal === "ceremony" ? ceremonyAddress : receptionAddress}
                      </span>
                    </div>

                    {/* Date & Time info */}
                    {showImageModal === "ceremony" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "var(--color-motif-cream)",
                          backgroundColor: "var(--color-motif-deep)",
                          opacity: 0.9,
                          borderColor: "var(--color-motif-cream)",
                        }}
                      >
                        <Clock className="w-4 h-4 text-motif-cream" />
                        <span>
                          {formattedCeremonyDate} at {siteConfig.ceremony.time}
                        </span>
                      </div>
                    )}
                    {showImageModal === "reception" && (
                      <div
                        className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border"
                        style={{
                          color: "var(--color-motif-cream)",
                          backgroundColor: "var(--color-motif-deep)",
                          opacity: 0.9,
                          borderColor: "var(--color-motif-cream)",
                        }}
                      >
                        <Clock className="w-4 h-4 text-motif-cream" />
                        <span>
                          {formattedReceptionDate} - {siteConfig.reception.time}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          showImageModal === "ceremony"
                            ? ceremonyLocation
                            : receptionLocation,
                          `modal-${showImageModal}`,
                        )
                      }
                      className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 bg-motif-deep border-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 shadow-md hover:bg-motif-accent whitespace-nowrap text-motif-cream"
                      title="Copy address"
                      style={{ borderColor: "var(--color-motif-cream)" }}
                    >
                      {copiedItems.has(`modal-${showImageModal}`) ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Address</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() =>
                        openInMaps(showImageModal === "ceremony" ? ceremonyMapsLink : receptionMapsLink)
                      }
                      className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-95 shadow-lg whitespace-nowrap bg-motif-cream text-motif-deep"
                    >
                      <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Get Directions</span>
                    </button>
                  </div>
                </div>

                {/* Additional info */}
                  <div className="flex items-center gap-2 text-xs opacity-65 text-motif-cream">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-3 h-3" />
                    Click outside to close
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline-flex items-center gap-1.5">Press ESC to close</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
     
      </div>
    </Section>
  )
}