"use client";

import { motion } from "framer-motion";

export default function BackgroundBlobs() {
  return (
    <>
      <motion.div
        className="absolute -top-24 -left-16 h-72 w-72 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(66% 60% at 50% 50%, #27a5b53a, transparent 70%)",
        }}
        animate={{ x: [0, 24, 0], y: [0, -18, 0], scale: [1, 1.06, 1] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "mirror",
          ease: [0.16, 1, 0.3, 1],
        }}
      />

      <motion.div
        className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full blur-3xl"
        animate={{ x: [0, -26, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={{
          duration: 14,
          repeat: Infinity,
          repeatType: "mirror",
          ease: [0.16, 1, 0.3, 1],
        }}
      />
    </>
  );
}
