"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  FaSearch,
  FaHome,
  FaBriefcase,
  FaCode,
  FaBook,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaGamepad,
  FaArrowRight,
} from "react-icons/fa";
import type { IconType } from "react-icons";

interface Cmd {
  id: string;
  label: string;
  group: string;
  icon: IconType;
  hint?: string;
  action: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onGameModeToggle?: () => void;
}

export default function CommandPalette({ open, onClose, onGameModeToggle }: Props) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const goHash = (hash: string) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(hash);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const commands: Cmd[] = useMemo(
    () => [
      { id: "home", label: "Top of page", group: "Navigation", icon: FaHome, action: () => { onClose(); window.scrollTo({ top: 0, behavior: "smooth" }); } },
      { id: "work", label: "Work · Experience", group: "Navigation", icon: FaBriefcase, action: () => goHash("#work") },
      { id: "skills", label: "Skills · Toolkit", group: "Navigation", icon: FaCode, action: () => goHash("#skills") },
      { id: "notebook", label: "Notebook · Projects", group: "Navigation", icon: FaBook, action: () => goHash("#notebook") },
      { id: "writing", label: "Writing · Blog", group: "Navigation", icon: FaBook, hint: "/blog", action: () => { onClose(); router.push("/blog"); } },
      { id: "contact", label: "Contact", group: "Navigation", icon: FaEnvelope, action: () => goHash("#contact") },

      { id: "resume", label: "Download résumé", group: "Actions", icon: FaArrowRight, hint: "PDF", action: () => { onClose(); window.open(`${process.env.NODE_ENV === "production" ? "/Portfolio-v5" : ""}/resume.pdf`, "_blank"); } },
      { id: "email", label: "Copy email address", group: "Actions", icon: FaEnvelope, hint: "rgndunes@gmail.com", action: async () => { try { await navigator.clipboard.writeText("rgndunes@gmail.com"); } catch {} onClose(); } },
      ...(onGameModeToggle
        ? [{ id: "play", label: "Play · Debug the fire", group: "Actions", icon: FaGamepad, hint: "β", action: () => { onClose(); onGameModeToggle(); } } as Cmd]
        : []),

      { id: "gh", label: "GitHub", group: "Elsewhere", icon: FaGithub, hint: "@RgnDunes", action: () => { onClose(); window.open("https://github.com/RgnDunes", "_blank"); } },
      { id: "li", label: "LinkedIn", group: "Elsewhere", icon: FaLinkedin, hint: "/in/rgndunes", action: () => { onClose(); window.open("https://linkedin.com/in/rgndunes", "_blank"); } },
    ],
    [router, onClose, onGameModeToggle]
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(s) || c.group.toLowerCase().includes(s)
    );
  }, [q, commands]);

  // Focus + reset on open
  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [open]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); filtered[active]?.action(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, onClose]);

  useEffect(() => { setActive(0); }, [q]);

  const grouped = useMemo(() => {
    const m = new Map<string, Cmd[]>();
    filtered.forEach((c) => {
      if (!m.has(c.group)) m.set(c.group, []);
      m.get(c.group)!.push(c);
    });
    return Array.from(m.entries());
  }, [filtered]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-24"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" />
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ y: -16, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-rule bg-paper shadow-[0_30px_80px_-20px_rgba(20,20,22,0.35)]"
          >
            <div className="flex items-center gap-3 border-b border-rule px-4 py-3">
              <FaSearch className="h-3.5 w-3.5 text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search sections, actions, links…"
                className="flex-1 bg-transparent font-body text-sm text-ink outline-none placeholder:text-muted"
              />
              <span className="kbd">ESC</span>
            </div>

            <ul className="max-h-[min(60vh,420px)] overflow-y-auto py-2">
              {grouped.length === 0 && (
                <li className="px-4 py-8 text-center font-mono text-xs text-muted">
                  No matches. Try “résumé”, “blog”, “github”.
                </li>
              )}
              {grouped.map(([group, items], gIdx) => (
                <li key={group}>
                  <div className="px-4 pt-3 font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
                    {group}
                  </div>
                  <ul>
                    {items.map((c) => {
                      const idx = filtered.indexOf(c);
                      const isActive = idx === active;
                      const Icon = c.icon;
                      return (
                        <li key={c.id}>
                          <button
                            onMouseEnter={() => setActive(idx)}
                            onClick={c.action}
                            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                              isActive ? "bg-paper-2" : ""
                            }`}
                          >
                            <span
                              className={`flex h-7 w-7 items-center justify-center rounded-md border ${
                                isActive ? "border-saffron text-saffron" : "border-rule text-ink-2"
                              }`}
                            >
                              <Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className={`flex-1 text-sm ${isActive ? "text-ink" : "text-ink-2"}`}>
                              {c.label}
                            </span>
                            {c.hint && (
                              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted">
                                {c.hint}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {gIdx < grouped.length - 1 && <div className="mx-4 mt-2 rule-hair" />}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-rule px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.22em] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="kbd">↑</span>
                <span className="kbd">↓</span>
                <span className="ml-1">Navigate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="kbd">⏎</span> Select
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
