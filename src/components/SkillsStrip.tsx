"use client";

import type { ComponentType } from "react";
import { FaReact, FaGitAlt, FaPython } from "react-icons/fa";
import {
  SiTailwindcss,
  SiMysql,
  SiTableau,
  SiPandas,
  SiNumpy,
  SiPowerbi,
  SiMicrosoftexcel,
 SiScikitlearn, 
} from "react-icons/si";

type Item = { label: string; Icon?: ComponentType<{ className?: string }> };

const DEFAULT_ITEMS: Item[] = [
  { label: "MySQL", Icon: SiMysql },
  { label: "Git", Icon: FaGitAlt },
  { label: "Python", Icon: FaPython },
  { label: "NumPy", Icon: SiNumpy },
  { label: "Pandas", Icon: SiPandas },
  { label: "Tableau", Icon: SiTableau },
  { label: "Power BI", Icon: SiPowerbi },
  { label: "React", Icon: FaReact },
{ label: "Excel", Icon: SiMicrosoftexcel },
 { label: "Machine Learning", Icon: SiScikitlearn }, 
  { label: "Tailwind", Icon: SiTailwindcss },
];

export default function SkillsStrip({
  speed = 14,
  gapClass = "gap-16",
  items,
}: {
  speed?: number;
  gapClass?: string;
  items?: Item[];
}) {
  const data = items?.length ? items : DEFAULT_ITEMS;
  const dur = Math.max(6, Math.min(60, speed)); // seconds

  const Row = ({ ariaHidden }: { ariaHidden?: boolean }) => (
    <ul
      className={["flex w-max items-center whitespace-nowrap", gapClass, "px-6 select-none"].join(
        " "
      )}
      aria-hidden={ariaHidden || undefined}
    >
      {data.map(({ label, Icon }, i) => (
        <li key={`${label}-${i}`} className="flex items-center gap-2 text-lg text-zinc-200">
          {Icon ? <Icon className="text-2xl opacity-90 text-white-200" /> : null}
          <span className="font-sans">{label}</span>
        </li>
      ))}
    </ul>
  );

return (
  <div
    className="
      relative w-full py-4
      overflow-visible
    "
  >
    {/* ...leave the rest of the component exactly as-is... */}

      {/* one moving track containing the row 3x for a perfect loop */}
      <div
        className="flex w-max will-change-transform"
        style={{ animation: `skills-marquee-3 ${dur}s linear infinite` }}
      >
        <Row />
        <Row ariaHidden />
        <Row ariaHidden />
      </div>

      {/* local keyframes */}
      <style>{`
        @keyframes skills-marquee-3 {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.3333%); }
        }
      `}</style>
    </div>
  );
}
