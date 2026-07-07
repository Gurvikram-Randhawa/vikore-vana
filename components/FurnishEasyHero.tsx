"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AestheticCarousel } from "@/components/AestheticCarousel";

export function FurnishEasyHero() {
  return (
    <section className="overflow-hidden pt-5 md:pt-6 pb-8 md:pb-12">
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

            {/* Carousel — mobile only, sits between headline and CTAs */}
            <div className="mt-2 sm:mt-3 lg:hidden w-full flex justify-center overflow-visible">
              <div className="w-[100vw] h-auto min-h-[280px] sm:min-h-[330px] relative -mx-4 flex items-center justify-center overflow-visible">
                <AestheticCarousel />
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
            <div className="mt-10 flex items-start justify-center gap-4 sm:gap-6 md:gap-8 border-t border-black/5 pt-8 dark:border-white/10 text-center">
              <div>
                <div className="font-serif text-xl sm:text-2xl font-semibold text-ink dark:text-white">2M+</div>
                <div className="mt-1 text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-smoke dark:text-bone/60 max-w-[80px] sm:max-w-[100px] mx-auto leading-relaxed">Inspired Monthly</div>
              </div>
              <div className="h-12 w-px bg-black/10 dark:bg-white/10 shrink-0" />
              <div>
                <div className="font-serif text-xl sm:text-2xl font-semibold text-ink dark:text-white">20K+</div>
                <div className="mt-1 text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-smoke dark:text-bone/60 max-w-[80px] sm:max-w-[100px] mx-auto leading-relaxed">Saves and Counting</div>
              </div>
              <div className="h-12 w-px bg-black/10 dark:bg-white/10 shrink-0" />
              <div>
                <div className="font-serif text-xl sm:text-2xl font-semibold text-ink dark:text-white">106K</div>
                <div className="mt-1 text-[9px] sm:text-xs font-semibold uppercase tracking-wider text-smoke dark:text-bone/60 max-w-[80px] sm:max-w-[100px] mx-auto leading-relaxed">Engaged Community</div>
              </div>
            </div>
          </div>

          {/* ── Right — Carousel (desktop only) ─────────────────── */}
          <div className="order-2 hidden lg:flex relative hero-image-reveal w-full justify-center items-center px-8 xl:px-12 overflow-visible">
            {/* Theme-responsive ambient glow behind the carousel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square rounded-full bg-[#b89569]/50 dark:bg-[#cba677]/40 blur-[100px] xl:blur-[140px] pointer-events-none" />
            
            <div className="relative w-full max-w-[700px] z-10 flex items-center justify-center overflow-visible">
              <AestheticCarousel />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
