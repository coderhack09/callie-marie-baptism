"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { StorySection } from "@/components/StorySection"

// ── Palette ───────────────────────────────────────────────────────────────────
const DEEP   = "#3D2810"
const MEDIUM = "#8C6035"
const ACCENT = "#B8822A"
const GOLD   = "#B8822A"
const BLUSH  = "#EED4BC"
const IVORY  = "#FEF9F3"
const BABY_BLUE = "#3FA3C8"
const BLUE_MID  = "#7BBEDD"

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 420, h: 420, top: "2%",  left: "0%",  color: BABY_BLUE, opacity: 0.10, blur: 110 },
    { w: 280, h: 280, top: "16%", left: "66%", color: GOLD,      opacity: 0.10, blur: 85  },
    { w: 320, h: 320, top: "48%", left: "5%",  color: BLUSH,     opacity: 0.13, blur: 95  },
    { w: 240, h: 240, top: "63%", left: "74%", color: BABY_BLUE, opacity: 0.10, blur: 75  },
    { w: 200, h: 200, top: "34%", left: "42%", color: GOLD,      opacity: 0.08, blur: 65  },
    { w: 180, h: 180, top: "80%", left: "30%", color: BABY_BLUE, opacity: 0.09, blur: 60  },
    { w: 160, h: 160, top: "10%", left: "45%", color: BLUSH,     opacity: 0.08, blur: 55  },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {orbs.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.w, height: o.h,
            top: o.top, left: o.left,
            background: o.color,
            opacity: o.opacity,
            filter: `blur(${o.blur}px)`,
          }}
        />
      ))}
    </div>
  )
}

// ── Section header ────────────────────────────────────────────────────────────
function SectionHeader({
  eyebrow,
  heading,
  tagline,
}: {
  eyebrow: string
  heading: string
  tagline: string
}) {
  return (
    <div className="relative text-center px-4 pt-14 pb-4 sm:pt-18 sm:pb-6 z-10">
      {/* Corner florals */}
      <Image src="/decoration/left-top-removebg-preview.png"  alt="" width={180} height={180} aria-hidden
        className="absolute top-0 left-0 pointer-events-none select-none w-20 sm:w-28 md:w-36 opacity-45" />
      <Image src="/decoration/right-top-removebg-preview.png" alt="" width={180} height={180} aria-hidden
        className="absolute top-0 right-0 pointer-events-none select-none w-20 sm:w-28 md:w-36 opacity-45" />

        <p
          className="cinzel"
          style={{
            fontSize: "clamp(0.52rem, 2vw, 0.66rem)",
            letterSpacing: "0.52em",
            textTransform: "uppercase",
            color: BABY_BLUE,
            marginBottom: "0.5rem",
            paddingRight: "0.52em",
          }}
        >
          {eyebrow}
        </p>

        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to left, ${GOLD}88, transparent)` }} />
          <span style={{ color: GOLD, fontSize: "8px", opacity: 0.9 }}>✦</span>
          <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to right, ${GOLD}88, transparent)` }} />
        </div>

        <h2
          className="lora-regular"
          style={{
            fontSize: "clamp(2rem, 9vw, 4.5rem)",
            color: DEEP,
            lineHeight: 1.1,
            letterSpacing: "0.03em",
            marginBottom: "0.5rem",
          }}
        >
          {heading}
        </h2>

        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="h-px w-6 sm:w-10" style={{ background: `linear-gradient(to left, ${BLUE_MID}cc, transparent)` }} />
          <span style={{ color: BLUE_MID, fontSize: "4px" }}>◆◆◆</span>
          <div className="h-px w-6 sm:w-10" style={{ background: `linear-gradient(to right, ${BLUE_MID}cc, transparent)` }} />
        </div>

        <p
          className="lora-regular"
          style={{
            fontSize: "clamp(0.75rem, 3vw, 1rem)",
            letterSpacing: "0.06em",
            color: MEDIUM,
            fontStyle: "italic",
          }}
        >
          {tagline}
        </p>
    </div>
  )
}

export function LoveStory() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* ── Solid ivory base ── */}
      <div className="absolute inset-0 -z-10" style={{ background: IVORY }} />

      {/* Multi-stop tinted gradient — vertical rhythm */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `
          linear-gradient(180deg,
            rgba(215,237,248,0.50) 0%,
            rgba(251,244,234,0.0)  18%,
            rgba(213,238,248,0.32) 38%,
            rgba(251,244,234,0.0)  55%,
            rgba(213,238,248,0.28) 72%,
            rgba(238,212,188,0.38) 100%
          )
        `,
      }} />

      {/* Diagonal colour wash — adds gentle horizontal warmth */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(105deg, rgba(238,212,188,0.18) 0%, transparent 40%, rgba(213,238,248,0.18) 100%)`,
      }} />

      {/* Fine diagonal shimmer */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `repeating-linear-gradient(
          125deg,
          transparent 0px,
          transparent 160px,
          rgba(255,255,255,0.22) 160px,
          rgba(255,255,255,0.22) 162px
        )`,
      }} />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(184,130,42,0.07) 1px, transparent 1px)`,
        backgroundSize: "34px 34px",
      }} />

      <BokehOrbs />

      {/* Multi-point radial depth */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 55% 45% at 50% 20%,  rgba(63,163,200,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 40% 35% at 50% 78%,  rgba(184,130,42,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 30% 30% at 5%  50%,  rgba(63,163,200,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 28% 28% at 95% 50%,  rgba(238,212,188,0.12) 0%, transparent 55%)
          `,
        }} />
      </div>

      {/* ── My Story ── */}
      <SectionHeader
        eyebrow="My Story"
        heading="A Little Piece of Heaven"
        tagline="Wrapped in love, guided by faith, destined with purpose"
      />

      {/* Section 1 */}
      <StorySection
        theme="light"
        layout="image-left"
        isFirst={true}
        imageSrc="/desktop_background/image00006.jpeg"
        title="Hello, Family & Friends!"
        text={
          <>
            <p>
              Mommy and Daddy prayed so hard for me long before I was finally placed in their arms.
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              Before I was born, there were many tears, silent prayers, waiting, hoping, and trusting
              in God&apos;s perfect timing. My parents went through difficult season of infertility
              and loss, but they{" "}
              <em style={{ color: ACCENT }}>never gave up on me.</em>
            </p>
          </>
        }
      />

      {/* Section 2 */}
      <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/desktop_background/image00007.jpeg"
        text={
          <>
            <p>
              Through God&apos;s grace, endless faith, and the beautiful gift of science, I finally
              came into this world —{" "}
              <em>loved long before my first heartbeat.</em>
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              Mommy says I am her greatest miracle.
              <br />
              Daddy says I am his answered prayer.
            </p>
          </>
        }
      />

      {/* Section 3 */}
      <StorySection
        theme="light"
        layout="image-left"
        imageSrc="/desktop_background/image00005.jpeg"
        text={
          <>
            <p>
              And now, I am about to take my very first step in faith as I receive the
              sacrament of{" "}
              <em style={{ color: ACCENT }}>Holy Baptism.</em>
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              I may still be little, but I already know how blessed I am to be surrounded
              by people who prayed for me, loved me, and waited for me.
            </p>
          </>
        }
      />

      {/* Section 4 */}
      <StorySection
        theme="dark"
        layout="image-right"
        imageSrc="/desktop_background/image00004.jpeg"
        text={
          <p>
            So with{" "}
            <em>tiny hands and a full heart,</em>{" "}
            I would love to invite you to celebrate this very special day with me as I
            am welcomed into{" "}
            <em>God&apos;s family.</em>
          </p>
        }
      />

      {/* ── How I Got My Name ── */}
      <SectionHeader
        eyebrow="His Name"
        heading="How I Got My Name"
        tagline={"Faith, family, prayers, love, and God's perfect timing"}
      />

      {/* Name intro */}
      <StorySection
        theme="light"
        layout="image-left"
        imageSrc="/desktop_background/image00008.jpeg"
        title="How I Got My Name"
        text={
          <p>
            Mommy and Daddy carefully chose my name with so much love because they wanted it
            to carry pieces of family, faith, and meaning that I will forever hold close to
            my heart.
          </p>
        }
      />

      {/* KAEZAR */}
      <StorySection
        theme="dark"
        variant="text-only"
        text={
          <p>
            <strong style={{ color: BABY_BLUE, letterSpacing: "0.12em" }}>KAEZAR</strong>
            {" — "}My first name was inspired by my Grandpa &ldquo;Cesar.&rdquo; A name passed
            down with love, strength, and honor — a reminder of family roots and the people who
            came before me.
          </p>
        }
      />

      {/* ISAIAH */}
      <StorySection
        theme="light"
        variant="text-only"
        text={
          <>
            <p>
              <strong style={{ color: ACCENT, letterSpacing: "0.12em" }}>ISAIAH</strong>
              {" — "}My second name comes from the beautiful Bible verse Isaiah 60:22:
            </p>
            <p style={{ marginTop: "0.75rem", fontStyle: "italic", opacity: 0.9 }}>
              &ldquo;When the time is right, I, the Lord, will make it happen.&rdquo;
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              Mommy and Daddy held onto this verse throughout their journey while praying and
              waiting for me. It became a promise they carried in their hearts until God
              finally brought me into their lives at the perfect time.
            </p>
          </>
        }
      />

      {/* NUEL + closing */}
      <StorySection
        theme="dark"
        variant="text-only"
        isLast={true}
        text={
          <>
            <p>
              <strong style={{ color: BABY_BLUE, letterSpacing: "0.12em" }}>NUEL</strong>
              {" — "}Part of my second name was lovingly taken from my Grandpa &ldquo;Manuel,&rdquo;
              another special person whose love and legacy will always be part of who I am.
            </p>
            <p style={{ marginTop: "0.75rem" }}>
              Together, my name tells a story of faith, family, prayers, love, and{" "}
              <em>God&apos;s perfect timing.</em>
            </p>
          </>
        }
      />

      {/* ── Footer / CTA ── */}
      <div className="relative z-10 text-center px-4 pt-10 pb-16 sm:pb-20 md:pb-24">

        {/* Bottom floral corners */}
        <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={180} height={180} aria-hidden
          className="absolute bottom-0 left-0 pointer-events-none select-none w-20 sm:w-28 md:w-36 opacity-40" />
        <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={180} height={180} aria-hidden
          className="absolute bottom-0 right-0 pointer-events-none select-none w-20 sm:w-28 md:w-36 opacity-40" />

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${GOLD}70, transparent)` }} />
          <span style={{ color: GOLD, fontSize: "7px", opacity: 0.8 }}>✦</span>
          <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${GOLD}70, transparent)` }} />
        </div>

        <Link
          href="#details"
          className="cinzel inline-flex items-center justify-center group relative rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
          style={{
            color: "#fff",
            background: `linear-gradient(135deg, ${BABY_BLUE}, #2E8CB0)`,
            border: `1px solid rgba(255,255,255,0.30)`,
            boxShadow: `0 6px 28px rgba(63,163,200,0.35), 0 2px 10px rgba(63,163,200,0.18)`,
            padding: "clamp(0.6rem, 1.8vw, 0.85rem) clamp(1.8rem, 5vw, 3rem)",
            fontSize: "clamp(0.62rem, 2.2vw, 0.78rem)",
            letterSpacing: "0.46em",
            textTransform: "uppercase",
            textDecoration: "none",
            paddingRight: `calc(clamp(1.8rem, 5vw, 3rem) + 0.46em)`,
          }}
        >
          Join Us
        </Link>

        <p
          className="garamond mt-5"
          style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.84rem)", color: MEDIUM, fontStyle: "italic", opacity: 0.7 }}
        >
          It would be a joy to celebrate with you.
        </p>
      </div>

    </div>
  )
}
