"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

export function ArticleLikeButton({ slug }: { slug: string }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = async () => {
    if (isLiked) return;
    setIsLiked(true);

    try {
      await fetch(`/api/articles/${slug}/like`, { method: "POST" });
    } catch (e) {
      console.error("Failed to save like");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 mb-2 sm:mt-16 sm:mb-4">
      <div className="flex flex-col items-center justify-center mb-8 sm:mb-10 text-center">
        <p className="text-[0.65rem] sm:text-[0.7rem] font-bold uppercase tracking-[0.4em] text-[#b8935a] dark:text-[#cba677] mb-1">
          {isLiked ? "Thank you" : "Enjoyed This"}
        </p>
        <p className="font-[family-name:var(--font-calligraphy)] text-4xl sm:text-5xl text-cedar">
          {isLiked ? "for reading" : "Article"}
        </p>
      </div>

      <motion.button
        onClick={handleLike}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        disabled={isLiked}
        whileTap={!isLiked ? { scale: 0.92 } : {}}
        className={`relative group flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full transition-all duration-700 
          ${isLiked 
            ? "bg-[#b8935a]/10 dark:bg-[#cba677]/10 border border-[#b8935a]/30 dark:border-[#cba677]/30 cursor-default" 
            : "bg-white/40 dark:bg-[#1e1a17]/50 backdrop-blur-xl border border-[#b8935a]/10 dark:border-white/5 hover:border-[#b8935a]/30 hover:shadow-[0_8px_32px_rgba(184,147,90,0.15)] dark:hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)] shadow-[0_4px_16px_rgba(184,147,90,0.04)]"
          }
        `}
      >
        {/* Glow behind the heart */}
        <AnimatePresence>
          {(isHovered || isLiked) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b8935a]/20 to-transparent blur-xl pointer-events-none"
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={
            isLiked 
              ? { scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] } 
              : { scale: 1 }
          }
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Heart 
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-500 ${
              isLiked 
                ? "text-[#b8935a] dark:text-[#cba677] fill-[#b8935a] dark:fill-[#cba677]" 
                : "text-[#b8935a]/60 dark:text-[#cba677]/60 group-hover:text-[#b8935a] dark:group-hover:text-[#cba677]"
            }`}
            strokeWidth={1.5}
          />
        </motion.div>

        {/* Small rising particles on like */}
        <AnimatePresence>
          {isLiked && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, y: 0, x: 0, scale: 0 }}
                  animate={{ 
                    opacity: 0, 
                    y: -50 - Math.random() * 50,
                    x: (Math.random() - 0.5) * 60,
                    scale: Math.random() * 1.5 + 0.5
                  }}
                  transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#b8935a]/60 dark:bg-[#cba677]/60 pointer-events-none"
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
