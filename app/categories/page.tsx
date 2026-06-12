import type { Metadata } from "next";
import { FilteredArticles } from "@/components/Filters";
import { getArticles } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Interior Design Categories",
  description: "Browse Vikore Vana home decor guides by living room, bedroom, small spaces, furniture, and luxury decor."
};

export default function CategoriesPage() {
  return (
    <section className="container-premium py-12 md:py-16">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Browse by mood and room</p>
      <h1 className="mb-6 max-w-3xl font-serif text-5xl leading-tight text-ink md:text-7xl dark:text-linen">Interior ideas shaped for real homes.</h1>
      <p className="mb-10 max-w-2xl text-base leading-8 text-smoke dark:text-bone">Filter room guides, furniture edits, and decor inspiration for apartments, houses, and calm everyday rituals.</p>
      <FilteredArticles articles={getArticles()} />
    </section>
  );
}
