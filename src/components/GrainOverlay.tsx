"use client";
import * as React from "react";

// Deterministic SVG data URL (same on server & client)
const GRAIN_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
     <filter id="n">
       <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2" stitchTiles="stitch"/>
     </filter>
     <rect width="400" height="400" filter="url(#n)" opacity="0.35"/>
   </svg>`
)}`;

export function GrainOverlay() {
  return (
    <div
      className="absolute inset-0 -z-10 opacity-[0.15] mix-blend-multiply dark:opacity-[0.12]"
      style={{ backgroundImage: `url('${GRAIN_URL}')`, backgroundSize: "300px" }}
    />
  );
}
