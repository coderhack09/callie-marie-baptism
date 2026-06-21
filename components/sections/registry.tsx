"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Gift, Heart, Mail, Sparkles } from "lucide-react"
import { siteConfig } from "@/content/site"
import { C, text } from "@/components/loader/christening-theme"
import { CornerFloralDecor } from "@/components/loader/ChristeningDecor"
import { ChristeningParticles } from "@/components/loader/ChristeningParticles"

const cardStyle = {
  background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 48%, ${C.champagne} 100%)`,
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
} as const

const innerPanelStyle = {
  background: C.pearl,
  border: `1.5px solid ${C.blushDeep}`,
} as const

const childName = siteConfig.couple.child.split(" ")[0]

const ENVELOPE_OPTION = {
  id: "envelope",
  label: "Envelope",
  type: "envelope" as const,
}

const QR_OPTIONS = Object.values(siteConfig.giftRegistry).map((item) => ({
  ...item,
  type: "qr" as const,
}))

type RegistryOption =
  | typeof ENVELOPE_OPTION
  | (typeof QR_OPTIONS)[number]

const REGISTRY_OPTIONS: RegistryOption[] = [ENVELOPE_OPTION, ...QR_OPTIONS]

export function Registry() {
  const [activeId, setActiveId] = useState(ENVELOPE_OPTION.id)
  const activeItem =
    REGISTRY_OPTIONS.find((item) => item.id === activeId) ?? ENVELOPE_OPTION

  return (
    <section id="registry" className="relative w-full overflow-hidden bg-transparent py-14 sm:py-16 md:py-20">
      <ChristeningParticles scoped opacity={0.38} />
      <CornerFloralDecor opacity={0.68} sizeClass="w-20 sm:w-32 md:w-40 lg:w-48" />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-3 sm:px-4 md:px-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Section header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-block rounded-3xl px-8 py-7 sm:px-12 sm:py-9 isolate" style={cardStyle}>
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.58rem, 2vw, 0.72rem)",
              fontWeight: 600,
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: C.goldDeep,
              marginBottom: "0.5rem",
              paddingRight: "0.36em",
            }}>
              A Loving Thought
            </p>

            <h2 style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              fontSize: "clamp(1.8rem, 7vw, 3rem)",
              color: C.roseDeep,
              lineHeight: 1.1,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "0.5rem",
            }}>
              Gift Note
            </h2>

            <div className="h-px mx-6 sm:mx-10 mb-4" style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, opacity: 0.55 }} />

            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
              color: text.body,
              lineHeight: 1.8,
              fontStyle: "italic",
              maxWidth: "28rem",
              margin: "0 auto",
            }}>
              Your love and presence mean the world to our little family.
            </p>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden isolate" style={cardStyle}>
          {/* Message */}
          <div className="relative p-6 sm:p-9 text-center overflow-hidden" style={{ background: C.pearl }}>
            <span
              className="absolute top-3 left-5 select-none pointer-events-none"
              style={{ fontSize: "5rem", lineHeight: 1, color: C.goldDeep, opacity: 0.10, fontFamily: "Georgia, serif" }}
            >
              &#8220;
            </span>
            <span
              className="absolute bottom-3 right-5 select-none pointer-events-none"
              style={{ fontSize: "5rem", lineHeight: 1, color: C.goldDeep, opacity: 0.10, fontFamily: "Georgia, serif" }}
            >
              &#8221;
            </span>

            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-md mx-auto mb-5"
              style={{
                background: C.blushSoft,
                border: `2px solid ${C.blushDeep}`,
                boxShadow: "0 4px 16px rgba(201,168,108,0.18)",
              }}
            >
              <Gift className="w-6 h-6" style={{ color: C.goldDeep }} />
            </div>

            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontSize: "clamp(0.92rem, 2.8vw, 1.05rem)",
              color: C.roseDeep,
              lineHeight: 1.95,
              fontStyle: "italic",
              marginBottom: "0.75rem",
              maxWidth: "36rem",
              marginInline: "auto",
            }}>
              &ldquo;Your love, prayers, and presence are the greatest gifts I could ever receive.&rdquo;
            </p>
            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontSize: "clamp(0.84rem, 2.6vw, 0.98rem)",
              color: text.body,
              lineHeight: 1.9,
              maxWidth: "36rem",
              marginInline: "auto",
            }}>
              Should you wish to bless me with something more, Mommy and Daddy would sincerely appreciate a small contribution toward my future and the many adventures waiting for me ahead.
            </p>
          </div>

          {/* Ways to bless + toggle */}
          <div className="p-5 sm:p-7 border-t" style={{ background: C.blushSoft, borderColor: C.blushDeep }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${C.gold})`, opacity: 0.45 }} />
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" style={{ color: C.goldDeep, opacity: 0.75 }} />
                <p style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(0.52rem, 1.8vw, 0.64rem)",
                  fontWeight: 600,
                  letterSpacing: "0.36em",
                  textTransform: "uppercase",
                  color: text.label,
                }}>
                  Ways to Bless Me
                </p>
                <Sparkles className="w-3 h-3" style={{ color: C.goldDeep, opacity: 0.75 }} />
              </div>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${C.gold})`, opacity: 0.45 }} />
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
              {REGISTRY_OPTIONS.map((item) => {
                const isActive = activeId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className="px-3 sm:px-5 py-2 rounded-full transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      fontFamily: '"Cinzel", serif',
                      fontSize: "clamp(0.62rem, 2vw, 0.76rem)",
                      letterSpacing: "0.06em",
                      background: isActive ? C.roseDeep : C.pearl,
                      color: isActive ? C.pearl : C.roseDeep,
                      border: isActive ? `1.5px solid ${C.roseDeep}` : `1.5px solid ${C.blushDeep}`,
                      boxShadow: isActive ? "0 4px 16px rgba(107,61,79,0.22)" : "0 2px 8px rgba(232,196,204,0.15)",
                    }}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            <div className="rounded-2xl p-5 sm:p-8 text-center mx-auto max-w-md isolate" style={innerPanelStyle}>
              {activeItem.type === "envelope" ? (
                <>
                  <div
                    className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 mx-auto mb-4"
                    style={{ borderColor: C.blushDeep, background: C.ivory }}
                  >
                    <Mail className="w-10 h-10" style={{ color: C.goldDeep }} />
                    <p style={{
                      fontFamily: '"Cinzel", serif',
                      fontSize: "clamp(0.58rem, 1.6vw, 0.66rem)",
                      color: text.caption,
                      letterSpacing: "0.06em",
                    }}>
                      on the day
                    </p>
                  </div>
                  <p style={{
                    fontFamily: '"Cinzel", serif',
                    fontWeight: 600,
                    fontSize: "clamp(0.92rem, 2.8vw, 1.05rem)",
                    color: C.roseDeep,
                    marginBottom: "0.5rem",
                  }}>
                    Envelope
                  </p>
                  <p style={{
                    fontFamily: '"Fahkwang", sans-serif',
                    fontSize: "clamp(0.78rem, 2.4vw, 0.92rem)",
                    color: text.body,
                    lineHeight: 1.7,
                  }}>
                    A little envelope shared personally on my special day
                  </p>
                </>
              ) : (
                <>
                  <p style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
                    color: C.goldDeep,
                    lineHeight: 1.2,
                    marginBottom: "1rem",
                  }}>
                    {activeItem.label}
                  </p>
                  <div
                    className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-2 shadow-md mx-auto mb-4"
                    style={{ background: C.pearl, borderColor: C.blushDeep }}
                  >
                    <Image
                      src={activeItem.src}
                      alt={`${activeItem.label} QR code`}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 640px) 208px, 288px"
                    />
                  </div>
                  <p style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: "clamp(0.52rem, 1.8vw, 0.64rem)",
                    fontWeight: 600,
                    letterSpacing: "0.36em",
                    textTransform: "uppercase",
                    color: text.label,
                    marginBottom: "0.35rem",
                  }}>
                    Account Number
                  </p>
                  <p style={{
                    fontFamily: '"Cinzel", serif',
                    fontWeight: 600,
                    fontSize: "clamp(0.82rem, 2.5vw, 0.95rem)",
                    color: C.roseDeep,
                  }}>
                    {activeItem.accountNumber}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Thank you */}
          <div className="px-5 sm:px-8 py-5 text-center border-t" style={{ background: C.champagne, borderColor: C.blushDeep }}>
            <div className="flex items-center justify-center gap-1.5 mb-2">
              {[0.45, 0.65, 0.85].map((op, i) => (
                <Heart key={i} className="w-3 h-3" fill={C.goldDeep} style={{ color: C.goldDeep, opacity: op }} />
              ))}
            </div>
            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontSize: "clamp(0.82rem, 2.5vw, 0.95rem)",
              color: text.body,
              fontStyle: "italic",
              lineHeight: 1.8,
              marginBottom: "1rem",
            }}>
              Thank you for your kindness, love, and generosity toward my future adventures.
            </p>
            <p style={{
              fontFamily: '"LeJourScript", cursive',
              fontSize: "clamp(1.2rem, 4.5vw, 1.8rem)",
              color: C.goldDeep,
              lineHeight: 1.1,
            }}>
              With love,
            </p>
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              fontSize: "clamp(1.4rem, 5vw, 2rem)",
              color: C.roseDeep,
              marginTop: "0.15rem",
            }}>
              {childName}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
