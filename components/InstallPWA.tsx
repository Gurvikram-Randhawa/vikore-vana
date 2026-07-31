"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share, X, Sparkles } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone (installed) mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) return;

    // 2. Check if user already dismissed PWA banner this session
    if (sessionStorage.getItem("vikore_pwa_dismissed") === "true") return;

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIosDevice = /iphone|ipad|ipod/i.test(ua);
    const isSafari = /safari/i.test(ua) && !/chrome|crios|fxios/i.test(ua);

    if (isIosDevice && isSafari) {
      setIsIOS(true);
    }

    // 4. Android / Chrome beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 5. SMART SEQUENCE: Only show PWA banner after Cookie Consent is resolved
    let showTimer: NodeJS.Timeout;

    const checkCookieState = () => {
      const hasCookieConsent = localStorage.getItem("cookieConsent");
      if (hasCookieConsent) {
        // If cookie consent is already decided, show PWA prompt after 4 seconds
        showTimer = setTimeout(() => setIsVisible(true), 4000);
      }
    };

    checkCookieState();

    // Listen for cookie banner close interval (checks every 1s until user clicks Accept/Decline)
    const pollInterval = setInterval(() => {
      if (localStorage.getItem("cookieConsent")) {
        clearInterval(pollInterval);
        showTimer = setTimeout(() => setIsVisible(true), 2500);
      }
    }, 1000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearInterval(pollInterval);
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction trigger
      alert("To install Vikore Vana:\n\n• On Chrome/Edge: Click the Install icon (or ⋮ menu -> 'Save & Share' -> 'Install Vikore Vana').\n• On iOS Safari: Tap Share -> 'Add to Home Screen'.");
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("vikore_pwa_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9990] pointer-events-none"
      >
        <div className="bg-[#ffffff]/95 dark:bg-[#201d1a]/95 backdrop-blur-xl border border-[#b89569]/30 dark:border-white/10 shadow-2xl rounded-3xl p-5 text-ink dark:text-linen pointer-events-auto relative overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial-glow opacity-30 pointer-events-none" />

          <button
            onClick={handleDismiss}
            className="absolute top-3.5 right-3.5 p-1.5 text-smoke hover:text-ink dark:text-bone/70 dark:hover:text-white transition-colors rounded-full cursor-pointer"
            aria-label="Dismiss"
          >
            <X size={16} />
          </button>

          <div className="flex flex-col items-center justify-center text-center p-2 pt-1">
            <h4 className="font-serif text-lg font-medium text-ink dark:text-linen leading-snug">
              Add Vikore Vana to{" "}
              <span className="italic text-[#b89569] dark:text-[#cba677]">
                Home Screen
              </span>
            </h4>
            <p className="text-xs text-smoke dark:text-bone/80 font-light mt-1.5 leading-relaxed max-w-xs mx-auto">
              {isIOS ? (
                <>
                  Tap <Share size={13} className="inline mx-1 text-[#b89569]" /> in Safari and select <strong className="font-medium">"Add to Home Screen"</strong> for instant app access.
                </>
              ) : (
                "Install our app for fast access to interior styling guides and decor edits."
              )}
            </p>

            <button
              onClick={handleInstallClick}
              className="mt-4 inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#b89569] hover:bg-[#a38259] text-white text-xs uppercase tracking-wider font-semibold transition-all duration-300 shadow-sm hover:shadow active:scale-95 cursor-pointer"
            >
              <span>{deferredPrompt ? "Install App" : "How to Add"}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
