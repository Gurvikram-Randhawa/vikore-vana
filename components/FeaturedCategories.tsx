"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface CategoryItem {
  name: string;
  description: string;
  slug: string;
  icon: React.ReactNode;
}

const categoryData: CategoryItem[] = [
  {
    name: "Living Room",
    description: "Warm cozy sofa scene",
    slug: "living-room",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#b8935a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M10 44h44" />
        <path d="M16 44v4M48 44v4" />
        <path d="M8 35c0-2.2 1.8-4 4-4h40c2.2 0 4 1.8 4 4v9H8v-9z" />
        <path d="M14 31V24c0-3.3 2.7-6 6-6h24c3.3 0 6 2.7 6 6v7" />
        <path d="M32 18v13" />
      </svg>
    ),
  },
  {
    name: "Bedroom",
    description: "Soft linen minimal bedroom",
    slug: "bedroom",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#b8935a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M12 46V18c0-2 1.5-3.5 3.5-3.5h29c2 0 3.5 1.5 3.5 3.5v28" />
        <path d="M8 38h48" />
        <path d="M8 44h48" />
        <path d="M12 44v6M52 44v6" />
        <rect x="18" y="24" width="12" height="7" rx="1.5" />
        <rect x="34" y="24" width="12" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    name: "Kitchen",
    description: "Clean marble countertop aesthetic",
    slug: "kitchen",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#b8935a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M18 46h28v-18H18v18z" />
        <path d="M15 28h34" />
        <path d="M32 28V20" />
        <path d="M26 20h12" />
        <path d="M18 34h-4c-2.2 0-4 1.8-4 4v2c0 2.2 1.8 4 4 4h4" />
        <path d="M46 32c4-2 8-1 10 3" />
      </svg>
    ),
  },
  {
    name: "Bathroom",
    description: "Spa-like white bathroom",
    slug: "bathroom",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#b8935a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <rect x="20" y="16" width="24" height="34" rx="12" />
        <path d="M32 16V8" />
        <path d="M32 8a2 2 0 100-4 2 2 0 000 4z" />
        <path d="M24 18L32 8l8 10" />
        <path d="M38 24c2 3 3 7 3 11" strokeDasharray="2 3" />
      </svg>
    ),
  },
  {
    name: "Small Spaces",
    description: "Clever compact styling",
    slug: "small-spaces",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#b8935a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M14 48V32c0-2.2 1.8-4 4-4h18c2.2 0 4 1.8 4 4v16" />
        <path d="M26 48V38c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v10" />
        <path d="M18 28h10" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    name: "Home Decor",
    description: "Styled shelf with objects",
    slug: "home-decor",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#b8935a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M26 48c0 4.4 2.7 8 6 8s6-3.6 6-8V36c0-2-1.5-4-3-5V20h-6v11c-1.5 1-3 3-3 5v12z" />
        <path d="M22 56h20" />
        <path d="M32 20V10c0-2-1-4-3-5" />
        <path d="M32 15c2 0 4-1.5 4-3.5S34 8 32 10" />
        <path d="M29 9c-1.5 0-3-1.5-3-3s1.5-2.5 3-1.5" />
      </svg>
    ),
  },
  {
    name: "Lighting",
    description: "Warm lamp glow interior",
    slug: "lighting",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#b8935a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M32 10v20" />
        <path d="M24 10h16" />
        <path d="M18 42c0-5.5 4.5-10 10-10h8c5.5 0 10 4.5 10 10H18z" />
        <path d="M30 42v2c0 1.1.9 2 2 2s2-.9 2-2v-2" />
        <path d="M22 52l-2 4M32 54v4M42 52l2 4" strokeDasharray="1 3" />
      </svg>
    ),
  },
  {
    name: "Indoor Plants",
    description: "Natural botanical vitality",
    slug: "indoor-plants",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#b8935a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M24 44h16l-2 12H26L24 44z" />
        <path d="M32 44V20" />
        <path d="M32 32c4-2 8-1 10-3s2-6 0-7-6 1-10 3" />
        <path d="M32 38c-4-2-8-1-10-3s-2-6 0-7 6 1 10 3" />
        <path d="M32 24c2-3 4-6 1-9s-6-1-7 2 2 6 6 7" />
      </svg>
    ),
  },
  {
    name: "Luxury Decor",
    description: "Elevated luxury statement",
    slug: "luxury-decor",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="#b8935a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16">
        <path d="M18 52V28c0-7.7 6.3-14 14-14s14 6.3 14 14v24" />
        <path d="M14 52h36" />
        <circle cx="32" cy="38" r="6" />
        <path d="M32 44v8" />
      </svg>
    ),
  },
];

function CategoryCard({ item, index }: { item: CategoryItem; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`h-full transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <Link
        href={`/search?category=${item.slug}`}
        className="group flex flex-col justify-center items-center h-full min-h-[125px] sm:min-h-[145px] md:min-h-[195px] rounded-[20px] p-4 sm:p-5 md:p-8 text-center
          bg-[#fdf6f0]/60 dark:bg-[#25211e]/60 backdrop-blur-md
          border border-[#b8935a]/20 dark:border-[#b8935a]/15
          shadow-[0_4px_12px_rgba(184,147,90,0.08)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]
          transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(184,147,90,0.16)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
      >
        <div className="flex flex-col items-center">
          {/* SVG ILLUSTRATION */}
          <div className="flex justify-center items-center text-[#b8935a] transition-transform duration-500 group-hover:scale-105 md:scale-130 md:mb-3">
            {item.icon}
          </div>

          {/* CATEGORY NAME */}
          <h3
            className="mt-4 text-[13px] sm:text-[14px] md:text-[16px] text-ink dark:text-linen leading-none uppercase tracking-[3px] font-semibold"
            style={{ fontFamily: "var(--font-jost), var(--font-inter), sans-serif" }}
          >
            {item.name}
          </h3>
        </div>
      </Link>
    </div>
  );
}

export function FeaturedCategories({ categories }: { categories?: string[] }) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeaderVisible(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden py-10 sm:py-14 md:py-16">
      <div className="container-premium relative z-10">
        {/* Header */}
        <div
          ref={headerRef}
          className={`mb-10 sm:mb-12 md:mb-14 text-center transition-all duration-1000 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
            <p
              className="text-[0.6rem] sm:text-[0.65rem] font-medium uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]"
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              Explore by Room
            </p>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink dark:text-linen leading-[1.1]">
            Featured <span className="italic text-[#b89569] dark:text-[#cba677]">Categories</span>
          </h2>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 max-w-5xl mx-auto">
          {categoryData.slice(0, 8).map((item, i) => (
            <CategoryCard key={item.slug} item={item} index={i} />
          ))}
        </div>

        {/* View all categories button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/categories"
            className="group inline-flex items-center justify-center gap-2 h-11 px-8 rounded-full 
              border border-[#b8935a] text-[#b8935a] font-sans text-xs font-semibold uppercase tracking-[2px]
              transition-all duration-300 hover:bg-[#b8935a] hover:text-white hover:shadow-[0_4px_14px_rgba(184,147,90,0.25)]"
          >
            View All Categories
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
