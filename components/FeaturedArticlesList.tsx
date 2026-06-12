"use client";

import { useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import type { Article } from "@/lib/content";

export function FeaturedArticlesList({ articles }: { articles: Article[] }) {
  const [visibleCount, setVisibleCount] = useState(4);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        {articles.slice(0, visibleCount).map((article) => (
          <div key={article.slug} className="rounded-xl bg-white dark:bg-white/5 shadow-soft border border-gray-100 dark:border-white/10 p-4">
            <ArticleCard article={article} large />
          </div>
        ))}
      </div>
      {visibleCount < articles.length && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount(v => v + 4)}
            className="rounded-full bg-ink px-6 py-2 text-sm font-medium text-white transition hover:bg-cedar"
          >
            Show More
          </button>
        </div>
      )}
    </>
  );
}
