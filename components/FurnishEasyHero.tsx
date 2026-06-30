"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star, Sparkles, Loader2 } from "lucide-react";
import { IsometricRoom3D } from "@/components/IsometricRoom3D";

export function FurnishEasyHero() {
  const [showMagic, setShowMagic] = useState(false);
  const [isMounting, setIsMounting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showMagic) {
      // Defer the heavy WebGL mounting by 50ms to allow the browser to paint the loading UI first!
      const timer = setTimeout(() => setIsMounting(true), 150);
      return () => clearTimeout(timer);
    } else {
      setIsMounting(false);
    }
  }, [showMagic]);

  useEffect(() => {
    if (!showMagic) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          setShowMagic(false);
        }
      },
      { threshold: 0 } // Unmount as soon as it leaves the viewport
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [showMagic]);

  return (
    <section className="overflow-hidden pt-5 md:pt-6 pb-8 md:pb-12" ref={containerRef}>
      <div className="container-premium max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">

          {/* ── Left / Top on mobile ─────────────────────────────── */}
          <div className="order-1 flex flex-col items-center text-center hero-stagger">

            {/* Brand label — height centered between top and headline, shifted slightly up */}
            <div
              className="-mt-2 mb-12 md:-mt-4 md:mb-20 flex items-center justify-center gap-4 w-full"
              style={{ animation: "heroTextReveal 0.6s ease 2.2s both" }}
            >
              <div className="h-px flex-1 max-w-[64px] bg-gradient-to-r from-transparent to-[#b89569]/40 dark:to-[#cba677]/30" />
              <span
                id="hero-vikore-vana"
                className="text-[2.2rem] md:text-[3rem] leading-none text-[#b89569] dark:text-[#cba677] pb-1.5"
                style={{ fontFamily: "var(--font-calligraphy), cursive" }}
              >
                Vikore Vana
              </span>
              <div className="h-px flex-1 max-w-[64px] bg-gradient-to-l from-transparent to-[#b89569]/40 dark:to-[#cba677]/30" />
            </div>

            {/* Headline — first big element on mobile */}
            <h1 className="flex flex-col items-center justify-center text-center mx-auto w-full">
              <span 
                className="text-[10.5vw] sm:text-[40px] md:text-[54px] lg:text-[68px] font-semibold text-[#1a1a1a] dark:text-linen leading-tight tracking-tight whitespace-nowrap"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Home is not a place
              </span>
              <span 
                className="text-[9.5vw] sm:text-[48px] md:text-[64px] lg:text-[84px] text-[#b89569] dark:text-[#cba677] leading-[0.8] mt-2 lg:mt-4 whitespace-nowrap"
                style={{ fontFamily: "var(--font-calligraphy)" }}
              >
                it&apos;s a feeling you create.
              </span>
            </h1>

            {/* Subtext */}
            <p 
              className="mt-[32px] md:mt-[38px] mb-[16px] lg:mb-[32px] text-[9px] sm:text-[14px] lg:text-[16px] font-bold text-[#9c8b7a] tracking-[1.5px] uppercase text-center mx-auto px-[28px] lg:px-0 dark:text-bone/80"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              Curated pieces to help you build it.
            </p>

            {/* 3D Room — mobile only, sits between headline and CTAs */}
            <div className="mt-3 lg:hidden w-full flex justify-center overflow-visible">
              <div className="w-[100vw] aspect-square relative -mx-4 flex items-center justify-center">
                {!showMagic ? (
                  <button 
                    onClick={() => setShowMagic(true)}
                    className="group relative flex flex-col items-center justify-center gap-3 w-[85%] h-[85%] rounded-[2.5rem] border border-[#b89569]/30 bg-gradient-to-br from-[#fdf6f0] to-[#f5ebd9] dark:from-[#25211e] dark:to-[#1a1715] shadow-[0_8px_32px_rgba(184,149,105,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500 active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-[#b89569]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 rounded-full bg-[#b89569] flex items-center justify-center text-white shadow-[0_4px_16px_rgba(184,149,105,0.4)] group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <span className="font-serif text-2xl text-ink dark:text-linen font-medium tracking-wide mt-2">
                      See the Magic
                    </span>
                    <span className="text-[10px] uppercase tracking-[2.5px] font-bold text-[#b89569] dark:text-[#cba677]">
                      Interactive 3D Room
                    </span>
                  </button>
                ) : !isMounting ? (
                  <div className="flex flex-col items-center justify-center gap-4 w-[85%] h-[85%] rounded-[2.5rem] bg-gradient-to-br from-[#fdf6f0] to-[#f5ebd9] dark:from-[#25211e] dark:to-[#1a1715] animate-pulse">
                    <Loader2 className="w-10 h-10 animate-spin text-[#b89569]" />
                    <span className="font-serif text-lg text-ink/70 dark:text-linen/70 font-medium">
                      Crafting your room...
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full animate-in fade-in zoom-in-95 duration-1000 ease-out fill-mode-both relative">
                    <IsometricRoom3D />
                    <span className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-[#b89569] dark:text-[#cba677] uppercase tracking-widest font-bold animate-pulse pointer-events-none">
                      Drag to interact with room
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA buttons — always side by side */}
            <div className="mt-7 flex items-center justify-center gap-3">
              <Link
                href="/products"
                className="group flex h-12 flex-1 sm:flex-none items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white transition-all hover:bg-ink/90 hover:shadow-lg dark:bg-white dark:text-ink dark:hover:bg-white/90"
              >
                Explore Collection
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/categories"
                className="flex h-12 flex-1 sm:flex-none items-center justify-center gap-2 rounded-full border border-black/10 px-6 text-sm font-medium text-ink transition-all hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                View Room Edits
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 flex items-center justify-center gap-8 border-t border-black/5 pt-8 dark:border-white/10">
              <div>
                <div className="font-serif text-2xl font-semibold text-ink dark:text-white">1K+</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-smoke dark:text-bone/60">Happy Homes</div>
              </div>
              <div className="h-10 w-px bg-black/10 dark:bg-white/10" />
              <div>
                <div className="flex items-center gap-1 font-serif text-2xl font-semibold text-ink dark:text-white">
                  4.9 <Star size={16} className="fill-[#b89569] text-[#b89569]" />
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-smoke dark:text-bone/60">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* ── Right — 3D Room (desktop only) ─────────────────── */}
          <div className="order-2 hidden lg:block relative hero-image-reveal w-[115%] -ml-[15%]">
            <div className="relative aspect-[5/4] w-full">
              <IsometricRoom3D />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
