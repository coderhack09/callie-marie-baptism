"use client"

import React, { useEffect, useState, useRef } from "react"
import Image from "next/image"

interface LoadingScreenProps {
  onComplete: () => void
}

// ── Color palette — warm taupe/khaki (from globals.css motif) ───────────────
const DEEP   = "#8B6F5A"   // taupe  — headings
const MEDIUM = "#BFA07A"   // khaki  — body text
const ACCENT = "#CFA06B"   // camel  — accents/highlights
const CREAM  = "#F5E6D3"   // beige  — main background
const SILVER = "#EDE3D6"   // sand   — borders/dividers

// Baptism details — hardcoded for this event
const BABY_NAME_FIRST = "Niahna"
const BABY_NAME_LAST  = "Celestine"
const EVENT_LABEL     = "Christening Celebration"
const TAGLINE         = "A Little Piece of Heaven"
const EVENT_DATE      = "May 31 , 2026  |  9:00 AM"
const EVENT_VENUE     = "Our Lady of Miraculous Medal Parish"

const images = [
  {
    src: "/mobile_display/baby (9).jpg",
    alt: "Baby photo 1",
  },
  {
    src: "/mobile_display/baby (14).jpg",
    alt: "Baby photo 2",
  },
]

// Ghost watermark date segments (MM DD YY)
const GHOST_NUMBERS = ["05", "28", "24"]

// ── Canvas particle system ──────────────────────────────────────────────────

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
  twinklePhase: number
  twinkleSpeed: number
  colorIdx: number
}

/** Warm taupe tones matching the motif palette */
const PARTICLE_COLORS = [
  "139, 111,  90",   // deep taupe   #8B6F5A
  "191, 160, 122",   // khaki        #BFA07A
  "207, 160, 107",   // camel        #CFA06B
  "232, 210, 181",   // tan/soft     #E8D2B5
]

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(45, Math.max(20, Math.floor((width * height) / 15000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: -(Math.random() * 0.18 + 0.06),
    radius: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.35 + 0.20,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.012 + 0.004,
    colorIdx: Math.floor(Math.random() * PARTICLE_COLORS.length),
  }))
}

// ── Component ───────────────────────────────────────────────────────────────

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut]   = useState(false)
  const [progress, setProgress] = useState(0)
  // phase gates: 0=hidden · 1=header+event · 2=name · 3=tagline · 4=date/venue · 5=progress
  const [phase, setPhase]       = useState(0)

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  const TOTAL_LOAD_MS = 12000
  const FADE_MS       = 700

  // ── Canvas particle animation ────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = createParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let running = true

    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((p) => {
        p.twinklePhase += p.twinkleSpeed
        const twinkle = (Math.sin(p.twinklePhase) + 1) * 0.5
        const alpha   = p.opacity * (0.3 + twinkle * 0.7)
        const color   = PARTICLE_COLORS[p.colorIdx]
        const blurR   = p.radius * 3.5

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
        g.addColorStop(0,   `rgba(${color}, ${alpha})`)
        g.addColorStop(0.4, `rgba(${color}, ${alpha * 0.45})`)
        g.addColorStop(1,   `rgba(${color}, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        const { width, height } = canvas
        if (p.y < -20)        { p.y = height + 10; p.x = Math.random() * width }
        if (p.x < -20)          p.x = width + 20
        if (p.x > width + 20)   p.x = -20
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [])

  // ── Staggered content reveal ─────────────────────────────────────────────
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 150),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 820),
      setTimeout(() => setPhase(4), 1100),
      setTimeout(() => setPhase(5), 1380),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  // ── Progress counter ─────────────────────────────────────────────────────
  useEffect(() => {
    let rafId = 0
    const start        = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const tick = (now: number) => {
      const t    = Math.min(1, (now - start) / TOTAL_LOAD_MS)
      const next = Math.round(easeOutCubic(t) * 100)
      setProgress((prev) => (next > prev ? next : prev))
      if (t < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const fadeTimer = setTimeout(() => setFadeOut(true), TOTAL_LOAD_MS - FADE_MS)
    const doneTimer = setTimeout(() => { setProgress(100); onComplete() }, TOTAL_LOAD_MS)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(fadeTimer)
      clearTimeout(doneTimer)
    }
  }, [onComplete])

  const vis = (minPhase: number) =>
    phase >= minPhase
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-4 transition-all duration-700 ease-out"

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading invitation"
    >
      {/* ── Layer 1: Warm cream base ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(155deg, ${CREAM} 0%, #FAF0E4 40%, ${CREAM} 70%, #FDF6ED 100%)`,
        }}
      />

      {/* ── Layer 2: Soft warm radial wash ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 52%, rgba(207,160,107,0.08) 0%, transparent 75%)`,
        }}
      />

      {/* ── Layer 3: Canvas particle field ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "multiply" }}
        aria-hidden
      />

      {/* ── Layer 4: Warm edge vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 85% 80% at 50% 50%, transparent 40%, rgba(191,160,122,0.15) 100%)`,
        }}
      />

      {/* ── Layer 5: Corner floral decorations ── */}
      <Image
        src="/decoration/top-left.png"
        alt=""
        width={280}
        height={280}
        className="absolute top-0 left-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
        priority
      />
      <Image
        src="/decoration/top-right.png"
        alt=""
        width={280}
        height={280}
        className="absolute top-0 right-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
        priority
      />
      <Image
        src="/decoration/bottom-left.png"
        alt=""
        width={280}
        height={280}
        className="absolute bottom-0 left-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
      />
      <Image
        src="/decoration/right-bottom.png"
        alt=""
        width={280}
        height={280}
        className="absolute bottom-0 right-0 pointer-events-none select-none w-36 sm:w-48 md:w-60 lg:w-64"
        aria-hidden
      />

      {/* ── Layer 6: Ghost date watermark (right side) ── */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col items-end justify-center pr-4 sm:pr-8 md:pr-12 lg:pr-16 select-none"
        aria-hidden
      >
        {GHOST_NUMBERS.map((num, i) => (
          <span
            key={`ghost-${num}-${i}`}
            className="lora-bold leading-[0.82]"
            style={{
              fontSize: "clamp(5rem, 14vw, 12rem)",
              color: `rgba(139, 111, 90, 0.055)`,
              letterSpacing: "-0.04em",
              opacity: phase >= 2 ? 1 : 0,
              transition: `opacity 1.6s ease-out ${i * 150}ms`,
            }}
          >
            {num}
          </span>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="relative z-10 w-full max-w-sm mx-auto px-3 sm:px-6 md:px-8 text-center">

        {/* "JOIN US FOR" header */}
        <p
          className={`garamond ${vis(1)}`}
          style={{
            fontSize: "clamp(0.62rem, 3.2vw, 0.75rem)",
            letterSpacing: "0.48em",
            textTransform: "uppercase",
            color: MEDIUM,
            marginBottom: "0.4rem",
          }}
        >
          Join us for
        </p>

        {/* "Christening Celebration" script title */}
        <h2
          className={`${vis(1)}`}
          style={{ transitionDelay: "80ms", marginBottom: "0.5rem" }}
        >
          <span
            className="gistesy"
            style={{
              fontSize: "clamp(2.2rem, 9.5vw, 4.5rem)",
              color: ACCENT,
              lineHeight: 1.15,
              display: "block",
              letterSpacing: "-0.01em",
              textShadow: `0 2px 24px rgba(207,160,107,0.28)`,
            }}
          >
            {EVENT_LABEL}
          </span>
        </h2>

        {/* Thin divider line */}
        <div
          className={`flex items-center gap-3 justify-center mb-4 sm:mb-6 ${vis(1)}`}
          style={{ transitionDelay: "140ms" }}
        >
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.35), transparent)` }} />
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: `rgba(207,160,107,0.45)` }} />
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.35), transparent)` }} />
        </div>

        {/* ── Name + Photos layered block ── */}
        {/* mx-auto + maxWidth centres the whole composition so photos + name sit together */}
        <div className="relative mx-auto" style={{ maxWidth: "clamp(260px, 82vw, 320px)", minHeight: "clamp(210px, 60vw, 280px)", marginBottom: "0" }}>

          {/* Polaroid photos — absolute right, BEHIND the name */}
          <div
            className={vis(2)}
            aria-hidden
            style={{
              position: "absolute",
              top: "10px",
              right: "-12px",
              width: "clamp(120px, 42vw, 155px)",
              height: "clamp(190px, 62vw, 245px)",
              zIndex: 1,
            }}
          >
            {/* Back photo — tilted left */}
            <div
              style={{
                position: "absolute",
                top: "0px",
                right: "clamp(36px, 13vw, 52px)",
                width: "clamp(88px, 29vw, 115px)",
                height: "clamp(100px, 33vw, 132px)",
                background: "#fff",
                boxShadow: "0 6px 24px rgba(139,111,90,0.16)",
                transform: "rotate(-10deg)",
                padding: "6px",
                paddingBottom: "22px",
                borderRadius: "2px",
                zIndex: 1,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "1px", overflow: "hidden" }}>
                <Image
                  src={images[0].src}
                  alt={images[0].alt}
                  fill
                  sizes="115px"
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>

            {/* Front photo — tilted right */}
            <div
              style={{
                position: "absolute",
                top: "clamp(75px, 25vw, 105px)",
                right: "0px",
                width: "clamp(88px, 29vw, 115px)",
                height: "clamp(100px, 33vw, 132px)",
                background: "#fff",
                boxShadow: "0 8px 28px rgba(139,111,90,0.20)",
                transform: "rotate(7deg)",
                padding: "6px",
                paddingBottom: "22px",
                borderRadius: "2px",
                zIndex: 2,
                overflow: "hidden",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: "1px", overflow: "hidden" }}>
                <Image
                  src={images[1].src}
                  alt={images[1].alt}
                  fill
                  sizes="115px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>

          {/* Baby name — centred, IN FRONT of the images */}
          <h1
            className={`flex justify-center ${vis(2)}`}
            style={{ transitionDelay: "60ms", position: "relative", zIndex: 5, paddingTop: "clamp(3rem, 10vw, 4rem)" }}
          >
            <div className="inline-block text-left" style={{ paddingLeft: "0.25rem", marginLeft: "-0.35rem" }}>
              {/* N  +  iahna */}
              <div className="amsterdam-one flex items-baseline" style={{ gap: "0.1rem" }}>
                <span
                  style={{
                    fontSize: "clamp(4.8rem, 21vw, 8.5rem)",
                    color: DEEP,
                    lineHeight: 1,
                    textShadow: `0 3px 28px rgba(139,111,90,0.18)`,
                    display: "block",
                    marginTop: "clamp(0.3rem, 1.5vw, 0.6rem)",
                  }}
                >
                  {BABY_NAME_FIRST.charAt(0)}
                </span>
                <span
                  style={{
                    fontSize: "clamp(2.4rem, 10.5vw, 4.2rem)",
                    color: DEEP,
                    lineHeight: 1,
                    textShadow: `0 2px 20px rgba(139,111,90,0.14)`,
                  }}
                >
                  {BABY_NAME_FIRST.slice(1)}
                </span>
              </div>

              {/* Celestine */}
              <span
                className="amsterdam-one block"
                style={{
                  fontSize: "clamp(1.8rem, 8vw, 3.2rem)",
                  color: DEEP,
                  lineHeight: 1.1,
                  textShadow: `0 2px 20px rgba(139,111,90,0.14)`,
                  paddingLeft: "clamp(4.4rem, 18vw, 8rem)",
                  marginTop: "clamp(0.9rem, 4vw, 1.4rem)",
                }}
              >
                {BABY_NAME_LAST}
              </span>
            </div>
          </h1>
        </div>

        {/* Thin rule below name */}
        <div className={`flex items-center gap-3 justify-center mt-2 sm:mt-3 mb-2 sm:mb-3 ${vis(3)}`}>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(139,111,90,0.20), transparent)` }} />
          <span style={{ color: SILVER, fontSize: "5px", letterSpacing: "0.2em" }}>◆</span>
          <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(139,111,90,0.20), transparent)` }} />
        </div>

        {/* Tagline */}
        <p
          className={`garamond ${vis(3)}`}
          style={{
            fontSize: "clamp(0.82rem, 3vw, 1.1rem)",
            color: DEEP,
            letterSpacing: "0.03em",
            marginBottom: "0.5rem",
          }}
        >
          {TAGLINE}
        </p>

        {/* Date — bold and prominent */}
        <p
          className={`garamond ${vis(4)}`}
          style={{
            transitionDelay: "40ms",
            fontSize: "clamp(0.95rem, 3.8vw, 1.25rem)",
            letterSpacing: "0.05em",
            fontWeight: 700,
            color: DEEP,
            marginBottom: "0.3rem",
          }}
        >
          {EVENT_DATE}
        </p>

        {/* Venue */}
        <p
          className={`garamond ${vis(4)}`}
          style={{
            transitionDelay: "80ms",
            fontSize: "clamp(0.6rem, 2.2vw, 0.76rem)",
            letterSpacing: "0.02em",
            color: MEDIUM,
            marginBottom: "clamp(1rem, 4vw, 1.8rem)",
          }}
        >
          {EVENT_VENUE}
        </p>

        {/* Progress section */}
        <div className={`${vis(5)}`}>
          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.82rem, 3vw, 1.1rem)",
              letterSpacing: "0.07em",
              color: `rgba(191,160,122,0.85)`,
              marginBottom: "10px",
            }}
          >
            Loading Invitation
          </p>

          {/* Hairline progress bar */}
          <div className="w-full max-w-[180px] mx-auto relative" style={{ height: "1px" }} role="presentation">
            <div className="absolute inset-0 rounded-full" style={{ backgroundColor: `rgba(191,160,122,0.22)` }} />
            <div
              className="absolute inset-y-0 left-0 rounded-full overflow-hidden"
              style={{
                width: `${Math.max(progress, 2)}%`,
                transition: "width 200ms linear",
                background: `linear-gradient(to right, rgba(139,111,90,0.65), rgba(207,160,107,0.90))`,
              }}
            >
              <div
                className="absolute inset-y-0 animate-loader-shimmer"
                style={{ width: "50px", background: `linear-gradient(90deg, transparent 0%, rgba(232,210,181,0.55) 50%, transparent 100%)` }}
              />
            </div>
          </div>

          {/* Percentage counter */}
          <p
            className="garamond tabular-nums mt-2"
            style={{
              fontSize: "clamp(0.48rem, 1.8vw, 0.62rem)",
              letterSpacing: "0.35em",
              color: `rgba(139,111,90,0.52)`,
            }}
            aria-live="polite"
          >
            {progress}%
          </p>
        </div>
      </div>
    </div>
  )
}
