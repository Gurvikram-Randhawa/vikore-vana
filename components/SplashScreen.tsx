"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen() {
  const [show, setShow] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMobile(window.innerWidth < 768);

    // Use sessionStorage so it only shows once per browser tab session
    const visited = sessionStorage.getItem("vikore_splash_seen");
    
    if (visited) {
      setShow(false);
      return;
    }
    
    sessionStorage.setItem("vikore_splash_seen", "true");
    document.body.style.overflow = "hidden";
    
    // Unmount after animation completes
    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "auto";
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  // Avoid hydration mismatch by not rendering until client is ready
  if (!isClient) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ opacity: 0, ...(isMobile ? {} : { filter: "blur(12px)" }) }}
            animate={isMobile
              ? { 
                  opacity: [0, 1, 1, 0], 
                  scale: [0.95, 1, 1, 1.05] 
                }
              : { 
                  opacity: [0, 1, 1, 0], 
                  filter: ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
                  scale: [0.95, 1, 1, 1.05]
                }
            }
            transition={{ 
              duration: 3.5, 
              times: [0, 0.3, 0.7, 1], // Fade in by 30%, hold until 70%, fade out to 100%
              ease: "easeInOut" 
            }}
            className="flex items-center justify-center text-center px-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif text-white/90 tracking-[0.1em] font-light">
              Vikore Vana
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
