"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-1 py-4">
        <p className="font-serif text-xl text-ink dark:text-linen">Welcome to the circle ✦</p>
        <p className="text-sm text-[#9c8b7a] dark:text-bone/60">Check your inbox this Sunday.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full h-12 rounded-full border border-[#b8935a]/30 dark:border-[#b8935a]/20 bg-white/70 dark:bg-black/20 px-5 text-sm text-ink dark:text-linen placeholder-[#9c8b7a]/70 dark:placeholder-bone/40 outline-none transition-all duration-300 focus:border-[#b8935a] focus:bg-white dark:focus:bg-black/30 focus:shadow-[0_0_0_3px_rgba(184,147,90,0.12)] disabled:opacity-50"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="group w-full h-12 rounded-full border border-[#b8935a] text-[#b8935a] dark:text-[#cba677] dark:border-[#cba677] bg-transparent text-xs font-semibold uppercase tracking-[2px] transition-all duration-300 hover:bg-[#b8935a] hover:text-white dark:hover:bg-[#cba677] dark:hover:text-ink hover:shadow-[0_4px_16px_rgba(184,147,90,0.25)] disabled:opacity-50 flex items-center justify-center gap-2"
          style={{ fontFamily: "var(--font-jost), sans-serif" }}
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Subscribing…
            </span>
          ) : (
            <>
              Subscribe
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </>
          )}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-3 text-xs text-red-400 dark:text-red-400">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
