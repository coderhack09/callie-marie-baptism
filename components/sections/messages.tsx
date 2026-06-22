"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { MessageCircle, Heart, Sparkles, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import MessageWallDisplay from "./message-wall-display"
import { siteConfig } from "@/content/site"
import { fetchGoogleScript } from "@/lib/google-script-client"
import { parseMessagesFromGoogleSheet, type Message } from "@/lib/messages"
import { C, text } from "@/components/loader/christening-theme"
import { CornerFloralDecor } from "@/components/loader/ChristeningDecor"
import { ChristeningParticles } from "@/components/loader/ChristeningParticles"

const cardStyle = {
  background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 48%, ${C.champagne} 100%)`,
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
} as const

const childName = siteConfig.couple.child

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
        .msg-input::placeholder    { color: ${text.caption} !important; opacity: 1 !important; font-style: italic; }
        .msg-textarea::placeholder { color: ${text.caption} !important; opacity: 1 !important; font-style: italic; }
      `}</style>

      <div
        className={`relative w-full rounded-3xl overflow-hidden transition-all duration-500 isolate ${
          isFocused ? "scale-[1.01]" : ""
        } ${isSubmitted ? "animate-bounce" : ""}`}
        style={cardStyle}
      >
        {isSubmitted && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none" style={{ background: "rgba(255,251,247,0.92)" }}>
            <div className="flex flex-col items-center gap-2 animate-pulse">
              <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: C.goldDeep, boxShadow: "0 4px 16px rgba(201,168,108,0.35)" }}>
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <p style={{ fontFamily: '"LeJourScript", cursive', fontSize: "clamp(1.6rem, 5vw, 2.2rem)", color: C.roseDeep, lineHeight: 1.1 }}>Sent!</p>
            </div>
          </div>
        )}

        <div className="p-4 sm:p-5 md:p-6 lg:p-8">
          <div className="text-center mb-4 sm:mb-5">
            <p style={{
              fontFamily: '"Cinzel", serif',
              fontSize: "clamp(0.58rem, 2vw, 0.72rem)",
              fontWeight: 600,
              letterSpacing: "0.36em",
              textTransform: "uppercase",
              color: C.goldDeep,
              marginBottom: "0.5rem",
            }}>
              Share Your Heart
            </p>

            <h3 style={{
              fontFamily: '"Cinzel", serif',
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 5.5vw, 2.4rem)",
              color: C.roseDeep,
              lineHeight: 1.1,
              letterSpacing: "0.04em",
              marginBottom: "0.35rem",
            }}>
              Leave a Blessing
            </h3>

            <p style={{
              fontFamily: '"Fahkwang", sans-serif',
              fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
              color: text.body,
              fontStyle: "italic",
              lineHeight: 1.75,
              marginTop: "0.5rem",
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
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-medium" style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.75rem, 2.4vw, 0.88rem)", color: C.roseDeep }}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${focusedField === "name" ? "scale-110" : ""}`} style={{ background: C.blushSoft }}>
                  <Heart className="h-2.5 w-2.5" style={{ color: C.goldDeep }} />
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
                  className="msg-input w-full border rounded-xl py-2.5 px-4 text-xs sm:text-sm transition-all duration-300 shadow-sm"
                  style={{
                    fontFamily: '"Fahkwang", sans-serif',
                    color: C.roseDeep,
                    background: C.pearl,
                    borderColor: focusedField === "name" ? C.goldDeep : C.blushDeep,
                  }}
                />
                {nameValue && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full animate-pulse" style={{ background: C.gold }} />}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 font-medium" style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.75rem, 2.4vw, 0.88rem)", color: C.roseDeep }}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform ${focusedField === "message" ? "scale-110" : ""}`} style={{ background: C.blushSoft }}>
                    <MessageCircle className="h-2.5 w-2.5" style={{ color: C.roseDeep }} />
                  </div>
                  Your Blessing
                </label>
                {messageValue && (
                  <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "0.65rem", color: messageValue.length > 500 ? "#ef4444" : text.caption }}>
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
                  placeholder={`Share a prayer, a wish, or words of love for ${childName}...`}
                  className="msg-textarea w-full border rounded-xl min-h-[90px] sm:min-h-[110px] text-xs sm:text-sm resize-none transition-all duration-300 shadow-sm py-3 px-4"
                  style={{
                    fontFamily: '"Fahkwang", sans-serif',
                    color: C.roseDeep,
                    background: C.pearl,
                    borderColor: focusedField === "message" ? C.goldDeep : C.blushDeep,
                  }}
                />
                {messageValue && <div className="absolute right-3 top-3 w-2 h-2 rounded-full animate-pulse" style={{ background: C.gold }} />}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !nameValue.trim() || !messageValue.trim()}
              className="w-full rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                fontFamily: '"Cinzel", serif',
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                background: C.roseDeep,
                color: C.pearl,
                border: "none",
                boxShadow: "0 6px 20px rgba(107,61,79,0.22)",
              }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) { e.currentTarget.style.background = C.goldDeep; e.currentTarget.style.boxShadow = "0 8px 26px rgba(201,168,108,0.28)" } }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.roseDeep; e.currentTarget.style.boxShadow = "0 6px 20px rgba(107,61,79,0.22)" }}
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

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchGoogleScript<unknown>("message")
      setMessages(parseMessagesFromGoogleSheet(data).reverse())
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  return (
    <section id="messages" className="relative w-full overflow-hidden bg-transparent py-12 sm:py-16 md:py-20">
      <ChristeningParticles scoped opacity={0.35} />
      <CornerFloralDecor opacity={0.68} sizeClass="w-20 sm:w-32 md:w-40 lg:w-48" />

      {/* Section header */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-block rounded-3xl px-8 py-7 sm:px-12 sm:py-9 isolate" style={cardStyle}>
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.58rem, 2vw, 0.72rem)",
            fontWeight: 600,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: C.goldDeep,
            marginBottom: "0.5rem",
          }}>
            Blessings for {childName}
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
            Love Notes &amp; Prayers
          </h2>

          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
            color: text.body,
            lineHeight: 1.8,
            fontStyle: "italic",
            maxWidth: "32rem",
            margin: "0 auto",
          }}>
            Leave a short note or a prayer. Every blessing becomes part of {childName.split(" ")[0]}&apos;s forever story.
          </p>
        </div>
      </div>

      <div className="relative z-10 pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          <div className="flex justify-center mb-10 sm:mb-12">
            <div className="relative max-w-xl w-full">
              <MessageForm onMessageSent={fetchMessages} />
            </div>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <p style={{
                fontFamily: '"Cinzel", serif',
                fontSize: "clamp(0.58rem, 2vw, 0.72rem)",
                fontWeight: 500,
                letterSpacing: "0.36em",
                textTransform: "uppercase",
                color: "rgba(255,253,249,0.82)",
                textShadow: "0 1px 10px rgba(107,61,79,0.28)",
                marginBottom: "0.5rem",
              }}>
                From Our Guests
              </p>

              <h3 style={{
                fontFamily: '"LeJourScript", cursive',
                fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
                color: C.pearl,
                lineHeight: 1.15,
                textShadow: "0 2px 16px rgba(107,61,79,0.32), 0 1px 4px rgba(0,0,0,0.10)",
                marginBottom: "0.35rem",
              }}>
                Messages from the Heart
              </h3>

              <p style={{
                fontFamily: '"Fahkwang", sans-serif',
                fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
                fontWeight: 300,
                color: "rgba(255,251,247,0.88)",
                fontStyle: "italic",
                lineHeight: 1.75,
                textShadow: "0 1px 8px rgba(107,61,79,0.22)",
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
