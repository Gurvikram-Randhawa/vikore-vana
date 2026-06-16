import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/content";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group card-hover-glow flex flex-col h-full overflow-hidden rounded-xl border border-black/5 bg-white shadow-soft dark:border-white/10 dark:bg-white/5">
      <div className="relative aspect-[5/4] bg-white overflow-hidden">
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-contain p-4 transition duration-700 group-hover:scale-105" />
        {/* Subtle bottom gradient for depth */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
      </div>
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <p className="mb-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-cedar">{product.category}</p>
        <h3 className="font-serif text-xl md:text-2xl leading-tight text-ink dark:text-linen line-clamp-2">{product.name}</h3>
        <p className="mt-2 md:mt-3 text-xs md:text-sm leading-relaxed text-smoke dark:text-bone line-clamp-3">{product.description}</p>
        <div className="mt-auto pt-4 md:pt-5">
          <a href={product.affiliate} target="_blank" rel="nofollow sponsored noopener noreferrer" className="btn-shimmer inline-flex min-h-10 md:min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-xs md:text-sm font-medium text-white transition hover:bg-cedar dark:bg-linen dark:text-ink w-full sm:w-fit">
            <ShoppingBag size={17} />
            View Product
          </a>
        </div>
      </div>
    </article>
  );
}
