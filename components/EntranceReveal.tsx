"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function EntranceReveal() {
  const [phase, setPhase] = useState<"intro" | "fadeout" | "done">("intro");

  useEffect(() => {
    // Show splash for slightly longer to ensure mobile devices finish hydration and can show the text
    const t1 = setTimeout(() => setPhase("fadeout"), 2200);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === "fadeout") {
      // Remove overlay after fade animation completes
      const t2 = setTimeout(() => setPhase("done"), 1000);
      return () => clearTimeout(t2);
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="reveal-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#181614] overflow-hidden pointer-events-none"
        >
          <motion.div
            className="flex flex-col items-center gap-5"
            initial={{ opacity: 0, y: 20 }}
            animate={
              phase === "fadeout"
                ? { opacity: 0, y: -20 }
                : { opacity: 1, y: 0 }
            }
            transition={
              phase === "fadeout"
                ? { duration: 0.6, ease: "easeIn" }
                : { duration: 0.8, ease: "easeOut", delay: 0.2 }
            }
          >
            <span
              className="text-[2.2rem] md:text-[3rem] leading-none text-[#cba677]"
              style={{ fontFamily: "var(--font-calligraphy), cursive" }}
            >
              Vikore Vana
            </span>
            <div className="flex items-center gap-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#cba677]/50" />
              <p className="text-[9px] md:text-[11px] uppercase tracking-[0.4em] text-[#cba677]/70 font-sans font-medium">
                Curated Living
              </p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#cba677]/50" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
