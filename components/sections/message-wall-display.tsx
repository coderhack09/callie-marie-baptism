"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageCircle, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

// ── Motif palette (aligned with BookOfGuests) ─────────────────────────────────
const DEEP      = "#3D2810"
const MEDIUM    = "#8C6035"
const GOLD      = "#B8822A"
const BABY_BLUE = "#3FA3C8"
const BLUE_MID  = "#7BBEDD"
const IVORY     = "#FEF9F3"

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
            className="rounded-xl sm:rounded-2xl border p-4 sm:p-5"
            style={{
              background: "rgba(254,249,243,0.90)",
              borderColor: `${BABY_BLUE}28`,
              boxShadow: `0 2px 12px ${BABY_BLUE}12`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-10 h-10 rounded-full" style={{ background: `${BABY_BLUE}22` }} />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-28" style={{ background: `${BABY_BLUE}18` }} />
                <Skeleton className="h-2.5 w-20" style={{ background: `${BABY_BLUE}12` }} />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-lg" style={{ background: `${BABY_BLUE}0e` }} />
          </div>
        ))}
      </div>
    )
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (messages.length === 0) {
    return (
      <div className="text-center py-10 sm:py-14 px-4">
        <div className="relative inline-block mb-5">
          <div className="absolute inset-0 rounded-full blur-xl scale-150 opacity-25" style={{ background: BABY_BLUE }} />
          <div
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto shadow-lg"
            style={{ background: `linear-gradient(135deg, ${BABY_BLUE}, ${DEEP})`, boxShadow: `0 4px 20px ${BABY_BLUE}44` }}
          >
            <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <div className="absolute -inset-2 rounded-full border-2 animate-ping" style={{ borderColor: `${BABY_BLUE}30` }} />
        </div>

        <h3 className="gistesy" style={{ fontSize: "clamp(1.4rem, 5vw, 2rem)", color: DEEP, marginBottom: "0.5rem" }}>
          No Messages Yet
        </h3>
        <p className="garamond" style={{ fontSize: "clamp(0.78rem, 2.5vw, 0.92rem)", color: MEDIUM, fontStyle: "italic", maxWidth: "360px", margin: "0 auto 1.5rem" }}>
          Be the first to leave a blessing for Kaezar Isaiahnuel!
        </p>

        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
          style={{ background: `${BABY_BLUE}10`, borderColor: `${BABY_BLUE}44` }}
        >
          <Sparkles className="h-3.5 w-3.5 animate-pulse" style={{ color: GOLD }} />
          <span className="garamond" style={{ fontSize: "clamp(0.65rem, 1.8vw, 0.75rem)", color: MEDIUM }}>
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
          className={`relative rounded-xl sm:rounded-2xl overflow-hidden border transition-all duration-500 hover:shadow-xl group ${
            isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
          style={{
            background: "rgba(254,249,243,0.95)",
            borderColor: `${BABY_BLUE}2e`,
            boxShadow: `0 4px 18px ${BABY_BLUE}12, 0 1px 6px rgba(61,40,16,0.05)`,
            transitionDelay: `${index * 80}ms`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 28px ${BABY_BLUE}22, 0 2px 10px rgba(61,40,16,0.07)` }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 4px 18px ${BABY_BLUE}12, 0 1px 6px rgba(61,40,16,0.05)` }}
        >
          {/* Top accent line */}
          <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}55, transparent)` }} />

          {/* Hover sweep */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{ background: `linear-gradient(135deg, ${BABY_BLUE}06 0%, transparent 60%)` }} />

          <div className="p-3 sm:p-4 md:p-5">

            {/* ── Sender row ── */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-2.5">
                {/* Avatar */}
                <div
                  className="w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ring-2 ring-white group-hover:scale-105 transition-transform duration-300"
                  style={{ background: `linear-gradient(135deg, ${BABY_BLUE}, ${BLUE_MID})`, boxShadow: `0 2px 10px ${BABY_BLUE}44` }}
                >
                  <span className="garamond text-white font-semibold" style={{ fontSize: "clamp(0.72rem, 2.4vw, 0.86rem)" }}>
                    {msg.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 className="garamond leading-tight" style={{ fontSize: "clamp(0.8rem, 2.8vw, 0.95rem)", color: DEEP, fontWeight: 700 }}>
                    {msg.name}
                  </h4>
                  <span className="garamond" style={{ fontSize: "clamp(0.58rem, 1.6vw, 0.68rem)", color: MEDIUM, opacity: 0.75 }}>
                    {new Date(msg.timestamp).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" style={{ color: BABY_BLUE, opacity: 0.65 }} />
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:rotate-12 transition-transform" style={{ color: GOLD, opacity: 0.55 }} />
              </div>
            </div>

            {/* ── Message — centered focal point ── */}
            <div
              className="relative rounded-lg sm:rounded-xl py-5 sm:py-6 px-5 sm:px-8 text-center overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${BABY_BLUE}0a 0%, ${BABY_BLUE}18 50%, ${BABY_BLUE}0a 100%)`,
                border: `1px solid ${BABY_BLUE}2e`,
              }}
            >
              {/* Opening quote — large decorative */}
              <div
                className="absolute top-0 left-3 select-none pointer-events-none"
                style={{ fontSize: "clamp(3rem, 10vw, 5rem)", color: BABY_BLUE, opacity: 0.14, fontFamily: "Georgia, serif", lineHeight: 1 }}
                aria-hidden
              >
                &#8220;
              </div>
              {/* Closing quote — large decorative */}
              <div
                className="absolute bottom-0 right-3 select-none pointer-events-none"
                style={{ fontSize: "clamp(3rem, 10vw, 5rem)", color: BABY_BLUE, opacity: 0.14, fontFamily: "Georgia, serif", lineHeight: 1 }}
                aria-hidden
              >
                &#8221;
              </div>

              {/* Message body */}
              <p
                className="garamond relative z-10"
                style={{
                  fontSize: "clamp(0.9rem, 3.4vw, 1.12rem)",
                  color: DEEP,
                  fontStyle: "italic",
                  lineHeight: 1.95,
                  textAlign: "center",
                  letterSpacing: "0.01em",
                }}
              >
                {msg.message}
              </p>

              {/* Accent dot below */}
              <div className="flex justify-center mt-3">
                <span style={{ color: GOLD, fontSize: "5px", opacity: 0.6 }}>◆</span>
              </div>
            </div>

          </div>

          {/* Bottom accent line */}
          <div className="h-px w-full" style={{ background: `linear-gradient(to right, transparent, ${BABY_BLUE}33, transparent)` }} />
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
