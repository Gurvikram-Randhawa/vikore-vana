import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Vikore Vana's affiliate disclosure — how we earn commissions through product links at no extra cost to you.",
};

export default function DisclosurePage() {
  return (
    <section className="container-premium py-10 sm:py-14 md:py-20">
      {/* Header */}
      <div className="mb-10 sm:mb-14 text-center">
        <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
          <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]">
            Transparency
          </p>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink dark:text-linen leading-[1.1]">
          Affiliate{" "}
          <span className="italic text-[#b89569] dark:text-[#cba677]">
            Disclosure
          </span>
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto prose-vana prose-lg">
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          At <strong className="text-ink dark:text-linen">Vikore Vana</strong>,
          transparency is important to us. This page explains how we fund our
          content and keep this platform running.
        </p>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          How We Earn
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          Some of the links on this website are affiliate links, meaning that at
          no additional cost to you, we may earn a small commission if you click
          through and make a purchase. These commissions help us maintain the
          site, create original content, and continue curating products we
          genuinely believe in.
        </p>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          Our Promise
        </h2>
        <ul className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6 list-disc pl-6 space-y-2">
          <li>
            We only recommend products we have personally researched and believe
            will add value to your home.
          </li>
          <li>
            Affiliate partnerships never influence our editorial opinions or
            product selections.
          </li>
          <li>
            You will never pay more for a product because you clicked an
            affiliate link on our site — the price is exactly the same.
          </li>
        </ul>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          Affiliate Partners
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          We are a participant in the Amazon Services LLC Associates Program, an
          affiliate advertising program designed to provide a means for sites to
          earn advertising fees by advertising and linking to{" "}
          <strong className="text-ink dark:text-linen">Amazon.com</strong> and
          affiliated sites.
        </p>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          Questions?
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          If you have any questions about our affiliate relationships, feel free
          to reach out at{" "}
          <a
            href="mailto:vikorevana@gmail.com"
            className="text-[#b89569] dark:text-[#cba677] underline underline-offset-2 hover:text-[#a38259] transition-colors"
          >
            vikorevana@gmail.com
          </a>
          .
        </p>

        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/10">
          <p className="text-smoke dark:text-bone/60 text-sm">
            Last updated: July 2026 ·{" "}
            <Link
              href="/privacy"
              className="text-[#b89569] dark:text-[#cba677] underline underline-offset-2 hover:text-[#a38259] transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
