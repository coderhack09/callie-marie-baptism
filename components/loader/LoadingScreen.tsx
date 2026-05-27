"use client"

import React, { useEffect, useState, useRef } from "react"
import { siteConfig } from "@/content/site"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

interface LoadingScreenProps {
  onComplete: () => void
}

const DOT_FRAMES = ["", ".", "..", "..."]

const BUBBLES = [
  { left: "5%",  size: 7,  dur: 16, delay: 0   },
  { left: "14%", size: 11, dur: 21, delay: -7  },
  { left: "25%", size: 5,  dur: 12, delay: -14 },
  { left: "37%", size: 9,  dur: 18, delay: -4  },
  { left: "49%", size: 14, dur: 25, delay: -11 },
  { left: "60%", size: 4,  dur: 10, delay: -19 },
  { left: "70%", size: 10, dur: 17, delay: -6  },
  { left: "79%", size: 6,  dur: 13, delay: -9  },
  { left: "88%", size: 12, dur: 20, delay: -2  },
  { left: "95%", size: 8,  dur: 15, delay: -16 },
]

interface Particle {
  x: number; y: number; vx: number; vy: number
  radius: number; opacity: number
  twinklePhase: number; twinkleSpeed: number; colorIdx: number
}

const PARTICLE_COLORS = [
  "196, 152, 88",
  "210, 170, 105",
  "180, 138, 78",
  "220, 185, 128",
]

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(36, Math.max(16, Math.floor((width * height) / 16000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.18,
    vy: -(Math.random() * 0.10 + 0.03),
    radius: Math.random() * 1.8 + 0.4,
    opacity: Math.random() * 0.18 + 0.04,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.008 + 0.002,
    colorIdx: Math.floor(Math.random() * PARTICLE_COLORS.length),
  }))
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase]       = useState(0)
  const [dotFrame, setDotFrame] = useState(0)

  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  const TOTAL_LOAD_MS = 10000
  const FADE_MS       = 700

  const parts      = siteConfig.couple.child.trim().split(" ")
  const givenName  = parts[0]
  const middleName = parts.length > 2 ? parts[1] : ""
  const familyName = parts[parts.length - 1]

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
        const alpha   = p.opacity * (0.35 + twinkle * 0.65)
        const color   = PARTICLE_COLORS[p.colorIdx]
        const blurR   = p.radius * 4.5
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
        g.addColorStop(0,   `rgba(${color},${alpha})`)
        g.addColorStop(0.4, `rgba(${color},${alpha * 0.4})`)
        g.addColorStop(1,   `rgba(${color},0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        const { width, height } = canvas
        if (p.y < -20)         { p.y = height + 10; p.x = Math.random() * width }
        if (p.x < -20)           p.x = width  + 20
        if (p.x > width + 20)    p.x = -20
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

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 120),
      setTimeout(() => setPhase(2), 380),
      setTimeout(() => setPhase(3), 600),
      setTimeout(() => setPhase(4), 820),
      setTimeout(() => setPhase(5), 1020),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setDotFrame(d => (d + 1) % 4), 550)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    let rafId = 0
    const start        = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const tick = (now: number) => {
      const t    = Math.min(1, (now - start) / TOTAL_LOAD_MS)
      const next = Math.round(easeOutCubic(t) * 100)
      setProgress(prev => (next > prev ? next : prev))
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

  const vis = (minPhase: number, delay = "0ms") => ({
    opacity:    phase >= minPhase ? 1 : 0,
    transform:  phase >= minPhase ? "translateY(0)" : "translateY(12px)",
    transition: `opacity 0.7s ease-out ${delay}, transform 0.7s ease-out ${delay}`,
  })

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading invitation"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* ── Center spotlight — identical to Hero ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 72% 65% at 50% 48%, rgba(255,255,255,0.68) 0%, transparent 72%)",
      }} />

      {/* ── Baptismal water wash bottom — identical to Hero ── */}
      <div className="absolute pointer-events-none" style={{
        bottom: 0, left: 0, right: 0, height: "36%",
        background: "linear-gradient(0deg, rgba(120,175,215,0.20) 0%, rgba(140,185,220,0.10) 40%, transparent 100%)",
      }} />

      {/* ── Warm particle canvas ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "multiply", opacity: 0.35 }}
        aria-hidden
      />

      {/* ── Pearl bubbles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bubble-rise"
            style={{
              left: b.left, bottom: "-16px",
              width: `${b.size}px`, height: `${b.size}px`,
              background: "radial-gradient(circle at 32% 32%, rgba(255,255,255,0.95), rgba(220,185,130,0.10))",
              border: "1px solid rgba(196,152,88,0.15)",
              animationDuration: `${b.dur}s`,
              animationDelay:    `${b.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Sparkle dots — identical to Hero ── */}
      {([
        { top: "14%", left: "8%",   size: 3,   op: 0.45, delay: "1.2s" },
        { top: "22%", left: "14%",  size: 2,   op: 0.30, delay: "1.5s" },
        { top: "10%", right: "28%", size: 2.5, op: 0.38, delay: "1.8s" },
        { top: "35%", left: "5%",   size: 2,   op: 0.28, delay: "2.0s" },
        { top: "18%", right: "15%", size: 3,   op: 0.40, delay: "1.4s" },
        { top: "62%", right: "7%",  size: 2.5, op: 0.32, delay: "2.2s" },
        { top: "70%", left: "10%",  size: 2,   op: 0.28, delay: "1.9s" },
      ] as Array<{ top: string; left?: string; right?: string; size: number; op: number; delay: string }>)
        .map((s, i) => (
          <div key={i} className="absolute pointer-events-none rounded-full" style={{
            top: s.top, left: s.left, right: s.right,
            width: `${s.size}px`, height: `${s.size}px`,
            background: "rgba(196,152,88,1)",
            opacity: phase >= 1 ? s.op : 0,
            transition: `opacity 1s ease-out ${s.delay}`,
          }} aria-hidden />
        ))}


      {/* ════════════════════════════════════════════
          Full-height spread layout — 3 sections
      ════════════════════════════════════════════ */}
      <div
        className="relative z-10 flex flex-col items-center w-full"
        style={{ minHeight: "100svh", paddingBottom: "clamp(5rem,14vw,7rem)" }}
      >

        {/* ── SECTION 1: Monogram + Holy Baptism — top ── */}
        <div
          className="flex flex-col items-center"
          style={{ paddingTop: "clamp(4rem,10vh,6rem)" }}
        >
          <div style={{
            position: "relative",
            opacity:    phase >= 1 ? 1 : 0,
            transform:  phase >= 1 ? "scale(1)" : "scale(0.92)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
            marginBottom: "clamp(0.5rem,1.5vw,0.8rem)",
          }}>
            <div className="absolute rounded-full animate-loader-glow pointer-events-none" style={{
              inset: "-24px",
              background: "radial-gradient(circle, rgba(210,185,150,0.22) 0%, transparent 65%)",
              filter: "blur(14px)",
            }} />
            <CloudinaryImage
              src={siteConfig.couple.monogram}
              alt="Monogram"
              width={160} height={160}
              className="h-16 w-16 sm:h-20 sm:w-20 object-contain object-center relative"
              style={{
                filter: "brightness(0) sepia(1) saturate(0.18) brightness(1.35)",
                opacity: 0.85,
              }}
              priority
            />
          </div>

          <p style={{
            ...vis(1, "0.3s"),
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            fontSize: "clamp(0.68rem, 2.4vw, 0.85rem)",
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#1C3050",
            textShadow: "0 1px 8px rgba(28,48,80,0.10)",
          }}>
            Holy Baptism
          </p>
        </div>

        {/* ── Flex spacer pushes name to center ── */}
        <div style={{ flex: 1 }} />

        {/* ── SECTION 2: Name stack — vertical center ── */}
        <div className="flex flex-col items-center text-center px-6">

          {/* Diamond rule above name */}
          <div style={vis(2, "0ms")}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "clamp(180px,60vw,280px)", marginBottom: "clamp(0.8rem,2.4vw,1.2rem)" }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,152,88,0.45))" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)" }} />
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,152,88,0.45))" }} />
            </div>
          </div>

          {/* KAEZAR */}
          <div style={vis(2, "60ms")}>
            <div style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              fontSize: "clamp(3.4rem, 14.5vw, 7.5rem)",
              color: "#2B4A6B",
              lineHeight: 1.0,
              letterSpacing: "0.14em",
              textShadow: "0 2px 20px rgba(43,74,107,0.14), 0 4px 40px rgba(43,74,107,0.06)",
            }}>
              {givenName.toUpperCase()}
            </div>
          </div>

          {/* Isaiahnuel */}
          {middleName && (
            <div style={vis(3, "60ms")}>
              <div style={{
                fontFamily: '"LeJourScript", cursive',
                fontSize: "clamp(2.4rem, 9.5vw, 5rem)",
                color: "#C4965A",
                lineHeight: 1.08,
                letterSpacing: "0.02em",
                marginTop: "clamp(0.2rem,0.8vw,0.4rem)",
                filter: "drop-shadow(0 2px 6px rgba(196,152,88,0.16))",
              }}>
                {middleName}
              </div>
            </div>
          )}

          {/* Galardo */}
          <div style={vis(3, "120ms")}>
            <div style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 400,
              fontSize: "clamp(1.0rem, 4vw, 2rem)",
              color: "rgba(43,74,107,0.55)",
              lineHeight: 1.20,
              letterSpacing: "0.20em",
              textTransform: "uppercase",
              marginTop: "clamp(0.3rem,0.8vw,0.5rem)",
            }}>
              {familyName}
            </div>
          </div>

          {/* Diamond rule below name */}
          <div style={vis(4, "0ms")}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "clamp(180px,60vw,280px)", marginTop: "clamp(0.8rem,2.4vw,1.2rem)" }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,152,88,0.42))" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.60)" }} />
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,152,88,0.42))" }} />
            </div>
          </div>
        </div>

        {/* ── Flex spacer pushes parents to bottom ── */}
        <div style={{ flex: 1 }} />

        {/* ── SECTION 3: Son of + Parents — lower third ── */}
        <div
          className="flex flex-col items-center text-center px-6"
          style={{ paddingBottom: "clamp(0.5rem,2vw,1rem)" }}
        >
          <div style={vis(4, "80ms")}>
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.52rem, 1.8vw, 0.62rem)",
              letterSpacing: "0.40em",
              textTransform: "uppercase",
              color: "rgba(72,112,148,0.68)",
              marginBottom: "8px",
            }}>
              Son of
            </p>
            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontWeight: 400,
              fontSize: "clamp(0.82rem, 2.8vw, 1.0rem)",
              color: "rgba(65,90,115,0.82)",
              letterSpacing: "0.03em",
              lineHeight: 1.7,
              textAlign: "center",
              maxWidth: "clamp(230px,72vw,320px)",
            }}>
              {siteConfig.couple.parents}
            </p>
          </div>
        </div>

      </div>

      {/* ── Progress bar — pinned to bottom ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center"
        style={{ paddingBottom: "clamp(1.8rem,5vw,3rem)" }}
      >
        <div style={{
          ...vis(5, "0ms"),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "240px",
          padding: "0 28px",
          gap: "10px",
        }}>
          {/* Label with gold hairlines */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,152,88,0.40))" }} />
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.62rem, 2.2vw, 0.72rem)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(72,112,148,0.72)",
              margin: 0,
              whiteSpace: "nowrap",
            }}>
              Loading Invitation{DOT_FRAMES[dotFrame]}
            </p>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,152,88,0.40))" }} />
          </div>

          {/* Progress bar */}
          <div className="w-full relative" style={{ height: "2px" }} role="presentation">
            <div className="absolute inset-0 rounded-full" style={{ backgroundColor: "rgba(196,152,88,0.14)" }} />
            <div className="absolute inset-y-0 left-0 overflow-visible rounded-full" style={{
              width: `${Math.max(progress, 2)}%`,
              transition: "width 200ms linear",
              background: "linear-gradient(to right, #C4965A, rgba(210,170,105,0.70))",
            }}>
              <div className="absolute inset-y-0 animate-loader-shimmer" style={{
                width: "60px",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,240,200,0.65) 50%, transparent 100%)",
              }} />
              <div className="absolute top-1/2 -translate-y-1/2" style={{
                right: "-4px",
                width: "8px", height: "8px",
                borderRadius: "50%",
                background: "#C4965A",
                boxShadow: "0 0 8px rgba(196,152,88,0.90), 0 0 16px rgba(196,152,88,0.35)",
              }} />
            </div>
          </div>

          {/* Percentage */}
          <p className="tabular-nums" style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.62rem, 2.2vw, 0.72rem)",
            letterSpacing: "0.30em",
            color: "rgba(196,152,88,0.60)",
            textAlign: "center",
            margin: 0,
          }} aria-live="polite">
            {progress}%
          </p>
        </div>
      </div>
    </div>
  )
}
