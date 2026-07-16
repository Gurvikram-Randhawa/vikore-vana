"use client";

import { Search, Grid2x2, Sofa, BedDouble, Coffee, Monitor, TreePine, Sparkles, Lamp, Package, Armchair, Bath, BoxSelect, Droplets } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef, useDeferredValue } from "react";
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

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "living room": return <Sofa size={15} />;
    case "bedroom": return <BedDouble size={15} />;
    case "kitchen":
    case "dining": return <Coffee size={15} />;
    case "bathroom": return <Droplets size={15} />;
    case "small spaces": return <BoxSelect size={15} />;
    case "office": return <Monitor size={15} />;
    case "outdoor": return <TreePine size={15} />;
    case "luxury decor":
    case "decor":
    case "home decor": return <Sparkles size={15} />;
    case "lighting": return <Lamp size={15} />;
    case "furniture": return <Armchair size={15} />;
    case "all": return <Grid2x2 size={15} />;
    default: return <Package size={15} />;
  }
}

function CategoryButtons({ category, setCategory }: { category: string, setCategory: (v: string) => void }) {
  return (
    <>
      <button
        onClick={() => setCategory("all")}
        className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[1.5px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${category === "all"
          ? "bg-[#b8935a] text-white shadow-[0_2px_8px_rgba(184,147,90,0.25)] dark:bg-[#cba677] dark:text-ink dark:shadow-[0_2px_8px_rgba(203,166,119,0.25)]"
          : "text-[#7c7267] hover:text-[#b8935a] hover:bg-[#b8935a]/10 dark:text-bone/60 dark:hover:text-[#cba677] dark:hover:bg-white/5"
          }`}
        style={{ fontFamily: "var(--font-jost), sans-serif" }}
      >
        <span className={category === "all" ? "text-white dark:text-ink" : "text-[#b8935a] dark:text-[#cba677]"}>
          {getCategoryIcon("all")}
        </span>
        All
      </button>
      {site.categories.map((item) => (
        <button
          key={item}
          onClick={() => setCategory(categorySlug(item))}
          className={`flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[1.5px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${category === categorySlug(item)
            ? "bg-[#b8935a] text-white shadow-[0_2px_8px_rgba(184,147,90,0.25)] dark:bg-[#cba677] dark:text-ink dark:shadow-[0_2px_8px_rgba(203,166,119,0.25)]"
            : "text-[#7c7267] hover:text-[#b8935a] hover:bg-[#b8935a]/10 dark:text-bone/60 dark:hover:text-[#cba677] dark:hover:bg-white/5"
            }`}
          style={{ fontFamily: "var(--font-jost), sans-serif" }}
        >
          <span className={category === categorySlug(item) ? "text-white dark:text-ink" : "text-[#b8935a] dark:text-[#cba677]"}>
            {getCategoryIcon(item)}
          </span>
          {item}
        </button>
      ))}
    </>
  );
}

function SearchAndCategories({
  query,
  setQuery,
  category,
  setCategory,
  placeholder = "Search here",
}: {
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  placeholder?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    const speed = 0.03; // pixels per ms for a gentle auto-scroll

    const scrollStep = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isInteractingRef.current) {
        container.scrollLeft += speed * delta;
        
        // Seamless infinite loop when we reach exactly the half-way point
        // (Since the two sets are perfectly identical inside the container)
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft -= container.scrollWidth / 2;
        } else if (container.scrollLeft < 0) { 
          // If user manually dragged left past 0, loop back to the second set
          container.scrollLeft += container.scrollWidth / 2;
        }
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame((time) => {
      lastTime = time;
      scrollStep(time);
    });

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="mb-10 grid gap-4 rounded-2xl border border-[#b8935a]/20 bg-[#fdf6f0] p-4 sm:p-5 shadow-[0_4px_20px_rgba(184,147,90,0.06)] md:grid-cols-[1fr_auto] dark:border-[#b8935a]/15 dark:bg-[#25211e] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
      <label className="relative block">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b8935a]" size={18} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="min-h-12 w-full rounded-full border border-[#b8935a]/25 bg-white/40 pl-11 pr-4 text-sm text-ink outline-none transition-all placeholder-[#9c8b7a]/70 focus:border-[#b8935a] focus:bg-white/70 focus:shadow-[0_0_0_3px_rgba(184,147,90,0.12)] dark:border-white/10 dark:bg-black/15 dark:text-linen dark:placeholder-bone/50 dark:focus:border-[#cba677] dark:focus:bg-black/25"
        />
      </label>
      <div 
        ref={containerRef}
        className="flex max-w-full items-center rounded-full p-1 bg-[#b8935a]/8 dark:bg-white/5 border border-[#b8935a]/20 dark:border-white/10 overflow-x-auto no-scrollbar relative"
        onMouseEnter={() => (isInteractingRef.current = true)}
        onMouseLeave={() => (isInteractingRef.current = false)}
        onTouchStart={() => (isInteractingRef.current = true)}
        onTouchEnd={() => {
           // delay resume slightly so it doesn't jump immediately after drag
           setTimeout(() => { isInteractingRef.current = false; }, 1000);
        }}
        style={{ scrollBehavior: "auto", WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex shrink-0 gap-1.5 pr-1.5">
          <CategoryButtons category={category} setCategory={setCategory} />
        </div>
        <div className="flex shrink-0 gap-1.5 pr-1.5">
          <CategoryButtons category={category} setCategory={setCategory} />
        </div>
      </div>
    </div>
  );
}

export function FilteredArticles({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => articles.filter((item) => matches(item, query, category)), [articles, query, category]);

  return <FilterShell query={query} setQuery={setQuery} category={category} setCategory={setCategory} gridClassName="grid gap-9 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((article) => <ArticleCard key={article.slug} article={article} />)}</FilterShell>;
}

export function FilteredProducts({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => products.filter((item) => matches(item, query, category)), [products, query, category]);

  return <FilterShell query={query} setQuery={setQuery} category={category} setCategory={setCategory} gridClassName="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">{filtered.map((product) => <ProductCard key={product.slug} product={product} />)}</FilterShell>;
}

function FilterShell({
  query,
  setQuery,
  category,
  setCategory,
  gridClassName,
  children
}: {
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  gridClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SearchAndCategories query={query} setQuery={setQuery} category={category} setCategory={setCategory} />
      <div className={gridClassName || "grid gap-9 sm:grid-cols-2 lg:grid-cols-3"}>{children}</div>
    </>
  );
}

export function UnifiedSearch({ articles, products }: { articles: Article[]; products: Product[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const urlQuery = searchParams.get("query") || "";
  const category = searchParams.get("category") || "all";

  // Local state for instant typing — URL syncs after a debounce
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // Sync local state when URL changes externally (e.g. back/forward navigation)
  useEffect(() => {
    setLocalQuery(urlQuery);
  }, [urlQuery]);

  const setQuery = (newQuery: string) => {
    setLocalQuery(newQuery); // Update input instantly

    // Debounce the URL update to avoid router.replace on every keystroke
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (newQuery) {
        params.set("query", newQuery);
      } else {
        params.delete("query");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);
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

  // Defer filtering so the input never blocks while React re-renders the grid
  const deferredQuery = useDeferredValue(localQuery);
  const deferredCategory = useDeferredValue(category);

  // Filter using deferred values so typing stays instant
  const filteredArticles = useMemo(() => articles.filter((item) => matches(item, deferredQuery, deferredCategory)), [articles, deferredQuery, deferredCategory]);
  const filteredProducts = useMemo(() => products.filter((item) => matches(item, deferredQuery, deferredCategory)), [products, deferredQuery, deferredCategory]);

  return (
    <>
      <SearchAndCategories query={localQuery} setQuery={setQuery} category={category} setCategory={setCategory} placeholder="Search inspiration, rooms, products..." />

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
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          {filteredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
        </div>
      ) : (
        <p className="text-smoke dark:text-bone">No products found for your search.</p>
      )}
    </>
  );
}
