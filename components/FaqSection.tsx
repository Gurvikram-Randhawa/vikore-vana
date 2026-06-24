"use client";

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
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
    <section className="bg-bone py-16 md:py-24 dark:bg-[#1a1816]">
      <div className="container-premium max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-cedar">Support & Information</p>
            <h2 className="font-serif text-3xl md:text-5xl text-ink dark:text-linen">
              Frequently Asked Questions
            </h2>
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <ScrollReveal key={index} delay={index * 100} distance={30}>
                <div 
                  className={`rounded-2xl transition-all duration-300 ${
                    isOpen 
                      ? "bg-white dark:bg-[#221f1c] shadow-soft border border-transparent dark:border-white/5" 
                      : "bg-transparent border border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20"
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
