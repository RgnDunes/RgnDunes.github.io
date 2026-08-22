"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FaGamepad } from "react-icons/fa";
import { withBasePath } from "@/lib/site";

const RESUME_URL = withBasePath("/Divyansh_Singh_Resume.pdf");
const nav = [
  { name: "Work", href: "#work" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#notebook" },
  { name: "Articles", href: "#articles" },
  { name: "Books", href: "#books" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Beyond work", href: "#personal" },
  { name: "Contact", href: "#contact" },
];

interface NavbarProps {
  onGameModeToggle?: () => void;
}

export default function Navbar({ onGameModeToggle }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="obs-nav">
      <Link
        href="#top"
        className="obs-wordmark"
        aria-label="Back to the beginning"
      >
        <span>DS</span>
        <small>Systems Observatory</small>
      </Link>
      <nav className="obs-nav-links" aria-label="Primary navigation">
        {nav.map((item) => (
          <a key={item.name} href={item.href}>
            {item.name}
          </a>
        ))}
      </nav>
      <div className="obs-nav-actions">
        <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
          Résumé ↗
        </a>
        {onGameModeToggle && (
          <button
            onClick={onGameModeToggle}
            aria-label="Open Ripple debugging game"
          >
            <FaGamepad aria-hidden /> Play
          </button>
        )}
        <button
          className="obs-menu-toggle"
          aria-expanded={open}
          aria-controls="observatory-menu"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Index"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="observatory-menu"
            className="obs-mobile-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {nav.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                <span>0{index + 1}</span>
                {item.name}
              </a>
            ))}
            {onGameModeToggle && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onGameModeToggle();
                }}
              >
                <span>↗</span>
                Play · Debug the fire
              </button>
            )}
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
              Résumé ↗
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
