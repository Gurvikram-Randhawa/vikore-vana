import type { Metadata } from "next";
import { FilteredProducts } from "@/components/Filters";
import { getProducts } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Curated Home Decor Products",
  description: "Shop curated affiliate furniture, home decor, and small-space product recommendations from Vikore Vana."
};

export default function ProductsPage() {
  return (
    <section className="container-premium py-8 md:py-16">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Product Collection</p>
      <h1 className="mb-4 md:mb-6 max-w-3xl font-serif text-4xl leading-tight text-ink md:text-5xl lg:text-7xl dark:text-linen">The edit: beautiful pieces with purpose.</h1>
      <p className="mb-8 md:mb-10 max-w-2xl text-sm md:text-base leading-relaxed md:leading-8 text-smoke dark:text-bone">Every product card is powered by markdown content and ready for affiliate links, category filtering, and search.</p>
      <FilteredProducts products={getProducts()} />
    </section>
  );
}
