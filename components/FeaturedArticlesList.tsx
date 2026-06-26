"use client";

import { useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { ScrollReveal } from "@/components/ScrollReveal";
import type { Article } from "@/lib/content";

export function FeaturedArticlesList({ articles }: { articles: Article[] }) {
  const [visibleCount, setVisibleCount] = useState(6);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        {articles.slice(0, visibleCount).map((article, index) => (
          <ScrollReveal key={article.slug} delay={index * 100} distance={40}>
            <div className="h-full">
              <ArticleCard article={article} large />
            </div>
          </ScrollReveal>
        ))}
      </div>
      {visibleCount < articles.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisibleCount((v) => v + 6)}
            className="group inline-flex items-center justify-center gap-2 h-11 px-8 rounded-full 
              border border-[#b8935a] text-[#b8935a] font-sans text-xs font-semibold uppercase tracking-[2px]
              transition-all duration-300 hover:bg-[#b8935a] hover:text-white hover:shadow-[0_4px_14px_rgba(184,147,90,0.25)]"
          >
            Show More
            <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
          </button>
        </div>
      )}
    </>
  );
}
