"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"

// ── Color palette — matching LoadingScreen motif ─────────────────────────────
const DEEP      = "#8B6F5A"
const MEDIUM    = "#BFA07A"
const ACCENT    = "#CFA06B"
const CREAM     = "#F5E6D3"
const BABY_BLUE = "#89CFF0"

// ── Baptism details — matching LoadingScreen constants ───────────────────────
const BABY_NAME_FIRST = "Kaezar"
const BABY_NAME_LAST  = "Isaiahnuel Galardo"
const EVENT_LABEL     = "Christening Celebration"
const TAGLINE         = "A Little Piece of Heaven"
const EVENT_DATE      = "July 4 , 2026  |  10:00 AM"
const EVENT_VENUE     = "Cathedral of Our Lady of Arabia, Awali, Kingdom of Bahrain"

// ── 3 polaroid cards with individual rotation ────────────────────────────────
// const heroPhotos = [
//   { src: "/mobile_display/baby (4).jpg",  alt: "Baby Niahna",           rotate: -13, shiftY: 14 },
//   { src: "/mobile_display/baby (11).jpg", alt: "Baby Niahna Celestine", rotate:   2, shiftY:  0 },
//   { src: "/mobile_display/baby (17).jpg", alt: "Baby Celestine",        rotate:  11, shiftY: 10 },
// ]

export function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(155deg, ${CREAM} 0%, #FAF0E4 40%, ${CREAM} 70%, #FDF6ED 100%)`,
      }}
    >
      {/* Soft warm radial wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 52%, rgba(207,160,107,0.08) 0%, transparent 75%)`,
        }}
      />

      {/* Edge vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 85% 80% at 50% 50%, transparent 40%, rgba(191,160,122,0.12) 100%)`,
        }}
      />

      {/* ── Corner floral decorations ── */}
      <Image
        src="/decoration/left-top-removebg-preview.png"
        alt=""
        width={280}
        height={280}
        className="absolute top-0 left-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60"
        aria-hidden
        priority
      />
      <Image
        src="/decoration/right-top-removebg-preview.png"
        alt=""
        width={280}
        height={280}
        className="absolute top-0 right-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60"
        aria-hidden
        priority
      />
      <Image
        src="/decoration/bottom-left-removebg-preview.png"
        alt=""
        width={280}
        height={280}
        className="absolute bottom-0 left-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60"
        aria-hidden
      />
      <Image
        src="/decoration/bottom-right-removebg-preview.png"
        alt=""
        width={280}
        height={280}
        className="absolute bottom-0 right-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60"
        aria-hidden
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-20 sm:py-24">

        {/* Monogram — very top */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            marginBottom: "clamp(0.8rem, 2.5vw, 1.4rem)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: `radial-gradient(ellipse 80% 80% at 50% 50%, rgba(207,160,107,0.13) 0%, transparent 75%)`,
            borderRadius: "50%",
            padding: "clamp(8px, 2vw, 14px)",
          }}
        >
          {/* Hidden Image for Next.js preload & priority hint */}
          <Image
            src="/monogram/monogram.png"
            alt="Monogram"
            width={80}
            height={80}
            priority
            className="sr-only"
          />
          {/* Gradient-tinted monogram via CSS mask */}
          <div
            role="img"
            aria-label="Monogram"
            style={{
              width: "clamp(52px, 12vw, 80px)",
              height: "clamp(52px, 12vw, 80px)",
              background: "linear-gradient(135deg, #B8E4F9 0%, #89CFF0 35%, #4FC3F7 65%, #0ea5e9 100%)",
              WebkitMaskImage: "url(/monogram/monogram.png)",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskImage: "url(/monogram/monogram.png)",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
            }}
          />
        </motion.div>

        {/* "JOIN US FOR" label */}
        <motion.p
          className="garamond"
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            fontSize: "clamp(0.6rem, 3vw, 0.82rem)",
            letterSpacing: "0.48em",
            textTransform: "uppercase",
            color: MEDIUM,
            marginBottom: "0.45rem",
          }}
        >
          Join us for
        </motion.p>

        {/* "Christening Celebration" — Gistesy script */}
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.1, ease: "easeOut" }}
          style={{ marginBottom: "0.45rem" }}
        >
          <span
            className="gistesy"
            style={{
              fontSize: "clamp(2.2rem, 10vw, 5rem)",
              color: BABY_BLUE,
              lineHeight: 1.15,
              display: "block",
              letterSpacing: "-0.01em",
              textShadow: `0 2px 28px rgba(137,207,240,0.35)`,
            }}
          >
            {EVENT_LABEL}
          </span>
        </motion.h2>

        {/* Thin divider */}
        <motion.div
          className="flex items-center gap-3 justify-center mb-7 sm:mb-9 w-full max-w-[260px]"
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.4), transparent)` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `rgba(207,160,107,0.5)` }} />
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.4), transparent)` }} /> */}
        </motion.div>

        {/* ── Name composition ── */}
        <motion.div
          className="relative flex flex-col items-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.95, delay: 0.32, ease: "easeOut" }}
        >
          {/* Top ornament rule */}
          <div
            className="flex items-center gap-3 justify-center mb-5"
            style={{ width: "clamp(200px, 60vw, 320px)" }}
          >
            {/* <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.45), transparent)` }} />
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: `rgba(207,160,107,0.55)`, flexShrink: 0 }} />
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.45), transparent)` }} /> */}
          </div>

          {/* First name */}
          <div
            className="lora-regular"
            style={{
              fontSize: "clamp(3.8rem, 17vw, 7.5rem)",
              color: DEEP,
              lineHeight: 1,
              letterSpacing: "0.04em",
              textAlign: "center",
              textShadow: `0 3px 32px rgba(139,111,90,0.22)`,
            }}
          >
            {BABY_NAME_FIRST}
          </div>

          {/* Thin spacer with inline flourish */}
          <div
            className="flex items-center gap-2 justify-center"
            style={{ margin: "clamp(0.3rem, 1.5vw, 0.65rem) 0", width: "clamp(140px, 40vw, 220px)" }}
          >
            {/* <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(139,111,90,0.20), transparent)` }} />
            <span style={{ color: ACCENT, fontSize: "0.45rem", letterSpacing: "0.3em" }}>◆</span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(139,111,90,0.20), transparent)` }} /> */}
          </div>

          {/* Last name */}
          <div
            className="lora-regular"
            style={{
              fontSize: "clamp(1.3rem, 6vw, 2.6rem)",
              color: DEEP,
              lineHeight: 1.2,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textAlign: "center",
              textShadow: `0 2px 20px rgba(139,111,90,0.16)`,
            }}
          >
            {BABY_NAME_LAST}
          </div>

          {/* Bottom ornament rule */}
          <div
            className="flex items-center gap-3 justify-center mt-5"
            style={{ width: "clamp(200px, 60vw, 320px)" }}
          >
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.45), transparent)` }} />
            <div style={{ width: 4, height: 4, borderRadius: "50%", background: `rgba(207,160,107,0.55)`, flexShrink: 0 }} />
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.45), transparent)` }} />
          </div>

        </motion.div>{/* end name composition */}

        {/* Tagline */}
        <motion.p
          className="garamond"
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.72, ease: "easeOut" }}
          style={{
            marginTop: "clamp(1rem, 3vw, 1.6rem)",
            fontSize: "clamp(0.82rem, 3.2vw, 1.15rem)",
            color: DEEP,
            letterSpacing: "0.04em",
            fontStyle: "italic",
            marginBottom: "0.55rem",
          }}
        >
          {TAGLINE}
        </motion.p>

        {/* Date */}
        <motion.p
          className="garamond"
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
          style={{
            fontSize: "clamp(0.92rem, 3.8vw, 1.25rem)",
            letterSpacing: "0.07em",
            fontWeight: 700,
            color: DEEP,
            marginBottom: "0.35rem",
          }}
        >
          {EVENT_DATE}
        </motion.p>

        {/* Venue */}
        <motion.p
          className="garamond"
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.86, ease: "easeOut" }}
          style={{
            fontSize: "clamp(0.6rem, 2.4vw, 0.8rem)",
            letterSpacing: "0.02em",
            color: MEDIUM,
            textAlign: "center",
            maxWidth: "280px",
          }}
        >
          {EVENT_VENUE}
        </motion.p>

        {/* ── CTA — "Join Us" ── */}
        <motion.div
          className="flex flex-col items-center"
          style={{ marginTop: "clamp(1.8rem, 5.5vw, 3rem)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 0.96, ease: "easeOut" }}
        >
          {/* Decorative rule above CTA */}
          <div
            className="flex items-center gap-2 justify-center mb-3"
            style={{ width: "clamp(120px, 30vw, 180px)" }}
          >
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.5), transparent)` }} />
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: `rgba(207,160,107,0.6)`,
                flexShrink: 0,
              }}
            />
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.5), transparent)` }} />
          </div>

          {/* "JOIN US" text */}
          <a
            href="#details"
            style={{
              fontFamily: '"Garamond", serif',
              color: ACCENT,
              fontSize: "clamp(0.65rem, 2.5vw, 0.84rem)",
              letterSpacing: "0.58em",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "block",
              lineHeight: 1,
              paddingRight: "0.58em", /* compensate trailing letter-spacing */
            }}
          >
            Join Us
          </a>

          {/* Animated chevron */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginTop: "0.6rem" }}
            aria-hidden
          >
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 1L8 8.5L15 1"
                stroke={ACCENT}
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.65"
              />
            </svg>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
