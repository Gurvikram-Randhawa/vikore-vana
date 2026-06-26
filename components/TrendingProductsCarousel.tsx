"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Product } from "@/lib/content";

function getShortName(name: string) {
  let short = name.split(/[,\-|(|;]/)[0].trim();
  const words = short.split(/\s+/);
  if (words.length > 4) {
    short = words.slice(0, 4).join(" ");
  }
  return short;
}

export function TrendingProductsCarousel({ products }: { products: Product[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragDistanceRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 0.065; // Pixels per millisecond

    const scrollStep = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!container) return;

      if (!isInteractingRef.current) {
        container.scrollLeft += speed * delta;

        const halfWidth = container.scrollWidth / 2;
        if (container.scrollLeft >= halfWidth) {
          container.scrollLeft -= halfWidth;
        } else if (container.scrollLeft < 0) {
          container.scrollLeft += halfWidth;
        }
      }

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame((time) => {
      lastTime = time;
      scrollStep(time);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!products || products.length === 0) {
    return (
      <div className="w-full py-12 text-center text-smoke dark:text-bone/60">
        No products found.
      </div>
    );
  }

  // Duplicate the array to create a seamless infinite loop
  const duplicatedProducts = [...products, ...products];

  const handleInteractionStart = () => {
    isInteractingRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleInteractionEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, 1500); // 1.5 seconds delay before resuming
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    handleInteractionStart();
    dragDistanceRef.current = 0;
    const startX = e.pageX - container.offsetLeft;
    const scrollLeft = container.scrollLeft;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isInteractingRef.current) return;
      const x = moveEvent.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.25; // Scroll speed modifier
      container.scrollLeft = scrollLeft - walk;
      dragDistanceRef.current = Math.abs(x - startX);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      // Wait slightly so click handler can run before interaction finishes
      setTimeout(() => {
        handleInteractionEnd();
      }, 50);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="w-full overflow-hidden relative">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="w-full overflow-x-auto py-4 flex no-scrollbar select-none cursor-grab active:cursor-grabbing"
        style={{
          scrollBehavior: "auto",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
      >
        {duplicatedProducts.map((product, i) => {
          const shortName = getShortName(product.name);
          return (
            <a
              key={`${product.slug}-${i}`}
              href={product.affiliate}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="block select-none pointer-events-auto cursor-pointer shrink-0 transition-all duration-300 hover:scale-[1.02] border border-[#b8935a]/20 dark:border-[#b8935a]/15 shadow-[0_4px_16px_rgba(184,147,90,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_24px_rgba(184,147,90,0.16)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] w-[190px] md:w-[270px] h-[345px] md:h-[440px]"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                marginRight: "16px",
              }}
              draggable={false}
              onClick={(e) => {
                // Prevent click navigation if they were dragging
                if (dragDistanceRef.current > 5) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              <div className="flex flex-col h-full">
                {/* 1. PRODUCT IMAGE */}
                <div className="relative bg-white flex items-center justify-center border-b border-[#b8935a]/10 dark:border-[#b8935a]/10 h-[160px] md:h-[220px] p-3 md:p-5 shrink-0">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(min-width: 768px) 270px, 190px"
                      className="object-contain"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* GLASSMORPHISM WRAPPER FOR TEXT */}
                <div className="flex flex-col flex-grow justify-between bg-white/60 dark:bg-[#1e1a17]/70 backdrop-blur-xl pb-3">
                  <div>
                    {/* 2. CATEGORY LABEL */}
                    <p className="font-sans font-medium uppercase text-[#b8935a] text-[9.5px] md:text-[11px] tracking-[1.5px] px-3.5 pt-3 md:pt-4 pb-1">
                      {product.category}
                    </p>

                    {/* 3. PRODUCT NAME */}
                    <h3 className="font-serif font-medium text-[#1c1c1c] dark:text-[#fdf6f0] leading-tight line-clamp-2 px-3.5 mt-1 sm:mt-1.5 text-[15px] md:text-[18px]">
                      {shortName}
                    </h3>

                    {/* 4. PRODUCT DESCRIPTION */}
                    <p className="font-sans text-[11px] md:text-[12.5px] leading-normal text-[#66615b] dark:text-bone/60 line-clamp-2 px-3.5 mt-2 md:mt-2.5">
                      {product.description}
                    </p>
                  </div>

                  {/* 5. VIEW PRODUCT BUTTON (styled div) */}
                  <div className="mx-3.5 h-8 md:h-9.5 rounded-full bg-[#b85c37] text-white dark:bg-[#c8653b] font-sans text-[10px] md:text-[11.5px] font-semibold uppercase tracking-[1.5px] flex items-center justify-center transition-all duration-300 group-hover:bg-[#9a4d2c] dark:group-hover:bg-[#b0532b] hover:shadow-[0_4px_12px_rgba(184,92,55,0.25)]">
                    View Product
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
