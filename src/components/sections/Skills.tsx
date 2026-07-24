"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
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
            <span className="eyebrow">The Toolkit</span>
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

      {/* Skills grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        >
          {current?.skills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              className="group relative overflow-hidden rounded-2xl border border-rule bg-paper p-5 transition-all hover:border-ink"
            >
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
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
