"use client";

import { useState, useRef } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { BeforeAfterImage } from './BeforeAfterImage';
import { ScrollReveal } from './ScrollReveal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const categories = [
  { id: 'living', name: 'Living Room', before: '/images/before-after/living-before.jpg', after: '/images/before-after/living-after.jpg' },
  { id: 'bedroom', name: 'Bedroom', before: '/images/before-after/bedroom-before.jpg', after: '/images/before-after/bedroom-after.jpg' },
  { id: 'kitchen', name: 'Kitchen', before: '/images/before-after/kitchen-before.jpg', after: '/images/before-after/kitchen-after.jpg' },
  { id: 'dining', name: 'Dining Room', before: '/images/before-after/dining-before.jpg', after: '/images/before-after/dining-after.jpg' },
  { id: 'bathroom', name: 'Bathroom', before: '/images/before-after/bathroom-before.jpg', after: '/images/before-after/bathroom-after.jpg' },
  { id: 'reading', name: 'Reading Nook', before: '/images/before-after/reading-before.jpg', after: '/images/before-after/reading-after.jpg' },
  { id: 'study', name: 'Store Room', before: '/images/before-after/study-before.jpg', after: '/images/before-after/study-after.jpg' },
];

/** Determines slide direction based on category index change */
function getDirection(prevId: string, nextId: string) {
  const prevIdx = categories.findIndex((c) => c.id === prevId);
  const nextIdx = categories.findIndex((c) => c.id === nextId);
  return nextIdx >= prevIdx ? 1 : -1;
}

const imageVariants: Variants = {
  enter: () => ({
    opacity: 0,
    scale: 0.85,
    filter: 'blur(6px)',
  }),
  center: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 22,
      mass: 0.8,
      opacity: { duration: 0.3, ease: 'easeOut' },
      filter: { duration: 0.35, ease: 'easeOut' },
    },
  },
  exit: () => ({
    opacity: 0,
    scale: 0.9,
    filter: 'blur(4px)',
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  }),
};

export function BeforeAfterGallery() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [direction, setDirection] = useState(1);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryChange = (newId: string) => {
    if (newId === activeCategory) return;
    setDirection(getDirection(activeCategory, newId));
    setActiveCategory(newId);
  };

  const activeCat = categories.find((c) => c.id === activeCategory)!;

  return (
    <section className="py-10 sm:py-14 md:py-16 bg-transparent relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#b89569]/5 dark:bg-[#cba677]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#b89569]/5 dark:bg-[#cba677]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-premium relative z-10">
        
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 lg:h-[180px] flex flex-col justify-end">
            <span className="text-[#b89569] font-medium tracking-widest uppercase text-sm mb-4 block">
              The Transformation
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-ink dark:text-white mb-6">
              Before & After
            </h2>
            <p className="text-sm sm:text-base text-ink/70 dark:text-white/70 max-w-lg mx-auto">
              Drag the slider to see how Vikore Vana transforms.
            </p>
          </div>
        </ScrollReveal>

        {/* Category Navigation with Arrows */}
        <ScrollReveal delay={100} duration={1000} scale={0.95}>
          <div className="relative flex items-center justify-center max-w-4xl mx-auto mb-10 group/nav lg:h-[54px]">
            
            {/* Left Arrow */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 z-20 w-10 h-10 bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center text-ink/80 dark:text-white/80 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 hover:bg-[#b89569]/20 hover:text-[#b89569] dark:hover:text-[#cba677] hover:scale-110 md:-ml-5 lg:-ml-10 hidden md:flex border border-black/5 dark:border-white/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Frosted glass container for mobile premium feel */}
            <div className="w-full rounded-2xl md:rounded-none bg-white/40 dark:bg-white/[0.03] backdrop-blur-xl md:backdrop-blur-none md:bg-transparent border border-black/[0.04] dark:border-white/[0.06] md:border-0 p-1.5 md:p-0">
              {/* Scrollable Container */}
              <div 
                ref={scrollContainerRef}
                className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-1.5 md:gap-3 px-1 md:px-4 py-0.5 md:py-2 flex-1 scroll-smooth"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`
                      snap-center whitespace-nowrap px-4 py-2.5 md:px-7 md:py-3 rounded-xl md:rounded-full text-[11px] md:text-sm font-semibold tracking-[0.04em] md:tracking-[0.06em] uppercase transition-all duration-300 ease-out
                      ${activeCategory === cat.id 
                        ? 'bg-gradient-to-r from-[#c9a46c] via-[#b89569] to-[#a07a4e] text-white shadow-[0_2px_12px_rgba(184,149,105,0.35)] md:shadow-[0_4px_20px_rgba(184,149,105,0.4)] md:scale-105 border border-[#d4b07a]/30' 
                        : 'bg-white/70 dark:bg-white/[0.05] backdrop-blur-sm text-ink/55 dark:text-white/45 border border-black/[0.04] dark:border-white/[0.06] hover:bg-white/90 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white hover:border-[#b89569]/30 hover:shadow-md md:hover:scale-[1.03]'}
                    `}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 z-20 w-10 h-10 bg-white/70 dark:bg-white/10 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center text-ink/80 dark:text-white/80 opacity-0 group-hover/nav:opacity-100 transition-all duration-300 hover:bg-[#b89569]/20 hover:text-[#b89569] dark:hover:text-[#cba677] hover:scale-110 md:-mr-5 lg:-mr-10 hidden md:flex border border-black/5 dark:border-white/10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>
        </ScrollReveal>

        {/* The Slider Images – AnimatePresence for premium transitions */}
        <ScrollReveal delay={300}>
          <div className="relative w-full max-w-[280px] sm:max-w-xs md:max-w-sm lg:max-w-md mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeCat.id}
                custom={direction}
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <BeforeAfterImage 
                  beforeImage={activeCat.before} 
                  afterImage={activeCat.after} 
                  alt={activeCat.name} 
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
