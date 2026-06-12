import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/content";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-black/5 bg-white shadow-soft transition duration-300 hover:-translate-y-1 dark:border-white/10 dark:bg-white/5">
      <div className="relative aspect-[4/3] bg-bone">
        <Image src={product.image} alt={product.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cedar">{product.category}</p>
        <h3 className="font-serif text-2xl leading-tight text-ink dark:text-linen">{product.name}</h3>
        <p className="mt-3 text-sm leading-7 text-smoke dark:text-bone">{product.description}</p>
        <a href={product.affiliate} target="_blank" rel="nofollow sponsored noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-medium text-white transition hover:bg-cedar dark:bg-linen dark:text-ink">
          <ShoppingBag size={17} />
          View Product
        </a>
      </div>
    </article>
  );
}
