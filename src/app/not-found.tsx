import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
        Folio · 404
      </p>
      <h1 className="mt-6 font-display text-5xl text-ink md:text-6xl">
        This page slipped out of the notebook.
      </h1>
      <p className="mt-6 text-lg text-ink-2">
        The URL you followed is not in the current edition. Head back to the
        cover or browse the archive.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
        <Link href="/blog" className="btn-ghost">
          Browse Blog
        </Link>
      </div>
    </main>
  );
}
