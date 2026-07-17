"use client";

import { Check, Copy, Pin } from "lucide-react";
import { useState, useEffect } from "react";

export function ShareButtons({ title, url, image }: { title: string; url: string; image: string }) {
  const [copied, setCopied] = useState(false);
  
  // Use the actual window location to bypass any hardcoded domain blocks (like Pinterest blocking the main domain)
  // Fall back to the provided url if window is not defined (during SSR)
  const [currentUrl, setCurrentUrl] = useState(url);
  
  // Update to the real browser URL on mount
  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const pinterest = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title)}`;

  async function copyLink() {
    await navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-wrap gap-3">
      <a href={pinterest} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#bd081c] px-5 text-sm font-medium text-white">
        <Pin size={17} />
        Save
      </a>
      <button onClick={copyLink} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-linen px-5 text-sm font-medium text-ink dark:bg-white/10 dark:text-linen">
        {copied ? <Check size={17} /> : <Copy size={17} />}
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}
