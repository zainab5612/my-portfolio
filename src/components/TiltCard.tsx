"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ReactNode } from "react";

export default function TiltCard({ children, className = "" }: { children: ReactNode; className?: string; }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [6, -6]);
  const rotateY = useTransform(x, [-50, 50], [-6, 6]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={"relative rounded-2xl border border-moss/20 dark:border-sage/20 shadow bg-sand/80 dark:bg-[#0f1412]/80 " + className}
    >
      {/* soft hover glow */}
      <span aria-hidden className="pointer-events-none absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition
                                   blur-2xl" style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(47,133,90,0.25), transparent 70%)" }} />
      {children}
    </motion.div>
  );
}
