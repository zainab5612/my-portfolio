"use client";

import FlipDeck, { DeckCard } from "./FlipDeck";

export default function CleanDeck({
  items,
}: {
  items: Array<{
    id: string;
    title: string;
    summary?: string;
    screenshot?: string;
    link?: string;
  }>;
}) {
  const cards: DeckCard[] = items.map((it, i) => ({
    id: it.id ?? String(i),
    title: it.title,
    subtitle: it.summary,
    image: it.screenshot,
    href: it.link,
    cta: "View Notebook",
    bullets: undefined, // add if you want
  }));
  return <FlipDeck cards={cards} />;
}
