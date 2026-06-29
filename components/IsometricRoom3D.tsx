// @ts-nocheck
// Auto-generated from temp_room.html
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { SMAAPass } from "three/examples/jsm/postprocessing/SMAAPass.js";

export function IsometricRoom3D() {
  const mountRef = useRef<HTMLDivElement>(null);

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
    const SHADOW_RES = 1024;

    // ============================================================
    // RENDERER & CORE
    // ============================================================
    const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.touchAction = 'none';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // ============================================================
    // CAMERA
    // ============================================================
    const isMobile = width < 768;
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
    // POST-PROCESSING
    // ============================================================
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.18, 0.6, 0.85
    );
    composer.addPass(bloom);

    // Vignette + color correction
    const vignetteShader = {
      uniforms: {
        tDiffuse: { value: null },
        darkness: { value: 0.35 },
        offset: { value: 1.0 },
        warmth: { value: 0.02 }
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float darkness;
    uniform float offset;
    uniform float warmth;
    varying vec2 vUv;
    void main(){
      vec4 c=texture2D(tDiffuse,vUv);
      vec2 uv=(vUv-vec2(0.5))*vec2(offset);
      float v=1.0-dot(uv,uv);
      c.rgb*=mix(1.0,smoothstep(0.0,1.0,v),darkness);
      c.r+=warmth; c.b-=warmth*0.5;
      gl_FragColor=c;
    }`
    };
    const vignettePass = new ShaderPass(vignetteShader);
    composer.addPass(vignettePass);

    const smaa = new SMAAPass(width, height);
    composer.addPass(smaa);

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
      x.fillStyle = '#F0EBE3'; x.fillRect(0, 0, 256, 256);
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
      wall: new THREE.MeshStandardMaterial({ map: makeWallTex(), color: '#F0EBE3', roughness: 0.95, metalness: 0 }),
      wallPanel: new THREE.MeshStandardMaterial({ color: '#EDE5D8', roughness: 0.88, metalness: 0 }),
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
      breathOffset: 0
    };

    // ============================================================
    // ROOM ARCHITECTURE
    // ============================================================
    function buildRoom() {
      const hw = RW / 2, hd = RD / 2;

      // Floor
      const fl = box(RW, 0.1, RD, MAT.floor, 0, -0.05, 0);
      fl.receiveShadow = true; scene.add(fl);

      // Back wall
      scene.add(box(RW, RH, 0.14, MAT.wall, 0, RH / 2, -hd - 0.07));
      // Left wall
      scene.add(box(0.14, RH, RD, MAT.wall, -hw - 0.07, RH / 2, 0));

      // Floating ceiling with gap
      // Ceiling removed

      // Ceiling beams
      // Beams removed

      // Hidden LED strip (back edge of ceiling)
      const ledGeo = new THREE.BoxGeometry(RW - 0.4, 0.015, 0.03);
      const ledBack = new THREE.Mesh(ledGeo, MAT.led);
      ledBack.position.set(0, RH - 0.085, -hd + 0.2);
      scene.add(ledBack);
      const ledLeft = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.015, RD - 0.4), MAT.led);
      ledLeft.position.set(-hw + 0.2, RH - 0.085, 0);
      scene.add(ledLeft);

      // LED light emission
      const ledL1 = new THREE.RectAreaLight('#F5E0B8', 1.5, RW - 0.4, 0.5);
      ledL1.position.set(0, RH - 0.12, -hd + 0.3);
      ledL1.lookAt(0, RH - 0.5, 0);
      scene.add(ledL1);

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

      // Wall panel mouldings (back wall) — 4 raised panels
      const panelW = 1.4, panelH = 2.0, panelD = 0.02;
      const panelY = 0.35;
      const panelSpacing = (RW - panelW * 4) / 5;
      for (let i = 0; i < 4; i++) {
        const px = -RW / 2 + panelSpacing + panelW / 2 + i * (panelW + panelSpacing);
        // Outer frame
        scene.add(box(panelW + 0.06, panelH + 0.06, 0.015, MAT.cream, px, panelY + panelH / 2, -hd + 0.08));
        // Inner panel (slightly recessed look via darker shade)
        scene.add(box(panelW, panelH, 0.01, MAT.wallPanel, px, panelY + panelH / 2, -hd + 0.085));
      }

      // Chair rail
      scene.add(box(RW, 0.03, 0.025, MAT.cream, 0, 0.95, -hd + 0.065));

      // Marble feature wall strip (lower back wall, wainscoting)
      scene.add(box(RW, 0.7, 0.015, MAT.marbleDk, 0, 0.35, -hd + 0.075));
      // Marble cap rail
      scene.add(box(RW, 0.025, 0.035, MAT.marble, 0, 0.71, -hd + 0.065));
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
      [[-0.56, 0.17, 0.28], [0.56, 0.17, 0.28], [-0.56, 0.17, -0.28], [0.56, 0.17, -0.28]].forEach(p => {
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

      // Cabinet LED strip under top shelf
      const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(w - 0.1, 0.008, 0.015), MAT.led);
      ledStrip.position.set(0, h - 0.005, d / 2 - 0.02);
      g.add(ledStrip);
      const cabLed = new THREE.PointLight('#F5E0B8', 0.6, 1.5, 2);
      cabLed.position.set(0, h - 0.05, d / 2);
      g.add(cabLed);

      g.position.set(-RW / 2 + 0.45, 0, -RD / 2 + 0.3);
      scene.add(g);
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
      const pl = new THREE.PointLight('#F5E6C8', 1.8, 5.5, 1.5);
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
    function buildPlant() {
      const g = new THREE.Group();
      const pp = [
        new THREE.Vector2(EPS, 0), new THREE.Vector2(0.12, 0),
        new THREE.Vector2(0.15, 0.02), new THREE.Vector2(0.17, 0.06),
        new THREE.Vector2(0.185, 0.14), new THREE.Vector2(0.2, 0.22),
        new THREE.Vector2(0.22, 0.28), new THREE.Vector2(0.21, 0.3),
        new THREE.Vector2(0.23, 0.32), new THREE.Vector2(0.21, 0.34),
      ];
      const potMat = new THREE.MeshStandardMaterial({ color: '#3E2B1C', roughness: 0.6, metalness: 0.05 });
      g.add(lathe(pp, potMat, 0, 0, 0, 24));
      g.add(new THREE.Mesh(cyl(0.22, 0.21, 0.012, 24), MAT.goldTrim).translateY(0.345));
      g.add(cylM(0.13, 0.14, 0.02, potMat, 0, 0.01, 0, 20));
      const soil = new THREE.Mesh(new THREE.CircleGeometry(Math.max(EPS, 0.19), 20), new THREE.MeshStandardMaterial({ color: '#2C1E14', roughness: 1 }));
      soil.rotation.x = -Math.PI / 2; soil.position.y = 0.335; g.add(soil);
      g.add(cylM(0.02, 0.028, 0.9, MAT.dkWood, 0, 0.78, 0, 8));
      const ld = [
        { x: 0, y: 1.25, z: 0, sx: 0.2, sy: 0.28, sz: 0.04, rx: 0, rz: 0 },
        { x: 0.15, y: 1.18, z: 0.09, sx: 0.18, sy: 0.24, sz: 0.035, rx: 0.28, rz: -0.2 },
        { x: -0.15, y: 1.15, z: 0.07, sx: 0.17, sy: 0.23, sz: 0.035, rx: -0.22, rz: 0.25 },
        { x: 0.09, y: 1.3, z: -0.12, sx: 0.19, sy: 0.25, sz: 0.035, rx: -0.35, rz: -0.15 },
        { x: -0.12, y: 1.27, z: -0.1, sx: 0.18, sy: 0.23, sz: 0.035, rx: 0.25, rz: 0.2 },
        { x: 0.2, y: 1.02, z: 0.05, sx: 0.16, sy: 0.2, sz: 0.03, rx: 0.45, rz: -0.3 },
        { x: -0.2, y: 0.99, z: -0.05, sx: 0.15, sy: 0.19, sz: 0.03, rx: -0.4, rz: 0.35 },
        { x: 0.05, y: 1.35, z: 0.08, sx: 0.14, sy: 0.18, sz: 0.03, rx: 0.15, rz: -0.1 },
        { x: -0.05, y: 1.38, z: -0.06, sx: 0.15, sy: 0.2, sz: 0.03, rx: -0.1, rz: 0.12 },
        { x: 0.18, y: 1.07, z: -0.14, sx: 0.17, sy: 0.19, sz: 0.03, rx: -0.42, rz: -0.25 },
        { x: -0.17, y: 1.1, z: 0.12, sx: 0.16, sy: 0.18, sz: 0.03, rx: 0.3, rz: 0.28 },
      ];
      ld.forEach((l, i) => {
        const lf = new THREE.Mesh(new THREE.SphereGeometry(Math.max(EPS, 1), 10, 7), i % 2 === 0 ? MAT.leaf : MAT.leafD);
        lf.scale.set(l.sx, l.sy, l.sz);
        lf.position.set(l.x, l.y, l.z);
        lf.rotation.x = l.rx; lf.rotation.z = l.rz;
        lf.castShadow = true; g.add(lf);
        animData.leaves.push(lf);
      });
      g.position.set(-2.8, 0, 2.0);
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
    // DUST PARTICLES
    // ============================================================
    function buildDustParticles() {
      const count = 80;
      const positions = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * RW * 0.8;
        positions[i * 3 + 1] = 0.5 + Math.random() * (RH - 1);
        positions[i * 3 + 2] = (Math.random() - 0.5) * RD * 0.8;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({ color: '#F5EDE0', size: 0.015, transparent: true, opacity: 0.35, sizeAttenuation: true });
      const points = new THREE.Points(geo, mat);
      scene.add(points);
      animData.dustParticles = points;
    }

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

      // Window spotlight — exterior daylight
      const winL = new THREE.SpotLight('#FFF8F0', 2.5, 10, Math.PI / 3.2, 0.5, 1.5);
      winL.position.set(-8, 2.5, 0.3);
      winL.target.position.set(2, 0, 0);
      winL.castShadow = true;
      winL.shadow.mapSize.set(SHADOW_RES, SHADOW_RES);
      winL.shadow.radius = 8;
      scene.add(winL); scene.add(winL.target);

      // Bounce fill from floor
      const bounce = new THREE.HemisphereLight('#E8DDD0', '#3E2B1C', 0.15);
      scene.add(bounce);

      // Fill from right
      const fill = new THREE.DirectionalLight('#F0E8D8', 0.18);
      fill.position.set(6, 3, -1); scene.add(fill);

      // Rim from behind
      const rim = new THREE.DirectionalLight('#E8DDD0', 0.12);
      rim.position.set(-1, 4, -6); scene.add(rim);
    }

    // ============================================================
    // BUILD SCENE
    // ============================================================
    buildRoom();
    // buildWindow(); // removed per user request
    buildFireplace();
    buildRug();
    buildArt();
    buildSofa();
    buildCoffeeTable();
    buildBookcase();
    buildDisplayCabinet();
    buildFloorLamp();
    buildArmchair();
    buildOttoman();
    buildConsoleTable();
    buildSideTable();
    buildFloatingShelves();
    buildPlant();
    // buildOliveTree(); // removed per user request
    buildDustParticles();
    setupLighting();

    // Wall text — VIKORE VANA on left wall
    (function buildWallText() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, 512, 512);
      // Bold black text
      ctx.fillStyle = '#1A1410';
      ctx.font = '700 120px "Cormorant Garamond", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('VIKORE', 256, 200);
      ctx.fillText('VANA', 256, 330);

      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const mat = new THREE.MeshStandardMaterial({
        map: tex,
        transparent: true,
        roughness: 0.85,
        metalness: 0,
      });
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2.4), mat);
      plane.position.set(-RW / 2 + 0.01, 2.4, 0);
      plane.rotation.y = Math.PI / 2;
      scene.add(plane);
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
    function animate() {
      animId = requestAnimationFrame(animate);
      const dt = clock.getDelta();
      const t = clock.getElapsedTime();

      // Intro
      if (!animData.introDone) { updateIntro(dt); }

      // Camera breathing
      if (animData.introDone && !REDUCED) {
        animData.breathOffset += dt * 0.3;
        const breathY = Math.sin(animData.breathOffset) * 0.03;
        const breathX = Math.cos(animData.breathOffset * 0.7) * 0.015;
        camera.position.y += breathY * 0.01;
        camera.position.x += breathX * 0.01;
      }

      // Candle flicker
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

      // Curtain movement
      if (!REDUCED) {
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

      // Dust particles
      if (animData.dustParticles && !REDUCED) {
        const dPos = animData.dustParticles.geometry.attributes.position;
        for (let i = 0; i < dPos.count; i++) {
          let y = dPos.getY(i);
          y += dt * 0.02;
          if (y > RH - 0.5) y = 0.5;
          dPos.setY(i, y);
          dPos.setX(i, dPos.getX(i) + Math.sin(t * 0.3 + i) * dt * 0.005);
          dPos.setZ(i, dPos.getZ(i) + Math.cos(t * 0.2 + i * 0.7) * dt * 0.003);
        }
        dPos.needsUpdate = true;
      }

      controls.update();
      composer.render();
    }
    animate();

    return () => {
      cancelAnimationFrame(animId); // Note: we need to capture animId
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      composer.dispose();
    };

    // ============================================================
    // RESIZE
    // ============================================================

    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      smaa.setSize(w, h);
    });
    ro.observe(container);


    // ============================================================


  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
