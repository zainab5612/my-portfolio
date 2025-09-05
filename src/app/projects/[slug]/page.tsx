// src/app/projects/[slug]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import Section from "@/components/Section";

/* -------------------------------- Types -------------------------------- */
type Block = { heading: string; text: string };
type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  cover?: string;
  repo?: string;
  demo?: string;
  body: Block[];
  role?: string[];
  tools?: string[];
  outcome?: string[];
};

/* ----------------------------- Fallback repo --------------------------- */
const GITHUB_PROFILE = "https://github.com/zainab5612?tab=repositories";

/* ----------------------------- Your projects --------------------------- */
const PROJECTS: Project[] = [
  {
    slug: "netflix",
    title: "Netflix Data Analysis",
    summary:
      "Cleaned titles data, fixed nulls/dupes, grouped by type & country, and visualized trends.",
    tags: ["Python", "Pandas", "Matplotlib"],
    cover: "/netflix.png",
    repo: "https://github.com/zainab5612/Netflix-project",
    body: [
      { heading: "Context", text: "Public titles dataset with messy fields and duplicates." },
      { heading: "Process", text: "Normalize fields, impute/drop sparse columns, group, and visualize." },
      { heading: "Highlights", text: "Country clusters by content type; outlier flags and top-10 breakdowns." },
    ],
    role: ["Data cleaning", "EDA", "Visualization"],
    tools: ["Python", "Pandas", "Matplotlib"],
    outcome: ["Faster content mix insights", "Reusable EDA notebook"],
  },
  {
    slug: "salary-insights",
    title: "Salary Insights",
    summary:
      "Aggregated salaries by role/level and built a baseline predictor with clean visuals.",
    tags: ["Pandas", "Statistics"],
    cover: "/salary.png",
    repo: "https://github.com/zainab5612/salary-data-analysis",
    body: [
      { heading: "Context", text: "Multiple CSVs combined and standardized (role, level, region)." },
      { heading: "Process", text: "Groupby summaries, boxplots, baseline regression and error checks." },
      { heading: "Findings", text: "Role-level bands, regional differences, and seniority uplift." },
    ],
    role: ["EDA", "Model baseline", "Reporting"],
    tools: ["Python", "Pandas", "scikit-learn"],
    outcome: ["Baseline MAE within target", "Job-title mix summary"],
  },
  {
    slug: "education-data",
    title: "Education Data Exploration",
    summary:
      "Explored student performance by demographics and subjects with clear, focused charts.",
    tags: ["EDA", "Pandas"],
    cover: "/education.png",
repo: "https://github.com/zainab5612/Student-Performance-Analytics",
    body: [
      { heading: "Context", text: "Joined assessment tables; cleaned categorical labels and nulls." },
      { heading: "Process", text: "Distributions, correlations, and subgroup comparisons." },
      { heading: "Highlights", text: "Simple visuals and tidy, reproducible notebooks." },
    ],
    role: ["EDA", "Visualization"],
    tools: ["Python", "Pandas", "Seaborn/Matplotlib"],
    outcome: ["Clear gap visuals", "Hypotheses for deeper study"],
  },
  {
    slug: "breast-cancer",
    title: "Breast Cancer Prediction",
    summary:
      "Logistic regression classification with accuracy, ROC AUC, and error analysis.",
    tags: ["Scikit-learn", "ML", "Python"],
    cover: "/cancer.png",
repo: "https://github.com/zainab5612/Breast-Cancer-Prediction-Logistic-Regression-",
    body: [
      { heading: "Features", text: "Standardized features; train/validation split with stratification." },
      { heading: "Modeling", text: "LogReg baseline; threshold tuning for recall/precision trade-off." },
      { heading: "Result", text: "Strong AUC and calibrated probabilities; transparent coefficients." },
    ],
    role: ["Modeling", "Classification"],
    tools: ["Python", "Pandas", "scikit-learn"],
    outcome: ["Strong baseline accuracy", "Confusion matrix + ROC analysis"],
  },
  {
    slug: "power-bi",
    title: "Power BI Dashboards",
    summary:
      "Executive-ready dashboards with DAX measures and responsive layouts.",
    tags: ["Power BI", "DAX", "Data Modeling"],
    cover: "/powerbi.png",
    demo:
      "https://app.powerbi.com/reportEmbed?reportId=145aee68-ce86-4a5f-8135-8489c18aff72&autoAuth=true&ctid=e85c5307-76b1-4c48-bc5d-e88373dda261&actionBarEnabled=true",
    body: [
      { heading: "Model", text: "Star schema; well-scoped measures; incremental refresh." },
      { heading: "UX", text: "Top cards, trend lines, and drillthrough flows." },
      { heading: "Impact", text: "Cut manual reporting and improved weekly decision cadence." },
    ],
    role: ["Data visualization", "Storytelling"],
    tools: ["Power BI"],
    outcome: ["Dynamic filters for stakeholders", "Quick trend insights"],
  },
  {
    slug: "tableau",
    title: "Tableau Visualizations",
    summary:
      "Story points with parameters and clean typography for accessible data stories.",
    tags: ["Tableau", "Data Viz"],
    cover: "/tableau.png",
    demo: "https://public.tableau.com/app/profile/zainab.abdulhasan/vizzes",
    body: [
      { heading: "Context", text: "Explored public datasets to practice narrative visualization." },
      { heading: "Process", text: "Calculated fields, parameter switches, and tidy design system." },
      { heading: "Highlights", text: "Shareable dashboards with consistent legends and captions." },
    ],
    role: ["Visualization", "Design"],
    tools: ["Tableau"],
    outcome: ["Beautiful, shareable dashboards", "Quick storyboards"],
  },
  {
    slug: "conceptualize",
    title: "Conceptualize",
    summary:
      "Exploratory analysis and dashboards with a clean Python → BI pipeline.",
    tags: ["Python", "Pandas", "Power BI", "Tableau"],
    cover: "/images/conceptualize.jpg",
    body: [
      { heading: "Context", text: "Stakeholders needed quick, visual answers to core KPIs." },
      { heading: "Process", text: "Modeled data in Python; shipped curated tables to BI for interactivity." },
      { heading: "Highlights", text: "Readable cards, drillthrough, and reproducible notebooks." },
    ],
    role: ["EDA", "Pipelines", "BI"],
    tools: ["Python", "Pandas", "Power BI", "Tableau"],
    outcome: ["Faster KPI discovery", "Reproducible pipeline"],
  },
];

/* ------------------------------- Utilities ----------------------------- */
const findProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);

/* --------------------------- Metadata (App Router) --------------------- */
// In your Next version, `params` is a Promise.
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const p = findProject(slug);
  return { title: p ? `Project — ${p.title}` : "Project not found" };
}

/* --------------------------------- Page -------------------------------- */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = findProject(slug);
  if (!p) return notFound();

  const repoHref = p.repo && p.repo.trim().length > 0 ? p.repo : GITHUB_PROFILE;

  return (
    <Section id="project" bg="neuro" className="py-16 w-full">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-6">
          <Link href="/#projects" className="text-sm text-fern hover:underline">
            ← Back to Projects
          </Link>
        </div>

        {/* ---- Card-style hero (unchanged design) ---- */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8 shadow-[0_10px_30px_rgba(0,0,0,.35)]">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            {/* Left: text */}
            <div>
              <h1 className="text-4xl font-serif font-bold text-white">{p.title}</h1>
              <p className="mt-3 text-zinc-300">{p.summary}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-zinc-200"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex gap-3">
                {p.demo ? (
                  <a
                    href={p.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-400 text-black hover:bg-emerald-300 transition"
                  >
                    Live demo
                  </a>
                ) : null}

                {/* Always show Source; fallback to profile if missing */}
                <a
                  href={repoHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl border border-white/20 text-white hover:bg-white/10 transition inline-flex items-center gap-2"
                  title={p.repo ? "Open repository" : "No public repo yet — opens my GitHub"}
                >
                  <FaGithub /> Source
                </a>
              </div>
            </div>

            {/* Right: image */}
            {p.cover ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={p.cover}
                  alt={`${p.title} preview`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* ---- Quick facts ---- */}
        {(p.role?.length || p.tools?.length || p.outcome?.length) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {p.role?.length ? (
              <div className="space-y-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Role</h3>
                <div className="flex flex-wrap gap-2">
                  {p.role.map((r) => (
                    <span key={r} className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-zinc-200">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {p.tools?.length ? (
              <div className="space-y-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {p.tools.map((t) => (
                    <span key={t} className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-xs text-zinc-200">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {p.outcome?.length ? (
              <div className="space-y-2">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">Outcome</h3>
                <ul className="list-disc list-inside text-zinc-200">
                  {p.outcome.map((o) => <li key={o}>{o}</li>)}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* ---- Body write-up ---- */}
        <article className="prose prose-invert mt-10 max-w-none">
          {p.body.map((b) => (
            <section key={b.heading}>
              <h2>{b.heading}</h2>
              <p>{b.text}</p>
            </section>
          ))}
        </article>

        <div className="mt-10">
          <Link href="/#projects" className="text-fern hover:underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    </Section>
  );
}
