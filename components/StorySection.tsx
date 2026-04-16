"use client"

import React, { useEffect, useRef, useState } from "react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { TornPaperEdge } from "./TornPaperEdge"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"
const CREAM  = "#F5E6D3"
const SOFT   = "#E8D2B5"

interface StorySectionProps {
  imageSrc: string
  title?: string
  text: React.ReactNode
  layout: "image-left" | "image-right"
  theme: "dark" | "light"
  isFirst?: boolean
  isLast?: boolean
}

export const StorySection: React.FC<StorySectionProps> = ({
  imageSrc,
  title,
  text,
  layout,
  theme,
  isFirst = false,
  isLast = false,
}) => {
  const isDark = theme === "dark"

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
      style={{ backgroundColor: isDark ? DEEP : CREAM }}
    >
      {/* Torn paper edges on light sections */}
      {!isDark && (
        <>
          <div className="absolute top-0 left-0 w-full -mt-[8px] md:-mt-[20px] z-20 pointer-events-none"
            style={{ color: CREAM }}>
            <TornPaperEdge flipped={true} />
          </div>
          <div className="absolute bottom-0 left-0 w-full -mb-[8px] md:-mb-[20px] z-20 pointer-events-none"
            style={{ color: CREAM }}>
            <TornPaperEdge flipped={false} />
          </div>
        </>
      )}

      {/* Subtle inner texture for dark sections */}
      {isDark && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 50%, rgba(207,160,107,0.06) 0%, transparent 70%)`,
          }}
        />
      )}

      <div
        ref={sectionRef}
        className={`container mx-auto px-3 md:px-12 py-12 md:py-28 relative z-10
          transition-all duration-1000 ease-out
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
      >
        <div className={`flex ${flexDirection} items-center justify-between gap-3 md:gap-16`}>

          {/* ── Image column ── */}
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
                    ? `0 12px 40px rgba(0,0,0,0.28), 0 3px 10px rgba(0,0,0,0.18)`
                    : `0 8px 32px rgba(139,111,90,0.22), 0 2px 8px rgba(139,111,90,0.12)`,
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
                </div>
              </div>
            </div>
          </div>

          {/* ── Text column ── */}
          <div
            className={`w-[58%] md:w-5/12 transition-all duration-1000 delay-500
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            {/* Optional title */}
            {title && (
              <h2
                className="gistesy block mb-2 md:mb-4"
                style={{
                  fontSize: "clamp(1.4rem, 5vw, 3rem)",
                  color: isDark ? CREAM : ACCENT,
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                  textShadow: isDark
                    ? `0 2px 20px rgba(245,230,211,0.18)`
                    : `0 2px 20px rgba(207,160,107,0.22)`,
                }}
              >
                {title}
              </h2>
            )}

            {/* Thin accent line above body */}
            <div
              className="mb-2 md:mb-4"
              style={{
                width: "clamp(24px, 6vw, 40px)",
                height: "1.5px",
                background: isDark
                  ? `linear-gradient(to right, rgba(245,230,211,0.5), transparent)`
                  : `linear-gradient(to right, rgba(207,160,107,0.55), transparent)`,
                marginLeft: layout === "image-right" ? "auto" : undefined,
                marginRight: layout === "image-right" ? "0" : undefined,
              }}
            />

            {/* Body text */}
            <div
              className={`garamond transition-all duration-1000 delay-700
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{
                fontSize: "clamp(0.72rem, 2.6vw, 1rem)",
                lineHeight: 1.9,
                color: isDark ? SOFT : DEEP,
                fontStyle: isDark ? "normal" : "italic",
                opacity: isDark ? 0.92 : 0.88,
                textAlign: layout === "image-right" ? "right" : "left",
              }}
            >
              {text}
            </div>

            {/* Decorative dot at end */}
            <div
              className="mt-3 md:mt-5"
              style={{
                display: "flex",
                justifyContent: layout === "image-right" ? "flex-end" : "flex-start",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: isDark
                    ? `rgba(245,230,211,0.35)`
                    : `rgba(207,160,107,0.45)`,
                  display: "block",
                }}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
