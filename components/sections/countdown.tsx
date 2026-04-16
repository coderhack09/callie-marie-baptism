"use client"

import { useEffect, useRef, useState } from "react"
import { Section } from "@/components/section"
import { motion } from "motion/react"
import { siteConfig } from "@/content/site"
import Counter from "@/components/Counter"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import Image from "next/image"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const ACCENT = "#CFA06B"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

// ── Floating background orbs ──────────────────────────────────────────────────
const ORBS = [
  { left: "6%",  top: "12%", size: 220, dur: 22, delay: 0,   dy: 28, color: "rgba(207,160,107,0.13)" },
  { left: "85%", top: "55%", size: 280, dur: 28, delay: 4,   dy: 22, color: "rgba(191,160,122,0.09)" },
  { left: "50%", top: "8%",  size: 160, dur: 18, delay: 7,   dy: 18, color: "rgba(207,160,107,0.10)" },
  { left: "22%", top: "80%", size: 190, dur: 25, delay: 2,   dy: 24, color: "rgba(139,111,90,0.07)"  },
  { left: "70%", top: "20%", size: 140, dur: 20, delay: 10,  dy: 16, color: "rgba(207,160,107,0.08)" },
]

// ── Canvas particle system (warm golden dust) ─────────────────────────────────
interface Particle {
  x: number; y: number; vx: number; vy: number
  radius: number; opacity: number; phase: number; speed: number
}

function createParticles(w: number, h: number): Particle[] {
  const count = Math.min(40, Math.max(18, Math.floor((w * h) / 18000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -(Math.random() * 0.15 + 0.05),
    radius: Math.random() * 1.6 + 0.3,
    opacity: Math.random() * 0.30 + 0.12,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.010 + 0.004,
  }))
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const ptRef     = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      ptRef.current = createParticles(canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    let running = true
    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ptRef.current.forEach(p => {
        p.phase += p.speed
        const twinkle = (Math.sin(p.phase) + 1) * 0.5
        const alpha   = p.opacity * (0.25 + twinkle * 0.75)
        const r       = p.radius * 3.5
        const g       = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
        g.addColorStop(0,   `rgba(207,160,107,${alpha})`)
        g.addColorStop(0.5, `rgba(207,160,107,${alpha * 0.4})`)
        g.addColorStop(1,   `rgba(207,160,107,0)`)
        ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.y < -10)              { p.y = canvas.height + 5; p.x = Math.random() * canvas.width }
        if (p.x < -10)              p.x = canvas.width  + 10
        if (p.x > canvas.width + 10) p.x = -10
      })
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => { running = false; cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "multiply" }}
      aria-hidden
    />
  )
}

// ── Countdown tile ────────────────────────────────────────────────────────────
function CountdownUnit({
  value, label, index, isSeconds,
}: { value: number; label: string; index: number; isSeconds?: boolean }) {
  const places = value >= 100 ? [100, 10, 1] : [10, 1]

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5 sm:gap-2.5"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 + index * 0.12, ease: "easeOut" }}
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -3 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
        style={{ position: "relative" }}
      >
        {/* Seconds pulse ring */}
        {isSeconds && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            animate={{ boxShadow: [
              "0 0 0px 0px rgba(207,160,107,0)",
              "0 0 0px 4px rgba(207,160,107,0.28)",
              "0 0 0px 0px rgba(207,160,107,0)",
            ]}}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <div
          style={{
            background: `linear-gradient(145deg, rgba(255,252,248,0.95) 0%, rgba(245,230,211,0.80) 100%)`,
            border: `1px solid rgba(207,160,107,0.28)`,
            borderRadius: "10px",
            padding: "clamp(8px, 2.5vw, 14px) clamp(10px, 3vw, 20px)",
            minWidth: "clamp(64px, 16vw, 104px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 6px 28px rgba(139,111,90,0.14), 0 1px 4px rgba(139,111,90,0.08), inset 0 1px 0 rgba(255,255,255,0.8)`,
            backdropFilter: "blur(8px)",
          }}
        >
          <Counter
            value={value}
            places={places}
            fontSize={30}
            padding={4}
            gap={1}
            textColor={DEEP}
            fontWeight={700}
            borderRadius={4}
            horizontalPadding={2}
            gradientHeight={0}
            gradientFrom="transparent"
            gradientTo="transparent"
            counterStyle={{ backgroundColor: "transparent" }}
            digitStyle={{
              minWidth: "1.1ch",
              fontFamily: "'LoraBold', Georgia, serif",
              color: DEEP,
              letterSpacing: "-0.02em",
            }}
          />
        </div>
      </motion.div>

      <span
        className="garamond"
        style={{
          fontSize: "clamp(0.52rem, 1.8vw, 0.7rem)",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          color: `rgba(139,111,90,0.60)`,
          paddingRight: "0.4em",
        }}
      >
        {label}
      </span>
    </motion.div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function Countdown() {
  const ceremonyDate        = siteConfig.ceremony.date
  const ceremonyTimeDisplay = siteConfig.ceremony.time
  const [ceremonyMonth = "May", ceremonyDayRaw = "31", ceremonyYear = "2026"] =
    ceremonyDate.split(" ")
  const ceremonyDayNumber = ceremonyDayRaw.replace(/[^0-9]/g, "") || "31"
  const ceremonyDay       = siteConfig.ceremony.day || "Sunday"
  const ceremonyDayShort  = ceremonyDay.slice(0, 3).toUpperCase()

  const timeStr  = ceremonyTimeDisplay.split(",")[0].trim()
  const monthMap: Record<string, string> = {
    January: "01", February: "02", March: "03", April: "04",
    May: "05", June: "06", July: "07", August: "08",
    September: "09", October: "10", November: "11", December: "12",
  }
  const monthNum = monthMap[ceremonyMonth] || "05"
  const dayNum   = ceremonyDayNumber.padStart(2, "0")

  const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
  let hour = 8, mins = 0
  if (timeMatch) {
    hour = parseInt(timeMatch[1])
    mins = parseInt(timeMatch[2])
    const ampm = timeMatch[3].toUpperCase()
    if (ampm === "PM" && hour !== 12) hour += 12
    if (ampm === "AM" && hour === 12) hour = 0
  }

  const targetTimestamp = new Date(
    Date.UTC(parseInt(ceremonyYear), parseInt(monthNum) - 1, parseInt(dayNum), hour - 8, mins, 0)
  ).getTime()

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted,  setMounted]  = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const tick = () => {
      const diff = targetTimestamp - Date.now()
      if (diff > 0) {
        setTimeLeft({
          days:    Math.floor(diff / 86_400_000),
          hours:   Math.floor((diff / 3_600_000) % 24),
          minutes: Math.floor((diff / 60_000) % 60),
          seconds: Math.floor((diff / 1_000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetTimestamp])

  return (
    <Section
      id="countdown"
      className="relative py-10 sm:py-14 md:py-20 overflow-hidden bg-motif-cream"
    >

      {/* ── Layer 1: Canvas golden-dust particles ── */}
      <ParticleCanvas />

      {/* ── Layer 2: Floating bokeh orbs ── */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: orb.left,
            top:  orb.top,
            width:  orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(32px)",
            transform: "translate(-50%, -50%)",
            zIndex: 0,
          }}
          animate={{ y: [0, -orb.dy, 0], scale: [1, 1.06, 1] }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {/* ── Layer 3: Breathing center glow ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background: `radial-gradient(ellipse 70% 55% at 50% 50%, rgba(207,160,107,0.12) 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />

      {/* Corner florals */}
      {/* <Image src="/decoration/top-left.png"     alt="" width={220} height={220} aria-hidden
        className="absolute top-0 left-0 pointer-events-none select-none z-[1] w-20 sm:w-28 md:w-36 opacity-50" />
      <Image src="/decoration/top-right.png"    alt="" width={220} height={220} aria-hidden
        className="absolute top-0 right-0 pointer-events-none select-none z-[1] w-20 sm:w-28 md:w-36 opacity-50" /> */}
      <Image src="/decoration/balloons-half.png" alt="" width={400} height={400} aria-hidden
        className="absolute pointer-events-none select-none z-[1] opacity-80"
        style={{ bottom: "-10px", left: "-10px", width: "clamp(120px, 22vw, 260px)", height: "auto" }}
      />
      <Image src="/decoration/balloons-half.png" alt="" width={400} height={400} aria-hidden
        className="absolute pointer-events-none select-none z-[1] opacity-80"
        style={{ bottom: "-10px", right: "-10px", width: "clamp(120px, 22vw, 260px)", height: "auto", transform: "scaleX(-1)" }}
      />

      {/* ── Monogram — floats gently ── */}
      <div className="relative flex justify-center pt-6 sm:pt-8 mb-2 sm:mb-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            {/* Halo glow behind monogram */}
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              animate={{ opacity: [0.4, 0.85, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background: `radial-gradient(circle, rgba(207,160,107,0.14) 0%, transparent 65%)`,
                filter: "blur(20px)",
                zIndex: -1,
              }}
            />
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-[20rem] md:h-[20rem] lg:w-[26rem] lg:h-[26rem] opacity-75">
              <CloudinaryImage
                src={siteConfig.couple.monogram}
                alt="Niahna Celestine Monogram"
                fill
                className="object-contain"
              priority={false}
            />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Header ── */}
      <div className="relative z-10 text-center px-4 mb-6 sm:mb-9">

        {/* Eyebrow */}
        <motion.p
          className="garamond"
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{
            fontSize: "clamp(0.52rem, 1.9vw, 0.7rem)",
            letterSpacing: "0.5em",
            textTransform: "uppercase",
            color: ACCENT,
            marginBottom: "0.55rem",
            paddingRight: "0.5em",
          }}
        >
          Niahna Celestine&apos;s Christening
        </motion.p>

        {/* Ornament */}
        <motion.div
          className="flex items-center justify-center gap-3 mb-3 sm:mb-4"
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={mounted ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
        >
          <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.45), transparent)` }} />
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: ACCENT, fontSize: "7px" }}
          >✦</motion.span>
          <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.45), transparent)` }} />
        </motion.div>

        {/* Main heading */}
        <motion.h2
          className="gistesy"
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.18, ease: "easeOut" }}
          style={{
            fontSize: "clamp(2.2rem, 9.5vw, 4.8rem)",
            color: DEEP,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            textShadow: `0 3px 32px rgba(139,111,90,0.15)`,
            marginBottom: "0.4rem",
          }}
        >
          The Blessed Day is Near
        </motion.h2>

        {/* Tagline */}
        <motion.p
          className="garamond"
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          style={{
            fontSize: "clamp(0.7rem, 2.8vw, 0.94rem)",
            color: `rgba(139,111,90,0.68)`,
            fontStyle: "italic",
            letterSpacing: "0.02em",
          }}
        >
          A sacred moment of grace, faith, and gratitude
        </motion.p>
      </div>

      {/* ── Countdown tiles ── */}
      <div className="relative z-10 flex justify-center px-4 mb-8 sm:mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full max-w-xs sm:max-w-md md:max-w-xl">
          <CountdownUnit value={timeLeft.days}    label="Days"    index={0} />
          <CountdownUnit value={timeLeft.hours}   label="Hours"   index={1} />
          <CountdownUnit value={timeLeft.minutes} label="Minutes" index={2} />
          <CountdownUnit value={timeLeft.seconds} label="Seconds" index={3} isSeconds />
        </div>
      </div>

      {/* ── Date display ── */}
      <motion.div
        className="relative z-10 px-4 pb-10 sm:pb-14"
        initial={{ opacity: 0, y: 24 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 1.1, ease: "easeOut" }}
      >
        <div className="w-full max-w-xl mx-auto flex flex-col items-center gap-2 sm:gap-3">

          {/* Month */}
          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.58rem, 2.1vw, 0.76rem)",
              letterSpacing: "0.6em",
              textTransform: "uppercase",
              color: ACCENT,
              opacity: 0.8,
              paddingRight: "0.6em",
            }}
          >
            {ceremonyMonth}
          </p>

          {/* DOW — big number — TIME */}
          <div className="flex w-full items-center gap-2 sm:gap-4">

            <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-2.5">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(139,111,90,0.22), transparent)` }} />
              <span
                className="garamond"
                style={{
                  fontSize: "clamp(0.52rem, 1.9vw, 0.7rem)",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: `rgba(139,111,90,0.55)`,
                }}
              >
                {ceremonyDayShort}
              </span>
              <div className="h-px w-5 sm:w-8" style={{ background: `rgba(139,111,90,0.15)` }} />
            </div>

            {/* Big day number — soft pulse */}
            <motion.span
              className="LoraBold"
              animate={{ textShadow: [
                "0 4px 28px rgba(139,111,90,0.10)",
                "0 6px 40px rgba(139,111,90,0.22)",
                "0 4px 28px rgba(139,111,90,0.10)",
              ]}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontSize: "clamp(4rem, 16vw, 8rem)",
                color: DEEP,
                lineHeight: 0.9,
                letterSpacing: "-0.02em",
              }}
            >
              {ceremonyDayNumber.padStart(2, "0")}
            </motion.span>

            <div className="flex flex-1 items-center gap-1.5 sm:gap-2.5">
              <div className="h-px w-5 sm:w-8" style={{ background: `rgba(139,111,90,0.15)` }} />
              <span
                className="garamond"
                style={{
                  fontSize: "clamp(0.52rem, 1.9vw, 0.7rem)",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: `rgba(139,111,90,0.55)`,
                }}
              >
                {ceremonyTimeDisplay.split(",")[0]}
              </span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(139,111,90,0.22), transparent)` }} />
            </div>
          </div>

          {/* Year */}
          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.58rem, 2.1vw, 0.76rem)",
              letterSpacing: "0.6em",
              textTransform: "uppercase",
              color: ACCENT,
              opacity: 0.8,
              paddingRight: "0.6em",
            }}
          >
            {ceremonyYear}
          </p>

          {/* Rule */}
          <div className="flex items-center justify-center gap-2 mt-1 w-full max-w-[220px]">
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(139,111,90,0.25), transparent)` }} />
            <motion.span
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ color: ACCENT, fontSize: "5px" }}
            >◆</motion.span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(139,111,90,0.25), transparent)` }} />
          </div>

          {/* Venue */}
          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.58rem, 2.1vw, 0.74rem)",
              letterSpacing: "0.05em",
              color: `rgba(139,111,90,0.58)`,
              textAlign: "center",
              fontStyle: "italic",
              marginTop: "0.15rem",
            }}
          >
            {siteConfig.ceremony.location}
          </p>

        </div>
      </motion.div>
    </Section>
  )
}
