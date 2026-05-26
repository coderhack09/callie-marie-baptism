"use client"

import React, { useEffect, useRef, useState } from "react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
// import { TornPaperEdge } from "./TornPaperEdge"

// ── Palette ───────────────────────────────────────────────────────────────────
const DEEP      = "#3D2810"
const ACCENT    = "#B8822A"
const IVORY     = "#FEF9F3"
const BLUE_BG   = "#C8E8F7"   // baby-blue section base (replaces dark brown)
const GOLD      = "#B8822A"
const BABY_BLUE = "#3FA3C8"
const BLUE_MID  = "#7BBEDD"

interface StorySectionProps {
  imageSrc?: string
  title?: string
  text: React.ReactNode
  layout?: "image-left" | "image-right"
  theme: "dark" | "light"
  isFirst?: boolean
  isLast?: boolean
  variant?: "image" | "text-only"
}

export const StorySection: React.FC<StorySectionProps> = ({
  imageSrc,
  title,
  text,
  layout = "image-left",
  theme,
  isFirst: _isFirst = false,
  isLast: _isLast = false,
  variant = "image",
}) => {
  const isDark    = theme === "dark"
  const isTextOnly = variant === "text-only"

  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const flexDirection = layout === "image-left" ? "flex-row" : "flex-row-reverse"
  const rotation      = layout === "image-left" ? "rotate-1 md:rotate-2" : "-rotate-1 md:-rotate-2"

  return (
    <div
      className="relative"
      style={{ backgroundColor: isDark ? BLUE_BG : "transparent" }}
    >
      {/* ── Blue section: rich layered sky-blue ── */}
      {isDark && (
        <>
          {/* Layer 1 — multi-directional radial depth */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 50%,  rgba(255,255,255,0.30) 0%, transparent 65%),
              radial-gradient(ellipse 50% 50% at 5%  20%,  rgba(63,163,200,0.22)  0%, transparent 55%),
              radial-gradient(ellipse 40% 40% at 95% 80%,  rgba(184,130,42,0.12)  0%, transparent 55%),
              radial-gradient(ellipse 35% 35% at 90% 10%,  rgba(238,212,188,0.22) 0%, transparent 50%),
              radial-gradient(ellipse 30% 30% at 8%  85%,  rgba(63,163,200,0.14)  0%, transparent 50%),
              linear-gradient(160deg, rgba(200,232,247,0.18) 0%, rgba(255,255,255,0.0) 45%, rgba(180,218,240,0.22) 100%)
            `,
          }} />

          {/* Layer 2 — fine dot grid */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
            backgroundImage: `radial-gradient(circle, rgba(63,163,200,0.14) 1px, transparent 1px)`,
            backgroundSize: "26px 26px",
          }} />

          {/* Layer 3 — diagonal shimmer stripes */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
            background: `repeating-linear-gradient(
              125deg,
              transparent 0px,
              transparent 160px,
              rgba(255,255,255,0.18) 160px,
              rgba(255,255,255,0.18) 162px
            )`,
          }} />

          {/* Layer 4 — top fade to blend with ivory above */}
          <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none" aria-hidden style={{
            background: `linear-gradient(to bottom, rgba(254,249,243,0.35), transparent)`,
          }} />

          {/* Layer 5 — bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none" aria-hidden style={{
            background: `linear-gradient(to top, rgba(254,249,243,0.30), transparent)`,
          }} />

          {/* Torn paper edges — ivory paper peeling over the blue */}
          <div className="absolute top-0 left-0 w-full -mt-[6px] md:-mt-[18px] z-20 pointer-events-none"
            style={{ color: IVORY }}>
            {/* <TornPaperEdge flipped={true} /> */}
          </div>
          <div className="absolute bottom-0 left-0 w-full -mb-[6px] md:-mb-[18px] z-20 pointer-events-none"
            style={{ color: IVORY }}>
            {/* <TornPaperEdge flipped={false} /> */}
          </div>
        </>
      )}

      {/* ── Light/beige section: layered warmth over parent ivory ── */}
      {!isDark && (
        <>
          {/* Subtle warm center glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
            background: `
              radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,255,255,0.18) 0%, transparent 70%),
              radial-gradient(ellipse 35% 35% at 5%  15%,  rgba(63,163,200,0.07)  0%, transparent 55%),
              radial-gradient(ellipse 30% 30% at 95% 85%,  rgba(184,130,42,0.06)  0%, transparent 50%)
            `,
          }} />

          {/* Fine dot grid — very faint */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
            backgroundImage: `radial-gradient(circle, rgba(184,130,42,0.09) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }} />

          {/* Torn paper edge — blue paper showing at transition */}
          <div className="absolute top-0 left-0 w-full -mt-[6px] md:-mt-[18px] z-20 pointer-events-none"
            style={{ color: BLUE_BG }}>
            {/* <TornPaperEdge flipped={true} /> */}
          </div>
          <div className="absolute bottom-0 left-0 w-full -mb-[6px] md:-mb-[18px] z-20 pointer-events-none"
            style={{ color: BLUE_BG }}>
            {/* <TornPaperEdge flipped={false} /> */}
          </div>
        </>
      )}

      <div
        ref={sectionRef}
        className={`container mx-auto px-3 md:px-12 py-12 md:py-28 relative z-10
          transition-all duration-1000 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
      >
        <div className={isTextOnly
          ? "flex justify-center"
          : `flex ${flexDirection} items-center justify-between gap-3 md:gap-16`}>

          {/* ── Image column ── */}
          {!isTextOnly && imageSrc && (
            <div className="w-[42%] md:w-5/12 flex justify-center shrink-0">
              <div
                className={`relative w-full md:max-w-md transition-all duration-1000 delay-300 ease-out
                  ${rotation}
                  ${isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
              >
                {/* Polaroid-style frame */}
                <div
                  style={{
                    background: "#fff",
                    padding: "clamp(4px, 1.2vw, 10px)",
                    paddingBottom: "clamp(22px, 6vw, 40px)",
                    boxShadow: isDark
                      ? `0 14px 44px rgba(63,163,200,0.22), 0 4px 14px rgba(63,163,200,0.14), 0 0 0 1px rgba(255,255,255,0.50)`
                      : `0 10px 36px rgba(61,40,16,0.20), 0 3px 10px rgba(61,40,16,0.10)`,
                    borderRadius: "2px",
                  }}
                >
                  <div className="aspect-[3/4] w-full overflow-hidden relative group">
                    <CloudinaryImage
                      src={imageSrc}
                      alt="Story moment"
                      fill
                      sizes="(max-width: 768px) 42vw, (max-width: 1024px) 40vw, 33vw"
                      className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                      quality={90}
                      priority={false}
                    />
                    {/* Subtle vignette */}
                    <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 20px rgba(0,0,0,0.08)" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Text column ── */}
          <div
            className={`transition-all duration-1000 delay-500
              ${isTextOnly ? "w-full max-w-2xl mx-auto text-center" : "w-[58%] md:w-5/12"}
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Accent stripe */}
            <div
              className="mb-3 md:mb-4 rounded-full"
              style={{
                width: "clamp(28px, 6vw, 44px)",
                height: "2px",
                background: isDark
                  ? `linear-gradient(to right, ${BABY_BLUE}cc, ${GOLD}77, transparent)`
                  : `linear-gradient(to right, ${GOLD}88, ${BLUE_MID}55, transparent)`,
                marginLeft: isTextOnly || layout === "image-right" ? "auto" : undefined,
                marginRight: isTextOnly || layout === "image-right" ? "auto" : undefined,
              }}
            />

            {/* Optional title */}
            {title && (
              <h2
                className="gistesy block mb-2 md:mb-4"
                style={{
                  fontSize: "clamp(1.4rem, 5vw, 3rem)",
                  color: isDark ? BABY_BLUE : ACCENT,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  overflow: "visible",
                  paddingTop: "0.05em",
                }}
              >
                {title}
              </h2>
            )}

            {/* Body text */}
            <div
              className={`garamond transition-all duration-1000 delay-700
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                fontSize: "clamp(0.74rem, 2.6vw, 1rem)",
                lineHeight: 1.95,
                color: DEEP,
                fontStyle: isDark ? "normal" : "italic",
                textAlign: isTextOnly ? "center" : layout === "image-right" ? "right" : "left",
              }}
            >
              {text}
            </div>

            {/* Decorative dot */}
            <div
              className="mt-3 md:mt-4"
              style={{
                display: "flex",
                justifyContent: isTextOnly ? "center" : layout === "image-right" ? "flex-end" : "flex-start",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: isDark ? `rgba(63,163,200,0.65)` : `rgba(184,130,42,0.45)`,
                  display: "block",
                  boxShadow: isDark ? `0 0 6px rgba(63,163,200,0.40)` : "none",
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
