"use client"

import React from "react"
import { siteConfig } from "@/content/site"
import { FadeIn } from "./FadeIn"
import { C, nameStyles, roseLine } from "./christening-theme"
import {
  ChristeningBackdrop,
  ChristeningCross,
  DiamondRule,
  FloralGarland,
} from "./ChristeningDecor"

interface HeroProps {
  onOpen: () => void
  visible: boolean
}

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {
  const parts      = siteConfig.couple.child.trim().split(" ")
  const givenName  = parts[0]
  const middleName = parts[1] ?? ""

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-all duration-1000 ${
        visible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
      style={{ backgroundColor: C.ivory }}
    >
      <ChristeningBackdrop sparklesVisible={visible} />

      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto px-6 min-h-screen">

        <FadeIn show={visible} delay={80}>
          <div style={{ marginBottom: "clamp(0.8rem,2.5vw,1.4rem)" }}>
            <ChristeningCross gradientId="heroCrossGold" />
          </div>
        </FadeIn>

        <FadeIn show={visible} delay={200}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "clamp(0.7rem,2.2vw,1.1rem)" }}>
            <div style={{ width: "clamp(16px,4vw,24px)", height: "1px", background: roseLine("right", 0.48) }} />
            <p style={nameStyles.invite}>You are invited to</p>
            <div style={{ width: "clamp(16px,4vw,24px)", height: "1px", background: roseLine("left", 0.48) }} />
          </div>
        </FadeIn>

        <FadeIn show={visible} delay={280}>
          <DiamondRule margin="0 0 clamp(0.8rem,2.5vw,1.2rem) 0" />
        </FadeIn>

        <FadeIn show={visible} delay={370}>
          <div className="animate-loader-name-glow" style={nameStyles.given}>
            {givenName.toUpperCase()}
          </div>
        </FadeIn>

        {middleName && (
          <FadeIn show={visible} delay={490}>
            <div style={nameStyles.script}>{middleName}&apos;s</div>
          </FadeIn>
        )}

        <FadeIn show={visible} delay={610}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(6px,2vw,12px)", marginTop: "clamp(0.7rem,2.2vw,1.2rem)" }}>
            <FloralGarland />
            <div style={nameStyles.subtitle}>Holy Baptism</div>
            <FloralGarland flip />
          </div>
        </FadeIn>

        <FadeIn show={visible} delay={700}>
          <DiamondRule margin="clamp(0.9rem,2.8vw,1.4rem) 0" />
        </FadeIn>

        <FadeIn show={visible} delay={780}>
          <div style={{ marginBottom: "clamp(1.1rem,3.2vw,1.6rem)" }}>
            <p style={nameStyles.parentLabel}>Daughter of</p>
            <p style={nameStyles.parentNames}>{siteConfig.couple.parents}</p>
          </div>
        </FadeIn>

        <FadeIn show={visible} delay={920}>
          <button
            onClick={onOpen}
            className="group relative overflow-hidden"
            style={{
              padding: "clamp(13px,3.2vw,17px) clamp(32px,10vw,52px)",
              background: `linear-gradient(180deg, rgba(255,253,249,0.92) 0%, rgba(245,221,224,0.45) 100%)`,
              border: `1.5px solid rgba(125,74,90,0.30)`,
              borderRadius: "2px",
              cursor: "pointer",
              transition: "all 0.45s ease",
              boxShadow: "0 6px 28px rgba(107,61,79,0.10), 0 1px 0 rgba(255,255,255,0.75) inset",
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget as HTMLButtonElement
              btn.style.background = "rgba(245,221,224,0.65)"
              btn.style.borderColor = "rgba(125,74,90,0.48)"
              btn.style.boxShadow = "0 10px 36px rgba(107,61,79,0.14), 0 1px 0 rgba(255,255,255,0.75) inset"
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget as HTMLButtonElement
              btn.style.background = "linear-gradient(180deg, rgba(255,253,249,0.92) 0%, rgba(245,221,224,0.45) 100%)"
              btn.style.borderColor = "rgba(125,74,90,0.30)"
              btn.style.boxShadow = "0 6px 28px rgba(107,61,79,0.10), 0 1px 0 rgba(255,255,255,0.75) inset"
            }}
          >
            <div
              className="absolute bottom-0 left-0 right-0"
              style={{ height: "2px", background: "linear-gradient(to right, transparent, rgba(201,168,108,0.60), transparent)" }}
            />
            <span style={{
              position: "relative",
              fontFamily: '"Cinzel", serif',
              fontWeight: 500,
              fontSize: "clamp(0.64rem, 2.2vw, 0.78rem)",
              letterSpacing: "0.34em",
              textTransform: "uppercase",
              color: C.roseDeep,
            }}>
              Open Invitation
            </span>
          </button>
        </FadeIn>

      </div>
    </div>
  )
}
