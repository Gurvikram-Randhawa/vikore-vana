"use client";

import { useEffect, useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/content";

export function TrendingProductsCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isVisible = false;
    let isInteracting = false;

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
        } else {
          stopAutoScroll();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(container);

    // Pause on hover or touch
    const handleInteractStart = () => {
      isInteracting = true;
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
      container.removeEventListener("mouseenter", handleInteractStart);
      container.removeEventListener("mouseleave", handleInteractEnd);
      container.removeEventListener("touchstart", handleInteractStart);
      container.removeEventListener("touchend", handleInteractEnd);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex gap-5 overflow-x-auto pb-6 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
      style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
    >
      {products.map((product) => (
        <div key={product.slug} className="w-[85vw] shrink-0 sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] snap-start">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
