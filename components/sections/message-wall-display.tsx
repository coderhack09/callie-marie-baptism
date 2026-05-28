"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Heart, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

// ── Palette — aligned with entourage.tsx ──────────────────────────────────────
const DARK_NAVY = "#1C3050"
const GOLD      = "#C4965A"
const NAVY_MUTE = "rgba(65,90,115,0.78)"

const GUEST_CARD = {
  background: "rgba(255,255,255,0.30)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1.5px solid rgba(43,74,107,0.22)",
  boxShadow: "0 4px 24px rgba(43,74,107,0.08), 0 1px 0 rgba(255,255,255,0.55) inset",
} as const

interface Message {
  timestamp: string
  name: string
  message: string
}

interface MessageWallDisplayProps {
  messages: Message[]
  loading: boolean
}

export default function MessageWallDisplay({ messages, loading }: MessageWallDisplayProps) {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (messages.length > 0) {
      setIsAnimating(true)
      const t = setTimeout(() => { setVisibleMessages(messages); setIsAnimating(false) }, 100)
      return () => clearTimeout(t)
    } else {
      setVisibleMessages([])
    }
  }, [messages])

  // ── Loading skeletons ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl p-4 sm:p-5"
            style={GUEST_CARD}
          >
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-10 h-10 rounded-full" style={{ background: "rgba(43,74,107,0.08)" }} />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-28" style={{ background: "rgba(43,74,107,0.08)" }} />
                <Skeleton className="h-2.5 w-20" style={{ background: "rgba(43,74,107,0.06)" }} />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-lg" style={{ background: "rgba(43,74,107,0.06)" }} />
          </div>
        ))}
      </div>
    )
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (messages.length === 0) {
    return (
      <div className="text-center py-10 sm:py-14 px-4">
        <h3 style={{
          fontFamily: '"LeJourScript", cursive',
          fontSize: "clamp(1.6rem, 5.5vw, 2.8rem)",
          color: GOLD,
          lineHeight: 1.0,
          marginBottom: "0.5rem",
          filter: "drop-shadow(0 2px 8px rgba(196,152,88,0.16))",
        }}>
          No Messages Yet
        </h3>
        <p style={{
          fontFamily: '"Fahkwang", sans-serif',
          fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
          color: NAVY_MUTE,
          fontStyle: "italic",
          lineHeight: 1.75,
          maxWidth: "28rem",
          margin: "0 auto 1.5rem",
        }}>
          Be the first to leave a blessing for Kaezar Isaiahnuel!
        </p>

        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
          style={{ background: "rgba(196,152,88,0.08)", borderColor: "rgba(196,152,88,0.30)" }}
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" style={{ color: GOLD }} />
          <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
            Your message will appear here
          </span>
          <Sparkles className="h-3.5 w-3.5 animate-pulse" style={{ color: GOLD, animationDelay: "0.5s" }} />
        </div>
      </div>
    )
  }

  // ── Message cards ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3 sm:space-y-4">
      {visibleMessages.map((msg, index) => (
        <div
          key={index}
          className={`relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-xl group ${
            isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
          style={{
            ...GUEST_CARD,
            transitionDelay: `${index * 80}ms`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 28px rgba(43,74,107,0.12), 0 1px 0 rgba(255,255,255,0.55) inset" }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = GUEST_CARD.boxShadow as string }}
        >
          <div className="h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(196,152,88,0.35), transparent)" }} />

          <div className="p-3 sm:p-4 md:p-5">

            {/* ── Sender row ── */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ring-2 ring-white group-hover:scale-105 transition-transform duration-300"
                  style={{ background: GOLD, boxShadow: "0 3px 12px rgba(196,152,88,0.30)" }}
                >
                  <span style={{ fontFamily: '"Cinzel", serif', color: "white", fontWeight: 500, fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)" }}>
                    {msg.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 style={{ fontFamily: '"Cinzel", serif', fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)", color: DARK_NAVY, fontWeight: 500, lineHeight: 1.55 }}>
                    {msg.name}
                  </h4>
                  <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.72rem, 2vw, 0.82rem)", color: NAVY_MUTE, fontStyle: "italic" }}>
                    {new Date(msg.timestamp).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" style={{ color: GOLD, opacity: 0.65 }} />
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:rotate-12 transition-transform" style={{ color: GOLD, opacity: 0.55 }} />
              </div>
            </div>

            {/* ── Message — centered focal point ── */}
            <div
              className="relative rounded-lg sm:rounded-xl py-5 sm:py-6 px-5 sm:px-8 text-center overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.45)",
                border: "1px solid rgba(43,74,107,0.12)",
              }}
            >
              {/* Opening quote — large decorative */}
              <div
                className="absolute top-0 left-3 select-none pointer-events-none"
                style={{ fontSize: "clamp(3rem, 10vw, 5rem)", color: GOLD, opacity: 0.18, fontFamily: "Georgia, serif", lineHeight: 1 }}
                aria-hidden
              >
                &#8220;
              </div>
              {/* Closing quote — large decorative */}
              <div
                className="absolute bottom-0 right-3 select-none pointer-events-none"
                style={{ fontSize: "clamp(3rem, 10vw, 5rem)", color: GOLD, opacity: 0.18, fontFamily: "Georgia, serif", lineHeight: 1 }}
                aria-hidden
              >
                &#8221;
              </div>

              {/* Message body */}
              <p
                className="relative z-10"
                style={{
                  fontFamily: '"Fahkwang", sans-serif',
                  fontSize: "clamp(0.80rem, 2.6vw, 0.92rem)",
                  color: NAVY_MUTE,
                  fontStyle: "italic",
                  lineHeight: 1.75,
                  textAlign: "center",
                }}
              >
                {msg.message}
              </p>

              {/* Accent dot below */}
              <div className="flex justify-center mt-3">
                <div style={{ width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)", background: "rgba(196,152,88,0.68)" }} />
              </div>
            </div>

          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
