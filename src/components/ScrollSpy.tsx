"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ScrollSpy({ ids }: { ids: string[] }) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 1] }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);

  return (
    <ul className="flex gap-8 text-lg">
      {ids.map(id => (
        <li key={id}>
          <Link
            href={`#${id}`}
            className={`relative after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:bg-fern after:transition-all after:duration-300
                        ${active === id ? "text-fern after:w-full" : "after:w-0 hover:after:w-full"}`}
          >
            {id === "learning" ? "Now Learning" : id[0].toUpperCase() + id.slice(1)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
