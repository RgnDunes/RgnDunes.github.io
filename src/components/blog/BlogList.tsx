"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaSearch, FaArrowRight, FaClock } from "react-icons/fa";
import TagSelector from "./TagSelector";
import type { BlogPost } from "@/data/blogPosts";

interface Props {
  posts: BlogPost[];
}

export default function BlogList({ posts }: Props) {
  const [tag, setTag] = useState<string | null>(null);
  const [q, setQ] = useState("");

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

      <ul className="mt-12 divide-y divide-rule border-y border-rule">
        {filtered.map((post, i) => (
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
                {String(i + 1).padStart(2, "0")}
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
    </>
  );
}
