export function MarqueeText() {
  const keywords = [
    "TIMELESS DESIGN",
    "ORGANIC MATERIALS",
    "CURATED LIVING",
    "MINIMALIST AESTHETICS",
    "QUIET LUXURY"
  ];

  // We duplicate the keywords list to create a seamless infinite scroll effect
  const repeatedKeywords = [...keywords, ...keywords, ...keywords];

  return (
    <section className="overflow-hidden bg-[#b89569] dark:bg-[#cba677] py-4 sm:py-6 relative flex items-center">
      <div className="flex w-full whitespace-nowrap animate-marquee">
        <div className="flex items-center">
          {repeatedKeywords.map((word, idx) => (
            <div key={idx} className="flex items-center">
              <span className="mx-6 text-xl sm:text-2xl md:text-3xl font-serif italic tracking-widest text-[#fffaf4] dark:text-[#181614]">
                {word}
              </span>
              <span className="text-[#fffaf4]/60 dark:text-[#181614]/60 text-lg">✦</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Second identical block to ensure continuous scroll without gap */}
      <div className="flex w-full whitespace-nowrap animate-marquee absolute top-0 left-full h-full items-center">
        <div className="flex items-center">
          {repeatedKeywords.map((word, idx) => (
            <div key={`dup-${idx}`} className="flex items-center">
              <span className="mx-6 text-xl sm:text-2xl md:text-3xl font-serif italic tracking-widest text-[#fffaf4] dark:text-[#181614]">
                {word}
              </span>
              <span className="text-[#fffaf4]/60 dark:text-[#181614]/60 text-lg">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
