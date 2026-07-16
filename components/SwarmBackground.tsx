"use client";

import { useEffect, useRef, useState } from "react";

export function SwarmBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // We no longer exit on mobile. Instead, we optimize the render.
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isDark = document.documentElement.classList.contains("dark");

    // ── Autonomous Clock ──────────────────────────
    // The background animates completely independently of scroll or touch

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      // On mobile, render at half resolution for massive performance boost
      const scale = isMobile ? 0.5 : 1;
      canvas.width  = window.innerWidth * scale;
      canvas.height = window.innerHeight * scale;
      // Keep visual size full screen
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Toroidal knot (P=2, Q=5) — same geometry as the reference ─
    const P = 2;
    const Q = 5;

    const knotPoint = (
      t: number,
      w: number,
      h: number,
      gRx: number,
      gRy: number
    ) => {
      const scale  = Math.max(w, h) * 0.42;
      const rMinor = scale * 0.36;

      const cosQt = Math.cos(Q * t);
      const sinQt = Math.sin(Q * t);
      const cosPt = Math.cos(P * t);
      const sinPt = Math.sin(P * t);

      const x3 = (scale + rMinor * cosQt) * cosPt;
      const y3 = (scale + rMinor * cosQt) * sinPt;
      const z3 = rMinor * sinQt;

      const cgx = Math.cos(gRx), sgx = Math.sin(gRx);
      const cgy = Math.cos(gRy), sgy = Math.sin(gRy);

      const y1 = y3 * cgx - z3 * sgx;
      const z1 = y3 * sgx + z3 * cgx;
      const x2 = x3 * cgy + z1 * sgy;

      return { x: w / 2 + x2, y: h / 2 + y1 };
    };

    const NUM_GLOWS = 15;

    const render = (now: number) => {
      animId = requestAnimationFrame(render);

      const w = canvas.width;
      const h = canvas.height;
      // Use alpha clear for a natural motion blur trail
      ctx.fillStyle = isDark ? "rgba(24, 22, 20, 0.2)" : "rgba(255, 250, 244, 0.2)";
      ctx.fillRect(0, 0, w, h);

      // Autonomous slow clock — particles drift independently
      const clock = now * 0.00015; // Increased slightly since it's the only driver now

      const time = clock;

      // Global rotation driven strictly by clock
      const gRx = clock * 0.4;
      const gRy = clock * 0.6;

      // ── Ambient glow blobs flowing along the path ───────────────
      for (let i = 0; i < NUM_GLOWS; i++) {
        const t = ((i / NUM_GLOWS) * Math.PI * 2 * P) + time;

        const { x, y } = knotPoint(t, w, h, gRx, gRy);

        const glowR = Math.max(w, h) * (0.28 + 0.08 * Math.sin(time * 3 + i));

        const hueBase = isDark
          ? 28 + (i / NUM_GLOWS) * 20
          : 22 + (i / NUM_GLOWS) * 22;

        const pulse = 0.5 + 0.5 * Math.sin(time * 4 + i * 1.3);

        const alpha = isDark
          ? 0.18 + pulse * 0.08
          : 0.35 + pulse * 0.15;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);

        if (isDark) {
          grad.addColorStop(0,   `hsla(${hueBase}, 70%, 62%, ${alpha})`);
          grad.addColorStop(0.4, `hsla(${hueBase}, 55%, 46%, ${alpha * 0.5})`);
          grad.addColorStop(1,   `hsla(${hueBase}, 40%, 32%, 0)`);
        } else {
          grad.addColorStop(0,   `hsla(${hueBase}, 95%, 75%, ${alpha})`);
          grad.addColorStop(0.4, `hsla(${hueBase}, 90%, 84%, ${alpha * 0.5})`);
          grad.addColorStop(1,   `hsla(${hueBase}, 80%, 93%, 0)`);
        }

        ctx.beginPath();
        ctx.arc(x, y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
    };
  }, [isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        filter: isMobile ? "none" : "blur(30px)",
        opacity: isMobile ? 0.8 : 1,
      }}
    />
  );
}
