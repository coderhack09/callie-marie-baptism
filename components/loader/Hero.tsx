"use client"

import React from "react"
import { siteConfig } from "@/content/site"
import { FadeIn } from "./FadeIn"

interface HeroProps {
  onOpen: () => void
  visible: boolean
}

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {
  const parts      = siteConfig.couple.child.trim().split(" ")
  const givenName  = parts[0]       // Kaezar
  const middleName = parts[1] ?? "" // Isaiahnuel

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        visible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >


      {/* ── Center spotlight — lifts content off background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 72% 65% at 50% 48%, rgba(255,255,255,0.68) 0%, transparent 72%)",
        }}
      />


      {/* ── Baptismal water wash — bottom ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 0, left: 0, right: 0, height: "36%",
          background: "linear-gradient(0deg, rgba(120,175,215,0.20) 0%, rgba(140,185,220,0.10) 40%, transparent 100%)",
        }}
      />

      {/* ── Small scattered sparkle dots ── */}
      {[
        { top: "14%", left: "8%",  size: 3, op: 0.45, delay: "1.2s" },
        { top: "22%", left: "14%", size: 2, op: 0.30, delay: "1.5s" },
        { top: "10%", right: "28%",size: 2.5, op: 0.38, delay: "1.8s" },
        { top: "35%", left: "5%",  size: 2, op: 0.28, delay: "2.0s" },
        { top: "18%", right: "15%",size: 3, op: 0.40, delay: "1.4s" },
        { top: "62%", right: "7%", size: 2.5, op: 0.32, delay: "2.2s" },
        { top: "70%", left: "10%", size: 2, op: 0.28, delay: "1.9s" },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none rounded-full"
          style={{
            ...{ top: s.top, left: (s as Record<string,unknown>).left as string | undefined, right: (s as Record<string,unknown>).right as string | undefined },
            width:  `${s.size}px`,
            height: `${s.size}px`,
            background: "rgba(196,152,88,1)",
            opacity: visible ? s.op : 0,
            transition: `opacity 1s ease-out ${s.delay}`,
          }}
          aria-hidden
        />
      ))}

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto px-6 min-h-screen">

        {/* Cross — with golden halo + 20-pt rays */}
        <FadeIn show={visible} delay={80}>
          <div style={{ position: "relative", marginBottom: "clamp(1rem,3vw,1.6rem)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            {/* Soft halo glow */}
            <div
              className="absolute animate-loader-glow"
              style={{
                inset: "-8px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(196,152,88,0.18) 0%, rgba(220,175,100,0.08) 55%, transparent 80%)",
                filter: "blur(6px)",
              }}
            />
            <svg viewBox="0 0 110 115" style={{ width: "clamp(66px,16vw,90px)", position: "relative" }} fill="none">
              {/* Halo circle */}
              <circle cx="55" cy="56" r="22" stroke="rgba(196,152,88,0.20)" strokeWidth="0.8" fill="rgba(196,152,88,0.05)" />
              {/* 20 radiant rays */}
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
              {/* Cross bars */}
              <rect x="49" y="18" width="12" height="74" rx="5" fill="url(#crossGold)" />
              <rect x="22" y="38" width="66" height="12" rx="5" fill="url(#crossGold)" />
              {/* Highlight */}
              <rect x="52" y="18" width="5" height="74" rx="2.5" fill="rgba(255,242,200,0.28)" />
              <defs>
                <linearGradient id="crossGold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#D4A860" />
                  <stop offset="50%"  stopColor="#C4965A" />
                  <stop offset="100%" stopColor="#A87840" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </FadeIn>

        {/* "You are invited to" */}
        <FadeIn show={visible} delay={200}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(0.8rem,2.5vw,1.2rem)" }}>
            <div style={{ width: "clamp(16px,4vw,24px)", height: "1px", background: "linear-gradient(to right, transparent, rgba(80,120,155,0.40))" }} />
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.60rem, 2.2vw, 0.74rem)",
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: "rgba(72,112,148,0.88)",
              margin: 0,
            }}>
              You are invited to
            </p>
            <div style={{ width: "clamp(16px,4vw,24px)", height: "1px", background: "linear-gradient(to left, transparent, rgba(80,120,155,0.40))" }} />
          </div>
        </FadeIn>

        {/* Diamond rule */}
        <FadeIn show={visible} delay={280}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "clamp(180px,60vw,280px)", marginBottom: "clamp(0.9rem,2.8vw,1.4rem)" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,152,88,0.45))" }} />
            <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)" }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,152,88,0.45))" }} />
          </div>
        </FadeIn>

        {/* KAEZAR — bold hero */}
        <FadeIn show={visible} delay={370}>
          <div
            style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              fontSize: "clamp(3.4rem, 14.5vw, 7.5rem)",
              color: "#2B4A6B",
              lineHeight: 1.0,
              letterSpacing: "0.14em",
              textShadow: "0 2px 20px rgba(43,74,107,0.14), 0 4px 40px rgba(43,74,107,0.06)",
            }}
          >
            {givenName.toUpperCase()}
          </div>
        </FadeIn>

        {/* Isaiahnuel's — script gold */}
        <FadeIn show={visible} delay={490}>
          <div
            style={{
              fontFamily: '"LeJourScript", cursive',
              fontSize: "clamp(2.4rem, 9.5vw, 5rem)",
              color: "#C4965A",
              lineHeight: 1.08,
              letterSpacing: "0.02em",
              marginTop: "clamp(0.2rem,0.8vw,0.5rem)",
              filter: "drop-shadow(0 2px 6px rgba(196,152,88,0.16))",
            }}
          >
            {middleName}&apos;s
          </div>
        </FadeIn>

        {/* ✦ Holy Baptism ✦ with olive branches */}
        <FadeIn show={visible} delay={610}>
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px,2vw,12px)", marginTop: "clamp(0.8rem,2.5vw,1.3rem)" }}>
            {/* Left olive branch */}
            <svg viewBox="0 0 58 24" style={{ width: "clamp(34px,9vw,56px)" }} fill="none">
              <line x1="2" y1="12" x2="54" y2="12" stroke="rgba(108,128,94,0.38)" strokeWidth="0.8" />
              <ellipse cx="11" cy="7"  rx="7.5" ry="4.2" fill="rgba(108,128,94,0.52)" transform="rotate(-22 11 7)"  />
              <ellipse cx="23" cy="9"  rx="6.5" ry="3.8" fill="rgba(108,128,94,0.42)" transform="rotate(-14 23 9)"  />
              <ellipse cx="35" cy="10" rx="5.5" ry="3.2" fill="rgba(108,128,94,0.34)" transform="rotate(-7 35 10)"  />
              <ellipse cx="47" cy="11" rx="4.5" ry="2.6" fill="rgba(108,128,94,0.24)" transform="rotate(-2 47 11)"  />
              <ellipse cx="14" cy="17" rx="6" ry="3.5" fill="rgba(108,128,94,0.38)" transform="rotate(18 14 17)" />
              <ellipse cx="28" cy="16" rx="5" ry="3"   fill="rgba(108,128,94,0.28)" transform="rotate(10 28 16)" />
            </svg>

            <div
              style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                fontSize: "clamp(1.0rem, 3.8vw, 1.9rem)",
                color: "#1C3050",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                textShadow: "0 1px 8px rgba(28,48,80,0.10)",
              }}
            >
              Holy Baptism
            </div>

            {/* Right olive branch (mirrored) */}
            <svg viewBox="0 0 58 24" style={{ width: "clamp(34px,9vw,56px)", transform: "scaleX(-1)" }} fill="none">
              <line x1="2" y1="12" x2="54" y2="12" stroke="rgba(108,128,94,0.38)" strokeWidth="0.8" />
              <ellipse cx="11" cy="7"  rx="7.5" ry="4.2" fill="rgba(108,128,94,0.52)" transform="rotate(-22 11 7)"  />
              <ellipse cx="23" cy="9"  rx="6.5" ry="3.8" fill="rgba(108,128,94,0.42)" transform="rotate(-14 23 9)"  />
              <ellipse cx="35" cy="10" rx="5.5" ry="3.2" fill="rgba(108,128,94,0.34)" transform="rotate(-7 35 10)"  />
              <ellipse cx="47" cy="11" rx="4.5" ry="2.6" fill="rgba(108,128,94,0.24)" transform="rotate(-2 47 11)"  />
              <ellipse cx="14" cy="17" rx="6" ry="3.5" fill="rgba(108,128,94,0.38)" transform="rotate(18 14 17)" />
              <ellipse cx="28" cy="16" rx="5" ry="3"   fill="rgba(108,128,94,0.28)" transform="rotate(10 28 16)" />
            </svg>
          </div>
        </FadeIn>

        {/* Diamond rule */}
        <FadeIn show={visible} delay={700}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", width: "clamp(180px,60vw,280px)", margin: "clamp(1.1rem,3.2vw,1.6rem) 0" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,152,88,0.42))" }} />
            <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.60)" }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,152,88,0.42))" }} />
          </div>
        </FadeIn>

        {/* Son of + parents — soft subtitle */}
        <FadeIn show={visible} delay={780}>
          <div style={{ marginBottom: "clamp(1.3rem,3.8vw,2rem)" }}>
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.52rem,1.8vw,0.62rem)",
              letterSpacing: "0.40em",
              textTransform: "uppercase",
              color: "rgba(72,112,148,0.68)",
              marginBottom: "4px",
            }}>
              Son of
            </p>
            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontWeight: 400,
              fontSize: "clamp(0.80rem,2.8vw,1.0rem)",
              color: "rgba(65,90,115,0.82)",
              letterSpacing: "0.03em",
              lineHeight: 1.6,
            }}>
              {siteConfig.couple.parents}
            </p>
          </div>
        </FadeIn>

        {/* Open Invitation button — premium style */}
        <FadeIn show={visible} delay={920}>
          <div style={{ height: "clamp(1.2rem,3.5vw,2rem)" }} />
          <button
            onClick={onOpen}
            className="group relative overflow-hidden"
            style={{
              padding: "clamp(12px,3vw,16px) clamp(32px,10vw,52px)",
              background: "rgba(255,255,255,0.30)",
              border: "1.5px solid rgba(43,74,107,0.38)",
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.45s ease",
              boxShadow: "0 4px 24px rgba(43,74,107,0.10), 0 1px 0 rgba(255,255,255,0.60) inset",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(43,74,107,0.08)"
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(43,74,107,0.60)"
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(43,74,107,0.16), 0 1px 0 rgba(255,255,255,0.60) inset"
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.30)"
              ;(e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(43,74,107,0.38)"
              ;(e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(43,74,107,0.10), 0 1px 0 rgba(255,255,255,0.60) inset"
            }}
          >
            {/* Gold bottom accent line */}
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: "2px", background: "linear-gradient(to right, transparent, rgba(196,152,88,0.50), transparent)" }}
            />
            <span
              style={{
                position: "relative",
                fontFamily: '"Cinzel", serif',
                fontWeight: 500,
                fontSize: "clamp(0.64rem, 2.2vw, 0.78rem)",
                letterSpacing: "0.34em",
                textTransform: "uppercase",
                color: "#2B4A6B",
              }}
            >
              Open Invitation
            </span>
          </button>
        </FadeIn>

      </div>
    </div>
  )
}
