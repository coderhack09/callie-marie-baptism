"use client"

import { useState, useEffect, useCallback } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { getCloudinaryUrl } from "@/lib/cloudinary"
import { C, roseLine, text } from "@/components/loader/christening-theme"
import { CornerFloralDecor, DiamondRule } from "@/components/loader/ChristeningDecor"
import { ChristeningParticles } from "@/components/loader/ChristeningParticles"

function imgSrc(path: string, width: number): string {
  return getCloudinaryUrl(path, { width, quality: "auto" })
}

function onImgError(e: React.SyntheticEvent<HTMLImageElement>, fallback: string) {
  const img = e.currentTarget
  if (img.src !== fallback) img.src = fallback
}

const galleryItems = [
  { image: "/desktop_background/box1.jpg" },
  { image: "/desktop_background/box2.jpg" },
  { image: "/desktop_background/box3.jpg" },
  { image: "/desktop_background/box4.jpg" },
]

const tileStyle = {
  border: `1.5px solid ${C.blushDeep}`,
  boxShadow: "0 8px 32px rgba(107,61,79,0.08), inset 0 1px 0 rgba(255,255,255,0.70)",
} as const

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<(typeof galleryItems)[0] | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState(0)
  const [zoomScale, setZoomScale] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [pinchStartDist, setPinchStartDist] = useState<number | null>(null)
  const [pinchStartScale, setPinchStartScale] = useState(1)
  const [lastTap, setLastTap] = useState(0)
  const [panStart, setPanStart] = useState<{ x: number; y: number; panX: number; panY: number } | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const navigateImage = useCallback((direction: "prev" | "next") => {
    setCurrentIndex((prevIndex) => {
      const newIndex =
        direction === "next"
          ? (prevIndex + 1) % galleryItems.length
          : (prevIndex - 1 + galleryItems.length) % galleryItems.length
      setSelectedImage(galleryItems[newIndex])
      return newIndex
    })
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return
      if (e.key === "ArrowLeft") navigateImage("prev")
      if (e.key === "ArrowRight") navigateImage("next")
      if (e.key === "Escape") setSelectedImage(null)
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [selectedImage, currentIndex, navigateImage])

  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [selectedImage])

  useEffect(() => {
    if (selectedImage) {
      const next = new window.Image()
      next.src = imgSrc(galleryItems[(currentIndex + 1) % galleryItems.length].image, 1200)
      const prev = new window.Image()
      prev.src = imgSrc(galleryItems[(currentIndex - 1 + galleryItems.length) % galleryItems.length].image, 1200)
    }
  }, [selectedImage, currentIndex])

  const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val))
  const resetZoom = () => {
    setZoomScale(1)
    setPan({ x: 0, y: 0 })
    setPanStart(null)
  }

  const openImage = (item: (typeof galleryItems)[0], index: number) => {
    setSelectedImage(item)
    setCurrentIndex(index)
  }

  return (
    <section
      id="gallery"
      className="relative overflow-hidden py-14 sm:py-20 md:py-24 lg:py-28"
      style={{
        background: `linear-gradient(175deg, ${C.ivory} 0%, ${C.champagne} 35%, ${C.blushSoft} 100%)`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: `
            radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,253,249,0.90) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 10% 80%, rgba(245,221,224,0.35) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 90% 75%, rgba(232,196,204,0.28) 0%, transparent 70%)
          `,
        }}
      />

      <ChristeningParticles scoped opacity={0.38} />
      <CornerFloralDecor opacity={0.75} sizeClass="w-24 sm:w-36 md:w-44 lg:w-52" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16 max-w-lg mx-auto">
          <p style={{
            fontFamily: '"Cinzel", serif',
            fontSize: "clamp(0.65rem, 2.4vw, 0.82rem)",
            fontWeight: 600,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: C.goldDeep,
            marginBottom: "0.6rem",
            paddingRight: "0.36em",
          }}>
            Precious Moments
          </p>

          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10 sm:w-14" style={{ background: roseLine("left", 0.50) }} />
            <div className="animate-pearl-pulse" style={{
              width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)",
              background: C.gold, opacity: 0.75,
            }} />
            <div className="h-px w-10 sm:w-14" style={{ background: roseLine("right", 0.50) }} />
          </div>

          <h2 style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 700,
            fontSize: "clamp(2.2rem, 9vw, 4.2rem)",
            color: C.roseDeep,
            lineHeight: 1.1,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "0.8rem",
          }}>
            Gallery
          </h2>

          <DiamondRule width="clamp(180px, 55vw, 260px)" margin="0 auto" />

          <p style={{
            fontFamily: '"Fahkwang", sans-serif',
            fontWeight: 400,
            fontSize: "clamp(0.82rem, 2.8vw, 0.96rem)",
            color: text.body,
            marginTop: "clamp(0.9rem, 2.8vw, 1.3rem)",
            lineHeight: 1.7,
            letterSpacing: "0.01em",
          }}>
            A glimpse of our little blessing — each photo a treasured memory
          </p>
        </div>

        {/* Gallery grid */}
        <div className="w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-64 sm:h-80 md:h-96">
              <div
                className="w-12 h-12 rounded-full animate-spin"
                style={{
                  border: `3px solid ${C.blushDeep}`,
                  borderTopColor: C.gold,
                }}
              />
            </div>
          ) : (
            <>
              {/* Mobile carousel */}
              <div className="sm:hidden">
                <div
                  className="flex gap-3 overflow-x-auto px-1 pb-3 snap-x snap-mandatory scroll-px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  aria-label="Gallery carousel"
                >
                  {galleryItems.map((item, index) => (
                    <button
                      key={item.image + index}
                      type="button"
                      className="group relative snap-center shrink-0 w-[82%] overflow-hidden rounded-xl transition-all duration-300 active:scale-[0.99]"
                      style={tileStyle}
                      onClick={() => openImage(item, index)}
                      aria-label={`Open image ${index + 1}`}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden">
                        <img
                          src={imgSrc(item.image, 600)}
                          onError={(e) => onImgError(e, item.image)}
                          alt={`Gallery image ${index + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-500 group-active:scale-[1.03]"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-active:opacity-100 transition-opacity duration-300"
                          style={{ background: "linear-gradient(to top, rgba(107,61,79,0.45) 0%, transparent 55%)" }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
                <p style={{
                  marginTop: "0.6rem",
                  textAlign: "center",
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(0.55rem, 1.8vw, 0.68rem)",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                  color: text.caption,
                }}>
                  Swipe to explore
                </p>
              </div>

              {/* Tablet / desktop grid */}
              <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 lg:gap-6">
                {galleryItems.map((item, index) => (
                  <button
                    key={item.image + index}
                    type="button"
                    className="group relative w-full overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                    style={tileStyle}
                    onClick={() => openImage(item, index)}
                    aria-label={`Open image ${index + 1}`}
                  >
                    <div className="relative aspect-[3/4] md:aspect-square overflow-hidden">
                      <img
                        src={imgSrc(item.image, 500)}
                        onError={(e) => onImgError(e, item.image)}
                        alt={`Gallery image ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: "linear-gradient(to top, rgba(107,61,79,0.50) 0%, transparent 55%)" }}
                      />
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: `linear-gradient(to right, transparent, ${C.gold}, transparent)` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4"
          style={{ background: "rgba(43, 28, 35, 0.94)", backdropFilter: "blur(8px)" }}
          onClick={() => { setSelectedImage(null); resetZoom() }}
        >
          <div
            className="relative max-w-6xl w-full h-full sm:h-auto flex flex-col items-center justify-center"
            onTouchStart={(e) => {
              if (e.touches.length === 1) {
                const now = Date.now()
                if (now - lastTap < 300) {
                  setZoomScale((s) => (s > 1 ? 1 : 2))
                  setPan({ x: 0, y: 0 })
                }
                setLastTap(now)
                const t = e.touches[0]
                setTouchStartX(t.clientX)
                setTouchDeltaX(0)
                if (zoomScale > 1) {
                  setPanStart({ x: t.clientX, y: t.clientY, panX: pan.x, panY: pan.y })
                }
              }
              if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX
                const dy = e.touches[0].clientY - e.touches[1].clientY
                setPinchStartDist(Math.hypot(dx, dy))
                setPinchStartScale(zoomScale)
              }
            }}
            onTouchMove={(e) => {
              if (e.touches.length === 2 && pinchStartDist) {
                const dx = e.touches[0].clientX - e.touches[1].clientX
                const dy = e.touches[0].clientY - e.touches[1].clientY
                setZoomScale(clamp((Math.hypot(dx, dy) / pinchStartDist) * pinchStartScale, 1, 3))
              } else if (e.touches.length === 1) {
                const t = e.touches[0]
                if (zoomScale > 1 && panStart) {
                  setPan({ x: panStart.panX + t.clientX - panStart.x, y: panStart.panY + t.clientY - panStart.y })
                } else if (touchStartX !== null) {
                  setTouchDeltaX(t.clientX - touchStartX)
                }
              }
            }}
            onTouchEnd={() => {
              setPinchStartDist(null)
              setPanStart(null)
              if (zoomScale === 1 && Math.abs(touchDeltaX) > 50) {
                navigateImage(touchDeltaX > 0 ? "prev" : "next")
              }
              setTouchStartX(null)
              setTouchDeltaX(0)
            }}
          >
            <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-4 sm:p-6">
              <div
                className="backdrop-blur-md rounded-full px-4 py-2 border"
                style={{ backgroundColor: "rgba(107,61,79,0.45)", borderColor: "rgba(201,168,108,0.45)" }}
              >
                <span style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "clamp(0.72rem, 2.2vw, 0.88rem)",
                  fontWeight: 600,
                  color: C.pearl,
                  letterSpacing: "0.08em",
                }}>
                  {currentIndex + 1} / {galleryItems.length}
                </span>
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); resetZoom() }}
                className="backdrop-blur-md rounded-full p-2 sm:p-3 transition-all duration-200 border hover:scale-105"
                style={{ backgroundColor: "rgba(107,61,79,0.45)", borderColor: "rgba(255,253,249,0.25)" }}
                aria-label="Close lightbox"
              >
                <X size={20} className="sm:w-6 sm:h-6 text-white" />
              </button>
            </div>

            {galleryItems.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage("prev"); resetZoom() }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 backdrop-blur-md rounded-full p-3 sm:p-4 transition-all duration-200 border hover:scale-105"
                  style={{ backgroundColor: "rgba(107,61,79,0.45)", borderColor: "rgba(255,253,249,0.20)" }}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} className="sm:w-7 sm:h-7 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateImage("next"); resetZoom() }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 backdrop-blur-md rounded-full p-3 sm:p-4 transition-all duration-200 border hover:scale-105"
                  style={{ backgroundColor: "rgba(107,61,79,0.45)", borderColor: "rgba(255,253,249,0.20)" }}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} className="sm:w-7 sm:h-7 text-white" />
                </button>
              </>
            )}

            <div className="relative w-full h-full flex items-center justify-center pt-16 sm:pt-20 pb-4 sm:pb-6 overflow-hidden">
              <div className="relative inline-block max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
                <img
                  src={imgSrc(selectedImage.image, 1200)}
                  onError={(e) => onImgError(e, selectedImage.image)}
                  alt="Gallery image"
                  style={{
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoomScale})`,
                    transition: pinchStartDist ? "none" : "transform 200ms ease-out",
                  }}
                  className="max-w-full max-h-[75vh] sm:max-h-[85vh] object-contain rounded-lg shadow-2xl will-change-transform"
                />
                {zoomScale > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); resetZoom() }}
                    className="absolute bottom-2 right-2 backdrop-blur-md rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-200"
                    style={{
                      backgroundColor: "rgba(107,61,79,0.55)",
                      borderColor: "rgba(201,168,108,0.40)",
                      color: C.pearl,
                      fontFamily: '"Cinzel", serif',
                      letterSpacing: "0.12em",
                    }}
                  >
                    Reset Zoom
                  </button>
                )}
              </div>
            </div>

            {galleryItems.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 sm:hidden z-20">
                <p style={{
                  fontFamily: '"Cinzel", serif',
                  fontSize: "0.65rem",
                  letterSpacing: "0.20em",
                  color: "rgba(255,253,249,0.70)",
                  backgroundColor: "rgba(107,61,79,0.40)",
                  backdropFilter: "blur(4px)",
                  borderRadius: "9999px",
                  padding: "0.4rem 0.85rem",
                  border: "1px solid rgba(255,253,249,0.12)",
                }}>
                  Swipe to navigate
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
