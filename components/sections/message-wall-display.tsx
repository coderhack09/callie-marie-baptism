"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Heart, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { C, text } from "@/components/loader/christening-theme"
import { siteConfig } from "@/content/site"

const cardStyle = {
  background: `linear-gradient(170deg, ${C.ivory} 0%, ${C.blushSoft} 48%, ${C.champagne} 100%)`,
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 20px 64px rgba(107,61,79,0.08), 0 2px 10px rgba(232,196,204,0.20), inset 0 1px 0 rgba(255,255,255,0.90)",
} as const

const childName = siteConfig.couple.child

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

  if (loading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl p-4 sm:p-5 isolate" style={cardStyle}>
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="w-10 h-10 rounded-full" style={{ background: C.blushSoft }} />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-3 w-28" style={{ background: C.blushSoft }} />
                <Skeleton className="h-2.5 w-20" style={{ background: C.blush }} />
              </div>
            </div>
            <Skeleton className="h-16 w-full rounded-lg" style={{ background: C.blushSoft }} />
          </div>
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-10 sm:py-14 px-4">
        <div className="inline-block rounded-3xl px-8 py-8 sm:px-10 sm:py-10 isolate max-w-md mx-auto" style={cardStyle}>
          <h3 style={{
            fontFamily: '"LeJourScript", cursive',
            fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)",
            color: C.roseDeep,
            lineHeight: 1.15,
            marginBottom: "0.5rem",
          }}>
            No Messages Yet
          </h3>
          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
            color: text.body,
            fontStyle: "italic",
            lineHeight: 1.75,
            margin: "0 auto 1.5rem",
          }}>
            Be the first to leave a blessing for {childName}!
          </p>

          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border"
            style={{ background: C.blushSoft, borderColor: C.blushDeep }}
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" style={{ color: C.goldDeep }} />
            <span style={{ fontFamily: '"Fahkwang", sans-serif', fontSize: "clamp(0.78rem, 2.2vw, 0.9rem)", color: text.caption, fontStyle: "italic" }}>
              Your message will appear here
            </span>
            <Sparkles className="h-3.5 w-3.5 animate-pulse" style={{ color: C.goldDeep }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {visibleMessages.map((msg, index) => (
        <div
          key={index}
          className={`relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-0.5 group isolate ${
            isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
          }`}
          style={{
            ...cardStyle,
            transitionDelay: `${index * 80}ms`,
          }}
        >
          <div className="h-[2px] w-full" style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)`, opacity: 0.45 }} />

          <div className="p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center shadow-md flex-shrink-0 ring-2 ring-[#FFFDF9] group-hover:scale-105 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${C.goldDeep} 0%, ${C.gold} 100%)`,
                    boxShadow: "0 4px 14px rgba(201,168,108,0.28)",
                  }}
                >
                  <span style={{
                    fontFamily: '"Cinzel", serif',
                    color: C.pearl,
                    fontWeight: 600,
                    fontSize: "clamp(0.72rem, 2.4vw, 0.88rem)",
                  }}>
                    {msg.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                </div>

                <div className="min-w-0">
                  <h4 style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: "clamp(0.88rem, 2.6vw, 1.02rem)",
                    color: C.roseDeep,
                    fontWeight: 600,
                    lineHeight: 1.45,
                  }}>
                    {msg.name}
                  </h4>
                  <span style={{
                    fontFamily: '"Fahkwang", sans-serif',
                    fontSize: "clamp(0.72rem, 2vw, 0.82rem)",
                    color: text.caption,
                    fontStyle: "italic",
                  }}>
                    {new Date(msg.timestamp).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:scale-110 transition-transform" style={{ color: C.goldDeep, opacity: 0.75 }} />
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:rotate-12 transition-transform" style={{ color: C.goldDeep, opacity: 0.65 }} />
              </div>
            </div>

            <div
              className="relative rounded-xl py-5 sm:py-6 px-5 sm:px-8 text-center overflow-hidden"
              style={{
                background: C.pearl,
                border: `1px solid ${C.blushDeep}`,
              }}
            >
              <div
                className="absolute top-0 left-3 select-none pointer-events-none"
                style={{ fontSize: "clamp(3rem, 10vw, 5rem)", color: C.goldDeep, opacity: 0.16, fontFamily: "Georgia, serif", lineHeight: 1 }}
                aria-hidden
              >
                &#8220;
              </div>
              <div
                className="absolute bottom-0 right-3 select-none pointer-events-none"
                style={{ fontSize: "clamp(3rem, 10vw, 5rem)", color: C.goldDeep, opacity: 0.16, fontFamily: "Georgia, serif", lineHeight: 1 }}
                aria-hidden
              >
                &#8221;
              </div>

              <p
                className="relative z-10"
                style={{
                  fontFamily: '"Fahkwang", sans-serif',
                  fontSize: "clamp(0.88rem, 2.8vw, 1.02rem)",
                  color: text.body,
                  fontStyle: "italic",
                  lineHeight: 1.8,
                  textAlign: "center",
                }}
              >
                {msg.message}
              </p>

              <div className="flex justify-center mt-3">
                <div style={{
                  width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)",
                  background: C.gold, opacity: 0.7,
                }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
