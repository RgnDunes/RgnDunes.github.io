"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusable = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    const focusFrame = window.requestAnimationFrame(() =>
      focusable()[0]?.focus(),
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;

      const items = focusable();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeMenu, open]);

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
        <button
          ref={triggerRef}
          className="obs-menu-toggle"
          aria-expanded={open}
          aria-controls="observatory-menu"
          aria-label={open ? "Close navigation index" : "Open navigation index"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Index"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            ref={menuRef}
            id="observatory-menu"
            className="obs-mobile-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {nav.map((item, index) => (
              <a key={item.name} href={item.href} onClick={closeMenu}>
                <span>0{index + 1}</span>
                {item.name}
              </a>
            ))}
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
              Résumé ↗
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
