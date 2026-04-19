"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"

// ── Color palette — matching LoadingScreen motif ─────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"
const CREAM  = "#F5E6D3"

// ── Baptism details — matching LoadingScreen constants ───────────────────────
const BABY_NAME_FIRST = "Niahna"
const BABY_NAME_LAST  = "Celestine"
const EVENT_LABEL     = "Christening Celebration"
const TAGLINE         = "A Little Piece of Heaven"
const EVENT_DATE      = "May 31 , 2026  |  9:00 AM"
const EVENT_VENUE     = "Our Lady of Miraculous Medal Parish"

// ── 3 polaroid cards with individual rotation ────────────────────────────────
const heroPhotos = [
  { src: "/mobile_display/baby (4).jpg",  alt: "Baby Niahna",           rotate: -13, shiftY: 14 },
  { src: "/mobile_display/baby (11).jpg", alt: "Baby Niahna Celestine", rotate:   2, shiftY:  0 },
  { src: "/mobile_display/baby (17).jpg", alt: "Baby Celestine",        rotate:  11, shiftY: 10 },
]

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
        src="/decoration/top-left.png"
        alt=""
        width={280}
        height={280}
        className="absolute top-0 left-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60"
        aria-hidden
        priority
      />
      <Image
        src="/decoration/top-right.png"
        alt=""
        width={280}
        height={280}
        className="absolute top-0 right-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60"
        aria-hidden
        priority
      />
      <Image
        src="/decoration/bottom-left.png"
        alt=""
        width={280}
        height={280}
        className="absolute bottom-0 left-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60"
        aria-hidden
      />
      <Image
        src="/decoration/right-bottom.png"
        alt=""
        width={280}
        height={280}
        className="absolute bottom-0 right-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60"
        aria-hidden
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-20 sm:py-24">

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
              color: ACCENT,
              lineHeight: 1.15,
              display: "block",
              letterSpacing: "-0.01em",
              textShadow: `0 2px 28px rgba(207,160,107,0.30)`,
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
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.4), transparent)` }} />
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: `rgba(207,160,107,0.5)` }} />
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.4), transparent)` }} />
        </motion.div>

        {/* ── Cards + Name: single layered composition ── */}
        {/*
          The name block uses a negative marginTop to pull itself up over the
          bottom edge of the polaroids (z-index superior effect). A soft cream
          radial halo sits behind the name so it reads cleanly against the cards.
        */}
        <div className="relative w-full flex flex-col items-center">

          {/* 3 Polaroid Cards */}
          <motion.div
            className="flex items-end justify-center"
            style={{ gap: "clamp(8px, 2.5vw, 20px)", position: "relative", zIndex: 5 }}
            initial={{ opacity: 0, y: 28 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          >
            {heroPhotos.map((photo, i) => {
              const isCenter = i === 1
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, zIndex: 30 }}
                  transition={{ type: "spring", stiffness: 280, damping: 20 }}
                  style={{
                    background: "#fff",
                    padding: "clamp(5px, 1.5vw, 9px)",
                    paddingBottom: "clamp(28px, 7vw, 44px)",
                    boxShadow: isCenter
                      ? "0 16px 48px rgba(139,111,90,0.28), 0 4px 14px rgba(139,111,90,0.14)"
                      : "0 8px 28px rgba(139,111,90,0.20)",
                    transform: `rotate(${photo.rotate}deg) translateY(${photo.shiftY}px)`,
                    borderRadius: "3px",
                    zIndex: isCenter ? 10 : 5,
                    position: "relative",
                    width: isCenter
                      ? "clamp(118px, 28vw, 182px)"
                      : "clamp(100px, 24vw, 152px)",
                    flexShrink: 0,
                    cursor: "default",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: "128%",
                      overflow: "hidden",
                      borderRadius: "1px",
                      background: CREAM,
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 28vw, (max-width: 1024px) 24vw, 182px"
                      className="object-cover object-top"
                      priority={isCenter}
                    />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Baby Name — floats above bottom edge of cards */}
          <motion.div
            className="relative flex flex-col items-center w-full"
            initial={{ opacity: 0, y: 16 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.52, ease: "easeOut" }}
            style={{
              marginTop: "clamp(-2rem, -5.5vw, -3.2rem)",
              zIndex: 20,
            }}
          >
            {/* Cream halo — lets name read over the card edges */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "0",
                left: "50%",
                transform: "translateX(-50%)",
                width: "clamp(260px, 80vw, 480px)",
                height: "clamp(90px, 22vw, 160px)",
                pointerEvents: "none",
                zIndex: -1,
              }}
            />

            {/* FIRST name — shifted left */}
            <span
              className="amsterdam-one mt-10 sm:mt-0"
              style={{
                fontSize: "clamp(4rem, 19vw, 8.8rem)",
                color: DEEP,
                lineHeight: 0.9,
                display: "block",
                letterSpacing: "-0.01em",
                textShadow: `0 4px 36px rgba(139,111,90,0.20)`,
                transform: "translateX(-11%)",
                alignSelf: "center",
              }}
            >
              {BABY_NAME_FIRST}
            </span>

            {/* LAST name — shifted right */}
            <span
              className="amsterdam-one mt-5 ml-8 sm:mt-0 sm:ml-0"
              style={{
                fontSize: "clamp(2.2rem, 10.5vw, 4.8rem)",
                color: DEEP,
                lineHeight: 1.05,
                display: "block",
                letterSpacing: "0.01em",
                textShadow: `0 2px 24px rgba(139,111,90,0.15)`,
                transform: "translateX(13%)",
                alignSelf: "center",
              }}
            >
              {BABY_NAME_LAST}
            </span>
          </motion.div>

        </div>{/* end layered composition */}

        {/* Thin ornamental rule below name */}
        <motion.div
          className="flex items-center gap-3 justify-center w-full max-w-[260px]"
          style={{ marginTop: "clamp(1rem, 3vw, 1.5rem)", marginBottom: "clamp(0.4rem, 1.5vw, 0.75rem)" }}
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.66 }}
        >
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(139,111,90,0.22), transparent)` }} />
          <span style={{ color: "#D4B896", fontSize: "5px", letterSpacing: "0.2em" }}>◆</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(139,111,90,0.22), transparent)` }} />
        </motion.div>

        {/* Tagline */}
        <motion.p
          className="garamond"
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.72, ease: "easeOut" }}
          style={{
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
