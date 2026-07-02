"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const reviews = [
  {
    id: 1,
    rating: 5,
    text: "Vikore Vana transformed my living space. The curated decor pieces bring a sense of calm and elegance I didn't know was possible.",
    authorName: "Emma Wright",
    authorRole: "Homeowner, London",
    avatarColor: "bg-[#e8dccb] text-[#5c4a3d] dark:bg-[#3d3630] dark:text-[#d9c7b2]",
    avatarInitial: "E"
  },
  {
    id: 2,
    rating: 5,
    text: "Their lighting fixtures are simply breathtaking. Every piece feels intentional and beautifully crafted.",
    authorName: "David Kim",
    authorRole: "Verified Buyer, New York",
    avatarColor: "bg-[#d4e0d9] text-[#3d5246] dark:bg-[#2c3b33] dark:text-[#b4cdbd]",
    avatarInitial: "D"
  },
  {
    id: 3,
    rating: 5,
    text: "I love the focus on minimalist details. The vases and ceramics I ordered look like art pieces in my studio.",
    authorName: "Sarah Pearson",
    authorRole: "Interior Stylist, Austin",
    avatarColor: "bg-[#e8d5d5] text-[#5e3c3c] dark:bg-[#4a2f2f] dark:text-[#d9b8b8]",
    avatarInitial: "S"
  },
  {
    id: 4,
    rating: 4,
    text: "The small-space styling ideas have been a game changer for my apartment. Highly recommend their aesthetic approach.",
    authorName: "Marcus Lin",
    authorRole: "Homeowner, San Francisco",
    avatarColor: "bg-[#d5dee8] text-[#3c4b5e] dark:bg-[#2d3a4a] dark:text-[#b8c9d9]",
    avatarInitial: "M"
  },
  {
    id: 5,
    rating: 5,
    text: "Beautiful textures and incredible craftsmanship. My bedroom feels like a serene sanctuary now.",
    authorName: "Olivia Reed",
    authorRole: "Verified Buyer, Toronto",
    avatarColor: "bg-[#e8e2d5] text-[#5e543c] dark:bg-[#4a422f] dark:text-[#d9ceb8]",
    avatarInitial: "O"
  },
  {
    id: 6,
    rating: 5,
    text: "The quality of the premium materials is unmatched. Vikore Vana truly understands the art of quiet luxury.",
    authorName: "James Taylor",
    authorRole: "Homeowner, Sydney",
    avatarColor: "bg-[#e0d5e8] text-[#4f3c5e] dark:bg-[#3d2d4a] dark:text-[#c4b8d9]",
    avatarInitial: "J"
  }
];

export function ReviewsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const totalSlides = reviews.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollLeft;
      const itemWidth = container.scrollWidth / totalSlides;
      const newIndex = Math.round(scrollPosition / itemWidth);
      setActiveIndex(Math.min(Math.max(newIndex, 0), totalSlides - 1));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [totalSlides]);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % totalSlides;
      
      const container = containerRef.current;
      if (container) {
        const child = container.children[0] as HTMLElement;
        if (child) {
          const itemWidth = child.offsetWidth;
          const gap = parseInt(window.getComputedStyle(container).gap || "0");
          const targetScrollLeft = nextIndex * (itemWidth + gap);
          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          
          if (targetScrollLeft > maxScrollLeft + 5) {
            // Loop back to 0
            container.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            container.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
          }
        }
      }
    }, 2500); // auto-slide every 2.5 seconds
    return () => clearInterval(interval);
  }, [activeIndex, totalSlides, isHovered]);

  const scrollToReview = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    // We get the first child to measure the exact card width + gap
    const child = container.children[0] as HTMLElement;
    if (!child) return;
    
    const itemWidth = child.offsetWidth;
    const gap = parseInt(window.getComputedStyle(container).gap || "0");
    
    container.scrollTo({
      left: index * (itemWidth + gap),
      behavior: "smooth"
    });
  };

  return (
    <section className="py-10 sm:py-14 md:py-16">
      <div className="container-premium overflow-hidden">
        <ScrollReveal>
          <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col items-center justify-center text-center">
            <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#b89569]/50 dark:to-[#cba677]/50" />
              <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#b89569] dark:text-[#cba677]">
                Community Reviews
              </p>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#b89569]/50 dark:to-[#cba677]/50" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink dark:text-linen leading-[1.1] mb-6">
              Inspiring 2M+ <span className="text-[#b89569] italic dark:text-[#cba677]">Homes</span>
            </h2>
            
            {/* Desktop Navigation Dots */}
            <div className="hidden sm:flex items-center gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => scrollToReview(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === i 
                      ? "bg-[#b89569] w-8 dark:bg-[#cba677]" 
                      : "bg-black/10 w-2.5 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
 
        <ScrollReveal delay={150} distance={40}>
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <div 
              ref={containerRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="flex gap-4 sm:gap-6 overflow-x-auto pb-8 pt-4 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className="flex flex-col w-[85vw] shrink-0 sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-center sm:snap-start bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-black/5 dark:bg-[#221f1c] dark:border-white/5 transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={18} 
                        className={i < review.rating ? "fill-[#b89569] text-[#b89569] dark:fill-[#cba677] dark:text-[#cba677]" : "fill-black/10 text-black/10 dark:fill-white/10 dark:text-white/10"} 
                      />
                    ))}
                  </div>
                  
                  <blockquote className="flex-1 mb-8">
                    <p className="text-base md:text-lg italic text-ink/80 leading-relaxed dark:text-bone/90">
                      "{review.text}"
                    </p>
                  </blockquote>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    <div className={`grid place-items-center w-11 h-11 rounded-full font-semibold text-lg ${review.avatarColor}`}>
                      {review.avatarInitial}
                    </div>
                    <div>
                      <div className="font-semibold text-ink dark:text-linen text-sm md:text-base">
                        {review.authorName}
                      </div>
                      <div className="text-xs md:text-sm text-smoke mt-0.5 dark:text-bone/60">
                        {review.authorRole}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile Navigation Dots */}
            <div className="flex sm:hidden items-center justify-center gap-2 mt-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => scrollToReview(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeIndex === i 
                      ? "bg-[#b89569] w-6 dark:bg-[#cba677]" 
                      : "bg-black/10 w-2 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20"
                  }`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
