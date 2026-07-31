"use client";

import { Check, Copy, Pin } from "lucide-react";
import { useState, useEffect } from "react";

export function ShareButtons({ title, url, image }: { title: string; url: string; image: string }) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const pinterest = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a
        href={pinterest}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#bd081c] px-5 text-sm font-medium text-white shadow-xs hover:bg-[#a00718] transition-colors"
      >
        <Pin size={17} />
        <span>Save</span>
      </a>
      <button
        onClick={copyLink}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-linen px-5 text-sm font-medium text-ink dark:bg-white/10 dark:text-linen hover:bg-[#eae3d9] dark:hover:bg-white/20 transition-colors cursor-pointer"
      >
        {copied ? <Check size={17} className="text-green-600 dark:text-green-400" /> : <Copy size={17} />}
        <span>{copied ? "Copied" : "Copy Link"}</span>
      </button>
    </div>
  );
}
