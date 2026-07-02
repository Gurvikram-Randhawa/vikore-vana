"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

import { Look, Hotspot } from "@/lib/content";

export function ShopTheLook({ look }: { look: Look }) {
  const [activeSpot, setActiveSpot] = useState<string | null>(null);

  if (!look) return null;

  return (
    <section className="py-20 md:py-32 overflow-hidden bg-[#fffaf4] dark:bg-[#181614] relative">
      
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#b89569]/5 dark:from-[#cba677]/5 to-transparent pointer-events-none" />

      <div className="container-premium relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <ScrollReveal>
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#b89569]/50 dark:to-[#cba677]/50" />
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[#b89569] dark:text-[#cba677]">
                Curated Spaces
              </p>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#b89569]/50 dark:to-[#cba677]/50" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink dark:text-linen leading-[1.1]">
              Shop the <span className="italic text-[#b89569] dark:text-[#cba677]">Look</span>
            </h2>
            <p className="mt-4 md:mt-6 text-sm md:text-base text-smoke dark:text-bone/80 max-w-xl mx-auto">
              Hover over the highlighted pieces to discover the curated elements that bring this sanctuary to life.
            </p>
          </ScrollReveal>
        </div>

        {/* Interactive Image Container */}
        <ScrollReveal delay={0.2}>
          <div className="relative w-full max-w-6xl mx-auto aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] group border border-[#b89569]/10">
            
            {/* Main Background Image */}
            <Image 
              src={look.image}
              alt={look.title || "Beautifully styled room"}
              fill
              className="object-cover transition-transform duration-[15000ms] ease-out group-hover:scale-105"
            />
            
            {/* Dark overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/30 transition-opacity duration-700 group-hover:opacity-70" />

            {/* Hotspots */}
            {look.hotspots.map((spot) => (
              <div 
                key={spot.id}
                className="absolute z-20 group/spot"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                onMouseEnter={() => setActiveSpot(spot.id)}
                onMouseLeave={() => setActiveSpot(null)}
              >
                {/* The Pin */}
                <div className="relative -ml-4 -mt-4 w-8 h-8 flex items-center justify-center cursor-pointer">
                  {/* Pulsing ring */}
                  <div className="absolute inset-0 rounded-full bg-white/60 dark:bg-white/30 animate-ping opacity-75 duration-[2000ms]" />
                  {/* Solid center */}
                  <div className="relative w-6 h-6 rounded-full bg-white/95 backdrop-blur-sm dark:bg-[#1a1a1a]/90 flex items-center justify-center shadow-lg border border-black/5 dark:border-white/10 transition-all duration-300 group-hover/spot:scale-110">
                    <Plus className="w-4 h-4 text-ink dark:text-white transition-transform duration-500 group-hover/spot:rotate-90 group-hover/spot:text-[#b89569]" />
                  </div>
                </div>

                {/* The Tooltip (Glassmorphism) */}
                <Link
                  href={spot.affiliate ? spot.affiliate : `/${spot.slug || ''}`}
                  target={spot.affiliate ? "_blank" : "_self"}
                  rel={spot.affiliate ? "noopener noreferrer" : ""}
                  className={`
                    absolute top-full left-1/2 -translate-x-1/2 mt-4 w-48 md:w-56 p-3 
                    bg-white/85 dark:bg-[#141210]/85 backdrop-blur-xl 
                    border border-white/40 dark:border-white/5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] 
                    transition-all duration-500 ease-out
                    hover:border-[#b89569]/30 dark:hover:border-[#cba677]/30 hover:-translate-y-1 hover:scale-[1.02]
                    ${activeSpot === spot.id 
                      ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' 
                      : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
                  `}
                >
                  <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                    <Image src={spot.image} alt={spot.productName} fill className="object-cover transition-transform duration-700 hover:scale-110" />
                  </div>
                  <div className="text-center pb-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b89569] dark:text-[#cba677] mb-1.5">
                      {spot.category}
                    </p>
                    <h4 className="font-serif text-sm md:text-base text-ink dark:text-linen leading-tight mb-2">
                      {spot.productName}
                    </h4>
                    <p className="text-sm font-medium text-smoke dark:text-bone/80">
                      {spot.price}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
            
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
