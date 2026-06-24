import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FurnishEasyHero } from "@/components/FurnishEasyHero";
import { MarqueeText } from "@/components/MarqueeText";
import { CoreValues } from "@/components/CoreValues";
import { FaqSection } from "@/components/FaqSection";
import { FeaturedArticlesList } from "@/components/FeaturedArticlesList";
import { TrendingProductsCarousel } from "@/components/TrendingProductsCarousel";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getArticles, getProducts } from "@/lib/content";
import { categorySlug, site } from "@/lib/site";


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
      {/* Hero — Furnish-Easy Style */}
      <FurnishEasyHero />

      {/* Philosophy Marquee */}
      <MarqueeText />

      {/* Featured Articles */}
      <section className="container-premium py-8 md:py-12">
        <ScrollReveal>
          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Latest Guides</p>
            <h2 className="font-serif text-3xl text-ink md:text-5xl dark:text-linen">Featured Articles</h2>
          </div>
        </ScrollReveal>
        <FeaturedArticlesList articles={sortedArticles} />
      </section>

      {/* Trending Products */}
      <section className="bg-linen pt-10 pb-6 md:py-16 dark:bg-[#201d1a]">
        <div className="container-premium">
          <ScrollReveal>
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Affiliate Finds</p>
                <h2 className="font-serif text-3xl text-ink md:text-5xl dark:text-linen">Trending Products</h2>
              </div>
              <Link href="/products" className="hidden text-sm font-medium text-cedar sm:inline">Shop all</Link>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200} distance={60}>
            <TrendingProductsCarousel products={products} />
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="-mt-2 pb-6 flex justify-center sm:hidden">
              <Link href="/products" className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-white transition hover:bg-cedar dark:bg-white dark:text-ink dark:hover:bg-bone shadow-sm hover:shadow-md">
                Shop More
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Values */}
      <CoreValues />

      {/* Featured Categories */}
      <section className="container-premium py-8 md:py-10">
        <ScrollReveal>
          <div className="mb-8 flex items-end justify-between gap-5">
            <h2 className="font-serif text-3xl text-ink md:text-5xl dark:text-linen">Featured Categories</h2>
            <Link href="/categories" className="hidden text-sm font-medium text-cedar sm:inline">View all</Link>
          </div>
        </ScrollReveal>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {site.categoryTiles.map((category, i) => {
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
              <ScrollReveal key={category} delay={i * 80} distance={35}>
                <Link href={category === "Shop All Products" ? "/products" : `/search?category=${categorySlug(category)}`} className="category-tile card-hover-glow relative group flex flex-col justify-between rounded-xl border border-black/5 bg-white p-5 md:p-7 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Vikore Edit</span>
                      <h3 className="mt-3 font-serif text-2xl md:mt-4 md:text-3xl text-ink dark:text-linen">{category}</h3>
                    </div>
                    <span className="tile-arrow mt-1 text-cedar">
                      <ArrowRight size={20} />
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-smoke dark:text-bone">{desc}</p>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>



      {/* Reviews */}
      <ReviewsSection />

      {/* FAQ */}
      <FaqSection />

      {/* Newsletter */}
      <section className="container-premium py-12 md:py-16">
        <ScrollReveal distance={50} duration={900}>
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
        </ScrollReveal>
      </section>
    </>
  );
}

