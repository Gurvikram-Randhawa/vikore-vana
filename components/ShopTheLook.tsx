"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

import { Look, Hotspot } from "@/lib/content";
import { ProductCard } from "@/components/ProductCard";

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
          <div className="relative w-full max-w-6xl mx-auto aspect-[4/5] md:aspect-[16/9] lg:aspect-[21/9] rounded-2xl md:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] group border border-[#b89569]/10 z-10 hover:z-50">
            
            {/* Image Wrapper to contain image scale without clipping tooltips */}
            <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
              {/* Main Background Image */}
              <Image 
                src={look.image}
                alt={look.title || "Beautifully styled room"}
                fill
                className="object-cover transition-transform duration-[15000ms] ease-out group-hover:scale-105"
              />
              
              {/* Dark overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/30 transition-opacity duration-700 group-hover:opacity-70" />
            </div>

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

                {/* The Tooltip (Glassmorphism + Product Card) */}
                <div
                  className={`
                    absolute left-1/2 -translate-x-1/2 w-56 md:w-64
                    transition-all duration-500 ease-out z-30
                    ${spot.y > 60 ? 'bottom-full mb-4' : 'top-full mt-4'}
                    ${activeSpot === spot.id 
                      ? 'opacity-100 scale-100 pointer-events-auto' 
                      : `opacity-0 scale-95 pointer-events-none ${spot.y > 60 ? 'translate-y-4' : '-translate-y-4'}`}
                  `}
                >
                  <ProductCard product={{
                    slug: spot.slug || '',
                    name: spot.productName,
                    description: '',
                    image: spot.image,
                    category: spot.category,
                    affiliate: spot.affiliate,
                    date: '',
                    body: ''
                  }} />
                </div>
              </div>
            ))}
            
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
