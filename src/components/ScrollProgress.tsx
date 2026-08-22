"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

const CHAPTERS = [
  { id: "top", label: "Identity", folio: "i" },
  { id: "about", label: "Principle", folio: "ii" },
  { id: "work", label: "Trajectory", folio: "iii" },
  { id: "skills", label: "Systems", folio: "iv" },
  { id: "notebook", label: "Deployments", folio: "v" },
  { id: "archive", label: "Archive", folio: "vi" },
  { id: "contact", label: "Contact", folio: "vii" },
];

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-36% 0px -36%", threshold: [0.01, 0.2, 0.5] },
    );
    CHAPTERS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <aside className="obs-progress" aria-label="Chapter navigation">
      <div className="obs-progress-track">
        <motion.span style={{ scaleY }} />
      </div>
      {CHAPTERS.map((chapter) => (
        <a
          key={chapter.id}
          href={`#${chapter.id}`}
          className={active === chapter.id ? "is-active" : ""}
        >
          <span>{chapter.folio}</span>
          <small>{chapter.label}</small>
        </a>
      ))}
    </aside>
  );
}
