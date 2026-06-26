"use client";

import { useEffect, useRef } from "react";

export function HeroCanvas3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let isDark = document.documentElement.classList.contains("dark");

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Torus geometry ─────────────────────────────────────────────
    const MAJOR = 52;   // segments around the ring
    const MINOR = 26;   // segments around the tube
    const R = 1.0;      // major radius
    const r = 0.34;     // tube radius

    type Vert = { x: number; y: number; z: number; nx: number; ny: number; nz: number };

    // Pre-bake surface vertices
    const base: Vert[][] = [];
    for (let i = 0; i <= MAJOR; i++) {
      const θ = (i / MAJOR) * Math.PI * 2;
      const cθ = Math.cos(θ), sθ = Math.sin(θ);
      base[i] = [];
      for (let j = 0; j <= MINOR; j++) {
        const φ = (j / MINOR) * Math.PI * 2;
        const cφ = Math.cos(φ), sφ = Math.sin(φ);
        base[i][j] = {
          x: (R + r * cφ) * cθ,
          y: (R + r * cφ) * sθ,
          z: r * sφ,
          nx: cφ * cθ,
          ny: cφ * sθ,
          nz: sφ,
        };
      }
    }

    // ── Rotation helpers ───────────────────────────────────────────
    const rotX = (v: Vert, a: number): Vert => {
      const c = Math.cos(a), s = Math.sin(a);
      return { x: v.x, y: v.y*c - v.z*s, z: v.y*s + v.z*c,
               nx: v.nx, ny: v.ny*c - v.nz*s, nz: v.ny*s + v.nz*c };
    };
    const rotY = (v: Vert, a: number): Vert => {
      const c = Math.cos(a), s = Math.sin(a);
      return { x: v.x*c + v.z*s, y: v.y, z: -v.x*s + v.z*c,
               nx: v.nx*c + v.nz*s, ny: v.ny, nz: -v.nx*s + v.nz*c };
    };
    const rotZ = (v: Vert, a: number): Vert => {
      const c = Math.cos(a), s = Math.sin(a);
      return { x: v.x*c - v.y*s, y: v.x*s + v.y*c, z: v.z,
               nx: v.nx*c - v.ny*s, ny: v.nx*s + v.ny*c, nz: v.nz };
    };

    // Perspective projection
    const proj = (v: Vert, cx: number, cy: number, scale: number) => {
      const fov = 4.2;
      const p = fov / (v.z + fov);
      return { px: cx + v.x * scale * p, py: cy - v.y * scale * p };
    };

    // ── Lights ─────────────────────────────────────────────────────
    // Key light — warm, upper-left-front
    const KL = [0.45, 0.65, 0.75];
    const KLn = Math.sqrt(KL[0]**2 + KL[1]**2 + KL[2]**2);

    // Fill light — cooler, lower-right-back
    const FL = [0.55, -0.35, -0.5];
    const FLn = Math.sqrt(FL[0]**2 + FL[1]**2 + FL[2]**2);

    // Rim light — back-bottom edge (creates the halo effect)
    const RL = [-0.3, -0.6, -0.8];
    const RLn = Math.sqrt(RL[0]**2 + RL[1]**2 + RL[2]**2);

    const dot3 = (a: number[], b: number[], bn: number) =>
      Math.max(0, (a[0]*b[0] + a[1]*b[1] + a[2]*b[2]) / bn);

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const t = now * 0.00028;

      // Slow meditative rotation with subtle wobble
      const ax = 0.42 + Math.sin(t * 0.18) * 0.08;
      const ay = t * 0.55;
      const az = Math.sin(t * 0.12) * 0.04;

      const scale = Math.min(w, h) * 0.29;
      const cx = w * 0.5, cy = h * 0.5;

      type Face = { pts: { px: number; py: number }[]; avgZ: number; shade: number; spec: number; rim: number };
      const faces: Face[] = [];

      for (let i = 0; i < MAJOR; i++) {
        for (let j = 0; j < MINOR; j++) {
          const corners = [
            rotZ(rotY(rotX(base[i][j],     ax), ay), az),
            rotZ(rotY(rotX(base[i+1][j],   ax), ay), az),
            rotZ(rotY(rotX(base[i+1][j+1], ax), ay), az),
            rotZ(rotY(rotX(base[i][j+1],   ax), ay), az),
          ];

          const avgZ = (corners[0].z + corners[1].z + corners[2].z + corners[3].z) / 4;

          // Face normal (average of vertex normals)
          const N = [
            (corners[0].nx + corners[1].nx + corners[2].nx + corners[3].nx) / 4,
            (corners[0].ny + corners[1].ny + corners[2].ny + corners[3].ny) / 4,
            (corners[0].nz + corners[1].nz + corners[2].nz + corners[3].nz) / 4,
          ];

          const diffK = dot3(N, KL, KLn);
          const diffF = dot3(N, FL, FLn) * 0.28;
          const rim   = dot3(N, RL, RLn) * 0.45;

          // Phong specular — view along +Z
          const dot = N[0]*KL[0]/KLn + N[1]*KL[1]/KLn + N[2]*KL[2]/KLn;
          const Rz  = 2 * dot * N[2] - KL[2] / KLn;
          const spec = Math.pow(Math.max(0, Rz), 64) * 0.9;

          faces.push({
            pts: corners.map(v => proj(v, cx, cy, scale)),
            avgZ,
            shade: diffK + diffF,
            spec,
            rim,
          });
        }
      }

      // Back-to-front (painter's algorithm)
      faces.sort((a, b) => a.avgZ - b.avgZ);

      for (const f of faces) {
        const ambient = 0.12;
        const total = Math.min(1.4, ambient + f.shade * 0.88 + f.spec + f.rim * 0.3);

        let rr: number, gg: number, bb: number;

        if (isDark) {
          // Dark mode — warm gold: base #cba677
          rr = Math.round(Math.min(255, 203 * total + f.spec * 52 + f.rim * 30));
          gg = Math.round(Math.min(255, 166 * total * 0.88 + f.spec * 35 + f.rim * 18));
          bb = Math.round(Math.min(255, 119 * total * 0.66 + f.spec * 18 + f.rim * 8));
        } else {
          // Light mode — warm amber: base #b89569
          rr = Math.round(Math.min(255, 184 * total + f.spec * 60 + f.rim * 25));
          gg = Math.round(Math.min(255, 149 * total * 0.87 + f.spec * 42 + f.rim * 14));
          bb = Math.round(Math.min(255, 105 * total * 0.64 + f.spec * 22 + f.rim * 6));
        }

        ctx.beginPath();
        ctx.moveTo(f.pts[0].px, f.pts[0].py);
        ctx.lineTo(f.pts[1].px, f.pts[1].py);
        ctx.lineTo(f.pts[2].px, f.pts[2].py);
        ctx.lineTo(f.pts[3].px, f.pts[3].py);
        ctx.closePath();

        ctx.fillStyle = `rgb(${Math.max(0,rr)},${Math.max(0,gg)},${Math.max(0,bb)})`;
        ctx.fill();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="w-full h-full"
    />
  );
}
