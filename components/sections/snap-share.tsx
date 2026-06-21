"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { Instagram, Facebook, Twitter, Share2, Copy, Download, Check } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { siteConfig } from "@/content/site"
import { C, text } from "@/components/loader/christening-theme"
import { CornerFloralDecor } from "@/components/loader/ChristeningDecor"

const cardStyle = {
  background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 48%, ${C.champagne} 100%)`,
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
} as const

const goldLine = `linear-gradient(to right, transparent, ${C.gold}, transparent)`

const childName = siteConfig.couple.child
const childSlug = childName.toLowerCase().replace(/\s+/g, "-")

// QRCodeCanvas renders to <canvas> — must be a literal hex
const QR_FG_HEX = C.roseDeep

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

export function SnapShare() {
  const [copiedHashtagIndex, setCopiedHashtagIndex] = useState<number | null>(null)
  const [copiedAllHashtags, setCopiedAllHashtags]   = useState(false)
  const [copiedDriveLink, setCopiedDriveLink]       = useState(false)
  const [isMobile, setIsMobile]                     = useState(false)

  const websiteUrl  = typeof window !== "undefined" ? window.location.href : "https://example.com"
  const driveLink   = siteConfig.snapShare.googleDriveLink
  const hashtags    = siteConfig.snapShare.hashtag
  const allHashtags = hashtags.join(" ")

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
    link.download = `${childSlug}-christening-qr.png`
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  const downloadDriveQRCode = () => {
    const canvas = document.getElementById("drive-qr") as HTMLCanvasElement | null
    if (!canvas) return
    const link = document.createElement("a")
    link.download = `${childSlug}-drive-qr.png`
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

  const btnPrimary: React.CSSProperties = {
    fontFamily: '"Cinzel", serif',
    background: C.roseDeep,
    color: C.pearl,
    border: "none",
    boxShadow: "0 4px 14px rgba(107,61,79,0.22)",
  }

  const qrFrameStyle: React.CSSProperties = {
    background: C.pearl,
    border: `1.5px solid ${C.blushDeep}`,
    boxShadow: "0 4px 16px rgba(107,61,79,0.06)",
  }

  return (
    <section id="snap-share" className="relative w-full overflow-hidden">

      {/* Layered christening background */}
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

      <div className="relative z-10 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 md:px-8">

          {/* Section header */}
          <motion.div
            className="text-center mb-8 sm:mb-12 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block rounded-3xl px-8 py-7 sm:px-12 sm:py-9 isolate" style={cardStyle}>
              <p style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.58rem, 2vw, 0.72rem)",
                fontWeight: 600,
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: C.goldDeep,
                marginBottom: "0.5rem",
                paddingRight: "0.36em",
              }}>
                Share the Blessing
              </p>

              <h2 style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 7vw, 3rem)",
                color: C.roseDeep,
                lineHeight: 1.1,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}>
                Capture &amp; Share the Joy
              </h2>

              <GoldRule width="100%" />

              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
                color: text.body,
                lineHeight: 1.8,
                fontStyle: "italic",
                maxWidth: "32rem",
                margin: "0.75rem auto 0",
              }}>
                Help us remember the little moments of {childName}&apos;s blessed day — every smile, embrace, and candid laugh.
                Your photos and clips complete this cherished memory.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
            variants={staggerChildren} initial="initial" animate="animate"
          >
            <motion.div className="space-y-4 flex flex-col lg:order-2" variants={fadeInUp}>

              {/* Share Website QR */}
              <div className="rounded-3xl p-4 sm:p-5 md:p-7 text-center flex flex-col isolate" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: goldLine, opacity: 0.5 }} />

                <h4 style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
                  color: C.goldDeep,
                  lineHeight: 1.2,
                  marginBottom: "0.5rem",
                }}>
                  Share Our Invitation
                </h4>
                <p style={{
                  fontFamily: '"Fahkwang", sans-serif',
                  fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
                  color: text.body,
                  fontStyle: "italic",
                  lineHeight: 1.75,
                  marginBottom: "1rem",
                }}>
                  Spread the word about {childName}&apos;s christening. Share this QR code so loved ones can join the celebration.
                </p>

                <div className="mx-auto inline-flex flex-col items-center p-3 sm:p-5 rounded-2xl mb-4" style={qrFrameStyle}>
                  <div className="mb-2 sm:mb-3 p-2 sm:p-3 rounded-xl" style={{ background: C.blushSoft, border: `1px solid ${C.blushDeep}` }}>
                    <div className="p-1.5 sm:p-2 rounded-lg shadow-sm" style={{ background: C.pearl }}>
                      <QRCodeCanvas
                        id="snapshare-qr"
                        value={websiteUrl}
                        size={isMobile ? 140 : 200}
                        includeMargin
                        fgColor={QR_FG_HEX}
                        bgColor={C.pearl}
                      />
                    </div>
                  </div>
                  <button
                    onClick={downloadQRCode}
                    className="flex items-center gap-1.5 mx-auto px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{ ...btnPrimary, fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", letterSpacing: "0.12em", textTransform: "uppercase" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.goldDeep; e.currentTarget.style.boxShadow = "0 6px 18px rgba(201,168,108,0.28)" }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = C.roseDeep; e.currentTarget.style.boxShadow = "0 4px 14px rgba(107,61,79,0.22)" }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download QR
                  </button>
                </div>

                <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: text.caption, fontStyle: "italic" }}>
                  Scan with any camera app to open the full invitation.
                </p>
              </div>

              {/* Hashtags */}
              <div className="rounded-3xl p-4 sm:p-5 text-center isolate" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: goldLine, opacity: 0.5 }} />

                <h5 style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
                  color: C.goldDeep,
                  lineHeight: 1.2,
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
                        background: copiedHashtagIndex === index ? C.blushSoft : C.pearl,
                        borderColor: copiedHashtagIndex === index ? C.goldDeep : C.blushDeep,
                      }}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                    >
                      <span style={{
                        fontFamily: '"Fahkwang", sans-serif',
                        fontWeight: 500,
                        fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
                        color: copiedHashtagIndex === index ? C.goldDeep : C.roseDeep,
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
                        color: copiedHashtagIndex === index ? C.goldDeep : text.caption,
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
                      ? { background: C.blushSoft, borderColor: C.goldDeep, color: C.goldDeep }
                      : { background: C.blushSoft, borderColor: C.blushDeep, color: C.roseDeep }),
                  }}
                  onMouseEnter={(e) => { if (!copiedAllHashtags) { e.currentTarget.style.background = C.goldDeep; e.currentTarget.style.color = C.pearl; e.currentTarget.style.borderColor = C.goldDeep } }}
                  onMouseLeave={(e) => { if (!copiedAllHashtags) { e.currentTarget.style.background = C.blushSoft; e.currentTarget.style.color = C.roseDeep; e.currentTarget.style.borderColor = C.blushDeep } }}
                >
                  {copiedAllHashtags ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAllHashtags ? "All Copied!" : "Copy All Hashtags"}
                </button>
              </div>

              {/* Social share */}
              <div className="rounded-3xl p-4 sm:p-5 md:p-6 isolate" style={cardStyle}>
                <div className="h-px w-full mb-4" style={{ background: goldLine, opacity: 0.5 }} />

                <h5 style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
                  color: C.goldDeep,
                  lineHeight: 1.2,
                  textAlign: "center",
                  marginBottom: "0.5rem",
                }}>
                  Share on Social Media
                </h5>
                <p style={{
                  fontFamily: '"Fahkwang", sans-serif',
                  fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
                  color: text.body,
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
                        background: C.pearl,
                        border: `1.5px solid ${C.blushDeep}`,
                        color: C.roseDeep,
                        fontSize: "clamp(0.56rem, 1.5vw, 0.64rem)",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = C.goldDeep; e.currentTarget.style.color = C.pearl; e.currentTarget.style.borderColor = C.goldDeep }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = C.pearl; e.currentTarget.style.color = C.roseDeep; e.currentTarget.style.borderColor = C.blushDeep }}
                    >
                      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drive upload */}
              {driveLink && (
                <div className="rounded-3xl p-4 sm:p-5 md:p-7 text-center isolate" style={cardStyle}>
                  <div className="h-px w-full mb-4" style={{ background: goldLine, opacity: 0.5 }} />

                  <div
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 mb-4"
                    style={{
                      fontFamily: '"Cinzel", serif',
                      fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
                      letterSpacing: "0.30em",
                      textTransform: "uppercase",
                      background: C.roseDeep,
                      borderColor: "transparent",
                      color: C.pearl,
                      boxShadow: "0 2px 10px rgba(107,61,79,0.22)",
                    }}
                  >
                    Upload Your Photos &amp; Videos
                  </div>

                  <p style={{
                    fontFamily: '"Fahkwang", sans-serif',
                    fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
                    color: text.body,
                    fontStyle: "italic",
                    lineHeight: 1.75,
                    marginBottom: "1.25rem",
                  }}>
                    Help us capture this sacred day! Scan the QR or use the actions below to drop your photos and clips into our shared Drive.
                  </p>

                  <div className="mx-auto inline-flex flex-col items-center p-3 sm:p-5 rounded-2xl mb-4" style={qrFrameStyle}>
                    <div className="mb-2 sm:mb-3 p-2 sm:p-3 rounded-xl" style={{ background: C.blushSoft, border: `1px solid ${C.blushDeep}` }}>
                      <div className="p-1.5 sm:p-2 rounded-lg shadow-sm" style={{ background: C.pearl }}>
                        <QRCodeCanvas id="drive-qr" value={driveLink} size={isMobile ? 130 : 190} includeMargin fgColor={QR_FG_HEX} bgColor={C.pearl} />
                      </div>
                    </div>
                    <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: text.caption, fontStyle: "italic" }}>
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
                          ? { fontFamily: '"Cinzel", serif', background: C.blushSoft, color: C.goldDeep, border: `1px solid ${C.goldDeep}` }
                          : btnPrimary),
                      }}
                    >
                      {copiedDriveLink ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Link</>}
                    </button>
                    <button
                      onClick={downloadDriveQRCode}
                      className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full transition-all hover:scale-105"
                      style={{ fontSize: "clamp(0.62rem, 1.6vw, 0.72rem)", letterSpacing: "0.12em", textTransform: "uppercase", ...btnPrimary }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = C.goldDeep }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = C.roseDeep }}
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
                        background: C.pearl,
                        borderColor: C.blushDeep,
                        color: C.roseDeep,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = C.goldDeep; e.currentTarget.style.color = C.pearl; e.currentTarget.style.borderColor = C.goldDeep }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = C.pearl; e.currentTarget.style.color = C.roseDeep; e.currentTarget.style.borderColor = C.blushDeep }}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      Open Drive
                    </a>
                  </div>
                  <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: text.caption, fontStyle: "italic", marginTop: "0.75rem" }}>
                    or tap &quot;Open Drive.&quot;
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Closing card */}
          <motion.div className="text-center mt-8 sm:mt-12" variants={fadeInUp}>
            <div className="rounded-3xl p-5 sm:p-7 max-w-2xl mx-auto isolate" style={cardStyle}>
              <GoldRule width="180px" />

              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
                color: text.body,
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
