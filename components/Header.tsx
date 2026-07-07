"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Search, Sun, Moon, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { useTheme } from "./ThemeProvider";
import { AnimatePresence, motion, Variants } from "framer-motion";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const { dark, toggle } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Framer Motion Animation Variants
  const sidebarVariants: Variants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.05,
        staggerDirection: -1,
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        staggerChildren: 0.08,
        delayChildren: 0.15,
      }
    }
  };

  const itemVariants: Variants = {
    closed: { y: 25, opacity: 0 },
    open: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <>
      {/* Sleek, Minimal Luxury Header Bar */}
      <header 
        className={`sticky top-0 z-50 w-full h-14 md:h-16 bg-[#fffaf4]/90 dark:bg-[#181614]/90 backdrop-blur-md border-b border-[#b89569]/5 dark:border-white/5 transition-transform duration-500 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-[1400px] h-full mx-auto px-6 sm:px-10 flex items-center justify-between">
          
          {/* Left: Minimal Brand Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-3 font-serif tracking-[0.25em] uppercase text-xs sm:text-sm font-light text-ink dark:text-linen transition-opacity hover:opacity-85"
          >
            <span className="relative overflow-hidden w-8 h-8 rounded-full border border-[#b89569]/10 dark:border-white/5 flex items-center justify-center shrink-0">
              <Image src="/logo.jpg" alt="Vikore Vana Logo" fill className="object-cover" />
            </span>
            <span>Vikore Vana</span>
          </Link>

          {/* Center: Delicate Text Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-10">
            {site.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-1 text-[10px] font-medium uppercase tracking-[0.3em] transition-colors duration-300 ${
                    active 
                      ? "text-[#b89569] dark:text-[#cba677]" 
                      : "text-neutral-500 dark:text-bone/45 hover:text-ink dark:hover:text-white"
                  } after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#b89569] dark:after:bg-[#cba677] after:origin-right after:scale-x-0 after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100`}
                  style={{ fontFamily: "var(--font-jost), sans-serif" }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Essential Action Controls (Decluttered) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Search */}
            <Link 
              aria-label="Search" 
              href="/search" 
              className="grid w-10 h-10 place-items-center rounded-full text-neutral-500 dark:text-bone/45 hover:text-ink dark:hover:text-white hover:bg-neutral-100/50 dark:hover:bg-white/5 transition-all duration-300 active:scale-95"
            >
              <Search size={18} />
            </Link>

            {/* Mobile Hamburger menu */}
            <button
              aria-label="Toggle Menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="grid lg:hidden w-10 h-10 place-items-center rounded-full text-ink dark:text-linen hover:bg-neutral-100/50 dark:hover:bg-white/5 transition-all duration-300"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </header>

      {/* Floating Dark Mode Button (Fixed Bottom-Right as requested) */}
      <button
        aria-label="Toggle dark mode"
        onClick={toggle}
        className="fixed bottom-16 right-6 z-[99] flex items-center justify-center w-14 h-14 rounded-full
          bg-[#fffaf4]/90 dark:bg-[#181614]/90 backdrop-blur-md
          border border-[#b89569]/20 dark:border-white/15
          shadow-[0_10px_30px_rgba(184,149,105,0.18),0_4px_12px_rgba(184,149,105,0.08)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)]
          text-ink dark:text-linen hover:scale-110 active:scale-95 transition-all duration-300"
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Premium Redesigned Slide-out Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden flex justify-end"
            onClick={() => setMenuOpen(false)}
          >
            {/* Drawer Container Panel */}
            <motion.div
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="relative w-[85%] max-w-[380px] h-full bg-[#fffaf4]/95 dark:bg-[#181614]/95 backdrop-blur-xl border-l border-[#b89569]/10 dark:border-white/5 p-8 sm:p-10 flex flex-col justify-between shadow-3xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top / Inner Section */}
              <div className="flex flex-col gap-12 mt-12">
                
                {/* Minimal Brand Identity Block */}
                <motion.div 
                  variants={itemVariants} 
                  className="border-b border-[#b89569]/10 pb-6"
                >
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#b89569] dark:text-[#cba677]">Vikore Vana</span>
                  <p className="text-[8px] text-neutral-500 dark:text-bone/45 uppercase tracking-[2px] mt-1">Curated Interior Architecture</p>
                </motion.div>

                {/* Staggered Vertical Menu Options with Large Editorial Typography */}
                <nav className="flex flex-col gap-5">
                  {site.nav.map((item) => {
                    const active = isActive(item.href);
                    const isHovered = hoveredLink === item.href;
                    const isAnyHovered = hoveredLink !== null;

                    return (
                      <motion.div key={item.href} variants={itemVariants}>
                        <Link
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          onMouseEnter={() => setHoveredLink(item.href)}
                          onMouseLeave={() => setHoveredLink(null)}
                          className={`group flex items-center justify-between py-2 text-lg sm:text-xl font-serif font-light tracking-[0.08em] uppercase transition-all duration-300 ${
                            active 
                              ? "text-[#b89569] dark:text-[#cba677]" 
                              : "text-neutral-600 dark:text-bone/60"
                          }`}
                          style={{
                            opacity: isAnyHovered && !isHovered ? 0.45 : 1,
                            transform: isHovered ? "translateX(4px)" : "translateX(0px)",
                          }}
                        >
                          <span className="relative">
                            {item.label}
                            {/* Thin subtle dot indicator next to active link */}
                            {active && (
                              <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#b89569] dark:bg-[#cba677]" />
                            )}
                          </span>
                          
                          <ArrowRight 
                            size={16} 
                            className={`text-[#b89569] dark:text-[#cba677] opacity-0 -translate-x-2 transition-all duration-300 ${
                              isHovered ? "opacity-100 translate-x-0" : ""
                            }`} 
                          />
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>

              {/* Bottom / Socials & Info Section */}
              <div className="flex flex-col gap-8 mt-12 border-t border-[#b89569]/10 pt-6">
                
                {/* Search Bar inside Drawer */}
                <motion.div variants={itemVariants} className="w-full">
                  <form action="/search" method="GET" onSubmit={() => setMenuOpen(false)} className="relative w-full">
                    <input 
                      type="text" 
                      name="q" 
                      placeholder="Search items & guides..." 
                      className="w-full bg-transparent border-b border-[#b89569]/10 focus:border-[#b89569] outline-none py-2 pr-8 text-xs font-sans tracking-wider placeholder-[#8c8275]/40 text-ink dark:text-linen transition-colors duration-300"
                    />
                    <button type="submit" aria-label="Search" className="absolute right-0 top-2.5 text-[#b89569] dark:text-[#cba677] hover:scale-105 active:scale-95 transition-transform">
                      <Search size={14} />
                    </button>
                  </form>
                </motion.div>

                {/* Social Pinterest Link */}
                <motion.div variants={itemVariants} className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                  <a 
                    href="https://www.pinterest.com/vikore_vana/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative py-1 text-[#8c8275] hover:text-[#b89569] dark:text-bone/50 dark:hover:text-[#cba677] transition-colors after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-[#b89569] dark:after:bg-[#cba677] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                  >
                    Pinterest ↗
                  </a>
                </motion.div>

                {/* Footer copyright */}
                <motion.p variants={itemVariants} className="text-[8px] text-neutral-500 dark:text-bone/35 uppercase tracking-[1.5px] leading-relaxed">
                  © {new Date().getFullYear()} Vikore Vana. <br/>
                  Curated Interior Architecture.
                </motion.p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
