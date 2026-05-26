"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { MessageCircle, Heart, Sparkles, Send } from "lucide-react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
import { siteConfig } from "@/content/site"

// ── Motif palette (aligned with BookOfGuests) ─────────────────────────────────
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
    { w: 300, h: 300, top: "4%",  left: "2%",  color: BABY_BLUE, opacity: 0.08, blur: 85 },
    { w: 220, h: 220, top: "18%", left: "74%", color: GOLD,      opacity: 0.09, blur: 70 },
    { w: 260, h: 260, top: "55%", left: "5%",  color: BLUSH,     opacity: 0.11, blur: 80 },
    { w: 190, h: 190, top: "70%", left: "76%", color: BABY_BLUE, opacity: 0.08, blur: 62 },
    { w: 150, h: 150, top: "38%", left: "44%", color: GOLD,      opacity: 0.06, blur: 52 },
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

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageFormProps {
  onSuccess?: () => void
  onMessageSent?: () => void
}

function MessageForm({ onSuccess, onMessageSent }: MessageFormProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [nameValue, setNameValue] = useState("")
  const [messageValue, setMessageValue] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const name    = formData.get("name") as string
    const message = formData.get("message") as string

    const gfd = new FormData()
    gfd.append("entry.405401269", name)
    gfd.append("entry.893740636", message)

    try {
      await fetch(siteConfig.googleAPI.messageForm, { method: "POST", mode: "no-cors", body: gfd })

      toast({ title: "Blessing Sent! 🕊️", description: "Your heartfelt wishes have been delivered", duration: 3000 })

      setIsSubmitted(true)
      setNameValue("")
      setMessageValue("")
      formRef.current?.reset()
      setTimeout(() => setIsSubmitted(false), 1000)
      if (onSuccess) onSuccess()
      if (onMessageSent) onMessageSent()
    } catch {
      toast({ title: "Unable to send message", description: "Please try again in a moment", variant: "destructive", duration: 3000 })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative w-full max-w-md mx-auto px-3 sm:px-0">
      <style>{`
        .msg-input::placeholder    { color: ${MEDIUM}99 !important; opacity: 1 !important; font-style: italic; }
        .msg-textarea::placeholder { color: ${MEDIUM}99 !important; opacity: 1 !important; font-style: italic; }
      `}</style>

      {/* Card */}
      <div
        className={`relative w-full border-2 rounded-2xl overflow-hidden transition-all duration-500 ${
          isFocused ? "scale-[1.01]" : ""
        } ${isSubmitted ? "animate-bounce" : ""}`}
        style={{
          background: "rgba(254,249,243,0.96)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          borderColor: isFocused ? `${BABY_BLUE}66` : `${BABY_BLUE}33`,
          boxShadow: `0 12px 40px rgba(63,163,200,0.12), 0 2px 10px rgba(61,40,16,0.06), inset 0 1px 0 rgba(255,255,255,0.80)`,
        }}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, transparent, ${GOLD}66, ${BABY_BLUE}66, transparent)` }} />

        {/* Success overlay */}
        {isSubmitted && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ background: "rgba(254,249,243,0.93)" }}>
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${BABY_BLUE}, ${DEEP})` }}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <p className="gistesy" style={{ fontSize: "1.4rem", color: DEEP }}>Sent!</p>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {/* Form header */}
          <div className="text-center mb-4 sm:mb-5">
            <div className="relative inline-block mb-2 sm:mb-3">
              <div className="absolute inset-0 rounded-full blur-lg scale-150 opacity-20" style={{ background: BABY_BLUE }} />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto shadow-md" style={{ background: `linear-gradient(135deg, ${BABY_BLUE}, ${DEEP})` }}>
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <h3 className="gistesy" style={{ fontSize: "clamp(1.6rem, 6vw, 2.4rem)", color: DEEP, lineHeight: 1.2, marginBottom: "0.25rem" }}>
              Leave a Blessing
            </h3>
            <p className="garamond" style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.84rem)", color: MEDIUM, fontStyle: "italic" }}>
              Your words will be treasured by this little family forever.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            {/* Name */}
            <div className="space-y-1.5">
              <label className="garamond flex items-center gap-1.5 text-xs sm:text-sm font-semibold" style={{ color: DEEP }}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${focusedField === "name" ? "scale-110" : ""}`} style={{ background: `${GOLD}22` }}>
                  <Heart className="h-2.5 w-2.5" style={{ color: GOLD }} />
                </div>
                Your Name
              </label>
              <div className="relative">
                <Input
                  name="name"
                  required
                  value={nameValue}
                  onChange={(e) => setNameValue(e.target.value)}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Your full name"
                  className="msg-input garamond w-full border-2 rounded-xl py-2.5 px-4 text-xs sm:text-sm bg-white/80 transition-all duration-300 shadow-sm"
                  style={{
                    color: DEEP,
                    borderColor: focusedField === "name" ? `${BABY_BLUE}77` : `${BABY_BLUE}33`,
                  }}
                />
                {nameValue && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="garamond flex items-center gap-1.5 text-xs sm:text-sm font-semibold" style={{ color: DEEP }}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${focusedField === "message" ? "scale-110" : ""}`} style={{ background: `${BABY_BLUE}18` }}>
                    <MessageCircle className="h-2.5 w-2.5" style={{ color: BABY_BLUE }} />
                  </div>
                  Your Blessing
                </label>
                {messageValue && (
                  <span className="garamond" style={{ fontSize: "0.65rem", color: messageValue.length > 500 ? "#ef4444" : MEDIUM, opacity: 0.75 }}>
                    {messageValue.length}/500
                  </span>
                )}
              </div>
              <div className="relative">
                <Textarea
                  name="message"
                  required
                  value={messageValue}
                  onChange={(e) => { if (e.target.value.length <= 500) setMessageValue(e.target.value) }}
                  onFocus={() => setFocusedField("message")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Share a prayer, a wish, or words of love for Kaezar Isaiahnuel..."
                  className="msg-textarea garamond w-full border-2 rounded-xl min-h-[90px] sm:min-h-[110px] text-xs sm:text-sm resize-none bg-white/80 transition-all duration-300 shadow-sm py-3 px-4"
                  style={{
                    color: DEEP,
                    borderColor: focusedField === "message" ? `${BABY_BLUE}77` : `${BABY_BLUE}33`,
                  }}
                />
                {messageValue && <div className="absolute right-3 top-3 w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className="garamond w-full rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: BABY_BLUE,
                color: "white",
                border: "none",
                boxShadow: `0 6px 20px ${BABY_BLUE}44`,
              }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = DEEP; e.currentTarget.style.boxShadow = `0 8px 26px ${BABY_BLUE}55` } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = BABY_BLUE; e.currentTarget.style.boxShadow = `0 6px 20px ${BABY_BLUE}44` }}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Blessing
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Bottom accent line */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}44, transparent)` }} />
      </div>
    </div>
  )
}

export function Messages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMessages = useCallback(() => {
    setLoading(true)
    fetch("/api/messages", { cache: "no-store", headers: { "Cache-Control": "no-cache" } })
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data)) { setMessages([]); setLoading(false); return }
        setMessages(data.filter((m) => m.name || m.message || m.timestamp).reverse())
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  return (
    <section id="messages" className="relative w-full overflow-hidden">

      {/* Solid ivory base */}
      <div className="absolute inset-0 -z-10" style={{ background: IVORY }} />

      {/* Multi-stop tinted vertical gradient */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(180deg,
          rgba(238,212,188,0.38) 0%,
          rgba(251,244,234,0.0)  22%,
          rgba(213,238,248,0.26) 52%,
          rgba(251,244,234,0.0)  78%,
          rgba(213,238,248,0.36) 100%
        )`,
      }} />

      {/* Diagonal warm-to-cool wash */}
      <div className="absolute inset-0 -z-10 pointer-events-none" style={{
        background: `linear-gradient(112deg, rgba(238,212,188,0.14) 0%, transparent 44%, rgba(213,238,248,0.14) 100%)`,
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
          radial-gradient(ellipse 50% 38% at 0%   0%,   rgba(238,212,188,0.28) 0%, transparent 60%),
          radial-gradient(ellipse 40% 34% at 100% 0%,   rgba(213,238,248,0.26) 0%, transparent 55%),
          radial-gradient(ellipse 44% 36% at 0%   100%, rgba(213,238,248,0.24) 0%, transparent 55%),
          radial-gradient(ellipse 40% 34% at 100% 100%, rgba(238,212,188,0.24) 0%, transparent 55%)
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
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

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
              Blessings for Kaezar Isaiahnuel
            </p>

            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to left, ${GOLD}99, transparent)` }} />
              <span style={{ color: GOLD, fontSize: "9px", opacity: 0.9 }}>✦</span>
              <div className="h-px w-12 sm:w-20" style={{ background: `linear-gradient(to right, ${GOLD}99, transparent)` }} />
            </div>

            <h2
              className="gistesy"
              style={{
                fontSize: "clamp(2.4rem, 10vw, 5rem)",
                color: DEEP,
                lineHeight: 1.1,
                overflow: "visible",
                paddingTop: "0.1em",
                marginBottom: "0.5rem",
              }}
            >
              Love Notes &amp; Prayers
            </h2>

            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to left, ${BLUE_MID}cc, transparent)` }} />
              <span style={{ color: BLUE_MID, fontSize: "5px", letterSpacing: "0.25em" }}>◆◆◆</span>
              <div className="h-px w-8 sm:w-14" style={{ background: `linear-gradient(to right, ${BLUE_MID}cc, transparent)` }} />
            </div>

            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.78rem, 2.5vw, 0.94rem)",
                color: MEDIUM,
                fontStyle: "italic",
                lineHeight: 1.9,
                maxWidth: "460px",
                margin: "0 auto",
              }}
            >
              Leave a short note or a prayer. Every blessing becomes part of Kaezar&apos;s forever story.
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to left, ${GOLD}55, transparent)` }} />
              <Sparkles className="h-3.5 w-3.5 opacity-60" style={{ color: GOLD }} />
              <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(to right, ${GOLD}55, transparent)` }} />
            </div>
          </div>

          {/* ── Form ── */}
          <div className="flex justify-center mb-10 sm:mb-12">
            <div className="relative max-w-xl w-full">
              <MessageForm onMessageSent={fetchMessages} />
            </div>
          </div>

          {/* ── Messages wall ── */}
          <div className="relative max-w-2xl mx-auto">

            {/* Wall sub-header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="relative inline-block mb-3">
                <div className="absolute inset-0 rounded-full blur-xl scale-150 opacity-20" style={{ background: BABY_BLUE }} />
                <div
                  className="relative w-11 h-11 rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform"
                  style={{ background: `linear-gradient(135deg, ${BABY_BLUE}, ${DEEP})`, boxShadow: `0 4px 16px ${BABY_BLUE}44` }}
                >
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
              </div>

              <h3
                className="gistesy"
                style={{
                  fontSize: "clamp(1.6rem, 6vw, 2.8rem)",
                  color: DEEP,
                  lineHeight: 1.2,
                  overflow: "visible",
                  paddingTop: "0.1em",
                  marginBottom: "0.3rem",
                }}
              >
                Messages from the Heart
              </h3>

              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="h-px w-6 sm:w-10" style={{ background: `linear-gradient(to left, ${GOLD}77, transparent)` }} />
                <span style={{ color: GOLD, fontSize: "5px", opacity: 0.75 }}>◆</span>
                <div className="h-px w-6 sm:w-10" style={{ background: `linear-gradient(to right, ${GOLD}77, transparent)` }} />
              </div>

              <p
                className="garamond"
                style={{
                  fontSize: "clamp(0.72rem, 2.2vw, 0.86rem)",
                  color: MEDIUM,
                  fontStyle: "italic",
                  opacity: 0.85,
                  maxWidth: "360px",
                  margin: "0 auto",
                }}
              >
                Read the beautiful blessings shared by family and friends
              </p>
            </div>

            <MessageWallDisplay messages={messages} loading={loading} />
          </div>

        </div>
      </div>
    </section>
  )
}
