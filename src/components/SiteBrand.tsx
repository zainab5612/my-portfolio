"use client";

import Link from "next/link";

type Variant = "monogram" | "outline" | "mono";

export default function SiteBrand({
  name = "Zainab Abdulhasan",
  role = "Data Analyst",
  href = "/",
  variant = "monogram",
}: {
  name?: string;
  role?: string;
  href?: string;
  variant?: Variant;
}) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? "";
  const last = parts.slice(1).join(" ") || "";

  const initials = (first[0] ?? "").toUpperCase() + (last[0] ?? "").toUpperCase();

  if (variant === "mono") {
    // Minimal wordmark, smallcaps vibe
    return (
      <Link href={href} aria-label={name} className="inline-flex items-center gap-2">
        <span className="text-[13px] tracking-[0.22em] font-semibold text-zinc-900 dark:text-zinc-100">
          {name.toUpperCase()}
        </span>
        <span className="hidden sm:inline-block rounded-full px-2 py-[2px] text-[10px] tracking-[0.12em] text-zinc-600 dark:text-zinc-300 ring-1 ring-zinc-900/10 dark:ring-white/10">
          {role.toUpperCase()}
        </span>
      </Link>
    );
  }

  if (variant === "outline") {
    // Last name outlined for contrast
    return (
      <Link href={href} aria-label={name} className="inline-flex items-baseline gap-2">
        <span className="text-[18px] md:text-[20px] font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
          {first}
        </span>
        <span
          className="text-[18px] md:text-[20px] font-semibold leading-none text-transparent dark:text-transparent"
          style={{
            WebkitTextStrokeWidth: 1,
            WebkitTextStrokeColor: "currentColor",
            color: "transparent",
          }}
        >
          {last}
        </span>
        <span className="hidden sm:inline-block ml-2 rounded-full px-2 py-[2px] text-[10px] tracking-[0.12em] text-zinc-600 dark:text-zinc-300 ring-1 ring-zinc-900/10 dark:ring-white/10">
          {role.toUpperCase()}
        </span>
      </Link>
    );
  }

  // Default: monogram + wordmark
  return (
    <Link href={href} aria-label={name} className="inline-flex items-center gap-3 group">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-[12px] font-semibold tracking-wider">
        {initials}
      </span>
      <span className="flex items-baseline gap-2">
        <span className="text-[18px] md:text-[20px] font-semibold leading-none text-zinc-900 dark:text-zinc-100">
          {first}
        </span>
        <span className="text-[18px] md:text-[20px] font-medium leading-none text-zinc-600 dark:text-zinc-300">
          {last}
        </span>
      </span>
      <span className="hidden sm:inline-block ml-1 rounded-full px-2 py-[2px] text-[10px] tracking-[0.12em] text-zinc-600 dark:text-zinc-300 ring-1 ring-zinc-900/10 dark:ring-white/10">
        {role.toUpperCase()}
      </span>
    </Link>
  );
}
