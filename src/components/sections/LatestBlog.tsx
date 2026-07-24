"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { FaArrowRight, FaClock } from "react-icons/fa";
import { blogPosts } from "@/data/blogPosts";

export default function LatestBlog() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const latest = [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  return (
    <section id="writing" ref={ref} className="page-shell py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">vii.</span>
          <div>
            <span className="eyebrow">From the Editor</span>
            <h2 className="font-display text-display-3 text-ink">
              Latest dispatches<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-center md:text-center">
          New essays land here every few weeks
        </p>
        <Link
          href="/blog"
          className="link-quiet font-mono text-[11.5px] uppercase tracking-[0.2em] md:justify-self-end"
        >
          The full notebook <FaArrowRight className="h-3 w-3" />
        </Link>
      </motion.div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {latest.map((post, i) => (
          <motion.article
            key={post.slug}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: i * 0.1 }}
            className="paper-card flex flex-col overflow-hidden"
          >
            <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-rule bg-paper-2 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                <span className="text-saffron">{post.tags[0]}</span>
                <span className="flex items-center gap-1.5">
                  <FaClock className="h-2.5 w-2.5" /> {post.readingTime}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <h3 className="font-display text-xl leading-[1.15] text-ink transition-colors group-hover:text-saffron">
                  {post.title}
                </h3>
                <p className="mt-3 clamp-3 flex-1 text-[14.5px] leading-[1.6] text-ink-2">
                  {post.description}
                </p>
                <div className="mt-6 flex items-center justify-end pt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-all group-hover:text-saffron">
                  Read <FaArrowRight className="ml-1.5 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
