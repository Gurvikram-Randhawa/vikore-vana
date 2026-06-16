"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { useState, useEffect } from "react";
import { site } from "@/lib/site";
import { useTheme } from "./ThemeProvider";

export function Header() {
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { dark, toggle } = useTheme();

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
    <header className={`sticky top-0 z-50 border-b border-black/5 bg-[#fffaf4]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#181614]/90 transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="container-premium py-2 md:h-16 md:py-0 flex flex-col md:flex-row justify-center md:justify-between gap-2 md:gap-4">
        <div className="flex items-center justify-between w-full md:w-auto md:flex-1 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-serif text-base md:text-lg tracking-normal text-ink whitespace-nowrap dark:text-linen">
            <Image src="/logo.jpg" alt="Vikore Vana Logo" width={32} height={32} className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover shrink-0" />
            Vikore Vana
          </Link>
          
          <div className="flex items-center gap-2 md:hidden">
            <a aria-label="Pinterest" href="https://www.pinterest.com/vikore_vana/" target="_blank" rel="noopener noreferrer" className="grid size-9 place-items-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.181 0 7.426 2.979 7.426 6.953 0 4.156-2.617 7.502-6.257 7.502-1.222 0-2.372-.635-2.766-1.385l-.754 2.873c-.272 1.042-1.01 2.343-1.505 3.139 1.161.359 2.392.552 3.666.552 6.621 0 11.988-5.367 11.988-11.988C24.017 5.367 18.638 0 12.017 0z"/>
              </svg>
            </a>
            <Link aria-label="Search" href="/search" className="grid size-9 place-items-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10">
              <Search size={19} />
            </Link>
            <button aria-label="Toggle dark mode" onClick={toggle} className="grid size-9 place-items-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10">
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>
          </div>
        </div>

        {/* Center: Nav */}
        <div className="flex w-full items-center justify-center gap-8 overflow-x-auto border-t border-black/5 pt-2 no-scrollbar sm:gap-12 md:w-auto md:border-none md:pt-0 md:gap-7 dark:border-white/10">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="link-underline text-xs md:text-sm font-medium whitespace-nowrap text-smoke transition hover:text-ink dark:text-bone dark:hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex flex-1 items-center justify-end gap-2">
          <a aria-label="Pinterest" href="https://www.pinterest.com/vikore_vana/" target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.181 0 7.426 2.979 7.426 6.953 0 4.156-2.617 7.502-6.257 7.502-1.222 0-2.372-.635-2.766-1.385l-.754 2.873c-.272 1.042-1.01 2.343-1.505 3.139 1.161.359 2.392.552 3.666.552 6.621 0 11.988-5.367 11.988-11.988C24.017 5.367 18.638 0 12.017 0z"/>
            </svg>
          </a>
          <Link aria-label="Search" href="/search" className="grid size-11 place-items-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10">
            <Search size={19} />
          </Link>
          <button aria-label="Toggle dark mode" onClick={toggle} className="grid size-11 place-items-center rounded-full transition hover:bg-black/5 dark:hover:bg-white/10">
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </div>
    </header>
  );
}
