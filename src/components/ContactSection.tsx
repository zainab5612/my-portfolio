'use client';

import { useId, useState } from 'react';

type Status = 'idle' | 'sending' | 'ok' | 'err';

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const esc = (s: string) => s.replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export default function ContactSection() {
  const [status, setStatus] = useState<Status>('idle');
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const id = useId();

  const canSubmit =
    name.trim().length >= 2 &&
    isEmail(email) &&
    message.trim().length >= 10 &&
    status !== 'sending';

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus('sending');
    setErrMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (data?.ok) {
        setStatus('ok');
        setName('');
        setEmail('');
        setMessage('');
        // auto-hide success after 5s
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('err');
        setErrMsg(data?.error || 'Something went wrong. Please try again.');
      }
    } catch (err: any) {
      setStatus('err');
      setErrMsg(err?.message || 'Network error. Please try again.');
    }
  }

  return (
    <section className="relative overflow-hidden">
      {/* soft background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900"
      />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-cyan-500/20 blur-3xl"
      />

      <div className="mx-auto max-w-6xl px-6 py-20">
        <header className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Let’s work together
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Have a question or a project in mind? Drop me a message below—I'll reply ASAP.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left column: details / trust */}
          <aside className="rounded-2xl border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contact details</h3>
            <ul className="mt-4 space-y-3 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  ✉️
                </span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</div>
                  <a className="underline-offset-4 hover:underline" href="mailto:zandulstudent@gmail.com">
                    zandulstudent@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  💼
                </span>
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-200">Availability</div>
                  <p>Open to freelance & internship opportunities.</p>
                </div>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-slate-200/60 bg-slate-50/60 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
              <p>Tip: include timelines, budget, and any links (Figma, GitHub) to speed up the reply.</p>
            </div>
          </aside>

          {/* Right column: form */}
          <form
            onSubmit={onSubmit}
            noValidate
            className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60"
          >
            <div className="grid gap-5">
              <div>
                <label
                  htmlFor={`${id}-name`}
                  className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Your name
                </label>
                <input
                  id={`${id}-name`}
                  name="name"
                  placeholder="Zainab"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  aria-invalid={name.trim().length > 0 && name.trim().length < 2}
                />
                {name.trim().length > 0 && name.trim().length < 2 && (
                  <p className="mt-1 text-sm text-rose-600">Please enter at least 2 characters.</p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`${id}-email`}
                  className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Email
                </label>
                <input
                  id={`${id}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  aria-invalid={email.length > 0 && !isEmail(email)}
                />
                {email.length > 0 && !isEmail(email) && (
                  <p className="mt-1 text-sm text-rose-600">Enter a valid email address.</p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`${id}-message`}
                  className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Message
                </label>
                <textarea
                  id={`${id}-message`}
                  name="message"
                  rows={6}
                  placeholder="Tell me a bit about your project…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  aria-invalid={message.length > 0 && message.trim().length < 10}
                />
                {message.length > 0 && message.trim().length < 10 && (
                  <p className="mt-1 text-sm text-rose-600">Please write at least 10 characters.</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>Send message</>
                  )}
                </button>

                {status === 'ok' && (
                  <p className="text-sm text-emerald-600">Thanks! Your message was sent.</p>
                )}
                {status === 'err' && (
                  <p className="text-sm text-rose-600">{errMsg ?? 'Something went wrong.'}</p>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                I’ll only use your details to reply. No spam, ever.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
