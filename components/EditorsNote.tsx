"use client";

import { ScrollReveal } from "@/components/ScrollReveal";

export function EditorsNote() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">


      {/* Top & bottom fine gold hairlines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#b8935a]/25 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#b8935a]/25 to-transparent" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollReveal distance={30} duration={1200}>
          <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 text-center bg-white/60 dark:bg-[#1e1a17]/70 backdrop-blur-xl border border-[#b8935a]/20 dark:border-white/8 shadow-[0_16px_48px_rgba(184,147,90,0.12),0_4px_16px_rgba(184,147,90,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
            {/* Corner ornament */}
            <div className="absolute top-5 right-5 w-16 h-16 opacity-[0.04] dark:opacity-[0.06] pointer-events-none">
              <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="31" stroke="#b8935a" strokeWidth="1" />
                <circle cx="32" cy="32" r="20" stroke="#b8935a" strokeWidth="1" />
                <line x1="32" y1="1" x2="32" y2="63" stroke="#b8935a" strokeWidth="0.5" />
                <line x1="1" y1="32" x2="63" y2="32" stroke="#b8935a" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Ornamental top flourish */}
            <div className="flex items-center justify-center gap-4 mb-6 sm:mb-8">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#b8935a]/40" />
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 text-[#b8935a]/40 dark:text-[#cba677]/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M12 2L12 22M2 12L22 12M5.64 5.64L18.36 18.36M18.36 5.64L5.64 18.36" />
            </svg>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#b8935a]/40" />
          </div>

          {/* Section label */}
          <p className="text-[0.55rem] sm:text-[0.6rem] font-bold uppercase tracking-[0.4em] sm:tracking-[0.45em] text-[#b8935a] dark:text-[#cba677] mb-6 sm:mb-8">
            The Editor&apos;s Note
          </p>

          {/* The letter — Cormorant Garamond italic */}
          <blockquote
            className="font-[family-name:var(--font-cormorant)] italic text-ink/80 dark:text-linen/80 text-[1.15rem] sm:text-[1.35rem] md:text-[1.5rem] leading-[1.85] sm:leading-[1.9] font-light"
          >
            <span className="font-[family-name:var(--font-cormorant)] not-italic text-[2.5rem] sm:text-[3rem] leading-[0] text-[#b8935a]/60 dark:text-[#cba677]/50 align-middle mr-1">
              &ldquo;
            </span>
            Vikore Vana was born from a quiet frustration with spaces that scream instead of whisper. 
            Every piece is chosen because it endures, not because it trends. We refuse to feature fast furniture or anything 
            designed to fill a feed rather than a room. Quiet luxury is about restraint and the courage to leave empty space.
            <span className="font-[family-name:var(--font-cormorant)] not-italic text-[2.5rem] sm:text-[3rem] leading-[0] text-[#b8935a]/60 dark:text-[#cba677]/50 align-middle ml-0.5">
              &rdquo;
            </span>
          </blockquote>

          {/* Signature area */}
          <div className="mt-8 sm:mt-10 flex flex-col items-center">
            {/* Elegant thin rule */}
            <div className="w-10 h-px bg-[#b8935a]/30 dark:bg-[#cba677]/25 mb-5 sm:mb-6" />

            {/* Calligraphic signature */}
            <p
              className="font-[family-name:var(--font-calligraphy)] text-3xl sm:text-4xl text-cedar mb-2 select-none"
            >
              G Randhawa
            </p>

            {/* Title */}
            <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-[#9c8b7a] dark:text-bone/50">
              Founder &amp; Curator
            </p>
          </div>

          {/* Bottom ornamental flourish */}
          <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[#b8935a]/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#b8935a]/30 dark:bg-[#cba677]/25" />
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[#b8935a]/30" />
          </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
