import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Leaf, Package, Lightbulb, Play } from "lucide-react";

export function FurnishEasyHero() {
  return (
    <section className="bg-[#fffaf4] dark:bg-[#181614] overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24">
      <div className="container-premium max-w-[1400px]">
        
        {/* Main Grid Layout */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="order-2 lg:order-1 flex flex-col items-start hero-stagger">
            
            {/* Top Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink dark:border-white/10 dark:bg-white/5 dark:text-bone backdrop-blur-sm shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#b89569] animate-pulse"></span>
              Spring 2026 Edit — Now Live
            </div>
            
            {/* Headline */}
            <h1 className="max-w-xl font-serif text-[2.5rem] leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[4.5rem] dark:text-linen">
              Your Home,<br />
              <span className="italic text-[#b89569] dark:text-[#cba677]">Your Story,</span><br />
              Our Craft.
            </h1>
            
            {/* Subtext */}
            <p className="mt-6 max-w-lg text-base leading-relaxed text-smoke sm:text-lg dark:text-bone/80">
              Premium home decor designed for modern living. Curated with care, delivered with ease — right to your door.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/products" className="group flex h-14 items-center justify-center gap-2 rounded-full bg-ink px-8 text-sm font-medium text-white transition-all hover:bg-ink/90 hover:shadow-lg dark:bg-white dark:text-ink dark:hover:bg-white/90">
                Explore Collection
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/categories" className="flex h-14 items-center justify-center gap-2 rounded-full border border-black/10 px-8 text-sm font-medium text-ink transition-all hover:bg-black/5 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                View Room Edits
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="mt-14 flex items-center gap-8 border-t border-black/5 pt-8 dark:border-white/10 w-full sm:w-auto">
              <div>
                <div className="font-serif text-2xl font-semibold text-ink dark:text-white">10K+</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-smoke dark:text-bone/60">Happy Homes</div>
              </div>
              <div className="h-10 w-px bg-black/10 dark:bg-white/10"></div>
              <div>
                <div className="flex items-center gap-1 font-serif text-2xl font-semibold text-ink dark:text-white">
                  4.9 <Star size={16} className="fill-[#b89569] text-[#b89569]" />
                </div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-smoke dark:text-bone/60">Avg Rating</div>
              </div>
            </div>
          </div>

          {/* Center Column: Image Showcase */}
          <div className="order-1 lg:order-2 relative w-full max-w-[600px] mx-auto lg:mx-0 hero-image-reveal">
            
            {/* Decorative element behind image */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-bone/50 to-transparent dark:from-white/5 z-0 blur-xl"></div>
            
            <div className="relative z-10 aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] group border border-white/40 dark:border-white/10">
              <Image 
                src="/hero.jpg" 
                alt="Premium living room setup" 
                fill 
                priority 
                sizes="(min-width: 1024px) 40vw, 90vw" 
                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
              />


              {/* Floating Tooltip 2: Rating Badge */}
              <div className="absolute right-6 top-6 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 shadow-lg backdrop-blur-md dark:bg-[#201d1a]/95">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-[#b89569] text-[#b89569]" />
                  ))}
                </div>
                <span className="text-xs font-bold text-ink dark:text-white">4.9</span>
                <span className="text-xs font-medium text-smoke dark:text-bone/60">(2.4k+)</span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}
