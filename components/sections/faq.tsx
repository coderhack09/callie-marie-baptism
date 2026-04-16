"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Section } from "@/components/section"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { siteConfig } from "@/content/site"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const MEDIUM = "#BFA07A"
const ACCENT = "#CFA06B"

const DECO_FILTER =
  "brightness(0) saturate(100%) invert(62%) sepia(40%) saturate(400%) hue-rotate(5deg) brightness(95%) contrast(90%)"

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: "When is the christening?",
    answer: `Niahna Celestine's christening will be held on ${siteConfig.ceremony.date} (${siteConfig.ceremony.day}). It is a day we have been joyfully anticipating, and we cannot wait to celebrate this sacred milestone with you.`,
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
    answer: `Your presence and prayers are the greatest gifts you could bring to this celebration. However, if you wish to give a gift, a monetary gift or a meaningful keepsake for Niahna Celestine would be humbly and gratefully appreciated.\n\nPlease refer to the Gift Guide section of this invitation for more details.`,
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
    answer: `We lovingly prepared this celebration for everyone to enjoy from start to finish. We humbly request that you stay with us until the program ends.\n\nLet's laugh together, take photos, share stories, and make beautiful memories — the kind that Niahna Celestine will one day look back on with joy.`,
  },
  {
    question: "What if I have dietary restrictions or allergies?",
    answer: `Please let us know about any dietary restrictions or food allergies when you RSVP. We want every guest to feel comfortable and cared for throughout the celebration.`,
  },
  {
    question: "How can I help the family celebrate this beautiful day?",
    answer: `• Pray with us for God's continued grace and blessing upon Niahna Celestine and our family.\n\n• RSVP as soon as possible once your schedule is confirmed.\n\n• Dress in accordance with the christening motif.\n\n• Arrive on time so we may begin together.\n\n• Please keep the ceremony unplugged — phones down, hearts open.\n\n• Follow the seating arrangement at the reception.\n\n• Stay until the end of the program.\n\n• Join the activities, enjoy the food, and celebrate with us wholeheartedly!`,
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="relative w-full" style={{ backgroundColor: "var(--color-motif-cream)" }}>
      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 opacity-[0.22]"
          style={{ background: "linear-gradient(150deg, var(--color-motif-cream) 0%, rgba(212,184,150,0.14) 35%, rgba(207,160,107,0.06) 70%, rgba(139,111,90,0.03) 100%)" }} />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ background: "radial-gradient(ellipse 80% 45% at 50% 5%, rgba(207,160,107,0.45) 0%, transparent 60%)" }} />
      </div>

      <Section id="faq" className="relative z-10 py-12 md:py-16 lg:py-20 overflow-hidden">

        {/* Corner florals */}
        <div className="absolute left-0 top-0 z-0 pointer-events-none">
          <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300}
            className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-35 scale-y-[-1]"
            priority={false} style={{ filter: DECO_FILTER }} />
        </div>
        <div className="absolute right-0 top-0 z-0 pointer-events-none">
          <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300}
            className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-35 scale-x-[-1] scale-y-[-1]"
            priority={false} style={{ filter: DECO_FILTER }} />
        </div>
        <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
          <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300}
            className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-35"
            priority={false} style={{ filter: DECO_FILTER }} />
        </div>
        <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
          <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300}
            className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-35 scale-x-[-1]"
            priority={false} style={{ filter: DECO_FILTER }} />
        </div>

        {/* ── Section Header ── */}
        <div className="relative z-30 text-center mb-7 sm:mb-10 md:mb-12 px-4">

          {/* Eyebrow */}
          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.56rem, 2.2vw, 0.72rem)",
              letterSpacing: "0.48em",
              textTransform: "uppercase",
              color: ACCENT,
              marginBottom: "0.45rem",
              paddingRight: "0.48em",
            }}
          >
            Everything You Need to Know
          </p>

          {/* Ornament */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, rgba(207,160,107,0.4), transparent)" }} />
            <span style={{ color: ACCENT, fontSize: "7px", opacity: 0.7 }}>✦</span>
            <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, rgba(207,160,107,0.4), transparent)" }} />
          </div>

          {/* Title */}
          <h2
            className="gistesy"
            style={{
              fontSize: "clamp(2.2rem, 8.5vw, 4.4rem)",
              color: DEEP,
              lineHeight: 1.15,
              overflow: "visible",
              paddingTop: "0.12em",
              marginBottom: "0.45rem",
              textShadow: "0 2px 20px rgba(139,111,90,0.10)",
            }}
          >
            Frequently Asked Questions
          </h2>

          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.78rem, 2.6vw, 0.94rem)",
              color: MEDIUM,
              fontStyle: "italic",
              lineHeight: 1.85,
              maxWidth: "460px",
              margin: "0 auto clamp(0.6rem, 1.5vw, 0.9rem)",
            }}
          >
            Helpful notes so you can arrive, celebrate, and cherish every moment of this blessed day.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(to left, rgba(207,160,107,0.45), transparent)" }} />
            <span style={{ color: "#D4B896", fontSize: "5px" }}>◆</span>
            <div className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(to right, rgba(207,160,107,0.45), transparent)" }} />
          </div>
        </div>

        {/* ── FAQ Accordion ── */}
        <div className="relative z-30 max-w-3xl mx-auto px-3 sm:px-5">
          <div
            className="rounded-xl sm:rounded-2xl border overflow-hidden"
            style={{
              background: "rgba(255,247,240,0.85)",
              borderColor: "rgba(207,160,107,0.20)",
              boxShadow: "0 6px 32px rgba(139,111,90,0.09)",
            }}
          >
            {/* Top accent line */}
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, transparent, rgba(207,160,107,0.55), transparent)" }} />

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
                          ? "rgba(255,247,240,0.95)"
                          : "rgba(255,247,240,0.60)",
                        borderColor: isOpen
                          ? "rgba(207,160,107,0.32)"
                          : "rgba(207,160,107,0.18)",
                        boxShadow: isOpen ? "0 4px 16px rgba(139,111,90,0.08)" : "none",
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
                            className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-200"
                            style={{
                              background: isOpen
                                ? `linear-gradient(135deg, ${ACCENT}, ${DEEP})`
                                : "rgba(207,160,107,0.12)",
                            }}
                          >
                            <span
                              className="garamond font-bold"
                              style={{
                                fontSize: "clamp(0.56rem, 1.5vw, 0.64rem)",
                                color: isOpen ? "white" : ACCENT,
                              }}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <span
                            className="garamond font-bold leading-snug sm:leading-relaxed transition-colors duration-200"
                            style={{
                              fontSize: "clamp(0.8rem, 2.6vw, 0.96rem)",
                              color: isOpen ? DEEP : DEEP,
                            }}
                          >
                            {item.question}
                          </span>
                        </div>

                        <ChevronDown
                          size={18}
                          className={`flex-shrink-0 transition-transform duration-300 w-4 h-4 sm:w-5 sm:h-5 ${isOpen ? "rotate-180" : ""}`}
                          style={{ color: ACCENT }}
                          aria-hidden
                        />
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
                            className="px-3 sm:px-4 md:px-5 py-3 sm:py-3.5 border-t"
                            style={{
                              background: "rgba(255,247,240,0.70)",
                              borderColor: "rgba(207,160,107,0.20)",
                            }}
                          >
                            {/* Left accent bar */}
                            <div className="flex gap-3">
                              <div
                                className="flex-shrink-0 w-0.5 rounded-full self-stretch"
                                style={{ background: `linear-gradient(to bottom, ${ACCENT}, rgba(207,160,107,0.15))` }}
                              />
                              <p
                                className="garamond whitespace-pre-line"
                                style={{
                                  fontSize: "clamp(0.76rem, 2.4vw, 0.9rem)",
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
            <div className="h-0.5 w-full" style={{ background: "linear-gradient(to right, transparent, rgba(207,160,107,0.40), transparent)" }} />
          </div>

          {/* Closing note */}
          <div className="text-center mt-6 sm:mt-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-10 sm:w-16" style={{ background: "linear-gradient(to left, rgba(207,160,107,0.40), transparent)" }} />
              <span style={{ color: ACCENT, fontSize: "5px", opacity: 0.7 }}>◆</span>
              <div className="h-px w-10 sm:w-16" style={{ background: "linear-gradient(to right, rgba(207,160,107,0.40), transparent)" }} />
            </div>
            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.72rem, 2.2vw, 0.84rem)",
                color: MEDIUM,
                fontStyle: "italic",
                lineHeight: 1.85,
              }}
            >
              Still have questions? Feel free to reach out to us — we&apos;re happy to help.
            </p>
          </div>
        </div>

      </Section>
    </div>
  )
}
