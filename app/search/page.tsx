import type { Metadata } from "next";
import { FilteredArticles, FilteredProducts } from "@/components/Filters";
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
      <h2 className="mb-6 font-serif text-4xl text-ink dark:text-linen">Articles</h2>
      <FilteredArticles articles={getArticles()} />
      <h2 className="mb-6 mt-16 font-serif text-4xl text-ink dark:text-linen">Products</h2>
      <FilteredProducts products={getProducts()} />
    </section>
  );
}
