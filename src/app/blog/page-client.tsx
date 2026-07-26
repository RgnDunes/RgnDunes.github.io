"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import BlogList from "@/components/blog/BlogList";
import ScrollProgress from "@/components/ScrollProgress";
import { BlogPost } from "@/data/blogPosts";

interface Props {
  posts: BlogPost[];
}

export default function BlogPageClient({ posts }: Props) {
  const totalMinutes = posts.reduce((sum, p) => {
    if (!p.readingTime) return sum;
    const m = p.readingTime.match(/\d+/);
    return sum + (m ? parseInt(m[0], 10) : 0);
  }, 0);
  const totalReading =
    totalMinutes < 60
      ? `${totalMinutes} min`
      : `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

  return (
    <>
      <ScrollProgress />

      <div className="page-shell py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="link-quiet font-mono text-[11.5px] uppercase tracking-[0.2em]">
            <FaArrowLeft className="h-3 w-3" /> Back to the cover
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-10 grid gap-8 border-b border-rule pb-10 md:grid-cols-[auto_1fr] md:items-end md:gap-12"
        >
          <div className="flex items-baseline gap-4">
            <span className="folio text-7xl md:text-8xl">§</span>
            <div>
              <span className="eyebrow">Section</span>
              <h1 className="font-display text-display-2 text-ink">
                Engineering<br />
                <span className="italic text-saffron">Diaries</span>
              </h1>
            </div>
          </div>
          <p className="max-w-lg text-[16.5px] leading-[1.65] text-ink-2 md:justify-self-end md:text-right">
            Long-form on frontend architecture, system design, and the small,
            unglamorous rituals of shipping software at scale. Written from the
            trenches of building international payment systems, developer
            tooling, and CI pipelines.
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 grid grid-cols-3 gap-6 rounded-2xl border border-rule bg-paper-2 p-6 md:grid-cols-3"
        >
          <StatCell label="Articles" value={String(posts.length)} />
          <StatCell
            label="Topics"
            value={String(new Set(posts.flatMap((p) => p.tags)).size)}
          />
          <StatCell label="Total reading" value={totalReading} />
        </motion.div>

        <BlogList posts={posts} />
      </div>
    </>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="eyebrow mb-2">{label}</div>
      <div className="font-display text-3xl text-ink md:text-4xl">{value}</div>
    </div>
  );
}
