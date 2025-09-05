"use client";

import React, { useEffect, useLayoutEffect, useRef, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

// 3D
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useAnimations,
  useGLTF,
  useTexture,
  useVideoTexture,
} from "@react-three/drei";
import * as THREE from "three";

// Icons + site components
import { FaGithub, FaLinkedin, FaDownload } from "react-icons/fa";
import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import BackgroundBlobs from "@/components/BackgroundBlobs";

import MagneticButton from "@/components/MagneticButton";
import TiltCard from "@/components/TiltCard";
import SkillsStrip from "@/components/SkillsStrip";
import ProjectCard from "@/components/ProjectCard";
import NeuroBG from "@/components/NeuroBG";
import ExperienceSection from '@/components/ExperienceSection';
import FlipDeck, { type DeckCard } from "@/components/FlipDeck";

import { Sparkles } from "lucide-react";
import HeroName from "@/components/HeroName";
import ContactForm from '@/components/ContactForm';


/* ======================= Presenter (3D) ======================= */
type PresenterProps = {
  modelUrl: string;
  mediaUrl?: string;
  avatarHeight?: number;   // default 1.6
  screenHeight?: number;   // default 2.0 (taller than avatar)
  screenAspect?: number;   // default 16/9
  gap?: number;            // default 0.9
};

/** Slide/video drawn as a real texture on a plane */
function MediaSurface({ url, w, h }: { url?: string; w: number; h: number }) {
  const isVid = !!url && /\.(mp4|webm|mov)$/i.test(url);
  const isImg = !!url && /\.(gif|png|jpe?g|webp|avif)$/i.test(url);

  const imgTex = isImg && url ? useTexture(url) : undefined;
  const vidTex =
    isVid && url
      ? useVideoTexture(url, { start: true, loop: true, muted: true, crossOrigin: "anonymous" })
      : undefined;

  return (
    <mesh position={[0, h / 2, 0]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial
        map={(vidTex as any) || (imgTex as any) || undefined}
        toneMapped={false}
        side={THREE.DoubleSide}
        color={!url ? "#cfd4da" : "white"}
      />
    </mesh>
  );
}

function PresenterCore({
  modelUrl,
  mediaUrl,
  avatarHeight,
  screenHeight,
  screenAspect,
  gap,
}: Required<PresenterProps>) {
  const avatarGroup = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(modelUrl);
  const { actions } = useAnimations(animations, avatarGroup);
  const [avatarWidth, setAvatarWidth] = useState(0);

  // Normalize avatar: center X/Z, feet on floor, scale to target height
  useLayoutEffect(() => {
    if (!scene) return;

    const box0 = new THREE.Box3().setFromObject(scene);
    const center = box0.getCenter(new THREE.Vector3());
    scene.position.x -= center.x;
    scene.position.z -= center.z;

    const box1 = new THREE.Box3().setFromObject(scene);
    scene.position.y -= box1.min.y;

    const size1 = box1.getSize(new THREE.Vector3());
    const scale = size1.y > 0 ? avatarHeight / size1.y : 1;
    scene.scale.setScalar(scale);

    const size2 = new THREE.Box3().setFromObject(scene).getSize(new THREE.Vector3());
    setAvatarWidth(size2.x);
  }, [scene, avatarHeight]);

  // Face avatar forward once (if backward, change 0 -> Math.PI)
  useEffect(() => {
    if (!avatarGroup.current) return;
    avatarGroup.current.rotation.set(0, Math.PI / 9, 0);
  }, []);

// Play first animation if present
// Play first animation if present
useEffect(() => {
  // values can be AnimationAction | null — normalize
  const first = (Object.values(actions ?? {})[0] ?? null) as THREE.AnimationAction | null;

  if (first) {
    first.reset().fadeIn(0.3).play();
  }

  // cleanup MUST return void (braces ensure no value is returned)
  return () => {
    first?.fadeOut(0.2).stop();
  };
}, [actions]);


  // Layout
  const screenW = screenHeight * screenAspect;
  const avatarX = 0;
  const screenX = avatarWidth / 9 + gap + screenW / 3;

  return (
    <group>
      {/* Avatar at y=1 */}
      <group ref={avatarGroup} position={[avatarX, 0, 0]}>
        <primitive object={scene} />
      </group>

      {/* Projector at y=0 — straight forward (no tilt/yaw) */}
      <group position={[screenX, 0, 0]} rotation={[0, Math.PI / 1.1, 0]}>
        {/* Pole moved to LEFT EDGE of the screen */}
        <mesh position={[-(screenW / 2 + 0.03), screenHeight / 2, -0.02]}>
          <boxGeometry args={[0.05, screenHeight + 0.4, 0.05]} />
          <meshStandardMaterial color="#7e8ca0" />
        </mesh>

        {/* Thin backing behind the slide (prevents z-fighting) */}
        <mesh position={[0, screenHeight / 2, -0.01]}>
          <planeGeometry args={[screenW + 0.1, screenHeight + 0.1]} />
          <meshStandardMaterial color="#adb5bd" />
        </mesh>

        {/* Slide/video as a texture */}
        <MediaSurface url={mediaUrl} w={screenW} h={screenHeight} />
      </group>
    </group>
  );
}
function NeonSideAccents() {
  // fixed (non-random) lines so SSR and client match
  const LINES = [
    { y: 60,  a: 70,  w: 1.6, o: 0.75 },
    { y: 120, a: 90,  w: 1.2, o: 0.55 },
    { y: 180, a: 60,  w: 1.0, o: 0.45 },
    { y: 240, a: 80,  w: 1.3, o: 0.60 },
    { y: 300, a: 50,  w: 1.0, o: 0.42 },
    { y: 360, a: 70,  w: 1.2, o: 0.50 },
    { y: 420, a: 40,  w: 0.9, o: 0.38 },
    { y: 480, a: 65,  w: 1.1, o: 0.48 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {/* LEFT side */}
      <div className="absolute inset-y-0 left-0 w-[32vw] overflow-hidden">
        <svg
          width="100%" height="100%" viewBox="0 0 640 720"
          preserveAspectRatio="xMidYMid slice" aria-hidden="true"
          className="mix-blend-soft-light"
        >
          <defs>
            {/* neon purple→teal */}
            <linearGradient id="acc-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"  stopColor="#7c4dff" />
              <stop offset="100%" stopColor="#19d3c5" />
            </linearGradient>
            {/* fade to center so it blends (ombre) */}
            <linearGradient id="side-fade" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" />
              <stop offset="85%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="mask-left">
              <rect width="100%" height="100%" fill="url(#side-fade)" />
            </mask>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.8" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g mask="url(#mask-left)" filter="url(#glow)">
            {LINES.map((l, i) => (
              <path
                key={i}
                d={`M -120 ${l.y}
                   C 120 ${l.y - l.a}, 280 ${l.y + l.a}, 520 ${l.y}
                   S 960 ${l.y - l.a}, 960 ${l.y}`}
                fill="none"
                stroke="url(#acc-grad)"
                strokeWidth={l.w}
                strokeOpacity={l.o}
              />
            ))}
          </g>
        </svg>

        {/* soft left glow that fades inward */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 0% 50%, rgba(124,77,255,.22), transparent 60%)",
            mixBlendMode: "soft-light",
          }}
        />
      </div>

      {/* RIGHT side (mirror) */}
      <div className="absolute inset-y-0 right-0 w-[32vw] overflow-hidden">
        <div className="absolute inset-0 scale-x-[-1] origin-center">
          <svg
            width="100%" height="100%" viewBox="0 0 640 720"
            preserveAspectRatio="xMidYMid slice" aria-hidden="true"
            className="mix-blend-soft-light"
          >
            <defs>
              <linearGradient id="acc-grad-r" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%"  stopColor="#19d3c5" />
                <stop offset="100%" stopColor="#7c4dff" />
              </linearGradient>
              <linearGradient id="side-fade-r" x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor="white" />
                <stop offset="85%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <mask id="mask-right">
                <rect width="100%" height="100%" fill="url(#side-fade-r)" />
              </mask>
            </defs>

            <g mask="url(#mask-right)" filter="url(#glow)">
              {LINES.map((l, i) => (
                <path
                  key={i}
                  d={`M -120 ${l.y}
                     C 120 ${l.y - l.a}, 280 ${l.y + l.a}, 520 ${l.y}
                     S 960 ${l.y - l.a}, 960 ${l.y}`}
                  fill="none"
                  stroke="url(#acc-grad-r)"
                  strokeWidth={l.w}
                  strokeOpacity={l.o * 0.9}
                />
              ))}
            </g>
          </svg>
        </div>

        {/* soft right glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 100% 50%, rgba(25,211,197,.18), transparent 60%)",
            mixBlendMode: "soft-light",
          }}
        />
      </div>
    </div>
  );
}

function AuroraOrbsSides() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {/* LEFT */}
      <div className="absolute inset-y-0 left-0 w-[32vw]">
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(60% 70% at 0% 30%, rgba(124,77,255,.25), transparent 60%)," +
              "radial-gradient(50% 60% at 20% 70%, rgba(25,211,197,.20), transparent 60%)",
          }}
        />
        {/* fade inward (ombre) */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0) 80%)",
          maskImage: "linear-gradient(90deg, #000, transparent 80%)",
          WebkitMaskImage: "linear-gradient(90deg, #000, transparent 80%)",
        }}/>
      </div>

      {/* RIGHT (mirrored) */}
      <div className="absolute inset-y-0 right-0 w-[32vw]">
        <div
          className="absolute inset-0 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(60% 70% at 100% 35%, rgba(25,211,197,.22), transparent 60%)," +
              "radial-gradient(50% 60% at 80% 70%, rgba(124,77,255,.22), transparent 60%)",
          }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(270deg, rgba(255,255,255,1), rgba(255,255,255,0) 80%)",
          maskImage: "linear-gradient(270deg, #000, transparent 80%)",
          WebkitMaskImage: "linear-gradient(270deg, #000, transparent 80%)",
        }}/>
      </div>
    </div>
  );
}


function WavyRingsSides() {
  const Y = [70, 120, 170, 220, 270, 320, 370, 420, 470]; // fixed rows
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {["left","right"].map((side) => (
        <div key={side} className={`absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"} w-[30vw] overflow-hidden`}>
          <svg width="100%" height="100%" viewBox="0 0 600 720" preserveAspectRatio="xMidYMid slice" aria-hidden="true"
               className="mix-blend-soft-light">
            <defs>
              <linearGradient id={`ring-${side}`} x1="0" y1="0" x2="1" y2="0">
                {side === "left" ? (
                  <>
                    <stop offset="0%" stopColor="#7c4dff"/><stop offset="100%" stopColor="#19d3c5"/>
                  </>
                ) : (
                  <>
                    <stop offset="0%" stopColor="#19d3c5"/><stop offset="100%" stopColor="#7c4dff"/>
                  </>
                )}
              </linearGradient>
              <linearGradient id={`fade-${side}`} x1={side==="left"?"0":"1"} y1="0" x2={side==="left"?"1":"0"} y2="0">
                <stop offset="0%" stopColor="white"/><stop offset="85%" stopColor="white" stopOpacity="0"/>
              </linearGradient>
              <mask id={`mask-${side}`}><rect width="100%" height="100%" fill={`url(#fade-${side})`}/></mask>
              <filter id={`glow-${side}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            <g mask={`url(#mask-${side})`} filter={`url(#glow-${side})`}>
              {Y.map((y, i) => (
                <path key={i}
                  d={`M -100 ${y}
                     C 120 ${y - 50 - (i%3)*10}, 260 ${y + 50 + (i%4)*8}, 500 ${y}
                     S 1100 ${y - 60}, 1100 ${y}`}
                  fill="none" stroke={`url(#ring-${side})`}
                  strokeWidth={i % 3 === 0 ? 1.8 : 1.1} strokeOpacity={0.55 + (i%3)*0.08}/>
              ))}
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}


function CircuitTracesSides() {
  const rows = [60, 110, 160, 210, 260, 310, 360, 410, 460];
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {["left","right"].map((side) => (
        <svg key={side} width="32%" height="100%" viewBox="0 0 320 720"
             className={`absolute inset-y-0 ${side==="left"?"left-0":"right-0"} mix-blend-soft-light`} aria-hidden="true">
          <defs>
            <linearGradient id={`trace-${side}`} x1="0" y1="0" x2="1" y2="0">
              {side==="left"?<>
                <stop offset="0%" stopColor="#00e0ff"/><stop offset="100%" stopColor="#7c4dff"/>
              </>:<>
                <stop offset="0%" stopColor="#7c4dff"/><stop offset="100%" stopColor="#00e0ff"/>
              </>}
            </linearGradient>
            <linearGradient id={`fade-${side}`} x1={side==="left"?"0":"1"} y1="0" x2={side==="left"?"1":"0"} y2="0">
              <stop offset="0%" stopColor="white"/><stop offset="85%" stopColor="white" stopOpacity="0"/>
            </linearGradient>
            <mask id={`mask-${side}`}><rect width="100%" height="100%" fill={`url(#fade-${side})`} /></mask>
          </defs>
          <g mask={`url(#mask-${side})`}>
            {rows.map((y, i) => (
              <g key={i} style={{opacity: 0.5 + (i%3)*0.12}}>
                {/* “trace” path */}
                <path d={`M 0 ${y} H 120 Q 150 ${y} 150 ${y+30} V ${y+80} H 300`}
                      fill="none" stroke={`url(#trace-${side})`} strokeWidth={1.2} />
                {/* nodes */}
                <circle cx={120} cy={y} r={2.2} fill="#00e0ff" className="trace-node" />
                <circle cx={150} cy={y+30} r={2.2} fill="#7c4dff" className="trace-node" />
                <circle cx={220} cy={y+80} r={2.2} fill="#00e0ff" className="trace-node" />
              </g>
            ))}
          </g>
          <style jsx>{`
            @keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:1} }
            .trace-node { animation: pulse 3.6s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) { .trace-node { animation: none; } }
          `}</style>
        </svg>
      ))}
    </div>
  );
}


function ParticleMistSides() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]">
      {/* LEFT */}
      <div className="absolute inset-y-0 left-0 w-[28vw] overflow-hidden">
        <div className="absolute inset-0 particle-left"
             style={{
               backgroundImage: "radial-gradient(rgba(0,200,255,.25) 1px, transparent 1px)",
               backgroundSize: "18px 18px",
               mixBlendMode: "soft-light",
               maskImage: "linear-gradient(90deg, #000, transparent 85%)",
               WebkitMaskImage: "linear-gradient(90deg, #000, transparent 85%)",
            }} />
      </div>
      {/* RIGHT */}
      <div className="absolute inset-y-0 right-0 w-[28vw] overflow-hidden">
        <div className="absolute inset-0 particle-right"
             style={{
               backgroundImage: "radial-gradient(rgba(124,77,255,.24) 1px, transparent 1px)",
               backgroundSize: "18px 18px",
               mixBlendMode: "soft-light",
               maskImage: "linear-gradient(270deg, #000, transparent 85%)",
               WebkitMaskImage: "linear-gradient(270deg, #000, transparent 85%)",
            }} />
      </div>
      <style jsx>{`
        @keyframes driftL { from { background-position: 0 0; } to { background-position: -120px 0; } }
        @keyframes driftR { from { background-position: 0 0; } to { background-position: 120px 0; } }
        .particle-left  { animation: driftL 40s linear infinite; }
        .particle-right { animation: driftR 46s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .particle-left,.particle-right { animation: none; }
        }
      `}</style>
    </div>
  );
}


function NeonRibbonsBackground() {
  // deterministic lines (no randomness → no hydration issues)
  const lines = Array.from({ length: 18 }, (_, i) => ({
    y: 80 + i * 32,
    w: i % 5 === 0 ? 1.8 : 1.1,
    a: 110 + (i % 6) * 14, // amplitude for the curve
  }));

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#0b0f1a]">
      <svg
        className="absolute inset-0"
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="rib" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b46ff" stopOpacity=".95" />
            <stop offset="100%" stopColor="#9a6bff" stopOpacity=".6" />
          </linearGradient>
          {/* soften edges */}
          <radialGradient id="fade" cx="75%" cy="35%" r="90%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="mask">
            <rect width="1440" height="900" fill="url(#fade)" />
          </mask>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* LEFT swirl group */}
        <g mask="url(#mask)" filter="url(#glow)" className="ribbons-drift-left">
          {lines.map((l, idx) => (
            <path
              key={`L${idx}`}
              d={`M -120 ${l.y}
                 C 260 ${l.y - l.a}, 520 ${l.y + l.a}, 900 ${l.y}
                 S 1560 ${l.y - l.a}, 1560 ${l.y}`}
              fill="none"
              stroke="url(#rib)"
              strokeOpacity={0.9}
              strokeWidth={l.w}
            />
          ))}
        </g>

        {/* RIGHT swirl group (rotated for that “tunnel” feel) */}
        <g
          mask="url(#mask)"
          filter="url(#glow)"
          transform="rotate(-18 1100 450) translate(140, -60)"
          className="ribbons-drift-right"
        >
          {lines.map((l, idx) => (
            <path
              key={`R${idx}`}
              d={`M -120 ${l.y}
                 C 280 ${l.y + l.a}, 680 ${l.y - l.a}, 1080 ${l.y}
                 S 1560 ${l.y + l.a}, 1560 ${l.y}`}
              fill="none"
              stroke="url(#rib)"
              strokeOpacity={0.7}
              strokeWidth={l.w * 0.9}
            />
          ))}
        </g>
      </svg>

      {/* slight vignette for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background:
          "radial-gradient(1200px 520px at 50% 20%, transparent 0%, rgba(0,0,0,.25) 70%, rgba(0,0,0,.45) 100%)"
      }} />

      <style jsx>{`
        @keyframes driftL { from { transform: translateX(0px); } to { transform: translateX(-80px); } }
        @keyframes driftR { from { transform: translateX(0px); } to { transform: translateX(60px); } }
        .ribbons-drift-left { animation: driftL 38s linear infinite; }
        .ribbons-drift-right { animation: driftR 46s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ribbons-drift-left, .ribbons-drift-right { animation: none; }
        }
      `}</style>
    </div>
  );
}


function DataBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
      {/* base gradient glow */}
       <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,204,255,.2) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(0,204,255,.2) 1px, transparent 1px)",
          backgroundSize: "26px 26px, 26px 26px",
          animation: "gridShift 22s linear infinite",
          opacity: 0.75,
        }}
      />

      {/* animated grid */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,204,255,.16) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(0,204,255,.16) 1px, transparent 1px)",
          backgroundSize: "28px 28px, 28px 28px",
          animation: "gridShift 22s linear infinite",
          opacity: 0.7,
        }}
      />

      {/* micro dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(0,200,255,.22) 0.6px, transparent 0.6px)",
          backgroundSize: "22px 22px",
          mixBlendMode: "overlay",
          opacity: 0.25,
        }}
      />

      {/* vertical scan sweep */}
      <div
        className="absolute top-0 bottom-0 w-2/3 left-[16.6%]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(0,230,255,.12), transparent)",
          filter: "blur(8px)",
          animation: "sweep 6s linear infinite",
          opacity: 0.6,
        }}
      />

      <style jsx>{`
        @keyframes gridShift {
          0% { background-position: 0 0, 0 0; }
          100% { background-position: 400px 0, 0 400px; }
        }
        @keyframes sweep {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </div>
  );
}



function AvatarPresenter({
  modelUrl,
  mediaUrl,
  avatarHeight = 1.6,
  screenHeight = 2.0,
  screenAspect = 16 / 9,
  gap = 0.9,
}: PresenterProps) {
  const focusX = (0 + (screenHeight * screenAspect) / 2 + gap + 0.4) / 2;

  return (
    <div className="relative w-full h-[520px]">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 1.6, 4.6], fov: 35 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[4, 6, 6]} intensity={0.9} />
        <directionalLight position={[-3, 5, -4]} intensity={0.35} />

       <Suspense fallback={null}>
  <PresenterCore
    modelUrl={modelUrl ?? ""}      // ensure strings
    mediaUrl={mediaUrl ?? ""}      // ensure strings
    avatarHeight={avatarHeight}
    screenHeight={screenHeight}
    screenAspect={screenAspect}
    gap={typeof gap === "number" ? gap : 0.08}  // <-- ADD THIS (pick a sensible default)
  />
</Suspense>


        <OrbitControls enablePan={false} target={[focusX, 1.0, 0]} />
      </Canvas>
    </div>
  );
}

useGLTF.preload?.("/avatars/avatar.glb");

// Clean timeline with glassy nodes + glow
function CleanTimeline() {
  const steps = [
    { letter: "C", text: "Conceptualize", href: "/clean/conceptualize" },
    { letter: "L", text: "Locate Solvable Issues", href: "/clean/locate" },
    { letter: "E", text: "Evaluate Unsolvable Issues", href: "/clean/evaluate" },
    { letter: "A", text: "Augment", href: "/clean/augment" },
    { letter: "N", text: "Note and Document", href: "/clean/note" },
  ];

  return (
    <div className="relative mx-auto max-w-6xl">
      {/* Vertical rail with a subtle gradient + feathered mask */}
      <div
        className="absolute left-[5.5rem] top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400/30 via-white/15 to-fuchsia-400/30"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
        }}
        aria-hidden
      />

      <ul className="grid gap-y-40">
        {steps.map((s) => (
          <li
            key={s.href}
            className="grid grid-cols-[4.5rem,5.5rem,1fr] items-center"
          >
            {/* LEFT: big serif letter */}
            <div className="text-5xl sm:text-6xl font-serif font-extrabold text-white/90">
              {s.letter}
            </div>

            {/* MIDDLE: glossy node with glow + pulse */}
            <a
              href={s.href}
              className="group relative place-self-center h-18 w-18 sm:h-20 sm:w-20"
              aria-label={s.text}
            >
              {/* soft outer glow */}
              <span className="absolute inset-0 rounded-2xl blur-md bg-[radial-gradient(60%_60%_at_50%_50%,rgba(14,165,233,.30),rgba(217,70,239,.22)_60%,transparent_70%)]" />
              {/* glass body */}
              <span
                className="
                  relative grid place-items-center h-full w-full rounded-2xl
                  bg-white/6 backdrop-blur
                  border border-white/15 shadow-[0_0_0_1px_rgba(255,255,255,.06)_inset,0_10px_30px_rgba(0,0,0,.45)]
                  ring-1 ring-transparent transition-transform duration-300
                  group-hover:scale-105 group-hover:ring-2 group-hover:ring-cyan-300/40
                "
              >
                {/* tiny pulsing dot */}
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300/90 animate-[ping_2s_ease-in-out_infinite]" />
              </span>
            </a>

            {/* RIGHT: label with tidy hover underline */}
            <a
              href={s.href}
              className="group text-2xl sm:text-[1.6rem] text-zinc-200 hover:text-white transition-colors"
            >
              {s.text}
              <span className="block h-[3px] w-0 bg-gradient-to-r from-cyan-400/70 via-fuchsia-400/70 to-pink-400/70 transition-all duration-300 group-hover:w-16" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}


/* ============================ Page ============================ */


export default function Home() {
  // Theme toggle (persist + respect system)
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const prefersDark =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
        : false;
    const initial = stored ? stored === "dark" : prefersDark;
    setDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggleTheme = () => {
    const next = !(dark ?? false);
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 sm:px-8">
      {/* NAV */}
      <nav className="w-full max-w-4xl flex items-center justify-between py-8 border-b mb-10">
        <span className="text-xl font-bold tracking-widest text-thunder dark:text-yellow-300">
          Zainab Abdulhasan
        </span>
        <ul className="flex gap-8 text-lg">
          <li><a className="hover:underline" href="#about">About</a></li>
          <li><a className="hover:underline" href="#projects">Projects</a></li>
          <li><a className="hover:underline" href="#skills">Skills</a></li>
          <li><a className="hover:underline" href="#contact">Contact</a></li>
        </ul>


      </nav>

{/* HERO */}
<Section id="hero" bg="mesh" className="py-16 w-full">
  {/* wrapper needed so absolute layers have a positioning context */}
  <div className="relative isolate w-full overflow-hidden">

    {/* accent layer – soft vignette, no visible boxes */}
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* dark vignette that blends edges */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 40%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.78) 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 30%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      />
      {/* traces plane, feathered so it never ends in a hard line */}
      <div
        className="absolute left-1/2 -translate-x-1/2 min-w-[140vw]"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
        }}
      >
        <CircuitTracesSides />
      </div>
    </div>

    {/* content */}
    <div className="relative z-20 flex flex-col items-center">
      <div className="w-full max-w-4xl mt-0">
<AvatarPresenter
  modelUrl="/avatars/avatar.glb"
  mediaUrl="/media/talk.mov"
  avatarHeight={2.11}
  screenHeight={2.6}
  screenAspect={16 / 9}
  gap={0.55}
/>


      </div>

      <Reveal>
        <h1 className="text-4xl sm:text-1xl md:text-1xl font-serif font-bold text-thunder mb-2 tracking-tight text-center">
          <span className="hero-gradient-text">Clarity Through Data</span>
        </h1>
        <div
          aria-hidden
          className="h-[3px] w-[240px] rounded-full mx-auto mb-4
                     bg-[linear-gradient(90deg,rgba(0,224,255,0),rgba(0,224,255,.5),rgba(124,77,255,.6),rgba(255,122,217,.5),rgba(0,224,255,0))]
                     [background-size:200%_100%] animate-[heroGradientShift_6s_linear_infinite]"
        />
      </Reveal>

      <Reveal delay={0.08}>
        <p className="text-2xl font-sans text-zinc-100 mb-4 text-center">
          Data Analyst · Turning real-world data into stories and insights
        </p>
      </Reveal>

      <Reveal delay={0.12}>
        <p className="max-w-2xl text-center text-lg font-sans text-zinc-100/90 mb-8">
          I explore data and build clean, clear visuals with Python, Pandas, Power BI, and Tableau — always focused on clarity and impact.
        </p>
      </Reveal>

      {/* Resume + socials */}
      <div className="flex items-center gap-4">
<a
  href="/Zainab-Abdulhasan-Resume.pdf"
  download="Zainab-Abdulhasan-Resume.pdf"
  className="px-5 py-5 bg-white/10 text-white border border-white/15 rounded-xl backdrop-blur
             hover:bg-white/15 transition-colors inline-flex items-center gap-2"
>
  <FaDownload className="mr-2" />
  Resume
</a>



        <a
          href="https://github.com/zainab5612"
          target="_blank"
          rel="noopener noreferrer"
className="px-10 py-3 bg-white/10 text-white border border-white/15 backdrop-blur
           hover:bg-white/15 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"

        >
          <FaGithub className="mr-2" />
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/zainab-abdulhasan-980454377/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-9 py-3 bg-white/10 text-white border border-white/15 backdrop-blur
           hover:bg-white/15 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"

        >
          <FaLinkedin className="mr-2" />
          LinkedIn
        </a>
      </div>
{/* Skills heading + strip */}
<div className="mt-10 w-full">
  <div className="relative isolate mx-auto w-[min(100vw,2970px)]">
    {/* label */}
    <div className="mb-2 flex items-center justify-center">
      <span className="text-[14px] font-semibold tracking-[0.25em] uppercase text-white-600">
        Skills
      </span>
    </div>

    {/* wider visible area + almost edge-less feather */}
    <div className="[mask-image:linear-gradient(to_right,transparent,black_1%,black_99%,transparent)]
                    [-webkit-mask-image:linear-gradient(to_right,transparent,black_1%,black_99%,transparent)]">
      <SkillsStrip speed={13} gapClass="gap-12" />
    </div>



    {/* slimmer side overlays so the ends don’t look boxed */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-12 md:w-16 z-[100]
                 bg-gradient-to-r from-black via-black/70 to-transparent"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-12 md:w-16 z-[100]
                 bg-gradient-to-l from-black via-black/70 to-transparent"
    />
  </div>
</div>



      {/* soft wave divider */}
      <div className="w-full overflow-hidden -mb-1 mt-10">
        <svg viewBox="0 0 1440 120" className="w-full h-[60px] sm:h-[100px]" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,32 C360,120 1080,0 1440,96 L1440,120 L0,120 Z" fill="#2f855a" fillOpacity="0.18" />
        </svg>
      </div>
    </div>
  </div>
</Section>




      {/* ABOUT / CLEAN */}
      <Section id="about" bg="liquidWave" className="py-16 w-full">
  <h2 className="text-3xl font-serif font-semibold text-thunder dark:text-yellow-300 mb-10 text-center">
    About Me
  </h2>

  <p className="max-w-3xl mx-auto text-lg font-sans text-zinc-300 text-center mb-12">
    Hi! I’m Zainab, a data analyst who enjoys finding patterns and telling clear stories with data.
    I work in Python/Pandas with growing skills in Excel, SQL, Power BI, and Tableau.
  </p>

  {/* CLEAN Timeline — glossy nodes + glow */}
  <div className="mt-10">
    <CleanTimeline />
  </div>
</Section>






{/* PROJECTS */}
<Section id="projects" bg="particles" className="py-16 w-full">
  <div className="mx-auto max-w-6xl px-4">
    <h2 className="text-3xl font-serif font-semibold text-thunder dark:text-yellow-300 mb-8 text-center">
      Projects
    </h2>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
  <ProjectCard href="/projects/netflix" title="Netflix Data Analysis"
    description="Cleaned and explored Netflix titles data; visualized trends with Python & matplotlib."
    imageSrc="/netflix.png" tags={["Python","Pandas"]} />
  <ProjectCard href="/projects/salary-insights" title="Salary Insights"
    description="Aggregated salaries by role/level; built a baseline predictor."
    imageSrc="/salary.png" tags={["Stats","Pandas"]} />
  <ProjectCard href="/projects/education-data" title="Education Data Exploration"
    description="Explored student performance by demographics with clean visuals."
    imageSrc="/education.png" tags={["EDA"]} />
  <ProjectCard href="/projects/breast-cancer" title="Breast Cancer Prediction"
    description="Logistic regression with accuracy & ROC AUC."
    imageSrc="/cancer.png" tags={["Sklearn"]} />
  <ProjectCard href="/projects/power-bi" title="Power BI Dashboards"
    description="Executive-ready dashboards with DAX & responsive layouts."
    imageSrc="/powerbi.png" tags={["PowerBI"]} />
  <ProjectCard href="/projects/tableau" title="Tableau Visualizations"
    description="Story points with parameters and clean typography."
    imageSrc="/tableau.png" tags={["Tableau"]} />
</div>

  </div>
</Section>


 <ExperienceSection />

      {/* SKILLS */}
      <Section id="skills" bg="orbs" className="py-12 w-full">
        <h2 className="sr-only">Skills</h2>
      </Section>



{/* CONTACT — AI / sci-fi vibe */}
<Section id="contact" className="py-20 w-full">

  <div className="relative isolate mx-auto w-[min(95vw,1100px)]">
    {/* animated neural network */}
    <NeuroBG density={64} connectRadius={150} />

    {/* aurora blobs */}
    <div className="pointer-events-none absolute -inset-10">
      <div className="absolute left-[-10%] top-[-10%] h-[40vmax] w-[40vmax] rounded-full blur-3xl opacity-50
                      bg-[conic-gradient(at_30%_30%,#6ee7b7,transparent_40%,#22d3ee,transparent_70%,#a78bfa)]
                      animate-[aurora_12s_ease_infinite]" />
      <div className="absolute right-[-8%] bottom-[-12%] h-[42vmax] w-[42vmax] rounded-full blur-3xl opacity-40
                      bg-[conic-gradient(at_70%_70%,#818cf8,transparent_35%,#f472b6,transparent_70%,#34d399)]
                      animate-[aurora_12s_ease_infinite]" />
    </div>

    {/* scanline overlay */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
      <div className="absolute inset-x-0 top-0 h-[120%]
                      bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.05)_50%,transparent_100%)]
                      animate-[scan_6s_linear_infinite] opacity-50" />
    </div>

    {/* card with animated border */}
    <div
      className="relative overflow-hidden rounded-3xl p-[1px]
                 bg-[linear-gradient(90deg,rgba(52,211,153,.6),rgba(34,211,238,.6),rgba(129,140,248,.6))]
                 [background-size:200%_100%] animate-[borderFlow_8s_linear_infinite]"
    >
      <div className="relative rounded-3xl bg-white/75 dark:bg-zinc-900/60 backdrop-blur-xl
                      ring-1 ring-zinc-900/10 dark:ring-white/10 p-6 sm:p-8 md:p-10">
        {/* heading */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight
                         bg-[linear-gradient(90deg,#34d399,#22d3ee,#818cf8)]
                         bg-clip-text text-transparent animate-[flicker_6s_linear_infinite]">
            Let’s Create with Data
          </h2>
          <p className="mt-3 text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
            Tell me about your dataset, your goal, and your deadline. I’ll reply with a clear plan.
          </p>
        </div>

       <div className="!bg-transparent !shadow-none !border-0 !backdrop-blur-0">
  <ContactForm route="/api/message" />
</div>

      </div>
    </div>
  </div>
</Section>


{/* FOOTER */}
      <footer className="mt-8 py-6 text-center text-sm bg-sage dark:bg-[#0d1310] text-gray-700 dark:text-gray-400 font-sans w-full">
        &copy; {new Date().getFullYear()} Zainab Abdulhasan. All rights reserved.
      </footer>
    </div>
  );
}
