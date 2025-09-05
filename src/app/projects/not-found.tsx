import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-4 sm:px-8 py-20 text-center">
      <h1 className="text-3xl font-serif font-semibold mb-2">Project not found</h1>
      <p>Please check the URL or return to the projects section.</p>
      <Link href="/#projects" className="inline-block mt-6 text-fern hover:underline">
        Back to Projects
      </Link>
    </div>
  );
}
