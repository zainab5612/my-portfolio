"use client";
import { motion, useMotionValue, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
 

export default function MagneticButton({ children, className = "", ...props }: any) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLButtonElement | null>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const tx = useTransform(mx, v => v * 0.25);
  const ty = useTransform(my, v => v * 0.25);

  function onMove(e: React.MouseEvent) {
    if (!ref.current || reduce) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set(e.clientX - (rect.left + rect.width / 2));
    my.set(e.clientY - (rect.top + rect.height / 2));
  }
  function onLeave() { mx.set(0); my.set(0); }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduce ? {} : { x: tx, y: ty }}
      className={
        "relative inline-flex items-center justify-center rounded-full px-6 py-3 " +
        "bg-fern text-white font-semibold shadow hover:shadow-lg " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-fern " + className
      }
      {...props}
    >
      {children}
    </motion.button>
  );
}

