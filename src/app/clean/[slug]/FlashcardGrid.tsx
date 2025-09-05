"use client";

import FlipDeck, { type DeckCard } from "@/components/FlipDeck";
import type { CleanItem } from "../content";

export default function FlashcardGrid({ items }: { items: CleanItem[] }) {
  // Map your CleanItem[] into deck cards (CleanItem has no `id`, so generate one)
  const cards: DeckCard[] = items.map((it, i) => ({
    id: `${i}-${it.title}`.toLowerCase().replace(/\s+/g, "-"),
    title: it.title,
    subtitle: it.summary,
    image: it.screenshot, // /public path or remote allowed in next.config
    href: it.link,
    cta: "View Notebook",
  }));

  return (
    <section className="py-4">
      <FlipDeck cards={cards} />
    </section>
  );
}
