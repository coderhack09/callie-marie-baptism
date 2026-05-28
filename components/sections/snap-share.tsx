"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, Twitter, Share2, Copy, Download, Check } from "lucide-react"
import Image from "next/image"
import { QRCodeCanvas } from "qrcode.react"
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

// QRCodeCanvas renders to <canvas> — must be a literal hex, no CSS vars
const QR_FG_HEX = DARK_NAVY

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

  const cardStyle: React.CSSProperties = FROSTED_CARD

  const btnPrimary: React.CSSProperties = {
    fontFamily: '"Cinzel", serif',
    background: GOLD,
    color: "white",
    border: "none",
    boxShadow: "0 4px 14px rgba(196,152,88,0.30)",
  }

  return (
    <section id="snap-share" className="relative w-full overflow-hidden">

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
            className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
              letterSpacing: "0.40em",
              textTransform: "uppercase",
              color: "rgba(72,112,148,0.80)",
              marginBottom: "0.4rem",
              paddingRight: "0.40em",
            }}>
              Share the Blessing
            </p>

            <OrnamentDivider />

            <h2 style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(1.6rem, 5.5vw, 2.8rem)",
              color: GOLD,
              lineHeight: 1.0,
              marginTop: "1rem",
              marginBottom: "0.5rem",
              filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
            }}>
              Capture &amp; Share the Joy
            </h2>

            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
              color: NAVY_MUTE,
              lineHeight: 1.75,
              fontStyle: "italic",
              maxWidth: "32rem",
              margin: "0.75rem auto 0",
            }}>
              Help us remember the little moments of {childName}&apos;s blessed day — every smile, embrace, and candid laugh.
              Your photos and clips complete this cherished memory.
            </p>
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
              <div className="rounded-3xl p-4 sm:p-5 md:p-7 text-center flex flex-col" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

                <h4 style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
                  color: GOLD,
                  lineHeight: 1.2,
                  textAlign: "center",
                  marginBottom: "0.5rem",
                }}>
                  Share Our Invitation
                </h4>
                <p style={{
                  fontFamily: '"Fahkwang", sans-serif',
                  fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                  color: NAVY_MUTE,
                  fontStyle: "italic",
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                }}>
                  Spread the word about {childName}&apos;s christening. Share this QR code so loved ones can join the celebration.
                </p>

                {/* QR frame */}
                <div className="mx-auto inline-flex flex-col items-center p-3 sm:p-5 rounded-2xl mb-4"
                  style={{ background: "rgba(255,255,255,0.70)", border: "1.5px solid rgba(43,74,107,0.15)", boxShadow: "0 4px 16px rgba(43,74,107,0.06)" }}>
                  <div className="mb-2 sm:mb-3 p-2 sm:p-3 rounded-xl" style={{ background: "rgba(196,152,88,0.06)", border: "1px solid rgba(43,74,107,0.12)" }}>
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
                    className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{ ...btnPrimary, fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", letterSpacing: "0.12em", textTransform: "uppercase" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = DARK_NAVY }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = GOLD }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download QR
                  </button>
                </div>

                <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                  Scan with any camera app to open the full invitation.
                </p>
              </div>

              {/* ── Hashtags ── */}
              <div className="rounded-3xl p-4 sm:p-5 text-center" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

                <h5 style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
                  color: GOLD,
                  lineHeight: 1.2,
                  textAlign: "center",
                  marginBottom: "0.75rem",
                }}>
                  Christening Hashtags
                </h5>

                <div className="space-y-1.5 mb-3">
                  {hashtags.map((hashtag, index) => (
                    <motion.button
                      key={index}
                      onClick={() => copyHashtag(hashtag, index)}
                      className="w-full flex items-center justify-between gap-2 px-3 py-2 sm:py-2.5 rounded-xl border transition-all duration-200 active:scale-[0.98]"
                      style={{
                        background: copiedHashtagIndex === index ? "rgba(196,152,88,0.12)" : "rgba(255,255,255,0.55)",
                        borderColor: copiedHashtagIndex === index ? "rgba(196,152,88,0.35)" : "rgba(43,74,107,0.15)",
                      }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <span style={{
                        fontFamily: '"Fahkwang", sans-serif',
                        fontWeight: 500,
                        fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                        color: copiedHashtagIndex === index ? GOLD : DARK_NAVY,
                        textAlign: "left",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}>
                        {hashtag}
                      </span>
                      <span style={{
                        fontFamily: '"Cinzel", serif',
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        flexShrink: 0,
                        fontSize: "clamp(0.56rem, 1.5vw, 0.64rem)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: copiedHashtagIndex === index ? GOLD : NAVY_MUTE,
                      }}>
                        {copiedHashtagIndex === index
                          ? <><Check className="w-3 h-3" /> Copied</>
                          : <><Copy className="w-3 h-3" /> Copy</>}
                      </span>
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={copyAllHashtags}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all duration-200 active:scale-[0.98]"
                  style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontWeight: 500,
                    ...(copiedAllHashtags
                      ? { background: "rgba(196,152,88,0.12)", borderColor: "rgba(196,152,88,0.35)", color: GOLD }
                      : { background: "rgba(196,152,88,0.08)", borderColor: "rgba(196,152,88,0.25)", color: DARK_NAVY }),
                  }}
                  onMouseEnter={(e) => { if (!copiedAllHashtags) { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "transparent" } }}
                  onMouseLeave={(e) => { if (!copiedAllHashtags) { e.currentTarget.style.background = "rgba(196,152,88,0.08)"; e.currentTarget.style.color = DARK_NAVY; e.currentTarget.style.borderColor = "rgba(196,152,88,0.25)" } }}
                >
                  {copiedAllHashtags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAllHashtags ? "All Copied!" : "Copy All Hashtags"}
                </button>
              </div>

              {/* ── Social share ── */}
              <div className="rounded-3xl p-4 sm:p-5 md:p-6" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

                <h5 style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
                  color: GOLD,
                  lineHeight: 1.2,
                  textAlign: "center",
                  marginBottom: "0.5rem",
                }}>
                  Share on Social Media
                </h5>
                <p style={{
                  fontFamily: '"Fahkwang", sans-serif',
                  fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                  color: NAVY_MUTE,
                  fontStyle: "italic",
                  lineHeight: 1.75,
                  textAlign: "center",
                  marginBottom: "1rem",
                }}>
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
                      className="group flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                      style={{
                        fontFamily: '"Cinzel", serif',
                        background: "rgba(255,255,255,0.55)",
                        border: "1.5px solid rgba(43,74,107,0.15)",
                        color: DARK_NAVY,
                        fontSize: "clamp(0.56rem, 1.5vw, 0.64rem)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "transparent" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.55)"; e.currentTarget.style.color = DARK_NAVY; e.currentTarget.style.borderColor = "rgba(43,74,107,0.15)" }}
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Drive upload ── */}
              {driveLink && (
                <div className="rounded-3xl p-4 sm:p-5 md:p-7 text-center" style={cardStyle}>
                  <div className="h-px w-full mb-4" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

                  <div
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 mb-4"
                    style={{
                      fontFamily: '"Cinzel", serif',
                      fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
                      letterSpacing: "0.30em",
                      textTransform: "uppercase",
                      background: GOLD,
                      borderColor: "transparent",
                      color: "white",
                      boxShadow: "0 2px 10px rgba(196,152,88,0.30)",
                    }}
                  >
                    Upload Your Photos &amp; Videos
                  </div>

                  <p style={{
                    fontFamily: '"Fahkwang", sans-serif',
                    fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                    color: NAVY_MUTE,
                    fontStyle: "italic",
                    lineHeight: 1.75,
                    marginBottom: "1.25rem",
                  }}>
                    Help us capture this sacred day! Scan the QR or use the actions below to drop your photos and clips into our shared Drive.
                  </p>

                  {/* Drive QR */}
                  <div className="mx-auto inline-flex flex-col items-center p-3 sm:p-5 rounded-2xl mb-4"
                    style={{ background: "rgba(255,255,255,0.70)", border: "1.5px solid rgba(43,74,107,0.15)", boxShadow: "0 4px 16px rgba(43,74,107,0.06)" }}>
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 rounded-xl" style={{ background: "rgba(196,152,88,0.06)", border: "1px solid rgba(43,74,107,0.12)" }}>
                      <div className="bg-white p-1.5 sm:p-2 rounded-lg shadow-sm">
                        <QRCodeCanvas id="drive-qr" value={driveLink} size={isMobile ? 130 : 190} includeMargin className="bg-white" fgColor={QR_FG_HEX} />
                      </div>
                    </div>
                    <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                      Scan with your camera app
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-2.5">
                    <button
                      onClick={copyDriveLink}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full transition-all hover:scale-105"
                      style={{
                        fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        ...(copiedDriveLink
                          ? { fontFamily: '"Cinzel", serif', background: "rgba(196,152,88,0.12)", color: GOLD, border: "1px solid rgba(196,152,88,0.35)" }
                          : btnPrimary),
                      }}
                    >
                      {copiedDriveLink ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                    </button>
                    <button
                      onClick={downloadDriveQRCode}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full transition-all hover:scale-105"
                      style={{ fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", letterSpacing: "0.12em", textTransform: "uppercase", ...btnPrimary }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = DARK_NAVY }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = GOLD }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download QR
                    </button>
                    <a
                      href={driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border transition-all hover:scale-105"
                      style={{
                        fontFamily: '"Cinzel", serif',
                        fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        background: "rgba(255,255,255,0.55)",
                        borderColor: "rgba(43,74,107,0.15)",
                        color: DARK_NAVY,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "transparent" }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.55)"; e.currentTarget.style.color = DARK_NAVY; e.currentTarget.style.borderColor = "rgba(43,74,107,0.15)" }}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Open Drive
                    </a>
                  </div>
                  <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, fontStyle: "italic", marginTop: "0.75rem" }}>
                    or tap &quot;Open Google Drive Folder.&quot;
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* ── Closing card ── */}
          <motion.div className="text-center mt-8 sm:mt-12" variants={fadeInUp}>
            <div className="rounded-3xl p-5 sm:p-7 max-w-2xl mx-auto" style={FROSTED_CARD}>
              <OrnamentDivider width="180px" />

              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                color: NAVY_MUTE,
                fontStyle: "italic",
                lineHeight: 1.75,
                marginTop: "1rem",
              }}>
                Thank you for helping make {childName}&apos;s christening a day to remember.
                Your photos, prayers, and presence are the most beautiful gift.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
