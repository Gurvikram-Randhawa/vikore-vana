"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Leaf, Feather } from "lucide-react";

const values = [
  {
    number: "01",
    title: "Curation & Quality",
    description: "Every piece is carefully selected to ensure it meets our rigorous standards for aesthetic harmony and functional beauty. We review each item personally — no shortcuts.",
    icon: Sparkles,
    accent: "from-[#b89569]/20 to-[#b89569]/5",
    iconBg: "bg-[#b89569]",
    keyword: "HANDPICKED"
  },
  {
    number: "02",
    title: "Sustainable Living",
    description: "We prioritize pieces crafted with organic materials and eco-conscious manufacturing methods to protect our shared home. Beauty that doesn't cost the earth.",
    icon: Leaf,
    accent: "from-[#4a6b53]/20 to-[#4a6b53]/5",
    iconBg: "bg-[#4a6b53]",
    keyword: "ECO-FIRST"
  },
  {
    number: "03",
    title: "Quiet Luxury",
    description: "Design that focuses on bringing balance, calm, and understated elegance into your everyday spaces. The kind of beauty you feel, not just see.",
    icon: Feather,
    accent: "from-[#6b4a78]/20 to-[#6b4a78]/5",
    iconBg: "bg-[#6b4a78]",
    keyword: "TIMELESS"
  }
];

function ValueCard({ value, index }: { value: typeof values[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const Icon = value.icon;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex flex-col overflow-hidden rounded-3xl transition-all duration-700 cursor-default
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        ${hovered ? "shadow-[0_30px_80px_rgba(0,0,0,0.12)] scale-[1.02] dark:shadow-[0_30px_80px_rgba(0,0,0,0.4)]" : "shadow-[0_4px_24px_rgba(0,0,0,0.05)]"}
        bg-white dark:bg-[#1e1b18] border border-black/5 dark:border-white/5
      `}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Gradient background that animates on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${value.accent} transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`} />

      {/* Large decorative number in background */}
      <div className={`absolute -right-4 -top-4 font-serif font-bold leading-none select-none text-[90px] sm:text-[120px] text-black/[0.04] dark:text-white/[0.04] transition-all duration-500 ${hovered ? "text-black/[0.07] dark:text-white/[0.07] scale-110 -translate-y-2" : ""}`}>
        {value.number}
      </div>

      <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
        {/* Top: keyword pill + icon */}
        <div className="flex items-start justify-between mb-6">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-white ${value.iconBg} transition-all duration-300 ${hovered ? "scale-105" : ""}`}>
            {value.keyword}
          </span>

          {/* Animated icon container */}
          <div className={`flex items-center justify-center w-11 h-11 rounded-2xl ${value.iconBg}/10 dark:${value.iconBg}/20 transition-all duration-500 ${hovered ? "rotate-12 scale-110" : ""}`}>
            <Icon
              className={`transition-all duration-500 ${hovered ? "scale-110" : ""}`}
              size={18}
              style={{ color: value.iconBg.replace("bg-", "").replace("[", "").replace("]", "") }}
            />
          </div>
        </div>

        {/* Number label */}
        <div className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.25em] text-smoke/60 dark:text-bone/40">
          {value.number} / 03
        </div>

        {/* Title */}
        <h3 className={`font-serif text-xl sm:text-2xl text-ink dark:text-linen leading-tight mb-3 transition-all duration-300 ${hovered ? "text-ink dark:text-white" : ""}`}>
          {value.title}
        </h3>

        {/* Animated underline */}
        <div className={`h-px bg-gradient-to-r ${value.accent.replace("/20", "").replace("/5", "")} to-transparent mb-6 transition-all duration-500 ${hovered ? "w-full opacity-100" : "w-8 opacity-60"}`} />

        {/* Description */}
        <p className="text-smoke dark:text-bone/80 text-sm leading-relaxed flex-1">
          {value.description}
        </p>

        {/* Bottom decorative line */}
        <div className={`mt-6 flex items-center gap-3 transition-all duration-500 ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}>
          <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${value.iconBg.replace("bg-", "via-[").replace("]", "/30]")} to-transparent`} />
          <span className="text-xs font-semibold uppercase tracking-widest text-smoke/50 dark:text-bone/40">
            LEARN MORE
          </span>
          <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${value.iconBg.replace("bg-", "via-[").replace("]", "/30]")} to-transparent`} />
        </div>
      </div>
    </div>
  );
}

export function CoreValues() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f7f1e9] py-20 md:py-28 dark:bg-[#161412]">
      {/* Subtle background texture */}
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
          color: "black"
        }}
      />

      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#b89569]/10 to-transparent dark:from-[#b89569]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={`mx-auto max-w-3xl text-center mb-16 md:mb-20 transition-all duration-1000 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-cedar/40" />
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cedar dark:text-[#cba677]">
              The Vikore Approach
            </p>
            <div className="h-px w-10 bg-cedar/40" />
          </div>

          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink dark:text-linen leading-tight mb-6">
            Designed for the{" "}
            <span className="italic text-[#b89569] dark:text-[#cba677]">thoughtful</span>{" "}
            home.
          </h2>

          <p className="text-smoke dark:text-bone/80 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            We believe your space should be a sanctuary. Our philosophy is rooted in intentional living, exceptional craftsmanship, and timeless aesthetics.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <ValueCard key={index} value={value} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
