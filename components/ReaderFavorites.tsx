"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Heart, ArrowUpRight, Pin } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { AnimatedHeading } from "@/components/AnimatedHeading";

export type FavoriteArticle = {
  slug: string;
  title: string;
  description: string;
  category: string;
  cover: string;
  readingTime: number;
};

interface ReaderFavoritesProps {
  articles: FavoriteArticle[];
  pins: FavoriteArticle[];
}

/* ─── Pinterest-style Pin Card ─── */
function PinCard({ pin, index }: { pin: FavoriteArticle; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Alternating tall/standard aspect ratios for masonry feel
  const aspectVariants = [
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-[3/4.5]",
    "aspect-[2/3]",
    "aspect-[3/4]",
    "aspect-[4/5]",
  ];
  const aspect = aspectVariants[index % aspectVariants.length];

  return (
    <ScrollReveal delay={index * 100} distance={30} duration={900} className="lg:!transform-none">
      <Link href={`/articles/${pin.slug}`}>
        <div
          className="group relative rounded-[24px] overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image */}
          <div className={`relative ${aspect} bg-bone/30 dark:bg-black/20`}>
            <Image
              src={pin.cover}
              alt={pin.title}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />

            {/* Gradient overlay on hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-500 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Pinterest-style save badge */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-[#E60023] text-white px-2.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg transition-all duration-300 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
              <Pin size={11} className="fill-white" />
              Save
            </div>

            {/* Bottom info on hover */}
            <div
              className={`absolute bottom-0 left-0 right-0 p-3.5 transition-all duration-500 ${
                isHovered
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3"
              }`}
            >
              <p className="text-white font-serif text-sm leading-snug line-clamp-2 drop-shadow-lg">
                {pin.title}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/70 text-[10px] font-sans font-medium uppercase tracking-wider">
                  {pin.category}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

/* ─── Reader Favorite Article Card ─── */
function FavoriteCard({
  article,
  index,
}: {
  article: FavoriteArticle;
  index: number;
}) {
  return (
    <ScrollReveal delay={index * 120} distance={35} duration={900}>
      <Link href={`/articles/${article.slug}`}>
        <article className="group relative flex flex-col sm:flex-row gap-4 sm:gap-5 lg:gap-8 p-4 sm:p-5 lg:p-7 rounded-[24px] bg-white/80 dark:bg-[#2a2723]/80 backdrop-blur-sm border border-black/[0.04] dark:border-white/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(184,147,90,0.12)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-0.5">
          {/* Ranking number */}
          <div className="absolute -top-2.5 -left-1.5 sm:-top-3 sm:-left-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#b89569] dark:bg-[#cba677] flex items-center justify-center shadow-md z-10">
            <span className="text-white text-[11px] sm:text-xs font-bold font-sans">
              {index + 1}
            </span>
          </div>

          {/* Thumbnail */}
          <div className="relative w-full sm:w-28 md:w-32 lg:w-44 aspect-[16/10] sm:aspect-square shrink-0 rounded-[20px] overflow-hidden bg-bone/30 dark:bg-black/10">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              sizes="(min-width: 640px) 128px, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center flex-1 min-w-0">
            {/* Category + reading time */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[#b89569] dark:text-[#cba677] font-sans">
                {article.category}
              </span>
              <span className="h-0.5 w-0.5 rounded-full bg-[#b89569]/40 dark:bg-[#cba677]/40" />
              <span className="text-[9px] sm:text-[10px] font-medium uppercase tracking-wider text-smoke dark:text-bone/50 font-sans">
                {article.readingTime} min read
              </span>
            </div>

            {/* Title */}
            <h3 className="font-serif text-[15px] sm:text-base md:text-lg leading-snug text-ink dark:text-linen line-clamp-2 group-hover:text-[#b89569] dark:group-hover:text-[#cba677] transition-colors duration-300">
              {article.title}
            </h3>

            {/* Description (hidden on mobile) */}
            <p className="hidden sm:block mt-1.5 text-[12px] md:text-[13px] text-smoke dark:text-bone/60 leading-relaxed line-clamp-2 font-sans font-light">
              {article.description}
            </p>

            {/* Read more indicator */}
            <div className="flex items-center gap-1 mt-2 sm:mt-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#b89569] dark:text-[#cba677] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Bookmark size={11} />
              Read article
              <ArrowUpRight
                size={11}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </div>
          </div>
        </article>
      </Link>
    </ScrollReveal>
  );
}

/* ─── Main Section ─── */
export function ReaderFavorites({ articles, pins }: ReaderFavoritesProps) {
  return (
    <section className="py-10 sm:py-14 md:py-16">
      <div className="container-premium">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 md:mb-12 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-[#b89569]/50 dark:to-[#cba677]/50" />
            <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#b89569] dark:text-[#cba677]">
              Loved by Our Readers
            </p>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-[#b89569]/50 dark:to-[#cba677]/50" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink dark:text-linen leading-[1.1] mb-3 text-center">
            Most Saved &<br className="sm:hidden" /> <span className="text-[#b89569] italic dark:text-[#cba677]">Most Loved</span>
          </h2>
          <ScrollReveal delay={200}>
            <p className="text-smoke dark:text-bone/70 text-sm sm:text-base max-w-md mx-auto font-light leading-relaxed">
              Real inspiration from our most bookmarked articles and handpicked editorial selections.
            </p>
          </ScrollReveal>
        </div>

        {/* Two-column layout: Favorites left, Pinterest pins right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] xl:grid-cols-[1.35fr_1fr] gap-8 lg:gap-12">
          {/* ─── Reader Favorites (left) ─── */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                <div className="w-8 h-8 rounded-full bg-[#b89569]/10 dark:bg-[#cba677]/10 flex items-center justify-center">
                  <Bookmark
                    size={14}
                    className="text-[#b89569] dark:text-[#cba677]"
                  />
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-ink dark:text-linen">
                  Reader Favorites
                </h3>
              </div>
            </ScrollReveal>

            <div className="flex flex-col gap-4 sm:gap-5 lg:gap-8">
              {articles.map((article, i) => (
                <FavoriteCard key={article.slug} article={article} index={i} />
              ))}
            </div>
          </div>

          {/* ─── Editor's Picks (right) ─── */}
          <div>
            <ScrollReveal>
              <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
                <div className="w-8 h-8 rounded-full bg-[#E60023]/10 flex items-center justify-center">
                  <Pin size={14} className="text-[#E60023]" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl text-ink dark:text-linen">
                  Editor&apos;s Picks
                </h3>
                {/* Pinterest branding badge — liquid glass style */}
                <a
                  href="https://www.pinterest.com/vikore_vana/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                    bg-white/40 dark:bg-white/[0.07]
                    backdrop-blur-xl backdrop-saturate-150
                    border border-white/50 dark:border-white/[0.12]
                    shadow-[0_1px_3px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.5)]
                    dark:shadow-[0_1px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]
                    transition-all duration-300
                    hover:bg-white/60 dark:hover:bg-white/[0.12]
                    hover:shadow-[0_2px_8px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)]
                    dark:hover:shadow-[0_2px_10px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
                    hover:scale-[1.03] active:scale-[0.97]
                    group/pin cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-ink/50 dark:fill-linen/50 transition-transform duration-300 group-hover/pin:rotate-[-15deg]" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                  </svg>
                  <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.18em] text-ink/50 dark:text-linen/50 leading-none mt-[0.5px]">
                    Pinterest
                  </span>
                  <svg className="w-2.5 h-2.5 text-ink/30 dark:text-linen/30 transition-transform duration-300 group-hover/pin:translate-x-0.5 group-hover/pin:-translate-y-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                </a>
              </div>
            </ScrollReveal>


            {/* Masonry-style Pinterest grid */}
            <div className="columns-2 sm:columns-3 lg:columns-2 gap-3 sm:gap-3.5 space-y-3 sm:space-y-3.5">
              {pins.map((pin, i) => (
                <div key={pin.slug} className="break-inside-avoid">
                  <PinCard pin={pin} index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
