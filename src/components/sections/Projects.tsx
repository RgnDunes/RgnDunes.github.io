"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { FaArrowRight, FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import { projects } from "@/data/projects";

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

      {/* Featured project */}
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-12 grid gap-8 rounded-3xl border border-rule bg-paper-2 p-6 md:grid-cols-[1.1fr_1fr] md:gap-12 md:p-10"
      >
        <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-rule bg-paper p-10">
          {feature.image && (
            <div className="relative h-40 w-40 md:h-56 md:w-56">
              <Image src={feature.image} alt={feature.title} fill className="object-contain" />
            </div>
          )}
          <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-saffron/15 blur-2xl" />
        </div>

        <div className="flex flex-col justify-between gap-6">
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

      {/* Rest as a 3-column bento */}
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {rest.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
            className="paper-card group flex flex-col overflow-hidden"
          >
            <div className="relative flex h-40 items-center justify-center overflow-hidden bg-paper-2 p-6">
              {p.image && (
                <div className="relative h-24 w-24 transition-transform duration-500 group-hover:scale-110">
                  <Image src={p.image} alt={p.title} fill className="object-contain" />
                </div>
              )}
              <div className="absolute -inset-6 -bottom-8 -z-10 rounded-full bg-saffron/0 blur-2xl transition-all group-hover:bg-saffron/15" />
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
                  {p.stats && p.stats !== "N/A" ? p.stats : "Chrome extension"}
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
