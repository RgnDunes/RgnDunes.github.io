"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { articles } from "@/data/articles";

export default function Articles() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<string>("All");
  const [showAll, setShowAll] = useState(false);

  const types = useMemo(
    () => ["All", ...Array.from(new Set(articles.map((a) => a.type).filter(Boolean)))],
    []
  );

  const filtered = useMemo(
    () =>
      articles.filter((a) => {
        const t = q.toLowerCase();
        const matchesQ =
          !t || a.title.toLowerCase().includes(t) || a.description.toLowerCase().includes(t);
        const matchesTab = tab === "All" || a.type === tab;
        return matchesQ && matchesTab;
      }),
    [q, tab]
  );

  const shown = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="publications" ref={ref} className="page-shell py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">vi.</span>
          <div>
            <span className="eyebrow">The Archive</span>
            <h2 className="font-display text-display-3 text-ink">
              Talks & essays<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-end md:text-right">
          Search {articles.length} pieces across performance, tooling, React and system design
        </p>
      </motion.div>

      {/* Search bar */}
      <div className="mt-10 flex flex-col gap-4">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles, topics, hunches…"
            className="w-full rounded-full border border-rule bg-paper py-3 pl-11 pr-5 text-sm text-ink outline-none transition-all placeholder:text-muted focus:border-ink"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-all ${
                tab === t
                  ? "border-ink bg-ink text-paper"
                  : "border-rule bg-paper text-ink-2 hover:border-ink hover:text-ink"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results as an editorial list */}
      <AnimatePresence mode="wait">
        <motion.ul
          key={tab + q}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mt-10 divide-y divide-rule border-y border-rule"
        >
          {shown.map((a, i) => (
            <motion.li
              key={a.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <a
                href={a.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 py-5 md:grid-cols-[80px_120px_1fr_auto] md:gap-8"
              >
                <span className="col-span-1 font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted md:col-span-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="col-span-1 hidden font-mono text-[10.5px] uppercase tracking-[0.15em] text-saffron md:block">
                  {a.type}
                </span>
                <div className="col-span-2 md:col-span-1">
                  <h3 className="font-display text-lg leading-tight text-ink transition-colors group-hover:text-saffron md:text-xl">
                    {a.title}
                  </h3>
                  <p className="mt-1.5 clamp-2 max-w-3xl text-sm text-ink-2">{a.description}</p>
                </div>
                <span className="col-span-1 flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted transition-colors group-hover:text-ink md:col-span-1">
                  {a.date}
                  <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </motion.li>
          ))}
          {shown.length === 0 && (
            <li className="py-16 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">
              No pieces match — try a different tab or a broader search.
            </li>
          )}
        </motion.ul>
      </AnimatePresence>

      {!showAll && filtered.length > 6 && (
        <div className="mt-10 text-center">
          <button onClick={() => setShowAll(true)} className="btn-ghost">
            View all {filtered.length} pieces <FaArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
      {showAll && filtered.length > 6 && (
        <div className="mt-10 text-center">
          <button
            onClick={() => {
              setShowAll(false);
              ref.current?.scrollIntoView({ behavior: "smooth" });
            }}
            className="link-quiet font-mono text-[11px] uppercase tracking-[0.2em]"
          >
            Show less ↑
          </button>
        </div>
      )}
    </section>
  );
}
