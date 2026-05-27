"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { siteConfig } from "@/content/site"

const EVENT_DATE  = "July 4, 2026  |  10:00 AM"
const EVENT_VENUE = "Cathedral of Our Lady of Arabia, Awali, Kingdom of Bahrain"
const TAGLINE     = "A Little Piece of Heaven"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const parts      = siteConfig.couple.child.trim().split(" ")
  const givenName  = parts[0]
  const middleName = parts.length > 2 ? parts[1] : ""

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* ── Center spotlight — matching Hero ── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 72% 65% at 50% 48%, rgba(255,255,255,0.68) 0%, transparent 72%)",
      }} />

      {/* ── Baptismal water wash — bottom ── */}
      <div className="absolute pointer-events-none" style={{
        bottom: 0, left: 0, right: 0, height: "36%",
        background: "linear-gradient(0deg, rgba(120,175,215,0.20) 0%, rgba(140,185,220,0.10) 40%, transparent 100%)",
      }} />

      {/* ── Gold sparkle dots ── */}
      {([
        { top: "12%", left: "7%",   size: 3,   op: 0.40 },
        { top: "20%", left: "15%",  size: 2,   op: 0.28 },
        { top: "8%",  right: "26%", size: 2.5, op: 0.35 },
        { top: "32%", left: "4%",   size: 2,   op: 0.25 },
        { top: "16%", right: "14%", size: 3,   op: 0.38 },
        { top: "65%", right: "6%",  size: 2.5, op: 0.30 },
        { top: "72%", left: "9%",   size: 2,   op: 0.26 },
      ] as Array<{ top: string; left?: string; right?: string; size: number; op: number }>)
        .map((s, i) => (
          <div key={i} className="absolute pointer-events-none rounded-full" style={{
            top: s.top, left: s.left, right: s.right,
            width: `${s.size}px`, height: `${s.size}px`,
            background: "rgba(196,152,88,1)",
            opacity: mounted ? s.op : 0,
            transition: `opacity 1.2s ease-out ${0.8 + i * 0.15}s`,
          }} aria-hidden />
        ))}

      {/* ── Corner floral decorations (kept) ── */}
      <Image src="/decoration/left-top-removebg-preview.png"   alt="" width={280} height={280} className="absolute top-0 left-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60" aria-hidden priority />
      <Image src="/decoration/right-top-removebg-preview.png"  alt="" width={280} height={280} className="absolute top-0 right-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60" aria-hidden priority />
      <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={280} height={280} className="absolute bottom-0 left-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60" aria-hidden />
      <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={280} height={280} className="absolute bottom-0 right-0 pointer-events-none select-none w-28 sm:w-40 md:w-52 lg:w-60" aria-hidden />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-sm mx-auto px-6 py-20 sm:py-24">

        {/* Cross with halo + rays — matching loader/Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={mounted ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.85, ease: "easeOut" }}
          style={{ position: "relative", marginBottom: "clamp(0.8rem,2.5vw,1.4rem)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
          <div className="absolute animate-loader-glow" style={{
            inset: "-8px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(196,152,88,0.18) 0%, rgba(220,175,100,0.08) 55%, transparent 80%)",
            filter: "blur(6px)",
          }} />
          <svg viewBox="0 0 110 115" style={{ width: "clamp(58px,14vw,80px)", position: "relative" }} fill="none">
            <circle cx="55" cy="56" r="22" stroke="rgba(196,152,88,0.20)" strokeWidth="0.8" fill="rgba(196,152,88,0.05)" />
            {Array.from({ length: 20 }, (_, i) => {
              const deg = (i * 360) / 20
              const long = i % 2 === 0
              const rad = (deg * Math.PI) / 180
              return (
                <line key={i}
                  x1={55 + Math.sin(rad) * (long ? 24 : 19)} y1={56 - Math.cos(rad) * (long ? 24 : 19)}
                  x2={55 + Math.sin(rad) * (long ? 42 : 33)} y2={56 - Math.cos(rad) * (long ? 42 : 33)}
                  stroke={`rgba(196,152,88,${long ? 0.58 : 0.25})`}
                  strokeWidth={long ? "1.5" : "0.8"} strokeLinecap="round"
                />
              )
            })}
            <rect x="49" y="18" width="12" height="74" rx="5" fill="url(#crossGoldHero)" />
            <rect x="22" y="38" width="66" height="12" rx="5" fill="url(#crossGoldHero)" />
            <rect x="52" y="18" width="5" height="74" rx="2.5" fill="rgba(255,242,200,0.28)" />
            <defs>
              <linearGradient id="crossGoldHero" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#D4A860" />
                <stop offset="50%"  stopColor="#C4965A" />
                <stop offset="100%" stopColor="#A87840" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* "You are invited to" — Cinzel with hairlines */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(0.8rem,2.5vw,1.2rem)" }}
        >
          <div style={{ width: "clamp(16px,4vw,24px)", height: "1px", background: "linear-gradient(to right, transparent, rgba(80,120,155,0.40))" }} />
          <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.58rem,2vw,0.72rem)", letterSpacing: "0.36em", textTransform: "uppercase", color: "rgba(72,112,148,0.88)", margin: 0 }}>
            You are invited to
          </p>
          <div style={{ width: "clamp(16px,4vw,24px)", height: "1px", background: "linear-gradient(to left, transparent, rgba(80,120,155,0.40))" }} />
        </motion.div>

        {/* Diamond rule */}
        <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ duration: 0.7, delay: 0.25 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "clamp(180px,60vw,280px)", marginBottom: "clamp(0.9rem,2.8vw,1.4rem)" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,152,88,0.45))" }} />
            <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)" }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,152,88,0.45))" }} />
          </div>
        </motion.div>

        {/* KAEZAR — Cinzel Bold navy */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, delay: 0.35, ease: "easeOut" }}>
          <div style={{
            fontFamily: '"Cinzel", serif', fontWeight: 700,
            fontSize: "clamp(3.4rem, 14.5vw, 7.5rem)",
            color: "#2B4A6B", lineHeight: 1.0, letterSpacing: "0.14em",
            textShadow: "0 2px 20px rgba(43,74,107,0.14), 0 4px 40px rgba(43,74,107,0.06)",
          }}>
            {givenName.toUpperCase()}
          </div>
        </motion.div>

        {/* Isaiahnuel's — LeJourScript gold */}
        {middleName && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.48, ease: "easeOut" }}>
            <div style={{
              fontFamily: '"LeJourScript", cursive',
              fontSize: "clamp(2.4rem, 9.5vw, 5rem)",
              color: "#C4965A", lineHeight: 1.08, letterSpacing: "0.02em",
              marginTop: "clamp(0.2rem,0.8vw,0.5rem)",
              filter: "drop-shadow(0 2px 6px rgba(196,152,88,0.16))",
            }}>
              {middleName}&apos;s
            </div>
          </motion.div>
        )}

        {/* Galardo */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.85, delay: 0.48, ease: "easeOut" }}>
          <div style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(1.4rem, 5.5vw, 3rem)",
            color: "#C4965A", lineHeight: 1.08, letterSpacing: "0.02em",
            marginTop: "clamp(0.2rem,0.8vw,0.5rem)",
            filter: "drop-shadow(0 2px 6px rgba(196,152,88,0.16))",
          }}>
            Galardo
          </div>
        </motion.div>

        {/* ✦ Holy Baptism ✦ with olive branches */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.60, ease: "easeOut" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px,2vw,12px)", marginTop: "clamp(0.8rem,2.5vw,1.3rem)" }}>
            <svg viewBox="0 0 58 24" style={{ width: "clamp(34px,9vw,56px)" }} fill="none">
              <line x1="2" y1="12" x2="54" y2="12" stroke="rgba(108,128,94,0.38)" strokeWidth="0.8" />
              <ellipse cx="11" cy="7"  rx="7.5" ry="4.2" fill="rgba(108,128,94,0.52)" transform="rotate(-22 11 7)"  />
              <ellipse cx="23" cy="9"  rx="6.5" ry="3.8" fill="rgba(108,128,94,0.42)" transform="rotate(-14 23 9)"  />
              <ellipse cx="35" cy="10" rx="5.5" ry="3.2" fill="rgba(108,128,94,0.34)" transform="rotate(-7 35 10)"  />
              <ellipse cx="47" cy="11" rx="4.5" ry="2.6" fill="rgba(108,128,94,0.24)" transform="rotate(-2 47 11)"  />
              <ellipse cx="14" cy="17" rx="6"   ry="3.5" fill="rgba(108,128,94,0.38)" transform="rotate(18 14 17)" />
              <ellipse cx="28" cy="16" rx="5"   ry="3"   fill="rgba(108,128,94,0.28)" transform="rotate(10 28 16)" />
            </svg>
            <div style={{
              fontFamily: '"Cinzel", serif', fontWeight: 700,
              fontSize: "clamp(1.0rem,3.8vw,1.9rem)",
              color: "#1C3050", letterSpacing: "0.15em", textTransform: "uppercase",
              whiteSpace: "nowrap", textShadow: "0 1px 8px rgba(28,48,80,0.10)",
            }}>
              Holy Baptism
            </div>
            <svg viewBox="0 0 58 24" style={{ width: "clamp(34px,9vw,56px)", transform: "scaleX(-1)" }} fill="none">
              <line x1="2" y1="12" x2="54" y2="12" stroke="rgba(108,128,94,0.38)" strokeWidth="0.8" />
              <ellipse cx="11" cy="7"  rx="7.5" ry="4.2" fill="rgba(108,128,94,0.52)" transform="rotate(-22 11 7)"  />
              <ellipse cx="23" cy="9"  rx="6.5" ry="3.8" fill="rgba(108,128,94,0.42)" transform="rotate(-14 23 9)"  />
              <ellipse cx="35" cy="10" rx="5.5" ry="3.2" fill="rgba(108,128,94,0.34)" transform="rotate(-7 35 10)"  />
              <ellipse cx="47" cy="11" rx="4.5" ry="2.6" fill="rgba(108,128,94,0.24)" transform="rotate(-2 47 11)"  />
              <ellipse cx="14" cy="17" rx="6"   ry="3.5" fill="rgba(108,128,94,0.38)" transform="rotate(18 14 17)" />
              <ellipse cx="28" cy="16" rx="5"   ry="3"   fill="rgba(108,128,94,0.28)" transform="rotate(10 28 16)" />
            </svg>
          </div>
        </motion.div>

        {/* Diamond rule */}
        <motion.div initial={{ opacity: 0 }} animate={mounted ? { opacity: 1 } : {}} transition={{ duration: 0.7, delay: 0.70 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "clamp(180px,60vw,280px)", margin: "clamp(1rem,3vw,1.5rem) 0" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,152,88,0.42))" }} />
            <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.60)" }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,152,88,0.42))" }} />
          </div>
        </motion.div>

        {/* Son of + parents */}
        {/* <motion.div initial={{ opacity: 0, y: 8 }} animate={mounted ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.78, ease: "easeOut" }}>
          <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.52rem,1.8vw,0.62rem)", letterSpacing: "0.40em", textTransform: "uppercase", color: "rgba(72,112,148,0.68)", marginBottom: "4px" }}>
            Son of
          </p>
          <p style={{ fontFamily: '"Fahkwang", sans-serif', fontWeight: 400, fontSize: "clamp(0.80rem,2.8vw,1.0rem)", color: "rgba(65,90,115,0.82)", letterSpacing: "0.03em", lineHeight: 1.6 }}>
            {siteConfig.couple.parents}
          </p>
        </motion.div> */}

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.86, ease: "easeOut" }}
          style={{
            marginTop: "clamp(1rem,3vw,1.6rem)",
            fontFamily: '"Cinzel", serif', fontStyle: "italic",
            fontSize: "clamp(0.70rem,2.6vw,0.90rem)",
            color: "rgba(43,74,107,0.55)", letterSpacing: "0.06em",
            marginBottom: "0.5rem",
          }}
        >
        
        </motion.p>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.92, ease: "easeOut" }}
          style={{
            fontFamily: '"Cinzel", serif', fontWeight: 600,
            fontSize: "clamp(0.78rem,3vw,1.0rem)",
            color: "#2B4A6B", letterSpacing: "0.08em",
            marginBottom: "0.35rem",
          }}
        >
          {EVENT_DATE}
        </motion.p>

        {/* Venue */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.98, ease: "easeOut" }}
          style={{
            fontFamily: '"Fahkwang", sans-serif', fontWeight: 400,
            fontSize: "clamp(0.58rem,2.2vw,0.74rem)",
            color: "rgba(65,90,115,0.72)", letterSpacing: "0.02em",
            textAlign: "center", maxWidth: "280px",
          }}
        >
          {EVENT_VENUE}
        </motion.p>

        {/* ── CTA — "Join Us" ── */}
        <motion.div
          className="flex flex-col items-center"
          style={{ marginTop: "clamp(1.8rem,5.5vw,3rem)" }}
          initial={{ opacity: 0, y: 14 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, delay: 1.06, ease: "easeOut" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", width: "clamp(100px,26vw,160px)" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, rgba(196,152,88,0.50), transparent)" }} />
            <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "rgba(196,152,88,0.60)", flexShrink: 0 }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(196,152,88,0.50), transparent)" }} />
          </div>
          <a
            href="#details"
            style={{
              fontFamily: '"Cinzel", serif', fontWeight: 500,
              color: "#C4965A",
              fontSize: "clamp(0.60rem,2.2vw,0.78rem)",
              letterSpacing: "0.50em", textTransform: "uppercase",
              textDecoration: "none", display: "block", lineHeight: 1,
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
              <path d="M1 1L8 8.5L15 1" stroke="rgba(196,152,88,0.65)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}
