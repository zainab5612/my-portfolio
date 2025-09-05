"use client";

import React from "react";

/** Soft floating gradient orbs behind the section. */
export default function ParallaxOrbs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* big soft blobs */}
      <div className="absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full blur-3xl opacity-40 bg-gradient-to-br from-indigo-400/40 via-fuchsia-400/30 to-cyan-300/30 animate-float-slow" />
      <div className="absolute top-1/4 -right-20 h-[420px] w-[420px] rounded-full blur-3xl opacity-35 bg-gradient-to-br from-emerald-300/30 via-cyan-300/30 to-indigo-400/30 animate-float-rev" />
      <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full blur-3xl opacity-30 bg-gradient-to-br from-amber-300/30 via-rose-300/30 to-violet-400/30 animate-float-slow delay-300" />

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) }
          50%      { transform: translateY(-10px) }
        }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
        .animate-float-rev  { animation: float-slow 14s ease-in-out infinite reverse; }
      `}</style>
    </div>
  );
}
