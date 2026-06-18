import type { Metadata } from "next";
import { Suspense } from "react";
import { UnifiedSearch } from "@/components/Filters";
import { getArticles, getProducts } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Vikore Vana articles and curated affiliate product recommendations."
};

export default function SearchPage() {
  return (
    <section className="container-premium py-12 md:py-16">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Search</p>
      <h1 className="mb-10 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl dark:text-linen">Find your next room idea.</h1>
      <Suspense fallback={<p className="text-smoke dark:text-bone">Loading search...</p>}>
        <UnifiedSearch articles={getArticles()} products={getProducts()} />
      </Suspense>
    </section>
  );
}
