"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { StyleQuiz } from "@/components/StyleQuiz";
import type { Product } from "@/lib/content";

export function QuizPopup({ allProducts }: { allProducts: Product[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(true); // Default true to prevent hydration mismatch

  useEffect(() => {
    // Check if already shown in this session
    const shown = sessionStorage.getItem("quizPopupShown") === "true";
    setHasShown(shown);

    if (shown) return;

    let canTrigger = false;
    // Require at least 5 seconds on the page before it can ever trigger
    const timer = setTimeout(() => {
      canTrigger = true;
    }, 5000);

    const handleScroll = () => {
      if (!canTrigger) return;

      // Trigger if user scrolls past 2000px or hits the bottom of the page (within 200px)
      if (window.scrollY > 2000 || window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        setIsOpen(true);
        setHasShown(true);
        sessionStorage.setItem("quizPopupShown", "true");
        window.removeEventListener("scroll", handleScroll);
        
        // Prevent background scrolling when open
        document.body.style.overflow = 'hidden';
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-500">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" 
        onClick={closePopup}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#fffaf4] dark:bg-[#181614] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-[#b8935a]/20 dark:border-[#b8935a]/10 animate-in slide-in-from-bottom-12 duration-700 delay-150 fill-mode-both scrollbar-hide">
        
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-ink dark:text-linen transition-colors"
          aria-label="Close Quiz"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative background within modal */}
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#b89569]/10 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Quiz Component embedded */}
        <div className="relative z-10 pt-8 pb-12 sm:pt-12 sm:pb-16 px-4">
          <StyleQuiz allProducts={allProducts} />
        </div>
      </div>
    </div>
  );
}
