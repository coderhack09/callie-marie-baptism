"use client"

import { useState, useEffect, useCallback, Suspense, useRef, useLayoutEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { Cormorant_Garamond, Cinzel } from "next/font/google"
import { Heart, Check, X, Sparkles, MapPin } from "lucide-react"
import { siteConfig } from "@/content/site"
import { LoadingScreen } from "@/components/loader/LoadingScreen"
import { C, contentPanel, nameStyles, text } from "@/components/loader/christening-theme"
import { ChristeningCross, DiamondRule } from "@/components/loader/ChristeningDecor"
import { fetchProposalResponses, submitProposalResponse } from "@/lib/google-script-client"
import { getRoleSingular } from "@/lib/proposal-roles"
import type { ProposalRole, ProposalResponse } from "@/lib/proposal-types"

const Silk = dynamic(() => import("@/components/silk"), { ssr: false })
const enableDecor = process.env.NEXT_PUBLIC_ENABLE_DECOR !== "false"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

const childFirstName = siteConfig.couple.child.trim().split(" ")[0]

const roleTitleStyle: React.CSSProperties = {
  fontFamily: '"Style Script", cursive',
  fontSize: "clamp(3.5rem, 15vw, 6.5rem)",
  color: C.goldDeep,
  letterSpacing: "0.02em",
  marginTop: "0.1em",
  lineHeight: 0.9,
  filter: "drop-shadow(0 2px 10px rgba(201,168,108,0.25))",
}

const cardClass =
  "relative w-full overflow-hidden rounded-2xl sm:rounded-3xl md:rounded-[2rem] border p-5 text-center shadow-[0_24px_80px_rgba(107,61,79,0.1)] backdrop-blur-sm sm:p-12 md:p-14 lg:p-16"

const cardStyle: React.CSSProperties = {
  ...contentPanel,
  border: `1px solid ${C.blushDeep}`,
  background: `linear-gradient(180deg, ${C.pearl} 0%, ${C.ivory} 52%, ${C.champagne} 100%)`,
}

const primaryBtnClass =
  "cursor-pointer rounded-full border px-5 py-3 text-[9px] font-bold tracking-[0.16em] uppercase shadow-md transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 sm:px-7 sm:py-3.5 sm:text-[10px] sm:tracking-[0.18em] md:px-8 md:py-4 md:text-[11px]"

const secondaryBtnClass =
  "cursor-pointer rounded-full border bg-white/70 px-5 py-3 text-[9px] font-bold tracking-[0.16em] uppercase shadow-sm transition-all duration-300 sm:px-7 sm:py-3.5 sm:text-[10px] sm:tracking-[0.18em] md:px-8 md:py-4 md:text-[11px]"

function ChildNameHero() {
  const parts = siteConfig.couple.child.trim().split(" ")
  const givenName = parts[0]
  const middleName = parts.slice(1).join(" ")

  return (
    <div className="relative z-10 flex w-full flex-col items-center leading-none">
      <span style={nameStyles.given}>{givenName}</span>
      {middleName ? (
        <span style={{ ...nameStyles.script, fontSize: "clamp(2rem, 8vw, 4rem)" }}>{middleName}</span>
      ) : null}
    </div>
  )
}

function ProposalIntroSection({ venue }: { venue: string }) {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 text-center sm:space-y-7">
      <div className="flex justify-center">
        <ChristeningCross gradientId="proposalCrossGold" />
      </div>

      <p
        className={`${cormorant.className} px-1 text-[11px] leading-relaxed font-medium tracking-[0.22em] uppercase sm:text-xs sm:tracking-[0.28em]`}
        style={{ color: text.caption }}
      >
        With God&apos;s grace, we humbly ask
      </p>

      <DiamondRule margin="0 auto" width="min(100%, clamp(11rem, 72%, 22rem))" />

      <ChildNameHero />

      <p
        className={`${cinzel.className} text-xs font-medium tracking-[0.2em] uppercase sm:text-sm sm:tracking-[0.24em]`}
        style={{ color: text.emphasis }}
      >
        Holy Baptism · {siteConfig.ceremony.date}
      </p>

      <p style={{ ...nameStyles.parentLabel, marginBottom: 0 }}>Daughter of</p>
      <p style={nameStyles.parentNames}>{siteConfig.couple.parents}</p>

      <div
        className={`${cormorant.className} mx-auto flex max-w-md items-center justify-center gap-2 px-2 text-xs sm:text-sm`}
        style={{ color: text.caption }}
      >
        <MapPin className="h-4 w-4 shrink-0" style={{ color: C.goldDeep }} />
        <span className="text-pretty text-center" title={venue}>
          {venue}
        </span>
      </div>
    </div>
  )
}

function ProposalAskSection({
  roleSingular,
  description,
  coAttendants,
  onYes,
  onNo,
}: {
  roleSingular: string
  description: string
  coAttendants: string[]
  onYes: () => void
  onNo: () => void
}) {
  const questionRef = useRef<HTMLDivElement>(null)
  const [questionHeight, setQuestionHeight] = useState<number | null>(null)

  useLayoutEffect(() => {
    const node = questionRef.current
    if (!node) return

    const syncHeight = () => {
      setQuestionHeight(node.getBoundingClientRect().height)
    }

    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(node)

    return () => observer.disconnect()
  }, [roleSingular, description])

  return (
    <div className="relative mx-auto mt-0 w-full sm:mt-10">

      <div className="relative pt-0 sm:border-t sm:pt-10" style={{ borderColor: `${C.blushDeep}66` }}>
        <div className="relative mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6 md:gap-10">
          <div className="flex flex-row items-stretch justify-between gap-3 sm:contents">
            <div className="relative z-10 flex min-w-0 flex-1 flex-col items-start text-left">
              <div ref={questionRef} className="w-full">
                <p
                  className={`${cormorant.className} text-[10px] font-semibold tracking-[0.28em] uppercase sm:text-xs sm:tracking-[0.32em]`}
                  style={{ color: text.caption }}
                >
                  Will You Be
                </p>

                <h2 className="mt-2 flex flex-col items-start leading-none sm:mt-3">
                  <span
                    className={cinzel.className}
                    style={{
                      fontSize: "clamp(1.35rem, 5vw, 2rem)",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: text.emphasis,
                    }}
                  >
                    {childFirstName}&apos;s
                  </span>
                  <span style={roleTitleStyle}>{roleSingular}?</span>
                </h2>

                <p
                  className={`${cormorant.className} mt-3 max-w-md text-sm leading-relaxed sm:mt-5 sm:text-base`}
                  style={{ color: text.body }}
                >
                  {description}
                </p>
              </div>

              <div className="mt-8 hidden w-full flex-row gap-3 sm:mt-10 sm:flex sm:max-w-md md:mt-12">
                <button
                  onClick={onYes}
                  className={`${primaryBtnClass} min-w-0 flex-1`}
                  style={{
                    borderColor: C.goldDeep,
                    background: C.goldDeep,
                    color: C.pearl,
                  }}
                >
                  Yes, I&apos;d Love To
                </button>
                <button
                  onClick={onNo}
                  className={`${secondaryBtnClass} min-w-0 flex-1`}
                  style={{ borderColor: `${C.dustyRose}88`, color: text.body }}
                >
                  Decline
                </button>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden
              style={
                questionHeight
                  ? ({ "--ask-image-h": `${questionHeight}px` } as React.CSSProperties)
                  : undefined
              }
              className="pointer-events-none relative -mr-1 flex w-[38%] max-w-[168px] shrink-0 -translate-x-2 items-center justify-end self-stretch max-sm:h-[var(--ask-image-h)] sm:mr-0 sm:block sm:w-[min(36vw,240px)] sm:max-w-none sm:-translate-x-8 md:-translate-x-12 lg:-translate-x-14 md:w-[min(32vw,280px)] lg:w-[300px]"
            >
              <div className="relative h-full w-full sm:aspect-[3/4] sm:h-auto sm:translate-y-4 md:translate-y-6">
                <Image
                  src="/Details/guestimage.png"
                  alt=""
                  fill
                  className="object-contain object-center drop-shadow-[0_20px_48px_rgba(107,61,79,0.14)] sm:object-bottom"
                  sizes="(max-width: 640px) 38vw, 300px"
                  priority
                />
              </div>
            </motion.div>
          </div>

          <div className="flex w-full flex-row gap-2.5 sm:hidden">
            <button
              onClick={onYes}
              className={`${primaryBtnClass} min-h-11 min-w-0 flex-1 px-4 py-3.5 text-[10px] tracking-[0.12em]`}
              style={{
                borderColor: C.goldDeep,
                background: C.goldDeep,
                color: C.pearl,
              }}
            >
              Yes
            </button>
            <button
              onClick={onNo}
              className={`${secondaryBtnClass} min-h-11 min-w-0 flex-1 px-4 py-3.5 text-[10px] tracking-[0.12em]`}
              style={{ borderColor: `${C.dustyRose}88`, color: text.body }}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

type ProposalFlowState =
  | "question"
  | "yes_details"
  | "yes_submitted"
  | "no_clicked"
  | "no_submitted"

interface ProposalPageProps {
  role: ProposalRole
}

export function ProposalPage({ role }: ProposalPageProps) {
  const [isReady, setIsReady] = useState(false)
  const [flowState, setFlowState] = useState<ProposalFlowState>("question")
  const [preferredName, setPreferredName] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [responses, setResponses] = useState<ProposalResponse[]>([])

  const handleLoadingComplete = useCallback(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    fetchProposalResponses()
      .then(setResponses)
      .catch(() => setResponses([]))
  }, [])

  const coAttendants = responses
    .filter((r) => r.role === role.id && r.status === "Confirmed")
    .map((r) => r.name || "A Secret Supporter")

  const submitResponse = async (status: "Confirmed" | "Declined", name: string) => {
    await submitProposalResponse({
      role: role.id,
      name,
      status,
      submittedAt: new Date().toISOString(),
      category: role.roleCategory,
    })

    window.dispatchEvent(new Event("entourageUpdated"))
  }

  const handleYesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!preferredName.trim()) {
      setValidationError("Please enter the name for our invitation.")
      return
    }
    setValidationError("")
    setSubmitting(true)

    try {
      await submitResponse("Confirmed", preferredName.trim())
      setFlowState("yes_submitted")
    } catch (err) {
      console.error("Failed to submit confirmation:", err)
      const message =
        err instanceof Error && err.message.includes("fetch")
          ? "Could not reach Google Sheets. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
      setValidationError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleNoSubmit = async () => {
    setSubmitting(true)
    try {
      await submitResponse("Declined", "Declined Godparent Offer")
      setFlowState("no_submitted")
    } catch (err) {
      console.error("Failed to submit decline:", err)
      const message =
        err instanceof Error && err.message.includes("fetch")
          ? "Could not reach Google Sheets. Check your connection and try again."
          : err instanceof Error
            ? err.message
            : "Something went wrong. Please try again."
      setValidationError(message)
    } finally {
      setSubmitting(false)
    }
  }

  const roleSingular = getRoleSingular(role.title)
  const venue = `${siteConfig.ceremony.location}, ${siteConfig.ceremony.venue}`

  return (
    <div
      className={`${cormorant.className} relative flex min-h-screen select-none flex-col items-center justify-center overflow-hidden bg-transparent px-3 py-8 sm:px-6 sm:py-16`}
      style={{ backgroundColor: C.ivory }}
    >
      {!isReady && <LoadingScreen onComplete={handleLoadingComplete} />}

      {enableDecor && (
        <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
          <Suspense fallback={<div className="h-full w-full bg-transparent" />}>
            <Silk speed={5} scale={1.1} color="#C9A86C" noiseIntensity={0.6} rotation={0.3} />
          </Suspense>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-2xl lg:max-w-4xl"
      >
        <AnimatePresence mode="wait">
          {flowState === "question" && (
            <motion.div
              key="question-box"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={cardClass}
              style={cardStyle}
            >
              <div className="relative z-10 w-full space-y-3 pt-1 sm:space-y-8 sm:pt-2">
                <ProposalIntroSection venue={venue} />

                <div
                  className="mx-auto max-w-lg border-t px-1 pt-4 pb-0 text-sm leading-relaxed sm:border-y sm:px-0 sm:py-6 sm:text-base"
                  style={{ borderColor: `${C.blushDeep}66`, color: text.body }}
                >
                  <p className="text-pretty">
                    You are someone we look up to in faith and love. We would be honored to have
                    you guide {childFirstName} as her godparent.
                  </p>
                </div>

                <ProposalAskSection
                  roleSingular={roleSingular}
                  description={role.description}
                  coAttendants={coAttendants}
                  onYes={() => setFlowState("yes_details")}
                  onNo={() => setFlowState("no_clicked")}
                />
              </div>
            </motion.div>
          )}

          {flowState === "yes_details" && (
            <motion.form
              key="yes-form"
              onSubmit={handleYesSubmit}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className={cardClass}
              style={cardStyle}
            >
              <div className="relative z-10 w-full space-y-4 py-1 sm:space-y-6 sm:py-3">
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200/80 bg-emerald-50/90 shadow-sm sm:h-12 sm:w-12">
                    <Check className="h-5 w-5 text-emerald-600 sm:h-6 sm:w-6" />
                  </div>
                </div>

                <h2 className="mb-2 text-xl font-medium sm:text-2xl" style={{ color: text.emphasis }}>
                  Thank you!
                </h2>

                <p className="mx-auto max-w-md text-sm leading-relaxed sm:text-base" style={{ color: text.body }}>
                  What name should we put on the invitation?
                </p>

                <div className="mx-auto max-w-md text-left">
                  <label
                    className="mb-2 block text-[10px] font-semibold tracking-widest uppercase sm:text-xs"
                    style={{ color: text.caption }}
                  >
                    Your Name <span style={{ color: C.goldDeep }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. James Santos"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    className="w-full rounded-xl border bg-white/70 px-4 py-2.5 text-xs font-medium transition-all focus:ring-2 focus:outline-none sm:py-3 sm:text-sm"
                    style={{ borderColor: `${C.blushDeep}`, color: text.emphasis }}
                  />
                  {validationError && (
                    <p className="mt-2 flex items-center gap-1 text-xs font-medium text-rose-500">
                      <span>⚠️</span> {validationError}
                    </p>
                  )}
                </div>

                <div
                  className="mx-auto flex max-w-md flex-col gap-3 border-t pt-4 sm:flex-row"
                  style={{ borderColor: `${C.blushDeep}66` }}
                >
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`${primaryBtnClass} flex-1`}
                    style={{
                      borderColor: C.goldDeep,
                      background: C.goldDeep,
                      color: C.pearl,
                    }}
                  >
                    {submitting ? "Saving..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlowState("question")}
                    className={secondaryBtnClass}
                    style={{ borderColor: `${C.dustyRose}88`, color: text.body }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.form>
          )}

          {flowState === "yes_submitted" && (
            <motion.div
              key="yes-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cardClass}
              style={cardStyle}
            >
              <div className="relative z-10 space-y-4">
                <div className="relative mb-6 flex justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.2, 1] }}
                    transition={{ duration: 0.6 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full shadow-md"
                    style={{ border: `1px solid ${C.blushDeep}`, background: C.blushSoft, color: C.goldDeep }}
                  >
                    <Sparkles className="h-8 w-8" />
                  </motion.div>
                </div>

                <h2
                  className="mb-4 leading-none"
                  style={{ ...nameStyles.script, fontSize: "clamp(2rem, 9vw, 3.5rem)" }}
                >
                  It&apos;s Official!
                </h2>

                <div
                  className="mx-auto mb-6 max-w-sm rounded-2xl px-6 py-4 shadow-md backdrop-blur-sm"
                  style={{ border: `1px solid ${C.blushDeep}`, background: `${C.pearl}cc` }}
                >
                  <span
                    className="mb-1 block text-[10px] font-semibold tracking-widest uppercase"
                    style={{ color: text.caption }}
                  >
                    Registered godparent
                  </span>
                  <p className="text-lg font-semibold tracking-wide sm:text-xl" style={{ color: text.emphasis }}>
                    {preferredName}
                  </p>
                  <span className="mt-1.5 block text-xs font-medium italic" style={{ color: C.goldDeep }}>
                    Registered as {role.title}
                  </span>
                </div>

                <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed" style={{ color: text.body }}>
                  We&apos;re so grateful. See you on baptism day!
                </p>

                <Link
                  href="/"
                  className={`${primaryBtnClass} inline-block w-full max-w-sm`}
                  style={{
                    borderColor: C.goldDeep,
                    background: C.goldDeep,
                    color: C.pearl,
                  }}
                >
                  Return to Invitation
                </Link>
              </div>
            </motion.div>
          )}

          {flowState === "no_clicked" && (
            <motion.div
              key="no-confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cardClass}
              style={cardStyle}
            >
              <div className="relative z-10 space-y-4">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-rose-200/80 bg-rose-50/90 shadow-sm">
                    <X className="h-6 w-6 text-rose-500" />
                  </div>
                </div>

                <h2
                  className="mb-4 text-xl font-semibold tracking-wide sm:text-2xl"
                  style={{ color: text.emphasis }}
                >
                  Thank you for letting us know
                </h2>

                <p
                  className="mx-auto mb-10 max-w-md text-sm leading-relaxed sm:text-base"
                  style={{ color: text.body }}
                >
                  We&apos;ll miss having you in this role, but we appreciate your love and
                  well wishes just the same.
                </p>

                <div
                  className="mx-auto flex max-w-xs flex-col gap-3 border-t pt-4 sm:max-w-md sm:flex-row"
                  style={{ borderColor: `${C.blushDeep}66` }}
                >
                  <button
                    onClick={handleNoSubmit}
                    disabled={submitting}
                    className="flex-1 cursor-pointer rounded-full border border-rose-500 bg-rose-500 px-8 py-4 text-[11px] font-bold tracking-[0.18em] text-white uppercase shadow-md transition-all hover:border-rose-600 hover:bg-rose-600 disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setFlowState("question")}
                    className={secondaryBtnClass}
                    style={{ borderColor: `${C.dustyRose}88`, color: text.body }}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {flowState === "no_submitted" && (
            <motion.div
              key="no-submitted-box"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cardClass}
              style={cardStyle}
            >
              <div className="relative z-10 space-y-4">
                <div className="mb-6 flex justify-center">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full shadow-sm"
                    style={{ border: `1px solid ${C.blushDeep}`, background: C.pearl }}
                  >
                    <Heart className="h-6 w-6" style={{ color: C.goldDeep }} />
                  </div>
                </div>

                <h2
                  className="mb-4 leading-none italic"
                  style={{ ...nameStyles.script, fontSize: "clamp(1.75rem, 7vw, 2.75rem)" }}
                >
                  Response Sent
                </h2>

                <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed" style={{ color: text.body }}>
                  Thank you for your reply. Your love and support mean so much to us.
                </p>

                <Link
                  href="/"
                  className={secondaryBtnClass}
                  style={{ borderColor: `${C.dustyRose}88`, color: text.body }}
                >
                  Return to Invitation
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
