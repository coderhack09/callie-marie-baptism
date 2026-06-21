"use client"

import React, { useEffect, useState } from "react"
import { siteConfig } from "@/content/site"
import { C, nameStyles } from "./christening-theme"
import {
  ChristeningBackdrop,
  ChristeningCross,
  ChristeningProgressBar,
  DiamondRule,
  FloralGarland,
} from "./ChristeningDecor"

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

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut]   = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase]       = useState(0)
  const [dotFrame, setDotFrame] = useState(0)

  const TOTAL_LOAD_MS = 10000
  const FADE_MS       = 700

  const parts      = siteConfig.couple.child.trim().split(" ")
  const givenName  = parts[0]
  const middleName = parts[1] ?? ""

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 120),
      setTimeout(() => setPhase(2), 380),
      setTimeout(() => setPhase(3), 600),
      setTimeout(() => setPhase(4), 820),
      setTimeout(() => setPhase(5), 1020),
      setTimeout(() => setPhase(6), 1180),
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
      const next = easeOutCubic(t) * 100
      setProgress(prev => (next > prev ? next : prev))
      if (t < 1) rafId = requestAnimationFrame(tick)
      else setProgress(100)
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
    transform:  phase >= minPhase ? "translateY(0)" : "translateY(14px)",
    transition: `opacity 0.75s ease-out ${delay}, transform 0.75s ease-out ${delay}`,
  })

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ease-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-busy={!fadeOut}
      aria-label="Loading invitation"
      style={{ backgroundColor: C.ivory }}
    >
      <ChristeningBackdrop sparklesVisible={phase >= 1} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden>
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-bubble-rise"
            style={{
              left: b.left, bottom: "-16px",
              width: `${b.size}px`, height: `${b.size}px`,
              background: `radial-gradient(circle at 32% 28%, ${C.pearl} 0%, rgba(232,196,204,0.25) 55%, rgba(201,168,108,0.08) 100%)`,
              border: "1px solid rgba(201,168,108,0.22)",
              boxShadow: "0 0 8px rgba(245,221,224,0.45), inset 0 0 4px rgba(255,255,255,0.60)",
              animationDuration: `${b.dur}s`,
              animationDelay:    `${b.delay}s`,
            }}
          />
        ))}
      </div>

      <div
        className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-sm mx-auto px-6"
        style={{ minHeight: "100svh", paddingBottom: "clamp(5rem,14vw,7rem)" }}
      >
        <div style={{
          marginBottom: "clamp(0.8rem,2.5vw,1.4rem)",
          opacity:    phase >= 1 ? 1 : 0,
          transform:  phase >= 1 ? "scale(1)" : "scale(0.90)",
          transition: "opacity 0.9s ease-out, transform 0.9s ease-out",
        }}>
          <ChristeningCross gradientId="loaderCrossGold" />
        </div>

        <div style={vis(2, "0ms")}>
          <DiamondRule margin="0 0 clamp(0.8rem,2.5vw,1.2rem) 0" />
        </div>

        <div style={vis(2, "80ms")}>
          <div className="animate-loader-name-glow" style={nameStyles.given}>
            {givenName.toUpperCase()}
          </div>
        </div>

        {middleName && (
          <div style={vis(3, "80ms")}>
            <div style={nameStyles.script}>{middleName}&apos;s</div>
          </div>
        )}

        <div style={vis(4, "0ms")}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "clamp(6px,2vw,12px)", marginTop: "clamp(0.7rem,2.2vw,1.2rem)" }}>
            <FloralGarland />
            <div style={nameStyles.subtitle}>Holy Baptism</div>
            <FloralGarland flip />
          </div>
        </div>

        <div style={vis(4, "100ms")}>
          <DiamondRule margin="clamp(0.9rem,2.8vw,1.4rem) 0" />
        </div>

        <div style={vis(5, "0ms")}>
          <p style={nameStyles.parentLabel}>Son of</p>
          <p style={nameStyles.parentNames}>{siteConfig.couple.parents}</p>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-10 flex flex-col items-center pointer-events-none"
        style={{
          paddingBottom: "max(1.75rem, env(safe-area-inset-bottom, 0px))",
          paddingTop: "1rem",
          background: `linear-gradient(to top, ${C.ivory} 55%, transparent 100%)`,
        }}
      >
        <div style={vis(6, "0ms")} className="pointer-events-auto">
          <ChristeningProgressBar
            progress={progress}
            label={`Loading Invitation${DOT_FRAMES[dotFrame]}`}
          />
        </div>
      </div>
    </div>
  )
}
