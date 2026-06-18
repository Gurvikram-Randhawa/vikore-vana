"use client";

import { useEffect, useState } from "react";

export function AmbientBackground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial value
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden mix-blend-multiply dark:mix-blend-screen opacity-70">
      <div 
        className="absolute -right-[10%] -top-[10%] h-[50vw] max-h-[800px] w-[50vw] max-w-[800px] rounded-full bg-[#ecd5b7] blur-[100px] md:blur-[140px] opacity-40 dark:bg-[#332415] dark:opacity-30 transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${scrollY * 0.05}px, ${scrollY * 0.15}px, 0)` }}
      />
      <div 
        className="absolute -left-[15%] top-[30%] h-[40vw] max-h-[600px] w-[40vw] max-w-[600px] rounded-full bg-[#d6c7b5] blur-[100px] md:blur-[120px] opacity-40 dark:bg-[#1a1e24] dark:opacity-30 transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${scrollY * 0.02}px, ${-scrollY * 0.1}px, 0)` }}
      />
      <div 
        className="absolute right-[5%] bottom-[-20%] h-[45vw] max-h-[700px] w-[45vw] max-w-[700px] rounded-full bg-[#e8d1bc] blur-[100px] md:blur-[130px] opacity-30 dark:bg-[#2c2016] dark:opacity-20 transition-transform duration-300 ease-out"
        style={{ transform: `translate3d(${-scrollY * 0.04}px, ${scrollY * 0.08}px, 0)` }}
      />
    </div>
  );
}
