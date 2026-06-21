"use client"

import React, { useId } from "react"
import { C, sparkleDots } from "./christening-theme"
import { ChristeningParticles } from "./ChristeningParticles"
import Image from "next/image"

const PETALS = [
  { left: "8%",  dur: 14, delay: 0,   size: 14, hue: 0 },
  { left: "22%", dur: 18, delay: -4,  size: 11, hue: 1 },
  { left: "38%", dur: 16, delay: -9,  size: 16, hue: 0 },
  { left: "55%", dur: 20, delay: -2,  size: 10, hue: 2 },
  { left: "68%", dur: 15, delay: -12, size: 13, hue: 1 },
  { left: "82%", dur: 17, delay: -6,  size: 12, hue: 0 },
  { left: "92%", dur: 19, delay: -15, size: 9,  hue: 2 },
  { left: "45%", dur: 22, delay: -18, size: 15, hue: 1 },
]

const PETAL_COLORS = [C.peonySoft, C.blushDeep, C.rosePetal]

export function WatercolorFloral({ flip = false, style, uid }: { flip?: boolean; style?: React.CSSProperties; uid?: string }) {
  const autoId = useId()
  const id = uid ?? autoId.replace(/:/g, "")
  return (
    <svg
      viewBox="0 0 120 100"
      fill="none"
      aria-hidden
      className="animate-floral-sway"
      style={{ ...style, transform: flip ? "scaleX(-1)" : style?.transform, animationDuration: "8s" }}
    >
      <defs>
        <radialGradient id={`${id}-r1`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.peonySoft} stopOpacity="0.90" />
          <stop offset="100%" stopColor={C.peony} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-r2`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.blushDeep} stopOpacity="0.75" />
          <stop offset="100%" stopColor={C.dustyRose} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-p`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5E0E8" stopOpacity="0.95" />
          <stop offset="100%" stopColor={C.rosePetal} stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-blur`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <g filter={`url(#${id}-blur)`}>
        <ellipse cx="58" cy="42" rx="30" ry="28" fill={`url(#${id}-p)`} />
        <ellipse cx="46" cy="36" rx="20" ry="18" fill={`url(#${id}-r1)`} />
        <ellipse cx="70" cy="38" rx="18" ry="16" fill={`url(#${id}-r2)`} />
        <ellipse cx="30" cy="58" rx="24" ry="22" fill={`url(#${id}-r1)`} />
        <ellipse cx="22" cy="50" rx="14" ry="13" fill={`url(#${id}-r2)`} />
        <ellipse cx="38" cy="52" rx="12" ry="11" fill={`url(#${id}-p)`} opacity="0.75" />
      </g>
      <ellipse cx="78" cy="68" rx="14" ry="6" fill="rgba(168,184,156,0.38)" transform="rotate(-20 78 68)" />
      <ellipse cx="18" cy="72" rx="12" ry="5" fill="rgba(168,184,156,0.30)" transform="rotate(15 18 72)" />
      <circle cx="55" cy="44" r="2" fill={C.pearl} opacity="0.6" />
    </svg>
  )
}

export function FloralGarland({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 72 32"
      style={{ width: "clamp(38px,10vw,62px)", transform: flip ? "scaleX(-1)" : undefined }}
      fill="none"
      aria-hidden
      className="animate-floral-sway"
    >
      <path d="M2 16 Q18 11 36 16 Q54 21 70 16" stroke="rgba(196,160,168,0.40)" strokeWidth="0.8" />
      <ellipse cx="10" cy="11" rx="7" ry="6" fill="rgba(232,180,192,0.58)" />
      <ellipse cx="10" cy="10" rx="4" ry="3.5" fill="rgba(255,248,250,0.75)" />
      <ellipse cx="26" cy="18" rx="6" ry="5" fill="rgba(212,144,154,0.48)" />
      <ellipse cx="42" cy="12" rx="6.5" ry="6" fill="rgba(232,180,192,0.52)" />
      <ellipse cx="58" cy="17" rx="5" ry="4" fill="rgba(245,221,224,0.68)" />
      <circle cx="36" cy="15" r="1.4" fill={C.gold} opacity="0.60" />
    </svg>
  )
}

export function ChristeningCross({ gradientId = "crossGold" }: { gradientId?: string }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <div
        className="absolute animate-loader-glow"
        style={{
          inset: "-20px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(245,221,224,0.42) 0%, rgba(201,168,108,0.14) 50%, transparent 78%)`,
          filter: "blur(10px)",
        }}
      />
      <div className="absolute animate-pearl-pulse" style={{
        width: "clamp(78px,18vw,104px)", height: "clamp(78px,18vw,104px)",
        borderRadius: "50%",
        border: "1px solid rgba(201,168,108,0.22)",
        boxShadow: "inset 0 0 12px rgba(245,221,224,0.35), 0 0 20px rgba(232,196,204,0.20)",
      }} aria-hidden />
      <svg viewBox="0 0 110 115" style={{ width: "clamp(66px,16vw,90px)", position: "relative" }} fill="none" aria-hidden>
        <circle cx="55" cy="56" r="22" stroke="rgba(201,168,108,0.26)" strokeWidth="0.8" fill="rgba(245,221,224,0.15)" />
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
              stroke={`rgba(201,168,108,${long ? 0.58 : 0.24})`}
              strokeWidth={long ? "1.5" : "0.8"}
              strokeLinecap="round"
            />
          )
        })}
        <rect x="49" y="18" width="12" height="74" rx="5" fill={`url(#${gradientId})`} />
        <rect x="22" y="38" width="66" height="12" rx="5" fill={`url(#${gradientId})`} />
        <rect x="52" y="18" width="5" height="74" rx="2.5" fill="rgba(255,248,240,0.35)" />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#F0E0C0" />
            <stop offset="40%"  stopColor="#C9A86C" />
            <stop offset="100%" stopColor="#9E7040" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

export function DiamondRule({ width = "clamp(180px,60vw,280px)", margin }: { width?: string; margin?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", width, margin }}>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, transparent, rgba(201,168,108,0.48))` }} />
      <div className="animate-pearl-pulse" style={{
        width: "9px", height: "9px", borderRadius: "50%",
        background: `radial-gradient(circle at 35% 35%, ${C.pearl}, ${C.goldLight})`,
        border: "1px solid rgba(201,168,108,0.40)",
        boxShadow: "0 0 8px rgba(201,168,108,0.30), 0 0 14px rgba(232,196,204,0.25)",
      }} />
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, transparent, rgba(201,168,108,0.48))` }} />
    </div>
  )
}

function FloatingPetals() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]" aria-hidden>
      {PETALS.map((p, i) => (
        <div
          key={i}
          className="absolute animate-petal-drift"
          style={{ left: p.left, top: "-5%", animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }}
        >
          <div className="animate-petal-sway" style={{ animationDuration: `${4 + (i % 3)}s`, animationDelay: `${p.delay}s` }}>
            <svg viewBox="0 0 20 26" width={p.size} height={p.size * 1.3} fill="none">
              <ellipse cx="10" cy="13" rx="9" ry="12" fill={PETAL_COLORS[p.hue]} opacity="0.72" transform="rotate(-15 10 13)" />
              <ellipse cx="10" cy="13" rx="5" ry="7" fill="rgba(255,252,250,0.45)" transform="rotate(-15 10 13)" />
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}

const CORNER_FLORALS = [
  { src: "/decoration/left-top-removebg-preview-pink.png",    className: "absolute top-0 left-0" },
  { src: "/decoration/right-top-removebg-preview-pink.png",   className: "absolute top-0 right-0" },
  { src: "/decoration/bottom-left-removebg-preview-pink.png",  className: "absolute bottom-0 left-0" },
  { src: "/decoration/bottom-right-removebg-preview-pink.png", className: "absolute bottom-0 right-0" },
] as const

/** Corner leaf PNG decorations (pre-tinted blush pink from blue originals) */
export function CornerFloralDecor({
  sizeClass = "w-28 sm:w-40 md:w-52 lg:w-60",
  opacity = 0.92,
  priority = false,
}: {
  sizeClass?: string
  opacity?: number
  priority?: boolean
}) {
  return (
    <>
      {CORNER_FLORALS.map(({ src, className }, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          width={280}
          height={280}
          priority={priority && i < 2}
          aria-hidden
          className={`pointer-events-none select-none ${sizeClass} ${className}`}
          style={{ opacity }}
        />
      ))}
    </>
  )
}

interface BackdropProps {
  sparklesVisible?: boolean
}

export function ChristeningBackdrop({ sparklesVisible = true }: BackdropProps) {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `linear-gradient(175deg, ${C.ivory} 0%, ${C.champagne} 28%, ${C.blushSoft} 58%, ${C.blush} 100%)`,
      }} />

      <div className="absolute inset-0 pointer-events-none christening-lace" aria-hidden />

      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 80% 70% at 50% 44%, rgba(255,253,249,0.82) 0%, transparent 68%),
          radial-gradient(ellipse 40% 30% at 15% 20%, rgba(245,221,224,0.35) 0%, transparent 70%),
          radial-gradient(ellipse 35% 28% at 85% 25%, rgba(232,196,204,0.30) 0%, transparent 70%)
        `,
      }} />

      <div className="absolute pointer-events-none" style={{
        bottom: 0, left: 0, right: 0, height: "42%",
        background: `linear-gradient(0deg, rgba(232,196,204,0.32) 0%, rgba(245,221,224,0.16) 40%, transparent 100%)`,
      }} />

      <ChristeningParticles />
      <FloatingPetals />

      <WatercolorFloral uid="fl-tl" style={{
        position: "absolute", top: "-3%", left: "-5%", zIndex: 0,
        width: "clamp(110px,24vw,175px)", opacity: 0.78,
      }} />
      <WatercolorFloral uid="fl-tr" flip style={{
        position: "absolute", top: "-2%", right: "-6%", zIndex: 0,
        width: "clamp(100px,22vw,165px)", opacity: 0.74,
      }} />
      <WatercolorFloral uid="fl-bl" style={{
        position: "absolute", bottom: "10%", left: "-7%", zIndex: 0,
        width: "clamp(90px,20vw,145px)", opacity: 0.50,
        transform: "rotate(20deg)", animation: "none",
      }} />
      <WatercolorFloral uid="fl-br" flip style={{
        position: "absolute", bottom: "8%", right: "-6%", zIndex: 0,
        width: "clamp(95px,21vw,150px)", opacity: 0.48,
        transform: "scaleX(-1) rotate(-12deg)", animation: "none",
      }} />

      {sparkleDots.map((s, i) => (
        <div key={i} className={`absolute pointer-events-none z-[1] ${i % 3 === 0 ? "animate-pearl-pulse" : ""}`} style={{
          top: s.top,
          left: "left" in s ? s.left : undefined,
          right: "right" in s ? s.right : undefined,
          width: `${s.size}px`, height: `${s.size}px`,
          borderRadius: "50%",
          background: i % 2 === 0
            ? `radial-gradient(circle at 35% 35%, ${C.pearl}, ${C.goldLight})`
            : C.blushDeep,
          opacity: sparklesVisible ? s.op : 0,
          transition: `opacity 1s ease-out ${s.delay}`,
          boxShadow: i % 2 === 0 ? "0 0 6px rgba(201,168,108,0.40)" : "0 0 4px rgba(232,196,204,0.30)",
          animationDelay: `${i * 0.3}s`,
        }} aria-hidden />
      ))}
    </>
  )
}

export function ChristeningProgressBar({ progress, label }: { progress: number; label: string }) {
  const clamped = Math.min(100, Math.max(0, progress))
  const display = Math.round(clamped)
  const fillScale = clamped === 0 ? 0 : Math.max(clamped / 100, 0.012)

  return (
    <div
      role="progressbar"
      aria-valuenow={display}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label.replace(/\.+$/, "")}
      style={{ width: "100%", maxWidth: "min(320px, 88vw)", padding: "0 20px" }}
    >
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,160,168,0.55))" }} />
        <p style={{
          fontFamily: '"Cinzel", serif',
          fontSize: "clamp(0.58rem, 2vw, 0.70rem)",
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "rgba(157,120,130,0.88)",
          margin: 0,
          whiteSpace: "nowrap",
        }}>
          {label}
        </p>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,160,168,0.55))" }} />
      </div>

      {/* Track */}
      <div
        className="relative w-full"
        style={{
          height: "5px",
          borderRadius: "999px",
          background: "rgba(232,196,204,0.45)",
          boxShadow: "inset 0 1px 3px rgba(107,61,79,0.08)",
          overflow: "visible",
        }}
      >
        {/* Fill — scaleX for smooth GPU animation */}
        <div
          className="absolute inset-0 rounded-full origin-left overflow-hidden"
          style={{
            transform: `scaleX(${fillScale})`,
            background: `linear-gradient(90deg, ${C.goldDeep} 0%, ${C.gold} 55%, ${C.goldLight} 100%)`,
            boxShadow: clamped > 0 ? "0 0 12px rgba(201,168,108,0.40)" : "none",
            willChange: "transform",
          }}
        >
          <div
            className="absolute inset-0 animate-loader-shimmer"
            style={{
              width: "80px",
              background: "linear-gradient(90deg, transparent 0%, rgba(255,252,248,0.80) 50%, transparent 100%)",
            }}
          />
        </div>

        {/* Pearl cap — follows fill edge */}
        {clamped > 1 && (
          <div
            className="absolute top-1/2 animate-pearl-pulse pointer-events-none"
            style={{
              left: `calc(${clamped}% - 5px)`,
              transform: "translateY(-50%)",
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: `radial-gradient(circle at 35% 35%, ${C.pearl}, ${C.gold})`,
              border: "1px solid rgba(201,168,108,0.45)",
              boxShadow: "0 0 10px rgba(201,168,108,0.85), 0 0 16px rgba(232,196,204,0.40)",
            }}
            aria-hidden
          />
        )}
      </div>

      {/* Percentage */}
      <p
        className="tabular-nums"
        aria-live="polite"
        style={{
          fontFamily: '"Cinzel", serif',
          fontSize: "clamp(0.58rem, 2vw, 0.68rem)",
          letterSpacing: "0.32em",
          color: "rgba(184,146,78,0.80)",
          textAlign: "center",
          margin: "11px 0 0",
        }}
      >
        {display}%
      </p>
    </div>
  )
}
