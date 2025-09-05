"use client";

import * as React from "react";
import {
  motion,
  animate,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";

/* ---------- Types ---------- */
export type DeckCard = {
  id?: string;
  title?: string;
  subtitle?: string;
  bullets?: string[];
  image?: string; // screenshot URL
  href?: string;  // CTA link
  cta?: string;   // CTA label
};

/* ---------- Utils ---------- */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** normalize to [0,m) even for negative/huge values */
const norm = (v: number, m: number) => ((v % m) + m) % m;

/* coverflow transforms by relative offset (-2..2) */
function coverflowFor(rel: number) {
  const a = Math.abs(rel);
  const scale = lerp(1, 0.86, clamp(a, 0, 1));
  const rotY = -18 * rel;
  const blur = `${lerp(0, 0.8, clamp(a, 0, 1))}px`;
  const y = lerp(0, 28, clamp(a, 0, 1));
  const z = a < 0.5 ? 20 : 10;
  return { scale, rotY, blur, y, z };
}

/* ---------- Deck ---------- */
export default function FlipDeck({
  cards,
  interval = 4000,
  centerWidth = 820, // wider center for readability
  sideWidth = 460,
  sideOffset = 140,
  snapDuration = 0.65,
}: {
  cards: DeckCard[] | null | undefined;
  interval?: number;
  centerWidth?: number;
  sideWidth?: number;
  sideOffset?: number;
  snapDuration?: number;
}) {
  const safeCards = React.useMemo(
    () => (Array.isArray(cards) ? cards.filter(Boolean) : []),
    [cards]
  );
  const count = safeCards.length;

  if (count === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-xl border border-gray-200/40 dark:border-white/10 p-8 text-center text-gray-600 dark:text-gray-300">
        No cards to display.
      </div>
    );
  }

  const containerRef = React.useRef<HTMLDivElement>(null);

  /** continuous position (0..count), can be any real number */
  const progress = useMotionValue(0);

  // re-render while dragging so it glides under the cursor
  const [, setTick] = React.useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setTick((t) => (t + 1) % 1_000_000);
    if (Math.abs(v) > 1e6) progress.set(norm(v, count)); // long-session safety
  });

  const [hover, setHover] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);

  // Lightbox (store index so we can arrow through)
  const [lightboxIdx, setLightboxIdx] = React.useState<number | null>(null);
  const closeLightbox = () => setLightboxIdx(null);
  const showPrev = () =>
    setLightboxIdx((i) => (i == null ? i : (i - 1 + count) % count));
  const showNext = () =>
    setLightboxIdx((i) => (i == null ? i : (i + 1) % count));

  // Lightbox keyboard controls
  React.useEffect(() => {
    if (lightboxIdx == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIdx, count]);

  // drag state
  const startXRef = React.useRef(0);
  const startPRef = React.useRef(0);

  // click-nudge helper: if mouse didn’t move, nudge left/right
  const clickNudge = React.useRef<{ moved: boolean; x: number }>({
    moved: false,
    x: 0,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startXRef.current = e.clientX;
    startPRef.current = progress.get();
    clickNudge.current = { moved: false, x: e.clientX };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(e.clientX - clickNudge.current.x) > 4)
      clickNudge.current.moved = true;
    const slot = sideWidth; // px per “slot”
    progress.set(startPRef.current - dx / slot);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragging(false);

    // If it was basically a click, nudge left/right one card
    if (!clickNudge.current.moved) {
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      const isRight = e.clientX > rect.left + rect.width / 2;
      const p = progress.get();
      animate(progress, p + (isRight ? 1 : -1), {
        duration: snapDuration,
        ease: "easeInOut",
        onComplete: () => progress.set(norm(progress.get(), count)),
      });
      return;
    }

    // Otherwise snap to nearest slide
    const p = progress.get();
    animate(progress, Math.round(p), {
      duration: snapDuration,
      ease: "easeInOut",
      onComplete: () => progress.set(norm(progress.get(), count)), // keep bounded
    });
  };

  // autoplay (pause on hover/drag) — normalize on complete
  React.useEffect(() => {
    if (hover || dragging || lightboxIdx != null) return; // pause inside lightbox too
    const id = setInterval(() => {
      const p = progress.get();
      animate(progress, p + 1, {
        duration: snapDuration,
        ease: "easeInOut",
        onComplete: () => progress.set(norm(progress.get(), count)),
      });
    }, interval);
    return () => clearInterval(id);
  }, [hover, dragging, interval, progress, snapDuration, count, lightboxIdx]);

  // keyboard arrows for deck (when lightbox is closed)
  React.useEffect(() => {
    if (lightboxIdx != null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        const p = progress.get();
        animate(progress, p - 1, {
          duration: snapDuration,
          ease: "easeInOut",
          onComplete: () => progress.set(norm(progress.get(), count)),
        });
      } else if (e.key === "ArrowRight") {
        const p = progress.get();
        animate(progress, p + 1, {
          duration: snapDuration,
          ease: "easeInOut",
          onComplete: () => progress.set(norm(progress.get(), count)),
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [progress, snapDuration, count, lightboxIdx]);

  // layout measure
  const [containerW, setContainerW] = React.useState(0);
  React.useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ready = containerW > 0;
  const centerX = containerW / 2;
  const step = sideWidth - sideOffset;

  const pNorm = norm(progress.get(), count);

  const items = safeCards.map((card, i) => {
    // relative pos around the ring (-count/2 .. count/2]
    let rel = i - pNorm;
    if (rel > count / 2) rel -= count;
    if (rel < -count / 2) rel += count;

    const baseX = centerX + rel * step;
    const w = Math.abs(rel) < 0.5 ? centerWidth : sideWidth;
    const x = baseX - w / 2;

    const { scale, rotY, blur, y, z } = coverflowFor(rel);
    const vis = Math.abs(rel) <= 2 ? 1 : 0; // hide far cards
    return { card, i, rel, x, y, w, scale, rotY, blur, z, vis };
  });

  const safeIdx = Math.round(pNorm) % count;

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-6xl"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Desktop coverflow (drag anywhere) */}
      <div
        className="relative hidden md:block h-[620px] cursor-grab active:cursor-grabbing select-none"
        style={{ perspective: 1800, touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {ready &&
          items.map(({ card, i, rel, x, y, w, scale, rotY, blur, z, vis }) => (
            <motion.div
              key={card.id ?? `card-${i}`}
              className="absolute top-0"
              style={{ width: w, zIndex: z, filter: `blur(${blur})` }}
              animate={{ x, y, rotateY: rotY, scale, opacity: vis }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div
                className={
                  Math.abs(rel) < 0.5
                    ? "rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0B0F13]/75 backdrop-blur-lg ring-1 ring-black/5 shadow-[0_24px_80px_rgba(0,0,0,.35)]"
                    : "rounded-2xl border border-white/10 bg-white/45 dark:bg-[#0B0F13]/60 backdrop-blur-md ring-1 ring-black/5 shadow-[0_18px_60px_rgba(0,0,0,.25)]"
                }
              >
                <DeckFace
                  card={card}
                  compact={!(Math.abs(rel) < 0.5)}
                  onOpen={(url) => setLightboxIdx(i)}
                />
              </div>
            </motion.div>
          ))}
      </div>

      {/* Mobile single card */}
      <div className="md:hidden">
        <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-[#0B0F13]/75 backdrop-blur-lg ring-1 ring-black/5 shadow-2xl">
          <DeckFace
            card={safeCards[safeIdx]}
            onOpen={() => setLightboxIdx(safeIdx)}
          />
        </div>
      </div>

      {/* dots */}
      <div className="mt-4 flex justify-center gap-2">
        {safeCards.map((_, i) => (
          <button
            key={`dot-${i}`}
            onClick={() =>
              animate(progress, i, {
                duration: snapDuration,
                ease: "easeInOut",
                onComplete: () => progress.set(norm(progress.get(), count)),
              })
            }
            className={`h-2 w-2 rounded-full transition ${
              safeIdx === i ? "bg-fern scale-110" : "bg-gray-400/40 dark:bg-gray-500/40"
            }`}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>

      {/* Lightbox modal */}
      {lightboxIdx != null && safeCards[lightboxIdx]?.image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3"
          onClick={closeLightbox}
        >
          {/* stop click bubbling so buttons don’t close immediately */}
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={safeCards[lightboxIdx].image!}
              alt="Expanded preview"
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            />
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute -top-3 -right-3 h-9 w-9 rounded-full bg-white/90 text-black shadow hover:bg-white"
              aria-label="Close"
              title="Close"
            >
              ✕
            </button>
            {/* Prev / Next */}
            <button
              onClick={showPrev}
              className="absolute left-[-3.5rem] top-1/2 -translate-y-1/2 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-black shadow hover:bg-white"
              aria-label="Previous"
              title="Previous"
            >
              ‹
            </button>
            <button
              onClick={showNext}
              className="absolute right-[-3.5rem] top-1/2 -translate-y-1/2 hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-black shadow hover:bg-white"
              aria-label="Next"
              title="Next"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Card Face (no cropping, bigger images) ---------- */
function DeckFace({
  card,
  compact = false,
  onOpen,
}: {
  card?: DeckCard;
  compact?: boolean;
  onOpen?: (url: string) => void;
}) {
  if (!card) return null;

  // taller image area for readability
  const imgBox = compact ? "h-80" : "h-[32rem]"; // tweak as needed

  return (
    <div className="overflow-hidden rounded-2xl">
      <div className={`relative w-full ${imgBox} bg-gray-100/60 dark:bg-white/5`}>
        {card.image ? (
          <button
            onClick={() => onOpen?.(card.image!)}
            className="absolute inset-0"
            aria-label="Open image"
          >
            <img
              src={card.image}
              alt=""
              className="w-full h-full object-contain"
              draggable={false}
              loading="lazy"
            />
          </button>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
            No preview
          </div>
        )}
      </div>

      <div className={`${compact ? "p-5" : "p-6"}`}>
        <h3 className="text-lg sm:text-xl font-semibold">{card.title ?? "Untitled"}</h3>

        {card.subtitle && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {card.subtitle}
          </p>
        )}

        {!compact && card.bullets?.length ? (
          <ul className="mt-4 space-y-2 text-[0.95rem] text-gray-700 dark:text-gray-200">
            {card.bullets!.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-[6px] h-[6px] w-[6px] shrink-0 rounded-full bg-fern" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {!compact && card.href && (
          <a
            href={card.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center rounded-full border px-4 py-2 text-sm hover:border-fern hover:text-fern transition"
          >
            {card.cta ?? "View Notebook"}
          </a>
        )}
      </div>
    </div>
  );
}
