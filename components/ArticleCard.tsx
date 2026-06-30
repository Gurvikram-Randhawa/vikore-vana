import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/content";
import { ParallaxImage } from "@/components/ParallaxImage";

export function ArticleCard({ article, large = false }: { article: Article; large?: boolean }) {
  // Format date beautifully (e.g. Oct 24, 2023)
  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  // Compute dynamic reading time based on words count (200 wpm average)
  const wordsPerMinute = 200;
  const words = article.body ? article.body.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(words / wordsPerMinute));

  return (
    <article className="group flex flex-col h-full bg-[#fdf6f0]/70 dark:bg-[#25211e]/70 backdrop-blur-sm border border-[#b8935a]/20 dark:border-[#b8935a]/15 rounded-2xl shadow-[0_4px_16px_rgba(184,147,90,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(184,147,90,0.14)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.35)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden">
      <Link href={`/articles/${article.slug}`} className="flex flex-col h-full">
        {/* Cinematic Cover Image */}
        <div className={`relative overflow-hidden w-full ${large ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[4/3] sm:aspect-[16/11]"} bg-bone/35 dark:bg-black/10 border-b border-[#b8935a]/10 dark:border-[#b8935a]/10`}>
          <ParallaxImage
            src={article.cover}
            alt=""
            sizes={large ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
            className="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
            speed={0.12}
          />
          {/* Elegant Category Badge */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-[#fdf6f0]/95 dark:bg-[#25211e]/95 border border-[#b8935a]/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full shadow-[0_2px_8px_rgba(184,147,90,0.12)] transition-colors duration-300 flex items-center justify-center">
            <span className="font-sans text-[8px] sm:text-[9px] tracking-[2px] uppercase text-[#b8935a] dark:text-[#cba677] font-bold leading-none mt-[1px]">
              {article.category}
            </span>
          </div>

          {/* Floating Action Circle (Hover triggered) */}
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fdf6f0]/95 dark:bg-[#25211e]/95 border border-[#b8935a]/30 flex items-center justify-center shadow-md transition-all duration-300 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight size={14} className="text-[#b85c37] dark:text-[#c8653b] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Card Body Contents */}
        <div className="flex flex-col flex-grow p-4 sm:p-5 md:p-6">
          {/* Metadata Row */}
          <div className="flex items-center gap-2 text-[#9c8b7a] dark:text-[#cba677]/60 text-[9px] sm:text-[11px] font-sans font-medium uppercase tracking-widest mb-2 sm:mb-3">
            {formattedDate && (
              <>
                <span>{formattedDate}</span>
                <span className="h-1 w-1 rounded-full bg-[#b8935a]/30" />
              </>
            )}
            <span>{readingTime} min read</span>
          </div>

          {/* Title */}
          <h3
            className={`font-serif font-medium text-[#1c1c1c] dark:text-[#fdf6f0] transition-colors duration-400 leading-snug ${
              large ? "text-[17px] sm:text-xl md:text-2xl lg:text-[27px]" : "text-base sm:text-lg md:text-xl lg:text-2xl"
            }`}
          >
            {article.title}
          </h3>

          {/* Description */}
          <p className="mt-2 sm:mt-3 text-[#66615b] dark:text-bone/70 font-sans text-[12px] sm:text-[13px] md:text-[14px] leading-relaxed line-clamp-2 sm:line-clamp-3 font-light">
            {article.description}
          </p>
        </div>
      </Link>
    </article>
  );
}

