"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import CommandPalette from "@/components/CommandPalette";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Skills from "@/components/sections/Skills";
import GameModeWrapper from "@/components/game3d/GameModeWrapper";

// Below-the-fold sections are code-split
const Projects = dynamic(() => import("@/components/sections/Projects"), {
  loading: () => <div className="min-h-[70vh]" />,
});
const DigitalProducts = dynamic(
  () => import("@/components/sections/DigitalProducts"),
  { loading: () => <div className="min-h-[70vh]" /> }
);
const Articles = dynamic(() => import("@/components/sections/Articles"), {
  loading: () => <div className="min-h-[70vh]" />,
});
const LatestBlog = dynamic(() => import("@/components/sections/LatestBlog"), {
  loading: () => <div className="min-h-[70vh]" />,
});
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"), {
  loading: () => <div className="min-h-[70vh]" />,
});
const Contact = dynamic(() => import("@/components/sections/Contact"), {
  loading: () => <div className="min-h-[70vh]" />,
});

export default function Home() {
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
    <>
      <ScrollProgress />
      {!gameMode && (
        <>
          <Navbar onGameModeToggle={enterGameMode} onCommandOpen={openCmd} />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <Hero />
            <About />
            <Experience />
            <Skills />
            <Projects />
            <DigitalProducts />
            <Articles />
            <LatestBlog />
            <Testimonials />
            <Contact />
          </motion.main>

          <CommandPalette
            open={cmdOpen}
            onClose={closeCmd}
            onGameModeToggle={enterGameMode}
          />
        </>
      )}
      <GameModeWrapper isActive={gameMode} onExit={exitGameMode} />
    </>
  );
}
