"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, Twitter, Share2, Copy, Download, Check } from "lucide-react"
import { Section } from "@/components/section"
import { QRCodeCanvas } from "qrcode.react"
import { siteConfig } from "@/content/site"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"

// QRCodeCanvas renders to <canvas> — cannot use CSS vars, must be a hex
// This must match --color-motif-deep in globals.css
const QR_FG_HEX = "#8B6F5A"

const DECO_FILTER = "brightness(0) invert(1)"

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
  const childName     = siteConfig.couple.child ?? "Niahna Celestine"
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

  // ── Shared card style (dark bg section) ─────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    background: "rgba(255,247,240,0.97)",
    border: `1px solid rgba(207,160,107,0.28)`,
    boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
  }

  const btnPrimary: React.CSSProperties = {
    background: `linear-gradient(135deg, ${ACCENT}, ${DEEP})`,
    color: "white",
    border: "none",
    boxShadow: "0 4px 14px rgba(139,111,90,0.35)",
  }

  return (
    <Section
      id="snap-share"
      className="relative overflow-hidden py-12 sm:py-16 md:py-20 lg:py-24"
    >
      {/* Corner florals — inverted white on dark bg */}
      {/* <div className="absolute left-0 top-0 z-0 pointer-events-none">
        <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-15 scale-y-[-1]"
          priority={false} style={{ filter: DECO_FILTER }} />
      </div> */}
      {/* <div className="absolute right-0 top-0 z-0 pointer-events-none">
        <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-15 scale-x-[-1] scale-y-[-1]"
          priority={false} style={{ filter: DECO_FILTER }} />
      </div> */}
      <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-15"
          priority={false} style={{ filter: DECO_FILTER }} />
      </div>
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300}
          className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-15 scale-x-[-1]"
          priority={false} style={{ filter: DECO_FILTER }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 md:px-8">

        {/* ── Section Header ── */}
        <motion.div
          className="text-center mb-6 sm:mb-10"
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Eyebrow pill */}
          <div
            className="garamond inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 mb-3"
            style={{
              fontSize: "clamp(0.56rem, 1.8vw, 0.68rem)",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              background: "rgba(207,160,107,0.18)",
              borderColor: "rgba(207,160,107,0.45)",
              color: "var(--color-motif-cream)",
            }}
          >
            Share the Blessing
          </div>

          {/* Ornament */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, rgba(255,247,240,0.35), transparent)" }} />
            <span style={{ color: "rgba(255,247,240,0.45)", fontSize: "7px" }}>✦</span>
            <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, rgba(255,247,240,0.35), transparent)" }} />
          </div>

          <h2
            className="gistesy"
            style={{
              fontSize: "clamp(2rem, 8vw, 4.2rem)",
              color: "var(--color-motif-cream)",
              lineHeight: 1.15,
              overflow: "visible",
              paddingTop: "0.1em",
              marginBottom: "0.5rem",
              textShadow: "0 2px 20px rgba(0,0,0,0.25)",
            }}
          >
            Capture &amp; Share the Joy
          </h2>

          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.78rem, 2.5vw, 0.94rem)",
              color: "var(--color-motif-cream)",
              fontStyle: "italic",
              opacity: 0.78,
              lineHeight: 1.85,
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            Help us remember the little moments of {childName}&apos;s blessed day — every smile, embrace, and candid laugh.
            Your photos and clips complete this cherished memory.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-10 sm:w-16" style={{ background: "linear-gradient(to left, rgba(255,247,240,0.30), transparent)" }} />
            <span style={{ color: "rgba(255,247,240,0.35)", fontSize: "5px" }}>◆</span>
            <div className="h-px w-10 sm:w-16" style={{ background: "linear-gradient(to right, rgba(255,247,240,0.30), transparent)" }} />
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6 lg:gap-8"
          variants={staggerChildren} initial="initial" animate="animate"
        >

          {/* ── Left: photo moments card ── */}
          <motion.div className="h-full lg:order-1" variants={fadeInUp} whileHover={{ y: -2 }} transition={{ duration: 0.3 }}>
            <div className="rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-7 h-full flex flex-col" style={cardStyle}>
              {/* Top accent */}
              <div className="h-0.5 w-full rounded-full mb-4"
                style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.55), transparent)` }} />

              <h4
                className="gistesy text-center mb-4"
                style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.6rem)", color: DEEP, lineHeight: 1.2, overflow: "visible", paddingTop: "0.08em" }}
              >
                Precious Moments
              </h4>

              <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
                <motion.div
                  className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden shadow-md border-2 border-motif-accent/20 hover:border-motif-accent/45 transition-all"
                  whileHover={{ scale: 1.03 }} transition={{ duration: 0.25 }}
                >
                  <CloudinaryImage src="/mobile_display/baby (3).jpg" alt="Niahna Celestine" fill className="object-cover" />
                </motion.div>
                <motion.div
                  className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden shadow-md border-2 border-motif-accent/20 hover:border-motif-accent/45 transition-all"
                  whileHover={{ scale: 1.03 }} transition={{ duration: 0.25 }}
                >
                  <CloudinaryImage src="/mobile_display/baby (12).jpg" alt="Niahna Celestine" fill className="object-cover" />
                </motion.div>
                <motion.div
                  className="relative col-span-2 aspect-[3/2] rounded-lg sm:rounded-xl overflow-hidden shadow-md border-2 border-motif-accent/20 hover:border-motif-accent/45 transition-all"
                  whileHover={{ scale: 1.02 }} transition={{ duration: 0.25 }}
                >
                  <CloudinaryImage src="/desktop_background/baby (1).jpg" alt="Niahna Celestine" fill className="object-cover" />
                </motion.div>
              </div>

              <p
                className="garamond text-center mt-3 sm:mt-4"
                style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.84rem)", color: MEDIUM, fontStyle: "italic", lineHeight: 1.75 }}
              >
                Share your snapshots to be featured in our christening keepsake gallery.
              </p>
            </div>
          </motion.div>

          {/* ── Right: QR + hashtags + social + drive ── */}
          <motion.div className="space-y-3 sm:space-y-4 flex flex-col lg:order-2" variants={fadeInUp}>

            {/* Share Website QR */}
            <div className="rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-7 text-center flex flex-col" style={cardStyle}>
              <div className="h-0.5 w-full rounded-full mb-4"
                style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.45), transparent)` }} />

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
              <div className="mx-auto inline-flex flex-col items-center bg-white/90 p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-md border mb-3 sm:mb-4"
                style={{ borderColor: "rgba(207,160,107,0.25)" }}>
                <div className="mb-2 sm:mb-3 p-2 sm:p-3 rounded-lg" style={{ background: "rgba(255,247,240,0.7)", border: "1px solid rgba(207,160,107,0.20)" }}>
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

            {/* Hashtags */}
            <div className="rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-center" style={cardStyle}>
              <div className="h-0.5 w-full rounded-full mb-3"
                style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.40), transparent)` }} />

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
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background: copiedHashtagIndex === index ? "rgba(207,160,107,0.14)" : "rgba(255,255,255,0.70)",
                      borderColor: copiedHashtagIndex === index ? "rgba(207,160,107,0.55)" : "rgba(207,160,107,0.22)",
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <span
                      className="garamond font-semibold text-left truncate flex-1"
                      style={{ fontSize: "clamp(0.78rem, 2.4vw, 0.9rem)", color: copiedHashtagIndex === index ? ACCENT : DEEP }}
                    >
                      {hashtag}
                    </span>
                    <span
                      className="garamond flex items-center gap-1 flex-shrink-0 font-semibold"
                      style={{ fontSize: "clamp(0.6rem, 1.6vw, 0.68rem)", letterSpacing: "0.15em", textTransform: "uppercase", color: copiedHashtagIndex === index ? ACCENT : MEDIUM }}
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
                className="garamond w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 rounded-lg border transition-all duration-200 active:scale-[0.98]"
                style={{
                  fontSize: "clamp(0.65rem, 1.8vw, 0.74rem)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  ...(copiedAllHashtags
                    ? { background: "rgba(207,160,107,0.14)", borderColor: "rgba(207,160,107,0.55)", color: ACCENT }
                    : { background: "rgba(207,160,107,0.08)", borderColor: "rgba(207,160,107,0.28)", color: DEEP }),
                }}
                onMouseEnter={(e) => { if (!copiedAllHashtags) { e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT}, ${DEEP})`; e.currentTarget.style.color = "white" } }}
                onMouseLeave={(e) => { if (!copiedAllHashtags) { e.currentTarget.style.background = "rgba(207,160,107,0.08)"; e.currentTarget.style.color = DEEP } }}
              >
                {copiedAllHashtags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedAllHashtags ? "All Copied!" : "Copy All Hashtags"}
              </button>
            </div>

            {/* Social share */}
            <div className="rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6" style={cardStyle}>
              <div className="h-0.5 w-full rounded-full mb-3"
                style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.40), transparent)` }} />

              <h5
                className="gistesy text-center mb-2"
                style={{ fontSize: "clamp(1.3rem, 4.5vw, 2rem)", color: DEEP, lineHeight: 1.2, overflow: "visible", paddingTop: "0.08em" }}
              >
                Share on Social Media
              </h5>
              <p
                className="garamond text-center mb-3 sm:mb-4"
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
                    className="garamond group flex items-center justify-center gap-1.5 sm:gap-2 bg-white border py-2.5 sm:py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                    style={{
                      borderColor: "rgba(207,160,107,0.35)",
                      color: DEEP,
                      fontSize: "clamp(0.65rem, 1.8vw, 0.76rem)",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT}, ${DEEP})`; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "transparent" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = DEEP; e.currentTarget.style.borderColor = "rgba(207,160,107,0.35)" }}
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Drive upload */}
            {driveLink && (
              <div className="rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-7 text-center" style={cardStyle}>
                <div className="h-0.5 w-full rounded-full mb-3"
                  style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.40), transparent)` }} />

                {/* Eyebrow pill */}
                <div
                  className="garamond inline-flex items-center gap-1.5 rounded-full border px-3 py-1 mb-3"
                  style={{
                    fontSize: "clamp(0.56rem, 1.6vw, 0.64rem)",
                    letterSpacing: "0.32em",
                    textTransform: "uppercase",
                    background: `linear-gradient(135deg, ${ACCENT}, ${DEEP})`,
                    borderColor: "transparent",
                    color: "white",
                  }}
                >
                  Upload Your Photos &amp; Videos
                </div>

                <p
                  className="garamond mb-4"
                  style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.84rem)", color: MEDIUM, fontStyle: "italic", lineHeight: 1.75 }}
                >
                  Help us capture this sacred day! Scan the QR or use the actions below to drop your photos and clips into our shared Drive.
                </p>

                {/* Drive QR */}
                <div className="mx-auto inline-flex flex-col items-center bg-white/90 p-3 sm:p-5 rounded-xl sm:rounded-2xl shadow-md border mb-3 sm:mb-4"
                  style={{ borderColor: "rgba(207,160,107,0.25)" }}>
                  <div className="mb-2 sm:mb-3 p-2 sm:p-3 rounded-lg" style={{ background: "rgba(255,247,240,0.7)", border: "1px solid rgba(207,160,107,0.20)" }}>
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
                        ? { background: "rgba(207,160,107,0.18)", color: ACCENT, border: `1px solid ${ACCENT}` }
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
                      background: "white",
                      borderColor: "rgba(207,160,107,0.40)",
                      color: DEEP,
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `linear-gradient(135deg, ${ACCENT}, ${DEEP})`; e.currentTarget.style.color = "white" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = DEEP }}
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    Open Drive
                  </a>
                </div>
                <p className="garamond mt-2 sm:mt-3" style={{ fontSize: "clamp(0.6rem, 1.5vw, 0.68rem)", color: MEDIUM, fontStyle: "italic" }}>
                  or tap &quot;Open Google Drive Folder.&quot;
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* ── Closing card ── */}
        <motion.div className="text-center mt-5 sm:mt-10" variants={fadeInUp}>
          <div
            className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-7 max-w-2xl mx-auto"
            style={{
              background: "rgba(255,247,240,0.10)",
              border: "1px solid rgba(255,247,240,0.18)",
              backdropFilter: "blur(8px)",
            }}
          >
            {/* Ornament */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, rgba(255,247,240,0.35), transparent)" }} />
              <span style={{ color: "rgba(255,247,240,0.40)", fontSize: "7px" }}>✦</span>
              <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, rgba(255,247,240,0.35), transparent)" }} />
            </div>

            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.82rem, 2.8vw, 1rem)",
                color: "var(--color-motif-cream)",
                fontStyle: "italic",
                lineHeight: 1.9,
                opacity: 0.88,
              }}
            >
              Thank you for helping make {childName}&apos;s christening a day to remember.
              Your photos, prayers, and presence are the most beautiful gift.
            </p>

            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-px w-6 sm:w-10" style={{ background: "linear-gradient(to left, rgba(255,247,240,0.30), transparent)" }} />
              <span style={{ color: "rgba(255,247,240,0.35)", fontSize: "5px" }}>◆</span>
              <div className="h-px w-6 sm:w-10" style={{ background: "linear-gradient(to right, rgba(255,247,240,0.30), transparent)" }} />
            </div>
          </div>
        </motion.div>

      </div>
    </Section>
  )
}
