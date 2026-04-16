"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import StaggeredMenu from "./StaggeredMenu"

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
          ? "backdrop-blur-xl shadow-[0_10px_40px_rgba(139,111,90,0.18)] border-b border-[var(--color-motif-medium)]/50"
          : "backdrop-blur-lg border-b border-[var(--color-motif-medium)]/40"
      }`}
      style={{
        background: isScrolled 
          ? 'linear-gradient(135deg, color-mix(in srgb, var(--color-motif-cream) 94%, white 6%) 0%, color-mix(in srgb, var(--color-motif-soft) 92%, white 8%) 100%)'
          : 'linear-gradient(135deg, color-mix(in srgb, var(--color-motif-cream) 90%, white 10%) 0%, color-mix(in srgb, var(--color-motif-soft) 88%, white 12%) 100%)'
      }}
    >
      {/* Elegant glow effect when scrolled */}
      {isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-motif-cream)]/20 via-[var(--color-motif-soft)]/10 to-[var(--color-motif-cream)]/20 pointer-events-none" />
      )}
      {/* Subtle texture overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-[var(--color-motif-soft)]/12 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <Link href="#home" className="flex-shrink-0 group relative z-10">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center">
              <div 
                className="text-center group-hover:scale-110 group-active:scale-105 transition-all duration-500"
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontWeight: 700,
                  fontSize: '20px',
                  lineHeight: '28px',
                  color: 'var(--color-motif-deep)',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                N C
              </div>
            </div>
            
            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-motif-medium)]/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
          </Link>

          <div className="hidden md:flex gap-1 items-center">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 lg:px-4 py-2 text-xs lg:text-sm uppercase rounded-lg transition-all duration-500 relative group ${
                    isActive
                      ? "text-[var(--color-motif-deep)] bg-[var(--color-motif-cream)]/95 backdrop-blur-md shadow-[0_6px_18px_rgba(139,111,90,0.2)] border border-[var(--color-motif-medium)]"
                      : "text-[var(--color-motif-deep)]/80 hover:text-[var(--color-motif-deep)] hover:bg-[var(--color-motif-cream)]/95 hover:border hover:border-[var(--color-motif-medium)]/60 hover:shadow-[0_6px_18px_rgba(139,111,90,0.15)] hover:scale-105 active:scale-95 bg-white/0 border border-transparent"
                  }`}
                  style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 400 }}
                >
                  {link.label.toUpperCase()}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--color-motif-deep)] via-[var(--color-motif-medium)] to-[var(--color-motif-deep)] transition-all duration-500 rounded-full ${
                      isActive
                        ? "w-full shadow-[0_0_10px_rgba(139,111,90,0.45)]"
                        : "w-0 group-hover:w-full group-hover:shadow-[0_0_8px_rgba(139,111,90,0.35)]"
                    }`}
                  />
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--color-motif-accent)] animate-pulse shadow-[0_0_6px_rgba(207,160,107,0.55)]" />
                  )}
                  {/* Subtle accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--color-motif-medium)]/30 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </Link>
              )
            })}
          </div>

          <div className="md:hidden flex items-center h-full">
            {/* Decorative halo to improve tap target and visual affordance */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[var(--color-motif-medium)]/24 via-[var(--color-motif-accent)]/18 to-transparent blur-md pointer-events-none" />
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
