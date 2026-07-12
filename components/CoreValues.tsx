"use client";

import { useRef } from "react";
import { Sparkles, Leaf, Hourglass } from "lucide-react";

const values = [
  {
    title: "CURATED",
    description: "Handpicked for beauty",
    icon: Sparkles,
  },
  {
    title: "CONSCIOUS",
    description: "Eco-friendly materials",
    icon: Leaf,
  },
  {
    title: "TIMELESS",
    description: "Quiet luxury, always",
    icon: Hourglass,
  }
];

export function CoreValues() {

  return (
    <section className="relative overflow-hidden py-10 sm:py-14 md:py-16">
      {/* Subtle dot texture */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)",
          backgroundSize: "48px 48px",
          color: "#9A7B5D"
        }}
      />

      {/* Gradient blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#b89569]/8 to-transparent dark:from-[#b89569]/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="container-premium relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center mb-10 sm:mb-12 md:mb-14">
          <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
            <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]">
              The Vikore Approach
            </p>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink dark:text-linen leading-[1.1] mb-4 sm:mb-6 flex flex-wrap justify-center">
            Designed for the <span className="italic text-[#b89569] dark:text-[#cba677] ml-2 mr-2">thoughtful</span> home.
          </h2>

          <p className="text-smoke dark:text-bone/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto font-light">
            Our philosophy is rooted in intentional living, exceptional craftsmanship, and timeless aesthetics.
          </p>
        </div>

        {/* 3-Column Minimal Row */}
        <div className="border-y border-[#b8935a]/40 py-[40px] grid grid-cols-3 divide-x divide-[#b8935a]/40 max-w-4xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="flex flex-col items-center justify-center text-center px-1 sm:px-4">
                <div className="mb-4 transform transition-transform duration-[2000ms] hover:scale-110 hover:rotate-3">
                  <Icon size={28} color="#b8935a" strokeWidth={1.25} />
                </div>
                <h3
                  className="text-[12px] sm:text-[13px] text-[#1c1c1c] dark:text-linen uppercase tracking-[2.5px] mb-2 font-semibold"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-[11px] sm:text-[12px] text-[#9c8b7a] dark:text-[#c1b5a9] font-light"
                  style={{ fontFamily: "var(--font-jost)" }}
                >
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
