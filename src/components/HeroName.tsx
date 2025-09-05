"use client";

export default function HeroName({
  name = "Zainab Abdulhasan",
  role = "Data Analyst",
  sub = "Turning real-world data into clear, actionable visuals.",
  variant = "outline",
}: {
  name?: string;
  role?: string;
  sub?: string;
  variant?: "outline" | "mono";
}) {
  const [first, ...rest] = name.trim().split(/\s+/);
  const last = rest.join(" ");

  return (
    <div className="text-center">
      {/* role chip */}
      <div className="inline-flex items-center rounded-full px-3 py-1 text-[11px] tracking-[0.14em] text-zinc-700 dark:text-zinc-300 ring-1 ring-zinc-900/10 dark:ring-white/10 bg-white/60 dark:bg-white/5">
        {role.toUpperCase()}
      </div>

      {/* name */}
      {variant === "outline" ? (
        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
          <span className="text-zinc-900 dark:text-zinc-100">{first} </span>
          <span
            className="text-transparent dark:text-transparent"
            style={{
              WebkitTextStrokeWidth: 2,
              WebkitTextStrokeColor: "currentColor",
            }}
          >
            {last}
          </span>
        </h1>
      ) : (
        <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {name.toUpperCase()}
        </h1>
      )}

      {/* sub */}
      <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-700 dark:text-zinc-300">
        {sub}
      </p>
    </div>
  );
}
