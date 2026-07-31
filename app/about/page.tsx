import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Instagram, Pin, Facebook } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us | Editorial Interior Design & Mindful Living",
  description:
    "Discover the story behind Vikore Vana — curated by G Randhawa. Explore our passion for serene interiors, small-space innovations, and timeless aesthetic living.",
  openGraph: {
    title: "About Vikore Vana | Curated Home Decor & Interior Living",
    description:
      "Curated interiors, small-space ideas, and timeless furniture edits for a calmer, more beautiful home.",
    url: `${site.url}/about`,
  },
};

const socialPlatforms = [
  {
    platform: "Pinterest",
    handle: "@vikore_vana",
    href: "https://www.pinterest.com/vikore_vana/",
    icon: Pin,
    focus: "Daily Pins",
  },
  {
    platform: "Instagram",
    handle: "@vikore_vana",
    href: "https://www.instagram.com/vikore_vana",
    icon: Instagram,
    focus: "Interior Reels & Edits",
  },
  {
    platform: "Facebook",
    handle: "Vikore Vana",
    href: "https://www.facebook.com/share/1HABJXfXLj/",
    icon: Facebook,
    focus: "Design Community",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#fffaf4] dark:bg-[#181614] text-ink dark:text-linen transition-colors duration-500 min-h-screen selection:bg-[#b89569]/20">
      {/* Editorial Hero Section */}
      <section className="relative pt-10 sm:pt-16 md:pt-20 pb-6 sm:pb-8 overflow-hidden border-b border-[#b89569]/10 dark:border-white/5">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-radial-glow opacity-50 pointer-events-none" />

        <div className="container-premium relative z-10">
          {/* Main Title */}
          <h1 className="text-center font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-ink dark:text-linen leading-[1.14] tracking-tight max-w-3xl mx-auto">
            About{" "}
            <span className="italic font-normal text-[#b89569] dark:text-[#cba677]">
              Vikore Vana
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-8 sm:mt-10 max-w-2xl mx-auto text-center text-base md:text-lg text-smoke dark:text-bone/85 font-light leading-relaxed">
            An interior journal by{" "}
            <span className="font-[family-name:var(--font-tempting)] text-cedar dark:text-[#cba677] text-base md:text-lg font-normal align-middle inline-block px-1">
              G Randhawa
            </span>
            , dedicated to serene, tactile, and intentional living.
          </p>

          {/* Photo Showcase */}
          <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            <div className="md:col-span-7 relative h-80 sm:h-96 md:h-[460px] rounded-3xl overflow-hidden shadow-2xl group border border-black/5 dark:border-white/10">
              <Image
                src="/about-before-after.jpg"
                alt="Vikore Vana Before and After Space Transformation"
                fill
                priority
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[11px] uppercase tracking-[0.25em] font-semibold text-[#cba677]">Space Transformations</span>
                <h3 className="font-serif text-xl sm:text-2xl md:text-3xl mt-1">Before & After Workspace Refinement</h3>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-between gap-6">
              <div className="relative h-52 sm:h-56 md:h-[215px] rounded-3xl overflow-hidden shadow-lg group border border-black/5 dark:border-white/10 shrink-0">
                <Image
                  src="/about-loft-landscape.jpg"
                  alt="Compact Living & Warm Loft Architecture"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#cba677]">Small Space Architecture</span>
                  <p className="font-serif text-base sm:text-lg md:text-xl">Compact Living & Warm Loft Design</p>
                </div>
              </div>

              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#201d1a] border border-[#b89569]/15 dark:border-white/10 shadow-sm flex flex-col justify-between flex-1 relative overflow-hidden">
                <blockquote className="font-serif italic text-base sm:text-lg text-ink dark:text-linen leading-relaxed relative z-10 my-auto">
                  &ldquo;A home shouldn&apos;t feel like a staged showroom, but a sanctuary where your daily life feels restored.&rdquo;
                </blockquote>
                <div className="mt-3 flex items-center justify-between relative z-10 pt-2 border-t border-[#b89569]/10 dark:border-white/5">
                  <span className="font-[family-name:var(--font-tempting)] text-base md:text-lg text-cedar dark:text-[#cba677]">
                    G Randhawa
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-smoke dark:text-bone/60 font-medium">Founder & Editor</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLEAN ABOUT TEXT CONTENT */}
      <section className="pt-8 sm:pt-12 pb-8 sm:pb-12 border-b border-[#b89569]/10 dark:border-white/5">
        <div className="container-premium max-w-3xl mx-auto space-y-12">
          {/* Welcome Section */}
          <div className="space-y-5 text-base md:text-lg text-smoke dark:text-bone/85 leading-relaxed font-light">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen">
              Welcome to <span className="italic text-[#b89569] dark:text-[#cba677]">Vikore Vana</span>
            </h2>

            <p>
              At Vikore Vana, we believe every home has the potential to feel beautiful, comfortable, and uniquely personal.
            </p>

            <p>
              Our goal is to make home decorating simpler by sharing inspiring ideas, practical design tips, and carefully curated product recommendations. Whether you&apos;re furnishing your first apartment, refreshing a single room, or planning a complete home makeover, we aim to provide content that helps you make confident design choices.
            </p>

            <div className="pt-2">
              <p className="font-medium text-ink dark:text-linen mb-3">
                We cover a wide range of topics, including:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-base md:text-lg text-smoke dark:text-bone/85 font-light">
                {[
                  "Home décor inspiration",
                  "Living room, bedroom, kitchen, and bathroom ideas",
                  "Interior design trends",
                  "Small space solutions",
                  "Storage and organisation",
                  "Furniture and décor recommendations",
                  "Seasonal decorating ideas",
                  "Home styling guides",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b89569] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="pt-2">
              Every article is created with the intention of being informative, practical, and visually inspiring.
            </p>
          </div>

          <div className="h-px w-full bg-[#b89569]/20" />

          {/* Mission Section */}
          <div className="space-y-4 text-base md:text-lg text-smoke dark:text-bone/85 leading-relaxed font-light">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen">
              Our Mission
            </h2>
            <p>
              Our mission is to inspire and empower people to create homes they genuinely enjoy living in by providing accessible design ideas, practical decorating advice, and thoughtfully selected products that combine style, comfort, and functionality.
            </p>
            <p>
              We strive to make home inspiration approachable for everyone, regardless of budget or living space.
            </p>
          </div>

          <div className="h-px w-full bg-[#b89569]/20" />

          {/* Vision Section */}
          <div className="space-y-4 text-base md:text-lg text-smoke dark:text-bone/85 leading-relaxed font-light">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen">
              Our Vision
            </h2>
            <p>
              Our vision is to become a trusted online destination for home décor inspiration, where readers can discover timeless ideas, practical solutions, and reliable recommendations that help transform everyday spaces into homes they love.
            </p>
            <p>
              As we grow, we aim to build a community that values creativity, thoughtful design, and making every space feel more welcoming.
            </p>
          </div>

          <div className="h-px w-full bg-[#b89569]/20" />

          {/* Our Values Section */}
          <div className="space-y-6 text-base md:text-lg text-smoke dark:text-bone/85 leading-relaxed font-light">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen">
              Our Values
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <h3 className="font-serif text-lg md:text-xl font-normal text-ink dark:text-linen">
                  Inspiration First
                </h3>
                <p className="text-base md:text-lg text-smoke dark:text-bone/85 font-light leading-relaxed">
                  We believe good design should inspire creativity while remaining practical for everyday living.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg md:text-xl font-normal text-ink dark:text-linen">
                  Quality Content
                </h3>
                <p className="text-base md:text-lg text-smoke dark:text-bone/85 font-light leading-relaxed">
                  We focus on creating helpful, well-researched content that is easy to understand and enjoyable to explore.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg md:text-xl font-normal text-ink dark:text-linen">
                  Honest Recommendations
                </h3>
                <p className="text-base md:text-lg text-smoke dark:text-bone/85 font-light leading-relaxed">
                  When we recommend products, we prioritise relevance and usefulness to help our readers make informed decisions.
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg md:text-xl font-normal text-ink dark:text-linen">
                  Continuous Improvement
                </h3>
                <p className="text-base md:text-lg text-smoke dark:text-bone/85 font-light leading-relaxed">
                  Home design constantly evolves, and so do we. We regularly update our content to reflect new trends, ideas, and products.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-[#b89569]/20" />

          {/* Community Channels (Full-Width Long Horizontal Cards with Full Curve Corners) */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen">
                Community &{" "}
                <span className="italic text-[#b89569] dark:text-[#cba677]">
                  Social Channels
                </span>
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-smoke dark:text-bone/85 font-light mt-2 max-w-xl mx-auto">
                Follow along for daily visual moodboards, styling lookbooks, room makeovers, and interior discussions:
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {socialPlatforms.map((sp) => {
                const Icon = sp.icon;
                return (
                  <div
                    key={sp.platform}
                    className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#201d1a] border border-[#b89569]/20 dark:border-white/10 shadow-xs hover:shadow-md hover:border-[#b89569] transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4 group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#b89569]/10 text-[#b89569] dark:text-[#cba677] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg sm:text-xl font-normal text-ink dark:text-linen truncate">
                          {sp.platform}
                        </h3>
                        <p className="text-xs sm:text-sm md:text-base text-smoke dark:text-bone/85 font-light mt-0.5 line-clamp-1">
                          {sp.focus}
                        </p>
                      </div>
                    </div>

                    <a
                      href={sp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 px-3.5 py-1.5 sm:px-6 sm:py-2.5 rounded-full bg-[#b89569] hover:bg-[#a38259] text-white text-[11px] sm:text-xs uppercase tracking-wider font-medium transition-all duration-300 shadow-sm hover:shadow-md group/btn shrink-0"
                    >
                      <span>Visit</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Sign-off & Call to Action */}
      <section className="pt-6 sm:pt-10 pb-16 sm:pb-20">
        <div className="container-premium max-w-3xl mx-auto">
          <div className="rounded-[36px] p-8 sm:p-12 bg-gradient-to-br from-[#f8f2eb] via-[#fffaf4] to-[#f4ece1] dark:from-[#23201d] dark:via-[#1a1816] dark:to-[#171513] border border-[#b89569]/25 shadow-xl text-center relative overflow-hidden">
            <span className="inline-block p-3.5 rounded-full bg-[#b89569]/10 text-[#b89569] mb-4">
              <Heart className="w-5 h-5" />
            </span>

            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen max-w-md mx-auto">
              Ready to Explore Intentional Interior Living?
            </h2>

            <p className="mt-3 text-base md:text-lg text-smoke dark:text-bone/85 max-w-md mx-auto leading-relaxed font-light">
              Explore our latest curated articles and decor edits to start curating your dream space today.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b89569] hover:bg-[#a38259] text-white text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>Browse Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-[#201d1a] border border-[#b89569]/30 text-ink dark:text-linen hover:border-[#b89569] text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300"
              >
                <span>Get In Touch</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
