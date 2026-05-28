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

// ── Palette — aligned with entourage.tsx ──────────────────────────────────────
const DARK_NAVY = "#1C3050"
const GOLD      = "#C4965A"
const NAVY_MUTE = "rgba(65,90,115,0.78)"
const NAVY = "#2B4A6B"
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
        .msg-input::placeholder    { color: ${NAVY_MUTE} !important; opacity: 1 !important; font-style: italic; }
        .msg-textarea::placeholder { color: ${NAVY_MUTE} !important; opacity: 1 !important; font-style: italic; }
      `}</style>

      {/* Card */}
      <div
        className={`relative w-full rounded-3xl overflow-hidden transition-all duration-500 ${
          isFocused ? "scale-[1.01]" : ""
        } ${isSubmitted ? "animate-bounce" : ""}`}
        style={FROSTED_CARD}
      >
        {/* Success overlay */}
        {isSubmitted && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ background: "rgba(255,255,255,0.85)" }}>
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: GOLD, boxShadow: "0 3px 12px rgba(196,152,88,0.35)" }}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <p style={{ fontFamily: '"LeJourScript", cursive', fontSize: "clamp(1.6rem, 5vw, 2.2rem)", color: GOLD, lineHeight: 1.1 }}>Sent!</p>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          {/* Form header */}
          <div className="text-center mb-4 sm:mb-5">
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
              letterSpacing: "0.40em",
              textTransform: "uppercase",
              color: "rgba(72,112,148,0.80)",
              marginBottom: "0.5rem",
              paddingRight: "0.40em",
            }}>
              Share Your Heart
            </p>

            <h3 style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(1.6rem, 5.5vw, 2.8rem)",
              color: NAVY,
              lineHeight: 1.0,
              marginBottom: "0.35rem",
              filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
            }}>
              Leave a Blessing
            </h3>

            <OrnamentDivider width="180px" />

            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
              color: NAVY_MUTE,
              fontStyle: "italic",
              lineHeight: 1.75,
              marginTop: "0.75rem",
            }}>
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
              <label className="flex items-center gap-1.5 font-medium" style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: DARK_NAVY }}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${focusedField === "name" ? "scale-110" : ""}`} style={{ background: "rgba(196,152,88,0.15)" }}>
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
                  className="msg-input w-full border rounded-xl py-2.5 px-4 text-xs sm:text-sm bg-white/70 transition-all duration-300 shadow-sm"
                  style={{
                    fontFamily: '"Fahkwang", sans-serif',
                    color: DARK_NAVY,
                    borderColor: focusedField === "name" ? "rgba(196,152,88,0.45)" : "rgba(43,74,107,0.22)",
                  }}
                />
                {nameValue && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 font-medium" style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: DARK_NAVY }}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${focusedField === "message" ? "scale-110" : ""}`} style={{ background: "rgba(43,74,107,0.08)" }}>
                    <MessageCircle className="h-2.5 w-2.5" style={{ color: DARK_NAVY }} />
                  </div>
                  Your Blessing
                </label>
                {messageValue && (
                  <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "0.65rem", color: messageValue.length > 500 ? "#ef4444" : NAVY_MUTE, opacity: 0.75 }}>
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
                  className="msg-textarea w-full border rounded-xl min-h-[90px] sm:min-h-[110px] text-xs sm:text-sm resize-none bg-white/70 transition-all duration-300 shadow-sm py-3 px-4"
                  style={{
                    fontFamily: '"Fahkwang", sans-serif',
                    color: DARK_NAVY,
                    borderColor: focusedField === "message" ? "rgba(196,152,88,0.45)" : "rgba(43,74,107,0.22)",
                  }}
                />
                {messageValue && <div className="absolute right-3 top-3 w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className="w-full rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                fontFamily: '"Cinzel", serif',
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: GOLD,
                color: "white",
                border: "none",
                boxShadow: "0 6px 20px rgba(196,152,88,0.30)",
              }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = DARK_NAVY; e.currentTarget.style.boxShadow = "0 8px 26px rgba(28,48,80,0.25)" } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = GOLD; e.currentTarget.style.boxShadow = "0 6px 20px rgba(196,152,88,0.30)" }}
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

      {/* ── Section header — aligned with entourage ── */}
      <div className="relative z-10 text-center pt-12 sm:pt-16 pb-8 sm:pb-10 px-4 max-w-3xl mx-auto">

            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
              letterSpacing: "0.40em",
              textTransform: "uppercase",
              color: "rgba(72,112,148,0.80)",
              marginBottom: "0.4rem",
              paddingRight: "0.40em",
            }}>
              Blessings for Kaezar Isaiahnuel
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
              Love Notes &amp; Prayers
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
              Leave a short note or a prayer. Every blessing becomes part of Kaezar&apos;s forever story.
            </p>
      </div>

      <div className="relative z-10 pb-12 sm:pb-16">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

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
              <p style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.52rem, 1.9vw, 0.64rem)",
                letterSpacing: "0.40em",
                textTransform: "uppercase",
                color: "rgba(72,112,148,0.80)",
                marginBottom: "0.4rem",
                paddingRight: "0.40em",
              }}>
                From Our Guests
              </p>

              <OrnamentDivider width="180px" />

              <h3 style={{
                fontFamily: '"LeJourScript", cursive',
                fontSize: "clamp(1.4rem, 4.5vw, 2.2rem)",
                color: GOLD,
                lineHeight: 1.0,
                marginTop: "0.75rem",
                marginBottom: "0.35rem",
                filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
              }}>
                Messages from the Heart
              </h3>

              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                color: NAVY_MUTE,
                fontStyle: "italic",
                lineHeight: 1.75,
                maxWidth: "28rem",
                margin: "0 auto",
              }}>
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
