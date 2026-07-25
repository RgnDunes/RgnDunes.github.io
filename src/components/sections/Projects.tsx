"use client";

import { motion, useInView, useMotionTemplate, useMotionValue } from "framer-motion";
import Image from "next/image";
import { useRef, MouseEvent as ReactMouseEvent } from "react";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import { projects, type Project } from "@/data/projects";

export default function Projects() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [feature, ...rest] = projects;

  return (
    <section id="notebook" ref={ref} className="page-shell py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">iv.</span>
          <div>
            <span className="eyebrow">The Notebook</span>
            <h2 className="font-display text-display-3 text-ink">
              Selected work<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-end md:text-right">
          Open source · developer tooling · things I wish existed
        </p>
      </motion.div>

      {/* Featured — spotlight follow */}
      <FeaturedCard feature={feature} inView={inView} />

      {/* Rest as a 3-column bento — typographic mastheads, no logo tile */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {rest.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
            className="paper-card group relative flex flex-col overflow-hidden"
          >
            {/* Typographic masthead — folio numeral instead of an app icon */}
            <div className="relative flex h-40 items-center justify-center overflow-hidden border-b border-rule bg-paper-2">
              {/* Big italic folio numeral */}
              <span
                className="font-display italic font-medium leading-none text-ink/[0.12] transition-all duration-500 group-hover:text-saffron/50 group-hover:scale-105"
                style={{ fontSize: "clamp(6rem, 12vw, 9rem)" }}
                aria-hidden
              >
                {String(i + 2).padStart(2, "0")}
              </span>

              {/* Corner markers */}
              <span className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-ink/25" />
              <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-ink/25" />
              <span className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-ink/25" />
              <span className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-ink/25" />

              {/* Chrome-extension stamp */}
              <span className="absolute left-1/2 top-4 -translate-x-1/2 font-mono text-[9.5px] uppercase tracking-[0.24em] text-muted">
                {p.stats && p.stats !== "N/A" ? p.stats : "Chrome Extension"}
              </span>

              <div className="pointer-events-none absolute -inset-6 -bottom-8 -z-10 rounded-full bg-saffron/0 blur-2xl transition-all group-hover:bg-saffron/15" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="mb-2 flex items-center gap-2">
                <span className="folio text-2xl leading-none">0{i + 2}.</span>
                <h4 className="font-display text-xl text-ink">{p.title.split(" - ")[0]}</h4>
              </div>
              <p className="clamp-3 text-[14px] leading-[1.55] text-ink-2">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.technologies.slice(0, 3).map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between pt-5">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                  {p.title.includes("-") ? p.title.split(" - ")[1] : "Open source"}
                </span>
                <div className="flex gap-1">
                  {p.links.map((l) => {
                    const Icon = l.icon;
                    return (
                      <a
                        key={l.label}
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={l.label}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-rule text-ink-2 transition-all hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        <Icon className="h-3 w-3" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mt-10 flex items-center justify-center gap-6"
      >
        <a
          href="https://github.com/RgnDunes"
          target="_blank"
          rel="noopener noreferrer"
          className="link-quiet font-mono text-[12px] uppercase tracking-[0.2em]"
        >
          <FaGithub className="h-3.5 w-3.5" /> Read more on GitHub <FaArrowRight className="h-3 w-3" />
        </a>
      </motion.div>
    </section>
  );
}

/* ─── Featured card with mouse-follow spotlight ────────── */

function FeaturedCard({ feature, inView }: { feature: Project; inView: boolean }) {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${mx}px ${my}px, rgba(232, 106, 43, 0.20), transparent 60%)`;

  const onMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };
  const onLeave = () => {
    mx.set(-200);
    my.set(-200);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onLeave}
      className="relative mt-12 grid gap-8 overflow-hidden rounded-3xl border border-rule bg-paper-2 p-6 md:grid-cols-[1.1fr_1fr] md:gap-12 md:p-10"
    >
      {/* Spotlight overlay — sits above content but below interactives */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-300"
        style={{ background: spotlight }}
      />

      {/* Corner brackets — echo the colophon */}
      <span className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-ink/30" />
      <span className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-ink/30" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-ink/30" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-ink/30" />

      {/* Left column — typographic mark, not an app icon */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-rule bg-paper p-10">
        <span className="eyebrow">npm</span>
        <span
          className="font-display italic font-medium leading-[0.9] text-ink text-center"
          style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
        >
          @razorpay<span className="text-saffron">/</span>
          <br />
          i18nify-js
        </span>
        <div className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron animate-pulse" />
          {feature.stats}
        </div>
        <div className="pointer-events-none absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-saffron/15 blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col justify-between gap-6">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="stamp">Featured · Open Source</span>
            {feature.stats && feature.stats !== "N/A" && (
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-saffron">
                {feature.stats}
              </span>
            )}
          </div>
          <h3 className="font-display text-display-3 text-ink">{feature.title}</h3>
          <p className="mt-4 max-w-prose text-[16px] leading-[1.65] text-ink-2">
            {feature.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {feature.technologies.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {feature.links.map((l) => {
            const Icon = l.icon;
            return (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                <Icon className="h-3.5 w-3.5" />
                {l.label}
              </a>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}
