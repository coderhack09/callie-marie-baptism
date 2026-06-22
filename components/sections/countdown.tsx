"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { siteConfig } from "@/content/site"
import Counter from "@/components/Counter"
import { C, contentPanel, nameStyles, roseLine, text } from "@/components/loader/christening-theme"
import {
  ChristeningBackdrop,
  ChristeningCross,
  CornerFloralDecor,
  DiamondRule,
  FloralGarland,
} from "@/components/loader/ChristeningDecor"

const countdownPanelStyle: React.CSSProperties = {
  ...contentPanel,
  width: "100%",
  maxWidth: "clamp(18rem, 92vw, 42rem)",
  marginInline: "auto",
  padding: "clamp(1.5rem, 4.5vw, 3.25rem) clamp(1.25rem, 4vw, 3rem)",
}

const countdownGivenStyle: React.CSSProperties = {
  ...nameStyles.given,
  fontSize: "clamp(2.65rem, 9vw + 0.5rem, 5rem)",
  letterSpacing: "clamp(0.06em, 0.12vw + 0.06em, 0.14em)",
}

const countdownScriptStyle: React.CSSProperties = {
  ...nameStyles.script,
  fontSize: "clamp(2.1rem, 7vw + 0.4rem, 4.25rem)",
}

const countdownSubtitleStyle: React.CSSProperties = {
  ...nameStyles.subtitle,
  fontSize: "clamp(0.95rem, 2.2vw + 0.5rem, 1.75rem)",
}

const countdownInviteStyle: React.CSSProperties = {
  ...nameStyles.invite,
  fontSize: "clamp(0.72rem, 1.8vw + 0.4rem, 1.05rem)",
  letterSpacing: "clamp(0.18em, 0.24em, 0.28em)",
}

const countdownRuleWidth = "min(100%, clamp(11rem, 72%, 22rem))"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function CountdownUnit({
  value, label, index, digitFontSize,
}: { value: number; label: string; index: number; digitFontSize: number }) {
  const places = value >= 100 ? [100, 10, 1] : [10, 1]

  return (
    <motion.div
      className="flex flex-col items-center gap-2 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.55 + index * 0.1, ease: "easeOut" }}
    >
      <div className="relative w-full flex justify-center">
        <div
          className="relative overflow-hidden rounded-md"
          style={{
            background: `linear-gradient(160deg, ${C.ivory} 0%, ${C.blushSoft} 100%)`,
            border: `1.5px solid ${C.blushDeep}`,
            padding: "clamp(10px, 2.2vw, 18px) clamp(12px, 3vw, 26px)",
            minWidth: "clamp(68px, 14vw, 124px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 6px 28px rgba(107,61,79,0.08), inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: "2px",
              background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`,
              opacity: 0.55,
            }}
          />
          <Counter
            value={value}
            places={places}
            fontSize={digitFontSize}
            padding={4}
            gap={1}
            textColor={C.roseDeep}
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
              color: C.roseDeep,
              letterSpacing: "0.04em",
            }}
          />
        </div>
      </div>
      <span style={{
        fontFamily: '"Cinzel", serif',
        fontSize: "clamp(0.55rem, 1.4vw + 0.35rem, 0.72rem)",
        fontWeight: 600,
        letterSpacing: "clamp(0.22em, 0.30em, 0.32em)",
        textTransform: "uppercase",
        color: text.label,
        paddingRight: "0.30em",
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
  const middleName = parts[1] ?? ""

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
  const [digitFontSize, setDigitFontSize] = useState(30)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const updateDigitSize = () => {
      const w = window.innerWidth
      setDigitFontSize(w >= 1280 ? 42 : w >= 768 ? 36 : w >= 640 ? 32 : 28)
    }
    updateDigitSize()
    window.addEventListener("resize", updateDigitSize)
    return () => window.removeEventListener("resize", updateDigitSize)
  }, [])

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
    <section
      id="countdown"
      className="relative overflow-hidden bg-transparent py-12 sm:py-16 md:py-20 lg:py-24 px-3 sm:px-5 md:px-8 lg:px-10"
    >
      <ChristeningBackdrop sparklesVisible={mounted} />
      <CornerFloralDecor opacity={0.88} sizeClass="w-24 sm:w-36 md:w-48 lg:w-56 xl:w-64" />

      <div
        className="relative z-10 flex flex-col items-center text-center w-full mx-auto"
        style={countdownPanelStyle}
      >

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.85, ease: "easeOut" }}
          style={{ marginBottom: "clamp(0.8rem,2.5vw,1.4rem)" }}
        >
          <ChristeningCross gradientId="sectionCountdownCrossGold" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "clamp(6px, 2vw, 10px)", marginBottom: "clamp(0.7rem,2.2vw,1.1rem)", width: "100%" }}
        >
          <div style={{ width: "clamp(16px,4vw,28px)", height: "1px", background: roseLine("right", 0.48), flexShrink: 0 }} />
          <p style={countdownInviteStyle}>Save the Date</p>
          <div style={{ width: "clamp(16px,4vw,28px)", height: "1px", background: roseLine("left", 0.48), flexShrink: 0 }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.25 }}
        >
          <DiamondRule width={countdownRuleWidth} margin="0 auto clamp(0.8rem,2.5vw,1.2rem)" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}
          style={{ width: "100%" }}
        >
          <div className="animate-loader-name-glow" style={countdownGivenStyle}>
            {givenName.toUpperCase()}
          </div>
        </motion.div>

        {middleName && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.48, ease: "easeOut" }}
            style={{ width: "100%" }}
          >
            <div style={countdownScriptStyle}>{middleName}&apos;s</div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.60, ease: "easeOut" }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "clamp(6px,2vw,14px)", marginTop: "clamp(0.7rem,2.2vw,1.2rem)", width: "100%" }}
        >
          <FloralGarland />
          <div style={countdownSubtitleStyle}>Holy Baptism</div>
          <FloralGarland flip />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.70 }}
        >
          <DiamondRule width={countdownRuleWidth} margin="clamp(0.9rem,2.8vw,1.4rem) auto 0" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.78, ease: "easeOut" }}
          style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontWeight: 500,
            fontSize: "clamp(0.82rem, 1.6vw + 0.45rem, 1.02rem)",
            color: text.body,
            fontStyle: "italic",
            letterSpacing: "0.01em",
            lineHeight: 1.75,
            maxWidth: "clamp(16rem, 90%, 26rem)",
            marginBottom: "clamp(1.2rem,3.5vw,1.8rem)",
          }}
        >
          The blessed day is near — a sacred moment of grace, faith, and gratitude
        </motion.p>

        {/* Countdown panel — solid christening card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.85, ease: "easeOut" }}
          className="w-full isolate"
          style={{
            background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 50%, ${C.champagne} 100%)`,
            border: `1px solid ${C.blushDeep}`,
            borderRadius: "clamp(14px, 2vw, 18px)",
            padding: "clamp(1.4rem, 3.5vw, 2.25rem) clamp(0.9rem, 2.8vw, 1.75rem)",
            boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
            marginBottom: "clamp(1.4rem,4vw,2rem)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${C.blush} 0%, transparent 65%)`,
              opacity: 0.30,
            }}
          />
          <div
            className="pointer-events-none absolute inset-[1px] rounded-[inherit]"
            aria-hidden
            style={{ border: "1px solid rgba(201,168,108,0.18)" }}
          />

          <p style={{
            position: "relative",
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.68rem, 1.5vw + 0.4rem, 0.88rem)",
            fontWeight: 700,
            letterSpacing: "clamp(0.24em, 0.32em, 0.34em)",
            textTransform: "uppercase",
            color: text.label,
            marginBottom: "clamp(0.9rem,2.8vw,1.3rem)",
            paddingRight: "0.32em",
          }}>
            Counting Down
          </p>

          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <CountdownUnit value={timeLeft.days}    label="Days"    index={0} digitFontSize={digitFontSize} />
            <CountdownUnit value={timeLeft.hours}   label="Hours"   index={1} digitFontSize={digitFontSize} />
            <CountdownUnit value={timeLeft.minutes} label="Minutes" index={2} digitFontSize={digitFontSize} />
            <CountdownUnit value={timeLeft.seconds} label="Seconds" index={3} digitFontSize={digitFontSize} />
          </div>
        </motion.div>

        {/* Date display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, delay: 0.95, ease: "easeOut" }}
          className="w-full flex flex-col items-center"
          style={{ paddingBottom: "clamp(1rem,3vw,1.5rem)" }}
        >
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.58rem, 1.4vw + 0.35rem, 0.78rem)",
            fontWeight: 700,
            letterSpacing: "clamp(0.32em, 0.40em, 0.42em)",
            textTransform: "uppercase",
            color: C.goldDeep,
            paddingRight: "0.40em",
            marginBottom: "clamp(0.4rem,1.2vw,0.6rem)",
          }}>
            {ceremonyMonth}
          </p>

          <div className="flex w-full items-center gap-2 sm:gap-3 md:gap-4">
            <div className="flex flex-1 items-center justify-end gap-2 min-w-0">
              <div className="h-px flex-1" style={{ background: roseLine("left", 0.45) }} />
              <span style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.55rem, 1.3vw + 0.35rem, 0.72rem)",
                fontWeight: 600,
                letterSpacing: "clamp(0.20em, 0.26em, 0.28em)",
                textTransform: "uppercase",
                color: text.label,
                flexShrink: 0,
              }}>
                {ceremonyDayShort}
              </span>
            </div>

            <motion.span
              animate={{
                textShadow: [
                  "0 4px 24px rgba(201,168,108,0.12)",
                  "0 6px 36px rgba(201,168,108,0.28)",
                  "0 4px 24px rgba(201,168,108,0.12)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                fontSize: "clamp(3rem, 10vw + 0.5rem, 5.75rem)",
                color: C.roseDeep,
                lineHeight: 0.9,
                letterSpacing: "-0.01em",
                flexShrink: 0,
              }}
            >
              {ceremonyDayNumber.padStart(2, "0")}
            </motion.span>

            <div className="flex flex-1 items-center gap-2 min-w-0">
              <span style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.55rem, 1.2vw + 0.35rem, 0.72rem)",
                fontWeight: 600,
                letterSpacing: "clamp(0.16em, 0.22em, 0.24em)",
                textTransform: "uppercase",
                color: text.label,
                flexShrink: 0,
                textAlign: "left",
              }}>
                {ceremonyTimeDisplay.split(",")[0]}
              </span>
              <div className="h-px flex-1" style={{ background: roseLine("right", 0.45) }} />
            </div>
          </div>

          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.58rem, 1.4vw + 0.35rem, 0.78rem)",
            fontWeight: 700,
            letterSpacing: "clamp(0.32em, 0.40em, 0.42em)",
            textTransform: "uppercase",
            color: C.goldDeep,
            paddingRight: "0.40em",
            marginTop: "clamp(0.4rem,1.2vw,0.6rem)",
            marginBottom: "clamp(0.8rem,2.5vw,1.2rem)",
          }}>
            {ceremonyYear}
          </p>

          <DiamondRule width={countdownRuleWidth} />

          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontWeight: 500,
            fontSize: "clamp(0.72rem, 1.5vw + 0.4rem, 0.95rem)",
            color: text.body,
            letterSpacing: "0.01em",
            lineHeight: 1.65,
            textAlign: "center",
            maxWidth: "clamp(16rem, 90%, 26rem)",
            marginTop: "clamp(0.9rem,2.8vw,1.3rem)",
          }}>
            {siteConfig.ceremony.location}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
