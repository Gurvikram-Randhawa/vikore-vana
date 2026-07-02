"use client";

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface BeforeAfterImageProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
}

export function BeforeAfterImage({ beforeImage, afterImage, alt }: BeforeAfterImageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  // Update container width for the before image to maintain aspect ratio
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current || !foregroundRef.current || !sliderRef.current) return;
    
    // Calculate new position
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    // Directly mutate DOM to bypass React render cycle (guarantees buttery smooth 144Hz)
    foregroundRef.current.style.width = `${percentage}%`;
    sliderRef.current.style.left = `${percentage}%`;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    // Prevent scrolling while dragging the slider
    e.preventDefault();
    handleMove(e.touches[0].clientX);
  };

  const handleInteractionStart = (clientX: number) => {
    setIsDragging(true);
    handleMove(clientX);
  };

  const handleInteractionEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleInteractionEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleInteractionEnd);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleInteractionEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleInteractionEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleInteractionEnd);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[3/4] rounded-2xl md:rounded-[2.5rem] overflow-hidden select-none touch-none group shadow-2xl border border-black/5 dark:border-white/5"
      onMouseDown={(e) => handleInteractionStart(e.clientX)}
      onTouchStart={(e) => handleInteractionStart(e.touches[0].clientX)}
    >
      {/* Background (After Image) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={afterImage}
          alt={`${alt} After`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
        />
        {/* Label */}
        <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-black/60 backdrop-blur-md text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium tracking-[0.2em] uppercase shadow-lg z-0">
          After
        </div>
      </div>

      {/* Foreground (Before Image) */}
      <div 
        ref={foregroundRef}
        className="absolute inset-0 h-full overflow-hidden"
        style={{ width: `50%` }}
      >
        <div 
          className="absolute inset-0 h-full" 
          style={{ width: containerWidth ? `${containerWidth}px` : '100vw' }}
        >
          <Image
            src={beforeImage}
            alt={`${alt} Before`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
        </div>
        {/* Label */}
        <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-black/60 backdrop-blur-md text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium tracking-[0.2em] uppercase shadow-lg z-0">
          Before
        </div>
      </div>

      {/* Minimal Slider Handle */}
      <div 
        ref={sliderRef}
        className={`absolute top-0 bottom-0 w-[1.5px] bg-white/80 cursor-col-resize shadow-[0_0_15px_rgba(0,0,0,0.5)] z-20 transition-opacity duration-300 ${isDragging ? 'opacity-0' : 'opacity-100 group-hover:w-[2px]'}`}
        style={{ left: `50%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
          <div className="flex gap-[3px]">
            <div className="w-[1.5px] h-3.5 bg-white rounded-full" />
            <div className="w-[1.5px] h-3.5 bg-white rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
