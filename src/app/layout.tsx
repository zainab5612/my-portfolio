// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import RouteTransition from "./RouteTransition";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zainab | Portfolio",
  description: "Data Analytics Portfolio",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 🔒 Force dark mode for the entire site
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`bg-black text-neutral-200 antialiased ${geistSans.variable} ${geistMono.variable}`}>
        {/* Header / brand */}
        <header
          className={[
            "sticky top-0 z-40 border-b border-white/10",
            "bg-[#0f1412]/70 backdrop-blur-md",
          ].join(" ")}
        >
          <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
            {/* BRAND — codey look */}
            <a href="/" className="inline-flex items-center gap-3">
              <span
                className={[
                  "relative inline-flex items-center gap-1",
                  "text-[18px] md:text-[20px] font-semibold leading-none",
                  "font-mono tracking-tight",
                  "bg-[linear-gradient(90deg,#34d399,#22d3ee,#818cf8,#34d399)]",
                  "bg-clip-text text-transparent",
                  "[background-size:220%_100%] animate-[brandShift_14s_linear_infinite]",
                ].join(" ")}
                aria-label="Zainab"
              >
                <span className="text-zinc-400/70">&lt;</span>
                Zainab
                <span className="text-zinc-400/70">/&gt;</span>
                {/* blinking caret */}
                <span
                  className="ml-0.5 h-[1.05em] w-[2px] bg-current/70 translate-y-[2px]
                             animate-[caret_1.2s_steps(1,end)_infinite]"
                  aria-hidden
                />
              </span>

              {/* role chip */}
              <span
                className={[
                  "hidden sm:inline-block rounded-full px-2 py-[2px] text-[10px] tracking-[0.12em]",
                  "font-mono",
                  "text-zinc-300/85 border border-white/10 bg-white/5",
                ].join(" ")}
              >
                DATA ANALYST
              </span>
            </a>

            {/* NAV */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-mono tracking-tight">
              {[
                { href: "#about", label: "About" },
                { href: "#projects", label: "Projects" },
                { href: "#skills", label: "Skills" },
                { href: "#contact", label: "Contact" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative text-zinc-100/90
                             after:content-[''] after:absolute after:left-0 after:-bottom-2
                             after:h-[2px] after:w-0 after:bg-[linear-gradient(90deg,#34d399,#22d3ee,#818cf8)]
                             after:rounded-full after:transition-all after:duration-200 hover:after:w-full"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          {/* thin animated line under the header */}
          <div
            className={[
              "h-[2px] w-full opacity-65",
              "bg-[linear-gradient(90deg,transparent,#34d399,#22d3ee,#818cf8,transparent)]",
              "[background-size:220%_100%] animate-[brandShift_10s_linear_infinite]",
            ].join(" ")}
            aria-hidden
          />
        </header>

        {/* Page content with your transition wrapper */}
        <main>
          <RouteTransition>{children}</RouteTransition>
        </main>
      </body>
    </html>
  );
}
