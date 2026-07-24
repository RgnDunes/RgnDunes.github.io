"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface Props {
  allTags: string[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}

export default function TagSelector({ allTags, selectedTag, onSelectTag }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return allTags;
    return allTags.filter((t) => t.toLowerCase().includes(q.toLowerCase()));
  }, [allTags, q]);

  const topTags = allTags.slice(0, 12);
  const hasMore = allTags.length > 12;

  const Pill = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-all ${
        active
          ? "border-ink bg-ink text-paper"
          : "border-rule bg-paper text-ink-2 hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Pill active={selectedTag === null} onClick={() => onSelectTag(null)}>
          All
        </Pill>
        {topTags.map((tag) => (
          <Pill
            key={tag}
            active={selectedTag === tag}
            onClick={() => onSelectTag(selectedTag === tag ? null : tag)}
          >
            {tag}
          </Pill>
        ))}
        {hasMore && (
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-full border border-dashed border-rule bg-paper px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-ink-2 transition-all hover:border-saffron hover:text-saffron"
          >
            <FaSearch className="h-3 w-3" />
            Browse all {allTags.length}
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
            <motion.div
              role="dialog"
              aria-label="All tags"
              initial={{ y: -12, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -8, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-rule bg-paper p-8 shadow-2xl"
            >
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="eyebrow">Tag Index</span>
                  <h3 className="font-display text-2xl text-ink">Browse all tags</h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-rule text-ink-2 transition-all hover:border-ink hover:text-ink"
                  aria-label="Close"
                >
                  <FaTimes className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="relative mt-6">
                <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search tags…"
                  className="w-full rounded-full border border-rule bg-paper-2 py-3 pl-11 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-ink"
                />
              </div>

              <div className="mt-6 max-h-96 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="py-12 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted">
                    No tags match “{q}”
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {filtered.map((tag) => (
                      <Pill
                        key={tag}
                        active={selectedTag === tag}
                        onClick={() => {
                          onSelectTag(tag);
                          setOpen(false);
                          setQ("");
                        }}
                      >
                        {tag}
                      </Pill>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
