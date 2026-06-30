"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/content";
import { Loader2, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const QUIZ_QUESTIONS = [
  {
    title: "Which aesthetic speaks to your soul?",
    subtitle: "Let's uncover your foundational style.",
    options: ["Minimalist & Clean", "Cozy & Warm", "Vintage & Eclectic", "Modern Luxury"],
  },
  {
    title: "Which space are you focusing on?",
    subtitle: "Where do you want to create magic right now?",
    options: ["Living Room", "Bedroom", "Kitchen", "Bathroom"],
  },
  {
    title: "What's your biggest priority?",
    subtitle: "What does this room need the most?",
    options: ["Statement Pieces", "Storage & Organization", "Ambient Lighting", "Small Decor Accents"],
  }
];

export function StyleQuiz({ allProducts }: { allProducts: Product[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<Product[]>([]);

  const handleSelect = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      analyzeResults(newAnswers);
    }
  };

  const analyzeResults = (finalAnswers: string[]) => {
    setStep(QUIZ_QUESTIONS.length); // Move past last question
    setIsAnalyzing(true);

    // Simulate a complex analysis engine for premium feel
    setTimeout(() => {
      const room = finalAnswers[1];
      
      // Filter primarily by room to guarantee relevant products
      let matched = allProducts.filter((p) => p.category === room);
      
      // If we don't have enough products in that room, fallback to all products
      if (matched.length < 4) {
        matched = allProducts;
      }

      // Shuffle and pick top 8 to simulate "curation"
      const curated = [...matched].sort(() => 0.5 - Math.random()).slice(0, 8);
      
      setResults(curated);
      setIsAnalyzing(false);
    }, 2500);
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in duration-1000">
        <div className="w-20 h-20 bg-[#b89569]/10 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 rounded-full border-2 border-[#b89569]/20 border-t-[#b89569] animate-spin" />
          <Sparkles className="w-8 h-8 text-[#b89569] animate-pulse" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl text-ink dark:text-linen mb-3">Curating your style...</h2>
        <p className="text-[#9c8b7a] dark:text-bone/80 font-sans tracking-wide">
          Finding the perfect pieces for your {answers[1]?.toLowerCase()}.
        </p>
      </div>
    );
  }

  if (results.length > 0) {
    return (
      <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both">
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 mb-6">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink dark:text-linen mb-4 leading-tight">
            Your Personal <br/><span className="italic text-[#b89569] dark:text-[#cba677]">Style Board</span>
          </h2>
          <p className="text-[#9c8b7a] dark:text-bone/80 max-w-lg mx-auto">
            Based on your preference for a {answers[0].toLowerCase()} vibe, we've hand-picked these stunning pieces for your {answers[1].toLowerCase()}.
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4 max-w-[1536px] mx-auto">
          {results.map((product, i) => (
            <ScrollReveal key={product.slug} delay={i * 100} distance={80} direction="up" duration={1000}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    );
  }

  const currentQ = QUIZ_QUESTIONS[step];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 flex flex-col justify-center py-2 sm:py-6">
      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto mb-6 sm:mb-8">
        <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-[#b89569] mb-3">
          <span>Question {step + 1}</span>
          <span>{QUIZ_QUESTIONS.length}</span>
        </div>
        <div className="h-1 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#b89569] transition-all duration-700 ease-out" 
            style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center mb-6 sm:mb-8" key={`q-${step}`}>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink dark:text-linen mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {currentQ.title}
        </h2>
        <p className="text-sm sm:text-base text-[#9c8b7a] dark:text-bone/80 animate-in fade-in duration-700 delay-150 fill-mode-both">
          {currentQ.subtitle}
        </p>
      </div>

      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-4" key={`opts-${step}`}>
        {currentQ.options.map((opt, i) => (
          <button
            key={opt}
            onClick={() => handleSelect(opt)}
            className="group relative overflow-hidden bg-white/50 dark:bg-[#25211e]/50 backdrop-blur-sm border border-[#b8935a]/20 dark:border-[#b8935a]/15 p-4 sm:p-5 rounded-2xl flex items-center justify-between text-left hover:border-[#b8935a] dark:hover:border-[#b8935a] hover:shadow-[0_8px_30px_rgba(184,147,90,0.15)] transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="absolute inset-0 bg-[#b8935a]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
            <span className="relative z-10 font-serif text-base md:text-lg text-ink dark:text-linen group-hover:text-[#b8935a] dark:group-hover:text-[#cba677] transition-colors">
              {opt}
            </span>
            <div className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:border-[#b8935a] group-hover:bg-[#b8935a] text-transparent group-hover:text-white transition-all duration-500">
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
