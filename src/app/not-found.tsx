import type { Metadata } from "next";
import ObservatoryInterior from "@/components/blog/ObservatoryInterior";
import TransitionLink from "@/components/transitions/TransitionLink";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "The page you were looking for is not part of the notebook — try the cover page, browse the Engineering Diaries blog, or head to the work history.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <ObservatoryInterior beat="articles">
      <main className="obs-not-found">
        <section className="obs-not-found-hero">
          <p className="obs-kicker">Folio · 404</p>
          <span className="obs-not-found-code" aria-hidden="true">
            404
          </span>
          <h1>This page slipped out of the observatory.</h1>
          <p>
            The address is not part of the current edition. Continue from the
            portfolio or browse the published articles.
          </p>
          <div className="obs-not-found-actions">
            <TransitionLink href="/" className="obs-primary">
              Return home
            </TransitionLink>
            <TransitionLink href="/blog" className="obs-text-link">
              Browse articles
            </TransitionLink>
          </div>
        </section>

        <nav className="obs-not-found-routes" aria-label="Useful destinations">
          <h2>Continue exploring</h2>
          <TransitionLink href="/#work">
            <span>01</span>
            <strong>Work history</strong>
            <small>Roles, outcomes, and engineering impact</small>
          </TransitionLink>
          <TransitionLink href="/blog">
            <span>02</span>
            <strong>Published articles</strong>
            <small>Frontend infrastructure, CI/CD, and systems</small>
          </TransitionLink>
          <TransitionLink href="/#contact">
            <span>03</span>
            <strong>Contact</strong>
            <small>Start a conversation</small>
          </TransitionLink>
        </nav>
      </main>
    </ObservatoryInterior>
  );
}
