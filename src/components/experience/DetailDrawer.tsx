"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";

interface DetailDrawerProps {
  children: React.ReactNode;
  eyebrow: string;
  onClose: () => void;
  open: boolean;
  title: string;
}

export default function DetailDrawer({
  children,
  eyebrow,
  onClose,
  open,
  title,
}: DetailDrawerProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (
        drawer.current &&
        ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(
          event.key,
        )
      ) {
        event.preventDefault();
        const page = drawer.current.clientHeight * 0.8;
        const top =
          event.key === "Home"
            ? 0
            : event.key === "End"
              ? drawer.current.scrollHeight
              : drawer.current.scrollTop +
                (event.key === "ArrowDown"
                  ? 64
                  : event.key === "ArrowUp"
                    ? -64
                    : event.key === "PageDown"
                      ? page
                      : -page);
        drawer.current.scrollTo({ top, behavior: "auto" });
        return;
      }
      if (event.key !== "Tab" || !drawer.current) return;
      const focusable = Array.from(
        drawer.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [onClose, open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="obs-drawer-layer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Close details"
            className="obs-drawer-scrim"
            onClick={onClose}
          />
          <motion.aside
            ref={drawer}
            aria-labelledby="obs-drawer-title"
            aria-modal="true"
            className="obs-drawer"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 0.8, 0.2, 1] }}
            role="dialog"
          >
            <div className="obs-drawer-head">
              <div>
                <p className="obs-kicker">{eyebrow}</p>
                <h2 id="obs-drawer-title">{title}</h2>
              </div>
              <button ref={closeButton} className="obs-close" onClick={onClose}>
                Close <span aria-hidden>×</span>
              </button>
            </div>
            <div className="obs-drawer-body">{children}</div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
