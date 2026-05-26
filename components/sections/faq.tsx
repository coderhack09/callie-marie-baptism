"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react"
import Image from "next/image"
import { siteConfig } from "@/content/site"

// ── Motif palette (aligned with BookOfGuests / Messages) ──────────────────────
const DEEP      = "#3D2810"
const MEDIUM    = "#8C6035"
const GOLD      = "#B8822A"
const BABY_BLUE = "#3FA3C8"
const BLUE_MID  = "#7BBEDD"
const IVORY     = "#FEF9F3"
const BLUSH     = "#EED4BC"

// ── Floating bokeh orbs ───────────────────────────────────────────────────────
function BokehOrbs() {
  const orbs = [
    { w: 280, h: 280, top: "6%",  left: "3%",  color: BABY_BLUE, opacity: 0.08, blur: 85 },
    { w: 200, h: 200, top: "20%", left: "76%", color: GOLD,      opacity: 0.09, blur: 68 },
    { w: 240, h: 240, top: "60%", left: "4%",  color: BLUSH,     opacity: 0.10, blur: 78 },
    { w: 180, h: 180, top: "72%", left: "78%", color: BABY_BLUE, opacity: 0.08, blur: 60 },
    { w: 140, h: 140, top: "40%", left: "46%", color: GOLD,      opacity: 0.06, blur: 50 },
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

      {/* Solid ivory base */}
      <div className="absolute inset-0 -z-10" style={{ background: IVORY }} />

      {/* Multi-stop tinted vertical gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(180deg,
          rgba(213,238,248,0.40) 0%,
          rgba(251,244,234,0.0)  22%,
          rgba(238,212,188,0.28) 52%,
          rgba(251,244,234,0.0)  78%,
          rgba(213,238,248,0.34) 100%
        )`,
      }} />

      {/* Diagonal warm-to-cool wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(112deg, rgba(213,238,248,0.14) 0%, transparent 44%, rgba(238,212,188,0.14) 100%)`,
      }} />

      {/* Fine diagonal shimmer */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `repeating-linear-gradient(125deg, transparent 0px, transparent 160px, rgba(255,255,255,0.18) 160px, rgba(255,255,255,0.18) 162px)`,
      }} />

      {/* Soft dot grid */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(63,163,200,0.08) 1px, transparent 1px)`,
        backgroundSize: "28px 28px",
      }} />

      {/* Corner radial glows */}
      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden style={{
        background: `
          radial-gradient(ellipse 50% 38% at 0%   0%,   rgba(213,238,248,0.30) 0%, transparent 60%),
          radial-gradient(ellipse 40% 34% at 100% 0%,   rgba(238,212,188,0.26) 0%, transparent 55%),
          radial-gradient(ellipse 44% 36% at 0%   100%, rgba(238,212,188,0.22) 0%, transparent 55%),
          radial-gradient(ellipse 40% 34% at 100% 100%, rgba(213,238,248,0.26) 0%, transparent 55%)
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

            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.56rem, 2.2vw, 0.68rem)",
                letterSpacing: "0.52em",
                textTransform: "uppercase",
                color: BABY_BLUE,
                marginBottom: "0.75rem",
                paddingRight: "0.52em",
              }}
            >
              Everything You Need to Know
            </p>

            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${GOLD}99, transparent)` }} />
              <span style={{ color: GOLD, fontSize: "9px", opacity: 0.9 }}>✦</span>
              <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${GOLD}99, transparent)` }} />
            </div>

            <h2
              className="gistesy"
              style={{
                fontSize: "clamp(2.4rem, 9.5vw, 5rem)",
                color: DEEP,
                lineHeight: 1.1,
                overflow: "visible",
                paddingTop: "0.1em",
                marginBottom: "0.5rem",
              }}
            >
              Frequently Asked Questions
            </h2>

            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to left, ${BLUE_MID}cc, transparent)` }} />
              <span style={{ color: BLUE_MID, fontSize: "5px", letterSpacing: "0.25em" }}>◆◆◆</span>
              <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to right, ${BLUE_MID}cc, transparent)` }} />
            </div>

            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.78rem, 2.6vw, 0.94rem)",
                color: MEDIUM,
                fontStyle: "italic",
                lineHeight: 1.9,
                maxWidth: "460px",
                margin: "0 auto",
              }}
            >
              Helpful notes so you can arrive, celebrate, and cherish every moment of this blessed day.
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to left, ${GOLD}55, transparent)` }} />
              <Sparkles className="h-3.5 w-3.5 opacity-60" style={{ color: GOLD }} />
              <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to right, ${GOLD}55, transparent)` }} />
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              FAQ ACCORDION
          ══════════════════════════════════════════════════════════════ */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              background: "rgba(254,249,243,0.90)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              borderColor: `${BABY_BLUE}30`,
              boxShadow: `0 8px 36px ${BABY_BLUE}14, 0 2px 10px rgba(61,40,16,0.06), inset 0 1px 0 rgba(255,255,255,0.80)`,
            }}
          >
            {/* Top accent line */}
            <div className="h-[3px] w-full" style={{ background: `linear-gradient(to right, transparent, ${GOLD}77, ${BABY_BLUE}77, transparent)` }} />

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
                          ? "rgba(254,249,243,0.98)"
                          : "rgba(254,249,243,0.55)",
                        borderColor: isOpen
                          ? `${BABY_BLUE}44`
                          : `${BABY_BLUE}1e`,
                        boxShadow: isOpen
                          ? `0 4px 18px ${BABY_BLUE}14, 0 1px 6px rgba(61,40,16,0.05)`
                          : "none",
                      }}
                    >
                      {/* Question button */}
                      <button
                        onClick={() => toggleItem(index)}
                        className="group w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 flex items-center justify-between text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-colors"
                        aria-expanded={isOpen}
                        aria-controls={contentId}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 pr-3">
                          {/* Number badge */}
                          <div
                            className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300"
                            style={{
                              background: isOpen
                                ? BABY_BLUE
                                : `${BABY_BLUE}18`,
                              boxShadow: isOpen ? `0 2px 10px ${BABY_BLUE}44` : "none",
                            }}
                          >
                            <span
                              className="garamond font-bold"
                              style={{
                                fontSize: "clamp(0.56rem, 1.5vw, 0.64rem)",
                                color: isOpen ? "white" : BABY_BLUE,
                              }}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <span
                            className="garamond font-bold leading-snug sm:leading-relaxed"
                            style={{
                              fontSize: "clamp(0.8rem, 2.6vw, 0.96rem)",
                              color: isOpen ? DEEP : MEDIUM,
                              transition: "color 0.2s",
                            }}
                          >
                            {item.question}
                          </span>
                        </div>

                        <div
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{
                            background: isOpen ? `${BABY_BLUE}18` : "transparent",
                          }}
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            style={{ color: isOpen ? BABY_BLUE : GOLD }}
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
                              background: `linear-gradient(135deg, ${BABY_BLUE}06 0%, rgba(254,249,243,0.70) 100%)`,
                              borderColor: `${BABY_BLUE}22`,
                            }}
                          >
                            {/* Left accent bar */}
                            <div className="flex gap-3">
                              <div
                                className="flex-shrink-0 w-0.5 rounded-full self-stretch"
                                style={{ background: `linear-gradient(to bottom, ${BABY_BLUE}, ${BABY_BLUE}22)` }}
                              />
                              <p
                                className="garamond whitespace-pre-line"
                                style={{
                                  fontSize: "clamp(0.78rem, 2.4vw, 0.92rem)",
                                  color: DEEP,
                                  lineHeight: 1.95,
                                  letterSpacing: "0.01em",
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

            {/* Bottom accent line */}
            <div className="h-[2px] w-full" style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}44, transparent)` }} />
          </div>

          {/* ── Closing note ── */}
          <div className="text-center mt-7 sm:mt-9">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to left, ${GOLD}55, transparent)` }} />
              <HelpCircle className="h-3.5 w-3.5 opacity-50" style={{ color: GOLD }} />
              <div className="h-px w-10 sm:w-16" style={{ background: `linear-gradient(to right, ${GOLD}55, transparent)` }} />
            </div>
            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.74rem, 2.2vw, 0.86rem)",
                color: MEDIUM,
                fontStyle: "italic",
                lineHeight: 1.85,
              }}
            >
              Still have questions? Feel free to reach out to us — we&apos;re happy to help.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
