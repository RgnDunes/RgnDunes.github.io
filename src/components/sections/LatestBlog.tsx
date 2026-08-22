"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { FaArrowRight, FaClock } from "react-icons/fa";
import { blogPosts } from "@/data/blogPosts";

export default function LatestBlog() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const latest = [...blogPosts]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  return (
    <div ref={ref} className="page-shell py-28 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="grid gap-6 border-b border-rule pb-8 md:grid-cols-[auto_1fr_auto] md:items-end md:gap-10"
      >
        <div className="flex items-baseline gap-4">
          <span className="folio text-6xl md:text-7xl">vi.</span>
          <div>
            <h2 className="font-display text-display-3 text-ink">
              Writing<span className="text-saffron">.</span>
            </h2>
          </div>
        </div>
        <p className="max-w-md font-mono text-[11.5px] uppercase tracking-[0.18em] text-muted md:justify-self-center md:text-center">
          The three latest essays
        </p>
        <Link
          href="/blog"
          className="link-quiet font-mono text-[11.5px] uppercase tracking-[0.2em] md:justify-self-end"
        >
          View all essays <FaArrowRight className="h-3 w-3" />
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
            <Link href={`/blog/${post.slug}`} className="group relative flex h-full flex-col">
              {/* Postmark stamp in the top-right */}
              <Postmark
                month={new Date(post.publishedAt)
                  .toLocaleDateString("en-US", { month: "short" })
                  .toUpperCase()}
                year={new Date(post.publishedAt).getFullYear()}
                uid={post.slug}
              />

              <div className="flex items-center justify-between border-b border-rule bg-paper-2 px-5 py-3 font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted">
                <span className="text-saffron">{post.tags[0]}</span>
                <span className="flex items-center gap-1.5">
                  <FaClock className="h-2.5 w-2.5" /> {post.readingTime}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <time
                  dateTime={post.publishedAt}
                  className="mb-3 block font-mono text-[10.5px] uppercase tracking-[0.15em] text-muted"
                >
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
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
    </div>
  );
}

/**
 * A circular postmark stamp — angled slightly, saffron ink, faux
 * "DISPATCHED · MONTH · YEAR · BLR" text arced around the ring.
 */
function Postmark({
  month,
  year,
  uid,
}: {
  month: string;
  year: number;
  uid: string;
}) {
  const id = `pm-${month}-${year}-${uid}`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 80 80"
      className="pointer-events-none absolute right-3 top-3 z-10 h-16 w-16 opacity-70 mix-blend-multiply"
      style={{ transform: "rotate(-8deg)" }}
    >
      <defs>
        <path id={id} d="M 40 40 m -28 0 a 28 28 0 1 1 56 0 a 28 28 0 1 1 -56 0" fill="none" />
      </defs>
      <circle
        cx="40" cy="40" r="30"
        fill="none"
        stroke="#C24E16"
        strokeWidth="1.2"
      />
      <circle
        cx="40" cy="40" r="22"
        fill="none"
        stroke="#C24E16"
        strokeWidth="0.6"
        strokeDasharray="2 2"
      />
      {/* Text on the arc */}
      <text
        fill="#C24E16"
        fontFamily="JetBrains Mono, monospace"
        fontSize="6"
        letterSpacing="1.8"
        fontWeight="500"
      >
        <textPath href={`#${id}`} startOffset="4%">
          DISPATCHED · {month} {year} · BLR ·
        </textPath>
      </text>
      {/* Centre monogram */}
      <text
        x="40" y="44"
        textAnchor="middle"
        fill="#C24E16"
        fontFamily="Fraunces, Georgia, serif"
        fontStyle="italic"
        fontWeight="500"
        fontSize="14"
      >
        ds
      </text>
    </svg>
  );
}
