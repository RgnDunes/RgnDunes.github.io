"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaSearch,
} from "react-icons/fa";
import TagSelector from "./TagSelector";
import TransitionLink from "@/components/transitions/TransitionLink";
import type { BlogPost } from "@/data/blogPosts";

const PER_PAGE = 10;

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts],
  );
  const filtered = useMemo(() => {
    const search = query.toLowerCase();
    return posts.filter(
      (post) =>
        (!tag || post.tags.includes(tag)) &&
        (!search ||
          post.title.toLowerCase().includes(search) ||
          post.description.toLowerCase().includes(search) ||
          post.tags.some((item) => item.toLowerCase().includes(search))),
    );
  }, [posts, query, tag]);

  useEffect(() => setPage(0), [query, tag]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const start = page * PER_PAGE;
  const shown = filtered.slice(start, start + PER_PAGE);
  const goToPage = (next: number) => {
    setPage(Math.max(0, Math.min(next, totalPages - 1)));
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="obs-library-directory" aria-label="Article directory">
      <div className="obs-library-controls">
        <label className="obs-search">
          <FaSearch aria-hidden />
          <span className="sr-only">Search articles</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search articles, topics, or tags"
          />
        </label>
        <TagSelector allTags={allTags} selectedTag={tag} onSelectTag={setTag} />
        {(tag || query) && (
          <p className="obs-results">{filtered.length} matching articles</p>
        )}
      </div>

      <ul ref={listRef} className="obs-article-grid">
        {shown.map((post, index) => (
          <motion.li
            key={post.slug}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.025, duration: 0.4 }}
          >
            <TransitionLink
              href={`/blog/${post.slug}`}
              className="obs-signal-card"
            >
              <span className="obs-signal-number">
                {String(start + index + 1).padStart(2, "0")}
              </span>
              <div className="obs-signal-meta">
                <span>{post.tags[0]}</span>
                <span>
                  <FaClock aria-hidden /> {post.readingTime}
                </span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <span className="obs-signal-action">
                Read article <FaArrowRight aria-hidden />
              </span>
            </TransitionLink>
          </motion.li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className="obs-empty-state">
          <h2>No articles found.</h2>
          <p>Try a different topic or broader search.</p>
          <button
            onClick={() => {
              setTag(null);
              setQuery("");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {filtered.length > PER_PAGE && (
        <nav className="obs-pagination" aria-label="Article pages">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            aria-label="Previous page"
          >
            <FaChevronLeft aria-hidden />
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages - 1}
            aria-label="Next page"
          >
            <FaChevronRight aria-hidden />
          </button>
        </nav>
      )}
    </section>
  );
}
