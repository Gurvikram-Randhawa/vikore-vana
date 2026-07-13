"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface CarouselItem {
  id: number;
  src: string;
  title: string;
  category: string;
}

const ITEMS: CarouselItem[] = [
  {
    id: 1,
    src: "/uploads/main-section-images/23eg.jpg",
    title: "Timeless Sanctuary",
    category: "Living Room",
  },
  {
    id: 2,
    src: "/uploads/main-section-images/3f.jpg",
    title: "Modern Sunroom",
    category: "Lounge Area",
  },
  {
    id: 3,
    src: "/uploads/main-section-images/3r3t.jpg",
    title: "Minimal Living",
    category: "Accent Corner",
  },
  {
    id: 4,
    src: "/uploads/main-section-images/45.jpg",
    title: "Boho Retreat",
    category: "Cozy Bedroom",
  },
  {
    id: 5,
    src: "/uploads/main-section-images/77g.jpg",
    title: "Refined Spaces",
    category: "Dressing Corner",
  },
  {
    id: 6,
    src: "/uploads/main-section-images/A compact living room with a big floor-to-ceiling window, sunlight flooding the room, soft sofa and small wooden coffee table.jpg",
    title: "Sunlit Compact Lounge",
    category: "Living Room",
  },
  {
    id: 7,
    src: "/uploads/main-section-images/A cozy modern living room with a sunken conversation pit built below the wooden floor level, two steps leading down into built-in seating with soft linen cushions, a low round wooden table with books and candles, warm sunlight from large windows cast.jpg",
    title: "Sunken Conversation Pit",
    category: "Modern Den",
  },
  {
    id: 8,
    src: "/uploads/main-section-images/A small aesthetic bathroom with neutral tones, wooden accents, round mirror, soft warm lighting, minimalist decor, plants on shelf, modern Scandinavian interior design, realistic photo, high detail, vertical Pinterest format.jpg",
    title: "Scandinavian Bath",
    category: "Bathroom",
  },
  {
    id: 9,
    src: "/uploads/main-section-images/A small apartment living room filled with indoor plants, hanging plants near the window, a small beige sofa with textured pillows, wooden coffee table with a mug and magazine, sunlight streaming through large windows creating leaf shadows on the wall.jpg",
    title: "Botanical Apartment",
    category: "Urban Living",
  },
  {
    id: 10,
    src: "/uploads/main-section-images/A small cozy living room featuring a sunken conversation pit seating area in the center of the room, surrounded by soft built-in cushions and warm textured fabrics in earthy tones like beige, rust, and soft brown. A low wooden coffee table sits in th.jpg",
    title: "Earthy Sunken Pit",
    category: "Cozy Living",
  },
  {
    id: 11,
    src: "/uploads/main-section-images/A small spa-style bathroom with a skylight above the shower allowing soft natural sunlight to illuminate the room._Stone tiles, wooden vanity, and a round mirror above the sink. A towel slightly hanging off the rack and a toothbrush cup on the counte.jpg",
    title: "Spa Skylight Bathroom",
    category: "Bathroom",
  },
  {
    id: 12,
    src: "/uploads/main-section-images/AZ1NvbfNarOegd3vmYV0Nw-AZ1NvbfNWrTEO13qpQgM-w.jpg",
    title: "Luxury Lounge",
    category: "Salon Room",
  },
  {
    id: 13,
    src: "/uploads/main-section-images/___ Prompt — Modern Gen Z Boys Room Wallpaper (Forest Theme, Photorealistic)____Modern Gen Z boys bedroom with __forest-themed wallpaper__, stylish contemporary design featuring subtle pine trees, layered forest silhouettes, and organic nature-inspi.jpg",
    title: "Forest Theme Bedroom",
    category: "Boys Bedroom",
  },
  {
    id: 14,
    src: "/uploads/main-section-images/bathroom-after.jpg",
    title: "Polished Bath Renovation",
    category: "Bathroom Edit",
  },
];

export function AestheticCarousel() {
  const [activeIndex, setActiveIndex] = useState(12);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  const numItems = ITEMS.length;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 640);
      setIsTablet(width >= 640 && width < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + numItems) % numItems);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % numItems);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStart(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStart === null) return;
    const currentX = e.clientX;
    const diff = currentX - dragStart;
    setDragOffset(diff);
  };

  const handlePointerUp = () => {
    if (dragStart === null) return;
    const threshold = 50; 
    if (dragOffset > threshold) {
      handlePrev();
    } else if (dragOffset < -threshold) {
      handleNext();
    }
    setDragStart(null);
    setDragOffset(0);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center select-none relative pt-0 pb-0 overflow-visible">
      
      <div 
        className="relative w-full h-[220px] sm:h-[260px] md:h-[340px] lg:h-[480px] flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {ITEMS.map((item, index) => {
          let diff = index - activeIndex;
          if (diff < -numItems / 2) diff += numItems;
          if (diff > numItems / 2) diff -= numItems;

          const isActive = diff === 0;
          const isNext = diff === 1;
          const isNextNext = diff === 2;
          const isPrev = diff === -1;
          const isPrevPrev = diff === -2;
          const isVisible = isActive || isNext || isNextNext || isPrev || isPrevPrev;

          if (!isVisible) return null;

          // Define position animation variables based on active/inactive states
          let animX: string | number = 0;
          let animY: string | number = 0;
          let animRotate = 0;
          let animScale = 1;
          let animZIndex = 0;
          let animOpacity = 0;

          if (isActive) {
            animX = 0;
            animY = 0;
            animRotate = 0;
            animScale = 1.05;
            animZIndex = 40;
            animOpacity = 1;
          } else if (isNext) {
            animX = isMobile ? "46%" : isTablet ? "48%" : "54%";
            animY = isMobile ? "2%" : isTablet ? "4%" : "10%";
            animRotate = isMobile ? -10 : isTablet ? -12 : -15;
            animScale = 0.85;
            animZIndex = 30;
            animOpacity = 0.7;
          } else if (isNextNext) {
            animX = isMobile ? "86%" : isTablet ? "90%" : "102%";
            animY = isMobile ? "4%" : isTablet ? "8%" : "22%";
            animRotate = isMobile ? -20 : isTablet ? -22 : -30;
            animScale = 0.7;
            animZIndex = 20;
            animOpacity = 0.3;
          } else if (isPrev) {
            animX = isMobile ? "-46%" : isTablet ? "-48%" : "-54%";
            animY = isMobile ? "2%" : isTablet ? "4%" : "10%";
            animRotate = isMobile ? 10 : isTablet ? 12 : 15;
            animScale = 0.85;
            animZIndex = 30;
            animOpacity = 0.7;
          } else if (isPrevPrev) {
            animX = isMobile ? "-86%" : isTablet ? "-90%" : "-102%";
            animY = isMobile ? "4%" : isTablet ? "8%" : "22%";
            animRotate = isMobile ? 20 : isTablet ? 22 : 30;
            animScale = 0.7;
            animZIndex = 20;
            animOpacity = 0.3;
          }

          return (
            <motion.div
              key={item.id}
              onClick={() => {
                if (isNext || isNextNext) handleNext();
                if (isPrev || isPrevPrev) handlePrev();
              }}
              className={`absolute rounded-[2.5rem] bg-white dark:bg-[#1a1715] overflow-hidden shadow-2xl aspect-square ${
                isMobile ? "w-[210px] h-[210px]" : isTablet ? "w-[250px] h-[250px]" : "w-[400px] h-[400px]"
              }`}
              style={{
                cursor: isActive ? "grab" : "pointer",
                zIndex: animZIndex,
              }}
              animate={{
                x: animX,
                y: animY,
                rotate: animRotate,
                scale: animScale,
                opacity: animOpacity,
              }}
              transition={{
                type: "tween",
                ease: [0.25, 1, 0.35, 1], // Custom slow-takeoff, buttery-smooth deceleration ease
                duration: 0.8, // Slightly longer duration to maximize slide elegance
              }}
            >
              {/* Full Image Background with parallax scale transition */}
              <div className="relative w-full h-full bg-linen dark:bg-[#25211e] overflow-hidden">
                <motion.div
                  className="relative w-full h-full"
                  animate={{
                    scale: isActive ? 1 : 1.12, // Subtly zooms out active card / zooms in background cards
                  }}
                  transition={{
                    type: "tween",
                    ease: [0.25, 1, 0.35, 1],
                    duration: 0.8,
                  }}
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 210px, (max-width: 1024px) 250px, 400px"
                    priority={isActive}
                    className="object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mt-12 md:mt-10 lg:mt-12 relative z-30">
        {/* Previous Arrow */}
        <button
          onClick={handlePrev}
          className="group flex items-center justify-center w-9 h-9 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.12)] md:hover:bg-white/80 active:bg-white/80 dark:md:hover:bg-white/10 dark:active:bg-white/10 md:hover:border-[#b89569]/40 active:border-[#b89569]/40 md:hover:shadow-[0_12px_32px_rgba(184,149,105,0.25)] active:shadow-[0_12px_32px_rgba(184,149,105,0.25)] text-ink/70 dark:text-white/70 md:hover:text-[#b89569] active:text-[#b89569] transition-all duration-300 ease-out md:hover:scale-105 active:scale-95 shrink-0"
          aria-label="Previous image"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 md:group-hover:-translate-x-0.5 group-active:-translate-x-1" strokeWidth={1.5} />
        </button>

        {/* Caption Text (Shows Active Title) */}
        <div className="text-center min-w-[130px] max-w-[180px]">
          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[2px] text-[#b89569] dark:text-[#cba677] block truncate">
            {ITEMS[activeIndex].category}
          </span>
          <h3 className="text-xs sm:text-sm font-serif font-semibold text-ink dark:text-linen mt-0.5 truncate">
            {ITEMS[activeIndex].title}
          </h3>
        </div>

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          className="group flex items-center justify-center w-9 h-9 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/40 dark:border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.12)] md:hover:bg-white/80 active:bg-white/80 dark:md:hover:bg-white/10 dark:active:bg-white/10 md:hover:border-[#b89569]/40 active:border-[#b89569]/40 md:hover:shadow-[0_12px_32px_rgba(184,149,105,0.25)] active:shadow-[0_12px_32px_rgba(184,149,105,0.25)] text-ink/70 dark:text-white/70 md:hover:text-[#b89569] active:text-[#b89569] transition-all duration-300 ease-out md:hover:scale-105 active:scale-95 shrink-0"
          aria-label="Next image"
        >
          <ArrowRight className="w-4 h-4 transition-transform duration-300 md:group-hover:translate-x-0.5 group-active:translate-x-1" strokeWidth={1.5} />
        </button>
      </div>

    </div>
  );
}
