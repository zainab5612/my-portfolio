"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// ContactForm with ultra‑subtle aurora that blends with the page ombré.
// No external UI/icon deps. Tailwind + Framer Motion only.
// The aurora colors read CSS variables --ombre-start / --ombre-end if present,
// with graceful fallbacks that match your cyan↔︎fuchsia page gradient.
// You can also tweak intensity by editing the inline opacities below.

type Status =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export default function ContactForm({ route = "/api/message" }: { route?: string }) {
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ type: "loading" });

    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const res = await fetch(route, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus({ type: "success", message: "Thanks! I'll get back to you soon." });
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setStatus({ type: "error", message: "Couldn't send right now. Please email me directly." });
    }
  }

  return (
    <section id="contact" className="relative isolate overflow-visible w-full" aria-labelledby="contact-title">
      {/* Subtle, blended aurora — tuned down and matched to page ombré */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Soft conic ribbon (very low opacity + soft-light blend) */}
        <div className="absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_38%,#000,transparent)] opacity-20">
          <div
            className="absolute -inset-60 blur-[90px] animate-[drift_28s_linear_infinite]"
            style={{
              background:
                "conic-gradient(from 0deg at 50% 50%, var(--ombre-start, rgba(56,189,248,.22)), var(--ombre-end, rgba(244,114,182,.22)), var(--ombre-start, rgba(56,189,248,.22)))",
              mixBlendMode: "soft-light",
            }}
          />
        </div>
        {/* Dimmed orbs (tiny + slow) */}
        <span
          className="absolute left-[8%] top-[26%] rounded-full blur-3xl"
          style={{ width: "9rem", height: "9rem", background: "var(--ombre-start, rgba(56,189,248,.18))", opacity: 0.12, animation: "float 30s ease-in-out infinite" }}
        />
        <span
          className="absolute right-[10%] bottom-[18%] rounded-full blur-3xl"
          style={{ width: "11rem", height: "11rem", background: "var(--ombre-end, rgba(244,114,182,.18))", opacity: 0.12, animation: "float 34s ease-in-out infinite reverse" }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-28">
        <motion.h2
          id="contact-title"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center font-serif text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100"
        >
          Let's connect
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mb-12 max-w-2xl text-center text-slate-600 dark:text-slate-300"
        >
          Questions, collaborations, or opportunities? Drop me a line—I'm quick to reply.
        </motion.p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Info card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="relative rounded-2xl border border-white/30 bg-white/30 p-6 shadow-xl backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/30"
          >
            <div className="absolute -top-3 -left-3 rounded-full bg-fuchsia-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              <div className="flex items-center gap-1">
                <SparklesIcon className="h-3.5 w-3.5" /> Magic UI
              </div>
            </div>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="rounded-xl bg-fuchsia-100 p-2 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-300">
                  <MailIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Email</p>
                  <a href="mailto:zandulstudent@gmail.com" className="text-slate-600 underline-offset-2 hover:underline dark:text-slate-300">
                    zandulstudent@gmail.com
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="rounded-xl bg-cyan-100 p-2 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300">
                  <PinIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Based in</p>
                  <p className="text-slate-600 dark:text-slate-300">San Diego, CA (Remote‑friendly)</p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="rounded-xl bg-emerald-100 p-2 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <ClockIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Response time</p>
                  <p className="text-slate-600 dark:text-slate-300">Usually within 24 hours</p>
                </div>
              </li>
            </ul>

            <div className="mt-6">
                          </div>
          </motion.div>

          {/* Form card */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="relative rounded-2xl border border-white/30 bg-white/40 p-6 shadow-xl backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/40"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">Your name</label>
                <input
                  id="name"
                  name="name"
                  placeholder="Zainab Abdulhasan"
                  required
                  className="w-full rounded-xl border border-slate-200/60 bg-white/80 px-3 py-2 text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-200/60 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-slate-200/60 bg-white/80 px-3 py-2 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-200/60 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="subject" className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">Subject</label>
              <input
                id="subject"
                name="subject"
                placeholder="Let's work together"
                className="w-full rounded-xl border border-slate-200/60 bg-white/80 px-3 py-2 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-200/60 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-slate-800 dark:text-slate-200">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell me about your idea…"
                required
                className="min-h-[140px] w-full resize-y rounded-xl border border-slate-200/60 bg-white/80 px-3 py-2 text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-200/60 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100"
              />
            </div>

            {/* Status */}
            <div className="mt-4 h-6">
              {status.type === "success" && (
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  <CheckIcon className="h-4 w-4" /> {status.message}
                </p>
              )}
              {status.type === "error" && (
                <p className="flex items-center gap-2 text-sm font-medium text-rose-700 dark:text-rose-300">
                  <AlertIcon className="h-4 w-4" /> {status.message}
                </p>
              )}
            </div>

            <div className="mt-2 flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={status.type === "loading"}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-fuchsia-500/50 bg-gradient-to-br from-fuchsia-600 to-cyan-600 px-5 py-3 text-white shadow-lg transition hover:shadow-xl focus:outline-none disabled:opacity-60"
              >
                <span className="absolute inset-0 -translate-x-full bg-white/25 blur-xl transition duration-500 group-hover:translate-x-0" />
                {status.type === "loading" ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
                <span className="relative z-10">Send message</span>
              </button>

              <a
                href="mailto:zandulstudent@gmail.com?subject=Portfolio%20Inquiry"
                className="group inline-flex items-center gap-1 text-sm font-medium text-fuchsia-700 underline-offset-2 hover:underline dark:text-fuchsia-300"
              >
                Or email directly
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
            </div>
          </motion.form>
        </div>
      </div>

      {/* Local styles for background animation */}
      <style jsx>{`
        @keyframes drift { 0% { transform: translate3d(0,0,0) rotate(0deg); } 50% { transform: translate3d(-4%,3%,0) rotate(16deg); } 100% { transform: translate3d(0,0,0) rotate(360deg); } }
        @keyframes float { 0%,100% { transform: translateY(0px) translateX(0px); } 50% { transform: translateY(-12px) translateX(5px); } }
      `}</style>
    </section>
  );
}
// Typed SVG defaults that preserve the literal unions TypeScript expects
const svgDefaults = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
} satisfies React.SVGProps<SVGSVGElement>;


/* ------------------------ Inline SVG Icons (no deps) ----------------------- */
function baseIconProps(props: React.SVGProps<SVGSVGElement>) {
  return { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", ...props };
}

function MailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M4 4h16v16H4z" opacity="0" />
      <path d="M4 6l8 6 8-6" />
      <rect x="4" y="6" width="16" height="12" rx="2" ry="2" />
    </svg>
  );
}

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgDefaults} {...props}>
      <path d="M4.42 21.6c5.3-3.8 6.9-11.2 8.6 4.67 6.0 10-6 10" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgDefaults} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}


function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgDefaults} {...props}>
      <path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z" />
      <path d="M20 14l1 2-2 1 2 1-1 2 2-1 2 1-1-2 2-1-2-1 1-2-2 1-2-1z" />
    </svg>
  );
}

function SendIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgDefaults} {...props}>
      <path d="M22 2 11 13" />
      <path d="M22 21 7 20 4 9 9 4 20 7z" />
    </svg>
  );
}


function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}


function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgDefaults} {...props}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgDefaults} {...props}>
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function Spinner(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgDefaults} {...props} className={`animate-spin ${props.className ?? ""}`}>
      <circle cx="12" cy="12" r="10" className="opacity-25" />
      <path d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" className="opacity-75" />
    </svg>
  );
}

