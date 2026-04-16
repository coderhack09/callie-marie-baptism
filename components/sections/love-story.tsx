"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { StorySection } from "@/components/StorySection"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"
const CREAM  = "#F5E6D3"

export function LoveStory() {
  return (
    <div className="min-h-screen overflow-x-hidden" style={{ backgroundColor: CREAM }}>

      {/* ── Section header ── */}
      <div className="relative text-center px-4 pt-14 pb-2 sm:pt-18 sm:pb-4">

        {/* Corner florals */}
        <Image src="/decoration/top-left.png"  alt="" width={180} height={180} aria-hidden
          className="absolute top-0 left-0 pointer-events-none select-none w-20 sm:w-28 md:w-36 opacity-50" />
        <Image src="/decoration/top-right.png" alt="" width={180} height={180} aria-hidden
          className="absolute top-0 right-0 pointer-events-none select-none w-20 sm:w-28 md:w-36 opacity-50" />

        {/* Eyebrow */}
        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.56rem, 2.2vw, 0.72rem)",
            letterSpacing: "0.48em",
            textTransform: "uppercase",
            color: MEDIUM,
            marginBottom: "0.5rem",
            paddingRight: "0.48em",
          }}
        >
          Her Story
        </p>

        {/* Top ornament */}
        <div className="flex items-center justify-center gap-3 mb-4 sm:mb-5">
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.4), transparent)` }} />
          <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.7 }}>✦</span>
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.4), transparent)` }} />
        </div>

        {/* Main heading */}
        <h2
          className="gistesy"
          style={{
            fontSize: "clamp(2.4rem, 10vw, 5.2rem)",
            color: ACCENT,
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            textShadow: `0 3px 32px rgba(207,160,107,0.28)`,
            marginBottom: "0.5rem",
          }}
        >
          A Little Piece of Heaven
        </h2>

        {/* Tagline */}
        <p
          className="garamond"
          style={{
            fontSize: "clamp(0.75rem, 3vw, 1rem)",
            letterSpacing: "0.1em",
            color: DEEP,
            fontStyle: "italic",
            opacity: 0.78,
            marginBottom: "0",
          }}
        >
          Wrapped in love, guided by faith, destined with purpose
        </p>
      </div>

      {/* ── Story sections ── */}
      <StorySection
        theme="light"
        layout="image-left"
        isFirst={true}
        imageSrc="/mobile_display/baby (21).jpg"
        text={
          <p>
            Niahna Celestine is a precious gift whose arrival came in the most unexpected yet
            divinely perfect way. From the very beginning, her life has been a testament to grace,
            reminding us that God&apos;s plans often unfold in ways we never anticipate but always
            need. She carries a gentle light within her — one that brings comfort, joy, and a
            quiet kind of strength to everyone around her.
          </p>
        }
      />

      <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/mobile_display/baby (11).jpg"
        text={
          <p>
            She is sweet-natured and full of wonder, discovering the world with curious eyes
            and an open heart. Her presence feels like a blessing — a constant reminder of
            love, hope, and faith. Though still young, there is something deeply special about
            her spirit: calm yet radiant, soft yet powerful.
          </p>
        }
      />

      <StorySection
        theme="light"
        layout="image-left"
        imageSrc="/mobile_display/baby (9).jpg"
        text={
          <p>
            Her name holds a beautiful meaning that reflects who she is.{" "}
            <em style={{ color: ACCENT }}>Niahna</em> is often associated with purpose,
            brightness, and grace — a soul with intention and light.{" "}
            <em style={{ color: ACCENT }}>Celestine</em> comes from the word &ldquo;celestial,&rdquo;
            meaning heavenly or divine, symbolising something pure, sacred, and touched by
            the heavens. Together, her name speaks of a{" "}
            <em style={{ color: ACCENT }}>&ldquo;heavenly light with a purpose&rdquo;</em> — a
            perfect reflection of the miracle she is.
          </p>
        }
      />

      <StorySection
        theme="dark"
        layout="image-right"
        isLast={true}
        imageSrc="/mobile_display/baby (13).jpg"
        text={
          <p>
            Niahna Celestine is more than a daughter — she is a blessing wrapped in love,
            a story written by God, and a living reminder that even the most unexpected moments
            can bring the most extraordinary joy.
          </p>
        }
      />

      {/* ── Footer / CTA ── */}
      <div
        className="relative text-center px-4 pt-10 pb-16 sm:pb-20 md:pb-24"
        style={{ backgroundColor: CREAM }}
      >
        {/* Bottom florals */}
        {/* <Image src="/decoration/bottom-left.png"  alt="" width={180} height={180} aria-hidden
          className="absolute bottom-0 left-0 pointer-events-none select-none w-20 sm:w-28 md:w-36 opacity-50" />
        <Image src="/decoration/right-bottom.png" alt="" width={180} height={180} aria-hidden
          className="absolute bottom-0 right-0 pointer-events-none select-none w-20 sm:w-28 md:w-36 opacity-50" /> */}

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to left, rgba(139,111,90,0.28), transparent)` }} />
          <span style={{ color: "#D4B896", fontSize: "5px" }}>◆</span>
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to right, rgba(139,111,90,0.28), transparent)` }} />
        </div>

        {/* CTA button */}
        <Link
          href="#details"
          className="garamond inline-flex items-center justify-center group relative"
          style={{
            color: CREAM,
            backgroundColor: DEEP,
            border: `1px solid ${DEEP}`,
            borderRadius: "2px",
            padding: "clamp(0.55rem, 1.8vw, 0.8rem) clamp(1.6rem, 5vw, 2.8rem)",
            fontSize: "clamp(0.62rem, 2.2vw, 0.8rem)",
            letterSpacing: "0.46em",
            textTransform: "uppercase",
            textDecoration: "none",
            transition: "background-color 250ms, border-color 250ms, transform 150ms",
            paddingRight: `calc(clamp(1.6rem, 5vw, 2.8rem) + 0.46em)`,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = ACCENT
            ;(e.currentTarget as HTMLElement).style.borderColor = ACCENT
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.backgroundColor = DEEP
            ;(e.currentTarget as HTMLElement).style.borderColor = DEEP
          }}
        >
          Join Us
        </Link>
      </div>

    </div>
  )
}
