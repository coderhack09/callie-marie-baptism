"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { siteConfig } from "@/content/site"
import { C, text } from "@/components/loader/christening-theme"
import { CornerFloralDecor } from "@/components/loader/ChristeningDecor"

const cardStyle = {
  background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 48%, ${C.champagne} 100%)`,
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
} as const

const goldLine = `linear-gradient(to right, transparent, ${C.gold}, transparent)`

const childName = siteConfig.couple.child
const childFirst = childName.split(" ")[0]

function GoldRule({ width = "240px" }: { width?: string }) {
  return (
    <div className="h-px mx-auto" style={{ maxWidth: width, background: goldLine, opacity: 0.55 }} />
  )
}

function BokehOrbs() {
  const orbs = [
    { w: 380, h: 380, top: "4%",  left: "2%",  color: "rgba(232,196,204,1)", opacity: 0.10, blur: 100 },
    { w: 260, h: 260, top: "18%", left: "70%", color: "rgba(201,168,108,1)",  opacity: 0.09, blur: 80  },
    { w: 300, h: 300, top: "55%", left: "8%",  color: "rgba(201,168,108,1)",  opacity: 0.08, blur: 90  },
    { w: 220, h: 220, top: "70%", left: "76%", color: "rgba(232,196,204,1)", opacity: 0.09, blur: 70  },
    { w: 170, h: 170, top: "38%", left: "44%", color: "rgba(201,168,108,1)",  opacity: 0.07, blur: 60  },
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
    answer: `${childName}'s christening will be held on ${siteConfig.ceremony.date} (${siteConfig.ceremony.day}). It is a day we have been joyfully anticipating, and we cannot wait to celebrate this sacred milestone with you.`,
  },
  {
    question: "What time should I arrive?",
    answer: `The christening ceremony will begin promptly at ${siteConfig.ceremony.time}. We kindly ask guests to arrive 30–45 minutes early to allow time for parking, settling in, and finding your seats — so we may begin this blessed celebration on time and in peace.`,
  },
  {
    question: "Where will the ceremony and reception take place?",
    answer: `The christening ceremony will be held at ${siteConfig.ceremony.location}, ${siteConfig.ceremony.venue}.\n\nThe reception will follow at ${siteConfig.reception.location}, ${siteConfig.reception.venue}.\n\nDetailed directions, maps, and addresses are available in the Details section of this invitation.`,
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
    answer: `Yes, parking is available at both venues. Parking attendants and our coordinators will be on hand to assist you on the day of the celebration. We recommend arriving a little early to allow time for parking.`,
  },
  {
    question: "What gifts are appropriate for a christening?",
    answer: `Your presence and prayers are the greatest gifts you could bring to this celebration. However, if you wish to give a gift, a monetary gift or a meaningful keepsake for ${childName} would be humbly and gratefully appreciated.\n\nPlease refer to the Gift Note section of this invitation for more details.`,
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
    answer: `We lovingly prepared this celebration for everyone to enjoy from start to finish. We humbly request that you stay with us until the program ends.\n\nLet's laugh together, take photos, share stories, and make beautiful memories — the kind that ${childFirst} will one day look back on with joy.`,
  },
  {
    question: "What if I have dietary restrictions or allergies?",
    answer: `Please let us know about any dietary restrictions or food allergies when you RSVP. We want every guest to feel comfortable and cared for throughout the celebration.`,
  },
  {
    question: "How can I help the family celebrate this beautiful day?",
    answer: `• Pray with us for God's continued grace and blessing upon ${childName} and our family.\n\n• RSVP as soon as possible once your schedule is confirmed.\n\n• Dress in accordance with the christening motif.\n\n• Arrive on time so we may begin together.\n\n• Please keep the ceremony unplugged — phones down, hearts open.\n\n• Follow the seating arrangement at the reception.\n\n• Stay until the end of the program.\n\n• Join the activities, enjoy the food, and celebrate with us wholeheartedly!`,
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="relative w-full overflow-hidden">

      {/* Layered christening background */}
      <div className="absolute inset-0 -z-10" style={{ background: C.ivory }} />

      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `radial-gradient(ellipse 55% 45% at 50% 30%, rgba(255,253,249,0.95) 0%, rgba(250,232,236,0.45) 45%, transparent 75%)`,
      }} />

      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(to top, rgba(232,196,204,0.12) 0%, rgba(247,239,228,0.06) 25%, transparent 55%)`,
      }} />

      <div className="absolute inset-0 pointer-events-none z-0" aria-hidden style={{
        background: `
          radial-gradient(ellipse 50% 40% at 50% 28%, rgba(201,168,108,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 38% 32% at 50% 78%, rgba(232,196,204,0.10) 0%, transparent 65%)
        `,
      }} />

      <BokehOrbs />
      <CornerFloralDecor opacity={0.65} sizeClass="w-20 sm:w-32 md:w-40 lg:w-48" />

      <div className="relative z-10 py-12 sm:py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-3 sm:px-5">

          {/* Section header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
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
                Everything You Need to Know
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
                Frequently Asked Questions
              </h2>

              <GoldRule width="100%" />

              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
                color: text.body,
                lineHeight: 1.8,
                fontStyle: "italic",
                maxWidth: "32rem",
                margin: "0.75rem auto 0",
              }}>
                Helpful notes so you can arrive, celebrate, and cherish every moment of {childFirst}&apos;s blessed day.
              </p>
            </div>
          </div>

          {/* FAQ accordion */}
          <div className="rounded-3xl overflow-hidden isolate" style={cardStyle}>
            <div className="h-px w-full" style={{ background: goldLine, opacity: 0.5 }} />

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
                        background: isOpen ? C.pearl : "rgba(255,253,249,0.72)",
                        borderColor: isOpen ? C.blushDeep : C.blush,
                        boxShadow: isOpen ? "0 4px 18px rgba(107,61,79,0.08)" : "none",
                      }}
                    >
                      <button
                        onClick={() => toggleItem(index)}
                        className="group w-full px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 flex items-center justify-between text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#B8924E] transition-colors"
                        aria-expanded={isOpen}
                        aria-controls={contentId}
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3 pr-3">
                          <div
                            className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-300"
                            style={{
                              background: isOpen ? C.goldDeep : C.blushSoft,
                              boxShadow: isOpen ? "0 2px 10px rgba(201,168,108,0.28)" : "none",
                            }}
                          >
                            <span style={{
                              fontFamily: '"Cinzel", serif',
                              fontWeight: 500,
                              fontSize: "clamp(0.56rem, 1.5vw, 0.64rem)",
                              color: isOpen ? C.pearl : C.goldDeep,
                            }}>
                              {String(index + 1).padStart(2, "0")}
                            </span>
                          </div>

                          <span style={{
                            fontFamily: '"Cinzel", serif',
                            fontWeight: 500,
                            fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)",
                            color: isOpen ? C.roseDeep : text.body,
                            lineHeight: 1.55,
                            transition: "color 0.2s",
                          }}>
                            {item.question}
                          </span>
                        </div>

                        <div
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{ background: isOpen ? C.blushSoft : "transparent" }}
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                            style={{ color: C.goldDeep }}
                            aria-hidden
                          />
                        </div>
                      </button>

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
                              background: C.blushSoft,
                              borderColor: C.blushDeep,
                            }}
                          >
                            <div className="flex gap-3">
                              <div
                                className="flex-shrink-0 w-0.5 rounded-full self-stretch"
                                style={{ background: `linear-gradient(to bottom, ${C.goldDeep}, ${C.blushDeep})` }}
                              />
                              <p
                                className="whitespace-pre-line"
                                style={{
                                  fontFamily: '"Fahkwang", sans-serif',
                                  fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                                  color: text.body,
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

          {/* Closing note */}
          <div className="text-center mt-7 sm:mt-9">
            <GoldRule width="180px" />
            <div className="flex items-center justify-center gap-2 mt-4 mb-3">
              <HelpCircle className="h-3.5 w-3.5 opacity-60" style={{ color: C.goldDeep }} />
            </div>
            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
              color: text.body,
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
