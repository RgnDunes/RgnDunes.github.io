"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import CinematicBackdrop from "@/components/CinematicBackdrop";
import ScrollProvider from "@/three/scroll/ScrollProvider";

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
  return (
    <ScrollProvider>
      <SceneCanvas />
      <CinematicBackdrop />
      <ScrollProgress />
      <Navbar />
      {children}
    </ScrollProvider>
  );
}
