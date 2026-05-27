"use client"

import { useRef } from "react"
import { Section } from "@/components/section"
import { motion } from "motion/react"
import Image from "next/image"
import { useAudio } from "@/contexts/audio-context"

// ── Motif palette — aligned with loader/Hero.tsx ──────────────────────────────
const GOLD      = "#C4965A"
const NAVY_MUTE = "rgba(65,90,115,0.80)"

// ── Bokeh orbs — warm gold + soft blue water tones ────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 400, h: 400, top: "3%",  left: "1%",  color: "rgba(120,175,215,1)", opacity: 0.08, blur: 110 },
    { w: 280, h: 280, top: "18%", left: "72%", color: "rgba(196,152,88,1)",  opacity: 0.08, blur: 85  },
    { w: 320, h: 320, top: "55%", left: "8%",  color: "rgba(196,152,88,1)",  opacity: 0.07, blur: 95  },
    { w: 240, h: 240, top: "70%", left: "75%", color: "rgba(120,175,215,1)", opacity: 0.08, blur: 75  },
    { w: 190, h: 190, top: "40%", left: "45%", color: "rgba(196,152,88,1)",  opacity: 0.06, blur: 65  },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {orbs.map((o, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: o.w, height: o.h, top: o.top, left: o.left,
          background: o.color, opacity: o.opacity, filter: `blur(${o.blur}px)`,
        }} />
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
      {/* ── White base — matching Hero ── */}
      <div className="absolute inset-0 -z-10" style={{ background: "#FFFFFF" }} />

      {/* Center spotlight */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse 72% 65% at 50% 48%, rgba(255,255,255,0.68) 0%, transparent 72%)",
      }} />

      {/* Bottom water wash */}
      <div className="absolute pointer-events-none -z-10" style={{
        bottom: 0, left: 0, right: 0, height: "36%",
        background: "linear-gradient(0deg, rgba(120,175,215,0.18) 0%, rgba(140,185,220,0.08) 45%, transparent 100%)",
      }} />

      <BokehOrbs />

      {/* Corner florals */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <Image src="/decoration/left-top-removebg-preview.png"    alt="" width={200} height={200} aria-hidden className="absolute top-0 left-0  w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-40" />
        <Image src="/decoration/right-top-removebg-preview.png"   alt="" width={200} height={200} aria-hidden className="absolute top-0 right-0 w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-40" />
        <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={200} height={200} aria-hidden className="absolute bottom-0 left-0  w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-40" />
        <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={200} height={200} aria-hidden className="absolute bottom-0 right-0 w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-40" />
      </div>

      {/* ── Header ── */}
      <motion.div
        className="relative z-10 text-center mb-8 sm:mb-10 md:mb-12 px-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Eyebrow — Cinzel with hairlines, matching Hero */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div style={{ width: "clamp(16px,4vw,28px)", height: "1px", background: "linear-gradient(to right, transparent, rgba(80,120,155,0.40))" }} />
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.52rem, 2vw, 0.66rem)",
            letterSpacing: "0.44em",
            textTransform: "uppercase",
            color: "rgba(72,112,148,0.80)",
            paddingRight: "0.44em",
            margin: 0,
          }}>
            A Special Moment
          </p>
          <div style={{ width: "clamp(16px,4vw,28px)", height: "1px", background: "linear-gradient(to left, transparent, rgba(80,120,155,0.40))" }} />
        </div>

        {/* Diamond rule — matching Hero */}
        <div className="flex items-center justify-center gap-2 mb-4" style={{ maxWidth: "240px", margin: "0 auto clamp(0.8rem,2vw,1.2rem)" }}>
          <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
          <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)" }} />
          <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
        </div>

        {/* Main title — LeJourScript gold */}
        <h2 style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 700,
          fontSize: "clamp(2.6rem, 10vw, 5.2rem)",
          color: "rgba(43,74,107,0.55)",
          lineHeight: 1.1,
          letterSpacing: "0.02em",
          marginBottom: "0.5rem",
        }}>
          Our Gender Reveal
        </h2>

        {/* Diamond rule below title */}
        <div className="flex items-center justify-center gap-2" style={{ maxWidth: "180px", margin: "0 auto clamp(0.6rem,1.8vw,1rem)" }}>
          <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.38), transparent)" }} />
          <div style={{ width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.55)" }} />
          <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.38), transparent)" }} />
        </div>

        {/* Subtitle — Fahkwang navy */}
        <p style={{
          fontFamily: '"Fahkwang", sans-serif',
          fontWeight: 400,
          fontSize: "clamp(0.78rem, 2.8vw, 0.96rem)",
          color: NAVY_MUTE,
          fontStyle: "italic",
          lineHeight: 1.9,
          maxWidth: "400px",
          margin: "0 auto",
        }}>
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
            {/* Outer glow — gold toned */}
            <div
              className="absolute -inset-3 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"
              style={{ background: "linear-gradient(135deg, rgba(196,152,88,0.28), rgba(120,175,215,0.18))" }}
            />

            {/* Frame wrapper */}
            <div
              className="relative overflow-hidden rounded-xl sm:rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: `1px solid rgba(196,152,88,0.22)`,
                boxShadow: `0 12px 48px rgba(43,74,107,0.10), 0 2px 10px rgba(43,74,107,0.06)`,
              }}
            >
              {/* Gold corner accents */}
              {(["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"] as const).map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-10 sm:w-14 h-10 sm:h-14 pointer-events-none z-20`}>
                  <div
                    className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-full h-px`}
                    style={{ background: `linear-gradient(to ${i % 2 === 0 ? "right" : "left"}, rgba(196,152,88,0.60), transparent)` }}
                  />
                  <div
                    className={`absolute ${i < 2 ? "top-0" : "bottom-0"} ${i % 2 === 0 ? "left-0" : "right-0"} w-px h-full`}
                    style={{ background: `linear-gradient(to ${i < 2 ? "bottom" : "top"}, rgba(196,152,88,0.60), transparent)` }}
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
                background: "rgba(255,255,255,0.88)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(196,152,88,0.18)",
                boxShadow: `0 4px 20px rgba(43,74,107,0.07)`,
              }}
            >
              {/* Diamond rule */}
              <div className="flex items-center gap-3 mb-3 justify-center">
                <div className="h-px w-14 sm:w-24" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.50), transparent)" }} />
                <div style={{ width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.65)" }} />
                <div className="h-px w-14 sm:w-24" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.50), transparent)" }} />
              </div>
              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontWeight: 400,
                fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)",
                color: NAVY_MUTE,
                fontStyle: "italic",
                lineHeight: 1.85,
                textAlign: "center",
              }}>
                A cherished memory we are overjoyed to share with you
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  )
}

