import type { Metadata } from "next";
import { Suspense } from "react";
import { UnifiedSearch } from "@/components/Filters";
import { getArticles, getProducts } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Vikore Vana articles and curated product recommendations."
};

export default function SearchPage() {
  return (
    <section className="container-premium py-10 sm:py-14 md:py-16">
      <div className="mb-10 sm:mb-12 md:mb-14 text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
          <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]">
            Search Engine
          </p>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink dark:text-linen leading-[1.1] max-w-3xl">
          Find your next <span className="italic text-[#b89569] dark:text-[#cba677]">room idea.</span>
        </h1>
        <p className="mt-4 sm:mt-5 max-w-2xl text-sm md:text-base leading-relaxed md:leading-7 text-smoke dark:text-bone/80 font-light">
          Search across our entire catalog of curated design articles and premium home decor pieces.
        </p>
      </div>
      <Suspense fallback={<p className="text-smoke dark:text-bone text-center">Loading search...</p>}>
        <UnifiedSearch articles={getArticles()} products={getProducts()} />
      </Suspense>
    </section>
  );
}
