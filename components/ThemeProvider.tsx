"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeContextValue = {
  dark: boolean;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [transitionState, setTransitionState] = useState<'idle' | 'enter' | 'exit'>('idle');
  const [transitionTheme, setTransitionTheme] = useState<'light' | 'dark'>('light');
  const [transitionDirection, setTransitionDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    const saved = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(saved ? saved === "dark" : prefersDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    if (transitionState === "enter") {
      const timer = setTimeout(() => {
        setDark(transitionTheme === "dark");
        setTransitionState("exit");
      }, 800);
      return () => clearTimeout(timer);
    } else if (transitionState === "exit") {
      const timer = setTimeout(() => {
        setTransitionState("idle");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [transitionState, transitionTheme]);

  const toggle = () => {
    if (transitionState !== "idle") return;
    const nextIsDark = !dark;
    const dir = nextIsDark ? "ltr" : "rtl";
    setTransitionDirection(dir);
    setTransitionTheme(nextIsDark ? "dark" : "light");
    setTransitionState("enter");
  };

  const value = useMemo(() => ({ dark, toggle }), [dark, transitionState]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
      {transitionState !== "idle" && (
        <div
          className={`fixed inset-0 z-[9999] pointer-events-auto
            ${transitionTheme === "dark" ? "bg-[#181614]" : "bg-[#fffaf4]"}
            ${
              transitionState === "enter"
                ? transitionDirection === "ltr"
                  ? "animate-[sweep-ltr-enter_800ms_cubic-bezier(0.65,0,0.35,1)_forwards]"
                  : "animate-[sweep-rtl-enter_800ms_cubic-bezier(0.65,0,0.35,1)_forwards]"
                : transitionDirection === "ltr"
                ? "animate-[sweep-ltr-exit_800ms_cubic-bezier(0.65,0,0.35,1)_forwards]"
                : "animate-[sweep-rtl-exit_800ms_cubic-bezier(0.65,0,0.35,1)_forwards]"
            }
          `}
        />
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}

