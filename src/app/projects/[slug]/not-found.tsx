import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen px-4 sm:px-8 py-16 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-3">Project not found</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Please check the URL or return to the projects section.
      </p>
      <Link href="/#projects" className="underline text-fern">
        ← Back to Projects
      </Link>
    </main>
  );
}
