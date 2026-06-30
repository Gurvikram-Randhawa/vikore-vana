"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

export function Preloader() {
  const [stage, setStage] = useState<"loading" | "exiting" | "done">("done");

  useEffect(() => {
    // Only show on the first load of the session
    const hasLoaded = sessionStorage.getItem("vikore_preloader_shown");
    
    if (!hasLoaded) {
      setStage("loading");
      document.body.style.overflow = "hidden"; // Prevent scrolling while loading

      // Start exit animation after 1.8s
      const exitTimer = setTimeout(() => {
        setStage("exiting");
      }, 1800);

      // Completely remove from DOM after 2.8s
      const doneTimer = setTimeout(() => {
        setStage("done");
        sessionStorage.setItem("vikore_preloader_shown", "true");
        document.body.style.overflow = "unset";
      }, 2800);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(doneTimer);
        document.body.style.overflow = "unset";
      };
    }
  }, []);

  if (stage === "done") return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] bg-[#fffaf4] dark:bg-[#181614] flex flex-col items-center justify-center transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        stage === "exiting" ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-6 overflow-hidden">
        {/* Animated Brand Name */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink dark:text-linen tracking-wide flex items-center gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#b89569] dark:text-[#cba677] animate-pulse" />
          <span className="font-light">Vikore</span>
          <span className="italic font-medium text-[#b89569] dark:text-[#cba677]">Vana</span>
        </h1>
        
        {/* Subtitle / Progress Line */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-1000 delay-500 fill-mode-both">
          <p className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold text-[#9c8b7a] dark:text-bone/60">
            Curating your experience
          </p>
          <div className="h-[1px] w-48 bg-black/5 dark:bg-white/5 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full bg-[#b89569] dark:bg-[#cba677] animate-[progress_1.8s_ease-in-out_forwards]" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
