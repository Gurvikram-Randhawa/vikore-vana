"use client";

import { useEffect, useRef } from "react";
import Image, { ImageProps } from "next/image";

interface ParallaxImageProps extends ImageProps {
  speed?: number;
}

export function ParallaxImage({ speed = 0.15, className, ...props }: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const imgWrap = imageWrapperRef.current;
    if (!el || !imgWrap) return;

    let rafId: number;
    let targetOffset = 0;
    let currentOffset = 0;
    let isRunning = true;

    const updateParallaxTarget = () => {
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const diff = elementCenter - viewportCenter;
      
      // Apply parallax if element is in or near viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Increase max offset headroom (15% because height is 130%)
        const maxOffset = rect.height * 0.15;
        const calculatedOffset = diff * speed;
        // Clamp the target offset
        targetOffset = Math.max(-maxOffset, Math.min(maxOffset, calculatedOffset));
      }
    };

    const renderLoop = () => {
      if (!isRunning) return;
      
      // Linear interpolation (lerp) for buttery smooth follow
      currentOffset += (targetOffset - currentOffset) * 0.06;
      
      // Update DOM if there is a meaningful difference to save rendering
      if (Math.abs(targetOffset - currentOffset) > 0.05) {
        imgWrap.style.transform = `translate3d(0, ${currentOffset}px, 0)`;
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    const handleScroll = () => {
      updateParallaxTarget();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateParallaxTarget(); // Initial calculation
    
    // Snap immediately to first position so it doesn't float in on load
    currentOffset = targetOffset; 
    imgWrap.style.transform = `translate3d(0, ${currentOffset}px, 0)`;
    
    // Start the continuous render loop
    rafId = requestAnimationFrame(renderLoop);
    
    return () => {
      isRunning = false;
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [speed]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Container is 130% height to allow generous room for movement without exposing edges or sudden clamping */}
      <div 
        ref={imageWrapperRef}
        className="absolute w-full h-[130%] -top-[15%] left-0 right-0" 
        style={{ willChange: 'transform' }}
      >
        <Image {...props} className={`${className || ''} object-cover`} fill />
      </div>
    </div>
  );
}
