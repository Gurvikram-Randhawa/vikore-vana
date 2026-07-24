import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Vikore Vana's privacy policy — how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <section className="container-premium py-10 sm:py-14 md:py-20">
      {/* Header */}
      <div className="mb-10 sm:mb-14 text-center">
        <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
          <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
          <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]">
            Your Privacy
          </p>
          <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink dark:text-linen leading-[1.1]">
          Privacy{" "}
          <span className="italic text-[#b89569] dark:text-[#cba677]">
            Policy
          </span>
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto prose-vana prose-lg">
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          At <strong className="text-ink dark:text-linen">Vikore Vana</strong> (operated by Gurvikram Randhawa),
          your privacy is important to us. This policy explains what information
          we collect, how we use it, and your rights regarding that data.
        </p>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          Information We Collect
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-4">
          We collect minimal information to improve your experience:
        </p>
        <ul className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6 list-disc pl-6 space-y-2">
          <li>
            <strong className="text-ink dark:text-linen">
              Analytics data:
            </strong>{" "}
            We use Google Analytics to understand how visitors interact with our
            site (pages viewed, time spent, general location). This data is
            aggregated and anonymous.
          </li>
          <li>
            <strong className="text-ink dark:text-linen">
              Newsletter subscriptions:
            </strong>{" "}
            If you subscribe to our newsletter, we collect your email address
            solely to send you our curated content. You can unsubscribe at any
            time.
          </li>
          <li>
            <strong className="text-ink dark:text-linen">Cookies:</strong> We
            use essential cookies for site functionality and analytics cookies
            via Google Analytics. No personal data is sold or shared with third
            parties for marketing purposes.
          </li>
        </ul>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          How We Use Your Information
        </h2>
        <ul className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6 list-disc pl-6 space-y-2">
          <li>To improve our content and user experience</li>
          <li>To send newsletters (only if you have opted in)</li>
          <li>To analyze site traffic and usage patterns</li>
          <li>We do not sell, trade, or share your personal data with third parties</li>
        </ul>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          Affiliate Links
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          Our site contains affiliate links to products on Amazon and other
          retailers. When you click these links, the retailer may place cookies
          on your browser to track referrals. This is standard practice for
          affiliate programs and does not give us access to your personal
          information. For more details, see our{" "}
          <Link
            href="/disclosure"
            className="text-[#b89569] dark:text-[#cba677] underline underline-offset-2 hover:text-[#a38259] transition-colors"
          >
            Affiliate Disclosure
          </Link>
          .
        </p>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          Third-Party Services
        </h2>
        <ul className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6 list-disc pl-6 space-y-2">
          <li>
            <strong className="text-ink dark:text-linen">
              Google Analytics:
            </strong>{" "}
            Collects anonymized usage data. You can opt out using the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#b89569] dark:text-[#cba677] underline underline-offset-2 hover:text-[#a38259] transition-colors"
            >
              Google Analytics opt-out browser add-on
            </a>
            .
          </li>
          <li>
            <strong className="text-ink dark:text-linen">
              Amazon Associates:
            </strong>{" "}
            Affiliate tracking via Amazon cookies when you click product links.
          </li>
          <li>
            <strong className="text-ink dark:text-linen">Pinterest:</strong> If
            you use the &ldquo;Save&rdquo; button on our articles, Pinterest&apos;s own
            privacy policy governs that interaction.
          </li>
        </ul>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          Your Rights (GDPR)
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-4">
          Under the General Data Protection Regulation (GDPR) and other applicable laws, you have the following rights regarding your personal data:
        </p>
        <ul className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6 list-disc pl-6 space-y-2">
          <li><strong className="text-ink dark:text-linen">Right to access:</strong> You can request a copy of the personal data we hold about you.</li>
          <li><strong className="text-ink dark:text-linen">Right to rectification:</strong> You can request that we correct any inaccurate or incomplete personal data.</li>
          <li><strong className="text-ink dark:text-linen">Right to erasure:</strong> You can request that we delete your personal data (also known as the "right to be forgotten").</li>
          <li><strong className="text-ink dark:text-linen">Right to restrict processing:</strong> You can request that we restrict the processing of your personal data under certain conditions.</li>
          <li><strong className="text-ink dark:text-linen">Right to data portability:</strong> You can request that we transfer your data to another organization or directly to you.</li>
          <li><strong className="text-ink dark:text-linen">Right to lodge a complaint:</strong> You have the right to lodge a complaint with a supervisory authority if you believe your data privacy rights have been violated.</li>
        </ul>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-4">
          In addition to these rights, you may also:
        </p>
        <ul className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6 list-disc pl-6 space-y-2">
          <li>Unsubscribe from our newsletter at any time.</li>
          <li>Clear or block cookies via your browser settings or our cookie consent banner.</li>
        </ul>

        <h2 className="font-serif text-2xl text-ink dark:text-linen mt-10 mb-4">
          Contact Us
        </h2>
        <p className="text-smoke dark:text-bone/80 text-base leading-relaxed mb-6">
          If you have any questions about this privacy policy, please contact us
          at{" "}
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
              href="/disclosure"
              className="text-[#b89569] dark:text-[#cba677] underline underline-offset-2 hover:text-[#a38259] transition-colors"
            >
              Affiliate Disclosure
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
