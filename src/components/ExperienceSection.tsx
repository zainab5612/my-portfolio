'use client';

import { motion } from 'framer-motion';

type Experience = {
  role: string;
  company: string;
  url?: string;
  location?: string;
  start: string;
  end: string;
  bullets: string[];
};

const EXPERIENCES: Experience[] = [
  {
    role: 'Dispatcher',
    company: 'Z & S Transport INC.',
    location: 'El Cajon, CA',
    start: 'Mar 2025',
    end: 'Apr 2025',
    bullets: [
      'Arranged and dispatched 20+ drivers’ daily routes using real-time data and client constraints.',
      'Improved on-time delivery by ~15% via data-driven route adjustments.',
      'Recorded and analyzed daily ops data; contributed to weekly reports and workflow improvements.',
      'Maintained clear communication across drivers, clients, and management.',
    ],
  },
  // Add more roles here when you have them
];

export default function ExperienceSection() {
  return (
    <section id="experience" className="relative mx-auto w-full max-w-5xl px-6 py-16">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white-900/90 dark:text-white-100">
          Experience
        </h2>
        <p className="mt-2 text-white-700/80 dark:text-white-300">
          Roles and impact, summarized.
        </p>
      </header>

      <div className="relative">
        {/* center guideline on md+, left-aligned on mobile */}
        <div className="pointer-events-none absolute left-4 top-0 h-full w-px bg-white/30 dark:bg-white/15 md:left-1/2" />

        <ul className="space-y-10">
          {EXPERIENCES.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function TimelineItem({ item, index }: { item: Experience; index: number }) {
  const isLeft = index % 2 === 0;

  return (
    <li className="relative">
      <div
        className={[
          'grid items-start gap-6 md:grid-cols-2',
          isLeft ? '' : 'md:[&>*:first-child]:order-2',
        ].join(' ')}
      >
        {/* dot on the line */}
        <div className={['relative pl-10 md:pl-0', isLeft ? 'md:pr-10' : 'md:pl-10'].join(' ')}>
          <span
            aria-hidden
            className={[
              'absolute left-4 top-1.5 h-3 w-3 rounded-full',
              'bg-[radial-gradient(circle_at_30%_30%,var(--ombre-from,#818cf8),var(--ombre-to,#22d3ee))]',
              'ring-2 ring-white/80 dark:ring-slate-900/80',
              'md:left-1/2 md:-translate-x-1/2',
            ].join(' ')}
          />
        </div>

        {/* content (no cards, blends with background) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <h3 className="text-lg font-semibold text-white-900 dark:text-white-100">
            {item.role}{' '}
            <span className="text-white-700/80 dark:text-white-300">
              · {item.company}
            </span>
          </h3>

          <p className="mt-1 text-sm text-white-600/90 dark:text-white-400">
            <time>{item.start}</time> – <time>{item.end}</time>
            {item.location ? ` · ${item.location}` : ''}
          </p>

          <ul className="mt-3 list-disc space-y-1 pl-5 text-white-700/90 dark:text-white-300">
            {item.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </motion.div>
      </div>
    </li>
  );
}
