"use client";

import { useEffect, useRef, useState } from "react";

export function PremiumBackground() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Identify the initial theme mode
    setIsDark(document.documentElement.classList.contains("dark"));

    // Watch for class changes on documentElement to update theme state dynamically
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;
    
    // Position tracking for smooth lerp scroll parallax
    let scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let targetScrollY = scrollY;

    // Define the moving background blobs
    // bx/by: base position percentage
    // px/py: scroll velocity multipliers
    // drift: magnitude of floating movement (pixels)
    // speed: speed of floating movement
    const blobs = [
      { id: "vb-blob1", px: 0.08, py: 0.18, drift: 60, speed: 0.0008 },
      { id: "vb-blob2", px: -0.12, py: -0.15, drift: 70, speed: 0.0006 },
      { id: "vb-blob3", px: 0.15, py: 0.12, drift: 80, speed: 0.0009 },
      { id: "vb-blob4", px: -0.06, py: -0.22, drift: 50, speed: 0.0005 },
    ];

    const elements = blobs.map((b) => document.getElementById(b.id));

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const animate = () => {
      time += 1;
      
      // Interpolate scroll position for silky scrolling
      scrollY += (targetScrollY - scrollY) * 0.06;

      blobs.forEach((blob, index) => {
        const el = elements[index];
        if (!el) return;

        // Soft orbital drift using sine/cosine
        const dx = Math.sin(time * blob.speed) * blob.drift;
        const dy = Math.cos(time * blob.speed) * blob.drift;

        // Vertical and horizontal scroll parallax offsets
        const py = scrollY * blob.py;
        const px = scrollY * blob.px;

        // Apply hardware-accelerated transform
        el.style.transform = `translate3d(${dx + px}px, ${dy + py}px, 0)`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Soft premium colors that feel editorial and atmospheric
  const blobColors = isDark
    ? [
        "rgba(203, 166, 119, 0.16)", // Rich Gold/Cedar Glow
        "rgba(154, 123, 93, 0.12)",  // Muted Cedar
        "rgba(120, 95, 70, 0.10)",   // Warm Bronze
        "rgba(42, 38, 34, 0.28)",    // Warm Dark Clay
      ]
    : [
        "rgba(154, 123, 93, 0.16)",  // Cedar Accent
        "rgba(224, 192, 151, 0.24)", // Warm Honey Gold
        "rgba(212, 175, 137, 0.18)", // Sand Glow
        "rgba(240, 230, 218, 0.65)", // Clean Linen Highlight
      ];

  return (
    <>
      {/* Background container holding the gradients */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]"
        aria-hidden="true"
      >
        {/* Blob 1 - Top Left */}
        <div
          id="vb-blob1"
          className="absolute rounded-full blur-[80px] md:blur-[130px] transition-colors duration-700"
          style={{
            left: "10%",
            top: "15%",
            width: "55vw",
            height: "55vw",
            maxWidth: "600px",
            maxHeight: "600px",
            background: `radial-gradient(circle, ${blobColors[0]} 0%, transparent 70%)`,
          }}
        />

        {/* Blob 2 - Top Right */}
        <div
          id="vb-blob2"
          className="absolute rounded-full blur-[90px] md:blur-[150px] transition-colors duration-700"
          style={{
            left: "60%",
            top: "-5%",
            width: "60vw",
            height: "60vw",
            maxWidth: "700px",
            maxHeight: "700px",
            background: `radial-gradient(circle, ${blobColors[1]} 0%, transparent 70%)`,
          }}
        />

        {/* Blob 3 - Bottom Left */}
        <div
          id="vb-blob3"
          className="absolute rounded-full blur-[100px] md:blur-[160px] transition-colors duration-700"
          style={{
            left: "-15%",
            top: "55%",
            width: "65vw",
            height: "65vw",
            maxWidth: "800px",
            maxHeight: "800px",
            background: `radial-gradient(circle, ${blobColors[2]} 0%, transparent 70%)`,
          }}
        />

        {/* Blob 4 - Bottom Right */}
        <div
          id="vb-blob4"
          className="absolute rounded-full blur-[80px] md:blur-[120px] transition-colors duration-700"
          style={{
            left: "50%",
            top: "40%",
            width: "48vw",
            height: "48vw",
            maxWidth: "550px",
            maxHeight: "550px",
            background: `radial-gradient(circle, ${blobColors[3]} 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Editorial-style micro film grain overlay */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none z-[100] opacity-[0.015] dark:opacity-[0.025] mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="premiumNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#premiumNoise)" />
      </svg>
    </>
  );
}
