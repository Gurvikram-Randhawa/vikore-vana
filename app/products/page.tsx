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
    <section className="container-premium py-10 sm:py-14 md:py-16">
      <div className="mb-10 sm:mb-12 md:mb-14 text-center flex flex-col items-center justify-center">
        <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
          <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]">
            Product Collection
          </p>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-ink dark:text-linen leading-[1.1] max-w-3xl">
          The edit: beautiful pieces with <span className="italic text-[#b89569] dark:text-[#cba677]">purpose.</span>
        </h1>
        <p className="mt-4 sm:mt-5 max-w-2xl text-sm md:text-base leading-relaxed md:leading-7 text-smoke dark:text-bone/80 font-light">
          Every product card is powered by markdown content and ready for affiliate links, category filtering, and search.
        </p>
      </div>
      <FilteredProducts products={getProducts()} />
    </section>
  );
}
