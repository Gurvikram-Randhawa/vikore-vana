"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/content";
import { ArrowRight } from "lucide-react";

export function TrendingProductsCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isVisible = false;
    let isInteracting = false;
    let hintTimeout: ReturnType<typeof setTimeout>;

    const startAutoScroll = () => {
      if (intervalId || !isVisible || isInteracting) return;
      
      intervalId = setInterval(() => {
        if (!container || !isVisible || isInteracting) return;
        
        const itemWidth = (container.children[0] as HTMLElement)?.offsetWidth || 0;
        const gap = parseInt(window.getComputedStyle(container).gap) || 0;
        const scrollAmount = itemWidth + gap;

        const maxScroll = container.scrollWidth - container.clientWidth;

        if (container.scrollLeft >= maxScroll - 10) { 
          // Reached the end, snap back to start
          container.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }, 2000);
    };

    const stopAutoScroll = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Intersection Observer to start/stop based on visibility
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startAutoScroll();
          // Show hint when visible, hide after 3 seconds
          if (!isInteracting && container.scrollLeft === 0) {
            setShowHint(true);
            hintTimeout = setTimeout(() => setShowHint(false), 3000);
          }
        } else {
          stopAutoScroll();
          setShowHint(false);
          clearTimeout(hintTimeout);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(container);

    // Pause on hover or touch
    const handleInteractStart = () => {
      isInteracting = true;
      setShowHint(false);
      clearTimeout(hintTimeout);
      stopAutoScroll();
    };
    
    const handleInteractEnd = () => {
      isInteracting = false;
      startAutoScroll();
    };

    container.addEventListener("mouseenter", handleInteractStart);
    container.addEventListener("mouseleave", handleInteractEnd);
    container.addEventListener("touchstart", handleInteractStart, { passive: true });
    container.addEventListener("touchend", handleInteractEnd, { passive: true });

    return () => {
      stopAutoScroll();
      observer.disconnect();
      clearTimeout(hintTimeout);
      container.removeEventListener("mouseenter", handleInteractStart);
      container.removeEventListener("mouseleave", handleInteractEnd);
      container.removeEventListener("touchstart", handleInteractStart);
      container.removeEventListener("touchend", handleInteractEnd);
    };
  }, []);

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="flex gap-5 overflow-x-auto pb-20 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {products.map((product) => (
          <div key={product.slug} className="flex flex-col w-[85vw] shrink-0 sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Premium Scroll Hint Overlay */}
      <div 
        className={`pointer-events-none absolute right-4 top-[40%] flex -translate-y-1/2 transform items-center justify-center rounded-full bg-ink/80 p-4 text-white shadow-xl backdrop-blur-md transition-all duration-1000 ease-out dark:bg-white/90 dark:text-ink sm:right-8 ${
          showHint ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
        }`}
      >
        <ArrowRight size={24} className="animate-pulse" />
      </div>
    </div>
  );
}
