"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "motion/react"
import { Gift, Heart, Mail, Sparkles } from "lucide-react"
import { siteConfig } from "@/content/site"

const NAVY        = "#2B4A6B"
const DARK_NAVY   = "#1C3050"
const GOLD        = "#C4965A"
const NAVY_MUTE   = "rgba(65,90,115,0.78)"
const GOLD_BORDER = "rgba(196,152,88,0.28)"

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

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-2" style={{ maxWidth: "240px", margin: "0 auto" }}>
      <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
      <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)", flexShrink: 0 }} />
      <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
    </div>
  )
}

export function Registry() {
  const [activeId, setActiveId] = useState(ENVELOPE_OPTION.id)
  const activeItem =
    REGISTRY_OPTIONS.find((item) => item.id === activeId) ?? ENVELOPE_OPTION

  return (
    <section id="registry" className="relative w-full overflow-hidden py-14 sm:py-16 md:py-20">
      <div className="absolute inset-0 -z-10" style={{ background: "#FFFFFF" }} />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 45% at 50% 30%, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.6) 45%, transparent 75%)",
      }} />
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "linear-gradient(to top, rgba(120,175,215,0.10) 0%, rgba(120,175,215,0.04) 25%, transparent 55%)",
      }} />

      <motion.div
        className="relative z-10 max-w-3xl mx-auto px-3 sm:px-4 md:px-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="text-center mb-6 sm:mb-8">
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
            letterSpacing: "0.40em",
            textTransform: "uppercase",
            color: "rgba(72,112,148,0.80)",
            marginBottom: "0.4rem",
            paddingRight: "0.40em",
          }}>
            A Loving Thought
          </p>
          <OrnamentDivider />
          <h2 style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 600,
            fontSize: "clamp(2.2rem, 10vw, 4.8rem)",
            color: NAVY,
            lineHeight: 1.1,
            marginTop: "0.75rem",
            marginBottom: "0.75rem",
            filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
          }}>
            Gift Note
          </h2>
          <OrnamentDivider />
        </div>

        <div
          className="rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.30)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: "1.5px solid rgba(43,74,107,0.22)",
            boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
          }}
        >
          {/* Message */}
          <div className="relative p-6 sm:p-9 text-center overflow-hidden" style={{ background: "rgba(255,255,255,0.20)" }}>
            <span className="absolute top-3 left-5 select-none pointer-events-none"
              style={{ fontSize: "5rem", lineHeight: 1, color: GOLD, opacity: 0.08, fontFamily: "Georgia, serif" }}>
              &#8220;
            </span>
            <span className="absolute bottom-3 right-5 select-none pointer-events-none"
              style={{ fontSize: "5rem", lineHeight: 1, color: GOLD, opacity: 0.08, fontFamily: "Georgia, serif" }}>
              &#8221;
            </span>

            <div
              className="w-14 h-14 rounded-full flex items-center justify-center shadow-md mx-auto mb-5"
              style={{
                background: "rgba(196,152,88,0.10)",
                border: "2px solid rgba(196,152,88,0.35)",
                boxShadow: "0 0 22px rgba(196,152,88,0.12), 0 2px 8px rgba(43,74,107,0.08)",
              }}
            >
              <Gift className="w-6 h-6" style={{ color: GOLD }} />
            </div>

            <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.92rem, 2.8vw, 1.05rem)", color: NAVY, lineHeight: 1.95, fontStyle: "italic", marginBottom: "0.75rem", maxWidth: "36rem", marginInline: "auto" }}>
              &ldquo;Your love, prayers, and presence are the greatest gifts I could ever receive.&rdquo;
            </p>
            <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.84rem, 2.6vw, 0.98rem)", color: NAVY_MUTE, lineHeight: 1.9, maxWidth: "36rem", marginInline: "auto" }}>
              Should you wish to bless me with something more, Mommy and Daddy would sincerely appreciate a small contribution toward my future and the many adventures waiting for me ahead.
            </p>
          </div>

          {/* Ways to bless + toggle */}
          <div className="p-5 sm:p-7 border-t" style={{ background: "rgba(255,255,255,0.35)", borderColor: "rgba(43,74,107,0.12)" }}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35))" }} />
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" style={{ color: GOLD, opacity: 0.7 }} />
                <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.50rem, 1.7vw, 0.60rem)", letterSpacing: "0.36em", textTransform: "uppercase", color: "rgba(72,112,148,0.80)" }}>
                  Ways to Bless Me
                </p>
                <Sparkles className="w-3 h-3" style={{ color: GOLD, opacity: 0.7 }} />
              </div>
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, rgba(196,152,88,0.35))" }} />
            </div>

            {/* Toggle */}
            <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8">
              {REGISTRY_OPTIONS.map((item) => {
                const isActive = activeId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className="px-3 sm:px-5 py-2 rounded-full transition-all duration-200"
                    style={{
                      fontFamily: '"Cinzel", serif',
                      fontSize: "clamp(0.62rem, 2vw, 0.76rem)",
                      letterSpacing: "0.06em",
                      background: isActive ? DARK_NAVY : "rgba(255,255,255,0.55)",
                      color: isActive ? "#FFFFFF" : NAVY,
                      border: isActive ? `1.5px solid ${DARK_NAVY}` : `1.5px solid ${GOLD_BORDER}`,
                      boxShadow: isActive ? "0 4px 16px rgba(43,74,107,0.18)" : "none",
                    }}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>

            {/* Active panel */}
            <div
              className="rounded-2xl p-5 sm:p-8 text-center mx-auto max-w-md"
              style={{
                background: "rgba(255,255,255,0.40)",
                border: "1.5px solid rgba(43,74,107,0.18)",
              }}
            >
              {activeItem.type === "envelope" ? (
                <>
                  <div
                    className="w-40 h-40 sm:w-44 sm:h-44 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 mx-auto mb-4"
                    style={{ borderColor: GOLD_BORDER, background: "rgba(255,255,255,0.92)" }}
                  >
                    <Mail className="w-10 h-10" style={{ color: GOLD, opacity: 0.85 }} />
                    <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.58rem, 1.6vw, 0.66rem)", color: NAVY_MUTE, letterSpacing: "0.06em" }}>
                      on the day
                    </p>
                  </div>
                  <p style={{ fontFamily: '"Cinzel", serif', fontWeight: 600, fontSize: "clamp(0.92rem, 2.8vw, 1.05rem)", color: DARK_NAVY, marginBottom: "0.5rem" }}>
                    Envelope
                  </p>
                  <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.78rem, 2.4vw, 0.92rem)", color: NAVY_MUTE, lineHeight: 1.7 }}>
                    A little envelope shared personally on my special day
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(1rem, 3.5vw, 1.4rem)", color: GOLD, lineHeight: 1.2, marginBottom: "1rem" }}>
                    {activeItem.label}
                  </p>
                  <div
                    className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-2 shadow-md mx-auto mb-4"
                    style={{ background: "#fff", borderColor: GOLD_BORDER }}
                  >
                    <Image
                      src={activeItem.src}
                      alt={`${activeItem.label} QR code`}
                      fill
                      className="object-contain p-3"
                      sizes="(max-width: 640px) 208px, 288px"
                    />
                  </div>
                  <p style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.50rem, 1.7vw, 0.60rem)", letterSpacing: "0.36em", textTransform: "uppercase", color: "rgba(72,112,148,0.80)", marginBottom: "0.35rem" }}>
                    Account Number
                  </p>
                  <p style={{ fontFamily: '"Cinzel", serif', fontWeight: 600, fontSize: "clamp(0.82rem, 2.5vw, 0.95rem)", color: DARK_NAVY }}>
                    {activeItem.accountNumber}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Thank you */}
          <div className="px-5 sm:px-8 py-5 text-center border-t" style={{ background: "rgba(255,255,255,0.15)", borderColor: "rgba(43,74,107,0.12)" }}>
            <div className="flex items-center justify-center gap-1.5 mb-2">
              {[0.45, 0.65, 0.85].map((op, i) => (
                <Heart key={i} className="w-3 h-3" fill={GOLD} style={{ color: GOLD, opacity: op }} />
              ))}
            </div>
            <p style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.82rem, 2.5vw, 0.95rem)", color: NAVY_MUTE, fontStyle: "italic", lineHeight: 1.8, marginBottom: "1rem" }}>
              Thank you for your kindness, love, and generosity toward my future adventures.
            </p>
            <p style={{ fontFamily: '"LeJourScript", cursive', fontSize: "clamp(1.2rem, 4.5vw, 1.8rem)", color: GOLD, lineHeight: 1.1 }}>
              With love,
            </p>
            <p style={{ fontFamily: '"Cinzel", serif', fontWeight: 700, fontSize: "clamp(1.4rem, 5vw, 2rem)", color: DARK_NAVY, marginTop: "0.15rem" }}>
              {childName}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
