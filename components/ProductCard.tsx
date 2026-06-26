import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/content";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col h-full overflow-hidden rounded-2xl border border-[#b8935a]/20 dark:border-[#b8935a]/15 shadow-[0_4px_16px_rgba(184,147,90,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(184,147,90,0.14)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:-translate-y-1.5 transition-all duration-500">
      <div className="relative aspect-[5/4] md:aspect-[4/3] bg-white overflow-hidden border-b border-[#b8935a]/10 dark:border-[#b8935a]/10">
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-contain p-4 md:p-6 transition duration-700 group-hover:scale-105" />
        {/* Subtle bottom gradient for depth */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
      </div>
      <div className="p-5 md:p-7 flex flex-col flex-grow bg-white/60 dark:bg-[#1e1a17]/70 backdrop-blur-xl">
        <p className="mb-2 text-[10px] md:text-[11.5px] tracking-[2px] uppercase text-[#b8935a] dark:text-[#cba677]/70 font-semibold">{product.category}</p>
        <h3 className="font-serif text-lg md:text-2xl font-medium leading-snug text-[#1c1c1c] dark:text-[#fdf6f0] line-clamp-2">{product.name}</h3>
        <p className="mt-2 text-[13px] md:text-[15.5px] leading-relaxed text-[#66615b] dark:text-bone/70 line-clamp-3 font-light">{product.description}</p>
        <div className="mt-auto pt-5 md:pt-7">
          <a href={product.affiliate} target="_blank" rel="nofollow sponsored noopener noreferrer" className="inline-flex min-h-10 md:min-h-12 items-center justify-center gap-2 rounded-full bg-[#b85c37] text-white dark:bg-[#c8653b] font-sans text-xs md:text-sm font-semibold uppercase tracking-[1.5px] transition-all duration-300 hover:bg-[#9a4d2c] dark:hover:bg-[#b0532b] hover:shadow-[0_4px_12px_rgba(184,92,55,0.25)] w-full">
            <ShoppingBag size={15} />
            View Product
          </a>
        </div>
      </div>
    </article>
  );
}
