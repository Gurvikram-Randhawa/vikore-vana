"use client";

import { useEffect, useRef } from "react";

export function SwarmBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isDark = document.documentElement.classList.contains("dark");

    // ── Scroll tracking with smooth lerp ──────────────────────────
    // time is ONLY driven by scroll — static when page is still
    let rawScroll   = window.scrollY;   // actual scroll position
    let smoothScroll = rawScroll;        // lerped value for buttery motion
    let prevSmooth  = rawScroll;         // detect if still moving

    const onScroll = () => { rawScroll = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
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

      // Lerp smoothScroll toward rawScroll — smooth deceleration
      smoothScroll += (rawScroll - smoothScroll) * 0.02;
      prevSmooth = smoothScroll;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Autonomous slow clock — particles drift at all times
      const clock = now * 0.00006; // very slow: full lap ~17 000 ms

      // Scroll adds an extra offset on top of the autonomous drift
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = maxScroll > 0 ? smoothScroll / maxScroll : 0;
      const scrollOffset = scrollFraction * Math.PI * 2 * P * 0.15;

      const time = clock + scrollOffset;

      // Global rotation driven by clock + scroll — very slow
      const gRx = clock * 0.4 + scrollFraction * Math.PI * 0.08;
      const gRy = clock * 0.6 + scrollFraction * Math.PI * 0.12;

      // ── Ambient glow blobs flowing along the path ───────────────
      for (let i = 0; i < NUM_GLOWS; i++) {
        const t = ((i / NUM_GLOWS) * Math.PI * 2 * P) + time;

        const { x, y } = knotPoint(t, w, h, gRx, gRy);

        const glowR = Math.max(w, h) * (0.18 + 0.05 * Math.sin(time * 3 + i));

        const hueBase = isDark
          ? 28 + (i / NUM_GLOWS) * 20
          : 24 + (i / NUM_GLOWS) * 16;

        const pulse = 0.5 + 0.5 * Math.sin(time * 4 + i * 1.3);

        const alpha = isDark
          ? 0.12 + pulse * 0.08
          : 0.16 + pulse * 0.09;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, glowR);

        if (isDark) {
          grad.addColorStop(0,   `hsla(${hueBase}, 80%, 68%, ${alpha})`);
          grad.addColorStop(0.4, `hsla(${hueBase}, 65%, 50%, ${alpha * 0.5})`);
          grad.addColorStop(1,   `hsla(${hueBase}, 50%, 35%, 0)`);
        } else {
          grad.addColorStop(0,   `hsla(${hueBase}, 70%, 50%, ${alpha})`);
          grad.addColorStop(0.4, `hsla(${hueBase}, 60%, 44%, ${alpha * 0.45})`);
          grad.addColorStop(1,   `hsla(${hueBase}, 45%, 38%, 0)`);
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
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        filter: "blur(6px)",
        opacity: 1,
      }}
    />
  );
}
