import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedArticlesList } from "@/components/FeaturedArticlesList";
import { ProductCard } from "@/components/ProductCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getArticles, getProducts } from "@/lib/content";
import { categorySlug, site } from "@/lib/site";

const heroImage = "/hero.jpg";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const articles = getArticles();
  const products = getProducts();
  const sortedArticles = [
    ...articles.filter((a) => a.featured),
    ...articles.filter((a) => !a.featured),
  ];


  return (
    <>
      <section className="container-premium grid min-h-[calc(100svh-4rem)] items-center gap-10 py-10 md:grid-cols-[0.95fr_1.05fr] md:py-16">
        <div className="order-2 md:order-1">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-cedar">Editorial interiors for aesthetic living</p>
          <h1 className="max-w-3xl font-serif text-3xl leading-tight tracking-tighter text-ink sm:text-4xl md:text-5xl lg:text-6xl dark:text-linen">
            Your Home Shapes How You Feel.<br />Make Every Corner Matter.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-smoke sm:text-lg dark:text-bone">
            Discover refined home decor ideas, small-space styling, furniture edits, and shoppable design inspiration curated for calm, beautiful spaces.
          </p>
          <Link href="/categories" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-ink px-6 text-sm font-medium text-white transition hover:bg-cedar dark:bg-linen dark:text-ink">
            Explore Ideas <ArrowRight size={18} />
          </Link>
        </div>
        <div className="order-1 md:order-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-bone shadow-soft sm:aspect-[5/4] md:aspect-[4/5]">
            <Image src={heroImage} alt="Warm minimalist living room with sculptural furniture" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="image-fade object-cover" />
          </div>
        </div>
      </section>

      <section className="container-premium py-12">
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Latest Guides</p>
          <h2 className="font-serif text-4xl text-ink md:text-5xl dark:text-linen">Featured Articles</h2>
        </div>
        <FeaturedArticlesList articles={sortedArticles} />
      </section>

      <section className="bg-linen py-16 dark:bg-[#201d1a]">
        <div className="container-premium">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Affiliate Finds</p>
              <h2 className="font-serif text-4xl text-ink md:text-5xl dark:text-linen">Trending Products</h2>
            </div>
            <Link href="/products" className="hidden text-sm font-medium text-cedar sm:inline">Shop all</Link>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory no-scrollbar">
            {products.map((product) => (
              <div key={product.slug} className="min-w-[280px] sm:min-w-[320px] snap-start shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-premium py-10">
        <div className="mb-8 flex items-end justify-between gap-5">
          <h2 className="font-serif text-4xl text-ink md:text-5xl dark:text-linen">Featured Categories</h2>
          <Link href="/categories" className="hidden text-sm font-medium text-cedar sm:inline">View all</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {site.categoryTiles.map((category) => (
            <Link key={category} href={category === "Shop All Products" ? "/products" : `/categories?category=${categorySlug(category)}`} className="group rounded-lg border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-white/5">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Vikore Edit</span>
              <h3 className="mt-4 font-serif text-3xl text-ink dark:text-linen">{category}</h3>
              <p className="mt-3 text-sm leading-7 text-smoke dark:text-bone">{category === "Shop All Products" ? "Browse every curated affiliate find in one polished collection." : "Fresh inspiration, product finds, and refined styling ideas."}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-premium py-16">
        <div className="rounded-lg bg-ink px-6 py-12 text-center text-white md:px-12 dark:bg-linen dark:text-ink">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-oat dark:text-cedar">The Weekly Room Note</p>
          <h2 className="mx-auto max-w-2xl font-serif text-4xl md:text-5xl">Calm edits, clever layouts, and pieces worth pinning.</h2>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
