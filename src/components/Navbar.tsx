"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaGamepad } from "react-icons/fa";

const nav = [
  { name: "Work", href: "#work" },
  { name: "Notebook", href: "#notebook" },
  { name: "Skills", href: "#skills" },
  { name: "Writing", href: "/blog" },
  { name: "Contact", href: "#contact" },
];

interface NavbarProps {
  onGameModeToggle?: () => void;
  onCommandOpen?: () => void;
}

export default function Navbar({ onGameModeToggle, onCommandOpen }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          scrolled
            ? "border-rule bg-paper/85 backdrop-blur-md"
            : "border-transparent bg-paper/60 backdrop-blur-sm"
        }`}
      >
        <div className="page-shell flex h-16 items-center justify-between">
          {/* Logo - wordmark */}
          <Link
            href="/"
            className="group flex items-baseline gap-2"
            aria-label="Home"
          >
            <span className="font-display text-2xl italic leading-none text-ink transition-colors group-hover:text-saffron">
              Divyansh
            </span>
            <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
              /ds
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group relative px-3 py-2 font-mono text-[12px] uppercase tracking-[0.18em] text-ink transition-colors hover:text-saffron"
              >
                {item.name}
                <span className="absolute inset-x-3 -bottom-0.5 h-px scale-x-0 bg-saffron transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {onCommandOpen && (
              <button
                onClick={onCommandOpen}
                className="hidden items-center gap-2 rounded-full border border-rule bg-paper/60 px-3 py-1.5 text-[11px] font-mono text-ink transition-all hover:border-ink md:inline-flex"
                aria-label="Open command menu"
              >
                <span className="text-muted">Menu</span>
                <span className="kbd">⌘K</span>
              </button>
            )}

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-ink transition-all hover:bg-ink hover:text-paper md:inline-block"
            >
              Résumé
            </a>

            {onGameModeToggle && (
              <button
                onClick={onGameModeToggle}
                className="hidden items-center gap-2 rounded-full bg-ink px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-paper transition-transform hover:-translate-y-0.5 md:inline-flex"
                aria-label="Open Ripple, the debugging game"
              >
                <FaGamepad className="h-3 w-3" />
                Play
                <sup className="text-[8px] opacity-70">β</sup>
              </button>
            )}

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="rounded-full border border-rule p-2 text-ink transition-colors hover:border-ink md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <FaTimes className="h-4 w-4" />
              ) : (
                <FaBars className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
              className="overflow-hidden border-t border-rule md:hidden"
            >
              <div className="page-shell divide-y divide-rule py-4">
                {nav.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-3 font-display text-2xl text-ink transition-colors hover:text-saffron"
                  >
                    {item.name}
                    <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted">
                      →
                    </span>
                  </Link>
                ))}
                <div className="flex gap-3 pt-4">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-full border border-ink py-2 text-center font-mono text-[11px] uppercase tracking-[0.18em]"
                  >
                    Résumé
                  </a>
                  {onGameModeToggle && (
                    <button
                      onClick={() => {
                        onGameModeToggle();
                        setMobileOpen(false);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-paper"
                    >
                      <FaGamepad className="h-3 w-3" />
                      Play <sup className="text-[8px] opacity-70">β</sup>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
