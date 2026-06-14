"use client";

import { useEffect, useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/content";

export function TrendingProductsCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let targetScroll = container.scrollLeft;
    let currentScroll = container.scrollLeft;
    let animationFrameId: number;
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const deltaY = currentY - lastScrollY;
      lastScrollY = currentY;

      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only apply effect if the container is visible in the viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        if (Math.abs(deltaY) > 0) {
          // Add to target scroll based on vertical scroll delta.
          // 0.8 multiplier makes it feel like a natural, premium parallax drift.
          targetScroll += deltaY * 0.8;
          
          // Clamp the target scroll to prevent bouncing at the edges
          const maxScroll = container.scrollWidth - container.clientWidth;
          targetScroll = Math.max(0, Math.min(maxScroll, targetScroll));
        }
      }
    };

    // Allow user to manually swipe/scroll. If they do, sync our target.
    const handleContainerScroll = () => {
      if (Math.abs(container.scrollLeft - currentScroll) > 3) {
        targetScroll = container.scrollLeft;
        currentScroll = container.scrollLeft;
      }
    };

    // Linear interpolation for buttery smooth movement
    const lerp = (start: number, end: number, factor: number) => {
      return start + (end - start) * factor;
    };

    const update = () => {
      currentScroll = lerp(currentScroll, targetScroll, 0.08);

      // Apply the scroll if the difference is noticeable (prevents micro-stutters)
      if (Math.abs(currentScroll - container.scrollLeft) > 0.5) {
        container.scrollLeft = currentScroll;
      }

      animationFrameId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    container.addEventListener("scroll", handleContainerScroll, { passive: true });
    update();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      container.removeEventListener("scroll", handleContainerScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex gap-5 overflow-x-auto pb-6 no-scrollbar cursor-grab active:cursor-grabbing"
      style={{ scrollBehavior: 'auto', WebkitOverflowScrolling: 'touch' }}
    >
      {products.map((product) => (
        <div key={product.slug} className="w-[85vw] shrink-0 sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
