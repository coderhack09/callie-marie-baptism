"use client"

import { useEffect, useState } from "react"
import { Section } from "@/components/section"
import { motion } from "motion/react"
import { siteConfig } from "@/content/site"
import Counter from "@/components/Counter"
import Image from "next/image"

const NAVY      = "#2B4A6B"
const DARK_NAVY = "#1C3050"
const GOLD      = "#C4965A"
const NAVY_MUTE = "rgba(65,90,115,0.78)"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const SPARKLES = [
  { top: "14%", left: "8%",   size: 3,   op: 0.45 },
  { top: "22%", left: "14%",  size: 2,   op: 0.30 },
  { top: "10%", right: "28%", size: 2.5, op: 0.38 },
  { top: "35%", left: "5%",   size: 2,   op: 0.28 },
  { top: "18%", right: "15%", size: 3,   op: 0.40 },
  { top: "62%", right: "7%",  size: 2.5, op: 0.32 },
  { top: "70%", left: "10%",  size: 2,   op: 0.28 },
]

function DiamondRule({ width = "clamp(180px,60vw,280px)", margin = "0" }: { width?: string; margin?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", width, margin }}>
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,152,88,0.45))" }} />
      <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)", flexShrink: 0 }} />
      <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,152,88,0.45))" }} />
    </div>
  )
}

function HeroCross() {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <div
        className="absolute animate-loader-glow"
        style={{
          inset: "-8px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(196,152,88,0.18) 0%, rgba(220,175,100,0.08) 55%, transparent 80%)",
          filter: "blur(6px)",
        }}
      />
      <svg viewBox="0 0 110 115" style={{ width: "clamp(58px,14vw,80px)", position: "relative" }} fill="none">
        <circle cx="55" cy="56" r="22" stroke="rgba(196,152,88,0.20)" strokeWidth="0.8" fill="rgba(196,152,88,0.05)" />
        {Array.from({ length: 20 }, (_, i) => {
          const deg  = (i * 360) / 20
          const long = i % 2 === 0
          const rad  = (deg * Math.PI) / 180
          return (
            <line
              key={i}
              x1={55 + Math.sin(rad) * (long ? 24 : 19)}
              y1={56 - Math.cos(rad) * (long ? 24 : 19)}
              x2={55 + Math.sin(rad) * (long ? 42 : 33)}
              y2={56 - Math.cos(rad) * (long ? 42 : 33)}
              stroke={`rgba(196,152,88,${long ? 0.58 : 0.25})`}
              strokeWidth={long ? "1.5" : "0.8"}
              strokeLinecap="round"
            />
          )
        })}
        <rect x="49" y="18" width="12" height="74" rx="5" fill="url(#countdownCrossGold)" />
        <rect x="22" y="38" width="66" height="12" rx="5" fill="url(#countdownCrossGold)" />
        <rect x="52" y="18" width="5" height="74" rx="2.5" fill="rgba(255,242,200,0.28)" />
        <defs>
          <linearGradient id="countdownCrossGold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#D4A860" />
            <stop offset="50%"  stopColor="#C4965A" />
            <stop offset="100%" stopColor="#A87840" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

function OliveBranch({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg viewBox="0 0 58 24" style={{ width: "clamp(34px,9vw,56px)", transform: mirrored ? "scaleX(-1)" : undefined }} fill="none">
      <line x1="2" y1="12" x2="54" y2="12" stroke="rgba(108,128,94,0.38)" strokeWidth="0.8" />
      <ellipse cx="11" cy="7"  rx="7.5" ry="4.2" fill="rgba(108,128,94,0.52)" transform="rotate(-22 11 7)"  />
      <ellipse cx="23" cy="9"  rx="6.5" ry="3.8" fill="rgba(108,128,94,0.42)" transform="rotate(-14 23 9)"  />
      <ellipse cx="35" cy="10" rx="5.5" ry="3.2" fill="rgba(108,128,94,0.34)" transform="rotate(-7 35 10)"  />
      <ellipse cx="47" cy="11" rx="4.5" ry="2.6" fill="rgba(108,128,94,0.24)" transform="rotate(-2 47 11)"  />
      <ellipse cx="14" cy="17" rx="6"   ry="3.5" fill="rgba(108,128,94,0.38)" transform="rotate(18 14 17)" />
      <ellipse cx="28" cy="16" rx="5"   ry="3"   fill="rgba(108,128,94,0.28)" transform="rotate(10 28 16)" />
    </svg>
  )
}

function CountdownUnit({
  value, label, index, isSeconds,
}: { value: number; label: string; index: number; isSeconds?: boolean }) {
  const places = value >= 100 ? [100, 10, 1] : [10, 1]

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.55 + index * 0.1, ease: "easeOut" }}
    >
      <div style={{ position: "relative" }}>
        {isSeconds && (
          <motion.div
            className="absolute inset-0 rounded-sm pointer-events-none"
            animate={{ boxShadow: [
              "0 0 0px 0px rgba(196,152,88,0)",
              "0 0 0px 3px rgba(196,152,88,0.30)",
              "0 0 0px 0px rgba(196,152,88,0)",
            ]}}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div style={{
          background: "rgba(255,255,255,0.30)",
          border: "1.5px solid rgba(43,74,107,0.28)",
          borderRadius: "2px",
          padding: "clamp(10px,2.8vw,16px) clamp(12px,3.5vw,22px)",
          minWidth: "clamp(68px,17vw,108px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.60) inset",
          position: "relative",
          overflow: "hidden",
        }}>
          <div className="absolute bottom-0 left-0 right-0" style={{
            height: "2px",
            background: "linear-gradient(to right, transparent, rgba(196,152,88,0.45), transparent)",
          }} />
          <Counter
            value={value}
            places={places}
            fontSize={30}
            padding={4}
            gap={1}
            textColor={NAVY}
            fontWeight={700}
            borderRadius={4}
            horizontalPadding={2}
            gradientHeight={0}
            gradientFrom="transparent"
            gradientTo="transparent"
            counterStyle={{ backgroundColor: "transparent" }}
            digitStyle={{
              minWidth: "1.1ch",
              fontFamily: '"Cinzel", serif',
              color: NAVY,
              letterSpacing: "0.04em",
            }}
          />
        </div>
      </div>
      <span style={{
        fontFamily: '"Cinzel", serif',
        fontSize: "clamp(0.48rem, 1.6vw, 0.60rem)",
        letterSpacing: "0.36em",
        textTransform: "uppercase",
        color: "rgba(72,112,148,0.72)",
        paddingRight: "0.36em",
      }}>
        {label}
      </span>
    </motion.div>
  )
}

export function Countdown() {
  const ceremonyDate        = siteConfig.ceremony.date
  const ceremonyTimeDisplay = siteConfig.ceremony.time
  const [ceremonyMonth = "May", ceremonyDayRaw = "31", ceremonyYear = "2026"] =
    ceremonyDate.split(" ")
  const ceremonyDayNumber = ceremonyDayRaw.replace(/[^0-9]/g, "") || "31"
  const ceremonyDay       = siteConfig.ceremony.day || "Sunday"
  const ceremonyDayShort  = ceremonyDay.slice(0, 3).toUpperCase()

  const parts      = siteConfig.couple.child.trim().split(" ")
  const givenName  = parts[0]
  const middleName = parts.length > 2 ? parts[1] : ""

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
      className="relative py-12 sm:py-16 md:py-20 overflow-hidden"
      bgColor="none"
    >
      {/* ── Hero background layers ── */}
      <div className="absolute inset-0 -z-10" style={{ background: "#FFFFFF" }} />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse 72% 65% at 50% 48%, rgba(255,255,255,0.68) 0%, transparent 72%)",
      }} />
      <div className="absolute -z-10 pointer-events-none" style={{
        bottom: 0, left: 0, right: 0, height: "36%",
        background: "linear-gradient(0deg, rgba(120,175,215,0.20) 0%, rgba(140,185,220,0.10) 40%, transparent 100%)",
      }} />

      {/* Sparkle dots — identical to Hero */}
      {SPARKLES.map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none rounded-full z-[1]"
          style={{
            top: s.top, left: s.left, right: s.right,
            width: `${s.size}px`, height: `${s.size}px`,
            background: "rgba(196,152,88,1)",
            opacity: mounted ? s.op : 0,
            transition: `opacity 1s ease-out ${0.4 + i * 0.12}s`,
          }}
          aria-hidden
        />
      ))}

      {/* Corner florals — subtle */}
      <Image src="/decoration/left-top-removebg-preview.png" alt="" width={200} height={200} aria-hidden
        className="absolute top-0 left-0 pointer-events-none select-none z-[1] w-24 sm:w-36 md:w-44 opacity-35" />
      <Image src="/decoration/right-top-removebg-preview.png" alt="" width={200} height={200} aria-hidden
        className="absolute top-0 right-0 pointer-events-none select-none z-[1] w-24 sm:w-36 md:w-44 opacity-35" />

      {/* ── Main content — Hero layout ── */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm mx-auto px-6">

        {/* Cross with halo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.85, ease: "easeOut" }}
          style={{ marginBottom: "clamp(0.8rem,2.5vw,1.4rem)" }}
        >
          <HeroCross />
        </motion.div>

        {/* Small beige monogram */}
        {/* <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
          style={{ position: "relative", marginBottom: "clamp(0.6rem,2vw,1rem)" }}
        >
          <div className="absolute rounded-full animate-loader-glow pointer-events-none" style={{
            inset: "-16px",
            background: "radial-gradient(circle, rgba(196,152,88,0.16) 0%, transparent 65%)",
            filter: "blur(10px)",
          }} />
          <Image
            src={siteConfig.couple.monogram}
            alt="Monogram"
            width={80}
            height={80}
            className="relative h-12 w-12 sm:h-14 sm:w-14 object-contain mx-auto"
            style={{
              filter: "brightness(0) sepia(1) saturate(0.18) brightness(1.35)",
              opacity: 0.88,
            }}
          />
        </motion.div> */}

        {/* "Save the date" — hairlines like Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(0.8rem,2.5vw,1.2rem)" }}
        >
          <div style={{ width: "clamp(16px,4vw,24px)", height: "1px", background: "linear-gradient(to right, transparent, rgba(80,120,155,0.40))" }} />
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(1.0rem, 2vw, 1.72rem)",
            fontWeight: 700,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(72,112,148,0.88)",
            margin: 0,
            filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.18))",
          }}>
            Save the date
          </p>
          <div style={{ width: "clamp(16px,4vw,24px)", height: "1px", background: "linear-gradient(to left, transparent, rgba(80,120,155,0.40))" }} />
        </motion.div>

        {/* Diamond rule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.28 }}
          style={{ marginBottom: "clamp(0.9rem,2.8vw,1.4rem)" }}
        >
          <DiamondRule />
        </motion.div>

        {/* KAEZAR — Cinzel Bold navy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.35, ease: "easeOut" }}
        >
          <div style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            fontSize: "clamp(2.8rem, 12vw, 5.5rem)",
            color: NAVY,
            lineHeight: 1.0,
            letterSpacing: "0.14em",
            textShadow: "0 2px 20px rgba(43,74,107,0.14), 0 4px 40px rgba(43,74,107,0.06)",
          }}>
            {givenName.toUpperCase()}
          </div>
        </motion.div>

        {/* Isaiahnuel's — LeJourScript gold */}
        {middleName && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          >
            <div style={{
              fontFamily: '"LeJourScript", cursive',
              fontSize: "clamp(2rem, 8vw, 4rem)",
              color: GOLD,
              lineHeight: 1.08,
              letterSpacing: "0.02em",
              marginTop: "clamp(0.2rem,0.8vw,0.5rem)",
              filter: "drop-shadow(0 2px 6px rgba(196,152,88,0.16))",
            }}>
              {middleName}&apos;s
            </div>
          </motion.div>
        )}

        {/* Holy Baptism + olive branches */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.55, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center", gap: "clamp(6px,2vw,12px)", marginTop: "clamp(0.8rem,2.5vw,1.3rem)" }}
        >
          <OliveBranch />
          <div style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            fontSize: "clamp(0.9rem, 3.4vw, 1.6rem)",
            color: DARK_NAVY,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            textShadow: "0 1px 8px rgba(28,48,80,0.10)",
          }}>
            Holy Baptism
          </div>
          <OliveBranch mirrored />
        </motion.div>

        {/* Diamond rule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.65 }}
          style={{ margin: "clamp(1rem,3vw,1.5rem) 0" }}
        >
          <DiamondRule />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.72 }}
          style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontWeight: 400,
            fontSize: "clamp(0.72rem, 2.6vw, 0.88rem)",
            color: NAVY_MUTE,
            fontStyle: "italic",
            letterSpacing: "0.02em",
            lineHeight: 1.6,
            marginBottom: "clamp(1.2rem,3.5vw,1.8rem)",
          }}
        >
          The blessed day is near — a sacred moment of grace, faith, and gratitude
        </motion.p>

        {/* ── Countdown tiles — frosted Hero-style panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.8, ease: "easeOut" }}
          className="w-full"
          style={{
            background: "rgba(255,255,255,0.25)",
            border: "1px solid rgba(43,74,107,0.18)",
            borderRadius: "4px",
            padding: "clamp(1.2rem,4vw,1.8rem) clamp(0.8rem,3vw,1.4rem)",
            boxShadow: "0 8px 40px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
            marginBottom: "clamp(1.4rem,4vw,2rem)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="absolute bottom-0 left-0 right-0" style={{
            height: "2px",
            background: "linear-gradient(to right, transparent, rgba(196,152,88,0.50), transparent)",
          }} />
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(1.0rem, 2vw, 1.72rem)",
            fontWeight: 700,
            letterSpacing: "0.40em",
            textTransform: "uppercase",
            color: "rgba(72,112,148,0.68)",
            marginBottom: "clamp(0.8rem,2.5vw,1.2rem)",
            paddingRight: "0.40em",
          }}>
            Counting down
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <CountdownUnit value={timeLeft.days}    label="Days"    index={0} />
            <CountdownUnit value={timeLeft.hours}   label="Hours"   index={1} />
            <CountdownUnit value={timeLeft.minutes} label="Minutes" index={2} />
            <CountdownUnit value={timeLeft.seconds} label="Seconds" index={3} isSeconds />
          </div>
        </motion.div>

        {/* ── Date display — Hero typography ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.95, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
          style={{ paddingBottom: "clamp(1rem,3vw,1.5rem)" }}
        >
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.52rem, 1.9vw, 0.68rem)",
            letterSpacing: "0.50em",
            textTransform: "uppercase",
            color: GOLD,
            paddingRight: "0.50em",
            marginBottom: "clamp(0.4rem,1.2vw,0.6rem)",
          }}>
            {ceremonyMonth}
          </p>

          <div className="flex w-full items-center gap-2 sm:gap-3">
            <div className="flex flex-1 items-center justify-end gap-2">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.40), transparent)" }} />
              <span style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.48rem, 1.7vw, 0.62rem)",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(72,112,148,0.72)",
              }}>
                {ceremonyDayShort}
              </span>
            </div>

            <motion.span
              animate={{ textShadow: [
                "0 4px 24px rgba(196,152,88,0.10)",
                "0 6px 36px rgba(196,152,88,0.26)",
                "0 4px 24px rgba(196,152,88,0.10)",
              ]}}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                fontSize: "clamp(3.2rem, 14vw, 6.5rem)",
                color: DARK_NAVY,
                lineHeight: 0.9,
                letterSpacing: "-0.01em",
              }}
            >
              {ceremonyDayNumber.padStart(2, "0")}
            </motion.span>

            <div className="flex flex-1 items-center gap-2">
              <span style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.48rem, 1.7vw, 0.62rem)",
                letterSpacing: "0.26em",
                textTransform: "uppercase",
                color: "rgba(72,112,148,0.72)",
              }}>
                {ceremonyTimeDisplay.split(",")[0]}
              </span>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.40), transparent)" }} />
            </div>
          </div>

          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.52rem, 1.9vw, 0.68rem)",
            letterSpacing: "0.50em",
            textTransform: "uppercase",
            color: GOLD,
            paddingRight: "0.50em",
            marginTop: "clamp(0.4rem,1.2vw,0.6rem)",
            marginBottom: "clamp(0.8rem,2.5vw,1.2rem)",
          }}>
            {ceremonyYear}
          </p>

          <DiamondRule width="clamp(160px,50vw,240px)" />

          {/* Son of + parents — matching Hero */}
        

       
        </motion.div>
      </div>
    </Section>
  )
}
