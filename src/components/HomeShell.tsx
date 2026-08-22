"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";
import Cursor from "@/components/Cursor";
import EasterEgg from "@/components/EasterEgg";
import ScrollProvider from "@/three/scroll/ScrollProvider";

const RippleShell = dynamic(() => import("@/components/ripple/RippleShell"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper">
      <div className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-muted">
        Loading Ripple…
      </div>
    </div>
  ),
});

/**
 * Small client boundary that owns the interactive chrome around the
 * server-rendered homepage sections. Keeping this thin means the
 * section content (Hero, About, blog cards, etc.) ships as static HTML
 * that Google can index without executing JS.
 */
export default function HomeShell({ children }: { children: React.ReactNode }) {
  const [gameMode, setGameMode] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);

  const enterGameMode = useCallback(() => setGameMode(true), []);
  const exitGameMode = useCallback(() => setGameMode(false), []);
  const openCmd = useCallback(() => setCmdOpen(true), []);
  const closeCmd = useCallback(() => setCmdOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ScrollProvider>
      <ScrollProgress />
      <Cursor />
      {!gameMode && (
        <>
          <Navbar onGameModeToggle={enterGameMode} onCommandOpen={openCmd} />
          {children}
          <CommandPalette
            open={cmdOpen}
            onClose={closeCmd}
            onGameModeToggle={enterGameMode}
          />
          <EasterEgg />
        </>
      )}
      {gameMode && <RippleShell onExit={exitGameMode} />}
    </ScrollProvider>
  );
}
