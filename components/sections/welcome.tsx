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
              className="flex flex-col items-center"
              style={{ marginBottom: "clamp(0.8rem, 2.5vw, 1.2rem)", gap: "clamp(0.1rem, 0.8vw, 0.3rem)" }}
            >
              {/* First name */}
              <span
                className="lora-regular"
                style={{
                  fontSize: "clamp(3rem, 13vw, 6rem)",
                  color: DEEP,
                  lineHeight: 1,
                  letterSpacing: "0.05em",
                  textShadow: `0 3px 32px rgba(139,111,90,0.22)`,
                  display: "block",
                }}
              >
                Kaezar
              </span>

              {/* Thin inline rule */}
              <span className="flex items-center gap-2" style={{ width: "clamp(120px, 35vw, 200px)", margin: "clamp(0.2rem, 1vw, 0.4rem) 0" }}>
                {/* <span className="flex-1 h-px" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.45), transparent)` }} />
                <span style={{ color: ACCENT, fontSize: "0.42rem", letterSpacing: "0.2em" }}>◆</span>
                <span className="flex-1 h-px" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.45), transparent)` }} /> */}
              </span>

              {/* Last name */}
              <span
                className="lora-regular"
                style={{
                  fontSize: "clamp(1.1rem, 5vw, 2.1rem)",
                  color: MEDIUM,
                  lineHeight: 1.2,
                  letterSpacing: "0.20em",
                  textTransform: "uppercase",
                  textShadow: `0 2px 18px rgba(139,111,90,0.14)`,
                  display: "block",
                }}
              >
                Isaiahnuel Galardo
              </span>
            </h2>

            {/* ── Long ornamental divider ── */}
            <div className="flex items-center justify-center gap-2 w-full max-w-[240px] mb-[clamp(1.2rem,3.5vw,2rem)]">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${ACCENT}, transparent)`, opacity: 0.35 }} />
              <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.7, letterSpacing: "0.3em" }}>✦</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${ACCENT}, transparent)`, opacity: 0.35 }} />
            </div>

            {/* ── Section heading ── */}
            <h3
              className="cinzel"
              style={{
                fontSize: "clamp(0.9rem, 3.8vw, 1.35rem)",
                fontWeight: 600,
                color: DEEP,
                letterSpacing: "0.08em",
                lineHeight: 1.5,
                marginBottom: "clamp(1rem, 3vw, 1.5rem)",
                textTransform: "uppercase",
              }}
            >
              Welcome to this Blessed Beginning
            </h3>

            {/* ── Bible verse block ── */}
            <div
              className="w-full mb-[clamp(1.4rem,4vw,2.2rem)] relative"
              style={{
                background: `linear-gradient(150deg, rgba(207,160,107,0.10) 0%, rgba(245,230,211,0.20) 50%, rgba(207,160,107,0.08) 100%)`,
                border: `1px solid rgba(207,160,107,0.28)`,
                borderRadius: "12px",
                padding: "clamp(1rem, 3.5vw, 1.6rem) clamp(1.4rem, 5vw, 2.4rem)",
              }}
            >
              <div
                className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                style={{ background: `linear-gradient(to bottom, transparent, ${ACCENT}, transparent)` }}
              />
              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.88rem, 3.4vw, 1.08rem)",
                  color: DEEP,
                  fontStyle: "italic",
                  lineHeight: 2,
                  marginBottom: "0.6rem",
                  letterSpacing: "0.01em",
                }}
              >
                &ldquo;When the time is right, I, the Lord, will make it happen.&rdquo;
              </p>
              <p
                className="cinzel"
                style={{
                  fontSize: "clamp(0.52rem, 1.8vw, 0.68rem)",
                  color: ACCENT,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                — Isaiah 60:22
              </p>
            </div>

            {/* ── Body paragraphs ── */}
            <div
              className="w-full flex flex-col"
              style={{ gap: "clamp(1rem, 3.2vw, 1.5rem)", marginBottom: "clamp(1.6rem, 5vw, 2.6rem)" }}
            >
              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.82rem, 3vw, 1rem)",
                  color: DEEP,
                  lineHeight: 2,
                  textAlign: "center",
                  letterSpacing: "0.01em",
                }}
              >
                With hearts full of gratitude and joy, we invite you to witness
                and celebrate the Christening of our beloved son,{" "}
                <span style={{ color: ACCENT, fontStyle: "italic", fontWeight: 700 }}>
                  Kaezar Isaiahnuel Galardo.
                </span>
              </p>

              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.82rem, 3vw, 1rem)",
                  color: MEDIUM,
                  lineHeight: 2,
                  textAlign: "center",
                  letterSpacing: "0.01em",
                }}
              >
                This sacred moment marks the beginning of his spiritual journey —
                welcoming him into God&apos;s loving embrace and the Christian faith.
                It is a day of blessing, hope, and thanksgiving as we entrust his
                life to His guidance and grace.
              </p>

              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.82rem, 3vw, 1rem)",
                  color: DEEP,
                  lineHeight: 2,
                  textAlign: "center",
                  letterSpacing: "0.01em",
                  opacity: 0.88,
                }}
              >
                We are deeply thankful for the love and support that surround
                our family. Your presence, prayers, and shared joy mean so much
                to us — it would truly be a blessing to have you with us as we
                celebrate this meaningful milestone.
              </p>

              <p
                className="lora-regular"
                style={{
                  fontSize: "clamp(0.82rem, 3vw, 1rem)",
                  color: MEDIUM,
                  lineHeight: 2,
                  textAlign: "center",
                  letterSpacing: "0.01em",
                  opacity: 0.85,
                }}
              >
                As you prepare to join us, please feel free to explore the
                details and reminders for the day. We look forward to
                celebrating this beautiful occasion together.
              </p>
            </div>

            {/* ── Rule before sign-off ── */}
            <div className="flex items-center justify-center gap-3 w-full max-w-[200px] mb-[clamp(0.9rem,2.8vw,1.4rem)]">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, rgba(207,160,107,0.42), transparent)` }} />
              <span style={{ color: ACCENT, fontSize: "5px", letterSpacing: "0.2em" }}>◆</span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(207,160,107,0.42), transparent)` }} />
            </div>

            {/* ── Sign-off ── */}
            <p
              className="cinzel"
              style={{
                fontSize: "clamp(0.52rem, 1.9vw, 0.68rem)",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: MEDIUM,
                marginBottom: "0.4rem",
                paddingRight: "0.38em",
              }}
            >
              With love,
            </p>
            <p
              className="lora-regular"
              style={{
                fontSize: "clamp(1.5rem, 6vw, 2.6rem)",
                color: DEEP,
                lineHeight: 1.2,
                letterSpacing: "0.04em",
                textShadow: `0 3px 24px rgba(139,111,90,0.18)`,
              }}
            >
              The Galardo Family
            </p>

          </div>
          {/* ─────────────────────────────────────────────────────── */}
        </div>
      </div>
    </Section>
  )
}
