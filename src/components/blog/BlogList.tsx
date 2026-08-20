"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaArrowRight,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import TagSelector from "./TagSelector";
import type { BlogPost } from "@/data/blogPosts";

interface Props {
  posts: BlogPost[];
}

const PER_PAGE = 10;

export default function BlogList({ posts }: Props) {
  const [tag, setTag] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    posts.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return posts.filter((p) => {
      const matchesTag = !tag || p.tags.includes(tag);
      const matchesQ =
        !s ||
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.tags.some((t) => t.toLowerCase().includes(s));
      return matchesTag && matchesQ;
    });
  }, [posts, tag, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

  useEffect(() => {
    setPage(0);
  }, [tag, q]);

  const start = page * PER_PAGE;
  const shown = filtered.slice(start, start + PER_PAGE);

  const goto = (next: number) => {
    setPage(Math.max(0, Math.min(next, totalPages - 1)));
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="mt-12 space-y-6">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search titles, topics, tags…"
            className="w-full rounded-full border border-rule bg-paper py-3 pl-11 pr-4 text-sm text-ink outline-none placeholder:text-muted focus:border-ink"
          />
        </div>

        <TagSelector allTags={allTags} selectedTag={tag} onSelectTag={setTag} />

        {(tag || q) && (
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            {filtered.length} match{filtered.length !== 1 && "es"}
            {tag && <> · tagged <span className="text-saffron">{tag}</span></>}
            {q && <> · matching “<span className="text-ink">{q}</span>”</>}
          </p>
        )}
      </div>

      <ul ref={listRef} className="mt-12 divide-y divide-rule border-y border-rule">
        {shown.map((post, i) => (
          <motion.li
            key={post.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.02 }}
          >
            <Link
              href={`/blog/${post.slug}`}
              className="group grid grid-cols-[auto_1fr_auto] items-start gap-4 py-6 md:grid-cols-[80px_1fr_auto] md:items-baseline md:gap-8"
            >
              <span className="col-span-1 font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                {String(start + i + 1).padStart(2, "0")}
              </span>
              <div className="col-span-2 md:col-span-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                  <span className="text-saffron">{post.tags[0]}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <FaClock className="h-2.5 w-2.5" /> {post.readingTime}
                  </span>
                  <span>·</span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="font-display text-xl leading-[1.2] text-ink transition-colors group-hover:text-saffron md:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-2 clamp-2 max-w-3xl text-[14.5px] leading-[1.6] text-ink-2">
                  {post.description}
                </p>
              </div>
              <span className="col-span-1 flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-ink transition-all group-hover:text-saffron group-hover:gap-3">
                Read <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>

      {/* Pagination */}
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

      {filtered.length === 0 && (
        <div className="mt-16 rounded-2xl border border-rule bg-paper-2 p-12 text-center">
          <FaSearch className="mx-auto mb-4 h-6 w-6 text-muted" />
          <h3 className="font-display text-2xl text-ink">Nothing here yet.</h3>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            Try a different tag or a broader search
          </p>
          <button
            onClick={() => {
              setTag(null);
              setQ("");
            }}
            className="btn-primary mt-6"
          >
            Clear filters
          </button>
        </div>
      )}

      {/*
        Static crawl-discovery footer — every post link + title exposed in
        the initial HTML so search engines and social crawlers (which may
        not paginate through client state) can discover every URL. Also
        surfaces internal-linking authority to older posts.
      */}
      <nav
        aria-label="All essays"
        className="mt-20 border-t border-rule pt-10"
      >
        <h2 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          Full archive
        </h2>
        <ul className="grid gap-x-8 gap-y-2 md:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug} className="text-sm">
              <Link
                href={`/blog/${p.slug}`}
                className="link-quiet text-ink-2 hover:text-ink"
              >
                {p.title}
              </Link>
              <span className="ml-2 font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                <time dateTime={p.publishedAt}>
                  {new Date(p.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

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
