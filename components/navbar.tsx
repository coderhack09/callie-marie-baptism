"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
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
          ? "backdrop-blur-xl shadow-[0_10px_40px_rgba(191,160,122,0.22)] border-b border-[#BFA07A]/40"
          : "backdrop-blur-lg border-b border-[#BFA07A]/25"
      }`}
      style={{
        background: isScrolled
          ? 'linear-gradient(135deg, rgba(245,230,211,0.97) 0%, rgba(253,246,237,0.95) 50%, rgba(245,230,211,0.97) 100%)'
          : 'linear-gradient(135deg, rgba(245,230,211,0.90) 0%, rgba(253,246,237,0.87) 50%, rgba(245,230,211,0.90) 100%)'
      }}
    >
      {/* Soft warm glow when scrolled */}
      {isScrolled && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#EDE3D6]/20 via-[#FAF0E4]/15 to-[#EDE3D6]/20 pointer-events-none" />
      )}
      {/* Subtle texture overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#CFA06B]/8 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 relative">
        <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
          <Link href="#home" className="flex-shrink-0 group relative z-10">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center group-hover:scale-110 group-active:scale-105 transition-all duration-500">
              {/* Hidden Image for Next.js preload & priority hint */}
              <Image
                src="/monogram/monogram.png"
                alt="Monogram"
                width={56}
                height={56}
                priority
                className="sr-only"
              />
              {/* Gradient-tinted monogram via CSS mask */}
              <div
                role="img"
                aria-label="Monogram"
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(135deg, #B8E4F9 0%, #89CFF0 35%, #4FC3F7 65%, #0ea5e9 100%)',
                  WebkitMaskImage: 'url(/monogram/monogram.png)',
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskImage: 'url(/monogram/monogram.png)',
                  maskSize: 'contain',
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                }}
              />
            </div>

            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#89CFF0]/35 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
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
                      ? "text-[#1a5a7a] bg-white/70 backdrop-blur-md shadow-[0_6px_18px_rgba(137,207,240,0.35)] border border-[#89CFF0]"
                      : "text-[#1a5a7a]/80 hover:text-[#1a5a7a] hover:bg-white/70 hover:border hover:border-[#89CFF0]/60 hover:shadow-[0_6px_18px_rgba(137,207,240,0.25)] hover:scale-105 active:scale-95 bg-white/0 border border-transparent"
                  }`}
                  style={{ fontFamily: '"Montserrat", sans-serif', fontWeight: 400 }}
                >
                  {link.label.toUpperCase()}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#4aa8d8] via-[#89CFF0] to-[#4aa8d8] transition-all duration-500 rounded-full ${
                      isActive
                        ? "w-full shadow-[0_0_10px_rgba(137,207,240,0.55)]"
                        : "w-0 group-hover:w-full group-hover:shadow-[0_0_8px_rgba(137,207,240,0.40)]"
                    }`}
                  />
                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#4aa8d8] animate-pulse shadow-[0_0_6px_rgba(137,207,240,0.70)]" />
                  )}
                  {/* Subtle accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#89CFF0]/25 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </Link>
              )
            })}
          </div>

          <div className="md:hidden flex items-center h-full">
            {/* Decorative halo to improve tap target and visual affordance */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#89CFF0]/30 via-[#B8E4F9]/22 to-transparent blur-md pointer-events-none" />
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
