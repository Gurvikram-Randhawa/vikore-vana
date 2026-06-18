"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { categorySlug, site } from "@/lib/site";
import type { Article, Product } from "@/lib/content";
import { ArticleCard } from "./ArticleCard";
import { ProductCard } from "./ProductCard";

type Item = Article | Product;

function matches(item: Item, query: string, category: string) {
  const title = "title" in item ? item.title : item.name;
  const haystack = `${title} ${item.description} ${item.category}`.toLowerCase();
  const categoryMatch = category === "all" || categorySlug(item.category) === category;
  return categoryMatch && haystack.includes(query.toLowerCase());
}

export function FilteredArticles({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => articles.filter((item) => matches(item, query, category)), [articles, query, category]);

  return <FilterShell query={query} setQuery={setQuery} category={category} setCategory={setCategory}>{filtered.map((article) => <ArticleCard key={article.slug} article={article} />)}</FilterShell>;
}

export function FilteredProducts({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => products.filter((item) => matches(item, query, category)), [products, query, category]);

  return <FilterShell query={query} setQuery={setQuery} category={category} setCategory={setCategory}>{filtered.map((product) => <ProductCard key={product.slug} product={product} />)}</FilterShell>;
}

function FilterShell({
  query,
  setQuery,
  category,
  setCategory,
  children
}: {
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-10 grid gap-4 rounded-lg border border-black/5 bg-white p-4 shadow-soft md:grid-cols-[1fr_auto] dark:border-white/10 dark:bg-white/5">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-smoke" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inspiration, rooms, products..." className="min-h-12 w-full rounded-full border border-black/10 bg-transparent pl-11 pr-4 text-sm outline-none focus:border-cedar dark:border-white/15" />
        </label>
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          <button onClick={() => setCategory("all")} className={`min-h-12 shrink-0 rounded-full px-4 text-sm ${category === "all" ? "bg-ink text-white dark:bg-linen dark:text-ink" : "bg-linen text-ink dark:bg-white/10 dark:text-linen"}`}>
            All
          </button>
          {site.categories.map((item) => (
            <button key={item} onClick={() => setCategory(categorySlug(item))} className={`min-h-12 shrink-0 rounded-full px-4 text-sm ${category === categorySlug(item) ? "bg-ink text-white dark:bg-linen dark:text-ink" : "bg-linen text-ink dark:bg-white/10 dark:text-linen"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </>
  );
}

export function UnifiedSearch({ articles, products }: { articles: Article[]; products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "all";

  const setQuery = (newQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newQuery) {
      params.set("query", newQuery);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setCategory = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory !== "all") {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const filteredArticles = useMemo(() => articles.filter((item) => matches(item, query, category)), [articles, query, category]);
  const filteredProducts = useMemo(() => products.filter((item) => matches(item, query, category)), [products, query, category]);

  return (
    <>
      <div className="mb-10 grid gap-4 rounded-lg border border-black/5 bg-white p-4 shadow-soft md:grid-cols-[1fr_auto] dark:border-white/10 dark:bg-white/5">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-smoke" size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search inspiration, rooms, products..." className="min-h-12 w-full rounded-full border border-black/10 bg-transparent pl-11 pr-4 text-sm outline-none focus:border-cedar dark:border-white/15" />
        </label>
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          <button onClick={() => setCategory("all")} className={`min-h-12 shrink-0 rounded-full px-4 text-sm ${category === "all" ? "bg-ink text-white dark:bg-linen dark:text-ink" : "bg-linen text-ink dark:bg-white/10 dark:text-linen"}`}>
            All
          </button>
          {site.categories.map((item) => (
            <button key={item} onClick={() => setCategory(categorySlug(item))} className={`min-h-12 shrink-0 rounded-full px-4 text-sm ${category === categorySlug(item) ? "bg-ink text-white dark:bg-linen dark:text-ink" : "bg-linen text-ink dark:bg-white/10 dark:text-linen"}`}>
              {item}
            </button>
          ))}
        </div>
      </div>

      <h2 className="mb-6 font-serif text-3xl text-ink dark:text-linen">Articles ({filteredArticles.length})</h2>
      {filteredArticles.length > 0 ? (
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {filteredArticles.map((article) => <ArticleCard key={article.slug} article={article} />)}
        </div>
      ) : (
        <p className="mb-10 text-smoke dark:text-bone">No articles found for your search.</p>
      )}

      <h2 className="mb-6 mt-16 font-serif text-3xl text-ink dark:text-linen">Products ({filteredProducts.length})</h2>
      {filteredProducts.length > 0 ? (
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      ) : (
        <p className="text-smoke dark:text-bone">No products found for your search.</p>
      )}
    </>
  );
}
