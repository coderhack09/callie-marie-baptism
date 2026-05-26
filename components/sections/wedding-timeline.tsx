"use client"

import { Section } from "@/components/section"
import { motion } from "motion/react"
import Image from "next/image"
import { useRef, useEffect } from "react"
import { Heart, Star } from "lucide-react"

// ── Palette ───────────────────────────────────────────────────────────────────
const DEEP      = "#3D2810"   // deeper brown for stronger text contrast
const MEDIUM    = "#8C6035"
const BABY_BLUE = "#3FA3C8"
const BLUE_SOFT = "#D5EEF8"
const BLUE_MID  = "#7BBEDD"
const GOLD      = "#B8822A"
const BLUSH     = "#EED4BC"
const IVORY     = "#FEF9F3"  // solid base

// ── Types ─────────────────────────────────────────────────────────────────────
interface Milestone {
  date?: string
  title: string
  details?: string[]
  caption?: string
  media?: { type: "photo" | "video"; src?: string }
  isFinal?: boolean
}

// ── Timeline data ─────────────────────────────────────────────────────────────
const milestones: Milestone[] = [
  {
    date: "May 5, 2025",
    title: "The Day My Miracle Began",
    caption: "IUI Procedure — with Doctor & Nurse",
    media: { type: "photo", src: "/desktop_background/image00001.jpeg" },
  },
  {
    date: "May 23, 2025",
    title: "The Day Heaven Answered Their Prayers",
    caption: "The moment they found out they were pregnant",
    media: { type: "video", src: "/desktop_background/ScreenRecording_05-25-2026 13-15-38_1.mov" },
  },
  {
    title: "First Glimpse of Me",
    caption: "Ultrasound",
    media: { type: "video", src: "/desktop_background/IMG_3693.mov" },
  },
  {
    date: "September 19, 2025",
    title: "The Day They Shared Me with the World",
    caption: "Pregnancy Announcement",
    media: { type: "video", src: "/desktop_background/copy_9EFACE50-A32C-4CBC-86C7-6749533E1305.mov" },
  },
  {
    date: "November 6, 2025",
    title: "The Day They Learned I Was a Boy",
    caption: "Gender Reveal",
    media: { type: "video", src: "/desktop_background/IMG_8045.mov" },
  },
  {
    date: "January 12, 2026",
    title: "The Day They Finally Held Me",
    details: ["2:35 PM", "2.540 kg · 46 cm", "Emergency C-Section"],
    caption: "Birth & Hospital Photos",
    media: { type: "photo", src: "/desktop_background/image00008.jpeg" },
  },
  {
    date: "July 4, 2026",
    title: "And Now I Am Getting Baptized",
    caption: "Family Photo with Rosary",
    media: { type: "photo", src: "/desktop_background/image00005.jpeg" },
    isFinal: true,
  },
]

// ── Auto-play video on scroll ─────────────────────────────────────────────────
function AutoPlayVideo({ src, caption }: { src: string; caption?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {})
          } else {
            video.pause()
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="rounded-2xl overflow-hidden border-2 shadow-[0_8px_32px_rgba(91,181,213,0.30)]"
      style={{ borderColor: BLUE_MID, background: "#fff" }}
    >
      <div className="relative">
        <video
          ref={videoRef}
          src={src}
          className="w-full aspect-[3/4] object-cover block"
          loop
          muted
          playsInline
          preload="metadata"
          controls
        />
        {/* Shimmer ring on top */}
        <div
          className="absolute inset-0 pointer-events-none rounded-t-2xl"
          style={{ boxShadow: `inset 0 0 0 1.5px rgba(91,181,213,0.18)` }}
        />
      </div>
      {caption && (
        <div className="px-3 py-2.5" style={{ background: `linear-gradient(to bottom, #fff, ${BLUE_SOFT}88)` }}>
          <p className="garamond text-center" style={{ fontSize: "clamp(0.58rem, 1.8vw, 0.68rem)", color: `${DEEP}99` }}>
            {caption}
          </p>
        </div>
      )}
    </div>
  )
}

// ── Media slot ────────────────────────────────────────────────────────────────
function MediaSlot({
  media,
  caption,
  rotate = 0,
}: {
  media?: { type: "photo" | "video"; src?: string }
  caption?: string
  rotate?: number
}) {
  if (!media) return null

  if (media.type === "photo") {
    return (
      <div className="w-full max-w-[190px] sm:max-w-[215px]" style={{ transform: `rotate(${rotate}deg)` }}>
        {/* Polaroid card */}
        <div
          className="rounded-sm overflow-hidden"
          style={{
            background: "#fff",
            padding: "7px",
            paddingBottom: "34px",
            boxShadow: "0 8px 32px rgba(107,79,58,0.18), 0 2px 8px rgba(107,79,58,0.10)",
          }}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-[2px]">
            {media.src ? (
              <Image
                src={media.src}
                alt={caption ?? ""}
                fill
                className="object-cover object-top"
                sizes="215px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: BLUE_SOFT }}>
                <Star className="w-8 h-8 opacity-30" style={{ color: BABY_BLUE }} />
              </div>
            )}
            {/* Subtle vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 18px rgba(0,0,0,0.08)" }} />
          </div>
          {caption && (
            <p
              className="garamond text-center mt-2"
              style={{ fontSize: "clamp(0.58rem, 1.8vw, 0.68rem)", color: `${DEEP}99`, lineHeight: 1.4 }}
            >
              {caption}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Video slot
  return (
    <div className="w-full max-w-[190px] sm:max-w-[215px]">
      {media.src ? (
        <AutoPlayVideo src={media.src} caption={caption} />
      ) : (
        <div
          className="rounded-2xl overflow-hidden border-2"
          style={{ borderColor: BLUE_MID }}
        >
          <div
            className="relative aspect-[3/4] flex flex-col items-center justify-center gap-3"
            style={{ background: `linear-gradient(160deg, ${BLUE_SOFT} 0%, #C8E8F8 100%)` }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(91,181,213,0.18)", border: `2px solid ${BABY_BLUE}` }}
            >
              <svg className="w-5 h-5 ml-0.5" fill={BABY_BLUE} viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p className="garamond text-center px-4" style={{ fontSize: "clamp(0.6rem, 2vw, 0.7rem)", color: `${DEEP}88` }}>
              Video coming soon
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Timeline dot ─────────────────────────────────────────────────────────────
function TimelineDot({ isFinal }: { isFinal?: boolean }) {
  if (isFinal) {
    return (
      <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
        <div className="absolute w-12 h-12 rounded-full animate-ping opacity-10" style={{ background: BABY_BLUE }} />
        <div className="absolute w-10 h-10 rounded-full opacity-20 animate-pulse" style={{ background: BABY_BLUE }} />
        <div
          className="w-7 h-7 rounded-full border-2 flex items-center justify-center shadow-[0_0_12px_rgba(91,181,213,0.55)]"
          style={{ background: `linear-gradient(135deg, ${BABY_BLUE}, #3DA8CC)`, borderColor: "#fff" }}
        >
          <Heart className="w-3.5 h-3.5" fill="#fff" style={{ color: "#fff" }} />
        </div>
      </div>
    )
  }
  return (
    <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0">
      <div className="absolute w-8 h-8 rounded-full opacity-0 hover:opacity-25 transition-opacity duration-300" style={{ background: BABY_BLUE }} />
      <div
        className="w-4 h-4 rounded-full border-2 shadow-[0_0_8px_rgba(91,181,213,0.45)]"
        style={{
          background: `linear-gradient(135deg, ${BABY_BLUE}, #3DA8CC)`,
          borderColor: "#fff",
          boxShadow: `0 0 0 3px ${BLUE_MID}, 0 0 12px rgba(91,181,213,0.35)`,
        }}
      />
    </div>
  )
}

// ── Single milestone entry ────────────────────────────────────────────────────
function MilestoneEntry({ milestone, index }: { milestone: Milestone; index: number }) {
  const isEven = index % 2 === 0
  const rotation = isEven ? 1.8 : -1.8

  const textBlock = (
    <div
      className={`flex-1 min-w-0 rounded-2xl px-4 py-4 sm:px-5 sm:py-5 ${isEven ? "text-right" : "text-left"}`}
      style={{
        background: "rgba(254,249,243,0.88)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        border: "1px solid rgba(184,130,42,0.15)",
        boxShadow: "0 4px 24px rgba(61,40,16,0.07), 0 1px 6px rgba(61,40,16,0.04)",
      }}
    >
      {milestone.date && (
        <p
          className="garamond uppercase mb-1.5"
          style={{
            fontSize: "clamp(0.52rem, 1.8vw, 0.64rem)",
            letterSpacing: "0.36em",
            color: BABY_BLUE,
            paddingRight: isEven ? "0.36em" : 0,
            paddingLeft: isEven ? 0 : "0.36em",
          }}
        >
          {milestone.date}
        </p>
      )}
      <h3
        className="gistesy"
        style={{
          fontSize: "clamp(1.1rem, 3.5vw, 1.65rem)",
          color: milestone.isFinal ? BABY_BLUE : DEEP,
          lineHeight: 1.15,
          overflow: "visible",
          paddingTop: "0.05em",
          textShadow: milestone.isFinal
            ? `0 2px 16px rgba(63,163,200,0.22)`
            : "none",
        }}
      >
        {milestone.title}
      </h3>
      {milestone.details && (
        <div className={`flex flex-col mt-1.5 gap-0.5 ${isEven ? "items-end" : "items-start"}`}>
          {milestone.details.map((d) => (
            <span
              key={d}
              className="garamond"
              style={{ fontSize: "clamp(0.68rem, 2.2vw, 0.8rem)", color: MEDIUM }}
            >
              {d}
            </span>
          ))}
        </div>
      )}
      {/* Ornament */}
      <div className={`flex items-center gap-2 mt-3 ${isEven ? "justify-end" : "justify-start"}`}>
        <div className="h-px w-10" style={{ background: `linear-gradient(to ${isEven ? "left" : "right"}, ${GOLD}88, transparent)` }} />
        <span style={{ color: GOLD, fontSize: "5px", opacity: 0.8 }}>◆</span>
        <div className="h-px w-10" style={{ background: `linear-gradient(to ${isEven ? "right" : "left"}, ${GOLD}88, transparent)` }} />
      </div>
    </div>
  )

  const mediaBlock = (
    <div className={`flex ${isEven ? "justify-start pl-3 sm:pl-5" : "justify-end pr-3 sm:pr-5"} flex-1 min-w-0`}>
      <MediaSlot media={milestone.media} caption={milestone.caption} rotate={rotation} />
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10"
    >
      {/* Desktop */}
      <div className="hidden md:grid items-center" style={{ gridTemplateColumns: "1fr 56px 1fr" }}>
        <div className="flex items-center justify-end">
          {isEven ? textBlock : mediaBlock}
        </div>
        <div className="flex justify-center">
          <TimelineDot isFinal={milestone.isFinal} />
        </div>
        <div className="flex items-center justify-start">
          {isEven ? mediaBlock : textBlock}
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden grid items-center" style={{ gridTemplateColumns: "1fr 44px 1fr" }}>
        <div className="flex items-center justify-end">
          {isEven ? (
            <div
              className="flex-1 min-w-0 text-right rounded-xl px-3 py-3"
              style={{
                background: "rgba(254,249,243,0.90)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(184,130,42,0.13)",
                boxShadow: "0 3px 14px rgba(61,40,16,0.07)",
              }}
            >
              {milestone.date && (
                <p className="garamond uppercase mb-0.5" style={{ fontSize: "0.54rem", letterSpacing: "0.26em", color: BABY_BLUE }}>
                  {milestone.date}
                </p>
              )}
              <h3 className="gistesy" style={{ fontSize: "clamp(0.88rem, 4vw, 1.15rem)", color: milestone.isFinal ? BABY_BLUE : DEEP, lineHeight: 1.2, overflow: "visible" }}>
                {milestone.title}
              </h3>
              {milestone.details?.map((d) => (
                <p key={d} className="garamond" style={{ fontSize: "0.62rem", color: MEDIUM }}>{d}</p>
              ))}
            </div>
          ) : (
            <div className="flex justify-end pr-1">
              <MediaSlot media={milestone.media} caption={milestone.caption} rotate={rotation} />
            </div>
          )}
        </div>
        <div className="flex justify-center">
          <TimelineDot isFinal={milestone.isFinal} />
        </div>
        <div className="flex items-center justify-start">
          {isEven ? (
            <div className="flex justify-start pl-1">
              <MediaSlot media={milestone.media} caption={milestone.caption} rotate={rotation} />
            </div>
          ) : (
            <div
              className="flex-1 min-w-0 text-left rounded-xl px-3 py-3"
              style={{
                background: "rgba(254,249,243,0.90)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1px solid rgba(184,130,42,0.13)",
                boxShadow: "0 3px 14px rgba(61,40,16,0.07)",
              }}
            >
              {milestone.date && (
                <p className="garamond uppercase mb-0.5" style={{ fontSize: "0.54rem", letterSpacing: "0.26em", color: BABY_BLUE }}>
                  {milestone.date}
                </p>
              )}
              <h3 className="gistesy" style={{ fontSize: "clamp(0.88rem, 4vw, 1.15rem)", color: milestone.isFinal ? BABY_BLUE : DEEP, lineHeight: 1.2, overflow: "visible" }}>
                {milestone.title}
              </h3>
              {milestone.details?.map((d) => (
                <p key={d} className="garamond" style={{ fontSize: "0.62rem", color: MEDIUM }}>{d}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
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
export function WeddingTimeline() {
  return (
    <Section
      id="wedding-timeline"
      className="relative py-16 sm:py-20 md:py-28 overflow-hidden"
      bgColor="none"
    >
      {/* ── Solid base ── */}
      <div className="absolute inset-0 -z-10" style={{ background: IVORY }} />

      {/* Soft tinted gradient layer on top of solid base */}
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

      {/* Corner florals */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <Image src="/decoration/left-top-removebg-preview.png"    alt="" width={200} height={200} aria-hidden className="absolute top-0 left-0  w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
        <Image src="/decoration/right-top-removebg-preview.png"   alt="" width={200} height={200} aria-hidden className="absolute top-0 right-0 w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
        <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={200} height={200} aria-hidden className="absolute bottom-0 left-0  w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
        <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={200} height={200} aria-hidden className="absolute bottom-0 right-0 w-auto h-auto max-w-[110px] sm:max-w-[155px] md:max-w-[200px] opacity-45" />
      </div>

      {/* Subtle center glow accent */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 50% 40% at 50% 28%, rgba(63,163,200,0.10) 0%, transparent 70%),
            radial-gradient(ellipse 38% 32% at 50% 78%, rgba(184,130,42,0.08) 0%, transparent 65%)
          `,
        }} />
      </div>

      {/* ── Section Header ── */}
      <motion.div
        className="relative z-10 text-center mb-14 sm:mb-18 px-4"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="garamond uppercase mb-2"
          style={{ fontSize: "clamp(0.52rem, 2vw, 0.66rem)", letterSpacing: "0.52em", color: BABY_BLUE, paddingRight: "0.52em" }}
        >
          Before the Baptism
        </p>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to left, ${GOLD}88, transparent)` }} />
          <span style={{ color: GOLD, fontSize: "8px", opacity: 0.9 }}>✦</span>
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to right, ${GOLD}88, transparent)` }} />
        </div>
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
          My Little Timeline
        </h2>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-6 sm:w-10" style={{ background: `linear-gradient(to left, ${BLUE_MID}cc, transparent)` }} />
          <span style={{ color: BLUE_MID, fontSize: "4px" }}>◆◆◆</span>
          <div className="h-px w-6 sm:w-10" style={{ background: `linear-gradient(to right, ${BLUE_MID}cc, transparent)` }} />
        </div>
        <p
          className="garamond"
          style={{ fontSize: "clamp(0.78rem, 2.8vw, 0.96rem)", color: MEDIUM, fontStyle: "italic", lineHeight: 1.9, maxWidth: "400px", margin: "0 auto" }}
        >
          Every moment God was writing my story, long before I arrived.
        </p>
      </motion.div>

      {/* ── Timeline ── */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6">

        {/* Vertical center line — glowing */}
        <div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: "2px",
            background: `linear-gradient(to bottom,
              transparent 0%,
              ${BABY_BLUE}99 8%,
              ${BABY_BLUE}cc 30%,
              ${GOLD}66 60%,
              ${BABY_BLUE}88 80%,
              transparent 100%
            )`,
            boxShadow: `0 0 12px rgba(91,181,213,0.25)`,
          }}
        />

        <div className="space-y-10 sm:space-y-14 md:space-y-18">
          {milestones.map((milestone, index) => (
            <MilestoneEntry key={milestone.title} milestone={milestone} index={index} />
          ))}
        </div>

        {/* Final footer */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-3 mt-14 sm:mt-18"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <div
            className="flex flex-col items-center gap-3 rounded-2xl px-8 py-5"
            style={{
              background: "rgba(254,249,243,0.85)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(184,130,42,0.15)",
              boxShadow: "0 4px 20px rgba(61,40,16,0.07)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to left, ${GOLD}80, transparent)` }} />
              <Heart className="w-5 h-5" fill={BABY_BLUE} style={{ color: BABY_BLUE, filter: `drop-shadow(0 0 6px rgba(63,163,200,0.5))` }} />
              <div className="h-px w-14 sm:w-24" style={{ background: `linear-gradient(to right, ${GOLD}80, transparent)` }} />
            </div>
            <p
              className="garamond text-center"
              style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)", color: MEDIUM, fontStyle: "italic", lineHeight: 1.85 }}
            >
              Every step of the journey was a miracle in the making.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
