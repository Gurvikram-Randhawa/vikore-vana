"use client";

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { AnimatedHeading } from "./AnimatedHeading";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do you curate the products featured on Vikore Vana?",
    answer: "Every piece featured on our site undergoes a rigorous selection process. Our editorial team reviews materials, craftsmanship, aesthetic harmony, and sustainability practices to ensure we only recommend items that meet our high standards for quiet luxury."
  },
  {
    question: "Do you offer direct interior design consultations?",
    answer: "While our platform is primarily a curated editorial and affiliate destination, we occasionally offer styling advice through our newsletter and comprehensive design guides. We are actively exploring dedicated 1-on-1 consultations for the future."
  },
  {
    question: "How frequently are new room edits and articles published?",
    answer: "We publish new editorial room edits and curated product lists every week. Our newsletter subscribers get first access to our Sunday features, which highlight our latest design discoveries."
  },
  {
    question: "Can I request a styling guide for a specific room or style?",
    answer: "Absolutely! We love hearing from our community. You can reach out to us through our newsletter or social channels with your styling requests. While we can't guarantee every request will be featured, our editorial team actively draws inspiration from the spaces and styles our readers care about most."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-10 sm:py-14 md:py-16">
      <div className="container-premium max-w-4xl">
        <div className="mb-10 sm:mb-12 md:mb-14 text-center">
          <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
            <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-cedar/50" />
            <p className="text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-cedar dark:text-[#cba677]">
              Support & Information
            </p>
            <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-cedar/50" />
          </div>
          <AnimatedHeading 
            className="text-3xl sm:text-4xl md:text-5xl text-ink dark:text-linen leading-[1.1] justify-center"
            tokens={[
              { text: "Frequently Asked" },
              { text: "Questions", className: "italic text-[#b89569] dark:text-[#cba677]" }
            ]}
          />
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={index} delay={index * 100} distance={30}>
                <div 
                  className={`rounded-2xl transition-all duration-300 ${
                    isOpen 
                      ? "bg-[#fdf6f0]/70 dark:bg-[#25211e]/70 backdrop-blur-md shadow-[0_4px_16px_rgba(184,147,90,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)] border border-[#b8935a]/20 dark:border-[#b8935a]/15" 
                      : "bg-transparent border border-black/10 hover:border-[#b8935a]/50 dark:border-white/10 dark:hover:border-[#b8935a]/40"
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                  >
                    <h3 className={`font-serif text-lg md:text-xl transition-colors ${isOpen ? "text-ink dark:text-linen" : "text-ink/80 dark:text-bone group-hover:text-ink dark:group-hover:text-white"}`}>
                      {faq.question}
                    </h3>
                    <div className={`shrink-0 ml-6 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isOpen ? "bg-cedar text-white dark:bg-[#cba677] dark:text-ink" : "bg-black/5 text-ink dark:bg-white/5 dark:text-white"}`}>
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-6 md:p-8 pt-0 text-smoke dark:text-bone/80 text-base md:text-lg leading-relaxed border-t border-black/5 dark:border-white/5 mx-6 md:mx-8">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
