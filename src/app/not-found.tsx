import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you were looking for is not part of the notebook — try the cover page, browse the Engineering Diaries blog, or head to the work history.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="page-shell py-24 md:py-32">
      <section className="mx-auto max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
          Folio · 404
        </p>
        <h1 className="mt-6 font-display text-5xl text-ink md:text-6xl">
          This page slipped out of the notebook.
        </h1>
        <p className="mt-6 text-lg text-ink-2">
          The URL you followed is not in the current edition. It may have been
          renamed, retired, or never existed — but the notebook still has plenty
          of pages worth reading.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">
            Back to Home
          </Link>
          <Link href="/blog" className="btn-ghost">
            Browse Blog
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="try-these"
        className="mx-auto mt-16 max-w-3xl border-t border-rule pt-10"
      >
        <h2
          id="try-these"
          className="font-display text-2xl text-ink md:text-3xl"
        >
          Try one of these instead
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          <li>
            <Link href="/" className="link-quiet">
              Cover page — About Divyansh
            </Link>
            <p className="mt-1 text-sm text-ink-2">
              Software engineer building web infrastructure and CI/CD systems at
              Rippling. Previously Razorpay.
            </p>
          </li>
          <li>
            <Link href="/blog" className="link-quiet">
              Engineering Diaries
            </Link>
            <p className="mt-1 text-sm text-ink-2">
              Long-form essays on React, Node.js internals, CI/CD pipelines, and
              the small unglamorous rituals of shipping software.
            </p>
          </li>
          <li>
            <Link href="/#work" className="link-quiet">
              Work history
            </Link>
            <p className="mt-1 text-sm text-ink-2">
              A chronicle of what I have built and shipped across the last
              several years — the roles, the teams, the receipts.
            </p>
          </li>
          <li>
            <Link href="/#contact" className="link-quiet">
              Say hello
            </Link>
            <p className="mt-1 text-sm text-ink-2">
              Reach out about work, collaborations, or just to talk shop about
              frontend infrastructure and developer tooling.
            </p>
          </li>
        </ul>
      </section>
    </main>
  );
}
