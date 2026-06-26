"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header className={`sticky top-0 z-50 border-b border-[#b8935a]/15 bg-[#fffaf4]/85 backdrop-blur-md dark:border-white/5 dark:bg-[#181614]/85 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="container-premium py-2 md:h-16 md:py-0 flex flex-col md:flex-row justify-center md:justify-between items-center gap-2 md:gap-4">
          <div className="flex items-center justify-between w-full md:w-auto md:flex-1 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-serif text-base md:text-lg tracking-[0.8px] font-semibold text-ink whitespace-nowrap dark:text-linen font-bold">
              <span className="relative overflow-hidden w-8 h-8 md:w-9 md:h-9 rounded-full border border-[#b8935a]/30 dark:border-white/10 shadow-sm flex items-center justify-center shrink-0">
                <Image src="/logo.jpg" alt="Vikore Vana Logo" fill className="object-cover" />
              </span>
              Vikore Vana
            </Link>

            <div className="flex items-center gap-2 md:hidden">
              <a 
                aria-label="Pinterest" 
                href="https://www.pinterest.com/vikore_vana/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="grid w-9 h-9 place-items-center rounded-full border border-[#b8935a]/15 dark:border-white/5 bg-[#b8935a]/5 dark:bg-white/5 text-[#b8935a] dark:text-[#cba677] transition hover:bg-[#b8935a]/10 dark:hover:bg-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.181 0 7.426 2.979 7.426 6.953 0 4.156-2.617 7.502-6.257 7.502-1.222 0-2.372-.635-2.766-1.385l-.754 2.873c-.272 1.042-1.01 2.343-1.505 3.139 1.161.359 2.392.552 3.666.552 6.621 0 11.988-5.367 11.988-11.988C24.017 5.367 18.638 0 12.017 0z" />
                </svg>
              </a>
              <Link 
                aria-label="Search" 
                href="/search" 
                className="grid w-9 h-9 place-items-center rounded-full border border-[#b8935a]/15 dark:border-white/5 bg-[#b8935a]/5 dark:bg-white/5 text-[#b8935a] dark:text-[#cba677] transition hover:bg-[#b8935a]/10 dark:hover:bg-white/10"
              >
                <Search size={16} />
              </Link>
            </div>
          </div>

          {/* Center: Nav */}
          <div className="flex items-center justify-center">
            <nav className="flex items-center gap-1 rounded-3xl px-3 py-2.5 bg-[#fdf6f0]/55 dark:bg-[#1e1a17]/60 backdrop-blur-xl border border-[#b8935a]/30 dark:border-[#b8935a]/15 shadow-[0_8px_28px_rgba(184,147,90,0.14),0_2px_6px_rgba(184,147,90,0.07)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.25)]">
              {site.nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-center rounded-full px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[1.5px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                      active
                        ? "border border-[#b8935a] text-[#b8935a] dark:border-[#cba677] dark:text-[#cba677]"
                        : "border border-transparent text-[#9c8b7a] hover:text-[#b8935a] hover:border-[#b8935a]/30 dark:text-bone/50 dark:hover:text-[#cba677] dark:hover:border-[#cba677]/30"
                    }`}
                    style={{ fontFamily: "var(--font-jost), sans-serif" }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            <a 
              aria-label="Pinterest" 
              href="https://www.pinterest.com/vikore_vana/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="grid w-10 h-10 place-items-center rounded-full border border-[#b8935a]/15 dark:border-white/5 bg-[#b8935a]/5 dark:bg-white/5 text-[#b8935a] dark:text-[#cba677] transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-[#b8935a]/10 dark:hover:bg-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.181 0 7.426 2.979 7.426 6.953 0 4.156-2.617 7.502-6.257 7.502-1.222 0-2.372-.635-2.766-1.385l-.754 2.873c-.272 1.042-1.01 2.343-1.505 3.139 1.161.359 2.392.552 3.666.552 6.621 0 11.988-5.367 11.988-11.988C24.017 5.367 18.638 0 12.017 0z" />
              </svg>
            </a>
            <Link 
              aria-label="Search" 
              href="/search" 
              className="grid w-10 h-10 place-items-center rounded-full border border-[#b8935a]/15 dark:border-white/5 bg-[#b8935a]/5 dark:bg-white/5 text-[#b8935a] dark:text-[#cba677] transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-[#b8935a]/10 dark:hover:bg-white/10"
            >
              <Search size={17} />
            </Link>
            <button 
              aria-label="Toggle dark mode" 
              onClick={toggle} 
              className="grid w-10 h-10 place-items-center rounded-full border border-[#b8935a]/25 dark:border-white/10 bg-[#b8935a]/10 dark:bg-white/10 text-[#b8935a] dark:text-[#cba677] transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-[#b8935a]/15 dark:hover:bg-white/15"
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Mobile Dark Mode Button */}
      <button
        aria-label="Toggle dark mode"
        onClick={toggle}
        className="fixed bottom-12 right-6 z-[99] md:hidden flex items-center justify-center w-12 h-12 rounded-full
          bg-white/40 dark:bg-[#151311]/45 backdrop-blur-xl
          border border-[#b8935a]/35 dark:border-[#b8935a]/25
          shadow-[0_8px_32px_rgba(31,38,135,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.37)]
          text-ink dark:text-linen hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {dark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </>
  );
}
