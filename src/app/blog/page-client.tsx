"use client";

import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import BlogList from "@/components/blog/BlogList";
import ObservatoryInterior from "@/components/blog/ObservatoryInterior";
import TransitionLink from "@/components/transitions/TransitionLink";
import type { BlogPost } from "@/data/blogPosts";

export default function BlogPageClient({ posts }: { posts: BlogPost[] }) {
  const totalMinutes = posts.reduce((sum, post) => {
    const minutes = post.readingTime?.match(/\d+/);
    return sum + (minutes ? Number(minutes[0]) : 0);
  }, 0);
  const totalReading = `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;

  return (
    <ObservatoryInterior>
      <main className="obs-library">
        <motion.header
          className="obs-library-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <TransitionLink href="/" className="obs-library-back">
            <FaArrowLeft aria-hidden /> Return home
          </TransitionLink>
          <div className="obs-library-heading">
            <div>
              <p className="obs-kicker">Folio vi · Articles</p>
              <h1>Published articles.</h1>
            </div>
            <p>
              Articles about frontend infrastructure, CI/CD, system design, and
              the practical work behind reliable software.
            </p>
          </div>
          <dl className="obs-library-stats">
            <div>
              <dt>Articles</dt>
              <dd>{posts.length}</dd>
            </div>
            <div>
              <dt>Topics</dt>
              <dd>{new Set(posts.flatMap((post) => post.tags)).size}</dd>
            </div>
            <div>
              <dt>Reading time</dt>
              <dd>{totalReading}</dd>
            </div>
          </dl>
        </motion.header>
        <BlogList posts={posts} />
      </main>
    </ObservatoryInterior>
  );
}
