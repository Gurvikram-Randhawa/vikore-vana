"use client";

import { useEffect, useRef, useState } from "react";
import Image, { ImageProps } from "next/image";

interface ParallaxImageProps extends ImageProps {
  speed?: number;
}

export function ParallaxImage({ speed = 0.15, className, ...props }: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      const diff = elementCenter - viewportCenter;
      
      // Apply parallax if element is in or near viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Limit max offset to prevent image edges from showing
        const maxOffset = rect.height * 0.1;
        const calculatedOffset = diff * speed;
        // Clamp the offset
        const clampedOffset = Math.max(-maxOffset, Math.min(maxOffset, calculatedOffset));
        setOffset(clampedOffset);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Container is 120% height to allow room for movement without exposing edges */}
      <div 
        className="absolute w-full h-[120%] -top-[10%] left-0 right-0 transition-transform duration-75 ease-out" 
        style={{ 
          transform: `translate3d(0, ${offset}px, 0)`,
          willChange: 'transform'
        }}
      >
        <Image {...props} className={`${className || ''} object-cover`} fill />
      </div>
    </div>
  );
}
