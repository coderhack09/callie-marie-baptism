"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { MessageCircle, Heart, Sparkles, Send } from "lucide-react"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"
import { Section } from "@/components/section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
import { siteConfig } from "@/content/site"

// ── Motif palette ─────────────────────────────────────────────────────────────
const DEEP   = "#8B6F5A"
const ACCENT = "#CFA06B"

const DECO_FILTER = "brightness(0) invert(1)"

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
        .msg-input::placeholder  { color: #B8A090 !important; opacity: 1 !important; font-style: italic; }
        .msg-textarea::placeholder { color: #B8A090 !important; opacity: 1 !important; font-style: italic; }
      `}</style>

      {/* Card */}
      <div
        className={`relative w-full border-2 rounded-2xl overflow-hidden transition-all duration-500 ${
          isFocused ? "scale-[1.01]" : ""
        } ${isSubmitted ? "animate-bounce" : ""}`}
        style={{
          background: "rgba(255,247,240,0.95)",
          borderColor: isFocused ? "rgba(207,160,107,0.65)" : "rgba(207,160,107,0.30)",
          boxShadow: "0 12px 40px rgba(139,111,90,0.18)",
        }}
      >
        {/* Top accent line */}
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.55), transparent)` }} />

        {/* Success overlay */}
        {isSubmitted && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ background: "rgba(255,247,240,0.93)" }}>
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${DEEP})` }}>
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
              <div className="absolute inset-0 rounded-full blur-lg scale-150 opacity-20" style={{ background: ACCENT }} />
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto shadow-md" style={{ background: `linear-gradient(135deg, ${ACCENT}, ${DEEP})` }}>
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <h3 className="gistesy" style={{ fontSize: "clamp(1.6rem, 6vw, 2.4rem)", color: DEEP, lineHeight: 1.2, marginBottom: "0.25rem" }}>
              Leave a Blessing
            </h3>
            <p className="garamond" style={{ fontSize: "clamp(0.72rem, 2.2vw, 0.84rem)", color: DEEP, opacity: 0.7, fontStyle: "italic" }}>
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
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${focusedField === "name" ? "scale-110" : ""}`} style={{ background: "rgba(207,160,107,0.18)" }}>
                  <Heart className="h-2.5 w-2.5" style={{ color: ACCENT }} />
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
                    borderColor: focusedField === "name" ? "rgba(207,160,107,0.65)" : "rgba(207,160,107,0.28)",
                  }}
                />
                {nameValue && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="garamond flex items-center gap-1.5 text-xs sm:text-sm font-semibold" style={{ color: DEEP }}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${focusedField === "message" ? "scale-110" : ""}`} style={{ background: "rgba(207,160,107,0.18)" }}>
                    <MessageCircle className="h-2.5 w-2.5" style={{ color: ACCENT }} />
                  </div>
                  Your Blessing
                </label>
                {messageValue && (
                  <span className="garamond" style={{ fontSize: "0.65rem", color: messageValue.length > 500 ? "#ef4444" : DEEP, opacity: 0.65 }}>
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
                  placeholder="Share a prayer, a wish, or words of love for Niahna Celestine..."
                  className="msg-textarea garamond w-full border-2 rounded-xl min-h-[90px] sm:min-h-[110px] text-xs sm:text-sm resize-none bg-white/80 transition-all duration-300 shadow-sm py-3 px-4"
                  style={{
                    color: DEEP,
                    borderColor: focusedField === "message" ? "rgba(207,160,107,0.65)" : "rgba(207,160,107,0.28)",
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
                background: `linear-gradient(135deg, ${ACCENT}, ${DEEP})`,
                color: "white",
                border: "none",
                boxShadow: "0 6px 20px rgba(139,111,90,0.30)",
              }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.boxShadow = "0 8px 26px rgba(139,111,90,0.40)" }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(139,111,90,0.30)" }}
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
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(to right, transparent, rgba(207,160,107,0.40), transparent)` }} />
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
    <Section id="messages" className="relative overflow-hidden">
      {/* Corner florals */}
      {/* <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-40" priority={false} style={{ filter: DECO_FILTER }} />
      </div>
      <div className="absolute right-0 bottom-0 z-0 pointer-events-none">
        <CloudinaryImage src="/decoration/flower-decoration-left-bottom-corner2.png" alt="" width={300} height={300} className="w-auto h-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] opacity-40 scale-x-[-1]" priority={false} style={{ filter: DECO_FILTER }} />
      </div> */}

      <div className="relative z-10 max-w-6xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">

        {/* ── Section Header ── */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">

          {/* Eyebrow */}
          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.56rem, 2.2vw, 0.72rem)",
              letterSpacing: "0.48em",
              textTransform: "uppercase",
              color: "var(--color-motif-cream)",
              opacity: 0.8,
              marginBottom: "0.5rem",
              paddingRight: "0.48em",
            }}
          >
            Blessings for Niahna Celestine
          </p>

          {/* Ornament */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to left, rgba(255,247,240,0.4), transparent)" }} />
            <span style={{ color: "rgba(255,247,240,0.55)", fontSize: "7px" }}>✦</span>
            <div className="h-px w-8 sm:w-12" style={{ background: "linear-gradient(to right, rgba(255,247,240,0.4), transparent)" }} />
          </div>

          {/* Title */}
          <h2
            className="gistesy"
            style={{
              fontSize: "clamp(2.2rem, 9vw, 4.5rem)",
              color: "var(--color-motif-cream)",
              lineHeight: 1.15,
              overflow: "visible",
              paddingTop: "0.1em",
              marginBottom: "0.5rem",
              textShadow: "0 2px 20px rgba(0,0,0,0.20)",
            }}
          >
            Love Notes &amp; Prayers
          </h2>

          <p
            className="garamond"
            style={{
              fontSize: "clamp(0.78rem, 2.5vw, 0.94rem)",
              color: "var(--color-motif-cream)",
              fontStyle: "italic",
              opacity: 0.78,
              lineHeight: 1.85,
              maxWidth: "440px",
              margin: "0 auto",
            }}
          >
            Leave a short note or a prayer. Every blessing becomes part of Niahna&apos;s forever story.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(to left, rgba(255,247,240,0.35), transparent)" }} />
            <span style={{ color: "rgba(255,247,240,0.40)", fontSize: "5px" }}>◆</span>
            <div className="h-px w-10 sm:w-14" style={{ background: "linear-gradient(to right, rgba(255,247,240,0.35), transparent)" }} />
          </div>
        </div>

        {/* ── Form ── */}
        <div className="flex justify-center mb-8 sm:mb-10 md:mb-12">
          <div className="relative max-w-xl w-full">
            <MessageForm onMessageSent={fetchMessages} />
          </div>
        </div>

        {/* ── Messages wall ── */}
        <div className="relative max-w-2xl mx-auto">
          <div className="text-center mb-5 sm:mb-6 md:mb-8">
            <div className="relative inline-block mb-3">
              <div className="absolute inset-0 rounded-full blur-xl scale-150 opacity-20" style={{ background: ACCENT }} />
              <div
                className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center mx-auto shadow-lg hover:scale-110 transition-transform"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, ${DEEP})` }}
              >
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>

            <h3
              className="gistesy"
              style={{
                fontSize: "clamp(1.6rem, 6vw, 2.8rem)",
                color: "var(--color-motif-cream)",
                lineHeight: 1.2,
                overflow: "visible",
                paddingTop: "0.1em",
                marginBottom: "0.3rem",
                textShadow: "0 2px 16px rgba(0,0,0,0.18)",
              }}
            >
              Messages from the Heart
            </h3>
            <p
              className="garamond"
              style={{
                fontSize: "clamp(0.72rem, 2.2vw, 0.86rem)",
                color: "var(--color-motif-cream)",
                fontStyle: "italic",
                opacity: 0.72,
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
    </Section>
  )
}
