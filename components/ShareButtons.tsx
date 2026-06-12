"use client";

import { Check, Copy, Pin } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ title, url, image }: { title: string; url: string; image: string }) {
  const [copied, setCopied] = useState(false);
  const pinterest = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(title)}`;

  async function copyLink() {
    await navigator.clipboard.writeText(url);
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
