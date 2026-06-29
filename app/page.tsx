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
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink dark:text-linen leading-[1.1] mb-4">
                Trending <span className="italic text-[#b89569] dark:text-[#cba677]">Products</span>
              </h2>
              <p className="text-[#9c8b7a] dark:text-bone/80 text-sm max-w-sm mx-auto">
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

      {/* Reviews */}
      <ReviewsSection />

      {/* FAQ */}
      <FaqSection />

      {/* Newsletter — Weekly Note */}
      <section className="relative overflow-hidden py-16 sm:py-20 md:py-28">
        {/* Warm gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf3e7] via-[#fef8f0] to-[#f9efe2] dark:from-[#1e1812] dark:via-[#211d17] dark:to-[#1a1510]" />
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #b8935a 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        {/* Top + bottom gold border lines */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#b8935a]/40 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#b8935a]/40 to-transparent" />

        <div className="relative container-premium">
          <ScrollReveal distance={40} duration={900}>
            <div className="grid md:grid-cols-[1fr_1.1fr] gap-12 md:gap-16 lg:gap-24 items-center">

              {/* Left — Editorial copy */}
              <div className="text-left">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-10 bg-[#b8935a]/50" />
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.32em] text-[#b8935a] dark:text-[#cba677]">The Weekly Note</p>
                  <div className="h-px w-10 bg-[#b8935a]/50" />
                </div>
                <h2 className="text-center font-serif text-4xl sm:text-5xl lg:text-6xl text-ink dark:text-linen leading-[1.08] mb-6">
                  Calm edits.<br />
                  <span className="italic text-[#b89569] dark:text-[#cba677]">Clever layouts.</span>
                </h2>
                <p className="text-[#66615b] dark:text-bone/70 text-base sm:text-lg leading-relaxed font-light max-w-sm mb-8">
                  Curated pieces worth pinning and aesthetic living inspiration — delivered to your inbox every Sunday morning.
                </p>
                {/* Small trust signals */}
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {["No spam, ever", "Unsubscribe anytime", "1K+ readers"].map((item) => (
                    <span key={item} className="flex items-center gap-1.5 text-[11px] font-medium text-[#9c8b7a] dark:text-bone/50 uppercase tracking-wider">
                      <span className="w-1 h-1 rounded-full bg-[#b8935a]/60 dark:bg-[#cba677]/50 inline-block" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right — Glassmorphism subscription card */}
              <div className="relative rounded-3xl p-8 sm:p-10 bg-white/60 dark:bg-[#1e1a17]/70 backdrop-blur-xl border border-[#b8935a]/20 dark:border-white/8 shadow-[0_16px_48px_rgba(184,147,90,0.12),0_4px_16px_rgba(184,147,90,0.06)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                {/* Corner ornament */}
                <div className="absolute top-5 right-5 w-16 h-16 opacity-[0.06] dark:opacity-[0.08]">
                  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="32" cy="32" r="31" stroke="#b8935a" strokeWidth="1" />
                    <circle cx="32" cy="32" r="20" stroke="#b8935a" strokeWidth="1" />
                    <line x1="32" y1="1" x2="32" y2="63" stroke="#b8935a" strokeWidth="0.5" />
                    <line x1="1" y1="32" x2="63" y2="32" stroke="#b8935a" strokeWidth="0.5" />
                  </svg>
                </div>

                <p className="font-serif text-2xl sm:text-3xl text-ink dark:text-linen mb-2 leading-snug">Join the circle.</p>
                <p className="text-[#9c8b7a] dark:text-bone/60 text-sm mb-8 leading-relaxed">One beautifully curated email, every Sunday.</p>

                <NewsletterForm />
              </div>

            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Values / Approach */}
      <CoreValues />
    </>
  );
}

