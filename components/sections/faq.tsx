"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import Image from "next/image"
import { siteConfig } from "@/content/site"

// ── Palette — aligned with entourage.tsx ──────────────────────────────────────
const DARK_NAVY = "#1C3050"
const GOLD      = "#C4965A"
const NAVY_MUTE = "rgba(65,90,115,0.78)"

const FROSTED_CARD = {
  background: "rgba(255,255,255,0.30)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1.5px solid rgba(43,74,107,0.22)",
  boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
} as const

function OrnamentDivider({ width = "240px" }: { width?: string }) {
  return (
    <div className="flex items-center justify-center gap-2" style={{ maxWidth: width, margin: "0 auto" }}>
      <div className="h-px flex-1" style={{ background: "linear-gradient(to left, rgba(196,152,88,0.45), transparent)" }} />
      <div style={{ width: "6px", height: "6px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)", flexShrink: 0 }} />
      <div className="h-px flex-1" style={{ background: "linear-gradient(to right, rgba(196,152,88,0.45), transparent)" }} />
    </div>
  )
}

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 380, h: 380, top: "4%",  left: "2%",  color: "rgba(120,175,215,1)", opacity: 0.08, blur: 100 },
    { w: 260, h: 260, top: "18%", left: "70%", color: "rgba(196,152,88,1)",  opacity: 0.08, blur: 80  },
    { w: 300, h: 300, top: "55%", left: "8%",  color: "rgba(196,152,88,1)",  opacity: 0.07, blur: 90  },
    { w: 220, h: 220, top: "70%", left: "76%", color: "rgba(120,175,215,1)", opacity: 0.08, blur: 70  },
    { w: 170, h: 170, top: "38%", left: "44%", color: "rgba(196,152,88,1)",  opacity: 0.06, blur: 60  },
  ]
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {orbs.map((o, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{ width: o.w, height: o.h, top: o.top, left: o.left, background: o.color, opacity: o.opacity, filter: `blur(${o.blur}px)` }}
        />
      ))}
    </div>
  )
}

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "When is the christening?",
    answer: `Kaezar Isaiahnuel's christening will be held on ${siteConfig.ceremony.date} (${siteConfig.ceremony.day}). It is a day we have been joyfully anticipating, and we cannot wait to celebrate this sacred milestone with you.`,
  },
  {
    question: "What time should I arrive?",
    answer: `The christening ceremony will begin promptly at ${siteConfig.ceremony.time}. We kindly ask guests to arrive 30–45 minutes early to allow time for parking, settling in, and finding your seats — so we may begin this blessed celebration on time and in peace.`,
  },
  {
    question: "Where will the ceremony and reception take place?",
    answer: `The christening ceremony and reception will both be held at ${siteConfig.ceremony.location}, ${siteConfig.ceremony.venue}. Detailed directions, maps, and addresses are available in the Details section of this invitation.`,
  },
  {
    question: "Is there a call time for Principal Sponsors?",
    answer: `Yes. We kindly request all Ninongs and Ninangs to arrive by ${siteConfig.ceremony.entourageTime} so we can prepare and gather together before the ceremony begins. Your presence and guidance are deeply meaningful to us.`,
  },
  {
    question: "How do I RSVP?",
    answer: `Please RSVP through the RSVP section of this invitation. Simply search for your name in the guest list and confirm your attendance. The deadline for RSVP confirmation is ${siteConfig.details.rsvp.deadline}.\n\nFor questions or concerns, you may reach us through ${siteConfig.details.rsvp.contact} via Messenger. We look forward to celebrating with you!`,
  },
  {
    question: "Are children welcome at the celebration?",
    answer: `Absolutely — little ones are welcome with open arms! After all, we are celebrating the blessing of a child, and we believe children bring a special kind of joy to this day. We kindly ask parents to please keep an eye on their little ones during the ceremony so everyone can participate reverently.`,
  },
  {
    question: "Can I sit anywhere at the reception?",
    answer: `We kindly ask our guests to follow the seating arrangement prepared for the reception.\n\nA great deal of thought and care went into planning each table so that everyone feels comfortable and connected. Our reception team will warmly assist you in finding your designated seat. Thank you for your cooperation!`,
  },
  {
    question: "Is there parking available?",
    answer: `Yes, parking is available at the venue. Parking attendants and our coordinators will be on hand to assist you on the day of the celebration. We recommend arriving a little early to allow time for parking.`,
  },
  {
    question: "What gifts are appropriate for a christening?",
    answer: `Your presence and prayers are the greatest gifts you could bring to this celebration. However, if you wish to give a gift, a monetary gift or a meaningful keepsake for Kaezar Isaiahnuel would be humbly and gratefully appreciated.\n\nPlease refer to the Gift Guide section of this invitation for more details.`,
  },
  {
    question: "Unplugged Ceremony — Eyes Up, Hearts Open",
    answer: `We respectfully request an unplugged christening ceremony — meaning no phones, cameras, or devices during the rite of baptism.\n\nThe greatest gift you can offer in that sacred moment is your undivided presence. Our professional photographers will be capturing every beautiful detail, and we promise to share those memories with you afterward.\n\nThank you so much for honoring this request. 🕊️`,
  },
  {
    question: "Can I take photos during the reception?",
    answer: `Yes! Once the ceremony concludes, feel free to take photos and enjoy every moment of the celebration. We prepared this day wholeheartedly, and we would love for you to capture and cherish the joy alongside us.`,
  },
  {
    question: "What if I can't make it?",
    answer: `Your presence will truly be missed, but we completely understand that life happens.\n\nPlease kindly let us know through RSVP as early as possible so we can adjust our arrangements. Even from a distance, your love and prayers mean the world to our family.`,
  },
  {
    question: "I said \u201cNo\u201d to RSVP but my plans have changed. Can I still attend?",
    answer: `Please check with us first before making arrangements. Due to venue capacity and carefully planned seating, attendance cannot be guaranteed without prior confirmation.\n\nWe will do our very best to accommodate you — please don't hesitate to reach out!`,
  },
  {
    question: "When is the appropriate time to leave?",
    answer: `We lovingly prepared this celebration for everyone to enjoy from start to finish. We humbly request that you stay with us until the program ends.\n\nLet's laugh together, take photos, share stories, and make beautiful memories — the kind that Kaezar Isaiahnuel will one day look back on with joy.`,
  },
  {
    question: "What if I have dietary restrictions or allergies?",
    answer: `Please let us know about any dietary restrictions or food allergies when you RSVP. We want every guest to feel comfortable and cared for throughout the celebration.`,
  },
  {
    question: "How can I help the family celebrate this beautiful day?",
    answer: `• Pray with us for God's continued grace and blessing upon Kaezar Isaiahnuel and our family.\n\n• RSVP as soon as possible once your schedule is confirmed.\n\n• Dress in accordance with the christening motif.\n\n• Arrive on time so we may begin together.\n\n• Please keep the ceremony unplugged — phones down, hearts open.\n\n• Follow the seating arrangement at the reception.\n\n• Stay until the end of the program.\n\n• Join the activities, enjoy the food, and celebrate with us wholeheartedly!`,
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative w-full overflow-hidden">

      {/* Solid base — aligned with entourage */}
      <div className="absolute inset-0 -z-10" style={{ background: "#FFFFFF" }} />

      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "radial-gradient(ellipse 55% 45% at 50% 30%, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.6) 45%, transparent 75%)",
      }} />

      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: "linear-gradient(to top, rgba(120,175,215,0.10) 0%, rgba(120,175,215,0.04) 25%, transparent 55%)",
      }} />

      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden style={{
        background: `
          radial-gradient(ellipse 50% 40% at 50% 28%, rgba(196,152,88,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 38% 32% at 50% 78%, rgba(120,175,215,0.08) 0%, transparent 65%)
        `,
      }} />

      <BokehOrbs />

      {/* ── Corner floral decorations ── */}
      <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden>
        <Image src="/decoration/left-top-removebg-preview.png"    alt="" width={200} height={200} className="absolute top-0 left-0  w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
        <Image src="/decoration/right-top-removebg-preview.png"   alt="" width={200} height={200} className="absolute top-0 right-0 w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
        <Image src="/decoration/bottom-left-removebg-preview.png"  alt="" width={200} height={200} className="absolute bottom-0 left-0  w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
        <Image src="/decoration/bottom-right-removebg-preview.png" alt="" width={200} height={200} className="absolute bottom-0 right-0 w-auto h-auto max-w-[100px] sm:max-w-[145px] md:max-w-[190px] opacity-40" />
      </div>

      <div className="relative z-10 py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-3 sm:px-5">

          {/* ══════════════════════════════════════════════════════════════
              SECTION HEADER
          ══════════════════════════════════════════════════════════════ */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">

            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
              letterSpacing: "0.40em",
              textTransform: "uppercase",
              color: "rgba(72,112,148,0.80)",
              marginBottom: "0.4rem",
              paddingRight: "0.40em",
            }}>
              Everything You Need to Know
            </p>

            <OrnamentDivider />

            <h2 style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(1.6rem, 5.5vw, 2.8rem)",
              color: GOLD,
              lineHeight: 1.0,
              marginTop: "1rem",
              marginBottom: "0.5rem",
              filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
            }}>
              Frequently Asked Questions
            </h2>

            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
              color: NAVY_MUTE,
              lineHeight: 1.75,
              fontStyle: "italic",
              maxWidth: "32rem",
              margin: "0.75rem auto 0",
            }}>
              Helpful notes so you can arrive, celebrate, and cherish every moment of this blessed day.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              FAQ ACCORDION
          ══════════════════════════════════════════════════════════════ */}
          <div className="rounded-3xl overflow-hidden" style={FROSTED_CARD}>
            <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

            <div className="p-2.5 sm:p-4 md:p-5">
              <div className="space-y-1.5 sm:space-y-2">
                {faqItems.map((item, index) => {
                  const isOpen = openIndex === index
                  const contentId = `faq-item-${index}`
                  return (
                    <div
                      key={index}
                      className="rounded-xl overflow-hidden border transition-all duration-300"
                      style={{
                        background: isOpen
                          ? "rgba(255,255,255,0.55)"
                          : "rgba(255,255,255,0.25)",
                        borderColor: isOpen
                          ? "rgba(196,152,88,0.35)"
                          : "rgba(43,74,107,0.12)",
                        boxShadow: isOpen
                          ? "0 4px 18px rgba(43,74,107,0.08)"
                          : "none",
                      }}
                    >
                      {/* Question button */}
                      <button
                        onClick={() => toggleItem(index)}
                        className="group w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 flex items-center justify-between text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C4965A] transition-colors"
                        aria-expanded={isOpen}
                        aria-controls={contentId}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 pr-3">
                          {/* Number badge */}
                          <div
                            className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300"
                            style={{
                              background: isOpen ? GOLD : "rgba(196,152,88,0.15)",
                              boxShadow: isOpen ? "0 2px 10px rgba(196,152,88,0.30)" : "none",
                            }}
                          >
                            <span style={{
                              fontFamily: '"Cinzel", serif',
                              fontWeight: 500,
                              fontSize: "clamp(0.56rem, 1.5vw, 0.64rem)",
                              color: isOpen ? "white" : GOLD,
                            }}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <span style={{
                            fontFamily: '"Cinzel", serif',
                            fontWeight: 500,
                            fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)",
                            color: isOpen ? DARK_NAVY : NAVY_MUTE,
                            lineHeight: 1.55,
                            transition: "color 0.2s",
                          }}>
                            {item.question}
                          </span>
                        </div>

                        <div
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{
                            background: isOpen ? "rgba(196,152,88,0.12)" : "transparent",
                          }}
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            style={{ color: GOLD }}
                            aria-hidden
                          />
                        </div>
                      </button>

                      {/* Answer panel */}
                      <div
                        id={contentId}
                        role="region"
                        className={`grid transition-all duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div
                            className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-t"
                            style={{
                              background: "rgba(255,255,255,0.45)",
                              borderColor: "rgba(43,74,107,0.12)",
                            }}
                          >
                            <div className="flex gap-3">
                              <div
                                className="flex-shrink-0 w-0.5 rounded-full self-stretch"
                                style={{ background: "linear-gradient(to bottom, rgba(196,152,88,0.68), rgba(196,152,88,0.15))" }}
                              />
                              <p
                                className="whitespace-pre-line"
                                style={{
                                  fontFamily: '"Fahkwang", sans-serif',
                                  fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                                  color: NAVY_MUTE,
                                  lineHeight: 1.75,
                                }}
                              >
                                {item.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* ── Closing note ── */}
          <div className="text-center mt-7 sm:mt-9">
            <OrnamentDivider width="180px" />
            <div className="flex items-center justify-center gap-2 mt-4 mb-3">
              <HelpCircle className="h-3.5 w-3.5 opacity-50" style={{ color: GOLD }} />
            </div>
            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
              color: NAVY_MUTE,
              fontStyle: "italic",
              lineHeight: 1.75,
            }}>
              Still have questions? Feel free to reach out to us — we&apos;re happy to help.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
