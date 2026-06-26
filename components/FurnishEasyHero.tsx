import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export function FurnishEasyHero() {
  return (
    <section className="overflow-hidden pt-8 pb-8 md:pt-10 md:pb-12">
      <div className="container-premium max-w-[1400px]">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 xl:gap-24 items-center">

          {/* ── Left / Top on mobile ─────────────────────────────── */}
          <div className="order-1 flex flex-col items-center text-center hero-stagger">

            {/* Brand label — small calligraphy, centered on mobile, left on desktop */}
            <div className="mb-5 flex items-center justify-center gap-4">
              <div className="h-px flex-1 max-w-[64px] bg-gradient-to-r from-transparent to-[#b89569]/40 dark:to-[#cba677]/30" />
              <span
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
                it's a feeling you create.
              </span>
            </h1>

            {/* Subtext */}
            <p 
              className="mt-[32px] md:mt-[38px] mb-[16px] lg:mb-[32px] text-[9px] sm:text-[14px] lg:text-[16px] font-bold text-[#9c8b7a] tracking-[1.5px] uppercase text-center mx-auto px-[28px] lg:px-0 dark:text-bone/80"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              Curated pieces to help you build it.
            </p>

            {/* Lifestyle image — mobile only, sits between headline and CTAs */}
            <div className="mt-3 overflow-hidden rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.28)] lg:hidden">
              <Image
                src="/new-hero.png"
                alt="Warm minimal living space"
                width={900}
                height={560}
                className="w-full object-cover"
                priority
              />
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

          {/* ── Right — desktop image only ───────────────────────── */}
          <div className="order-2 hidden lg:block relative hero-image-reveal">

            {/* Soft glow behind image */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-[#b89569]/10 to-transparent dark:from-[#cba677]/8 blur-2xl pointer-events-none" />

            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-[0_24px_60px_rgba(0,0,0,0.10)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)] border border-white/40 dark:border-white/8 group">
              <Image
                src="/new-hero.png"
                alt="Warm minimal living space"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 0vw"
                className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
              />
              {/* Subtle vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
