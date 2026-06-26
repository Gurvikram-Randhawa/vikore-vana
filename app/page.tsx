import Link from "next/link";
import { FurnishEasyHero } from "@/components/FurnishEasyHero";
import { CoreValues } from "@/components/CoreValues";
import { FaqSection } from "@/components/FaqSection";
import { FeaturedArticlesList } from "@/components/FeaturedArticlesList";
import { FeaturedCategories } from "@/components/FeaturedCategories";
import { TrendingProductsCarousel } from "@/components/TrendingProductsCarousel";
import { NewsletterForm } from "@/components/NewsletterForm";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { getArticles, getProducts } from "@/lib/content";
import { site } from "@/lib/site";


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

      {/* Featured Articles */}
      <section className="container-premium py-10 sm:py-14 md:py-16">
        <ScrollReveal>
          <div className="mb-10 sm:mb-12 md:mb-14 text-center">
            <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
              <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]">
                Latest Guides
              </p>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink dark:text-linen leading-[1.1]">
              Featured <span className="italic text-[#b89569] dark:text-[#cba677]">Articles</span>
            </h2>
          </div>
        </ScrollReveal>
        <FeaturedArticlesList articles={sortedArticles} />
      </section>

      {/* Trending Products */}
      <section className="py-10 sm:py-14 md:py-16 overflow-x-hidden w-full">
        <div className="container-premium">
          <ScrollReveal>
            <div className="mb-10 sm:mb-12 md:mb-14 text-center">
              <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
                <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
                <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]">
                  Curated Finds
                </p>
                <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink dark:text-linen leading-[1.1] mb-4 sm:mb-5">
                Trending <span className="italic text-[#b89569] dark:text-[#cba677]">Products</span>
              </h2>
              <p className="text-smoke dark:text-bone/80 text-sm sm:text-base leading-relaxed max-w-md mx-auto font-light">
                Handpicked pieces that balance beauty and purpose.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Carousel Strip - edge-to-edge */}
        <div className="w-full overflow-x-hidden">
          <ScrollReveal delay={200} distance={60}>
            <TrendingProductsCarousel products={products} />
          </ScrollReveal>
        </div>

        {/* Below Carousel Link */}
        <div className="container-premium mt-10">
          <ScrollReveal delay={300}>
            <div className="flex justify-center">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 h-11 px-8 rounded-full 
                  border border-[#b8935a] text-[#b8935a] font-sans text-xs font-semibold uppercase tracking-[2px]
                  transition-all duration-300 hover:bg-[#b8935a] hover:text-white hover:shadow-[0_4px_14px_rgba(184,147,90,0.25)]"
              >
                Shop All Products
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Featured Categories */}
      <FeaturedCategories categories={site.categoryTiles} />

      {/* Core Values */}
      <CoreValues />



      {/* Reviews */}
      <ReviewsSection />

      {/* FAQ */}
      <FaqSection />

      {/* Newsletter */}
      <section className="container-premium py-10 sm:py-14 md:py-16">
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

