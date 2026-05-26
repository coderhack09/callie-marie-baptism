"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, Twitter, Share2, Copy, Download, Check, Camera, Sparkles } from "lucide-react"
import Image from "next/image"
import { QRCodeCanvas } from "qrcode.react"
import { siteConfig } from "@/content/site"

// ── Motif palette (aligned with BookOfGuests / Messages / FAQ) ────────────────
const DEEP      = "#3D2810"
const MEDIUM    = "#8C6035"
const GOLD      = "#B8822A"
const BABY_BLUE = "#3FA3C8"
const BLUE_MID  = "#7BBEDD"
const IVORY     = "#FEF9F3"
const BLUSH     = "#EED4BC"

// QRCodeCanvas renders to <canvas> — must be a literal hex, no CSS vars
const QR_FG_HEX = "#3FA3C8"

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 300, h: 300, top: "4%",  left: "2%",  color: BABY_BLUE, opacity: 0.08, blur: 85 },
    { w: 220, h: 220, top: "18%", left: "76%", color: GOLD,      opacity: 0.09, blur: 68 },
    { w: 250, h: 250, top: "58%", left: "4%",  color: BLUSH,     opacity: 0.10, blur: 78 },
    { w: 180, h: 180, top: "72%", left: "78%", color: BABY_BLUE, opacity: 0.08, blur: 60 },
    { w: 140, h: 140, top: "38%", left: "46%", color: GOLD,      opacity: 0.06, blur: 50 },
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

export function SnapShare() {
  const [copiedHashtagIndex, setCopiedHashtagIndex] = useState<number | null>(null)
  const [copiedAllHashtags, setCopiedAllHashtags]   = useState(false)
  const [copiedDriveLink, setCopiedDriveLink]       = useState(false)
  const [isMobile, setIsMobile]                     = useState(false)

  const websiteUrl  = typeof window !== "undefined" ? window.location.href : "https://example.com"
  const driveLink   = siteConfig.snapShare.googleDriveLink
  const hashtags    = siteConfig.snapShare.hashtag
  const allHashtags = hashtags.join(" ")

  const groomNickname = siteConfig.couple.groomNickname
  const brideNickname = siteConfig.couple.brideNickname
  const childName     = siteConfig.couple.child ?? "Kaezar Isaiahnuel"
  const sanitizedGroomName = groomNickname.replace(/\s+/g, "")
  const sanitizedBrideName = brideNickname.replace(/\s+/g, "")

  const shareText = `Join us in blessing ${childName}! Explore our christening invitation and share your special memories: ${websiteUrl} ${allHashtags} 🕊️`

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const shareOnSocial = (platform: "instagram" | "facebook" | "twitter" | "tiktok") => {
    const eu = encodeURIComponent(websiteUrl)
    const et = encodeURIComponent(shareText)
    const urls: Record<string, string> = {
      instagram: "https://www.instagram.com/",
      facebook:  `https://www.facebook.com/sharer/sharer.php?u=${eu}`,
      twitter:   `https://twitter.com/intent/tweet?text=${et}`,
      tiktok:    "https://www.tiktok.com/",
    }
    const target = urls[platform]
    if (target) window.open(target, "_blank", "width=600,height=400")
  }

  const downloadQRCode = () => {
    const canvas = document.getElementById("snapshare-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${sanitizedGroomName.toLowerCase()}-${sanitizedBrideName.toLowerCase()}-christening-qr.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const downloadDriveQRCode = () => {
    const canvas = document.getElementById("drive-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "drive-qr.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const copyHashtag = async (hashtag: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hashtag)
      setCopiedHashtagIndex(index)
      setTimeout(() => setCopiedHashtagIndex(null), 2000)
    } catch { /* silent */ }
  }

  const copyAllHashtags = async () => {
    try {
      await navigator.clipboard.writeText(allHashtags)
      setCopiedAllHashtags(true)
      setTimeout(() => setCopiedAllHashtags(false), 2000)
    } catch { /* silent */ }
  }

  const copyDriveLink = async () => {
    if (!driveLink) return
    try {
      await navigator.clipboard.writeText(driveLink)
      setCopiedDriveLink(true)
      setTimeout(() => setCopiedDriveLink(false), 2000)
    } catch { /* silent */ }
  }

  const fadeInUp = { initial: { opacity: 0, y: 60 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } }
  const staggerChildren = { animate: { transition: { staggerChildren: 0.2 } } }

  // ── Shared card style ────────────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: "rgba(254,249,243,0.94)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    border: `1.5px solid ${BABY_BLUE}30`,
    boxShadow: `0 8px 32px ${BABY_BLUE}14, 0 2px 10px rgba(61,40,16,0.06), inset 0 1px 0 rgba(255,255,255,0.80)`,
  }

  const btnPrimary: React.CSSProperties = {
    background: BABY_BLUE,
    color: "white",
    border: "none",
    boxShadow: `0 4px 14px ${BABY_BLUE}44`,
  }

  return (
    <section id="snap-share" className="relative w-full overflow-hidden">

      {/* Solid ivory base */}
      <div className="absolute inset-0 -z-10" style={{ background: IVORY }} />

      {/* Multi-stop tinted vertical gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(180deg,
          rgba(238,212,188,0.36) 0%,
          rgba(251,244,234,0.0)  20%,
          rgba(213,238,248,0.28) 52%,
          rgba(251,244,234,0.0)  76%,
          rgba(238,212,188,0.32) 100%
        )`,
      }} />

      {/* Diagonal warm-to-cool wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(112deg, rgba(213,238,248,0.14) 0%, transparent 44%, rgba(238,212,188,0.14) 100%)`,
      }} />

      {/* Fine diagonal shimmer */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `repeating-linear-gradient(125deg, transparent 0px, transparent 160px, rgba(255,255,255,0.18) 160px, rgba(255,255,255,0.18) 162px)`,
      }} />

      {/* Soft dot grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(63,163,200,0.08) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      {/* Corner radial glows */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden style={{
        background: `
          radial-gradient(ellipse 50% 38% at 0%   0%,   rgba(213,238,248,0.30) 0%, transparent 60%),
          radial-gradient(ellipse 40% 34% at 100% 0%,   rgba(238,212,188,0.26) 0%, transparent 55%),
          radial-gradient(ellipse 44% 36% at 0%   100%, rgba(238,212,188,0.22) 0%, transparent 55%),
          radial-gradient(ellipse 40% 34% at 100% 100%, rgba(213,238,248,0.26) 0%, transparent 55%)
        `,
      }} />

      <BokehOrbs />

      {/* ── Corner floral decorations ── */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <Image src="/decoration/left-top-removebg-preview.png"    alt="" width={200} height={200} className="absolute top-0 left-0  w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
        <Image src="/decoration/right-top-removebg-preview.png"   alt="" width={200} height={200} className="absolute top-0 right-0 w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
        <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={200} height={200} className="absolute bottom-0 left-0  w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
        <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={200} height={200} className="absolute bottom-0 right-0 w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
      </div>

      <div className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8">

          {/* ══════════════════════════════════════════════════════════════
              SECTION HEADER
          ══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.56rem, 2.2vw, 0.68rem)",
                letterSpacing: "0.52em",
                textTransform: "uppercase",
                color: BABY_BLUE,
                marginBottom: "0.75rem",
                paddingRight: "0.52em",
              }}
            >
              Share the Blessing
            </p>

            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${GOLD}99, transparent)` }} />
              <span style={{ color: GOLD, fontSize: "9px", opacity: 0.9 }}>✦</span>
              <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${GOLD}99, transparent)` }} />
            </div>

            <h2
              className="gistesy"
              style={{
                fontSize: "clamp(2.4rem, 9vw, 4.8rem)",
                color: DEEP,
                lineHeight: 1.1,
                overflow: "visible",
                paddingTop: "0.1em",
                marginBottom: "0.5rem",
              }}
            >
              Capture &amp; Share the Joy
            </h2>

            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to left, ${BLUE_MID}cc, transparent)` }} />
              <span style={{ color: BLUE_MID, fontSize: "5px", letterSpacing: "0.25em" }}>◆◆◆</span>
              <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to right, ${BLUE_MID}cc, transparent)` }} />
            </div>

            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.78rem, 2.5vw, 0.94rem)",
                color: MEDIUM,
                fontStyle: "italic",
                lineHeight: 1.9,
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Help us remember the little moments of {childName}&apos;s blessed day — every smile, embrace, and candid laugh.
              Your photos and clips complete this cherished memory.
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to left, ${GOLD}55, transparent)` }} />
              <Sparkles className="h-3.5 w-3.5 opacity-60" style={{ color: GOLD }} />
              <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to right, ${GOLD}55, transparent)` }} />
            </div>
          </motion.div>

          {/* ══════════════════════════════════════════════════════════════
              MAIN GRID
          ══════════════════════════════════════════════════════════════ */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
            variants={staggerChildren} initial="initial" animate="animate"
          >

            {/* ── Left: photo moments card ── */}
          

            {/* ── Right: QR + hashtags + social + drive ── */}
            <motion.div className="space-y-4 flex flex-col lg:order-2" variants={fadeInUp}>

              {/* ── Share Website QR ── */}
              <div className="rounded-2xl p-4 sm:p-5 md:p-7 text-center flex flex-col" style={cardStyle}>
                <div className="h-[2px] w-full rounded-full mb-4"
                  style={{ background: `linear-gradient(to right, transparent, ${GOLD}77, ${BABY_BLUE}66, transparent)` }} />

                <h4
                  className="gistesy text-center mb-2"
                  style={{ fontSize: "clamp(1.4rem, 5vw, 2.2rem)", color: DEEP, lineHeight: 1.2, overflow: "visible", paddingTop: "0.08em" }}
                >
                  Share Our Invitation
                </h4>
                <p
                  className="garamond mb-4"
                  style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.84rem)", color: MEDIUM, fontStyle: "italic", lineHeight: 1.75 }}
                >
                  Spread the word about {childName}&apos;s christening. Share this QR code so loved ones can join the celebration.
                </p>

                {/* QR frame */}
                <div className="mx-auto inline-flex flex-col items-center p-3 sm:p-5 rounded-2xl mb-4"
                  style={{ background: "rgba(255,255,255,0.90)", border: `1.5px solid ${BABY_BLUE}28`, boxShadow: `0 4px 16px ${BABY_BLUE}18` }}>
                  <div className="mb-2 sm:mb-3 p-2 sm:p-3 rounded-xl" style={{ background: `${BABY_BLUE}0a`, border: `1px solid ${BABY_BLUE}22` }}>
                    <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
                      <QRCodeCanvas
                        id="snapshare-qr"
                        value={websiteUrl}
                        size={isMobile ? 140 : 200}
                        includeMargin
                        className="bg-white"
                        fgColor={QR_FG_HEX}
                      />
                    </div>
                  </div>
                  <button
                    onClick={downloadQRCode}
                    className="garamond flex items-center gap-1.5 mx-auto px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{ ...btnPrimary, fontSize: "clamp(0.65rem, 1.8vw, 0.74rem)", letterSpacing: "0.18em", textTransform: "uppercase" }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download QR
                  </button>
                </div>

                <p className="garamond" style={{ fontSize: "clamp(0.65rem, 1.8vw, 0.74rem)", color: MEDIUM, fontStyle: "italic" }}>
                  Scan with any camera app to open the full invitation.
                </p>
              </div>

              {/* ── Hashtags ── */}
              <div className="rounded-2xl p-4 sm:p-5 text-center" style={cardStyle}>
                <div className="h-[2px] w-full rounded-full mb-4"
                  style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}66, transparent)` }} />

                <h5
                  className="gistesy text-center mb-3"
                  style={{ fontSize: "clamp(1.3rem, 4.5vw, 2rem)", color: DEEP, lineHeight: 1.2, overflow: "visible", paddingTop: "0.08em" }}
                >
                  Christening Hashtags
                </h5>

                <div className="space-y-1.5 mb-3">
                  {hashtags.map((hashtag, index) => (
                    <motion.button
                      key={index}
                      onClick={() => copyHashtag(hashtag, index)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 rounded-xl border transition-all duration-200 active:scale-[0.98]"
                      style={{
                        background: copiedHashtagIndex === index ? `${BABY_BLUE}14` : "rgba(255,255,255,0.75)",
                        borderColor: copiedHashtagIndex === index ? `${BABY_BLUE}55` : `${BABY_BLUE}28`,
                      }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <span
                        className="garamond font-semibold text-left truncate flex-1"
                        style={{ fontSize: "clamp(0.78rem, 2.4vw, 0.9rem)", color: copiedHashtagIndex === index ? BABY_BLUE : DEEP }}
                      >
                        {hashtag}
                      </span>
                      <span
                        className="garamond flex items-center gap-1 flex-shrink-0 font-semibold"
                        style={{ fontSize: "clamp(0.6rem, 1.6vw, 0.68rem)", letterSpacing: "0.15em", textTransform: "uppercase", color: copiedHashtagIndex === index ? BABY_BLUE : MEDIUM }}
                      >
                        {copiedHashtagIndex === index
                          ? <><Check className="w-3 h-3" /> Copied</>
                          : <><Copy className="w-3 h-3" /> Copy</>}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={copyAllHashtags}
                  className="garamond w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all duration-200 active:scale-[0.98]"
                  style={{
                    fontSize: "clamp(0.65rem, 1.8vw, 0.74rem)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    ...(copiedAllHashtags
                      ? { background: `${BABY_BLUE}14`, borderColor: `${BABY_BLUE}55`, color: BABY_BLUE }
                      : { background: `${BABY_BLUE}0e`, borderColor: `${BABY_BLUE}33`, color: DEEP }),
                  }}
                  onMouseEnter={(e) => { if (!copiedAllHashtags) { e.currentTarget.style.background = BABY_BLUE; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "transparent" } }}
                  onMouseLeave={(e) => { if (!copiedAllHashtags) { e.currentTarget.style.background = `${BABY_BLUE}0e`; e.currentTarget.style.color = DEEP; e.currentTarget.style.borderColor = `${BABY_BLUE}33` } }}
                >
                  {copiedAllHashtags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAllHashtags ? "All Copied!" : "Copy All Hashtags"}
                </button>
              </div>

              {/* ── Social share ── */}
              <div className="rounded-2xl p-4 sm:p-5 md:p-6" style={cardStyle}>
                <div className="h-[2px] w-full rounded-full mb-4"
                  style={{ background: `linear-gradient(to right, transparent, ${GOLD}66, transparent)` }} />

                <h5
                  className="gistesy text-center mb-2"
                  style={{ fontSize: "clamp(1.3rem, 4.5vw, 2rem)", color: DEEP, lineHeight: 1.2, overflow: "visible", paddingTop: "0.08em" }}
                >
                  Share on Social Media
                </h5>
                <p
                  className="garamond text-center mb-4"
                  style={{ fontSize: "clamp(0.7rem, 2vw, 0.82rem)", color: MEDIUM, fontStyle: "italic", lineHeight: 1.7 }}
                >
                  Help spread the joy of {childName}&apos;s christening across your favorite platforms.
                </p>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { platform: "instagram" as const, Icon: Instagram, label: "Instagram" },
                    { platform: "facebook"  as const, Icon: Facebook,  label: "Facebook"  },
                    { platform: "tiktok"    as const, Icon: Share2,     label: "TikTok"    },
                    { platform: "twitter"   as const, Icon: Twitter,    label: "Twitter"   },
                  ].map(({ platform, Icon, label }) => (
                    <button
                      key={platform}
                      onClick={() => shareOnSocial(platform)}
                      className="garamond group flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                      style={{
                        background: "rgba(255,255,255,0.85)",
                        border: `1.5px solid ${BABY_BLUE}28`,
                        color: DEEP,
                        fontSize: "clamp(0.65rem, 1.8vw, 0.76rem)",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = BABY_BLUE; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "transparent" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.color = DEEP; e.currentTarget.style.borderColor = `${BABY_BLUE}28` }}
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Drive upload ── */}
              {driveLink && (
                <div className="rounded-2xl p-4 sm:p-5 md:p-7 text-center" style={cardStyle}>
                  <div className="h-[2px] w-full rounded-full mb-4"
                    style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}77, ${GOLD}66, transparent)` }} />

                  {/* Eyebrow pill */}
                  <div
                    className="garamond inline-flex items-center gap-1.5 rounded-full border px-3 py-1 mb-4"
                    style={{
                      fontSize: "clamp(0.56rem, 1.6vw, 0.64rem)",
                      letterSpacing: "0.32em",
                      textTransform: "uppercase",
                      background: BABY_BLUE,
                      borderColor: "transparent",
                      color: "white",
                      boxShadow: `0 2px 10px ${BABY_BLUE}44`,
                    }}
                  >
                    Upload Your Photos &amp; Videos
                  </div>

                  <p
                    className="garamond mb-5"
                    style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.84rem)", color: MEDIUM, fontStyle: "italic", lineHeight: 1.75 }}
                  >
                    Help us capture this sacred day! Scan the QR or use the actions below to drop your photos and clips into our shared Drive.
                  </p>

                  {/* Drive QR */}
                  <div className="mx-auto inline-flex flex-col items-center p-3 sm:p-5 rounded-2xl mb-4"
                    style={{ background: "rgba(255,255,255,0.90)", border: `1.5px solid ${BABY_BLUE}28`, boxShadow: `0 4px 16px ${BABY_BLUE}18` }}>
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 rounded-xl" style={{ background: `${BABY_BLUE}0a`, border: `1px solid ${BABY_BLUE}22` }}>
                      <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
                        <QRCodeCanvas id="drive-qr" value={driveLink} size={isMobile ? 130 : 190} includeMargin className="bg-white" fgColor={QR_FG_HEX} />
                      </div>
                    </div>
                    <p className="garamond" style={{ fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", color: MEDIUM, fontStyle: "italic" }}>
                      Scan with your camera app
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-2.5">
                    <button
                      onClick={copyDriveLink}
                      className="garamond flex items-center justify-center gap-1.5 px-4 py-2 rounded-full transition-all hover:scale-105"
                      style={{
                        fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        ...(copiedDriveLink
                          ? { background: `${BABY_BLUE}18`, color: BABY_BLUE, border: `1px solid ${BABY_BLUE}55` }
                          : { ...btnPrimary }),
                      }}
                    >
                      {copiedDriveLink ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                    </button>
                    <button
                      onClick={downloadDriveQRCode}
                      className="garamond flex items-center justify-center gap-1.5 px-4 py-2 rounded-full transition-all hover:scale-105"
                      style={{ fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, ...btnPrimary }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download QR
                    </button>
                    <a
                      href={driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="garamond flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border transition-all hover:scale-105"
                      style={{
                        fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)",
                        letterSpacing: "0.16em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        background: "rgba(255,255,255,0.85)",
                        borderColor: `${BABY_BLUE}33`,
                        color: DEEP,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = BABY_BLUE; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "transparent" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.color = DEEP; e.currentTarget.style.borderColor = `${BABY_BLUE}33` }}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Open Drive
                    </a>
                  </div>
                  <p className="garamond mt-3" style={{ fontSize: "clamp(0.6rem, 1.5vw, 0.68rem)", color: MEDIUM, fontStyle: "italic" }}>
                    or tap &quot;Open Google Drive Folder.&quot;
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* ── Closing card ── */}
          <motion.div className="text-center mt-8 sm:mt-12" variants={fadeInUp}>
            <div
              className="rounded-2xl p-5 sm:p-7 max-w-2xl mx-auto"
              style={{
                background: "rgba(254,249,243,0.88)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: `1.5px solid ${BABY_BLUE}28`,
                boxShadow: `0 6px 28px ${BABY_BLUE}12, inset 0 1px 0 rgba(255,255,255,0.70)`,
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${GOLD}88, transparent)` }} />
                <span style={{ color: GOLD, fontSize: "8px", opacity: 0.85 }}>✦</span>
                <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${GOLD}88, transparent)` }} />
              </div>

              <p
                className="garamond"
                style={{
                  fontSize: "clamp(0.84rem, 2.8vw, 1rem)",
                  color: DEEP,
                  fontStyle: "italic",
                  lineHeight: 1.95,
                }}
              >
                Thank you for helping make {childName}&apos;s christening a day to remember.
                Your photos, prayers, and presence are the most beautiful gift.
              </p>

              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to left, ${BLUE_MID}88, transparent)` }} />
                <span style={{ color: BLUE_MID, fontSize: "5px", opacity: 0.75 }}>◆</span>
                <div className="h-px w-8 sm:w-12" style={{ background: `linear-gradient(to right, ${BLUE_MID}88, transparent)` }} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
