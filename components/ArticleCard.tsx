import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/content";

export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <article className="group">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className={`img-zoom-container relative overflow-hidden rounded-lg bg-bone ${large ? "aspect-[4/3]" : "aspect-[5/4]"}`}>
          <Image src={article.cover} alt="" fill sizes={large ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"} className="object-cover transition duration-700 group-hover:scale-105" />
          {/* Subtle gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </div>
        <div className="mt-3 md:mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cedar">{article.category}</p>
          <h3 className={`${large ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"} font-serif leading-tight text-ink dark:text-linen`}>{article.title}</h3>
          <p className="mt-2 md:mt-3 line-clamp-3 text-xs md:text-sm leading-relaxed md:leading-7 text-smoke dark:text-bone">{article.description}</p>
          <span className="link-underline mt-4 md:mt-5 inline-flex items-center gap-2 text-xs md:text-sm font-medium text-ink dark:text-linen">
            Read More <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
