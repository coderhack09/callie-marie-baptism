"use client"

import Image from "next/image"
import { Section } from "@/components/section"

// ── Motif palette ────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"

export function Welcome() {
  return (
    <Section
      id="welcome"
      className="relative overflow-hidden bg-transparent py-14 sm:py-20 md:py-24"
    >
      {/* Corner floral decorations */}
      
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 md:px-8">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border"
          style={{
            borderColor: `rgba(207,160,107,0.25)`,
            background: `linear-gradient(170deg,
              rgba(253,248,242,0.95) 0%,
              rgba(245,230,211,0.88) 50%,
              rgba(253,248,242,0.95) 100%)`,
            boxShadow: `0 20px 64px rgba(139,111,90,0.12), 0 2px 10px rgba(139,111,90,0.06)`,
            padding: "clamp(1.8rem, 6vw, 3.5rem) clamp(1.4rem, 5vw, 3rem)",
          }}
        >
          {/* Top glow */}
          <div className="pointer-events-none absolute inset-0" aria-hidden
            style={{ background: `radial-gradient(ellipse 80% 40% at 50% 0%, rgba(207,160,107,0.09) 0%, transparent 65%)` }} />
          {/* Bottom glow */}
          <div className="pointer-events-none absolute inset-0" aria-hidden
            style={{ background: `radial-gradient(ellipse 60% 30% at 50% 100%, rgba(207,160,107,0.06) 0%, transparent 70%)` }} />
          {/* Inner hairline border */}
          <div className="pointer-events-none absolute inset-[1px] rounded-[inherit]" aria-hidden
            style={{ border: `1px solid rgba(207,160,107,0.12)` }} />

          {/* ─────────────────────────────────────────────────────── */}
          <div className="relative flex flex-col items-center text-center">

            {/* ── Eyebrow ── */}
            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.56rem, 2.2vw, 0.72rem)",
                letterSpacing: "0.5em",
                textTransform: "uppercase",
                color: ACCENT,
                marginBottom: "clamp(0.4rem, 1.5vw, 0.65rem)",
                paddingRight: "0.5em", /* optical compensation for trailing letter-spacing */
              }}
            >
              A Little Piece of Heaven
            </p>

            {/* ── "The Christening of" ── */}
            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.68rem, 2.6vw, 0.84rem)",
                letterSpacing: "0.18em",
                color: MEDIUM,
                marginBottom: "0.15rem",
              }}
            >
              The Christening of
            </p>

            {/* ── Name ── */}
            <h2
              className="gistesy"
              style={{
                fontSize: "clamp(2.6rem, 10.5vw, 5rem)",
                color: ACCENT,
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
                textShadow: `0 3px 32px rgba(207,160,107,0.32)`,
                marginBottom: "clamp(0.8rem, 2.5vw, 1.2rem)",
              }}
            >
              Niahna Celestine
            </h2>

            {/* ── Long ornamental divider ── */}
            <div className="flex items-center justify-center gap-2 w-full max-w-[240px] mb-[clamp(1.2rem,3.5vw,2rem)]">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${ACCENT}, transparent)`, opacity: 0.35 }} />
              <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.7, letterSpacing: "0.3em" }}>✦</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${ACCENT}, transparent)`, opacity: 0.35 }} />
            </div>

            {/* ── Section heading ── */}
            <h3
              className="garamond"
              style={{
                fontSize: "clamp(1.05rem, 4.2vw, 1.55rem)",
                fontWeight: 600,
                color: DEEP,
                letterSpacing: "0.01em",
                lineHeight: 1.4,
                marginBottom: "clamp(1rem, 3vw, 1.5rem)",
              }}
            >
              Welcome to this Blessed Beginning
            </h3>

            {/* ── Bible verse block — centered ── */}
            <div
              className="w-full mb-[clamp(1.2rem,3.5vw,2rem)]"
              style={{
                background: `rgba(207,160,107,0.07)`,
                border: `1px solid rgba(207,160,107,0.22)`,
                borderRadius: "10px",
                padding: "clamp(0.9rem, 3vw, 1.4rem) clamp(1rem, 4vw, 2rem)",
              }}
            >
              <p
                className="garamond"
                style={{
                  fontSize: "clamp(0.82rem, 3.2vw, 1.05rem)",
                  color: DEEP,
                  fontStyle: "italic",
                  lineHeight: 1.8,
                  marginBottom: "0.5rem",
                  letterSpacing: "0.01em",
                }}
              >
                "Children are a heritage from the Lord,<br />
                offspring a reward from Him."
              </p>
              <p
                className="garamond"
                style={{
                  fontSize: "clamp(0.6rem, 2vw, 0.74rem)",
                  color: ACCENT,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                — Psalm 127:3
              </p>
            </div>

            {/* ── Body paragraphs ── */}
            <div
              className="w-full flex flex-col"
              style={{ gap: "clamp(0.9rem, 3vw, 1.3rem)", marginBottom: "clamp(1.4rem, 4.5vw, 2.4rem)" }}
            >
              {[
                {
                  text: "With hearts full of gratitude and joy, we invite you to witness and celebrate the Christening of our beloved daughter,",
                  highlight: "Niahna Celestine.",
                },
                {
                  text: "This sacred moment marks the beginning of her spiritual journey — welcoming her into God's loving embrace and the Christian faith. It is a day of blessing, hope, and thanksgiving as we entrust her life to His guidance and grace.",
                  highlight: null,
                },
                {
                  text: "We are deeply thankful for the love and support that surround our family. Your presence, prayers, and shared joy mean so much to us, and it would truly be a blessing to have you with us as we celebrate this meaningful milestone.",
                  highlight: null,
                },
                {
                  text: "As you prepare to join us, please feel free to explore the details and reminders for the day. We look forward to celebrating this beautiful occasion together.",
                  highlight: null,
                },
              ].map((item, i) => (
                <p
                  key={i}
                  className="garamond"
                  style={{
                    fontSize: "clamp(0.78rem, 2.9vw, 0.97rem)",
                    color: DEEP,
                    lineHeight: 1.9,
                    textAlign: "center",
                    opacity: 0.9,
                  }}
                >
                  {item.text}{" "}
                  {item.highlight && (
                    <span style={{ color: ACCENT, fontStyle: "italic" }}>{item.highlight}</span>
                  )}
                </p>
              ))}
            </div>

            {/* ── Rule before sign-off ── */}
            <div className="flex items-center justify-center gap-2 w-full max-w-[180px] mb-[clamp(0.8rem,2.5vw,1.2rem)]">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(139,111,90,0.28), transparent)` }} />
              <span style={{ color: "#D4B896", fontSize: "5px" }}>◆</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(139,111,90,0.28), transparent)` }} />
            </div>

            {/* ── Sign-off ── */}
            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.58rem, 2vw, 0.72rem)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: MEDIUM,
                marginBottom: "0.2rem",
                paddingRight: "0.3em",
              }}
            >
              With love,
            </p>
            <p
              className="gistesy"
              style={{
                fontSize: "clamp(1.9rem, 7.5vw, 3.2rem)",
                color: ACCENT,
                lineHeight: 1.15,
                letterSpacing: "-0.01em",
                textShadow: `0 3px 24px rgba(207,160,107,0.25)`,
              }}
            >
              Niahna Celestine
            </p>

          </div>
          {/* ─────────────────────────────────────────────────────── */}
        </div>
      </div>
    </Section>
  )
}
