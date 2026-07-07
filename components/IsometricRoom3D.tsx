// @ts-nocheck
// Auto-generated from temp_room.html
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Play } from "lucide-react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export function IsometricRoom3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const interactiveRef = useRef(true);
  const startLoopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;



    // ============================================================
    // CONFIGURATION
    // ============================================================
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const EPS = 0.001;
    const RW = 8, RH = 4.2, RD = 7; // Room dimensions
    const isMobile = width < 768; // Moved up for global use
    const SHADOW_RES = isMobile ? 512 : 1024;

    // ============================================================
    // RENDERER & CORE
    // ============================================================
    // Cap pixel ratio to 2 to prevent iOS memory crashes on 3x devices (visually indistinguishable)
    const pr = Math.min(window.devicePixelRatio || 1, 2); 
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(pr);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0); // Ensure clear color is transparent
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // ============================================================
    // CAMERA
    // ============================================================
    const camera = new THREE.PerspectiveCamera(isMobile ? 38 : 26, width / height, 0.1, 100);
    // Cinematic intro start position
    const camIntro = new THREE.Vector3(13.5, 10, 14.5);
    const camTarget = new THREE.Vector3(-0.5, 1.1, 0.2);
    const camEnd = isMobile ? new THREE.Vector3(11.5, 9.5, 12.5) : new THREE.Vector3(9.0, 7.5, 10.0);
    camera.position.copy(camIntro);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(camTarget);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 0.3;
    controls.minDistance = 6;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI / 2.1;
    controls.minPolarAngle = Math.PI / 8;
    controls.enabled = false;
    controls.update();

    // ============================================================
    // Post-processing removed for performance — using direct renderer with
    // built-in antialiasing + CSS vignette overlay for warmth

    // ============================================================
    // ENVIRONMENT (procedural HDRI)
    // ============================================================
    function createEnvMap() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 256;
      const x = c.getContext('2d');
      // Sky gradient — warm morning light from left
      const g = x.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, '#E8DDD0');
      g.addColorStop(0.3, '#F0EBE3');
      g.addColorStop(0.5, '#D4C4A8');
      g.addColorStop(0.7, '#8A7E74');
      g.addColorStop(1, '#3E2B1C');
      x.fillStyle = g; x.fillRect(0, 0, 512, 256);
      // Bright window area on left
      const wg = x.createRadialGradient(60, 100, 10, 60, 100, 120);
      wg.addColorStop(0, 'rgba(255,248,235,0.6)');
      wg.addColorStop(1, 'rgba(255,248,235,0)');
      x.fillStyle = wg; x.fillRect(0, 0, 200, 256);
      // Ground reflection
      const gg = x.createLinearGradient(0, 200, 0, 256);
      gg.addColorStop(0, 'rgba(62,43,28,0.3)');
      gg.addColorStop(1, 'rgba(44,36,32,0.6)');
      x.fillStyle = gg; x.fillRect(0, 200, 512, 56);
      const tex = new THREE.CanvasTexture(c);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = tex;
      return tex;
    }
    const envMap = createEnvMap();

    // Scene background — soft gradient
    const bgC = document.createElement('canvas');
    bgC.width = 2; bgC.height = 512;
    const bgX = bgC.getContext('2d');
    const bgG = bgX.createLinearGradient(0, 0, 0, 512);
    bgG.addColorStop(0, '#EDE5D8');
    bgG.addColorStop(0.5, '#E8E0D4');
    bgG.addColorStop(1, '#DDD4C8');
    bgX.fillStyle = bgG; bgX.fillRect(0, 0, 2, 512);
    scene.background = null;

    // ============================================================
    // PROCEDURAL TEXTURES
    // ============================================================
    const TEX_CACHE = {};

    function makeFloorTex() {
      if (TEX_CACHE.floor) return TEX_CACHE.floor;
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const x = c.getContext('2d');
      const pH = 64;
      const shades = ['#3E2B1C', '#3A2718', '#422E1F', '#3C291A', '#402C1D', '#382617', '#412D1E', '#3B2819'];
      for (let i = 0; i < 8; i++) {
        const y = i * pH;
        x.fillStyle = shades[i]; x.fillRect(0, y, 512, pH);
        // Wood grain
        x.strokeStyle = 'rgba(15,8,2,0.12)'; x.lineWidth = 0.5;
        for (let g = 0; g < 6; g++) {
          const gy = y + 8 + g * 8 + (Math.random() - 0.5) * 3;
          x.beginPath(); x.moveTo(0, gy);
          x.bezierCurveTo(170, gy + (Math.random() - 0.5) * 2, 340, gy + (Math.random() - 0.5) * 2, 512, gy + (Math.random() - 0.5) * 1.5);
          x.stroke();
        }
        // Plank gap shadow
        x.fillStyle = 'rgba(10,5,0,0.45)'; x.fillRect(0, y + pH - 1.5, 512, 1.5);
        // Highlight on top edge
        x.fillStyle = 'rgba(255,240,220,0.06)'; x.fillRect(0, y, 512, 0.8);
      }
      // Staggered joints
      for (let i = 0; i < 8; i++) {
        const y = i * pH;
        const js = i % 3 === 0 ? [0, 256] : i % 3 === 1 ? [170, 400] : [85, 340];
        x.fillStyle = 'rgba(10,5,0,0.35)';
        js.forEach(jx => x.fillRect(jx - 0.6, y, 1.2, pH));
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 3.5);
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      TEX_CACHE.floor = t;
      return t;
    }

    function makeWallTex() {
      if (TEX_CACHE.wall) return TEX_CACHE.wall;
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const x = c.getContext('2d');
      x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, 256, 256);
      const d = x.getImageData(0, 0, 256, 256);
      for (let i = 0; i < d.data.length; i += 4) {
        const n = (Math.random() - 0.5) * 5;
        d.data[i] = Math.min(255, Math.max(0, d.data[i] + n));
        d.data[i + 1] = Math.min(255, Math.max(0, d.data[i + 1] + n));
        d.data[i + 2] = Math.min(255, Math.max(0, d.data[i + 2] + n));
      }
      x.putImageData(d, 0, 0);
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1.5);
      TEX_CACHE.wall = t;
      return t;
    }

    function makeTuftTex() {
      if (TEX_CACHE.tuft) return TEX_CACHE.tuft;
      const c = document.createElement('canvas');
      c.width = 128; c.height = 128;
      const x = c.getContext('2d');
      x.fillStyle = '#2C2420'; x.fillRect(0, 0, 128, 128);
      x.fillStyle = 'rgba(15,8,2,0.18)';
      for (let r = 0; r < 5; r++) for (let cl = 0; cl < 6; cl++) {
        x.beginPath(); x.arc(12 + cl * 22, 14 + r * 24, 2.5, 0, Math.PI * 2); x.fill();
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      TEX_CACHE.tuft = t;
      return t;
    }

    function makeLeatherTuftTex() {
      if (TEX_CACHE.leatherTuft) return TEX_CACHE.leatherTuft;
      const c = document.createElement('canvas');
      c.width = 128; c.height = 128;
      const x = c.getContext('2d');
      x.fillStyle = '#6E4322'; x.fillRect(0, 0, 128, 128);
      x.fillStyle = 'rgba(40,15,5,0.4)';
      for (let r = 0; r < 5; r++) for (let cl = 0; cl < 6; cl++) {
        x.beginPath(); x.arc(12 + cl * 22, 14 + r * 24, 2.5, 0, Math.PI * 2); x.fill();
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      TEX_CACHE.leatherTuft = t;
      return t;
    }

    function makeRugTex() {
      if (TEX_CACHE.rug) return TEX_CACHE.rug;
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const x = c.getContext('2d');
      x.fillStyle = '#2C2420'; x.fillRect(0, 0, 512, 512);
      x.fillStyle = '#332B26'; x.fillRect(40, 40, 432, 432);
      x.fillStyle = '#3A322C'; x.fillRect(55, 55, 402, 402);
      x.strokeStyle = '#5A4E44'; x.lineWidth = 3;
      x.strokeRect(18, 18, 476, 476);
      x.lineWidth = 1.5;
      x.strokeRect(35, 35, 442, 442);
      x.strokeRect(48, 48, 416, 416);
      x.strokeRect(53, 53, 406, 406);
      // Greek key corners
      const ks = 14;
      function drawKey(ox, oy, dx, dy) {
        x.strokeStyle = '#5A4E44'; x.lineWidth = 1.2;
        for (let k = 0; k < 3; k++) {
          const bx = ox + k * ks * dx, by = oy + k * ks * dy;
          x.beginPath(); x.moveTo(bx, by);
          x.lineTo(bx + ks * dx * 0.5, by);
          x.lineTo(bx + ks * dx * 0.5, by + ks * dy * 0.5);
          x.lineTo(bx + ks * dx, by + ks * dy * 0.5);
          x.stroke();
        }
      }
      drawKey(58, 58, 1, 1); drawKey(454, 58, -1, 1);
      drawKey(58, 454, 1, -1); drawKey(454, 454, -1, -1);
      // Central medallion
      x.strokeStyle = '#4A3E34'; x.lineWidth = 1.2;
      x.beginPath(); x.arc(256, 256, 55, 0, Math.PI * 2); x.stroke();
      x.beginPath(); x.arc(256, 256, 40, 0, Math.PI * 2); x.stroke();
      x.beginPath(); x.arc(256, 256, 18, 0, Math.PI * 2); x.stroke();
      x.beginPath(); x.arc(256, 256, 6, 0, Math.PI * 2); x.fill();
      // Fiber texture
      for (let i = 0; i < 800; i++) {
        x.fillStyle = `rgba(90,78,68,${Math.random() * 0.07})`;
        x.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
      }
      const t = new THREE.CanvasTexture(c);
      t.anisotropy = renderer.capabilities.getMaxAnisotropy();
      TEX_CACHE.rug = t;
      return t;
    }

    function makeMarbleTex() {
      if (TEX_CACHE.marble) return TEX_CACHE.marble;
      const c = document.createElement('canvas');
      c.width = 256; c.height = 256;
      const x = c.getContext('2d');
      x.fillStyle = '#E8E0D4'; x.fillRect(0, 0, 256, 256);
      // Veins
      x.strokeStyle = 'rgba(140,120,100,0.12)'; x.lineWidth = 0.8;
      for (let v = 0; v < 5; v++) {
        x.beginPath();
        let vx = Math.random() * 256, vy = Math.random() * 256;
        x.moveTo(vx, vy);
        for (let s = 0; s < 8; s++) {
          vx += (Math.random() - 0.5) * 60;
          vy += (Math.random() - 0.5) * 60;
          x.quadraticCurveTo(vx + (Math.random() - 0.5) * 30, vy + (Math.random() - 0.5) * 30, vx, vy);
        }
        x.stroke();
      }
      x.strokeStyle = 'rgba(100,80,60,0.06)'; x.lineWidth = 1.5;
      for (let v = 0; v < 3; v++) {
        x.beginPath();
        let vx = Math.random() * 256, vy = Math.random() * 256;
        x.moveTo(vx, vy);
        for (let s = 0; s < 5; s++) { vx += (Math.random() - 0.5) * 80; vy += (Math.random() - 0.5) * 80; x.lineTo(vx, vy); }
        x.stroke();
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      TEX_CACHE.marble = t;
      return t;
    }

    function makeArtTex(style) {
      const c = document.createElement('canvas');
      c.width = 256; c.height = 320;
      const x = c.getContext('2d');
      if (style === 0) {
        x.fillStyle = '#E8E0D4'; x.fillRect(0, 0, 256, 320);
        x.globalAlpha = 0.12; x.fillStyle = '#3E2B1C'; x.fillRect(20, 20, 216, 280);
        x.globalAlpha = 0.1; x.fillStyle = '#5A4E44';
        x.beginPath(); x.ellipse(128, 150, 70, 90, 0, 0, Math.PI * 2); x.fill();
        x.globalAlpha = 0.07; x.fillStyle = '#2C2420';
        x.beginPath(); x.ellipse(128, 160, 50, 70, 0, 0, Math.PI * 2); x.fill();
        x.globalAlpha = 0.05; x.fillStyle = '#8A7E74';
        x.beginPath(); x.ellipse(100, 120, 40, 50, -0.2, 0, Math.PI * 2); x.fill();
        x.globalAlpha = 0.08; x.fillStyle = '#4A3E34'; x.fillRect(40, 260, 176, 2);
      } else {
        x.fillStyle = '#EDE5D8'; x.fillRect(0, 0, 256, 320);
        x.strokeStyle = '#3E2B1C'; x.lineWidth = 1.2; x.globalAlpha = 0.18;
        for (let i = 0; i < 3; i++) { const cx = 70 + i * 58; x.strokeRect(cx - 12, 40, 24, 240); x.strokeRect(cx - 16, 36, 32, 8); x.strokeRect(cx - 16, 276, 32, 8); }
        x.globalAlpha = 0.08; x.lineWidth = 0.8;
        for (let y = 80; y < 280; y += 30) { x.beginPath(); x.moveTo(40, y); x.lineTo(216, y); x.stroke(); }
        x.globalAlpha = 0.12; x.lineWidth = 1.5;
        x.beginPath(); x.arc(128, 140, 50, Math.PI, 0); x.stroke();
      }
      x.globalAlpha = 1;
      return new THREE.CanvasTexture(c);
    }

    function makeFireTex() {
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const x = c.getContext('2d');
      const g = x.createRadialGradient(32, 48, 5, 32, 32, 30);
      g.addColorStop(0, '#FFB830');
      g.addColorStop(0.4, '#E86820');
      g.addColorStop(0.8, '#8B2500');
      g.addColorStop(1, 'rgba(44,20,8,0)');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }

    // ============================================================
    // MATERIALS LIBRARY (PBR)
    // ============================================================
    const MAT = {
      wall: new THREE.MeshStandardMaterial({ map: makeWallTex(), color: '#FDFBF7', roughness: 0.95, metalness: 0 }),
      wallPanel: new THREE.MeshStandardMaterial({ color: '#F0EBE1', roughness: 0.88, metalness: 0 }),
      floor: new THREE.MeshStandardMaterial({ map: makeFloorTex(), roughness: 0.65, metalness: 0.03 }),
      ceiling: new THREE.MeshStandardMaterial({ color: '#F5F0E8', roughness: 0.98, metalness: 0 }),
      walnut: new THREE.MeshStandardMaterial({ color: '#3E2B1C', roughness: 0.5, metalness: 0.05 }),
      walnutL: new THREE.MeshStandardMaterial({ color: '#4A3525', roughness: 0.55, metalness: 0.04 }),
      oak: new THREE.MeshStandardMaterial({ color: '#5C4030', roughness: 0.6, metalness: 0.03 }),
      brass: new THREE.MeshStandardMaterial({ color: '#B8962E', roughness: 0.15, metalness: 0.92, envMapIntensity: 1.2 }),
      goldTrim: new THREE.MeshStandardMaterial({ color: '#C9A84C', roughness: 0.12, metalness: 0.94, envMapIntensity: 1.3 }),
      velvet: new THREE.MeshStandardMaterial({ color: '#2C2420', roughness: 0.88, metalness: 0 }),
      tufted: new THREE.MeshStandardMaterial({ map: makeTuftTex(), color: '#2C2420', roughness: 0.9, metalness: 0 }),
      leatherTufted: new THREE.MeshStandardMaterial({ map: makeLeatherTuftTex(), color: '#FFFFFF', roughness: 0.65, metalness: 0.1 }),
      leatherSolid: new THREE.MeshStandardMaterial({ color: '#6E4322', roughness: 0.65, metalness: 0.1 }),
      cream: new THREE.MeshStandardMaterial({ color: '#EDE5D8', roughness: 0.92, metalness: 0 }),
      dkWood: new THREE.MeshStandardMaterial({ color: '#2C1E14', roughness: 0.55, metalness: 0.05 }),
      ceramic: new THREE.MeshPhysicalMaterial({ color: '#E8E0D4', roughness: 0.2, metalness: 0.02, clearcoat: 0.6, clearcoatRoughness: 0.08 }),
      glass: new THREE.MeshPhysicalMaterial({ color: '#E8E0D4', roughness: 0.03, metalness: 0, transparent: true, opacity: 0.12, envMapIntensity: 0.8 }),
      glassTint: new THREE.MeshPhysicalMaterial({ color: '#D4C8B0', roughness: 0.03, metalness: 0, transparent: true, opacity: 0.25 }),
      bFrame: new THREE.MeshStandardMaterial({ color: '#2C1E14', roughness: 0.18, metalness: 0.85 }),
      base: new THREE.MeshStandardMaterial({ color: '#E8E0D4', roughness: 0.9, metalness: 0 }),
      leaf: new THREE.MeshStandardMaterial({ color: '#3A4A2E', roughness: 0.72, metalness: 0 }),
      leafD: new THREE.MeshStandardMaterial({ color: '#2A3A20', roughness: 0.76, metalness: 0 }),
      shade: new THREE.MeshStandardMaterial({ color: '#F0EBE3', roughness: 0.94, metalness: 0, emissive: '#D4C4A8', emissiveIntensity: 0.35, side: THREE.DoubleSide }),
      candle: new THREE.MeshStandardMaterial({ color: '#F5F0E8', roughness: 0.45, metalness: 0 }),
      flame: new THREE.MeshStandardMaterial({ color: '#F5E6C8', emissive: '#E8D4A8', emissiveIntensity: 2.5 }),
      rug: new THREE.MeshStandardMaterial({ map: makeRugTex(), roughness: 0.97, metalness: 0 }),
      marble: new THREE.MeshPhysicalMaterial({ map: makeMarbleTex(), color: '#E8E0D4', roughness: 0.12, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.04, envMapIntensity: 0.6 }),
      marbleDk: new THREE.MeshPhysicalMaterial({ color: '#3A322C', roughness: 0.15, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.06 }),
      travertine: new THREE.MeshStandardMaterial({ color: '#D4C8B8', roughness: 0.45, metalness: 0 }),
      leather: new THREE.MeshStandardMaterial({ color: '#3E2B1C', roughness: 0.65, metalness: 0.02 }),
      linen: new THREE.MeshStandardMaterial({ color: '#E8DDD0', roughness: 0.95, metalness: 0 }),
      bronze: new THREE.MeshStandardMaterial({ color: '#6B4E2E', roughness: 0.25, metalness: 0.88 }),
      blackSteel: new THREE.MeshStandardMaterial({ color: '#1A1614', roughness: 0.3, metalness: 0.8 }),
      fireGlow: new THREE.MeshBasicMaterial({ map: makeFireTex(), transparent: true, opacity: 0.9, side: THREE.DoubleSide }),
      led: new THREE.MeshBasicMaterial({ color: '#F5E0B8' }),
      curtain: new THREE.MeshStandardMaterial({ color: '#E0D4C4', roughness: 0.96, metalness: 0, side: THREE.DoubleSide }),
      mirror: new THREE.MeshStandardMaterial({ color: '#F5F0E8', roughness: 0.02, metalness: 0.98, envMapIntensity: 1.5 }),
    };

    // ============================================================
    // GEOMETRY HELPERS (reusable, rounded)
    // ============================================================
    function box(w, h, d, mat, px, py, pz) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(Math.max(EPS, w), Math.max(EPS, h), Math.max(EPS, d), 1, 1, 1), mat);
      m.position.set(px, py, pz); m.castShadow = true; m.receiveShadow = true;
      return m;
    }

    function rBox(w, h, d, r, mat, px, py, pz, seg) {
      // Rounded box using ExtrudeGeometry for bevel
      const s = seg || 2;
      const shape = new THREE.Shape();
      const hw = w / 2, hh = h / 2, cr = Math.min(r, hw, hh);
      shape.moveTo(-hw + cr, -hh);
      shape.lineTo(hw - cr, -hh);
      shape.quadraticCurveTo(hw, -hh, hw, -hh + cr);
      shape.lineTo(hw, hh - cr);
      shape.quadraticCurveTo(hw, hh, hw - cr, hh);
      shape.lineTo(-hw + cr, hh);
      shape.quadraticCurveTo(-hw, hh, -hw, hh - cr);
      shape.lineTo(-hw, -hh + cr);
      shape.quadraticCurveTo(-hw, -hh, -hw + cr, -hh);
      const geo = new THREE.ExtrudeGeometry(shape, { depth: Math.max(EPS, d), bevelEnabled: true, bevelThickness: Math.min(cr, 0.005), bevelSize: Math.min(cr, 0.005), bevelSegments: s, steps: 1 });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(px - d / 2, py, pz);
      m.castShadow = true; m.receiveShadow = true;
      return m;
    }

    function cyl(rT, rB, h, seg) {
      return new THREE.CylinderGeometry(Math.max(EPS, rT), Math.max(EPS, rB), Math.max(EPS, h), seg || 16);
    }

    function cylM(rT, rB, h, mat, px, py, pz, seg) {
      const m = new THREE.Mesh(cyl(rT, rB, h, seg), mat);
      m.position.set(px, py, pz); m.castShadow = true; m.receiveShadow = true;
      return m;
    }

    function torusM(R, r, mat, px, py, pz, seg) {
      const m = new THREE.Mesh(new THREE.TorusGeometry(Math.max(EPS, R), Math.max(EPS, r), 8, seg || 24), mat);
      m.position.set(px, py, pz); m.castShadow = true;
      return m;
    }

    function lathe(pts, mat, px, py, pz, seg) {
      const m = new THREE.Mesh(new THREE.LatheGeometry(pts, seg || 20), mat);
      m.position.set(px, py, pz); m.castShadow = true; m.receiveShadow = true;
      return m;
    }

    // ============================================================
    // ANIMATION TRACKERS
    // ============================================================
    const animData = {
      candleLight: null, flameMesh: null, fireLight: null, fireMesh: null,
      sunLight: null, leaves: [], curtainMeshes: [],
      dustParticles: null, introProgress: 0, introDone: false,
      breathOffset: 0, wallCandleLights: [], wallFlameMeshes: []
    };

    // ============================================================
    // ROOM ARCHITECTURE
    // ============================================================
    function buildRoom() {
      const hw = RW / 2, hd = RD / 2;

      // Exterior material (unlit, shaded off-white) to match wall color without glowing
      const matExt = new THREE.MeshBasicMaterial({ color: '#C8C0B8' });

      // Floor
      const flGeo = new THREE.BoxGeometry(RW, 0.1, RD);
      const fl = new THREE.Mesh(flGeo, [matExt, matExt, MAT.floor, matExt, matExt, matExt]);
      fl.position.set(0, -0.05, 0);
      fl.receiveShadow = true; scene.add(fl);

      // Back wall
      const bwGeo = new THREE.BoxGeometry(RW, RH, 0.14);
      const bw = new THREE.Mesh(bwGeo, [matExt, matExt, matExt, matExt, MAT.wall, matExt]);
      bw.position.set(0, RH / 2, -hd - 0.07);
      bw.castShadow = true; bw.receiveShadow = true; scene.add(bw);

      // Left wall
      const lwGeo = new THREE.BoxGeometry(0.14, RH, RD);
      const lw = new THREE.Mesh(lwGeo, [MAT.wall, matExt, matExt, matExt, matExt, matExt]);
      lw.position.set(-hw - 0.07, RH / 2, 0);
      lw.castShadow = true; lw.receiveShadow = true; scene.add(lw);

      // Floating ceiling with gap
      // Ceiling removed

      // Ceiling beams
      // Beams removed

      // Hidden LED strips removed to prevent back-side glow

      // LED light emission removed completely to fix hotspots on the walls

      // Crown moulding — 3-layer profile
      const crownY = RH - 0.15;
      scene.add(box(RW, 0.035, 0.05, MAT.cream, 0, crownY, -hd + 0.025));
      scene.add(box(RW, 0.025, 0.035, MAT.cream, 0, crownY + 0.03, -hd + 0.04));
      scene.add(box(RW, 0.015, 0.02, MAT.cream, 0, crownY + 0.05, -hd + 0.05));
      // Left wall crown
      scene.add(box(0.05, 0.035, RD, MAT.cream, -hw + 0.025, crownY, 0));
      scene.add(box(0.035, 0.025, RD, MAT.cream, -hw + 0.04, crownY + 0.03, 0));
      scene.add(box(0.02, 0.015, RD, MAT.cream, -hw + 0.05, crownY + 0.05, 0));

      // Baseboards
      scene.add(box(RW, 0.16, 0.04, MAT.base, 0, 0.08, -hd + 0.02));
      scene.add(box(0.04, 0.16, RD, MAT.base, -hw + 0.02, 0.08, 0));
      // Baseboard top cap
      scene.add(box(RW, 0.02, 0.05, MAT.cream, 0, 0.17, -hd + 0.025));
      scene.add(box(0.05, 0.02, RD, MAT.cream, -hw + 0.025, 0.17, 0));
    }

    // ============================================================
    // WINDOW
    // ============================================================
    function buildWindow() {
      const wx = -RW / 2 - 0.07, wy = 2.2, wz = 0.3, ww = 1.8, wh = 2.6;

      // Exterior sky plane
      const sky = new THREE.Mesh(new THREE.PlaneGeometry(ww, wh), new THREE.MeshBasicMaterial({ color: '#F5F0E8' }));
      sky.position.set(wx - 0.1, wy, wz); sky.rotation.y = Math.PI / 2; scene.add(sky);

      // Glass panes (2x2)
      const halfW = ww / 2 - 0.025, halfH = wh / 2 - 0.025;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dy]) => {
        const g = new THREE.Mesh(new THREE.PlaneGeometry(halfW, halfH), MAT.glass);
        g.position.set(wx, wy + dy * (halfH / 2 + 0.025), wz + dx * (halfW / 2 + 0.025));
        g.rotation.y = Math.PI / 2; scene.add(g);
      });

      // Frame — outer
      const fw = 0.05, fm = MAT.bFrame;
      scene.add(box(fw, wh + fw * 2, fw, fm, wx, wy, wz - ww / 2 - fw / 2));
      scene.add(box(fw, wh + fw * 2, fw, fm, wx, wy, wz + ww / 2 + fw / 2));
      scene.add(box(ww + fw * 2, fw, fw, fm, wx, wy + wh / 2 + fw / 2, wz));
      scene.add(box(ww + fw * 2, fw, fw, fm, wx, wy - wh / 2 - fw / 2, wz));
      // Cross mullions
      scene.add(box(fw * 0.7, wh, fw * 0.7, fm, wx, wy, wz));
      scene.add(box(ww, fw * 0.7, fw * 0.7, fm, wx, wy, wz));

      // Window sill — marble
      scene.add(box(0.22, 0.035, ww + 0.18, MAT.marble, wx - 0.03, wy - wh / 2 - 0.06, wz));

      // Pediment
      scene.add(box(0.1, 0.05, ww + 0.14, MAT.cream, wx - 0.01, wy + wh / 2 + fw + 0.025, wz));

      // Luxury curtains
      buildCurtains(wx, wy, wz, ww, wh);
    }

    function buildCurtains(wx, wy, wz, ww, wh) {
      const curtainW = 0.35, curtainH = wh + 0.3;
      // Left curtain panel
      const lCurtain = new THREE.Mesh(
        new THREE.PlaneGeometry(curtainW, curtainH, 12, 20),
        MAT.curtain
      );
      lCurtain.position.set(wx + 0.08, wy - 0.1, wz - ww / 2 - curtainW / 2 + 0.05);
      lCurtain.rotation.y = Math.PI / 2;
      lCurtain.castShadow = true;
      // Add gentle wave to vertices
      const lPos = lCurtain.geometry.attributes.position;
      for (let i = 0; i < lPos.count; i++) {
        const y = lPos.getY(i);
        const x = lPos.getX(i);
        lPos.setZ(i, Math.sin(x * 8 + y * 2) * 0.02 + Math.sin(x * 3) * 0.015);
      }
      lPos.needsUpdate = true;
      lCurtain.geometry.computeVertexNormals();
      scene.add(lCurtain);
      animData.curtainMeshes.push(lCurtain);

      // Right curtain panel
      const rCurtain = lCurtain.clone();
      rCurtain.position.set(wx + 0.08, wy - 0.1, wz + ww / 2 + curtainW / 2 - 0.05);
      scene.add(rCurtain);
      animData.curtainMeshes.push(rCurtain);

      // Curtain rod
      cylM(0.015, 0.015, ww + curtainW * 2 + 0.2, MAT.brass, wx + 0.04, wy + wh / 2 + 0.1, wz, 12);
      // Finials
      const finL = lathe([
        new THREE.Vector2(EPS, 0), new THREE.Vector2(0.02, 0.01),
        new THREE.Vector2(0.025, 0.04), new THREE.Vector2(0.018, 0.06),
        new THREE.Vector2(EPS, 0.08)
      ], MAT.brass, wx + 0.04, wy + wh / 2 + 0.1, wz - ww / 2 - curtainW - 0.05, 10);
      const finR = lathe([
        new THREE.Vector2(EPS, 0), new THREE.Vector2(0.02, 0.01),
        new THREE.Vector2(0.025, 0.04), new THREE.Vector2(0.018, 0.06),
        new THREE.Vector2(EPS, 0.08)
      ], MAT.brass, wx + 0.04, wy + wh / 2 + 0.1, wz + ww / 2 + curtainW + 0.05, 10);

      // Rings on rod
      for (let i = 0; i < 8; i++) {
        const rz = wz - ww / 2 - curtainW + 0.1 + i * (ww + curtainW * 2 - 0.2) / 7;
        torusM(0.02, 0.005, MAT.brass, wx + 0.04, wy + wh / 2 + 0.1, rz, 12);
      }
    }

    // ============================================================
    // FIREPLACE
    // ============================================================
    function buildFireplace() {
      const g = new THREE.Group();
      const px = 0, py = 0, pz = -RD / 2 + 0.1;

      // Hearth base — marble
      g.add(box(2.0, 0.08, 0.5, MAT.marble, 0, 0.04, 0));

      // Main body — travertine stone
      g.add(box(1.8, 1.2, 0.35, MAT.travertine, 0, 0.68, -0.02));
      // Side columns
      g.add(box(0.18, 1.2, 0.38, MAT.travertine, -0.81, 0.68, -0.02));
      g.add(box(0.18, 1.2, 0.38, MAT.travertine, 0.81, 0.68, -0.02));

      // Mantel shelf — marble with overhang
      g.add(box(2.1, 0.06, 0.45, MAT.marble, 0, 1.31, 0));
      // Mantel underside bevel
      g.add(box(1.9, 0.03, 0.38, MAT.cream, 0, 1.265, -0.01));

      // Arch opening
      const archW = 1.1, archH = 0.9;
      // Back of firebox
      g.add(box(archW, archH, 0.02, MAT.dkWood, 0, 0.45 + archH / 2, -0.18));
      // Firebox floor
      g.add(box(archW, 0.04, 0.3, MAT.dkWood, 0, 0.12, -0.08));
      // Arch sides
      g.add(box(0.08, archH, 0.3, MAT.travertine, -archW / 2 - 0.04, 0.45 + archH / 2, -0.08));
      g.add(box(0.08, archH, 0.3, MAT.travertine, archW / 2 + 0.04, 0.45 + archH / 2, -0.08));

      // Arch top (half cylinder approximation using segments)
      const archGeo = new THREE.CylinderGeometry(Math.max(EPS, archW / 2), Math.max(EPS, archW / 2), 0.3, 16, 1, false, 0, Math.PI);
      const archMesh = new THREE.Mesh(archGeo, MAT.travertine);
      archMesh.rotation.x = Math.PI / 2;
      archMesh.rotation.z = Math.PI;
      archMesh.position.set(0, 0.45 + archH, -0.08);
      archMesh.castShadow = true;
      g.add(archMesh);

      // Fire glow plane
      const fireMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5), MAT.fireGlow);
      fireMesh.position.set(0, 0.35, -0.16);
      g.add(fireMesh);
      animData.fireMesh = fireMesh;

      // Fire light
      const fireLight = new THREE.PointLight('#FF9040', 1.5, 4, 1.5);
      fireLight.position.set(0, 0.4, -0.05);
      fireLight.castShadow = true;
      fireLight.shadow.mapSize.set(SHADOW_RES, SHADOW_RES);
      fireLight.shadow.radius = 6;
      g.add(fireLight);
      animData.fireLight = fireLight;

      // Decorative items on mantel
      // Pair of candle holders
      [-0.7, 0.7].forEach(xp => {
        g.add(cylM(0.04, 0.05, 0.02, MAT.brass, xp, 1.35, 0, 12));
        g.add(cylM(0.012, 0.012, 0.12, MAT.brass, xp, 1.42, 0, 8));
        // Small candle
        g.add(cylM(0.015, 0.015, 0.06, MAT.candle, xp, 1.51, 0, 8));
      });
      // Decorative bowl
      const bowlPts = [
        new THREE.Vector2(EPS, 0), new THREE.Vector2(0.08, 0),
        new THREE.Vector2(0.1, 0.02), new THREE.Vector2(0.12, 0.05),
        new THREE.Vector2(0.11, 0.07), new THREE.Vector2(0.09, 0.08),
      ];
      g.add(lathe(bowlPts, MAT.ceramic, 0, 1.35, 0.05, 16));

      g.position.set(px, py, pz);
      scene.add(g);
    }

    // ============================================================
    // RUG
    // ============================================================
    function buildRug() {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.8), MAT.rug);
      r.rotation.x = -Math.PI / 2; r.position.set(0.3, 0.006, -0.8);
      r.receiveShadow = true; scene.add(r);
    }

    // ============================================================
    // ART
    // ============================================================
    function buildArt() {
      const texs = [makeArtTex(0), makeArtTex(1)];
      const sizes = [[0.95, 1.2], [0.75, 0.95]];
      const pos = [[-1.5, 2.4], [1.8, 2.2]];
      const z = -RD / 2 + 0.01, fw = 0.045;

      sizes.forEach((s, i) => {
        const [w, h] = s;
        const [ax, ay] = pos[i];
        // Outer frame
        scene.add(box(w + fw * 2 + 0.05, fw + 0.025, fw, MAT.bFrame, ax, ay + h / 2 + fw / 2 + 0.012, z));
        scene.add(box(w + fw * 2 + 0.05, fw + 0.025, fw, MAT.bFrame, ax, ay - h / 2 - fw / 2 - 0.012, z));
        scene.add(box(fw + 0.025, h + 0.05, fw, MAT.bFrame, ax - w / 2 - fw / 2 - 0.012, ay, z));
        scene.add(box(fw + 0.025, h + 0.05, fw, MAT.bFrame, ax + w / 2 + fw / 2 + 0.012, ay, z));
        // Gold inner liner
        scene.add(box(w + 0.02, 0.012, 0.012, MAT.goldTrim, ax, ay + h / 2 + 0.006, z + 0.01));
        scene.add(box(w + 0.02, 0.012, 0.012, MAT.goldTrim, ax, ay - h / 2 - 0.006, z + 0.01));
        scene.add(box(0.012, h + 0.02, 0.012, MAT.goldTrim, ax - w / 2 - 0.006, ay, z + 0.01));
        scene.add(box(0.012, h + 0.02, 0.012, MAT.goldTrim, ax + w / 2 + 0.006, ay, z + 0.01));
        // Canvas
        const art = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: texs[i], roughness: 0.4 }));
        art.position.set(ax, ay, z + 0.018); scene.add(art);
      });

      // Large mirror between art pieces
      const mirrorW = 0.7, mirrorH = 1.6, mirrorX = 0.2, mirrorY = 2.1;
      scene.add(box(mirrorW + 0.06, 0.04, 0.04, MAT.bFrame, mirrorX, mirrorY + mirrorH / 2 + 0.02, z));
      scene.add(box(mirrorW + 0.06, 0.04, 0.04, MAT.bFrame, mirrorX, mirrorY - mirrorH / 2 - 0.02, z));
      scene.add(box(0.04, mirrorH + 0.06, 0.04, MAT.bFrame, mirrorX - mirrorW / 2 - 0.02, mirrorY, z));
      scene.add(box(0.04, mirrorH + 0.06, 0.04, MAT.bFrame, mirrorX + mirrorW / 2 + 0.02, mirrorY, z));
      // Gold top ornament
      torusM(0.04, 0.012, MAT.goldTrim, mirrorX, mirrorY + mirrorH / 2 + 0.06, z, 12);
      const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(mirrorW, mirrorH), MAT.mirror);
      mirrorGlass.position.set(mirrorX, mirrorY, z + 0.015);
      scene.add(mirrorGlass);
    }

    // ============================================================
    // CHESTERFIELD SOFA
    // ============================================================
    function buildSofa() {
      const g = new THREE.Group();
      // Base plinth
      g.add(box(2.8, 0.06, 1.05, MAT.dkWood, 0, 0.06, 0));
      // Seat — 3 cushions
      for (let i = -1; i <= 1; i++) {
        g.add(box(0.88, 0.2, 0.88, MAT.leatherTufted, i * 0.92, 0.19, 0.02));
      }
      // Back — 3 sections with rolled tops
      for (let i = -1; i <= 1; i++) {
        g.add(box(0.88, 0.45, 0.14, MAT.leatherTufted, i * 0.92, 0.515, -0.44));
        const roll = new THREE.Mesh(cyl(0.07, 0.07, 0.88, 12), MAT.leatherSolid);
        roll.rotation.order = 'YXZ'; roll.rotation.set(0, 0, Math.PI / 2);
        roll.position.set(i * 0.92, 0.77, -0.41); roll.castShadow = true; g.add(roll);
      }
      // Arms with scrolls
      [-1.35, 1.35].forEach(xp => {
        g.add(box(0.14, 0.32, 0.95, MAT.leatherTufted, xp, 0.42, 0.02));
        /* 
        const ar = new THREE.Mesh(cyl(0.06, 0.06, 0.95, 10), MAT.leatherSolid);
        ar.rotation.order = 'YXZ'; ar.rotation.set(0, 0, Math.PI / 2);
        ar.position.set(xp, 0.61, 0.02); ar.castShadow = true; g.add(ar);
        const scroll = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.065), 8, 6), MAT.leatherSolid);
        scroll.scale.set(1, 0.8, 1.1); scroll.position.set(xp, 0.45, 0.48);
        scroll.castShadow = true; g.add(scroll);
        */
      });
      // Nailhead trim
      for (let i = -12; i <= 12; i++) {
        g.add(new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.008), 4, 3), MAT.brass).translateX(i * 0.1).translateY(0.1).translateZ(0.46));
      }
      // Legs
      const legGeo = cyl(0.025, 0.035, 0.06, 10);
      [[-1.25, 0.03, 0.42], [1.25, 0.03, 0.42]].forEach(p => {
        g.add(new THREE.Mesh(legGeo, MAT.dkWood).translateX(p[0]).translateY(p[1]).translateZ(p[2]));
        g.add(new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.02), 6, 5), MAT.brass).translateX(p[0]).translateY(0.005).translateZ(p[2]));
      });
      [[-1.25, 0.03, -0.42], [1.25, 0.03, -0.42]].forEach(p => {
        g.add(new THREE.Mesh(cyl(0.02, 0.025, 0.06, 8), MAT.dkWood).translateX(p[0]).translateY(p[1]).translateZ(p[2]));
      });
      g.position.set(0.8, 0, -2.3);
      scene.add(g);
    }

    // ============================================================
    // COFFEE TABLE
    // ============================================================
    function buildCoffeeTable() {
      const g = new THREE.Group();
      g.add(box(1.3, 0.04, 0.7, MAT.marble, 0, 0.42, 0));
      g.add(box(1.32, 0.012, 0.72, MAT.goldTrim, 0, 0.396, 0));
      // Apron
      g.add(box(1.2, 0.06, 0.02, MAT.walnut, 0, 0.35, 0.32));
      g.add(box(1.2, 0.06, 0.02, MAT.walnut, 0, 0.35, -0.32));
      g.add(box(0.02, 0.06, 0.62, MAT.walnut, -0.6, 0.35, 0));
      g.add(box(0.02, 0.06, 0.62, MAT.walnut, 0.6, 0.35, 0));
      // Turned legs
      const legPts = [
        new THREE.Vector2(0.01, 0), new THREE.Vector2(0.03, 0.01),
        new THREE.Vector2(0.022, 0.06), new THREE.Vector2(0.028, 0.12),
        new THREE.Vector2(0.02, 0.2), new THREE.Vector2(0.032, 0.28),
        new THREE.Vector2(0.025, 0.32), new THREE.Vector2(0.035, 0.34),
      ];
      const legGeo = new THREE.LatheGeometry(legPts, 12);
      [[-0.56, 0, 0.28], [0.56, 0, 0.28], [-0.56, 0, -0.28], [0.56, 0, -0.28]].forEach(p => {
        const l = new THREE.Mesh(legGeo, MAT.walnut); l.position.set(...p); l.castShadow = true; g.add(l);
      });

      // Decorations on table
      // Stacked books
      const bColors = ['#2C2420', '#3E2B1C', '#4A3525', '#5A4E44'];
      let by = 0.44;
      bColors.forEach((c, i) => {
        const bw = 0.22 - i * 0.015;
        const b = new THREE.Mesh(new THREE.BoxGeometry(Math.max(EPS, bw), 0.03, 0.16),
          new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 }));
        b.position.set(-0.3 + i * 0.012, by + 0.015, -0.05);
        b.rotation.y = (i - 1) * 0.06;
        b.castShadow = true; g.add(b); by += 0.03;
      });

      // Ceramic vase
      const vp = [];
      for (let i = 0; i <= 16; i++) {
        const t = i / 16; let r;
        if (t < 0.06) r = t * 1.2;
        else if (t < 0.25) r = 0.072 + Math.sin((t - 0.06) / 0.19 * Math.PI * 0.5) * 0.06;
        else if (t < 0.55) r = 0.132 - (t - 0.25) / 0.3 * 0.01;
        else if (t < 0.7) r = 0.122 + (t - 0.55) / 0.15 * 0.025;
        else if (t < 0.85) r = 0.147 - (t - 0.7) / 0.15 * 0.05;
        else r = 0.097 + (t - 0.85) / 0.15 * 0.012;
        vp.push(new THREE.Vector2(Math.max(EPS, r), t * 0.24));
      }
      g.add(lathe(vp, MAT.ceramic, 0.3, 0.44, 0, 24));
      g.add(new THREE.Mesh(cyl(0.1, 0.11, 0.008, 24), MAT.goldTrim).translateX(0.3).translateY(0.68));

      // Dried stems
      const stMat = new THREE.MeshStandardMaterial({ color: '#7A6E63', roughness: 0.85 });
      for (let i = 0; i < 5; i++) {
        const sh = 0.15 + Math.random() * 0.1;
        const st = new THREE.Mesh(cyl(0.003, 0.004, sh, 5), stMat);
        const a = (i / 5) * Math.PI * 2 + Math.random() * 0.3;
        const d = 0.012 + Math.random() * 0.015;
        st.position.set(0.3 + Math.cos(a) * d, 0.68 + sh / 2, Math.sin(a) * d);
        st.rotation.x = (Math.random() - 0.5) * 0.25;
        st.rotation.z = (Math.random() - 0.5) * 0.25;
        g.add(st);
      }

      // Marble tray with items
      g.add(box(0.35, 0.012, 0.2, MAT.marble, 0.32, 0.438, 0.12));
      g.add(box(0.36, 0.008, 0.21, MAT.goldTrim, 0.32, 0.432, 0.12));
      // Reed diffuser on tray
      g.add(cylM(0.025, 0.028, 0.08, MAT.glassTint, 0.28, 0.478, 0.1, 10));
      for (let i = 0; i < 5; i++) {
        const reed = new THREE.Mesh(cyl(0.002, 0.002, 0.12, 4), new THREE.MeshStandardMaterial({ color: '#8A7E68', roughness: 0.9 }));
        reed.position.set(0.28 + (Math.random() - 0.5) * 0.015, 0.54, 0.1 + (Math.random() - 0.5) * 0.015);
        reed.rotation.x = (Math.random() - 0.5) * 0.15;
        reed.rotation.z = (Math.random() - 0.5) * 0.15;
        g.add(reed);
      }

      // Wine glass
      g.add(cylM(0.025, 0.02, 0.001, MAT.glass, 0.4, 0.445, 0.16, 12));
      g.add(cylM(0.003, 0.003, 0.05, MAT.glass, 0.4, 0.47, 0.16, 6));
      g.add(new THREE.Mesh(cyl(0.015, 0.025, 0.04, 10), MAT.glass).translateX(0.4).translateY(0.515).translateZ(0.16));

      g.position.set(0.8, 0, -0.85);
      scene.add(g);
    }

    // ============================================================
    // BOOKCASE
    // ============================================================
    function buildBookcase() {
      const g = new THREE.Group();
      const w = 0.9, h = 2.8, d = 0.32, th = 0.03;
      g.add(box(th + 0.01, h, d, MAT.walnut, -w / 2, h / 2, 0));
      g.add(box(th + 0.01, h, d, MAT.walnut, w / 2, h / 2, 0));
      g.add(box(w, h, th * 0.4, MAT.walnutL, 0, h / 2, -d / 2 + th * 0.2));
      const sN = 5;
      for (let i = 0; i <= sN; i++) g.add(box(w, th, d, MAT.walnut, 0, i * (h / sN), 0));
      g.add(box(w + 0.04, 0.04, d + 0.02, MAT.cream, 0, h + 0.02, 0.01));
      g.add(box(w + 0.02, 0.05, d + 0.02, MAT.walnut, 0, -0.025, 0.01));

      const palette = ['#2C2420', '#3E2B1C', '#4A3525', '#5A4E44', '#332B26', '#3A302A', '#473D35', '#2A2220'];
      for (let s = 0; s < sN; s++) {
        const sy = s * (h / sN) + th, sH = h / sN - th;
        let bx = -w / 2 + th + 0.02;
        const n = 5 + Math.floor(Math.random() * 3);
        for (let b = 0; b < n && bx < w / 2 - th - 0.02; b++) {
          const bw = 0.025 + Math.random() * 0.035;
          const bh = sH * (0.75 + Math.random() * 0.23);
          const bk = new THREE.Mesh(new THREE.BoxGeometry(Math.max(EPS, bw), Math.max(EPS, bh), Math.max(EPS, d * 0.6)),
            new THREE.MeshStandardMaterial({ color: palette[Math.floor(Math.random() * palette.length)], roughness: 0.78 }));
          bk.position.set(bx + bw / 2, sy + bh / 2, 0.02);
          if (Math.random() > 0.9) { bk.rotation.z = (Math.random() - 0.5) * 0.12; bk.position.y = sy + bh / 2 * Math.cos(bk.rotation.z); }
          bk.castShadow = true; g.add(bk); bx += bw + 0.003;
        }
      }

      // Cabinet LED strip removed

      g.position.set(-RW / 2 + 0.45, 0, -RD / 2 + 0.3);
      scene.add(g);
    }

    // ============================================================
    // DOG HOUSE
    // ============================================================
    function buildDogHouse() {
      const g = new THREE.Group();
      const w = 0.8, h = 0.6, d = 0.7;
      
      // Base
      g.add(box(w, 0.04, d, MAT.dkWood, 0, 0.02, 0));
      
      // Side walls (Cream)
      g.add(box(0.04, h, d, MAT.cream, -w/2 + 0.02, h/2 + 0.04, 0));
      g.add(box(0.04, h, d, MAT.cream, w/2 - 0.02, h/2 + 0.04, 0));
      
      // Back wall
      g.add(box(w - 0.08, h, 0.04, MAT.cream, 0, h/2 + 0.04, -d/2 + 0.02));
      
      // Front frame (Doorway)
      g.add(box(0.2, h, 0.04, MAT.cream, -w/2 + 0.1 + 0.04, h/2 + 0.04, d/2 - 0.02));
      g.add(box(0.2, h, 0.04, MAT.cream, w/2 - 0.1 - 0.04, h/2 + 0.04, d/2 - 0.02));
      g.add(box(w - 0.4 - 0.08, 0.15, 0.04, MAT.cream, 0, h - 0.075 + 0.04, d/2 - 0.02));
      
      // Classic slanting triangular roof
      const roofH = 0.25;
      const gableShape = new THREE.Shape();
      gableShape.moveTo(-w/2, 0);
      gableShape.lineTo(w/2, 0);
      gableShape.lineTo(0, roofH);
      gableShape.lineTo(-w/2, 0);
      
      const extrudeSettings = { depth: 0.04, bevelEnabled: false };
      const gableGeo = new THREE.ExtrudeGeometry(gableShape, extrudeSettings);
      
      const gableFront = new THREE.Mesh(gableGeo, MAT.cream);
      gableFront.position.set(0, h + 0.04, d/2 - 0.04);
      g.add(gableFront);
      
      const gableBack = new THREE.Mesh(gableGeo, MAT.cream);
      gableBack.position.set(0, h + 0.04, -d/2);
      g.add(gableBack);

      const pitchAngle = Math.atan2(roofH, w/2);
      const roofSideW = Math.sqrt(roofH*roofH + (w/2)*(w/2)) + 0.12; // Overhang
      
      const pitchL = box(roofSideW, 0.04, d + 0.12, MAT.walnut, 0, 0, 0);
      pitchL.rotation.z = pitchAngle;
      pitchL.position.set(-w/4 - 0.03, h + 0.04 + roofH/2 + 0.01, 0);
      g.add(pitchL);
      
      const pitchR = box(roofSideW, 0.04, d + 0.12, MAT.walnut, 0, 0, 0);
      pitchR.rotation.z = -pitchAngle;
      pitchR.position.set(w/4 + 0.03, h + 0.04 + roofH/2 + 0.01, 0);
      g.add(pitchR);
      
      // Plush dog bed inside
      const bed = cylM(0.25, 0.25, 0.08, MAT.fabric, 0, 0.08, 0.05, 16);
      bed.scale.z = 0.8;
      g.add(bed);

      // Cute small food bowl outside
      g.add(cylM(0.08, 0.06, 0.04, MAT.ceramic, 0.45, 0.02, 0.3, 16));
      g.add(cylM(0.07, 0.07, 0.01, new THREE.MeshStandardMaterial({color: '#554433'}), 0.45, 0.035, 0.3, 16)); // kibble
      
      // Position near the left wall exactly under the brand name (z = 0)
      // Rotate so the entrance faces the room center (+X)
      g.rotation.y = Math.PI / 2;
      g.position.set(-3.5, 0, 0); 
      
      scene.add(g);
    }

    // ============================================================
    // ANIMATED DOG
    // ============================================================
    function buildDog() {
      const g = new THREE.Group();
      
      const dogMat = new THREE.MeshStandardMaterial({ color: '#FDFBF7', roughness: 0.95 });
      const darkMat = new THREE.MeshStandardMaterial({ color: '#3A2E20', roughness: 0.9 });
      
      // Body
      const body = box(0.18, 0.18, 0.35, dogMat, 0, 0.2, 0);
      g.add(body);
      
      // Head
      const headG = new THREE.Group();
      const head = box(0.16, 0.16, 0.16, dogMat, 0, 0, 0);
      headG.add(head);
      const snout = box(0.1, 0.08, 0.1, dogMat, 0, -0.02, 0.1);
      headG.add(snout);
      const nose = box(0.04, 0.03, 0.02, darkMat, 0, 0.01, 0.16);
      headG.add(nose);
      
      // Ears
      const earL = box(0.02, 0.1, 0.06, darkMat, -0.09, 0.02, -0.04);
      earL.rotation.z = 0.2;
      headG.add(earL);
      const earR = box(0.02, 0.1, 0.06, darkMat, 0.09, 0.02, -0.04);
      earR.rotation.z = -0.2;
      headG.add(earR);
      
      headG.position.set(0, 0.32, 0.18);
      g.add(headG);
      
      // Legs (pivots at top)
      const legGeo = new THREE.BoxGeometry(0.05, 0.16, 0.05);
      legGeo.translate(0, -0.08, 0);
      
      const legFL = new THREE.Mesh(legGeo, dogMat);
      legFL.position.set(-0.07, 0.15, 0.12);
      g.add(legFL);
      
      const legFR = new THREE.Mesh(legGeo, dogMat);
      legFR.position.set(0.07, 0.15, 0.12);
      g.add(legFR);
      
      const legBL = new THREE.Mesh(legGeo, dogMat);
      legBL.position.set(-0.07, 0.15, -0.12);
      g.add(legBL);
      
      const legBR = new THREE.Mesh(legGeo, dogMat);
      legBR.position.set(0.07, 0.15, -0.12);
      g.add(legBR);
      
      // Tail
      const tailGeo = new THREE.BoxGeometry(0.03, 0.18, 0.03);
      tailGeo.translate(0, 0.09, 0);
      const tail = new THREE.Mesh(tailGeo, dogMat);
      tail.position.set(0, 0.25, -0.16);
      tail.rotation.x = -Math.PI / 4;
      g.add(tail);
      
      g.position.set(-3.5, 0, 0); // Start at doghouse
      g.rotation.y = Math.PI / 2;
      
      g.traverse(c => { if ((c as any).isMesh) { (c as any).castShadow = true; (c as any).receiveShadow = true; } });
      scene.add(g);
      
      (animData as any).dog = {
        group: g, head: headG, tail: tail,
        legs: [legFL, legFR, legBL, legBR],
        state: 'sleep',
        timer: 0,
        pathIndex: 0,
        startX: -3.5, startZ: 0
      };
    }

    // ============================================================
    // DISPLAY CABINET
    // ============================================================
    function buildDisplayCabinet() {
      const g = new THREE.Group();
      const w = 0.8, h = 1.5, d = 0.3;
      // Body — dark wood
      g.add(box(w, h, d, MAT.walnut, 0, h / 2, 0));
      // Hollow out interior (lighter interior)
      g.add(box(w - 0.06, h - 0.12, d - 0.04, MAT.walnutL, 0, h / 2, 0.01));
      // Glass front
      const glassFront = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, h - 0.12), MAT.glass);
      glassFront.position.set(0, h / 2, d / 2 + 0.005); g.add(glassFront);
      // Shelves
      for (let i = 1; i < 4; i++) g.add(box(w - 0.04, 0.015, d - 0.06, MAT.marble, 0, i * h / 4, 0.01));
      // Gold trim
      g.add(box(w + 0.02, 0.015, 0.015, MAT.goldTrim, 0, h + 0.007, d / 2 + 0.005));
      g.add(box(w + 0.02, 0.015, 0.015, MAT.goldTrim, 0, -0.007, d / 2 + 0.005));
      // Legs
      const lGeo = cyl(0.015, 0.02, 0.08, 8);
      [[-w / 2 + 0.04, 0.04, d / 2 - 0.04], [w / 2 - 0.04, 0.04, d / 2 - 0.04], [-w / 2 + 0.04, 0.04, -d / 2 + 0.04], [w / 2 - 0.04, 0.04, -d / 2 + 0.04]].forEach(p => {
        g.add(new THREE.Mesh(lGeo, MAT.brass).translateX(p[0]).translateY(p[1]).translateZ(p[2]));
      });
      // Items inside
      // Ceramic figures
      g.add(cylM(0.025, 0.03, 0.08, MAT.ceramic, -0.15, 0.12, 0.02, 10));
      g.add(new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.025), 8, 6), MAT.ceramic).translateX(-0.15).translateY(0.18).translateZ(0.02));
      // Small box
      g.add(box(0.06, 0.04, 0.05, MAT.walnutL, 0.2, 0.1, 0.02));
      g.add(box(0.062, 0.008, 0.052, MAT.goldTrim, 0.2, 0.122, 0.02));

      g.position.set(-RW / 2 + 0.45, 0, -1.0);
      scene.add(g);
    }

    // ============================================================
    // FLOOR LAMP
    // ============================================================
    function buildFloorLamp() {
      const g = new THREE.Group();
      g.add(cylM(0.18, 0.22, 0.03, MAT.brass, 0, 0.015, 0, 20));
      g.add(cylM(0.14, 0.16, 0.02, MAT.brass, 0, 0.04, 0, 20));
      g.add(torusM(0.1, 0.012, MAT.brass, 0, 0.12, 0, 16));
      g.add(cylM(0.016, 0.016, 1.65, MAT.brass, 0, 0.86, 0, 12));
      g.add(torusM(0.028, 0.006, MAT.brass, 0, 0.5, 0, 12));
      // Shade — wider bell
      const shade = new THREE.Mesh(new THREE.CylinderGeometry(Math.max(EPS, 0.1), Math.max(EPS, 0.26), 0.38, 24, 1, true), MAT.shade);
      shade.position.set(0, 1.82, 0); g.add(shade);
      const cap = new THREE.Mesh(new THREE.CircleGeometry(Math.max(EPS, 0.1), 24), MAT.shade);
      cap.rotation.x = -Math.PI / 2; cap.position.set(0, 2.01, 0); g.add(cap);
      g.add(torusM(0.26, 0.008, MAT.goldTrim, 0, 1.63, 0, 24));
      g.add(torusM(0.1, 0.006, MAT.goldTrim, 0, 2.01, 0, 20));
      const pl = new THREE.PointLight('#F5E6C8', 0.8, 5.5, 1.5);
      pl.position.set(0, 1.72, 0); pl.castShadow = true;
      pl.shadow.mapSize.set(SHADOW_RES, SHADOW_RES); pl.shadow.radius = 5;
      g.add(pl);
      g.position.set(2.8, 0, -2.6);
      scene.add(g);
    }

    // ============================================================
    // WINGBACK ARMCHAIR
    // ============================================================
    function buildArmchair() {
      const g = new THREE.Group();
      g.add(box(0.9, 0.06, 0.82, MAT.dkWood, 0, 0.06, 0));
      g.add(box(0.78, 0.2, 0.72, MAT.leatherTufted, 0, 0.19, 0.02));
      g.add(box(0.78, 0.6, 0.1, MAT.leatherTufted, 0, 0.59, -0.34));
      const bRoll = new THREE.Mesh(cyl(0.06, 0.06, 0.78, 10), MAT.leatherSolid);
      bRoll.rotation.order = 'YXZ'; bRoll.rotation.set(0, 0, Math.PI / 2);
      bRoll.position.set(0, 0.92, -0.31); bRoll.castShadow = true; g.add(bRoll);
      [-0.42, 0.42].forEach(xp => {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.48, 0.35), MAT.leatherTufted);
        wing.position.set(xp, 0.62, -0.2); wing.rotation.y = xp > 0 ? -0.15 : 0.15;
        wing.castShadow = true; g.add(wing);
        /*
        const wRoll = new THREE.Mesh(cyl(0.04, 0.04, 0.35, 8), MAT.leatherSolid);
        wRoll.rotation.order = 'YXZ'; wRoll.rotation.set(0, xp > 0 ? -0.15 : 0.15, Math.PI / 2);
        wRoll.position.set(xp + (xp > 0 ? 0.025 : -0.025), 0.88, -0.2);
        wRoll.castShadow = true; g.add(wRoll);
        */
      });
      [-0.42, 0.42].forEach(xp => {
        g.add(box(0.1, 0.16, 0.72, MAT.leatherTufted, xp, 0.36, 0.02));
        const scroll = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.055), 7, 5), MAT.leatherSolid);
        scroll.scale.set(1, 0.75, 1); scroll.position.set(xp, 0.38, 0.37);
        scroll.castShadow = true; g.add(scroll);
      });
      for (let i = -4; i <= 4; i++) [-0.42, 0.42].forEach(xp => {
        g.add(new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.006), 4, 3), MAT.brass).translateX(xp).translateY(0.29).translateZ(i * 0.08));
      });
      [[-0.36, 0.03, 0.34], [0.36, 0.03, 0.34]].forEach(p => {
        g.add(new THREE.Mesh(cyl(0.022, 0.03, 0.06, 10), MAT.dkWood).translateX(p[0]).translateY(p[1]).translateZ(p[2]));
        g.add(new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.018), 6, 5), MAT.brass).translateX(p[0]).translateY(0.005).translateZ(p[2]));
      });
      [[-0.36, 0.03, -0.34], [0.36, 0.03, -0.34]].forEach(p => {
        g.add(new THREE.Mesh(cyl(0.018, 0.022, 0.06, 8), MAT.dkWood).translateX(p[0]).translateY(p[1]).translateZ(p[2]));
      });
      g.position.set(-1.8, 0, -1.5); g.rotation.y = 0.4;
      scene.add(g);
    }

    // ============================================================
    // OTTOMAN
    // ============================================================
    function buildOttoman() {
      const g = new THREE.Group();
      g.add(box(0.7, 0.06, 0.5, MAT.dkWood, 0, 0.06, 0));
      g.add(box(0.65, 0.16, 0.45, MAT.leatherTufted, 0, 0.17, 0));
      // Piping
      g.add(torusM(0.25, 0.006, MAT.goldTrim, 0, 0.25, 0, 16));
      // Brass casters
      [[-0.28, 0.015, 0.18], [0.28, 0.015, 0.18], [-0.28, 0.015, -0.18], [0.28, 0.015, -0.18]].forEach(p => {
        g.add(new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.018), 6, 5), MAT.brass).translateX(p[0]).translateY(p[1]).translateZ(p[2]));
      });
      g.position.set(0.8, 0, -0.1);
      scene.add(g);
    }

    // ============================================================
    // CONSOLE TABLE
    // ============================================================
    function buildConsoleTable() {
      const g = new THREE.Group();
      // Marble top
      g.add(box(1.6, 0.035, 0.35, MAT.marble, 0, 0.82, 0));
      g.add(box(1.62, 0.01, 0.37, MAT.goldTrim, 0, 0.8, 0));
      // Legs — tapered
      const legPts = [
        new THREE.Vector2(0.015, 0), new THREE.Vector2(0.025, 0.1),
        new THREE.Vector2(0.018, 0.4), new THREE.Vector2(0.028, 0.7),
        new THREE.Vector2(0.02, 0.8),
      ];
      const legGeo = new THREE.LatheGeometry(legPts, 10);
      [[-0.7, 0.4, 0.12], [0.7, 0.4, 0.12], [-0.7, 0.4, -0.12], [0.7, 0.4, -0.12]].forEach(p => {
        g.add(new THREE.Mesh(legGeo, MAT.walnut).translateX(p[0]).translateY(p[1]).translateZ(p[2]));
      });
      // Lower shelf
      g.add(box(1.2, 0.015, 0.25, MAT.walnut, 0, 0.15, 0));

      // Decorations
      // Perfume bottle
      g.add(cylM(0.02, 0.025, 0.1, MAT.glassTint, -0.4, 0.88, 0, 10));
      g.add(cylM(0.015, 0.015, 0.03, MAT.goldTrim, -0.4, 0.945, 0, 8));
      // Decorative boxes
      g.add(box(0.08, 0.06, 0.06, MAT.walnutL, 0.1, 0.86, 0));
      g.add(box(0.065, 0.048, 0.048, MAT.ceramic, 0.1, 0.894, 0));
      g.add(box(0.07, 0.05, 0.05, MAT.walnut, 0.22, 0.865, 0.03));
      g.add(box(0.072, 0.008, 0.052, MAT.goldTrim, 0.22, 0.892, 0.03));
      // Small sculpture
      g.add(new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.04), 10, 8), MAT.bronze).translateX(-0.15).translateY(0.86).translateZ(0.05));
      g.add(cylM(0.025, 0.03, 0.02, MAT.marble, -0.15, 0.82, 0.05, 10));

      g.position.set(0.8, 0, -RD / 2 + 0.25);
      scene.add(g);
    }

    // ============================================================
    // MARBLE SIDE TABLE + CANDLE
    // ============================================================
    function buildSideTable() {
      const g = new THREE.Group();
      g.add(cylM(0.24, 0.24, 0.025, MAT.marble, 0, 0.565, 0, 20));
      g.add(torusM(0.24, 0.005, MAT.goldTrim, 0, 0.553, 0, 20));
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2;
        const leg = new THREE.Mesh(cyl(0.012, 0.016, 0.54, 8), MAT.brass);
        const tx = Math.cos(a) * 0.06, tz = Math.sin(a) * 0.06;
        leg.position.set(tx, 0.28, tz); leg.rotation.x = -tz * 1.5; leg.rotation.z = tx * 1.5;
        leg.castShadow = true; g.add(leg);
        g.add(new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.018), 6, 5), MAT.brass).translateX(tx * 1.6).translateY(0.018).translateZ(tz * 1.6));
      }
      g.add(torusM(0.08, 0.006, MAT.goldTrim, 0, 0.52, 0, 16));
      // Tapered candle
      const candlePts = [
        new THREE.Vector2(EPS, 0), new THREE.Vector2(0.02, 0),
        new THREE.Vector2(0.022, 0.04), new THREE.Vector2(0.02, 0.08),
        new THREE.Vector2(0.016, 0.11), new THREE.Vector2(0.008, 0.13),
      ];
      g.add(lathe(candlePts, MAT.candle, 0, 0.565, 0, 10));
      const wick = new THREE.Mesh(cyl(0.0015, 0.0015, 0.025, 4), new THREE.MeshBasicMaterial({ color: '#2C2420' }));
      wick.position.set(0, 0.695, 0); g.add(wick);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.01), 7, 5), MAT.flame);
      flame.scale.set(0.6, 1.5, 0.6); flame.position.set(0, 0.71, 0); g.add(flame);
      animData.flameMesh = flame;
      const cl = new THREE.PointLight('#F5E0B8', 0.8, 3, 2);
      cl.position.set(0, 0.72, 0); cl.castShadow = true;
      cl.shadow.mapSize.set(256, 256); cl.shadow.radius = 3;
      g.add(cl); animData.candleLight = cl;
      g.position.set(-1.4, 0, -0.2);
      scene.add(g);
    }

    // ============================================================
    // FLOATING SHELVES
    // ============================================================
    function buildFloatingShelves() {
      const shelfPositions = [
        { x: -RW / 2 + 0.15, y: 1.6, z: 0, rx: 0, ry: Math.PI / 2, rz: 0, w: 1.2, d: 0.2 },
      ];
      shelfPositions.forEach(sp => {
        const g = new THREE.Group();
        g.add(box(sp.w, 0.025, sp.d, MAT.walnut, 0, 0, 0));
        // Gold bracket underneath
        g.add(box(0.015, 0.08, sp.d - 0.04, MAT.goldTrim, -sp.w / 2 + 0.05, -0.04, 0));
        g.add(box(0.015, 0.08, sp.d - 0.04, MAT.goldTrim, sp.w / 2 - 0.05, -0.04, 0));
        // Items on shelf
        if (sp.w > 0.7) {
          // Small plant
          g.add(cylM(0.04, 0.035, 0.06, MAT.ceramic, -0.2, 0.055, 0, 10));
          g.add(new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.05), 8, 6), MAT.leaf).translateX(-0.2).translateY(0.11).translateZ(0));
          // Book
          g.add(box(0.04, 0.08, 0.06, MAT.walnutL, 0.15, 0.055, 0));
          // Frame
          g.add(box(0.1, 0.14, 0.01, MAT.bFrame, 0.0, 0.095, -sp.d / 2 + 0.02));
        } else {
          g.add(cylM(0.02, 0.018, 0.05, MAT.ceramic, 0.05, 0.05, 0, 8));
        }
        g.position.set(sp.x, sp.y, sp.z);
        g.rotation.y = sp.ry;
        scene.add(g);
      });
    }

    // ============================================================
    // PLANTS
    // ============================================================
    function buildPlantStand() {
      const g = new THREE.Group();
      
      // Stand Structure (Black steel with wood/marble shelves)
      const w = 0.5, d = 0.5, h = 1.8;
      
      // 4 Legs
      const legR = 0.015;
      g.add(cylM(legR, legR, h, MAT.blackSteel, -w/2, h/2, -d/2));
      g.add(cylM(legR, legR, h, MAT.blackSteel, w/2, h/2, -d/2));
      g.add(cylM(legR, legR, h, MAT.blackSteel, -w/2, h/2, d/2));
      g.add(cylM(legR, legR, h, MAT.blackSteel, w/2, h/2, d/2));
      
      // 3 Shelves
      const sy = [0.3, 1.0, 1.7];
      sy.forEach(y => {
        g.add(box(w + 0.04, 0.02, d + 0.04, MAT.walnut, 0, y, 0));
        // Small gold trim lip
        g.add(box(w + 0.04, 0.04, 0.01, MAT.goldTrim, 0, y + 0.01, -d/2 - 0.02));
        g.add(box(w + 0.04, 0.04, 0.01, MAT.goldTrim, 0, y + 0.01, d/2 + 0.02));
        g.add(box(0.01, 0.04, d + 0.04, MAT.goldTrim, -w/2 - 0.02, y + 0.01, 0));
        g.add(box(0.01, 0.04, d + 0.04, MAT.goldTrim, w/2 + 0.02, y + 0.01, 0));
      });

      // --- Top Shelf Plant (Fern) ---
      const pot1 = cylM(0.14, 0.1, 0.18, MAT.cream, 0, 1.7 + 0.09, 0);
      g.add(pot1);
      for(let i=0; i<12; i++) {
        const lf = new THREE.Mesh(new THREE.ConeGeometry(Math.max(EPS, 0.04), 0.4, 4), MAT.leaf);
        lf.position.set(0, 1.7 + 0.18, 0);
        const a = (i/12)*Math.PI*2;
        const euler = new THREE.Euler(Math.PI/2.5, a, 0, 'YXZ');
        lf.rotation.copy(euler);
        lf.position.x = Math.sin(a)*0.1;
        lf.position.z = Math.cos(a)*0.1;
        lf.position.y += 0.1;
        lf.castShadow = true;
        g.add(lf);
        animData.leaves.push(lf);
      }
      
      // --- Middle Shelf Plant (Trailing Vines) ---
      const pot2 = box(0.2, 0.18, 0.2, MAT.bFrame, 0, 1.0 + 0.09, 0);
      g.add(pot2);
      for(let i=0; i<8; i++) {
        const vineLen = 0.5 + Math.random()*0.4;
        const vine = cylM(0.006, 0.006, vineLen, MAT.leaf, 0, 1.0 + 0.18 - vineLen/2, 0);
        const a = (i/8)*Math.PI*2;
        vine.position.x = Math.sin(a)*0.12;
        vine.position.z = Math.cos(a)*0.12;
        for(let j=0; j<6; j++) {
           const lf = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.035), 4, 4), MAT.leafD);
           lf.position.set(
             vine.position.x + (Math.random()-0.5)*0.06, 
             vine.position.y + vineLen/2 - j*(vineLen/6) - 0.05, 
             vine.position.z + (Math.random()-0.5)*0.06
           );
           lf.castShadow = true;
           g.add(lf);
           animData.leaves.push(lf);
        }
        vine.castShadow = true;
        g.add(vine);
      }

      // --- Bottom Shelf Plant (Snake Plant) ---
      const pot3 = cylM(0.16, 0.13, 0.22, MAT.goldTrim, 0.1, 0.3 + 0.11, 0.1);
      g.add(pot3);
      for(let i=0; i<7; i++) {
        const lf = new THREE.Mesh(new THREE.ConeGeometry(Math.max(EPS, 0.035), 0.5, 4), MAT.leafD);
        lf.position.set(0.1 + (Math.random()-0.5)*0.08, 0.3 + 0.22 + 0.2, 0.1 + (Math.random()-0.5)*0.08);
        lf.rotation.set((Math.random()-0.5)*0.15, Math.random()*Math.PI, (Math.random()-0.5)*0.15);
        lf.castShadow = true;
        g.add(lf);
        animData.leaves.push(lf);
      }

      // Small secondary pot on bottom shelf
      const pot4 = cylM(0.1, 0.08, 0.14, MAT.cream, -0.15, 0.3 + 0.07, -0.1);
      g.add(pot4);
      const smallLeaf = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.1), 6, 6), MAT.leaf);
      smallLeaf.position.set(-0.15, 0.3 + 0.14 + 0.05, -0.1);
      smallLeaf.castShadow = true;
      g.add(smallLeaf);
      animData.leaves.push(smallLeaf);

      // Keep near the left wall under right candle lamp
      g.position.set(-3.5, 0, 1.8);
      scene.add(g);
    }

    // ============================================================
    // OLIVE TREE (corner)
    // ============================================================
    function buildOliveTree() {
      const g = new THREE.Group();
      // Tall trunk — slightly curved
      g.add(cylM(0.03, 0.045, 1.4, MAT.dkWood, 0, 0.7, 0, 8));
      // Branch
      const branch = new THREE.Mesh(cyl(0.015, 0.025, 0.5, 6), MAT.dkWood);
      branch.position.set(0.15, 1.2, 0.1);
      branch.rotation.z = -0.6; branch.rotation.x = 0.3;
      branch.castShadow = true; g.add(branch);
      // Canopy — soft cloud of spheres
      const canopyMat = new THREE.MeshStandardMaterial({ color: '#4A5A38', roughness: 0.8 });
      const canopyDark = new THREE.MeshStandardMaterial({ color: '#3A4A28', roughness: 0.82 });
      const canopyData = [
        [0, 1.55, 0, 0.25, 0.2, 0.22], [0.1, 1.6, 0.08, 0.2, 0.18, 0.2],
        [-0.08, 1.5, -0.05, 0.18, 0.15, 0.17], [0.2, 1.45, 0.15, 0.15, 0.13, 0.14],
        [-0.05, 1.65, 0.05, 0.17, 0.15, 0.16], [0.12, 1.7, -0.03, 0.14, 0.12, 0.13],
      ];
      canopyData.forEach((c, i) => {
        const m = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 1), 8, 6), i % 2 === 0 ? canopyMat : canopyDark);
        m.scale.set(c[3], c[4], c[5]); m.position.set(c[0], c[1], c[2]);
        m.castShadow = true; g.add(m);
        animData.leaves.push(m);
      });
      // Pot
      const potPts = [
        new THREE.Vector2(EPS, 0), new THREE.Vector2(0.16, 0),
        new THREE.Vector2(0.19, 0.03), new THREE.Vector2(0.22, 0.1),
        new THREE.Vector2(0.23, 0.2), new THREE.Vector2(0.22, 0.24),
      ];
      g.add(lathe(potPts, MAT.travertine, 0, 0, 0, 16));
      g.add(new THREE.Mesh(cyl(0.23, 0.22, 0.01, 16), MAT.travertine).translateY(0.245));

      g.position.set(2.8, 0, 2.2);
      scene.add(g);
    }

    // ============================================================
    // (Dust particles removed per request)

    // ============================================================
    // LIGHTING SYSTEM
    // ============================================================
    function setupLighting() {
      // Warm ambient
      scene.add(new THREE.AmbientLight('#F5EDE0', 0.2));

      // Key sun light — warm morning from window side
      const sun = new THREE.DirectionalLight('#FFE0B0', 1.2);
      sun.position.set(-5, 7, 2);
      sun.castShadow = true;
      sun.shadow.camera.left = -6; sun.shadow.camera.right = 6;
      sun.shadow.camera.top = 6; sun.shadow.camera.bottom = -6;
      sun.shadow.camera.near = 0.1; sun.shadow.camera.far = 20;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.radius = 6; sun.shadow.bias = -0.0006;
      scene.add(sun);
      animData.sunLight = sun;

      // Premium Gallery Spotlight for Brand Name (Light removed per request, keeping only the physical fixture)

      // Physical brass wall fixture removed per request
      /*
      const fixtureG = new THREE.Group();
      fixtureG.add(cylM(0.04, 0.04, 0.04, MAT.brass, -3.98, 3.6, 0, 16).rotateZ(Math.PI / 2)); // Wall mount
      fixtureG.add(cylM(0.015, 0.015, 1.0, MAT.brass, -3.5, 3.6, 0, 8).rotateZ(Math.PI / 2)); // Extended arm
      const housing = cylM(0.06, 0.08, 0.2, MAT.brass, 0, 0, 0, 16);
      housing.position.set(-3.0, 3.6, 0);
      housing.lookAt(-4.0, 1.8, 0); // Aim fixture at text
      housing.rotateX(-Math.PI / 2); // Point wide opening towards target
      fixtureG.add(housing);
      scene.add(fixtureG);
      */
      // Bounce fill from floor
      const bounce = new THREE.HemisphereLight('#E8DDD0', '#3E2B1C', 0.15);
      scene.add(bounce);

      // Fill from right
      const fill = new THREE.DirectionalLight('#F0E8D8', 0.18);
      fill.position.set(6, 3, -1); scene.add(fill);

      // Rim from behind
      const rim = new THREE.DirectionalLight('#E8DDD0', 0.12);
      rim.position.set(-1, 4, -6);
      scene.add(rim);
    }

    function buildLeftWallMoulding() {
      const g = new THREE.Group();

      // Wainscoting backing board (covers lower half of wall, length 7.0 matches wall exactly)
      g.add(box(0.015, 1.4, 7.0, MAT.floor, -3.99, 0.7, 0));

      // Chair rail (top border of wainscoting)
      g.add(box(0.045, 0.06, 7.0, MAT.floor, -3.9775, 1.4, 0));
      // Baseboard
      g.add(box(0.05, 0.15, 7.0, MAT.floor, -3.975, 0.075, 0));

      // Rectangular frames and raised panels
      function buildPanel(cz) {
        // Raised inner panel
        g.add(box(0.025, 1.0, 1.1, MAT.floor, -3.985, 0.75, cz));

        // Frame around the raised panel
        const cx = -3.96; // Protruding frame
        const fw = 1.2, fh = 1.1, th = 0.04, d = 0.02;
        g.add(box(d, th, fw + th, MAT.floor, cx, 0.75 + fh / 2, cz)); // Top
        g.add(box(d, th, fw + th, MAT.floor, cx, 0.75 - fh / 2, cz)); // Bottom
        g.add(box(d, fh - th, th, MAT.floor, cx, 0.75, cz - fw / 2)); // Left
        g.add(box(d, fh - th, th, MAT.floor, cx, 0.75, cz + fw / 2)); // Right
      }

      // Create 5 symmetric panels along the lower wall (fitting within z = -3.5 to 3.5)
      // 7.0 width / 5 = 1.4 spacing between centers
      const zPositions = [-2.8, -1.4, 0, 1.4, 2.8];
      zPositions.forEach(cz => buildPanel(cz));

      scene.add(g);
    }

    function buildBackWallMoulding() {
      const g = new THREE.Group();

      // Wainscoting backing board (covers lower half of wall, length 8.0 matches wall exactly)
      g.add(box(8.0, 1.4, 0.015, MAT.floor, 0, 0.7, -3.49));

      // Chair rail (top border of wainscoting)
      g.add(box(8.0, 0.06, 0.045, MAT.floor, 0, 1.4, -3.4775));
      // Baseboard
      g.add(box(8.0, 0.15, 0.05, MAT.floor, 0, 0.075, -3.475));

      // Rectangular frames and raised panels
      function buildPanel(cx) {
        // Raised inner panel
        g.add(box(1.3, 1.0, 0.025, MAT.floor, cx, 0.75, -3.485));

        // Frame around the raised panel
        const cz = -3.46; // Protruding frame
        const fw = 1.4, fh = 1.1, th = 0.04, d = 0.02;
        g.add(box(fw + th, th, d, MAT.floor, cx, 0.75 + fh / 2, cz)); // Top
        g.add(box(fw + th, th, d, MAT.floor, cx, 0.75 - fh / 2, cz)); // Bottom
        g.add(box(th, fh - th, d, MAT.floor, cx - fw / 2, 0.75, cz)); // Left
        g.add(box(th, fh - th, d, MAT.floor, cx + fw / 2, 0.75, cz)); // Right
      }

      // Create 5 symmetric panels along the back wall (fitting within x = -4.0 to 4.0)
      // 8.0 width / 5 = 1.6 spacing between centers
      const xPositions = [-3.2, -1.6, 0, 1.6, 3.2];
      xPositions.forEach(cx => buildPanel(cx));

      scene.add(g);
    }

    function buildBackWallMoulding() {
      const g = new THREE.Group();

      // Wainscoting backing board (covers lower half of wall, length 8.0 matches wall exactly)
      g.add(box(8.0, 1.4, 0.015, MAT.floor, 0, 0.7, -3.49));

      // Chair rail (top border of wainscoting)
      g.add(box(8.0, 0.06, 0.045, MAT.floor, 0, 1.4, -3.4775));
      // Baseboard
      g.add(box(8.0, 0.15, 0.05, MAT.floor, 0, 0.075, -3.475));

      // Rectangular frames and raised panels
      function buildPanel(cx) {
        // Raised inner panel
        g.add(box(1.3, 1.0, 0.025, MAT.floor, cx, 0.75, -3.485));

        // Frame around the raised panel
        const cz = -3.46; // Protruding frame
        const fw = 1.4, fh = 1.1, th = 0.04, d = 0.02;
        g.add(box(fw + th, th, d, MAT.floor, cx, 0.75 + fh / 2, cz)); // Top
        g.add(box(fw + th, th, d, MAT.floor, cx, 0.75 - fh / 2, cz)); // Bottom
        g.add(box(th, fh - th, d, MAT.floor, cx - fw / 2, 0.75, cz)); // Left
        g.add(box(th, fh - th, d, MAT.floor, cx + fw / 2, 0.75, cz)); // Right
      }

      // Create 5 symmetric panels along the back wall (fitting within x = -4.0 to 4.0)
      // 8.0 width / 5 = 1.6 spacing between centers
      const xPositions = [-3.2, -1.6, 0, 1.6, 3.2];
      xPositions.forEach(cx => buildPanel(cx));

      scene.add(g);
    }

    function buildBrandSconces() {
      const zs = [-1.8, 1.8]; // Left and right of the brand name
          zs.forEach((z, i) => {
            const g = new THREE.Group();
            const px = -3.98;

            // Brass wall plate
            g.add(cylM(0.06, 0.06, 0.02, MAT.brass, px, 2.4, z).rotateZ(Math.PI / 2));

            // Curved arm extending outwards and up
            g.add(cylM(0.01, 0.01, 0.15, MAT.brass, px + 0.075, 2.4, z).rotateZ(Math.PI / 2));
            g.add(cylM(0.01, 0.01, 0.08, MAT.brass, px + 0.14, 2.44, z));

            // Candle base plate
            g.add(cylM(0.04, 0.04, 0.01, MAT.brass, px + 0.14, 2.48, z));

            // The wax candle
            g.add(cylM(0.025, 0.025, 0.1, MAT.cream, px + 0.14, 2.53, z));

            // The wick
            g.add(cylM(0.002, 0.002, 0.015, MAT.blackSteel, px + 0.14, 2.585, z));

            // The flame mesh (for visuals)
            const flameMat = new THREE.MeshBasicMaterial({ color: '#FFAA55', transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
            const flame = new THREE.Mesh(new THREE.ConeGeometry(0.008, 0.03, 8), flameMat);
            flame.position.set(px + 0.14, 2.6, z);
            g.add(flame);
            animData.wallFlameMeshes.push(flame);

            // Soft Glow Light (very soft)
            const glow = new THREE.PointLight('#F5E0B8', 0.1, 2.5, 2);
            glow.position.set(-3.82, 2.49, z);
            g.add(glow);
            animData.wallCandleLights.push(glow);

            scene.add(g);
          });
        }

        function buildTVConsole() {
          const g = new THREE.Group();

          // Console Body (Walnut)
          const w = 2.4, h = 0.45, d = 0.45;
          g.add(box(w, h, d, MAT.walnut, 0, h / 2, 0));

          // Marble Top
          g.add(box(w + 0.04, 0.03, d + 0.04, MAT.marble, 0, h + 0.015, 0));

          // Slatted/Fluted details on front AND back (since camera sees the back)
          for (let i = -1.1; i <= 1.1; i += 0.08) {
            g.add(box(0.03, h - 0.06, 0.02, MAT.dkWood, i, h / 2, -d / 2 - 0.01)); // Front (facing sofa)
            g.add(box(0.03, h - 0.06, 0.02, MAT.dkWood, i, h / 2, d / 2 + 0.01)); // Back (facing camera)
          }

          // Brass Legs
          const lw = w / 2 - 0.15;
          const ld = d / 2 - 0.1;
          [
            [-lw, -ld], [lw, -ld], [-lw, ld], [lw, ld]
          ].forEach(([lx, lz]) => {
            g.add(cylM(0.015, 0.01, 0.1, MAT.brass, lx, -0.05, lz));
          });
          const consoleY = 0.1;

          // The TV
          const tvG = new THREE.Group();
          // Base
          tvG.add(box(0.5, 0.015, 0.25, MAT.dkWood, 0, 0.0075, 0));
          // Neck
          tvG.add(box(0.12, 0.08, 0.05, MAT.blackSteel, 0, 0.04 + 0.015, 0));

          // Screen casing (ultra thin OLED style)
          const tvW = 1.8, tvH = 1.0, tvD = 0.015;
          const tvCenterY = 0.015 + 0.08 + tvH / 2;
          tvG.add(box(tvW, tvH, tvD, MAT.blackSteel, 0, tvCenterY, 0));

          // Glass screen panel (facing -Z local towards sofa)
          const matScreen = new THREE.MeshStandardMaterial({ color: '#030303', roughness: 0.1, metalness: 0.8 });
          tvG.add(box(tvW - 0.02, tvH - 0.02, 0.005, matScreen, 0, tvCenterY, -tvD / 2 - 0.002));

          tvG.position.set(0, h + 0.03, 0); // Place on top of marble
          g.add(tvG);

          // Aesthetic Flower Plant on Fancy Stands beside console
          const standMat = MAT.brass;
          const potMat = new THREE.MeshStandardMaterial({ color: '#2A2A2A', roughness: 0.9 }); // Matte dark charcoal pot
          const flowerMat = new THREE.MeshStandardMaterial({ color: '#F48FB1', roughness: 0.8 }); // Pink flowers
          
          [-1.4, 1.4].forEach(px => {
             const pG = new THREE.Group();
             
             // Fancy Stand (4 thin legs + ring)
             const legH = 0.45;
             const rad = 0.12;
             for (let i = 0; i < 4; i++) {
               const a = (i / 4) * Math.PI * 2 + Math.PI/4;
               pG.add(cylM(0.012, 0.008, legH, standMat, Math.sin(a)*rad, legH/2, Math.cos(a)*rad));
             }
             // Ring holding the pot
             pG.add(cylM(rad + 0.02, rad + 0.02, 0.02, standMat, 0, legH - 0.1, 0));
             
             // Minimalist Pot
             const potH = 0.3;
             pG.add(cylM(0.16, 0.14, potH, potMat, 0, legH - 0.1 + potH/2, 0));
             // Dirt
             const dirtY = legH - 0.1 + potH - 0.01;
             pG.add(cylM(0.14, 0.14, 0.02, MAT.dkWood, 0, dirtY, 0));
             
             // Flower Plant
             const flowerG = new THREE.Group();
             
             // Flowers and stems
             for(let i=0; i<8; i++) {
                const a = (i/8)*Math.PI*2;
                const stemH = 0.3 + Math.random()*0.2;
                const stem = cylM(0.008, 0.008, stemH, MAT.leaf, Math.sin(a)*0.08, stemH/2, Math.cos(a)*0.08);
                stem.rotation.x = Math.sin(a)*0.2;
                stem.rotation.z = Math.cos(a)*0.2;
                flowerG.add(stem);
                
                const fl = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.08), 12, 12), flowerMat);
                fl.position.set(
                  stem.position.x + Math.sin(stem.rotation.z)*0.1,
                  stemH,
                  stem.position.z - Math.sin(stem.rotation.x)*0.1
                );
                fl.scale.set(1, 0.6, 1);
                flowerG.add(fl);
                
                const core = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.04), 8, 8), MAT.goldTrim);
                core.position.copy(fl.position);
                core.position.y += 0.03;
                flowerG.add(core);
             }

             // Center flower
             flowerG.add(cylM(0.01, 0.01, 0.4, MAT.leaf, 0, 0.2, 0));
             const flC = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.1), 12, 12), flowerMat);
             flC.scale.set(1, 0.6, 1);
             flC.position.set(0, 0.4, 0);
             flowerG.add(flC);
             const coreC = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 0.05), 8, 8), MAT.goldTrim);
             coreC.position.set(0, 0.44, 0);
             flowerG.add(coreC);

             flowerG.position.set(0, dirtY, 0);
             pG.add(flowerG);

             pG.position.set(px, -0.1, 0); // On the floor
             g.add(pG);
          });

          // Position the whole assembly in front of coffee table
          g.position.set(0.8, consoleY, 2.2);

          scene.add(g);
        }

        // ============================================================
        // BUILD SCENE
        // ============================================================
        buildRoom();
        buildLeftWallMoulding();
        buildBackWallMoulding();
        buildBrandSconces();
        // buildWindow(); // removed per user request
        buildFireplace();
        buildRug();
        buildArt();
        buildSofa();
        buildCoffeeTable();
        buildTVConsole();
        buildBookcase();
        buildDisplayCabinet();
        buildFloorLamp();
        buildArmchair();
        buildOttoman();
        buildConsoleTable();
        buildSideTable();
        buildFloatingShelves();
        buildPlantStand();
        buildDogHouse();
        buildDog();
        // buildOliveTree(); // removed per user request
        // buildDustParticles(); (removed)
        setupLighting();

        // Photo frame with cursive brand name on left wall
        (function buildBrandPhotoFrame() {
          const w = 1.8, h = 1.0;
          const fw = 0.04; // Frame width
          const cx = -3.98; // Slightly off wall
          const cy = 2.4;
          const cz = 0;

          // 1. The Canvas / Paper
          const c = document.createElement('canvas');
          c.width = 1024; c.height = Math.round(1024 * (h / w));
          const ctx = c.getContext('2d');
          
          // Off-white paper background
          ctx.fillStyle = '#F8F5F0';
          ctx.fillRect(0, 0, c.width, c.height);
          
          // Cursive text
          ctx.fillStyle = '#1A1410';
          ctx.font = 'bold 160px "Jost", "Inter", "Helvetica Neue", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('VIKORE', c.width / 2, c.height / 2 - 120);
          ctx.fillText('VANA', c.width / 2, c.height / 2 + 120);

          const tex = new THREE.CanvasTexture(c);
          tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
          const mat = new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.9,
            metalness: 0.1,
          });
          const canvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
          canvasMesh.position.set(cx + 0.015, cy, cz);
          canvasMesh.rotation.y = Math.PI / 2;
          scene.add(canvasMesh);

          // 2. The 3D Photo Frame
          // Outer wood frame
          scene.add(box(0.02, fw, w + fw * 2, MAT.bFrame, cx + 0.01, cy + h / 2 + fw / 2, cz)); // Top
          scene.add(box(0.02, fw, w + fw * 2, MAT.bFrame, cx + 0.01, cy - h / 2 - fw / 2, cz)); // Bottom
          scene.add(box(0.02, h, fw, MAT.bFrame, cx + 0.01, cy, cz - w / 2 - fw / 2)); // Left
          scene.add(box(0.02, h, fw, MAT.bFrame, cx + 0.01, cy, cz + w / 2 + fw / 2)); // Right
          
          // Inner gold liner
          scene.add(box(0.025, 0.008, w, MAT.goldTrim, cx + 0.01, cy + h / 2 + 0.004, cz));
          scene.add(box(0.025, 0.008, w, MAT.goldTrim, cx + 0.01, cy - h / 2 - 0.004, cz));
          scene.add(box(0.025, h, 0.008, MAT.goldTrim, cx + 0.01, cy, cz - w / 2 - 0.004));
          scene.add(box(0.025, h, 0.008, MAT.goldTrim, cx + 0.01, cy, cz + w / 2 + 0.004));
        })();

        // ============================================================
        // GEOMETRY MERGING — reduces draw calls from ~500 to ~20
        // ============================================================
        (function mergeStaticGeometry() {
          // Collect all animated/dynamic meshes to exclude from merging
          const animated = new Set();
          [animData.flameMesh, animData.fireMesh].forEach(m => m && animated.add(m));
          animData.curtainMeshes.forEach(m => animated.add(m));
          animData.leaves.forEach(m => animated.add(m));
          animData.wallFlameMeshes.forEach(m => animated.add(m));
          const dogD = animData.dog;
          if (dogD) dogD.group.traverse(c => { if (c.isMesh) animated.add(c); });

          // Group static meshes by material
          const buckets = new Map();
          scene.traverse(obj => {
            if (!obj.isMesh || animated.has(obj)) return;
            // Skip multi-material meshes (e.g. room walls/floor with different faces)
            if (Array.isArray(obj.material)) return;
            const id = obj.material.uuid;
            if (!buckets.has(id)) buckets.set(id, { material: obj.material, meshes: [] });
            buckets.get(id).meshes.push(obj);
          });

          // Merge each material bucket into a single draw call
          buckets.forEach(({ material, meshes }) => {
            if (meshes.length < 3) return; // Not worth merging small groups
            const geos = [];
            let anyCast = false, anyReceive = false;
            for (const mesh of meshes) {
              mesh.updateWorldMatrix(true, false);
              let g = mesh.geometry.clone();
              g.applyMatrix4(mesh.matrixWorld); // Bake world transform into vertices
              // Normalize to non-indexed so all geometries are compatible for merging
              if (g.index) g = g.toNonIndexed();
              geos.push(g);
              if (mesh.castShadow) anyCast = true;
              if (mesh.receiveShadow) anyReceive = true;
            }
            let merged;
            try { merged = mergeGeometries(geos, false); } catch(e) { /* skip incompatible */ }
            geos.forEach(g => g.dispose());
            if (!merged) return;
            const m = new THREE.Mesh(merged, material);
            m.castShadow = anyCast;
            m.receiveShadow = anyReceive;
            scene.add(m);
            // Remove original individual meshes (Groups stay for lights/animated children)
            for (const mesh of meshes) {
              if (mesh.parent) mesh.parent.remove(mesh);
              mesh.geometry.dispose();
            }
          });
        })();

        // ============================================================
        // CINEMATIC INTRO
        // ============================================================
        const introDuration = 3.0;
        let introStart = -1;

        function easeInOutCubic(t) {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function updateIntro(dt) {
          if (animData.introDone) return;
          if (introStart < 0) introStart = clock.getElapsedTime();
          const elapsed = clock.getElapsedTime() - introStart;
          const progress = Math.min(elapsed / introDuration, 1);
          const eased = easeInOutCubic(progress);

          camera.position.lerpVectors(camIntro, camEnd, eased);
          controls.target.copy(camTarget);
          controls.update();

          if (progress >= 1) {
            animData.introDone = true;
            controls.enabled = true;
            if (!REDUCED) controls.autoRotate = true;


          }
        }

        // ============================================================
        // ANIMATION LOOP
        // ============================================================
        let animId;

        // Allow user to interrupt intro and drag immediately
        const handleInteraction = () => {
          if (!animData.introDone) {
            animData.introDone = true;
            controls.enabled = true;
            if (!REDUCED) controls.autoRotate = true;
          }
        };
        renderer.domElement.addEventListener('pointerdown', handleInteraction);
        renderer.domElement.addEventListener('touchstart', handleInteraction, { passive: true });

        let framesRendered = 0;
        let isLooping = true;
        
        function animate() {
          if (!isLooping) return;
          animId = requestAnimationFrame(animate);
          
          framesRendered++;
          if (!interactiveRef.current && framesRendered > 5) {
            isLooping = false; // Completely stop the loop
            return;
          }

          const dt = clock.getDelta();
          const t = clock.getElapsedTime();

          // Intro
          if (!animData.introDone) { updateIntro(dt); }

          // Candle flicker
          if (animData.wallCandleLights && !REDUCED) {
            animData.wallCandleLights.forEach((glow, i) => {
              const offset = i * 2.5; // Offset phase so they flicker differently
              glow.intensity = 0.1 + 0.04 * Math.sin((t + offset) * 8.3) + 0.02 * Math.sin((t + offset) * 14.1);
            });
            animData.wallFlameMeshes.forEach((flame, i) => {
              const offset = i * 2.5;
              flame.scale.x = 0.8 + 0.1 * Math.sin((t + offset) * 12);
              flame.scale.z = 0.8 + 0.1 * Math.sin((t + offset) * 12 + 1);
              flame.position.x = -3.82 + Math.sin((t + offset) * 8) * 0.0015;
              const baseZ = i === 0 ? -1.8 : 1.8;
              flame.position.z = baseZ + Math.cos((t + offset) * 8) * 0.0015;
            });
          }

          if (animData.candleLight && !REDUCED) {
            animData.candleLight.intensity = 0.55 + 0.22 * Math.sin(t * 9.3) + 0.14 * Math.sin(t * 15.1) + 0.08 * Math.sin(t * 24.7);
            if (animData.flameMesh) {
              animData.flameMesh.scale.x = 0.6 + 0.07 * Math.sin(t * 11);
              animData.flameMesh.scale.z = 0.6 + 0.07 * Math.sin(t * 11 + 1);
              animData.flameMesh.position.x = Math.sin(t * 7) * 0.0015;
              animData.flameMesh.position.z = Math.cos(t * 7) * 0.0015;
            }
          }

          // Fireplace flicker
          if (animData.fireLight && !REDUCED) {
            animData.fireLight.intensity = 1.2 + 0.5 * Math.sin(t * 6.2) + 0.3 * Math.sin(t * 10.5) + 0.2 * Math.sin(t * 17.3);
            animData.fireLight.position.x = Math.sin(t * 4) * 0.03;
            if (animData.fireMesh) {
              animData.fireMesh.material.opacity = 0.7 + 0.2 * Math.sin(t * 8);
            }
          }

          // Sunlight intensity change
          if (animData.sunLight && !REDUCED) {
            animData.sunLight.intensity = 1.1 + 0.1 * Math.sin(t * 0.15);
          }

          // Leaf sway
          if (!REDUCED) {
            animData.leaves.forEach((leaf, i) => {
              const phase = i * 1.3;
              leaf.rotation.x += Math.sin(t * 0.8 + phase) * 0.0003;
              leaf.rotation.z += Math.cos(t * 0.6 + phase) * 0.0002;
            });
          }

          // Curtain movement (disabled on mobile for performance)
          if (!REDUCED && !isMobile) {
            animData.curtainMeshes.forEach((curtain, ci) => {
              const pos = curtain.geometry.attributes.position;
              for (let i = 0; i < pos.count; i++) {
                const y = pos.getY(i), x = pos.getX(i);
                const baseZ = Math.sin(x * 8 + y * 2) * 0.02 + Math.sin(x * 3) * 0.015;
                pos.setZ(i, baseZ + Math.sin(t * 0.5 + y * 1.5 + ci * 2) * 0.008);
              }
              pos.needsUpdate = true;
            });
          }

          // Dog animation
          const dogData = (animData as any).dog;
          if (dogData && !REDUCED) {
            dogData.timer += dt;
            const group = dogData.group;
            
            // Tail wag
            dogData.tail.rotation.y = Math.sin(t * 15) * 0.4;
            
            // Path sequence
            const path = [
              { x: -3.5, z: 0, state: 'sleep', duration: 4.0 }, // Sleep in doghouse
              { x: -2.0, z: -3.0, state: 'run', speed: 0.8 }, // Route around display cabinet & armchair
              { x: 0.8, z: -3.0, state: 'run', speed: 0.8 }, // Run behind main sofa
              { x: 0.8, z: -1.5, state: 'jumpSofa', duration: 1.2 }, // Jump over main sofa and land before coffee table
              { x: 2.0, z: -1.0, state: 'run', speed: 0.8 }, // Run near bookcase
              { x: 1.5, z: 1.5, state: 'run', speed: 0.8 }, // Run near TV
              { x: -3.5, z: 0, state: 'run', speed: 1.0 }, // Run back home
            ];
            
            const currentStep = path[dogData.pathIndex];
            
            if (currentStep.state === 'sleep') {
              // Reset pose
              dogData.legs.forEach((leg: any) => leg.rotation.x = 0);
              dogData.head.rotation.y = Math.sin(t * 1.5) * 0.2; // gentle look around
              if (dogData.timer > currentStep.duration) {
                dogData.pathIndex = (dogData.pathIndex + 1) % path.length;
                dogData.timer = 0;
                dogData.startX = group.position.x;
                dogData.startZ = group.position.z;
              }
            } else if (currentStep.state === 'run') {
              const targetX = currentStep.x;
              const targetZ = currentStep.z;
              const dx = targetX - dogData.startX;
              const dz = targetZ - dogData.startZ;
              const dist = Math.sqrt(dx*dx + dz*dz);
              const duration = dist / currentStep.speed;
              
              const progress = Math.min(1.0, dogData.timer / duration);
              
              group.position.x = dogData.startX + dx * progress;
              group.position.z = dogData.startZ + dz * progress;
              
              const targetAngle = Math.atan2(dx, dz);
              // Lerp rotation for smoother turns
              const aDelta = targetAngle - group.rotation.y;
              const normalizedDelta = Math.atan2(Math.sin(aDelta), Math.cos(aDelta));
              group.rotation.y += normalizedDelta * Math.min(1.0, dt * 8);
              
              dogData.head.rotation.y = 0; // look straight ahead
              
              // Leg run cycle
              const runSpeed = 12;
              dogData.legs[0].rotation.x = Math.sin(t * runSpeed) * 0.7;
              dogData.legs[1].rotation.x = -Math.sin(t * runSpeed) * 0.7;
              dogData.legs[2].rotation.x = -Math.sin(t * runSpeed) * 0.7;
              dogData.legs[3].rotation.x = Math.sin(t * runSpeed) * 0.7;
              
              if (progress >= 1.0) {
                dogData.pathIndex = (dogData.pathIndex + 1) % path.length;
                dogData.timer = 0;
                dogData.startX = group.position.x;
                dogData.startZ = group.position.z;
              }
            } else if (currentStep.state === 'jumpSofa') {
              const targetX = currentStep.x;
              const targetZ = currentStep.z;
              const dx = targetX - dogData.startX;
              const dz = targetZ - dogData.startZ;
              
              const progress = Math.min(1.0, dogData.timer / currentStep.duration);
              
              group.position.x = dogData.startX + dx * progress;
              group.position.z = dogData.startZ + dz * progress;
              group.position.y = 4.5 * progress * (1 - progress); // max height ~1.1 to clear sofa heavily
              
              const targetAngle = Math.atan2(dx, dz);
              const aDelta = targetAngle - group.rotation.y;
              const normalizedDelta = Math.atan2(Math.sin(aDelta), Math.cos(aDelta));
              group.rotation.y += normalizedDelta * Math.min(1.0, dt * 10);
              
              // Tuck legs in during jump
              dogData.legs.forEach((leg: any) => leg.rotation.x = Math.PI / 4);
              
              if (progress >= 1.0) {
                group.position.y = 0;
                dogData.pathIndex = (dogData.pathIndex + 1) % path.length;
                dogData.timer = 0;
                dogData.startX = group.position.x;
                dogData.startZ = group.position.z;
              }
            }
          }

          // (Dust particles removed)

          controls.update();
          renderer.render(scene, camera);
        }
        
        startLoopRef.current = () => {
          if (!isLooping) {
            isLooping = true;
            clock.getDelta(); // Flush the massive delta time accumulated while paused
            animate();
          }
        };

        animate();

        const ro = new ResizeObserver(() => {
          const w = container.clientWidth;
          const h = container.clientHeight;
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        });
        ro.observe(container);

        return () => {
          cancelAnimationFrame(animId);
          renderer.domElement.removeEventListener('pointerdown', handleInteraction);
          renderer.domElement.removeEventListener('touchstart', handleInteraction);
          ro.disconnect();
          controls.dispose();
          renderer.dispose();
          if (container && renderer.domElement && container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
          }
        };
      }, []);

  return (
    <div className="w-full h-full relative z-10 pointer-events-auto">
      <div ref={mountRef} className="w-full h-full" />
      {/* CSS vignette — replaces GPU shader vignette for zero perf cost */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 55%, rgba(30,20,10,0.22) 100%)' }} />
    </div>
  );
}
