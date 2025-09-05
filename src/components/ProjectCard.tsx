"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

export type ProjectCardProps = {
  href: string;
  title: string;
  description: string;
  imageSrc: string;     // path in /public or a remote URL allowed by next.config.ts
  tags?: string[];      // per-card tags
  className?: string;   // optional extra classes from caller
};

export default function ProjectCard({
  href,
  title,
  description,
  imageSrc,
  tags = [],
  className = "",
}: ProjectCardProps) {
  return (
    <Link
      href={href}
      className={[
        "block overflow-hidden rounded-2xl border",
        "border-slate-200/80 dark:border-slate-800",
        "bg-white/70 dark:bg-slate-900/60 backdrop-blur",
        "shadow-sm hover:shadow-lg transition-shadow",
        className,
      ].join(" ")}
    >
      {/* cover image */}
      <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* text */}
      <div className="p-4">
        <h3 className="text-lg font-semibold leading-tight mb-1">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">
          {description}
        </p>

        {/* tags */}
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li
                key={t}
                className="text-xs rounded-full px-2.5 py-1 border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                #{t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
