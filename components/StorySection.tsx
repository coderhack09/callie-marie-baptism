"use client"

import React, { useEffect, useRef, useState } from "react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
// import { TornPaperEdge } from "./TornPaperEdge"

// ── Palette — aligned with loader/Hero.tsx ────────────────────────────────────
const NAVY      = "#2B4A6B"
const GOLD      = "#C4965A"
const NAVY_MUTE = "rgba(65,90,115,0.78)"

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
      style={{ backgroundColor: isDark ? "rgba(240,246,252,0.60)" : "transparent" }}
    >
      {/* ── Dark variant — soft navy-blue tinted section ── */}
      {isDark && (
        <>
          {/* Center spotlight */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,255,255,0.45) 0%, transparent 68%)",
          }} />
          {/* Bottom water wash */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none" aria-hidden style={{
            background: "linear-gradient(0deg, rgba(120,175,215,0.14) 0%, transparent 100%)",
          }} />
          {/* Fine dot grid — very subtle */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
            backgroundImage: "radial-gradient(circle, rgba(43,74,107,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }} />
        </>
      )}

      {/* ── Light variant — warm white with gold accent glow ── */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255,255,255,0.20) 0%, transparent 70%),
            radial-gradient(ellipse 30% 30% at 5% 15%, rgba(196,152,88,0.05) 0%, transparent 55%)
          `,
        }} />
      )}

      <div
        ref={sectionRef}
        className={`container mx-auto px-3 md:px-12 py-12 md:py-28 relative z-10
          transition-all duration-1000 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
      >
        <div className={isTextOnly || !imageSrc
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
                      ? `0 14px 44px rgba(43,74,107,0.18), 0 4px 14px rgba(43,74,107,0.10), 0 0 0 1px rgba(196,152,88,0.18)`
                      : `0 10px 36px rgba(43,74,107,0.14), 0 3px 10px rgba(43,74,107,0.08)`,
                    borderRadius: "2px",
                    border: "1px solid rgba(196,152,88,0.18)",
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
              ${isTextOnly || !imageSrc ? "w-full max-w-2xl mx-auto text-center" : "w-[58%] md:w-5/12"}
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Diamond rule — matching Hero */}
            <div
              className="mb-4 md:mb-5"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "clamp(140px,40vw,200px)",
                marginLeft: isTextOnly || !imageSrc || layout === "image-right" ? "auto" : undefined,
                marginRight: isTextOnly || !imageSrc || layout === "image-right" ? "auto" : undefined,
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, transparent, rgba(196,152,88,0.45))" }} />
              <div style={{ width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.62)" }} />
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(to left, transparent, rgba(196,152,88,0.45))" }} />
            </div>

            {/* Optional title — LeJourScript gold */}
            {title && (
              <h2
                style={{
                  display: "block",
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(1.4rem, 5vw, 3rem)",
                  color: GOLD,
                  lineHeight: 1.1,
                  letterSpacing: "0.01em",
                  filter: "drop-shadow(0 2px 6px rgba(196,152,88,0.16))",
                  marginBottom: "clamp(0.5rem,2vw,1rem)",
                }}
              >
                {title}
              </h2>
            )}

            {/* Body text — Fahkwang navy */}
            <div
              className={`transition-all duration-1000 delay-700
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontWeight: 400,
                fontSize: "clamp(0.76rem, 2.6vw, 0.96rem)",
                lineHeight: 1.95,
                color: isDark ? NAVY : NAVY_MUTE,
                textAlign: isTextOnly || !imageSrc ? "center" : layout === "image-right" ? "right" : "left",
              }}
            >
              {text}
            </div>

            {/* Gold diamond closing mark */}
            <div
              className="mt-4 md:mt-5"
              style={{
                display: "flex",
                justifyContent: isTextOnly || !imageSrc ? "center" : layout === "image-right" ? "flex-end" : "flex-start",
              }}
            >
              <div style={{
                width: "6px", height: "6px",
                borderRadius: "1px",
                transform: "rotate(45deg)",
                background: `rgba(196,152,88,${isDark ? 0.55 : 0.42})`,
                boxShadow: isDark ? "0 0 6px rgba(196,152,88,0.30)" : "none",
              }} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
