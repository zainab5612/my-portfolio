"use client";

import React from "react";

/** Client-only wavy SVG background (no SSR). */
export default function LiquidWaveClient() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <svg
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="lw" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#e9d5ff" />
          </linearGradient>
        </defs>
        <path
          d="M0,256 C240,208 360,96 720,128 C1080,160 1200,256 1440,224 L1440,0 L0,0 Z"
          fill="url(#lw)"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}
