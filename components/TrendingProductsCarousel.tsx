"use client";

import Image from "next/image";
import type { Product } from "@/lib/content";

function getShortName(name: string) {
  let short = name.split(/[,\-|(|;]/)[0].trim();
  const words = short.split(/\s+/);
  if (words.length > 4) {
    short = words.slice(0, 4).join(" ");
  }
  return short;
}

export function TrendingProductsCarousel({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="w-full py-12 text-center text-smoke dark:text-bone/60">
        No products found.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden relative">
      {/* Carousel Container */}
      <div
        className="w-full overflow-x-auto py-10 flex gap-4 px-4 sm:px-6 md:px-10 no-scrollbar snap-x snap-mandatory"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {products.map((product, i) => {
          const shortName = getShortName(product.name);
          return (
            <a
              key={`${product.slug}-${i}`}
              href={product.affiliate}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="block shrink-0 border border-[#b8935a]/20 dark:border-[#b8935a]/15 w-[190px] md:w-[320px] h-[345px] md:h-[480px] snap-center hover:-translate-y-1 transition-transform duration-300"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
              }}
            >
              <div className="flex flex-col h-full pointer-events-none">
                {/* 1. PRODUCT IMAGE */}
                <div className="relative bg-white flex items-center justify-center border-b border-[#b8935a]/10 dark:border-[#b8935a]/10 h-[160px] md:h-[260px] p-3 md:p-5 shrink-0">
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(min-width: 768px) 320px, 190px"
                      className="object-contain"
                      draggable={false}
                    />
                  </div>
                </div>

                {/* GLASSMORPHISM WRAPPER FOR TEXT */}
                <div className="flex flex-col flex-grow justify-between bg-white/80 dark:bg-[#1e1a17]/90 backdrop-blur-xl pb-3">
                  <div>
                    {/* 2. CATEGORY LABEL */}
                    <p className="font-sans font-medium uppercase text-[#b8935a] text-[9.5px] md:text-[11px] tracking-[1.5px] px-3.5 pt-3 md:pt-4 pb-1">
                      {product.category}
                    </p>

                    {/* 3. PRODUCT NAME */}
                    <h3 className="font-serif font-medium text-[#1c1c1c] dark:text-[#fdf6f0] leading-tight line-clamp-2 px-3.5 mt-1 sm:mt-1.5 text-[15px] md:text-[18px]">
                      {shortName}
                    </h3>

                    {/* 4. PRODUCT DESCRIPTION */}
                    <p className="font-sans text-[11px] md:text-[12.5px] leading-normal text-[#66615b] dark:text-bone/60 line-clamp-2 px-3.5 mt-2 md:mt-2.5">
                      {product.description}
                    </p>
                  </div>

                  {/* 5. VIEW PRODUCT BUTTON (styled div) */}
                  <div className="mx-3.5 h-8 md:h-9.5 rounded-full bg-[#b85c37] text-white dark:bg-[#c8653b] font-sans text-[10px] md:text-[11.5px] font-semibold uppercase tracking-[1.5px] flex items-center justify-center pointer-events-auto">
                    View Product
                  </div>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
