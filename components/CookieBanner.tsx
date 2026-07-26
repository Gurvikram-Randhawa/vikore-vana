"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if consent has already been given or rejected
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
      document.body.classList.add("cookie-banner-open");
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
    document.body.classList.remove("cookie-banner-open");
    // Dispatch a custom event so the Analytics component knows to load immediately
    window.dispatchEvent(new Event("cookieConsentAccepted"));
  };

  const handleReject = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setIsVisible(false);
    document.body.classList.remove("cookie-banner-open");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
        >
          {/* Modal */}
          <div 
            className="bg-linen dark:bg-[#201d1a] border border-cedar/20 shadow-xl rounded-2xl p-5 md:p-6 max-w-sm w-full text-center pointer-events-auto relative"
          >


            <h3 className="font-serif text-xl text-ink dark:text-linen mb-2">
              Privacy & Cookies
            </h3>
            
            <p className="text-xs text-smoke dark:text-bone/80 leading-relaxed mb-5">
              We use cookies to enhance your experience and analyze site traffic. Read our{" "}
              <Link href="/privacy" className="text-cedar transition-colors hover:text-ink dark:hover:text-white">Privacy Policy</Link> and{" "}
              <Link href="/disclosure" className="text-cedar transition-colors hover:text-ink dark:hover:text-white">Affiliate Disclosure</Link>.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                onClick={handleReject}
                className="px-5 py-2 rounded-full border border-smoke/20 text-smoke dark:text-bone/80 text-xs tracking-wider uppercase hover:border-cedar hover:text-ink dark:hover:text-white transition-all"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2 rounded-full bg-cedar text-white text-xs tracking-wider uppercase hover:bg-[#86684a] transition-all shadow-sm"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
