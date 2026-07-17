import Link from "next/link";
import { Instagram, Mail, Pin } from "lucide-react";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-10 md:mt-16 border-t border-black/5 bg-linen py-8 md:py-12 dark:border-white/10 dark:bg-[#201d1a]">
      <div className="container-premium grid gap-8 md:gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-serif text-2xl md:text-3xl text-ink dark:text-linen transition-colors duration-300 hover:text-cedar">
            Vikore Vana
          </Link>
          <p className="mt-3 md:mt-4 max-w-sm text-xs md:text-sm leading-relaxed md:leading-7 text-smoke dark:text-bone">
            Curated interiors, small-space ideas, and furniture edits for a calmer, more beautiful home.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cedar">Explore</p>
          <div className="grid gap-3">
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} className="link-underline w-fit text-xs md:text-sm text-smoke hover:text-ink dark:text-bone dark:hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-cedar">Social</p>
          <div className="flex gap-3">
            {[
              { Icon: Instagram, href: "https://www.instagram.com/vikore_vana", label: "Instagram" },
              { Icon: Pin, href: "https://www.pinterest.com/vikore_vana/", label: "Pinterest" },
              { Icon: Mail, href: "mailto:vikorevana@gmail.com", label: "Email" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-11 place-items-center rounded-full bg-white text-ink shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md hover:bg-cedar hover:text-white dark:bg-white/10 dark:text-linen dark:hover:bg-cedar"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* Bottom bar — legal links */}
      <div className="container-premium mt-8 md:mt-10 pt-6 border-t border-black/5 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[11px] text-smoke dark:text-bone/50">
          &copy; {new Date().getFullYear()} Vikore Vana. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-4 sm:gap-6">
          <Link href="/disclosure" className="text-[11px] text-smoke dark:text-bone/50 hover:text-ink dark:hover:text-white transition-colors underline-offset-2 hover:underline">
            Affiliate Disclosure
          </Link>
          <Link href="/privacy" className="text-[11px] text-smoke dark:text-bone/50 hover:text-ink dark:hover:text-white transition-colors underline-offset-2 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}

