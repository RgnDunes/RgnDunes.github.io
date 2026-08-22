"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
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

const SceneCanvas = dynamic(() => import("@/three/SceneCanvas"), {
  ssr: false,
});

/**
 * Small client boundary that owns the interactive chrome around the
 * server-rendered homepage sections. Keeping this thin means the
 * section content (Hero, About, blog cards, etc.) ships as static HTML
 * that Google can index without executing JS.
 */
export default function HomeShell({ children }: { children: React.ReactNode }) {
  const [gameMode, setGameMode] = useState(false);
  const enterGameMode = useCallback(() => setGameMode(true), []);
  const exitGameMode = useCallback(() => setGameMode(false), []);

  return (
    <ScrollProvider>
      {!gameMode && <SceneCanvas />}
      {!gameMode && <ScrollProgress />}
      {!gameMode && (
        <>
          <Navbar onGameModeToggle={enterGameMode} />
          {children}
        </>
      )}
      {gameMode && <RippleShell onExit={exitGameMode} />}
    </ScrollProvider>
  );
}
