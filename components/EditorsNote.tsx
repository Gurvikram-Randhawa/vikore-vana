"use client";

import { ScrollReveal } from "@/components/ScrollReveal";

export function EditorsNote() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">


      {/* Top & bottom fine gold hairlines */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#b8935a]/25 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#b8935a]/25 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <ScrollReveal distance={30} duration={1200}>
          <div className="relative rounded-3xl p-8 sm:p-12 md:px-20 md:py-10 text-center bg-white/60 dark:bg-[#1e1a17]/70 backdrop-blur-xl border border-[#b8935a]/20 dark:border-white/8 shadow-[0_16px_48px_rgba(184,147,90,0.12),0_4px_16px_rgba(184,147,90,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">


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

          {/* The letter — Small Luxury Styling */}
          <div className="max-w-3xl mx-auto px-4 sm:px-8 relative">
            <blockquote
              className="font-cormorant italic text-smoke/80 dark:text-bone/70 text-base sm:text-lg md:text-xl leading-[1.8] text-center font-light tracking-[0.03em]"
            >
              &ldquo;Vikore Vana exists for spaces that whisper, not scream. We curate pieces that endure, not trends—because true luxury is restraint, intention, and empty space.&rdquo;
            </blockquote>
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
