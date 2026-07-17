import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/content";

export function ProductCard({ product, solidBackground, showBadge }: { product: Product, solidBackground?: boolean, showBadge?: boolean }) {
  // Deterministically halve the number of "Editor's Pick" badges
  const hash = product.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const defaultShowBadge = product.featured && (hash % 2 === 0);
  const displayBadge = showBadge !== undefined ? showBadge : defaultShowBadge;

  return (
    <article className="group flex flex-col h-full overflow-hidden rounded-2xl bg-white dark:bg-[#1e1a17] border border-[#b8935a]/20 dark:border-[#b8935a]/15 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_16px_40px_rgba(184,149,105,0.2)] dark:hover:shadow-[0_16px_40px_rgba(203,166,119,0.25)] hover:-translate-y-1.5 transition-all duration-500">
      {/* Image Area — solid white to anchor the product */}
      <div className="relative aspect-square bg-white overflow-hidden shrink-0">
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 50vw" className="object-contain p-3 md:p-5 transition-transform duration-700 ease-out group-hover:scale-[1.06]" />

        {/* Editor's Pick badge */}
        {displayBadge && (
          <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 z-10 flex items-center justify-center px-2 py-[3px] sm:px-2.5 sm:py-1 rounded-full bg-white/75 backdrop-blur-xl border border-[#b89569]/20">
            <span className="font-sans text-[7px] sm:text-[8px] tracking-[1px] uppercase text-[#9c8b7a] font-medium leading-none">Editor&apos;s Pick</span>
          </div>
        )}

        {/* Floating action icon on hover */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 dark:bg-[#1e1a17]/90 border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <ArrowUpRight size={13} className="text-[#b89569] dark:text-[#cba677]" />
        </div>
      </div>

      {/* Content Area — matching ArticleCard style */}
      <div className="p-2.5 sm:p-4 md:p-5 flex flex-col flex-grow border-t border-[#b8935a]/20 dark:border-[#b8935a]/15 bg-[#fdf6f0]/70 dark:bg-[#25211e]/70 backdrop-blur-sm transition-colors duration-500">
        {/* Category */}
        <div className="flex items-center justify-between mb-1.5 gap-2">
          <p className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[1.5px] uppercase text-[#9c8b7a] dark:text-[#cba677]/80 font-bold truncate">{product.category}</p>
        </div>

        {/* Product Name */}
        <h3 className="font-serif text-[12px] sm:text-[14px] md:text-[16px] font-medium leading-snug text-[#1c1c1c] dark:text-[#fdf6f0] line-clamp-2">{product.name}</h3>

        {/* Shop Button + Affiliate Notice */}
        <div className="mt-auto pt-2.5 sm:pt-3 md:pt-4 flex flex-col items-center gap-1.5">
          <a href={product.affiliate} target="_blank" rel="nofollow sponsored noopener noreferrer" className="group/btn inline-flex items-center justify-center gap-1.5 rounded-full bg-[#b89569] text-white dark:bg-[#cba677] dark:text-[#1c1c1c] font-sans text-[9px] sm:text-[10px] md:text-[11px] font-semibold uppercase tracking-[1.5px] px-6 sm:px-8 py-[9px] sm:py-[10px] shadow-[0_4px_14px_rgba(184,149,105,0.35)] hover:shadow-[0_8px_24px_rgba(184,149,105,0.5)] hover:-translate-y-0.5 transition-all duration-300 hover:bg-[#a38259] dark:hover:bg-[#b89569] dark:hover:text-white">
            Shop Now
          </a>
          <span className="text-[7px] sm:text-[8px] text-[#9c8b7a]/70 dark:text-bone/40 tracking-wide">Affiliate link</span>
        </div>
      </div>
    </article>
  );
}
