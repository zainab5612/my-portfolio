"use client";

import React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import NeuroBG from "./NeuroBG"; // optional animated background

/** Use any of these, e.g. <Section bg="neonGrid" /> */
type Bg =
  | "aurora" | "particles" | "warpGrid" | "metaballs" | "noiseFlow"
  | "rays" | "starfield" | "hexShimmer" | "matrixRain" | "scanlines"
  | "liquidWave" | "gradientFlow" | "diagScan" | "floatIcons" | "glowGrid"
  | "fireflies" | "waveTunnel" | "neonGrid" | "neuro"
  | "mesh" | "dots" | "topo" | "grain" | "orbs" | "solid";

export default function Section({
  id,
  bg = "solid",
  className = "",
  children,
}: {
  id?: string;
  bg?: Bg;
  className?: string;
  children: React.ReactNode;
}) {
  // ✅ wait until client mounts before drawing animated backgrounds
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <section id={id} className={`relative isolate ${className}`}>
      {mounted ? <Background bg={bg} /> : null}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

/* ---------------- Switcher ---------------- */
function Background({ bg }: { bg: Bg }) {
  switch (bg) {
    /* animated */
    case "aurora":       return <Aurora />;
    case "particles":    return <ParticleField />;
    case "warpGrid":     return <WarpGrid />;
    case "metaballs":    return <Metaballs />;
    case "noiseFlow":    return <NoiseFlow />;
    case "rays":         return <Rays />;
    case "starfield":    return <Starfield />;
    case "hexShimmer":   return <HexShimmer />;
    case "matrixRain":   return <MatrixRain />;
    case "scanlines":    return <Scanlines />;
    case "liquidWave":   return <LiquidWave />;
    case "gradientFlow": return <GradientFlow />;
    case "diagScan":     return <DiagScan />;
    case "floatIcons":   return <FloatIcons />;
    case "glowGrid":     return <GlowGrid />;
    case "fireflies":    return <Fireflies />;
    case "waveTunnel":   return <WaveTunnel />;
    case "neonGrid":     return <NeonGrid />;
    case "neuro":        return (
      <div className="absolute inset-0 -z-10">
        <NeuroBG density={60} connectRadius={140} />
      </div>
    );
    /* static */
    case "mesh":         return <MeshGradient />;
    case "dots":         return <DottedGrid />;
    case "topo":         return <TopoLines />;
    case "grain":        return <GrainOverlay />;
    case "orbs":         return <ParallaxOrbs />;
    default:              return null;
  }
}

/* ===================== ANIMATED VARIANTS ===================== */

/* 1) Aurora — flowing color clouds */
function Aurora() {
  const reduce = useReducedMotion();
  const anim = reduce ? {} : {
    animate: { x: [0,120,-60,0], y: [0,-80,60,0], rotate: [0,20,-10,0] },
    transition: { duration: 18, repeat: Infinity, ease: "easeInOut" as const },
  };
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div {...anim}
        className="absolute -top-24 -left-24 h-[38rem] w-[38rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(16,185,129,.28), transparent)" }} />
      <motion.div {...anim} transition={{ ...(anim as any).transition, duration: 22, delay: 2 }}
        className="absolute top-1/3 -right-24 h-[34rem] w-[34rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(59,130,246,.22), transparent)" }} />
      <motion.div {...anim} transition={{ ...(anim as any).transition, duration: 26, delay: 1.2 }}
        className="absolute bottom-[-10rem] left-1/2 -translate-x-1/2 h-[30rem] w-[30rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(234,179,8,.20), transparent)" }} />
      <GrainOverlay />
    </div>
  );
}

/* 2) ParticleField — points + connecting lines (canvas) */
function ParticleField() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const maybe = c.getContext("2d"); if (!maybe) return;
    const ctx: CanvasRenderingContext2D = maybe;

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    const sizeToCss = () => {
      c.width = Math.floor(c.offsetWidth * dpr);
      c.height = Math.floor(c.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeToCss();

    const onResize = () => { dpr = Math.max(1, window.devicePixelRatio || 1); sizeToCss(); };
    const ro = new ResizeObserver(onResize); ro.observe(c);

    const count = reduce ? 28 : 60;
    const pts = Array.from({ length: count }, () => ({
      x: Math.random() * c.offsetWidth,
      y: Math.random() * c.offsetHeight,
      vx: (Math.random() - 0.5) * (reduce ? 0.18 : 0.6),
      vy: (Math.random() - 0.5) * (reduce ? 0.18 : 0.6),
    }));

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.fillStyle = "rgba(16,185,129,0.85)";
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > c.offsetWidth)  p.vx *= -1;
        if (p.y < 0 || p.y > c.offsetHeight) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2); ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 180 * 180) {
          const alpha = 1 - d2 / (180 * 180);
          ctx.strokeStyle = `rgba(16,185,129,${0.25 * alpha})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [reduce]);
  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full" aria-hidden />;
}

/* 3) WarpGrid — animated diagonal grid with parallax */
function WarpGrid() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0,1], [0,-80]);
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <style>{`@keyframes gridShift { to { background-position: 120px 120px, 120px 120px; } }`}</style>
      <motion.div style={{ y }} className="absolute inset-0 opacity-30 dark:opacity-25" />
      <div className="absolute inset-0 opacity-30 dark:opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(0,0,0,.16) 1px, transparent 1px), linear-gradient(225deg, rgba(0,0,0,.16) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          animation: "gridShift 20s linear infinite",
        }} />
      <GrainOverlay />
    </div>
  );
}

/* 4) Metaballs — gooey blobs */
function Metaballs() {
  return (
    <svg className="absolute inset-0 -z-10 w-full h-full" aria-hidden>
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 28 -14" result="goo" />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
      <g filter="url(#goo)" fill="none">
        <g fill="#34d39944">
          <circle cx="140" cy="140" r="90">
            <animate attributeName="cx" values="140;220;140" dur="12s" repeatCount="indefinite" />
            <animate attributeName="cy" values="140;100;140" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="380" cy="220" r="70">
            <animate attributeName="cx" values="380;300;380" dur="11s" repeatCount="indefinite" />
            <animate attributeName="cy" values="220;260;220" dur="13s" repeatCount="indefinite" />
          </circle>
        </g>
        <g fill="#60a5fa33">
          <circle cx="80%" cy="30%" r="90">
            <animate attributeName="cx" values="80%;65%;80%" dur="16s" repeatCount="indefinite" />
            <animate attributeName="cy" values="30%;40%;30%" dur="14s" repeatCount="indefinite" />
          </circle>
        </g>
      </g>
      <GrainOverlay />
    </svg>
  );
}

/* 5) NoiseFlow — animated turbulence */
function NoiseFlow() {
  return (
    <svg className="absolute inset-0 -z-10 w-full h-full" aria-hidden>
      <defs>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency=".008" numOctaves="2" seed="2">
            <animate attributeName="baseFrequency" values=".008;.012;.008" dur="18s" repeatCount="indefinite" />
          </feTurbulence>
          <feColorMatrix type="matrix" values="
              0 0 0 0 0.2
              0 0 0 0 0.6
              0 0 0 0 0.4
              0 0 0 0.22 0" />
        </filter>
      </defs>
      <rect width="100%" height="100%" filter="url(#noise)" opacity=".22" />
      <GrainOverlay />
    </svg>
  );
}

/* 6) Rays — rotating conic beams */
function Rays() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <style>{`@keyframes spinRays { to { transform: rotate(360deg); } }`}</style>
      <div className="absolute left-1/2 top-1/2 h-[140vmax] w-[140vmax] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-35 dark:opacity-30"
        style={{
          background:
            "conic-gradient(from 0deg, rgba(16,185,129,.12), transparent 35%, rgba(59,130,246,.12), transparent 70%, rgba(234,179,8,.12))",
          animation: "spinRays 60s linear infinite",
        }} />
      <GrainOverlay />
    </div>
  );
}

/* 7) Starfield — layered twinkle */
function Starfield() {
  return (
    <div className="absolute inset-0 -z-10 bg-[#04070a]">
      <div className="absolute inset-0 bg-[radial-gradient(white,transparent_1px)] [background-size:2px_2px] opacity-40 animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(white,transparent_1px)] [background-size:3px_3px] opacity-20"
           style={{ transform: "translateY(-10%)", animation: "starDrift 40s linear infinite" }} />
      <style>{`@keyframes starDrift { to { transform: translateY(10%); } }`}</style>
    </div>
  );
}

/* 8) HexShimmer — shimmering hex wall */
function HexShimmer() {
  return (
    <div className="absolute inset-0 -z-10 opacity-25 dark:opacity-20">
      <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="none">
        <defs>
          <pattern id="hex" width="20" height="17.32" patternUnits="userSpaceOnUse">
            <path d="M5,0 L15,0 L20,8.66 L15,17.32 L5,17.32 L0,8.66 Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <linearGradient id="glow" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(16,185,129,.0)" />
            <stop offset="50%" stopColor="rgba(16,185,129,.35)" />
            <stop offset="100%" stopColor="rgba(16,185,129,.0)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex)" />
        <rect width="100%" height="100%" fill="url(#glow)">
          <animate attributeName="x" values="-800;800" dur="18s" repeatCount="indefinite"/>
        </rect>
      </svg>
      <GrainOverlay />
    </div>
  );
}

/* 9) MatrixRain — code rain (canvas) */
function MatrixRain() {
  const ref = React.useRef<HTMLCanvasElement | null>(null);
  React.useEffect(() => {
    const c = ref.current; if (!c) return;
    const maybe = c.getContext("2d"); if (!maybe) return;
    const ctx: CanvasRenderingContext2D = maybe;

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    const sizeToCss = () => {
      c.width = Math.floor(c.offsetWidth * dpr);
      c.height = Math.floor(c.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeToCss();

    const cols = Math.floor(c.offsetWidth / 14);
    const drops = Array(cols).fill(1);

    const ro = new ResizeObserver(() => { dpr = Math.max(1, window.devicePixelRatio || 1); sizeToCss(); });
    ro.observe(c);

    let anim = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.05)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "rgba(16,185,129,0.7)";
      ctx.font = "12px monospace";
      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + ((Math.random() * 96) | 0));
        ctx.fillText(text, i * 14, drops[i] * 16);
        if (drops[i] * 16 > c.offsetHeight && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      anim = requestAnimationFrame(draw);
    };

    anim = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(anim); ro.disconnect(); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 -z-10 w-full h-full bg-[#060a08] opacity-80" aria-hidden />;
}

/* 10) Scanlines — CRT overlay */
function Scanlines() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none mix-blend-multiply opacity-20">
      <div className="w-full h-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.25)_0,rgba(0,0,0,.25)_1px,transparent_1px,transparent_3px)]" />
    </div>
  );
}

/* 11) LiquidWave — animated wave path */
function LiquidWave() {
  return (
    <svg className="absolute inset-0 -z-10 w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" x2="1">
          <stop offset="0%" stopColor="rgba(16,185,129,.25)" />
          <stop offset="100%" stopColor="rgba(59,130,246,.25)" />
        </linearGradient>
      </defs>
      <path fill="url(#lg)">
        <animate attributeName="d" dur="16s" repeatCount="indefinite"
          values="
            M0,192 C360,120 1080,280 1440,192 L1440,320 L0,320 Z;
            M0,220 C440,160 1000,80 1440,220 L1440,320 L0,320 Z;
            M0,192 C360,120 1080,280 1440,192 L1440,320 L0,320 Z
          " />
      </path>
      <GrainOverlay />
    </svg>
  );
}

/* 12) GradientFlow — drifting blobs */
function GradientFlow() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <style>{`@keyframes drift { 0%{transform:translate(0,0)} 50%{transform:translate(6%, -4%)} 100%{transform:translate(0,0)} }`}</style>
      <div className="absolute inset-0 blur-2xl opacity-40">
        <div className="absolute -top-16 -left-16 h-80 w-80 rounded-full"
             style={{ background: "radial-gradient(circle, #34d39955, transparent 60%)", animation: "drift 18s ease-in-out infinite" }}/>
        <div className="absolute top-1/3 -right-10 h-72 w-72 rounded-full"
             style={{ background: "radial-gradient(circle, #60a5fa55, transparent 60%)", animation: "drift 22s ease-in-out infinite 2s" }}/>
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full"
             style={{ background: "radial-gradient(circle, #fbbf2455, transparent 60%)", animation: "drift 26s ease-in-out infinite 1s" }}/>
      </div>
      <GrainOverlay />
    </div>
  );
}

/* 13) DiagScan — sweeping diagonal light */
function DiagScan() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <style>{`@keyframes sweep { 0%{transform:translateX(-100%)} 100%{transform:translateX(100%)} }`}</style>
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_24px,rgba(0,0,0,.08)_24px,rgba(0,0,0,.08)_25px)] opacity-15" />
      <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent dark:via-white/8"
           style={{ animation: "sweep 8s linear infinite" }} />
    </div>
  );
}

/* 14) FloatIcons — gently bobbing emojis */
function FloatIcons() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <style>{`@keyframes bob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
      <div className="absolute left-[12%] top-[25%] animate-[bob_6s_ease-in-out_infinite]">🐍</div>
      <div className="absolute right-[18%] top-[35%] animate-[bob_7s_ease-in-out_infinite_.6s]">📊</div>
      <div className="absolute left-[28%] bottom-[18%] animate-[bob_8s_ease-in-out_infinite_.3s]">🧮</div>
      <GrainOverlay />
    </div>
  );
}

/* 15) GlowGrid — grid with pulsing nodes */
function GlowGrid() {
  return (
    <div className="absolute inset-0 -z-10">
      <style>{`@keyframes pulse { 0%,100%{opacity:.2} 50%{opacity:.6} } .node{ animation: pulse 3s ease-in-out infinite; }`}</style>
      <div className="absolute inset-0 opacity-25 dark:opacity-20 bg-[linear-gradient(rgba(0,0,0,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.18)_1px,transparent_1px)] [background-size:40px_40px]" />
      {[{x:'20%',y:'30%'},{x:'45%',y:'55%'},{x:'75%',y:'25%'},{x:'60%',y:'75%'}].map((n,i)=>(
        <div key={i} className="node absolute h-2 w-2 rounded-full bg-emerald-400/70 blur-[1px]" style={{left:n.x, top:n.y, animationDelay:`${i*.6}s`}}/>
      ))}
    </div>
  );
}

/* 16) Fireflies — drifting glowing dots (canvas) */
function Fireflies() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const reduce = useReducedMotion();
  React.useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const maybe = c.getContext("2d"); if (!maybe) return;
    const ctx: CanvasRenderingContext2D = maybe;

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    const sizeToCss = () => {
      c.width = Math.floor(c.offsetWidth * dpr);
      c.height = Math.floor(c.offsetHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    sizeToCss();

    const onResize = () => { dpr = Math.max(1, window.devicePixelRatio || 1); sizeToCss(); };
    const ro = new ResizeObserver(onResize); ro.observe(c);

    const N = reduce ? 20 : 40;
    const ff = Array.from({ length: N }, () => ({
      x: Math.random() * c.offsetWidth,
      y: Math.random() * c.offsetHeight,
      a: Math.random() * Math.PI * 2,
      s: 0.3 + Math.random() * 0.7,
      r: 1 + Math.random() * 1.8,
    }));

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (const f of ff) {
        f.a += 0.01 * f.s;
        f.x += Math.cos(f.a) * f.s * 0.8;
        f.y += Math.sin(f.a) * f.s * 0.8;
        if (f.x < 0) f.x = c.offsetWidth; if (f.x > c.offsetWidth) f.x = 0;
        if (f.y < 0) f.y = c.offsetHeight; if (f.y > c.offsetHeight) f.y = 0;

        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 16);
        grd.addColorStop(0, "rgba(16,185,129,0.9)");
        grd.addColorStop(1, "rgba(16,185,129,0)");
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [reduce]);

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10 w-full h-full" aria-hidden />;
}

/* 17) WaveTunnel — pulsing radial tunnel (SVG) */
function WaveTunnel() {
  return (
    <svg className="absolute inset-0 -z-10 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <defs>
        <radialGradient id="rt" r="80%">
          <stop offset="0%" stopColor="rgba(16,185,129,.15)" />
          <stop offset="60%" stopColor="rgba(59,130,246,.15)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx="50" cy="50" r={10 + i * 10} fill="none" stroke="url(#rt)" strokeWidth="1">
          <animate attributeName="r" values={`${10 + i*10};${20 + i*10};${10 + i*10}`} dur={`${10 + i*2}s`} repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur={`${8 + i*2}s`} repeatCount="indefinite" />
        </circle>
      ))}
      <rect width="100%" height="100%" fill="url(#rt)" opacity=".25" />
      <GrainOverlay />
    </svg>
  );
}

/* 18) NeonGrid — glowing animated grid */
function NeonGrid() {
  return (
    <div className="absolute inset-0 -z-10">
      <style>{`
        @keyframes glowShift { 0%{opacity:.25} 50%{opacity:.6} 100%{opacity:.25} }
        @keyframes slide { to { background-position: 40px 40px, 40px 40px; } }
      `}</style>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,.35) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,.35) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          filter: "drop-shadow(0 0 8px rgba(16,185,129,.25))",
          animation: "slide 18s linear infinite",
          opacity: 0.35,
        }}
      />
      {/* pulsing nodes */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-emerald-400"
          style={{
            left: `${(i * 9 + 10) % 90}%`,
            top: `${(i * 13 + 15) % 85}%`,
            boxShadow: "0 0 12px rgba(16,185,129,.8)",
            animation: `glowShift ${3 + (i % 4)}s ease-in-out infinite`,
          }}
        />
      ))}
      <GrainOverlay />
    </div>
  );
}

/* ===================== STATIC BASELINE ===================== */

function MeshGradient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10"
      style={{
        background:
          "radial-gradient(60% 80% at 20% 10%, #d1f2e0 0%, transparent 55%), radial-gradient(60% 70% at 80% 20%, #c9dbff 0%, transparent 55%), radial-gradient(70% 80% at 50% 90%, #ffe2d7 0%, transparent 60%)",
        filter: "saturate(1.05) blur(20px)",
      }} />
  );
}
function DottedGrid() {
  return (
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,#7c7c7c_1px,transparent_1px)] [background-size:20px_20px] opacity-20 dark:opacity-15" />
  );
}
function TopoLines() {
  return (
    <svg className="absolute inset-0 -z-10 w-full h-full opacity-[0.17] dark:opacity-[0.12]" viewBox="0 0 800 600" preserveAspectRatio="none" aria-hidden>
      <defs><pattern id="topo" width="80" height="60" patternUnits="userSpaceOnUse">
        <path d="M0 30 C20 10,60 10,80 30 S60 50,40 30 0 30 0 30" fill="none" stroke="currentColor" strokeWidth="0.6"/></pattern></defs>
      <rect width="100%" height="100%" fill="url(#topo)" />
    </svg>
  );
}
function GrainOverlay() {
  return (
    <div className="absolute inset-0 -z-10 opacity-[0.15] mix-blend-multiply dark:opacity-[0.12]"
      style={{
        backgroundImage:
          "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/></filter><rect width=%22400%22 height=%22400%22 filter=%22url(%23n)%22 opacity=%220.35%22/></svg>')",
        backgroundSize: "300px",
      }} />
  );
}
function ParallaxOrbs() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: y1 }}
        className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-emerald-300/35 blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-1/3 -right-16 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl"
      />
      <GrainOverlay />
    </div>
  );
}
