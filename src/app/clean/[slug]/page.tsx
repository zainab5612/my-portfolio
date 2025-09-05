// src/app/clean/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Section from "@/components/Section";
import CleanDeck from "@/components/CleanDeck";
import { CLEAN_CONTENT, type CleanKey } from "../content";

// helper to make stable ids for deck items
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ----------------------------- Metadata ----------------------------- */
// (Next 15 App Router: params is a Promise)
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const key = slug as CleanKey;
  const page = CLEAN_CONTENT[key];

  const title =
    key === "conceptualize" ? "Conceptualize" :
    key === "locate"        ? "Locate Solvable Issues" :
    key === "evaluate"      ? "Evaluate Unsolvable Issues" :
    key === "augment"       ? "Augment" :
    key === "note"          ? "Note & Document" :
    "CLEAN";

  return { title: page ? `${title} — CLEAN` : "CLEAN" };
}

/* -------------------------------- Page ------------------------------ */
export default async function CleanPageRoute(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const key = slug as CleanKey;
  const items = CLEAN_CONTENT[key];
  if (!items) return notFound();

  const heading =
    key === "conceptualize" ? "Conceptualize" :
    key === "locate"        ? "Locate Solvable Issues" :
    key === "evaluate"      ? "Evaluate Unsolvable Issues" :
    key === "augment"       ? "Augment" :
    "Note & Document";

  const blurbMap: Record<CleanKey, string> = {
    conceptualize:
      "Frame the problem, sketch outputs, and pick the smallest slice that delivers signal quickly.",
    locate:
      "Hunt down data-quality and scoping issues we can fix early to avoid rework.",
    evaluate:
      "Call out risks and trade-offs we can’t remove; set guardrails and document implications.",
    augment:
      "Add the smallest useful enhancements—derived fields, light features, clear visuals—that move the needle.",
    note:
      "Write crisp notes and keep artifacts tidy so the next pass (or teammate) picks up fast.",
  };

  // Map your content to CleanDeck items with stable ids
  const deckItems = items.map((it, i) => ({
    id: `${key}-${i}-${slugify(it.title)}`,
    title: it.title,
    summary: it.summary,
    screenshot: it.screenshot, // uses your exact PNG names in /public
    link: it.link,
  }));

  return (
    <Section id={`clean-${slug}`} bg="neuro" className="py-16 w-full">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6">
          <Link href="/#about" className="text-sm text-fern hover:underline">
            ← Back to About
          </Link>
        </div>

        <h1 className="text-4xl font-serif font-bold text-white">{heading}</h1>
        <p className="mt-3 text-zinc-300 max-w-3xl">{blurbMap[key]}</p>

        <div className="mt-8">
          {/* CleanDeck renders your FlipDeck internally — design unchanged */}
          <CleanDeck items={deckItems} />
        </div>
      </div>
    </Section>
  );
}
