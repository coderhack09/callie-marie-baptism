import React from 'react';
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
          <source src="/background_music/background.mp4" type="video/mp4" />
        </video>

        {/* Overlay - linear gradient only, keep video visible */}
        <div 
          className="absolute inset-0" 
          style={{
            background: "linear-gradient(145deg, color-mix(in srgb, var(--color-motif-cream) 70%, transparent) 0%, color-mix(in srgb, var(--color-motif-soft) 62%, transparent) 52%, color-mix(in srgb, var(--color-motif-medium) 52%, transparent) 100%)",
            opacity: 0.48
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 w-full max-w-md mx-auto min-h-screen">
        {/* Monogram */}
        <FadeIn show={visible} delay={300} className="mb-12 sm:mb-16">
          <div 
            className="amsterdam-one text-center"
            style={{
              lineHeight: '1.1',
              color: 'var(--color-motif-deep)',
              textShadow: '0 2px 6px color-mix(in srgb, var(--color-motif-medium) 35%, transparent)',
            }}
          >
            <div
              style={{
                fontSize: 'clamp(2.6rem, 11.8vw, 4.8rem)',
                fontWeight: 400,
                transform: 'translateX(-0.32rem)',
              }}
            >
              Niahna
            </div>
            <div
              style={{
                fontSize: 'clamp(2.2rem, 9.7vw, 3.9rem)',
                fontWeight: 400,
                marginTop: 'clamp(0.55rem, 2.3vw, 1rem)',
                transform: 'translateX(0.34rem)',
              }}
            >
              Celestine
            </div>
          </div>
        </FadeIn>

        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <FadeIn show={visible} delay={600}>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-wider"
              style={{
                fontFamily: '"Cinzel", serif',
                fontWeight: 700,
                color: 'var(--color-motif-deep)',
                textShadow: '0 2px 6px color-mix(in srgb, var(--color-motif-medium) 35%, transparent)',
              }}
            >
              You're Invited
            </h1>
          </FadeIn>

          <FadeIn show={visible} delay={900}>
            <button 
              onClick={() => {
                onOpen();
              }}
              className="group relative px-10 py-4 bg-transparent border-2 font-serif text-sm tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 rounded-sm overflow-hidden"
              style={{
                borderColor: 'var(--color-motif-accent)',
                color: 'var(--color-motif-deep)',
                boxShadow: '0 10px 28px color-mix(in srgb, var(--color-motif-medium) 26%, transparent)',
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