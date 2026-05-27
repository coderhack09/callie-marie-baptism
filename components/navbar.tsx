"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import StaggeredMenu from "./StaggeredMenu"
import { siteConfig } from "@/content/site"

const navLinks = [
  { href: "#home", label: "Main" },
  { href: "#gallery", label: "Gallery" },
  { href: "#messages", label: "Message" },
  { href: "#guest-list", label: "RSVP" },
  { href: "#faq", label: "FAQ" },
  { href: "#snap-share", label: "SnapShare" },
  { href: "#footer", label: "Footer" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("#home")

  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = () => {
      if (rafIdRef.current != null) return
      rafIdRef.current = window.requestAnimationFrame(() => {
        rafIdRef.current = null
        setIsScrolled(window.scrollY > 50)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener("scroll", onScroll as EventListener)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const sectionIds = navLinks.map(l => l.href.substring(1))
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio - a.intersectionRatio))
        if (visible.length > 0) {
          const topMost = visible[0]
          if (topMost.target && topMost.target.id) {
            const newActive = `#${topMost.target.id}`
            setActiveSection(prev => (prev === newActive ? prev : newActive))
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const menuItems = useMemo(() => navLinks.map((l) => ({ label: l.label, ariaLabel: `Go to ${l.label}`, link: l.href })), [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-out ${
        isScrolled
          ? "backdrop-blur-xl shadow-[0_8px_32px_rgba(43,74,107,0.10)] border-b border-[#C4965A]/30"
          : "backdrop-blur-lg border-b border-[#C4965A]/18"
      }`}
      style={{
        background: isScrolled
          ? "rgba(255,255,255,0.97)"
          : "rgba(255,255,255,0.92)",
      }}
    >
      {/* Gold bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <Link href="#home" className="flex-shrink-0 group relative z-10">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center group-hover:scale-110 group-active:scale-105 transition-all duration-500">
              {/* Monogram — beige/gold tinted, matching Hero */}
              <Image
                src={siteConfig.couple.monogram}
                alt="Monogram"
                width={56}
                height={56}
                priority
                style={{
                  width: "100%", height: "100%",
                  objectFit: "contain",
                  filter: "brightness(0) sepia(1) saturate(0.18) brightness(1.35)",
                  opacity: 0.88,
                }}
              />
            </div>
            {/* Gold glow on hover */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
              style={{ background: "radial-gradient(circle, rgba(196,152,88,0.22) 0%, transparent 70%)" }} />
          </Link>

          <div className="hidden md:flex gap-1 items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 lg:px-4 py-2 text-xs lg:text-sm uppercase rounded-sm transition-all duration-500 relative group ${
                    isActive
                      ? "bg-white/80 backdrop-blur-md shadow-[0_4px_16px_rgba(196,152,88,0.18)] border border-[rgba(196,152,88,0.45)]"
                      : "hover:bg-white/70 hover:border hover:border-[rgba(196,152,88,0.35)] hover:shadow-[0_4px_14px_rgba(196,152,88,0.14)] hover:scale-105 active:scale-95 bg-transparent border border-transparent"
                  }`}
                  style={{
                    fontFamily: '"Cinzel", serif',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? "#2B4A6B" : "rgba(43,74,107,0.72)",
                    letterSpacing: "0.10em",
                  }}
                >
                  {link.label.toUpperCase()}
                  {/* Gold underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-px transition-all duration-500 rounded-full ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                    style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.70), transparent)" }}
                  />
                  {/* Active gold dot */}
                  {isActive && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: "#C4965A", boxShadow: "0 0 6px rgba(196,152,88,0.70)" }} />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="md:hidden flex items-center h-full">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full pointer-events-none blur-md"
                style={{ background: "radial-gradient(circle, rgba(196,152,88,0.22) 0%, transparent 70%)" }} />
              <StaggeredMenu
                position="left"
                items={menuItems}
                socialItems={[]}
                displaySocials={false}
                displayItemNumbering={true}
                menuButtonColor="var(--color-motif-deep)"
                openMenuButtonColor="var(--color-motif-deep)"
                changeMenuColorOnOpen={true}
                colors={[
                  "var(--color-motif-deep)",
                  "var(--color-motif-medium)",
                  "var(--color-motif-cream)",
                  "var(--color-motif-soft)",
                  "var(--color-motif-silver)"
                ]}
                accentColor="var(--color-motif-accent)"
                isFixed={true}
                onMenuOpen={() => {}}
                onMenuClose={() => {}}
              />
            </div>
          </div>
        </div>

      </div>
    </nav>
  )
}
