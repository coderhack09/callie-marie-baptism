"use client"

import { Section } from "@/components/section"
import { motion } from "motion/react"
import Image from "next/image"
import { useRef, useEffect } from "react"
import { Heart, Star } from "lucide-react"

// ── Palette — aligned with loader/Hero.tsx ────────────────────────────────────
const DARK_NAVY   = "#1C3050"
const GOLD        = "#C4965A"
const NAVY_MUTE   = "rgba(65,90,115,0.78)"
const GOLD_BORDER = "rgba(196,152,88,0.28)"

const FROSTED_CARD = {
  background: "rgba(255,255,255,0.30)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  border: "1.5px solid rgba(43,74,107,0.22)",
  boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
} as const

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-2" style={{ maxWidth: "240px", margin: "0 auto" }}>
      <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
      <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)", flexShrink: 0 }} />
      <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
    </div>
  )
}

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
  // {
  //   date: "May 5, 2025",
  //   title: "The Day My Miracle Began",
  //   caption: "IUI Procedure — with Doctor & Nurse",
  //   media: { type: "photo", src: "/desktop_background/image00001.jpeg" },
  // },
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
    media: { type: "video", src: "/desktop_background/copy_9EFACE50-A32C-4CBC-86C7-6749533E1305 (1).mov" },
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
      className="rounded-2xl overflow-hidden border-2 shadow-[0_8px_32px_rgba(43,74,107,0.12)]"
      style={{ borderColor: GOLD_BORDER, background: "#fff" }}
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
        <div
          className="absolute inset-0 pointer-events-none rounded-t-2xl"
          style={{ boxShadow: "inset 0 0 0 1.5px rgba(196,152,88,0.18)" }}
        />
      </div>
      {caption && (
        <div className="px-3 py-2.5" style={{ background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0.85))" }}>
          <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.58rem, 1.8vw, 0.68rem)", color: NAVY_MUTE, textAlign: "center" }}>
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
            border: `1.5px solid ${GOLD_BORDER}`,
            boxShadow: "0 8px 32px rgba(43,74,107,0.12), 0 2px 8px rgba(43,74,107,0.06)",
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
              <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(120,175,215,0.08)" }}>
                <Star className="w-8 h-8 opacity-30" style={{ color: GOLD }} />
              </div>
            )}
            <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 18px rgba(0,0,0,0.08)" }} />
          </div>
          {caption && (
            <p
              style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.58rem, 1.8vw, 0.68rem)",
                color: NAVY_MUTE,
                lineHeight: 1.4,
                textAlign: "center",
                marginTop: "0.5rem",
              }}
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
          style={{ borderColor: GOLD_BORDER }}
        >
          <div
            className="relative aspect-[3/4] flex flex-col items-center justify-center gap-3"
            style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.95) 0%, rgba(120,175,215,0.10) 100%)" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(196,152,88,0.10)", border: `2px solid ${GOLD_BORDER}` }}
            >
              <svg className="w-5 h-5 ml-0.5" fill={GOLD} viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.6rem, 2vw, 0.7rem)", color: NAVY_MUTE, textAlign: "center", paddingInline: "1rem" }}>
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
        <div className="absolute w-12 h-12 rounded-full animate-ping opacity-10" style={{ background: GOLD }} />
        <div className="absolute w-10 h-10 rounded-full opacity-20 animate-pulse" style={{ background: GOLD }} />
        <div
          className="w-7 h-7 rounded-full border-2 flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #D4A860, #C4965A, #A87840)",
            borderColor: "#fff",
            boxShadow: "0 0 12px rgba(196,152,88,0.45)",
          }}
        >
          <Heart className="w-3.5 h-3.5" fill="#fff" style={{ color: "#fff" }} />
        </div>
      </div>
    )
  }
  return (
    <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0">
      <div
        className="w-4 h-4 rounded-full border-2"
        style={{
          background: "linear-gradient(135deg, #D4A860, #C4965A)",
          borderColor: "#fff",
          boxShadow: `0 0 0 3px rgba(196,152,88,0.35), 0 0 12px rgba(196,152,88,0.28)`,
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
      style={FROSTED_CARD}
    >
      {milestone.date && (
        <p
          style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.50rem, 1.7vw, 0.60rem)",
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "rgba(72,112,148,0.80)",
            marginBottom: "0.375rem",
            paddingRight: isEven ? "0.36em" : 0,
            paddingLeft: isEven ? 0 : "0.36em",
          }}
        >
          {milestone.date}
        </p>
      )}
      <h3
        style={{
          fontFamily: milestone.isFinal ? '"LeJourScript", cursive' : '"Cinzel", serif',
          fontWeight: milestone.isFinal ? 400 : 700,
          fontSize: milestone.isFinal ? "clamp(1.2rem, 4vw, 1.75rem)" : "clamp(1rem, 3.2vw, 1.5rem)",
          color: milestone.isFinal ? GOLD : DARK_NAVY,
          lineHeight: 1.15,
          filter: milestone.isFinal ? "drop-shadow(0 2px 8px rgba(196,152,88,0.16))" : "none",
        }}
      >
        {milestone.title}
      </h3>
      {milestone.details && (
        <div className={`flex flex-col mt-1.5 gap-0.5 ${isEven ? "items-end" : "items-start"}`}>
          {milestone.details.map((d) => (
            <span
              key={d}
              style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.68rem, 2.2vw, 0.8rem)", color: NAVY_MUTE }}
            >
              {d}
            </span>
          ))}
        </div>
      )}
      <div className={`flex items-center gap-2 mt-3 ${isEven ? "justify-end" : "justify-start"}`}>
        <div className="h-px w-10" style={{ background: `linear-gradient(to ${isEven ? "left" : "right"}, rgba(196,152,88,0.45), transparent)` }} />
        <div style={{ width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)", flexShrink: 0 }} />
        <div className="h-px w-10" style={{ background: `linear-gradient(to ${isEven ? "right" : "left"}, rgba(196,152,88,0.45), transparent)` }} />
      </div>
    </div>
  )

  const mediaBlock = (
    <div className={`flex ${isEven ? "justify-start pl-3 sm:pl-5" : "justify-end pr-3 sm:pr-5"} flex-1 min-w-0`}>
      <MediaSlot media={milestone.media} caption={milestone.caption} rotate={rotation} />
    </div>
  )

  const mobileTextCard = (align: "left" | "right") => (
    <div
      className={`flex-1 min-w-0 rounded-xl px-3 py-3 ${align === "right" ? "text-right" : "text-left"}`}
      style={FROSTED_CARD}
    >
      {milestone.date && (
        <p style={{
          fontFamily: '"Cinzel", serif',
          fontSize: "0.54rem",
          letterSpacing: "0.30em",
          textTransform: "uppercase",
          color: "rgba(72,112,148,0.80)",
          marginBottom: "0.25rem",
        }}>
          {milestone.date}
        </p>
      )}
      <h3 style={{
        fontFamily: milestone.isFinal ? '"LeJourScript", cursive' : '"Cinzel", serif',
        fontWeight: milestone.isFinal ? 400 : 700,
        fontSize: "clamp(0.88rem, 4vw, 1.15rem)",
        color: milestone.isFinal ? GOLD : DARK_NAVY,
        lineHeight: 1.2,
      }}>
        {milestone.title}
      </h3>
      {milestone.details?.map((d) => (
        <p key={d} style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "0.62rem", color: NAVY_MUTE }}>{d}</p>
      ))}
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
          {isEven ? mobileTextCard("right") : (
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
          ) : mobileTextCard("left")}
        </div>
      </div>
    </motion.div>
  )
}

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 380, h: 380, top: "5%",  left: "2%",  color: "rgba(120,175,215,1)", opacity: 0.08, blur: 100 },
    { w: 260, h: 260, top: "20%", left: "70%", color: "rgba(196,152,88,1)",  opacity: 0.08, blur: 80  },
    { w: 300, h: 300, top: "52%", left: "10%", color: "rgba(196,152,88,1)",  opacity: 0.07, blur: 90  },
    { w: 220, h: 220, top: "68%", left: "74%", color: "rgba(120,175,215,1)", opacity: 0.08, blur: 70  },
    { w: 180, h: 180, top: "38%", left: "44%", color: "rgba(196,152,88,1)",  opacity: 0.06, blur: 60  },
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
      <div className="absolute inset-0 -z-10" style={{ background: "#FFFFFF" }} />

      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 45% at 50% 30%, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.6) 45%, transparent 75%)",
      }} />

      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "linear-gradient(to top, rgba(120,175,215,0.10) 0%, rgba(120,175,215,0.04) 25%, transparent 55%)",
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
            radial-gradient(ellipse 50% 40% at 50% 28%, rgba(196,152,88,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 38% 32% at 50% 78%, rgba(120,175,215,0.08) 0%, transparent 65%)
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
        {/* <p style={{
          fontFamily: '"Cinzel", serif',
          fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
          letterSpacing: "0.40em",
          textTransform: "uppercase",
          color: "rgba(72,112,148,0.80)",
          marginBottom: "0.4rem",
          paddingRight: "0.40em",
        }}>
          Before the Baptism
        </p> */}
        {/* <OrnamentDivider /> */}
        <h2 style={{
          fontFamily: '"Cinzel", serif',
          fontWeight: 600,
          fontSize: "clamp(2.2rem, 10vw, 4.8rem)",
          color: GOLD,
          lineHeight: 1.1,
          marginTop: "0.75rem",
          marginBottom: "0.75rem",
          filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
        }}>
          My Little Timeline
        </h2>
        <OrnamentDivider />
        <p style={{
          fontFamily: '"Fahkwang", sans-serif',
          fontSize: "clamp(0.80rem, 2.6vw, 0.96rem)",
          color: NAVY_MUTE,
          fontStyle: "italic",
          lineHeight: 1.9,
          maxWidth: "400px",
          margin: "0.75rem auto 0",
        }}>
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
              rgba(196,152,88,0.35) 8%,
              rgba(196,152,88,0.55) 30%,
              rgba(43,74,107,0.25) 60%,
              rgba(196,152,88,0.45) 80%,
              transparent 100%
            )`,
            boxShadow: "0 0 12px rgba(196,152,88,0.18)",
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
            style={FROSTED_CARD}
          >
            <div className="flex items-center gap-3">
              <div className="h-px w-14 sm:w-24" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
              <Heart className="w-5 h-5" fill={GOLD} style={{ color: GOLD, filter: "drop-shadow(0 0 6px rgba(196,152,88,0.35))" }} />
              <div className="h-px w-14 sm:w-24" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
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
              Every step of the journey was a miracle in the making.
            </p>
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
