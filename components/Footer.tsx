import Link from "next/link";
import { Instagram, Mail, Pin } from "lucide-react";
import { Great_Vibes } from "next/font/google";
import { site } from "@/lib/site";

const signatureFont = Great_Vibes({ weight: "400", subsets: ["latin"], display: "swap" });

export function Footer() {
  return (
    <footer className="mt-16 md:mt-24 border-t border-black/5 bg-linen py-8 md:py-12 dark:border-white/10 dark:bg-[#201d1a]">
      <div className="container-premium grid gap-8 md:gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-serif text-2xl md:text-3xl text-ink dark:text-linen transition-colors duration-300 hover:text-cedar">
            Vikore Vana
          </Link>
          <div className={`mt-1 text-xl md:text-2xl text-cedar ${signatureFont.className}`}>
            G Randhawa
          </div>
          <p className="mt-3 md:mt-4 max-w-sm text-xs md:text-sm leading-relaxed md:leading-7 text-smoke dark:text-bone">
            Curated interiors, small-space ideas, and affiliate furniture edits for a calmer, more beautiful home.
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
            {[Instagram, Pin, Mail].map((Icon, index) => (
              <span key={index} className="grid size-11 place-items-center rounded-full bg-white text-ink shadow-sm transition-all duration-300 hover:scale-110 hover:shadow-md hover:bg-cedar hover:text-white dark:bg-white/10 dark:text-linen dark:hover:bg-cedar cursor-pointer">
                <Icon size={18} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
