"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ChevronUp, ChevronDown } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";

const TOTAL_PAGES = 31;

export function StylingGuideViewer() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Track current page based on scroll position
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const pageHeight = container.scrollHeight / TOTAL_PAGES;
      const page = Math.min(TOTAL_PAGES, Math.max(1, Math.round(scrollTop / pageHeight) + 1));
      setCurrentPage(page);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  // Prevent right-click / drag on images
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const prevent = (e: Event) => e.preventDefault();
    container.addEventListener("contextmenu", prevent);
    container.addEventListener("dragstart", prevent);
    return () => {
      container.removeEventListener("contextmenu", prevent);
      container.removeEventListener("dragstart", prevent);
    };
  }, [isMounted]);

  // Click-and-drag scrolling for desktop
  const isDragging = useRef(false);
  const startY = useRef(0);
  const scrollStart = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    scrollStart.current = scrollRef.current?.scrollTop || 0;
    if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const delta = startY.current - e.clientY;
    scrollRef.current.scrollTop = scrollStart.current + delta;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };

  const scrollToDirection = (dir: "up" | "down") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const children = container.children;

    const targetPage = dir === "down" 
      ? Math.min(TOTAL_PAGES, currentPage + 1) 
      : Math.max(1, currentPage - 1);

    const targetChild = children[targetPage - 1] as HTMLElement;
    if (targetChild) {
      container.scrollTo({
        top: targetChild.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="styling-guide"
      className="py-10 sm:py-14 md:py-16 bg-[#fffaf4] dark:bg-[#181614] relative z-20"
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#b89569]/5 dark:from-[#cba677]/5 to-transparent pointer-events-none" />

      <div className="container-premium relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <ScrollReveal>
            <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
              <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]">
                Exclusive Guide
              </p>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink dark:text-linen leading-[1.1] mb-4">
              Room by Room{" "}
              <span className="italic text-[#b89569] dark:text-[#cba677]">
                Styling Guide
              </span>
            </h2>
            <p className="text-[#9c8b7a] dark:text-bone/80 text-sm max-w-lg mx-auto mb-2">
              A visual formula to style any space — without buying more decor.
              Scroll through the guide below.
            </p>

          </ScrollReveal>
        </div>

        {/* Guide Viewer */}
        <ScrollReveal delay={200}>
          <div className="relative mx-auto flex justify-center">
            {/* Scrollable container */}
            <div
              ref={scrollRef}
              className="relative w-full max-w-[560px] aspect-[1200/1553] max-h-[82vh] rounded-3xl overflow-y-auto overflow-x-hidden snap-y snap-mandatory border border-cedar/15 dark:border-white/10 shadow-[0_16px_48px_rgba(184,147,90,0.1),0_4px_16px_rgba(184,147,90,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)] bg-white dark:bg-[#201d1a] select-none guide-viewer-scroll"
              style={{
                cursor: "grab",
                userSelect: "none",
                WebkitUserSelect: "none",
                WebkitTouchCallout: "none",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Render each page as an optimized Next.js Image */}
              {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map(
                (pageNum) => (
                  <div
                    key={pageNum}
                    className="relative w-full aspect-[1200/1553] shrink-0 leading-[0] snap-start snap-always"
                    style={{ pointerEvents: "none", margin: 0, padding: 0 }}
                  >
                    <Image
                      src={`/images/guide/page-${String(pageNum).padStart(2, "0")}.jpg`}
                      alt={`Styling Guide - Page ${pageNum}`}
                      width={1200}
                      height={1553}
                      quality={80}
                      className="w-full h-auto block"
                      loading={pageNum <= 3 ? "eager" : "lazy"}
                      draggable={false}
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                  </div>
                )
              )}
            </div>

            {/* Page indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-black/60 dark:bg-black/70 backdrop-blur-sm text-white text-[10px] font-serif tracking-[0.25em] uppercase font-light px-4 py-1.5 rounded-full pointer-events-none">
              {currentPage} / {TOTAL_PAGES}
            </div>

            {/* Scroll navigation buttons */}
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToDirection("up");
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-lg flex items-center justify-center text-ink dark:text-linen hover:bg-white dark:hover:bg-black/80 transition-all hover:scale-110 active:scale-95"
                aria-label="Scroll up"
              >
                <ChevronUp size={18} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToDirection("down");
                }}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/80 dark:bg-black/60 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-lg flex items-center justify-center text-ink dark:text-linen hover:bg-white dark:hover:bg-black/80 transition-all hover:scale-110 active:scale-95"
                aria-label="Scroll down"
              >
                <ChevronDown size={18} />
              </button>
            </div>


          </div>
        </ScrollReveal>

        {/* Strict Copyright Warning */}
        <div className="text-center mt-6 mb-2">
          <p className="text-[10px] sm:text-[11px] text-smoke/60 dark:text-bone/40 max-w-lg mx-auto font-medium tracking-wide">
            © {new Date().getFullYear()} Vikore Vana. All images and guides are original copyright. Unauthorized distribution, copying, or resale is strictly prohibited.{" "}
            <Link
              href="/terms"
              className="underline underline-offset-2 hover:text-[#b89569] transition-colors"
            >
              Learn more
            </Link>
          </p>
        </div>

        {/* Email Capture for Download */}
        <ScrollReveal delay={400}>
          <div className="mt-12 md:mt-16 max-w-2xl mx-auto text-center bg-white/60 dark:bg-[#1e1a17]/70 backdrop-blur-xl border border-[#b8935a]/20 dark:border-white/8 rounded-3xl p-8 sm:p-10 shadow-[0_16px_48px_rgba(184,147,90,0.12),0_4px_16px_rgba(184,147,90,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink dark:text-linen mb-3 leading-snug">
              Want to keep this guide?
            </h3>
            <p className="text-[#9c8b7a] dark:text-bone/70 text-sm mb-8 leading-relaxed max-w-md mx-auto">
              Enter your email to download the complete high-resolution PDF version of this styling guide.
            </p>
            
            <div className="max-w-md mx-auto">
              <NewsletterForm isEbook={true} />
            </div>
            
            <p className="text-[10px] text-smoke/70 dark:text-bone/40 mt-4 tracking-wide uppercase">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </ScrollReveal>
        {/* Affiliate Disclosure */}
        <div className="text-center mt-6">
          <p className="text-[10px] sm:text-[11px] text-[#9c8b7a]/70 dark:text-bone/50 max-w-md mx-auto">
            This guide may contain affiliate links. We earn a small commission at no extra cost to you.{" "}
            <Link
              href="/disclosure"
              className="underline underline-offset-2 hover:text-[#b89569] transition-colors"
            >
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
