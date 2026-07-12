import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/content";

export function ProductCard({ product, solidBackground }: { product: Product, solidBackground?: boolean }) {
  // Generate a consistent pseudo-random rating based on the product slug
  const hash = product.slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // 10% chance of a perfect 5.0, otherwise 4.5 to 4.9
  const isPerfect = hash % 10 === 0;
  const rating = isPerfect ? "5.0" : (4.5 + (hash % 5) * 0.1).toFixed(1);

  return (
    <article className="group flex flex-col h-full overflow-hidden rounded-2xl border border-[#b8935a]/20 dark:border-[#b8935a]/15 shadow-[0_4px_16px_rgba(184,147,90,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(184,147,90,0.14)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:-translate-y-1.5 transition-all duration-500">
      <div className="relative aspect-square bg-white overflow-hidden border-b border-[#b8935a]/10 dark:border-[#b8935a]/10">
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-contain p-2 md:p-4 transition duration-700 group-hover:scale-105" />
        {/* Subtle bottom gradient for depth */}
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
      </div>
      <div className={`p-2.5 sm:p-4 md:p-5 flex flex-col flex-grow ${solidBackground ? 'bg-white dark:bg-[#1e1a17]' : 'bg-white/60 dark:bg-[#1e1a17]/70 backdrop-blur-xl'}`}>
        <div className="flex items-center justify-between mb-1 md:mb-1.5">
          <p className="text-[8.5px] sm:text-[9.5px] md:text-[10.5px] tracking-[1.5px] uppercase text-[#b8935a] dark:text-[#cba677]/70 font-semibold">{product.category}</p>
          <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] md:text-[11px] font-medium text-[#1c1c1c] dark:text-bone/80">
            <span className="text-[#b8935a] dark:text-[#cba677] text-[10px] sm:text-[12px]">★</span> {rating}
          </div>
        </div>
        <h3 className="font-serif text-[13px] sm:text-[15px] md:text-lg font-medium leading-snug text-[#1c1c1c] dark:text-[#fdf6f0] line-clamp-2">{product.name}</h3>
        <div className="mt-auto pt-3 md:pt-4">
          <a href={product.affiliate} target="_blank" rel="nofollow sponsored noopener noreferrer" className="inline-flex min-h-8 sm:min-h-9 md:min-h-10 items-center justify-center gap-1.5 sm:gap-2 rounded-full bg-[#b89569] text-white font-sans text-[9px] sm:text-[10px] md:text-xs font-semibold uppercase tracking-[1.5px] transition-all duration-300 hover:bg-[#a38259] hover:shadow-[0_4px_14px_rgba(184,149,105,0.35)] w-full px-2">
            <ShoppingBag className="w-3 h-3 sm:w-[15px] sm:h-[15px]" />
            <span>Shop Now</span>
          </a>
        </div>
      </div>
    </article>
  );
}
