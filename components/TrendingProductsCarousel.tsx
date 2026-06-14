"use client";

import { useEffect, useRef } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/content";

export function TrendingProductsCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Ensure the container is in viewport before doing work
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        // When user scrolls vertically, scroll the container horizontally
        if (Math.abs(deltaY) > 0) {
          container.scrollLeft += deltaY * 1.2; // 1.2 is the scroll speed multiplier
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar"
      style={{ scrollBehavior: 'auto' }} // Ensure immediate update without smooth snapping conflicts during scroll
    >
      {products.map((product) => (
        <div key={product.slug} className="w-full shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
