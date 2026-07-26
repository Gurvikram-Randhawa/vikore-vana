import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Vikore Vana",
  description: "Terms of Use and Copyright Policy for Vikore Vana.",
};

export default function TermsPage() {
  return (
    <section className="container-premium py-10 sm:py-14 md:py-20">
      {/* Header */}
      <div className="mb-10 sm:mb-14 text-center">
        <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
          <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]">
            Legal Policy
          </p>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink dark:text-linen leading-[1.1]">
          Terms of Use &{" "}
          <span className="italic text-[#b89569] dark:text-[#cba677]">
            Copyright
          </span>
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto prose-vana prose-lg">
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          Welcome to <strong className="text-ink dark:text-linen">Vikore Vana</strong>. 
          By accessing our website, purchasing our products, or downloading our guides, you agree to be bound by the following Terms of Use.
        </p>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          1. Copyright & Intellectual Property
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          All content on this website, including but not limited to styling guides, articles, photographs, videos, logos, and graphics, is the exclusive property of Vikore Vana and is protected by international copyright laws.
        </p>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-4">
          <strong className="text-ink dark:text-linen">You may not:</strong>
        </p>
        <ul className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6 list-disc pl-6 space-y-2">
          <li>Copy, distribute, or reproduce our styling guides or images without explicit written permission.</li>
          <li>Resell, repackage, or commercialize any of our free or paid guides.</li>
          <li>Use our photographs or content on your own website, social media, or marketing materials without proper attribution and prior consent.</li>
        </ul>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          2. Personal Use Only
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          Any guides, PDFs, or materials downloaded from Vikore Vana are for your personal, non-commercial use only. You are granted a limited, revocable, non-exclusive license to view and download these materials for personal inspiration and home styling purposes.
        </p>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          3. Enforcement
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          We take the theft of our intellectual property seriously. Unauthorized use of our images, guides, or text will result in immediate legal action, including but not limited to Digital Millennium Copyright Act (DMCA) takedown notices issued to your web host or Internet Service Provider.
        </p>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          4. Disclaimer
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          Our styling advice and guides are provided for inspirational purposes. We are not liable for any damages, losses, or costs arising from your use of our content or recommendations.
        </p>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          5. Contact Us
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          If you wish to request permission to use our images or content, or if you have any questions regarding these terms, please contact us at{" "}
          <a
            href="mailto:vikorevana@gmail.com"
            className="text-[#b89569] dark:text-[#cba677] underline underline-offset-2 hover:text-[#a38259] transition-colors"
          >
            vikorevana@gmail.com
          </a>.
        </p>

        <div className="mt-12 pt-8 border-t border-black/5 dark:border-white/10">
          <p className="text-smoke dark:text-bone/60 text-sm">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} ·{" "}
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
