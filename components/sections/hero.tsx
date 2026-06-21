"use client"

import { useEffect, useState } from "react"
import { motion } from "motion/react"
import { siteConfig } from "@/content/site"
import { C, contentPanel, nameStyles, roseLine, text } from "@/components/loader/christening-theme"
import {
  ChristeningBackdrop,
  ChristeningCross,
  CornerFloralDecor,
  DiamondRule,
  FloralGarland,
} from "@/components/loader/ChristeningDecor"

const TAGLINE = "A Little Piece of Heaven"

const heroPanelStyle: React.CSSProperties = {
  ...contentPanel,
  width: "100%",
  maxWidth: "clamp(18rem, 92vw, 42rem)",
  marginInline: "auto",
  padding: "clamp(1.5rem, 4.5vw, 3.25rem) clamp(1.25rem, 4vw, 3rem)",
}

const heroGivenStyle: React.CSSProperties = {
  ...nameStyles.given,
  fontSize: "clamp(2.65rem, 9vw + 0.5rem, 5rem)",
  letterSpacing: "clamp(0.06em, 0.12vw + 0.06em, 0.14em)",
}

const heroScriptStyle: React.CSSProperties = {
  ...nameStyles.script,
  fontSize: "clamp(2.1rem, 7vw + 0.4rem, 4.25rem)",
}

const heroSubtitleStyle: React.CSSProperties = {
  ...nameStyles.subtitle,
  fontSize: "clamp(0.95rem, 2.2vw + 0.5rem, 1.75rem)",
}

const heroInviteStyle: React.CSSProperties = {
  ...nameStyles.invite,
  fontSize: "clamp(0.62rem, 1.8vw + 0.35rem, 0.88rem)",
  letterSpacing: "clamp(0.22em, 0.32em, 0.36em)",
}

const heroRuleWidth = "min(100%, clamp(11rem, 72%, 22rem))"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const parts      = siteConfig.couple.child.trim().split(" ")
  const givenName  = parts[0]
  const middleName = parts[1] ?? ""

  const { ceremony } = siteConfig
  const eventDate  = `${ceremony.date}  |  ${ceremony.time}`
  const eventVenue = ceremony.venue

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] min-h-screen flex items-center justify-center overflow-hidden px-3 sm:px-5 md:px-8 lg:px-10 py-8 sm:py-12 md:py-16"
      style={{ backgroundColor: C.ivory }}
    >
      <ChristeningBackdrop sparklesVisible={mounted} />
      <CornerFloralDecor priority opacity={0.88} sizeClass="w-24 sm:w-36 md:w-48 lg:w-56 xl:w-64" />

      <div
        className="relative z-10 flex flex-col items-center text-center w-full mx-auto"
        style={heroPanelStyle}
      >

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.85, ease: "easeOut" }}
          style={{ marginBottom: "clamp(0.8rem,2.5vw,1.4rem)" }}
        >
          <ChristeningCross gradientId="sectionHeroCrossGold" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "clamp(6px, 2vw, 10px)", marginBottom: "clamp(0.7rem,2.2vw,1.1rem)", width: "100%" }}
        >
          <div style={{ width: "clamp(16px,4vw,28px)", height: "1px", background: roseLine("right", 0.48), flexShrink: 0 }} />
          <p style={heroInviteStyle}>You are invited to</p>
          <div style={{ width: "clamp(16px,4vw,28px)", height: "1px", background: roseLine("left", 0.48), flexShrink: 0 }} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ duration: 0.7, delay: 0.25 }}>
          <DiamondRule width={heroRuleWidth} margin="0 auto clamp(0.8rem,2.5vw,1.2rem)" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }} style={{ width: "100%" }}>
          <div className="animate-loader-name-glow" style={heroGivenStyle}>
            {givenName.toUpperCase()}
          </div>
        </motion.div>

        {middleName && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.48, ease: "easeOut" }} style={{ width: "100%" }}>
            <div style={heroScriptStyle}>{middleName}&apos;s</div>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 10 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.60, ease: "easeOut" }} style={{ width: "100%" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "clamp(6px,2vw,14px)", marginTop: "clamp(0.7rem,2.2vw,1.2rem)" }}>
            <FloralGarland />
            <div style={heroSubtitleStyle}>Holy Baptism</div>
            <FloralGarland flip />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ duration: 0.7, delay: 0.70 }}>
          <DiamondRule width={heroRuleWidth} margin="clamp(0.9rem,2.8vw,1.4rem) auto 0" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.78, ease: "easeOut" }}
          style={{
            marginTop: "clamp(0.4rem,1.5vw,0.8rem)",
            fontFamily: '"Cinzel", serif',
            fontStyle: "italic",
            fontSize: "clamp(0.78rem, 1.6vw + 0.45rem, 1.05rem)",
            color: text.caption,
            letterSpacing: "0.04em",
            maxWidth: "clamp(16rem, 90%, 26rem)",
          }}
        >
          {TAGLINE}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.86, ease: "easeOut" }}
          style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 600,
            fontSize: "clamp(0.78rem, 1.8vw + 0.4rem, 1.08rem)",
            color: C.roseDeep,
            letterSpacing: "0.08em",
            marginTop: "clamp(0.8rem,2.5vw,1.2rem)",
            marginBottom: "0.35rem",
          }}
        >
          {eventDate}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.92, ease: "easeOut" }}
          style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontWeight: 500,
            fontSize: "clamp(0.72rem, 1.5vw + 0.4rem, 0.95rem)",
            color: text.body,
            letterSpacing: "0.01em",
            lineHeight: 1.65,
            textAlign: "center",
            maxWidth: "clamp(16rem, 90%, 26rem)",
          }}
        >
          {eventVenue}
        </motion.p>

        <motion.div
          className="flex flex-col items-center w-full"
          style={{ marginTop: "clamp(1.8rem,5.5vw,3rem)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 1.0, ease: "easeOut" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", width: "min(100%, clamp(100px, 40%, 180px))" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, rgba(196,160,168,0.50), transparent)" }} />
            <div className="animate-pearl-pulse" style={{
              width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
              background: `radial-gradient(circle at 35% 35%, ${C.pearl}, ${C.goldLight})`,
              border: "1px solid rgba(201,168,108,0.35)",
            }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(196,160,168,0.50), transparent)" }} />
          </div>
          <a
            href="#details"
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 500,
              color: C.goldDeep,
              fontSize: "clamp(0.60rem, 1.4vw + 0.35rem, 0.82rem)",
              letterSpacing: "clamp(0.38em, 0.50em, 0.50em)",
              textTransform: "uppercase",
              textDecoration: "none",
              display: "block",
              lineHeight: 1,
              paddingRight: "0.50em",
            }}
          >
            Join Us
          </a>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ marginTop: "0.6rem" }}
            aria-hidden
          >
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
              <path d="M1 1L8 8.5L15 1" stroke="rgba(196,160,168,0.70)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
