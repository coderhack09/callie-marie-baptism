"use client"

import React, { useEffect, useRef } from "react"

interface Particle {
  x: number; y: number; vx: number; vy: number
  radius: number; opacity: number
  twinklePhase: number; twinkleSpeed: number
  colorIdx: number; kind: number
}

const COLORS = [
  "232, 196, 204",
  "245, 221, 224",
  "201, 168, 108",
  "232, 180, 192",
  "255, 253, 249",
  "240, 200, 210",
]

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(64, Math.max(20, Math.floor((width * height) / 12000)))
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.22,
    vy: -(Math.random() * 0.12 + 0.025),
    radius: Math.random() * 2.2 + 0.3,
    opacity: Math.random() * 0.22 + 0.06,
    twinklePhase: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.012 + 0.003,
    colorIdx: Math.floor(Math.random() * COLORS.length),
    kind: Math.floor(Math.random() * 3),
  }))
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  particles.forEach((p) => {
    p.twinklePhase += p.twinkleSpeed
    const twinkle = (Math.sin(p.twinklePhase) + 1) * 0.5
    const alpha   = p.opacity * (0.3 + twinkle * 0.7)
    const color   = COLORS[p.colorIdx]
    const blurR   = p.radius * (p.kind === 2 ? 6 : 4.5)

    if (p.kind === 2) {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
      g.addColorStop(0,   `rgba(${color},${alpha * 1.1})`)
      g.addColorStop(0.3, `rgba(${color},${alpha * 0.55})`)
      g.addColorStop(1,   `rgba(${color},0)`)
      ctx.beginPath()
      ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    } else if (p.kind === 1) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius * 0.9, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${color},${alpha * 1.2})`
      ctx.fill()
      ctx.beginPath()
      ctx.arc(p.x - p.radius * 0.2, p.y - p.radius * 0.2, p.radius * 0.35, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${alpha * 0.6})`
      ctx.fill()
    } else {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, blurR)
      g.addColorStop(0,   `rgba(${color},${alpha})`)
      g.addColorStop(0.4, `rgba(${color},${alpha * 0.35})`)
      g.addColorStop(1,   `rgba(${color},0)`)
      ctx.beginPath()
      ctx.arc(p.x, p.y, blurR, 0, Math.PI * 2)
      ctx.fillStyle = g
      ctx.fill()
    }

    p.x += p.vx
    p.y += p.vy
    const { width, height } = ctx.canvas
    if (p.y < -30) { p.y = height + 15; p.x = Math.random() * width }
    if (p.x < -30)   p.x = width + 30
    if (p.x > width + 30) p.x = -30
  })
}

interface ChristeningParticlesProps {
  /** When true, sizes to parent bounds instead of the viewport */
  scoped?: boolean
  className?: string
  opacity?: number
}

export function ChristeningParticles({
  scoped = false,
  className = "",
  opacity = 0.62,
}: ChristeningParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = scoped ? containerRef.current : null
    if (!canvas) return

    const resize = () => {
      const width  = scoped && container ? container.clientWidth  : window.innerWidth
      const height = scoped && container ? container.clientHeight : window.innerHeight
      if (width <= 0 || height <= 0) return
      canvas.width  = width
      canvas.height = height
      particlesRef.current = createParticles(width, height)
    }
    resize()

    let cleanupResize: () => void
    if (scoped && container) {
      const ro = new ResizeObserver(resize)
      ro.observe(container)
      window.addEventListener("resize", resize)
      cleanupResize = () => {
        ro.disconnect()
        window.removeEventListener("resize", resize)
      }
    } else {
      window.addEventListener("resize", resize)
      cleanupResize = () => window.removeEventListener("resize", resize)
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let running = true
    const draw = () => {
      if (!running) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawParticles(ctx, particlesRef.current)
      animFrameRef.current = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      running = false
      cancelAnimationFrame(animFrameRef.current)
      cleanupResize()
    }
  }, [scoped])

  if (scoped) {
    return (
      <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ mixBlendMode: "soft-light", opacity }}
        />
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-[1] ${className}`}
      style={{ mixBlendMode: "soft-light", opacity }}
      aria-hidden
    />
  )
}
