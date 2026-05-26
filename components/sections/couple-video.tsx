"use client"

import { useRef } from "react"
import { Section } from "@/components/section"
import { motion } from "motion/react"
import Image from "next/image"
import { useAudio } from "@/contexts/audio-context"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP      = "#3D2810"
const MEDIUM    = "#8C6035"
const GOLD      = "#B8822A"
const IVORY     = "#FEF9F3"
const BLUSH     = "#EED4BC"
const BB_DARK   = "#3FA3C8"
const BB_MID    = "#7BBEDD"
const BB_SOFT   = "#D5EEF8"

// ── Bokeh orbs ────────────────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 400, h: 400, top: "3%",  left: "1%",  color: BB_DARK, opacity: 0.09, blur: 110 },
    { w: 280, h: 280, top: "18%", left: "72%", color: GOLD,    opacity: 0.09, blur: 85  },
    { w: 320, h: 320, top: "55%", left: "8%",  color: BLUSH,   opacity: 0.12, blur: 95  },
    { w: 240, h: 240, top: "70%", left: "75%", color: BB_DARK, opacity: 0.09, blur: 75  },
    { w: 190, h: 190, top: "40%", left: "45%", color: GOLD,    opacity: 0.07, blur: 65  },
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

export function CoupleVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { pauseMusic, resumeMusic } = useAudio()

  const handlePlay = () => pauseMusic()
  const handlePauseOrEnd = () => resumeMusic()

  return (
    <Section
      id="couple-video"
      className="relative py-12 sm:py-16 md:py-20 overflow-hidden"
      bgColor="none"
    >
      {/* ── Solid ivory base ── */}
      <div className="absolute inset-0 -z-10" style={{ background: IVORY }} />

      {/* Soft tinted gradient layer */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `
          linear-gradient(180deg,
            rgba(213,238,248,0.50) 0%,
            rgba(254,249,243,0.0)  25%,
            rgba(184,212,234,0.32) 50%,
            rgba(254,249,243,0.0)  75%,
            rgba(238,212,188,0.38) 100%
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

      {/* Corner florals */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <Image src="/decoration/left-top-removebg-preview.png"    alt="" width={200} height={200} aria-hidden className="absolute top-0 left-0  w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
        <Image src="/decoration/right-top-removebg-preview.png"   alt="" width={200} height={200} aria-hidden className="absolute top-0 right-0 w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
        <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={200} height={200} aria-hidden className="absolute bottom-0 left-0  w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
        <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={200} height={200} aria-hidden className="absolute bottom-0 right-0 w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
      </div>

      {/* Subtle centre glow accent */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 28%, rgba(63,163,200,0.11) 0%, transparent 70%),
            radial-gradient(ellipse 38% 32% at 50% 78%, rgba(184,130,42,0.08) 0%, transparent 65%)
          `,
        }} />
      </div>

      {/* ── Header ── */}
      <motion.div
        className="relative z-10 text-center mb-8 sm:mb-10 md:mb-12 px-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Eyebrow label */}
        <p
          className="garamond uppercase mb-2"
          style={{
            fontSize: "clamp(0.52rem, 2vw, 0.66rem)",
            letterSpacing: "0.52em",
            color: BB_DARK,
            paddingRight: "0.52em",
          }}
        >
          A Special Moment
        </p>

        {/* Divider rule */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to left, ${GOLD}88, transparent)` }} />
          <span style={{ color: GOLD, fontSize: "8px", opacity: 0.9 }}>✦</span>
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to right, ${GOLD}88, transparent)` }} />
        </div>

        {/* Main title */}
        <h2
          className="gistesy"
          style={{
            fontSize: "clamp(2.6rem, 10vw, 5.2rem)",
            color: DEEP,
            lineHeight: 1.1,
            letterSpacing: "0.02em",
            overflow: "visible",
            paddingTop: "0.1em",
            marginBottom: "0.5rem",
          }}
        >
          Our Gender Reveal
        </h2>

        {/* Sub-divider */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-6 sm:w-10" style={{ background: `linear-gradient(to left, ${BB_MID}cc, transparent)` }} />
          <span style={{ color: BB_MID, fontSize: "4px" }}>◆◆◆</span>
          <div className="h-px w-6 sm:w-10" style={{ background: `linear-gradient(to right, ${BB_MID}cc, transparent)` }} />
        </div>

        {/* Subtitle */}
        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.78rem, 2.8vw, 0.96rem)",
            color: MEDIUM,
            fontStyle: "italic",
            lineHeight: 1.9,
            maxWidth: "400px",
            margin: "0 auto",
          }}
        >
          The moment we discovered the wonderful blessing God had in store for us
        </p>
      </motion.div>

      {/* ── Video Container ── */}
      <div className="relative z-10 px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="relative group"
          >
            {/* Outer glow */}
            <div
              className="absolute -inset-3 rounded-2xl blur-2xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"
              style={{ background: `linear-gradient(135deg, ${BB_SOFT}88, ${BB_MID}55)` }}
            />

            {/* Frosted frame wrapper */}
            <div
              className="relative overflow-hidden rounded-xl sm:rounded-2xl"
              style={{
                background: "rgba(254,249,243,0.80)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(184,130,42,0.18)",
                boxShadow: "0 12px 48px rgba(61,40,16,0.12), 0 2px 10px rgba(61,40,16,0.06)",
              }}
            >
              {/* Gold corner accents */}
              {(["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"] as const).map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-10 sm:w-14 h-10 sm:h-14 pointer-events-none z-20`}>
                  <div
                    className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-full h-px`}
                    style={{ background: `linear-gradient(to ${i % 2 === 0 ? "right" : "left"}, ${GOLD}88, transparent)` }}
                  />
                  <div
                    className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-px h-full`}
                    style={{ background: `linear-gradient(to ${i < 2 ? "bottom" : "top"}, ${GOLD}88, transparent)` }}
                  />
                </div>
              ))}

              {/* Video */}
              <video
                ref={videoRef}
                src="/desktop_background/IMG_8045.mov"
                poster="/background_music/LinkPreview.png"
                controls
                playsInline
                className="w-full block"
                style={{ display: "block", background: "#000" }}
                onPlay={handlePlay}
                onPause={handlePauseOrEnd}
                onEnded={handlePauseOrEnd}
              />
            </div>
          </motion.div>

          {/* Caption */}
          <motion.div
            className="flex flex-col items-center gap-3 mt-8 sm:mt-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div
              className="rounded-2xl px-8 py-4"
              style={{
                background: "rgba(254,249,243,0.85)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(184,130,42,0.15)",
                boxShadow: "0 4px 20px rgba(61,40,16,0.07)",
              }}
            >
              <div className="flex items-center gap-3 mb-2 justify-center">
                <div className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to left, ${GOLD}80, transparent)` }} />
                <span style={{ color: BB_DARK, fontSize: "5px" }}>◆</span>
                <div className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to right, ${GOLD}80, transparent)` }} />
              </div>
              <p
                className="garamond text-center"
                style={{
                  fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)",
                  color: MEDIUM,
                  fontStyle: "italic",
                  lineHeight: 1.85,
                }}
              >
                A cherished memory we are overjoyed to share with you
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

