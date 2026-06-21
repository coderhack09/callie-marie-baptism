"use client"

import { siteConfig } from "@/content/site"
import { C, nameStyles, text } from "@/components/loader/christening-theme"
import { DiamondRule } from "@/components/loader/ChristeningDecor"
import { ChristeningParticles } from "@/components/loader/ChristeningParticles"

export function Welcome() {
  const parts      = siteConfig.couple.child.trim().split(" ")
  const givenName  = parts[0]
  const middleName = parts[1] ?? ""
  const fullName   = siteConfig.couple.child

  return (
    <section
      id="welcome"
      className="relative overflow-hidden bg-transparent py-14 sm:py-20 md:py-24"
    >
      {/* Particles — outside card, section stays transparent */}
      <ChristeningParticles scoped opacity={0.55} />

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 md:px-8">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border isolate"
          style={{
            borderColor: C.blushDeep,
            background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 46%, ${C.champagne} 100%)`,
            boxShadow: "0 24px 70px rgba(107,61,79,0.10), 0 4px 16px rgba(232,196,204,0.25), inset 0 1px 0 rgba(255,255,255,0.90)",
            padding: "clamp(1.8rem, 6vw, 3.5rem) clamp(1.4rem, 5vw, 3rem)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{ background: `radial-gradient(ellipse 80% 40% at 50% 0%, ${C.blush} 0%, transparent 62%)`, opacity: 0.35 }}
          />
          <div
            className="pointer-events-none absolute inset-[1px] rounded-[inherit]"
            aria-hidden
            style={{ border: `1px solid rgba(201,168,108,0.22)` }}
          />

          <div className="relative flex flex-col items-center text-center">

            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.68rem, 2.5vw, 0.82rem)",
              fontWeight: 600,
              letterSpacing: "0.20em",
              color: text.label,
              marginBottom: "0.2rem",
              textTransform: "uppercase",
            }}>
              The Christening of
            </p>

            <h2 className="flex flex-col items-center" style={{ marginBottom: "clamp(0.8rem, 2.5vw, 1.2rem)", gap: 0 }}>
              <span style={{
                ...nameStyles.given,
                fontSize: "clamp(3rem, 13vw, 6rem)",
                letterSpacing: "0.10em",
                display: "block",
              }}>
                {givenName.toUpperCase()}
              </span>

              {middleName && (
                <span style={{
                  ...nameStyles.script,
                  fontSize: "clamp(1.8rem, 8vw, 3.8rem)",
                  display: "block",
                }}>
                  {middleName}
                </span>
              )}
            </h2>

            <DiamondRule width="clamp(200px, 55vw, 240px)" margin="0 0 clamp(1.2rem,3.5vw,2rem) 0" />

            <h3 style={{
              ...nameStyles.subtitle,
              fontSize: "clamp(0.85rem, 3.6vw, 1.25rem)",
              lineHeight: 1.5,
              marginBottom: "clamp(1rem, 3vw, 1.5rem)",
              whiteSpace: "normal",
            }}>
              Welcome to this Blessed Beginning
            </h3>

            <div
              className="w-full mb-[clamp(1.4rem,4vw,2.2rem)] relative"
              style={{
                background: `linear-gradient(150deg, ${C.blushSoft} 0%, ${C.ivory} 55%, ${C.blush} 100%)`,
                border: `1px solid ${C.blushDeep}`,
                borderRadius: "12px",
                padding: "clamp(1rem, 3.5vw, 1.6rem) clamp(1.4rem, 5vw, 2.4rem)",
              }}
            >
              <div
                className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                style={{ background: `linear-gradient(to bottom, transparent, ${C.gold}, transparent)` }}
              />
              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontWeight: 400,
                fontSize: "clamp(0.88rem, 3.2vw, 1.05rem)",
                color: C.roseDeep,
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
                color: C.goldDeep,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}>
                — Isaiah 60:22
              </p>
            </div>

            <div
              className="w-full flex flex-col"
              style={{ gap: "clamp(1rem, 3.2vw, 1.5rem)", marginBottom: "clamp(1.6rem, 5vw, 2.6rem)" }}
            >
              {[
                <>
                  With hearts full of gratitude and joy, we invite you to witness
                  and celebrate the Christening of our beloved daughter,{" "}
                  <span style={{ color: C.goldDeep, fontStyle: "italic", fontWeight: 700 }}>{fullName}.</span>
                </>,
                <>This sacred moment marks the beginning of her spiritual journey — welcoming her into God&apos;s loving embrace and the Christian faith. It is a day of blessing, hope, and thanksgiving as we entrust her life to His guidance and grace.</>,
                <>We are deeply thankful for the love and support that surround our family. Your presence, prayers, and shared joy mean so much to us — it would truly be a blessing to have you with us as we celebrate this meaningful milestone.</>,
                <>As you prepare to join us, please feel free to explore the details and reminders for the day. We look forward to celebrating this beautiful occasion together.</>,
              ].map((text, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: '"Fahkwang", sans-serif',
                    fontWeight: i === 0 ? 500 : 400,
                    fontSize: "clamp(0.88rem, 3vw, 1.02rem)",
                    color: i === 0 ? text.emphasis : text.body,
                    lineHeight: 1.85,
                    textAlign: "center",
                    letterSpacing: "0.01em",
                  }}
                >
                  {text}
                </p>
              ))}
            </div>

            <DiamondRule width="clamp(160px, 45vw, 200px)" margin="0 0 clamp(0.9rem,2.8vw,1.4rem) 0" />

            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.55rem, 1.9vw, 0.68rem)",
              fontWeight: 600,
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: text.caption,
              marginBottom: "0.4rem",
              paddingRight: "0.36em",
            }}>
              With love,
            </p>
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.95rem, 3.6vw, 1.35rem)",
              color: C.roseDeep,
              lineHeight: 1.4,
              letterSpacing: "0.04em",
            }}>
              {siteConfig.couple.parents}
            </p>

          </div>
        </div>
      </div>
    </section>
  )
}
