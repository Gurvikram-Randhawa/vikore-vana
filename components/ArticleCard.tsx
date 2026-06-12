import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/content";

export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  return (
    <article className="group">
      <Link href={`/articles/${article.slug}`} className="block">
        <div className={`relative overflow-hidden rounded-lg bg-bone ${large ? "aspect-[4/3]" : "aspect-[5/4]"}`}>
          <Image src={article.cover} alt="" fill sizes={large ? "(min-width: 768px) 55vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"} className="object-cover transition duration-700 group-hover:scale-105" />
        </div>
        <div className="mt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-cedar">{article.category}</p>
          <h3 className={`${large ? "text-4xl" : "text-2xl"} font-serif leading-tight text-ink dark:text-linen`}>{article.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-smoke dark:text-bone">{article.description}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink dark:text-linen">
            Read More <ArrowUpRight size={16} />
          </span>
        </div>
      </Link>
    </article>
  );
}
