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
      <div className="mx-auto mt-8 flex max-w-xl flex-col items-center justify-center p-4">
        <p className="text-white font-medium text-lg">Thank you for subscribing!</p>
        <p className="text-white/80 text-sm mt-2">You've been added to our list.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-xl relative">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input 
          type="email" 
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address" 
          className="min-h-12 flex-1 rounded-full border border-white/20 bg-white px-5 text-sm text-ink outline-none disabled:opacity-50" 
          disabled={status === "loading"}
        />
        <button 
          type="submit" 
          disabled={status === "loading"}
          className="min-h-12 rounded-full bg-cedar px-6 text-sm font-medium text-white disabled:opacity-50 transition hover:bg-white hover:text-cedar dark:hover:bg-ink dark:hover:text-white"
        >
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && <p className="text-red-300 text-sm mt-3">Something went wrong. Please try again.</p>}
    </div>
  );
}
