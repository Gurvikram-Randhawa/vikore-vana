"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useState, useEffect } from "react";

export function ArticleShareBar({ title, url }: { title: string; url: string; image?: string }) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
      if (typeof navigator !== "undefined" && !!navigator.share) {
        setCanNativeShare(true);
      }
    }
  }, []);

  const shareText = `Check out this interior design inspiration on Vikore Vana: ${title}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + " " + currentUrl)}`;

  async function handleNativeShare() {
    if (canNativeShare) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: currentUrl,
        });
      } catch {
        // User closed or cancelled share sheet
      }
    } else {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* 1-Click Main Native Share Button */}
      <button
        onClick={handleNativeShare}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#b89569] hover:bg-[#a38259] px-6 text-xs uppercase tracking-wider font-semibold text-white shadow-xs hover:shadow-md transition-all duration-300 active:scale-95 cursor-pointer"
        title="Share Article"
      >
        <Share2 size={16} />
        <span>Share</span>
      </button>

      {/* 1-Click Copy Link */}
      <button
        onClick={copyLink}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#faf7f2] dark:bg-[#201d1a] border border-[#b89569]/30 hover:border-[#b89569] text-ink dark:text-linen px-6 text-xs uppercase tracking-wider font-medium transition-all duration-300 cursor-pointer"
        title="Copy Link"
      >
        {copied ? <Check size={16} className="text-green-600 dark:text-green-400" /> : <Copy size={16} />}
        <span>{copied ? "Copied" : "Copy Link"}</span>
      </button>
    </div>
  );
}
