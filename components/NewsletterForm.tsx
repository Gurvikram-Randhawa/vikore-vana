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
      <div className="mx-auto mt-8 flex w-full flex-col items-start justify-center p-4 md:items-center">
        <p className="text-lg font-medium text-ink dark:text-linen">Thank you for subscribing!</p>
        <p className="mt-2 text-sm text-smoke dark:text-bone">You've been added to our list.</p>
      </div>
    );
  }

  return (
    <div className="relative mt-8 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address" 
          className="min-h-12 flex-1 rounded-full border border-black/10 bg-white px-5 text-sm text-ink outline-none transition focus:border-cedar focus:ring-1 focus:ring-cedar disabled:opacity-50 dark:border-white/10 dark:bg-[#201d1a] dark:text-linen dark:focus:border-bone dark:focus:ring-bone" 
          disabled={status === "loading"}
        />
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="min-h-12 rounded-full bg-ink px-6 text-sm font-medium text-white transition hover:bg-cedar disabled:opacity-50 dark:bg-linen dark:text-ink dark:hover:bg-bone shrink-0"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && <p className="mt-3 text-sm text-red-500 dark:text-red-400">Something went wrong. Please try again.</p>}
    </div>
  );
}
