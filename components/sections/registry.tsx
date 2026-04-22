"use client"

import { useState } from "react"
import { Section } from "@/components/section"
import { Cinzel } from "next/font/google"
import { siteConfig } from "@/content/site"
import { CloudinaryImage } from "@/components/ui/cloudinary-image"

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600"],
})

const GCASH_QR = Object.values(siteConfig?.giftRegistry ?? {})

export function Registry() {
  const [activeQr, setActiveQr] = useState(GCASH_QR[0]?.id ?? "")
  const activeItem = GCASH_QR.find((i) => i.id === activeQr) ?? GCASH_QR[0]

  return (
    <Section
      id="registry"
      className="relative overflow-hidden py-10 sm:py-12 md:py-16 lg:py-20"
    >
      <div className="relative z-10 text-center mb-6 sm:mb-8 md:mb-10 px-3 sm:px-4">
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
          <div className="w-8 sm:w-12 md:w-16 h-px bg-motif-cream/60" />
          <div className="w-1.5 h-1.5 bg-motif-cream/80 rounded-full" />
          <div className="w-1.5 h-1.5 bg-motif-cream/60 rounded-full" />
          <div className="w-1.5 h-1.5 bg-motif-cream/80 rounded-full" />
          <div className="w-8 sm:w-12 md:w-16 h-px bg-motif-cream/60" />
        </div>
        
        <h2 
          className="lighten-regular text-[40px] sm:text-[50px] md:text-[60px] lg:text-[70px] xl:text-[80px] leading-tight text-motif-cream mb-2 sm:mb-3 md:mb-4"
          style={{ color: 'var(--color-motif-cream)' }}
        >
          Gift Guide
        </h2>
        
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-motif-cream/90 font-light max-w-2xl mx-auto leading-relaxed px-2">
        Your presence at Niahna Celestine’s christening is already a wonderful blessing to our family. Should you wish to further bless our precious daughter, a monetary gift would be truly appreciated and will be carefully saved for her future. Thank you for your love, kindness, and generous hearts as you celebrate this special day with us.

        </p>
        
        <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4">
          <div className="w-1.5 h-1.5 bg-motif-cream/80 rounded-full" />
          <div className="w-1.5 h-1.5 bg-motif-cream/60 rounded-full" />
          <div className="w-1.5 h-1.5 bg-motif-cream/80 rounded-full" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
  {/* GCASH QR toggle */}
  <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-6 sm:mb-8">
        <h3 className="lighten-regular text-[24px] sm:text-[30px] md:text-[35px] lg:text-[40px] xl:text-[45px] leading-tight text-motif-cream text-center mb-4 sm:mb-6"
        style={{ color: 'var(--color-motif-cream)' }}
        >
          {activeItem?.label}
        </h3>
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {/* Toggle buttons */}
          <div className="inline-flex rounded-lg border border-motif-cream/40 bg-motif-cream/5 p-1">
            {GCASH_QR.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveQr(item.id)}
                className={`px-4 sm:px-6 py-2 rounded-md text-sm font-medium transition-all ${
                  activeQr === item.id
                    ? "bg-motif-cream/20 text-motif-cream"
                    : "text-motif-cream/80 hover:text-motif-cream hover:bg-motif-cream/10"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          {/* Active QR image */}
          <div className="flex flex-col items-center">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60 md:w-72 md:h-72 rounded-xl overflow-hidden bg-white shadow-lg">
            <CloudinaryImage
              src={activeItem.src}
              alt={`QR code - ${activeItem.label}`}
              fill
              className="object-contain p-2"
              sizes="(max-width: 640px) 208px, (max-width: 768px) 240px, 288px"
            />
          </div>
            <div className="mt-3 sm:mt-4 w-full max-w-md text-center">
              <p className="text-[11px] sm:text-xs tracking-[0.18em] uppercase text-motif-cream/70">
                Account Number
              </p>
              <p className={`${cinzel.className} mt-1 text-sm sm:text-base text-motif-cream drop-shadow-sm`}>
                {activeItem.accountNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <p className="text-xs sm:text-sm text-motif-cream/90 italic">
            Thank you from the bottom of our hearts.
          </p>
        </div>
        <p className="text-xs sm:text-sm text-motif-cream/90 italic text-center">
            With love,
            <br />
            Niahna Celestine
          </p>
        </div>
      </div>
    </Section>
  );
}
