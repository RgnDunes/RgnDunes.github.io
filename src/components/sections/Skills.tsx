"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { skillCategories } from "@/data/skills";

export default function Skills() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(skillCategories[0].name);
  const current = skillCategories.find((c) => c.name === active);

  return (
    <section id="skills" ref={ref} className="page-shell py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">iii.</span>
          <div>
            <h2 className="font-display text-display-3 text-ink">
              Instruments of the trade<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-end md:text-right">
          Twenty-plus tools, five categories, one long apprenticeship
        </p>
      </motion.div>

      {/* Category rail */}
      <div className="mt-10 flex flex-wrap gap-2">
        {skillCategories.map((c) => (
          <button
            key={c.name}
            onClick={() => setActive(c.name)}
            className={`rounded-full border px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.15em] transition-all ${
              active === c.name
                ? "border-ink bg-ink text-paper"
                : "border-rule bg-paper text-ink-2 hover:border-ink hover:text-ink"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Skills grid with a constellation backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative mt-10"
        >
          {/* Constellation lines drawn as an SVG overlay */}
          <ConstellationLines count={current?.skills.length || 0} />

          <div className="relative grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {current?.skills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="group relative overflow-hidden rounded-2xl border border-rule bg-paper p-5 transition-all hover:border-ink"
              >
                {/* Constellation dot at the top-left corner of the tile */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-saffron opacity-70"
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="relative h-10 w-10 flex-shrink-0">
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                    {s.experience}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="font-display text-lg text-ink">{s.name}</div>
                </div>
                <div className="pointer-events-none absolute -bottom-6 -right-6 h-16 w-16 rounded-full bg-saffron/0 blur-2xl transition-all group-hover:bg-saffron/15" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

/**
 * A soft constellation of dashed connector lines drawn behind the
 * skill grid. Lines are deterministic per count so the map feels
 * intentional. Purely decorative.
 */
function ConstellationLines({ count }: { count: number }) {
  const lines = useMemo(() => generateLines(count), [count]);
  if (count === 0) return null;

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="rgb(232 106 43 / 0.28)"
          strokeWidth="0.14"
          strokeDasharray="0.6 0.6"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: i * 0.06, ease: [0.2, 0.8, 0.2, 1] }}
        />
      ))}
      {/* A few standalone "stars" */}
      {STARS.map((s, i) => (
        <motion.circle
          key={`s-${i}`}
          cx={s.x}
          cy={s.y}
          r="0.35"
          fill="rgb(232 106 43 / 0.55)"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
        />
      ))}
    </svg>
  );
}

const STARS = [
  { x: 8, y: 12 },
  { x: 92, y: 18 },
  { x: 14, y: 78 },
  { x: 88, y: 84 },
  { x: 50, y: 6 },
  { x: 50, y: 94 },
];

/**
 * Deterministic constellation: rows of 4 tiles. We draw lines that
 * skip a tile ("connect this one to the next-next") so we get a
 * criss-cross rather than a strict rectangle outline.
 */
function generateLines(n: number) {
  const cols = 4;
  const rows = Math.ceil(n / cols);
  if (rows < 1) return [];

  const pos = (i: number) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    // Convert to viewBox %, keeping a small inset
    const x = 12 + (c / (cols - 1 || 1)) * 76;
    const y = 12 + (rows === 1 ? 50 : (r / (rows - 1)) * 76);
    return { x, y };
  };

  const out: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i < n; i++) {
    const a = pos(i);
    // Neighbor lines
    if (i + 1 < n && (i + 1) % cols !== 0) {
      const b = pos(i + 1);
      out.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
    if (i + cols < n) {
      const b = pos(i + cols);
      out.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
    // Diagonal every 3rd
    if (i + cols + 1 < n && (i + 1) % cols !== 0 && i % 3 === 0) {
      const b = pos(i + cols + 1);
      out.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });
    }
  }
  return out;
}
