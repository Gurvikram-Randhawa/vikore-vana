"use client";

import { useState, useRef } from 'react';
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
  { id: 'study', name: 'Study Room', before: '/images/before-after/study-before.jpg', after: '/images/before-after/study-after.jpg' },
];

export function BeforeAfterGallery() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-10 sm:py-14 md:py-16 bg-transparent relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#b89569]/5 dark:bg-[#cba677]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#b89569]/5 dark:bg-[#cba677]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
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
          <div className="relative flex items-center justify-center max-w-4xl mx-auto mb-10 group/nav">
            
            {/* Left Arrow */}
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 z-20 w-10 h-10 bg-white/90 dark:bg-black/90 shadow-md rounded-full flex items-center justify-center text-ink dark:text-white opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 md:-ml-5 lg:-ml-10 hidden md:flex"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Scrollable Container */}
            <div 
              ref={scrollContainerRef}
              className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-2 md:gap-4 px-4 py-2 flex-1 scroll-smooth"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    snap-center whitespace-nowrap px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                    ${activeCategory === cat.id 
                      ? 'bg-[#b89569] text-white shadow-lg scale-105' 
                      : 'bg-black/5 dark:bg-white/5 text-ink/70 dark:text-white/70 hover:bg-black/10 dark:hover:bg-white/10'}
                  `}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Right Arrow */}
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 z-20 w-10 h-10 bg-white/90 dark:bg-black/90 shadow-md rounded-full flex items-center justify-center text-ink dark:text-white opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 md:-mr-5 lg:-mr-10 hidden md:flex"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>
        </ScrollReveal>

        {/* The Slider Images */}
        <ScrollReveal delay={300}>
          <div className="relative w-[90%] max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl mx-auto">
            {categories.map((cat) => (
              <div 
                key={cat.id}
                className={`transition-all duration-700 ease-in-out ${activeCategory === cat.id ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 z-0 pointer-events-none scale-95'}`}
              >
                {activeCategory === cat.id && (
                  <BeforeAfterImage 
                    beforeImage={cat.before} 
                    afterImage={cat.after} 
                    alt={cat.name} 
                  />
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
