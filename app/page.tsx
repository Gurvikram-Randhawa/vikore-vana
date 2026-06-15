import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturedArticlesList } from "@/components/FeaturedArticlesList";
import { TrendingProductsCarousel } from "@/components/TrendingProductsCarousel";
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
      <section className="container-premium grid min-h-[calc(100svh-4rem)] items-center gap-6 py-6 md:gap-10 md:grid-cols-[0.95fr_1.05fr] md:py-16">
        <div className="order-2 md:order-1">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.28em] text-cedar">Editorial interiors for aesthetic living</p>
          <h1 className="max-w-3xl font-serif text-2xl leading-tight tracking-tighter text-ink sm:text-3xl md:text-5xl lg:text-6xl dark:text-linen">
            Your Home Shapes.<br />How You Feel.<br />Make Every Corner Matter.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-smoke sm:text-base sm:leading-8 md:mt-6 md:text-lg dark:text-bone">
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

      <section className="container-premium py-8 md:py-12">
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Latest Guides</p>
          <h2 className="font-serif text-3xl text-ink md:text-5xl dark:text-linen">Featured Articles</h2>
        </div>
        <FeaturedArticlesList articles={sortedArticles} />
      </section>

      <section className="bg-linen pt-10 pb-6 md:py-16 dark:bg-[#201d1a]">
        <div className="container-premium">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Affiliate Finds</p>
              <h2 className="font-serif text-3xl text-ink md:text-5xl dark:text-linen">Trending Products</h2>
            </div>
            <Link href="/products" className="hidden text-sm font-medium text-cedar sm:inline">Shop all</Link>
          </div>
          <TrendingProductsCarousel products={products} />
          <div className="mt-2 flex justify-center sm:hidden">
            <Link href="/products" className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:bg-cedar dark:bg-white dark:text-ink dark:hover:bg-bone">
              Shop More
            </Link>
          </div>
        </div>
      </section>

      <section className="container-premium py-8 md:py-10">
        <div className="mb-8 flex items-end justify-between gap-5">
          <h2 className="font-serif text-3xl text-ink md:text-5xl dark:text-linen">Featured Categories</h2>
          <Link href="/categories" className="hidden text-sm font-medium text-cedar sm:inline">View all</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {site.categoryTiles.map((category) => {
            const descriptions: Record<string, string> = {
              "Living Room": "Curated pieces and layouts designed to anchor your home with calm elegance.",
              "Bedroom": "Soft textures and serene styling ideas for your most personal sanctuary.",
              "Kitchen": "Functional beauty and refined aesthetics to elevate your culinary space.",
              "Bathroom": "Minimalist details and soothing elements for a spa-like daily retreat.",
              "Small Spaces": "Clever design solutions maximizing impact without sacrificing breathing room.",
              "Home Decor": "Artful accents and meaningful objects that bring quiet character to any room.",
              "Lighting": "Thoughtful illumination that sets the mood and shapes your spatial experience.",
              "Indoor Plants": "Organic textures and natural vitality to breathe life into your interiors.",
              "Luxury Decor": "Premium materials and timeless craftsmanship for an undeniably elevated aesthetic.",
              "Shop All Products": "Browse every curated affiliate find beautifully arranged in one polished collection."
            };
            const desc = descriptions[category] || "Fresh inspiration, curated product finds, and refined styling ideas.";

            return (
              <Link key={category} href={category === "Shop All Products" ? "/products" : `/categories?category=${categorySlug(category)}`} className="group flex flex-col justify-between rounded-lg border border-black/5 bg-white p-4 md:p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft dark:border-white/10 dark:bg-white/5">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Vikore Edit</span>
                  <h3 className="mt-3 font-serif text-2xl md:mt-4 md:text-3xl text-ink dark:text-linen">{category}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-smoke dark:text-bone">{desc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-premium py-12 md:py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bone to-oat px-6 py-12 text-center shadow-soft sm:px-12 md:py-16 dark:from-[#2a2622] dark:to-ink">
          {/* Subtle dot pattern overlay for texture */}
          <div className="absolute inset-0 opacity-[0.04] dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '32px 32px', color: 'black' }}></div>

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mb-4 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-cedar/40 dark:bg-cedar/20"></div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cedar">The Weekly Room Note</p>
              <div className="h-px w-12 bg-cedar/40 dark:bg-cedar/20"></div>
            </div>
            <h2 className="mb-6 font-serif text-4xl leading-tight text-ink sm:text-5xl lg:text-6xl dark:text-linen">
              Calm edits.<br className="hidden sm:block" /> Clever layouts.
            </h2>
            <p className="mb-10 text-base leading-relaxed text-ink/70 sm:text-lg dark:text-bone/80">
              Join our newsletter for curated pieces worth pinning and aesthetic living inspiration delivered directly to your inbox every Sunday.
            </p>
            <div className="mx-auto max-w-md">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
