"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaSearch, FaArrowRight, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { articles } from "@/data/articles";

const PER_PAGE = 6;

export default function Articles() {
  const ref = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<string>("All");
  const [page, setPage] = useState(0);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  // Reset to first page when filter/search changes
  useEffect(() => {
    setPage(0);
  }, [tab, q]);

  const start = page * PER_PAGE;
  const shown = filtered.slice(start, start + PER_PAGE);

  const goto = (next: number) => {
    const bounded = Math.max(0, Math.min(next, totalPages - 1));
    setPage(bounded);
    // Scroll the list top into view so users see the fresh page
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            <h2 className="font-display text-display-3 text-ink">
              Talks & essays<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3 md:justify-self-end">
          <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:text-right">
            Search {articles.length} pieces across performance, tooling, React and system design
          </p>
          {/* Magazine circulation stamp */}
          <div className="inline-flex items-center gap-2 rounded-full border border-ink bg-paper px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-ink">
            <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
            <span>Circulation · {articles.length}</span>
            <span className="text-muted">|</span>
            <span>Vol. V</span>
          </div>
        </div>
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
          ref={listRef as never}
          key={tab + q + page}
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
                {/* Folio numeral in a mini column rule (magazine-index style) */}
                <span className="col-span-1 flex items-baseline gap-2 md:col-span-1">
                  <span className="hidden h-3.5 w-px bg-rule md:block" />
                  <span className="font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                    {String(start + i + 1).padStart(2, "0")}
                  </span>
                  <span className="hidden h-3.5 w-px bg-rule md:block" />
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
              No pieces match - try a different tab or a broader search.
            </li>
          )}
        </motion.ul>
      </AnimatePresence>

      {/* Pagination footer - always in view, no growing list */}
      {filtered.length > PER_PAGE && (
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            Showing{" "}
            <span className="text-ink">
              {start + 1}–{Math.min(start + PER_PAGE, filtered.length)}
            </span>{" "}
            of <span className="text-ink">{filtered.length}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => goto(page - 1)}
              disabled={page === 0}
              aria-label="Previous page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rule text-ink-2 transition-all hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-rule disabled:hover:text-ink-2"
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>

            {/* Compact page numerals */}
            <div className="mx-2 flex items-center gap-1.5">
              {getPageWindow(page, totalPages).map((p, i) =>
                p === -1 ? (
                  <span
                    key={`gap-${i}`}
                    className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted"
                  >
                    ·
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goto(p)}
                    aria-label={`Page ${p + 1}`}
                    aria-current={p === page ? "page" : undefined}
                    className={`flex h-9 min-w-9 items-center justify-center rounded-full border px-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-all ${
                      p === page
                        ? "border-ink bg-ink text-paper"
                        : "border-rule text-ink-2 hover:border-ink hover:text-ink"
                    }`}
                  >
                    {String(p + 1).padStart(2, "0")}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => goto(page + 1)}
              disabled={page >= totalPages - 1}
              aria-label="Next page"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-rule text-ink-2 transition-all hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-rule disabled:hover:text-ink-2"
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/**
 * Returns a compact page-number window: [0, 1, -1, current, -1, last]
 * where -1 marks a gap ellipsis.
 */
function getPageWindow(current: number, total: number): number[] {
  if (total <= 6) {
    return Array.from({ length: total }, (_, i) => i);
  }
  const set = new Set<number>([0, total - 1, current, current - 1, current + 1]);
  const pages = Array.from(set)
    .filter((p) => p >= 0 && p < total)
    .sort((a, b) => a - b);

  const out: number[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) out.push(-1);
    out.push(pages[i]);
  }
  return out;
}
