"use client";

import { useEffect, useRef } from "react";

export default function NeuroBG({
  density = 60,
  connectRadius = 140,
  className = "",
}: {
  density?: number;
  connectRadius?: number;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = Math.max(1, window.devicePixelRatio || 1);

    const state = {
      w: 0,
      h: 0,
      nodes: [] as { x: number; y: number; vx: number; vy: number }[],
      dark: true, // 🔒 always dark
    };

    const resize = () => {
      const { clientWidth, clientHeight } = canvas;
      state.w = clientWidth;
      state.h = clientHeight;
      canvas.width = Math.floor(clientWidth * dpr);
      canvas.height = Math.floor(clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      state.nodes = Array.from({ length: density }, () => ({
        x: Math.random() * state.w,
        y: Math.random() * state.h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, state.w, state.h);

      const stroke = "rgba(180,200,255,0.18)";
      const dot = "rgba(200,220,255,0.7)";

      ctx.fillStyle = dot;
      for (const n of state.nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = state.w + 20;
        if (n.x > state.w + 20) n.x = -20;
        if (n.y < -20) n.y = state.h + 20;
        if (n.y > state.h + 20) n.y = -20;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = stroke;
      for (let i = 0; i < state.nodes.length; i++) {
        for (let j = i + 1; j < state.nodes.length; j++) {
          const a = state.nodes[i],
            b = state.nodes[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < connectRadius * connectRadius) {
            const alpha = 1 - Math.sqrt(d2) / connectRadius;
            ctx.globalAlpha = alpha * 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }

      raf.current = requestAnimationFrame(tick);
    };

    // observe size & DPR changes
    const ro = new ResizeObserver(() => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      resize();
      init();
    });
    ro.observe(canvas);

    resize();
    init();
    tick();

    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      ro.disconnect();
    };
  }, [density, connectRadius]);

  return (
    <canvas
      ref={ref}
      className={["absolute inset-0 w-full h-full pointer-events-none", className].join(" ")}
      aria-hidden
    />
  );
}
