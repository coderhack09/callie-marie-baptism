import React from 'react';
import Image from 'next/image';
import { FadeIn } from './FadeIn';

interface HeroProps {
  onOpen: () => void;
  visible: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onOpen, visible }) => {

  return (
    <div className={`fixed inset-0 z-30 flex items-center justify-center overflow-hidden transition-all duration-1000 ${visible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/desktop_background/copy_9EFACE50-A32C-4CBC-86C7-6749533E1305 (1).mov" type="video/mp4" />
        </video>

        {/* Dark base overlay for readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(10,6,4,0.48)' }}
        />
        {/* Warm gradient overlay */}
        <div 
          className="absolute inset-0" 
          style={{
            background: "linear-gradient(175deg, rgba(30,18,10,0.62) 0%, rgba(60,36,18,0.38) 45%, rgba(100,60,20,0.30) 100%)",
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full max-w-md mx-auto min-h-screen">

        {/* Monogram */}
        <FadeIn show={visible} delay={150} className="mb-3 sm:mb-4">
          <div
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.13) 0%, rgba(191,160,122,0.18) 50%, rgba(255,255,255,0.06) 100%)',
              borderRadius: '50%',
              padding: 'clamp(10px, 2.5vw, 16px)',
              boxShadow: '0 0 32px rgba(191,160,122,0.22), 0 0 0 1px rgba(255,255,255,0.10)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              src="/monogram/monogram.png"
              alt="Monogram"
              width={100}
              height={100}
              priority
              style={{
                width: 'clamp(52px, 13vw, 88px)',
                height: 'auto',
                filter: 'brightness(0) invert(1) drop-shadow(0 2px 12px rgba(0,0,0,0.30))',
                opacity: 1,
              }}
            />
          </div>
        </FadeIn>

        {/* Name block */}
        <FadeIn show={visible} delay={300} className="mb-4 sm:mb-6 flex flex-col items-center">

          {/* Top rule */}
          <div className="flex items-center gap-3 mb-4" style={{ width: 'clamp(180px, 58vw, 280px)' }}>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.5), transparent)' }} />
            <div className="w-[3px] h-[3px] rounded-full rotate-45" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.5), transparent)' }} />
          </div>

          {/* First name */}
          <div
            className="lora-regular"
            style={{
              fontSize: 'clamp(3.4rem, 15vw, 6rem)',
              color: '#ffffff',
              lineHeight: 1,
              letterSpacing: '0.06em',
              textShadow: '0 2px 4px rgba(0,0,0,0.55), 0 6px 28px rgba(0,0,0,0.40)',
            }}
          >
            Kaezar
          </div>

          {/* Thin spacer */}
          <div style={{ height: 'clamp(0.25rem, 1.2vw, 0.5rem)' }} />

          {/* Last name */}
          <div
            className="lora-regular"
            style={{
              fontSize: 'clamp(1.15rem, 5vw, 2rem)',
              color: 'rgba(255,255,255,0.95)',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              textShadow: '0 2px 6px rgba(0,0,0,0.55), 0 4px 18px rgba(0,0,0,0.35)',
              lineHeight: 1.3,
            }}
          >
            Isaiahnuel Galardo
          </div>

          {/* Bottom rule */}
          <div className="flex items-center gap-3 mt-4" style={{ width: 'clamp(180px, 58vw, 280px)' }}>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, rgba(255,255,255,0.5), transparent)' }} />
            <div className="w-[3px] h-[3px] rounded-full rotate-45" style={{ backgroundColor: 'rgba(255,255,255,0.6)' }} />
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.5), transparent)' }} />
          </div>

        </FadeIn>

        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <FadeIn show={visible} delay={500}>
            <h1
              className="tracking-widest uppercase"
              style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 600,
                fontSize: 'clamp(1.4rem, 6vw, 2.2rem)',
                color: '#ffffff',
                letterSpacing: '0.3em',
                textShadow: '0 2px 6px rgba(0,0,0,0.55), 0 4px 20px rgba(0,0,0,0.35)',
              }}
            >
              You&apos;re Invited
            </h1>
          </FadeIn>

          <FadeIn show={visible} delay={750}>
            <button 
              onClick={() => {
                onOpen();
              }}
              className="group relative px-10 py-4 bg-transparent border-2 font-serif text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 rounded-sm overflow-hidden"
              style={{
                borderColor: 'rgba(255,255,255,0.70)',
                color: '#ffffff',
                boxShadow: '0 10px 28px rgba(0,0,0,0.30)',
              }}
            >
              <span
                className="relative z-10 drop-shadow-md transition-colors duration-500 group-hover:text-[var(--color-motif-cream)]"
                style={{ fontFamily: '"Cinzel", serif', fontWeight: 500 }}
              >
                Open Invitation
              </span>
              {/* Button sheen effect */}
              <div
                className="absolute top-0 left-[-100%] w-full h-full skew-x-12 group-hover:animate-[shimmer_1s_infinite]"
                style={{ background: 'color-mix(in srgb, var(--color-motif-silver) 50%, transparent)' }}
              />
              <div
                className="absolute inset-0 -z-10 transition-all duration-500 group-hover:opacity-100 opacity-0"
                style={{ background: 'linear-gradient(135deg, var(--color-motif-accent) 0%, var(--color-motif-deep) 100%)' }}
              />
            </button>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};