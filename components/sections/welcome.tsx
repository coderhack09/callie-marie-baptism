"use client"

import { Section } from "@/components/section"
import { siteConfig } from "@/content/site"

export function Welcome() {
  const parts      = siteConfig.couple.child.trim().split(" ")
  const givenName  = parts[0]
  const middleName = parts.length > 2 ? parts[1] : ""
  const familyName = parts[parts.length - 1]

  return (
    <Section
      id="welcome"
      className="relative overflow-hidden bg-transparent py-14 sm:py-20 md:py-24"
    >
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 md:px-8">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border"
          style={{
            borderColor: "rgba(196,152,88,0.28)",
            background: "linear-gradient(170deg, rgba(255,255,255,0.98) 0%, rgba(253,250,245,0.96) 50%, rgba(255,255,255,0.98) 100%)",
            boxShadow: "0 20px 64px rgba(43,74,107,0.08), 0 2px 10px rgba(43,74,107,0.05)",
            padding: "clamp(1.8rem, 6vw, 3.5rem) clamp(1.4rem, 5vw, 3rem)",
          }}
        >
          {/* Top spotlight */}
          <div className="pointer-events-none absolute inset-0" aria-hidden
            style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(196,152,88,0.07) 0%, transparent 65%)" }} />
          {/* Bottom water wash */}
          <div className="pointer-events-none absolute inset-0" aria-hidden
            style={{ background: "radial-gradient(ellipse 70% 35% at 50% 100%, rgba(120,175,215,0.10) 0%, transparent 70%)" }} />
          {/* Inner hairline */}
          <div className="pointer-events-none absolute inset-[1px] rounded-[inherit]" aria-hidden
            style={{ border: "1px solid rgba(196,152,88,0.10)" }} />

          <div className="relative flex flex-col items-center text-center">

            {/* ── Eyebrow label ── */}
            {/* <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.54rem, 2vw, 0.68rem)",
              letterSpacing: "0.44em",
              textTransform: "uppercase",
              color: "rgba(72,112,148,0.80)",
              marginBottom: "clamp(0.4rem, 1.4vw, 0.6rem)",
              paddingRight: "0.44em",
            }}>
              A Little Piece of Heaven
            </p> */}

            {/* ── "The Christening of" ── */}
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.62rem, 2.4vw, 0.78rem)",
              letterSpacing: "0.22em",
              color: "rgba(72,112,148,0.68)",
              marginBottom: "0.2rem",
              textTransform: "uppercase",
            }}>
              The Christening of
            </p>

            {/* ── Name ── */}
            <h2 className="flex flex-col items-center" style={{ marginBottom: "clamp(0.8rem, 2.5vw, 1.2rem)", gap: 0 }}>
              {/* KAEZAR — Cinzel Bold navy */}
              <span style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                fontSize: "clamp(3rem, 13vw, 6rem)",
                color: "#2B4A6B",
                lineHeight: 1.0,
                letterSpacing: "0.10em",
                textShadow: "0 2px 20px rgba(43,74,107,0.14)",
                display: "block",
              }}>
                {givenName.toUpperCase()}
              </span>

              {/* Isaiahnuel — LeJourScript gold */}
              {middleName && (
                <span style={{
                  fontFamily: '"LeJourScript", cursive',
                  fontSize: "clamp(1.8rem, 8vw, 3.8rem)",
                  color: "#C4965A",
                  lineHeight: 1.10,
                  letterSpacing: "0.02em",
                  display: "block",
                  filter: "drop-shadow(0 2px 6px rgba(196,152,88,0.16))",
                }}>
                  {middleName}
                </span>
              )}

              {/* Family name — Cinzel light navy */}
              <span style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 400,
                fontSize: "clamp(0.9rem, 4vw, 1.8rem)",
                color: "rgba(43,74,107,0.55)",
                lineHeight: 1.25,
                letterSpacing: "0.20em",
                textTransform: "uppercase",
                display: "block",
                marginTop: "clamp(0.1rem,0.5vw,0.3rem)",
              }}>
                {familyName}
              </span>
            </h2>

            {/* ── Diamond rule — matching Hero ── */}
            <div className="flex items-center justify-center gap-2 w-full max-w-[240px] mb-[clamp(1.2rem,3.5vw,2rem)]">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
              <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.65)" }} />
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
            </div>

            {/* ── Section heading ── */}
            <h3 style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              fontSize: "clamp(0.85rem, 3.6vw, 1.25rem)",
              color: "#1C3050",
              letterSpacing: "0.10em",
              lineHeight: 1.5,
              marginBottom: "clamp(1rem, 3vw, 1.5rem)",
              textTransform: "uppercase",
              textShadow: "0 1px 8px rgba(28,48,80,0.10)",
            }}>
              Welcome to this Blessed Beginning
            </h3>

            {/* ── Bible verse block ── */}
            <div
              className="w-full mb-[clamp(1.4rem,4vw,2.2rem)] relative"
              style={{
                background: "linear-gradient(150deg, rgba(196,152,88,0.07) 0%, rgba(255,255,255,0.60) 50%, rgba(120,175,215,0.06) 100%)",
                border: "1px solid rgba(196,152,88,0.22)",
                borderRadius: "12px",
                padding: "clamp(1rem, 3.5vw, 1.6rem) clamp(1.4rem, 5vw, 2.4rem)",
              }}
            >
              {/* Gold left accent bar */}
              <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                style={{ background: "linear-gradient(to bottom, transparent, #C4965A, transparent)" }} />
              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontWeight: 400,
                fontSize: "clamp(0.88rem, 3.2vw, 1.05rem)",
                color: "#2B4A6B",
                fontStyle: "italic",
                lineHeight: 1.9,
                marginBottom: "0.6rem",
                letterSpacing: "0.01em",
              }}>
                &ldquo;When the time is right, I, the Lord, will make it happen.&rdquo;
              </p>
              <p style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 600,
                fontSize: "clamp(0.50rem, 1.8vw, 0.65rem)",
                color: "#C4965A",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}>
                — Isaiah 60:22
              </p>
            </div>

            {/* ── Body paragraphs ── */}
            <div className="w-full flex flex-col" style={{ gap: "clamp(1rem, 3.2vw, 1.5rem)", marginBottom: "clamp(1.6rem, 5vw, 2.6rem)" }}>
              <p style={{
                fontFamily: '"Fahkwang", sans-serif', fontWeight: 400,
                fontSize: "clamp(0.80rem, 2.8vw, 0.96rem)",
                color: "rgba(43,74,107,0.82)",
                lineHeight: 1.9, textAlign: "center", letterSpacing: "0.01em",
              }}>
                With hearts full of gratitude and joy, we invite you to witness
                and celebrate the Christening of our beloved son,{" "}
                <span style={{ color: "#C4965A", fontStyle: "italic", fontWeight: 700 }}>
                  {siteConfig.couple.child}.
                </span>
              </p>

              <p style={{
                fontFamily: '"Fahkwang", sans-serif', fontWeight: 400,
                fontSize: "clamp(0.80rem, 2.8vw, 0.96rem)",
                color: "rgba(65,90,115,0.78)",
                lineHeight: 1.9, textAlign: "center", letterSpacing: "0.01em",
              }}>
                This sacred moment marks the beginning of his spiritual journey —
                welcoming him into God&apos;s loving embrace and the Christian faith.
                It is a day of blessing, hope, and thanksgiving as we entrust his
                life to His guidance and grace.
              </p>

              <p style={{
                fontFamily: '"Fahkwang", sans-serif', fontWeight: 400,
                fontSize: "clamp(0.80rem, 2.8vw, 0.96rem)",
                color: "rgba(43,74,107,0.72)",
                lineHeight: 1.9, textAlign: "center", letterSpacing: "0.01em",
              }}>
                We are deeply thankful for the love and support that surround
                our family. Your presence, prayers, and shared joy mean so much
                to us — it would truly be a blessing to have you with us as we
                celebrate this meaningful milestone.
              </p>

              <p style={{
                fontFamily: '"Fahkwang", sans-serif', fontWeight: 400,
                fontSize: "clamp(0.80rem, 2.8vw, 0.96rem)",
                color: "rgba(65,90,115,0.70)",
                lineHeight: 1.9, textAlign: "center", letterSpacing: "0.01em",
              }}>
                As you prepare to join us, please feel free to explore the
                details and reminders for the day. We look forward to
                celebrating this beautiful occasion together.
              </p>
            </div>

            {/* ── Diamond rule before sign-off ── */}
            <div className="flex items-center justify-center gap-2 w-full max-w-[200px] mb-[clamp(0.9rem,2.8vw,1.4rem)]">
              <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.42), transparent)" }} />
              <div style={{ width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.58)" }} />
              <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.42), transparent)" }} />
            </div>

            {/* ── Sign-off ── */}
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.50rem, 1.8vw, 0.65rem)",
              letterSpacing: "0.40em",
              textTransform: "uppercase",
              color: "rgba(72,112,148,0.68)",
              marginBottom: "0.4rem",
              paddingRight: "0.40em",
            }}>
              With love,
            </p>
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(1.0rem, 4vw, 2rem)",
              color: "rgba(43,74,107,0.55)",
              lineHeight: 1.2,
              letterSpacing: "0.02em",
            }}>
              The Galardo Family
            </p>

          </div>
        </div>
      </div>
    </Section>
  )
}
