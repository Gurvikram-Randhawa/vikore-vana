"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/content";
import { ArrowRight, Grid2x2, Sofa, BedDouble, Coffee, Monitor, TreePine, Sparkles, Lamp, Package, Armchair } from "lucide-react";

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "living room": return <Sofa size={15} />;
    case "bedroom": return <BedDouble size={15} />;
    case "dining":
    case "kitchen": return <Coffee size={15} />;
    case "office": return <Monitor size={15} />;
    case "outdoor": return <TreePine size={15} />;
    case "decor":
    case "home decor": return <Sparkles size={15} />;
    case "lighting": return <Lamp size={15} />;
    case "furniture": return <Armchair size={15} />;
    case "all": return <Grid2x2 size={15} />;
    default: return <Package size={15} />;
  }
}

export function TrendingProductsCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  // Reset scroll position when category changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  }, [activeCategory]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let isVisible = false;
    let isInteracting = false;
    let hintTimeout: ReturnType<typeof setTimeout>;

    const startAutoScroll = () => {
      if (intervalId || !isVisible || isInteracting || filteredProducts.length <= 1) return;
      
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
      }, 3000); // Slower auto-scroll for better UX
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
  }, [filteredProducts.length]);

  return (
    <div className="relative">
      {/* Category Pill Filters */}
      <div className="mb-8 flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-ink text-white shadow-md dark:bg-white dark:text-ink"
                  : "bg-white border border-black/10 text-ink hover:bg-black/5 dark:bg-[#221f1c] dark:border-white/10 dark:text-bone dark:hover:bg-white/5"
              }`}
            >
              {getCategoryIcon(category)}
              {category}
            </button>
          );
        })}
      </div>

      {/* Carousel */}
      <div 
        ref={containerRef}
        className="flex gap-5 overflow-x-auto pb-12 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.slug} className="flex flex-col w-[85vw] shrink-0 sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] snap-start transition-all duration-500">
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="w-full py-12 text-center text-smoke dark:text-bone/60">
            No products found in this category.
          </div>
        )}
      </div>

      {/* Premium Scroll Hint Overlay */}
      {filteredProducts.length > 1 && (
        <div 
          className={`pointer-events-none absolute right-4 top-[60%] flex -translate-y-1/2 transform items-center justify-center rounded-full bg-ink/80 p-4 text-white shadow-xl backdrop-blur-md transition-all duration-1000 ease-out dark:bg-white/90 dark:text-ink sm:right-8 ${
            showHint ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
          }`}
        >
          <ArrowRight size={24} className="animate-pulse" />
        </div>
      )}
    </div>
  );
}
