"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaArrowDown, FaArrowRight } from "react-icons/fa";
import ViewCounter from "../ViewCounter";
import GlitchSwap from "../kinetic/GlitchSwap";

const verses = [
  { line: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन", lang: "sa", label: "Sanskrit · Bhagavad Gītā 2.47" },
  { line: "karmaṇy‑evādhikāras te mā phaleṣu kadācana", lang: "iast", label: "Transliteration" },
  { line: "You have the right to work - never to its fruits.", lang: "en", label: "English rendering" },
];

const nowItems = [
  { k: "Building at", v: "Rippling · L6" },
  { k: "Focus", v: "Web Infra / CI · CD" },
  { k: "Location", v: "Bengaluru, IN" },
  { k: "Availability", v: "Open to talk" },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Rotate through Sanskrit → translit → English
  const [vIdx, setVIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setVIdx((i) => (i + 1) % verses.length), 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative overflow-hidden pt-16 pb-24 md:pt-24"
    >
      {/* Subtle grid backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 grid-backdrop opacity-40" />
      {/* Warm halo, top-left */}
      <div className="pointer-events-none absolute -left-40 top-10 -z-10 h-[560px] w-[560px] rounded-full bg-saffron/20 blur-[130px]" />
      {/* Second halo, bottom right */}
      <div className="pointer-events-none absolute -right-32 top-1/3 -z-10 h-[480px] w-[480px] rounded-full bg-seal/10 blur-[130px]" />

      <motion.div style={{ y, opacity }} className="page-shell">
        {/* Editorial header row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-4 font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
          <span>Folio 01 · The Cover Page</span>
          <span className="text-ink">
            <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-saffron align-middle" />
            Currently: Rippling · L6
          </span>
          <span>{new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
        </div>

        {/* Colossal typographic name - kinetic reveal */}
        <div className="mt-10 md:mt-16">
          <div className="eyebrow mb-6">Introducing</div>
          <h1 className="sr-only">
            Divyansh Singh — Senior Frontend Engineer at Rippling. Formerly
            Razorpay. Building web infrastructure, developer tooling, and CI/CD
            systems. Also known as rgndunes.
          </h1>
          <motion.div
            aria-hidden
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            className="min-h-[2.2em]"
          >
            <GlitchSwap
              ariaLabel="Divyansh Singh, also known as rgndunes"
              hold={4200}
              glitchMs={520}
              settleMs={220}
              className="font-display font-medium text-ink text-[clamp(3rem,11vw,10.5rem)] leading-[0.92] tracking-[-0.035em]"
              states={[
                <span key="real" className="block">
                  <span className="block">Divyansh</span>
                  <span className="block italic text-saffron">
                    Singh<span className="text-ink">.</span>
                  </span>
                </span>,
                <span
                  key="handle"
                  className="block font-mono text-ink"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  <span className="text-saffron">/</span>rgndunes
                </span>,
              ]}
            />
          </motion.div>
        </div>

        {/* Sub-lede */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-10 grid gap-10 md:grid-cols-[1.35fr_1fr] md:gap-16"
        >
          <div>
            <p className="max-w-[52ch] font-body text-lg leading-[1.55] text-ink-2 md:text-xl">
              A software engineer building the plumbing of the modern web -
              <span className="text-ink"> CI/CD pipelines</span>, developer
              tooling, and <span className="text-ink">deployment infrastructure</span>. Formerly
              a senior frontend engineer at Razorpay, currently at{" "}
              <span className="text-ink">Rippling</span>. This is a working notebook
              of the things I have shipped, written, and taught.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="#work" className="btn-primary">
                Read the work <FaArrowRight className="h-3 w-3" />
              </Link>
              <Link href="#contact" className="btn-ghost">
                Get in touch
              </Link>
              <div className="ml-1 hidden items-center gap-2 md:flex">
                <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
                  or press
                </span>
                <span className="kbd">⌘</span>
                <span className="kbd">K</span>
              </div>
            </div>
          </div>

          {/* Right column - animated verse card */}
          <div className="relative">
            <div className="absolute -left-4 top-0 h-full w-px bg-rule hidden md:block" />
            <div className="relative flex flex-col gap-3 pt-1">
              <span className="eyebrow">The line I return to</span>
              <div className="relative h-[124px] overflow-hidden md:h-[112px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={vIdx}
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -18, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                    lang={verses[vIdx].lang === "iast" ? "sa-Latn" : verses[vIdx].lang}
                    className={`font-display text-[26px] leading-[1.18] text-ink md:text-[28px] ${
                      verses[vIdx].lang === "en" ? "italic" : ""
                    }`}
                    style={{
                      fontFeatureSettings: verses[vIdx].lang === "sa" ? '"kern"' : undefined,
                    }}
                  >
                    {verses[vIdx].line}
                  </motion.p>
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-between">
                <span className="eyebrow">{verses[vIdx].label}</span>
                <div className="flex gap-1.5">
                  {verses.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setVIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === vIdx ? "w-6 bg-saffron" : "w-1.5 bg-rule"
                      }`}
                      aria-label={`View verse ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* "Now" strip - the bento of live data, condensed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-16 rule-h pt-6 md:mt-24"
        >
          <div className="mb-4 flex items-baseline justify-between">
            <span className="eyebrow">- Now</span>
            <ViewCounter pageId="homepage" showLabel={true} />
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {nowItems.map((it) => (
              <div key={it.k}>
                <div className="eyebrow mb-2">{it.k}</div>
                <div className="font-display text-2xl text-ink">{it.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="mt-14 flex items-center gap-3 text-muted"
        >
          <FaArrowDown className="h-3 w-3 animate-float-slow" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.24em]">
            Continue reading - the notebook begins
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

