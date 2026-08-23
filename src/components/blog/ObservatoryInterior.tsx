"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { SCENE_BEATS, updateSceneScrollState } from "@/three/scroll/store";

const SceneCanvas = dynamic(() => import("@/three/SceneCanvas"), {
  ssr: false,
});

export default function ObservatoryInterior({
  beat = "articles",
  children,
}: {
  beat?: "articles" | "books" | "testimonials";
  children: React.ReactNode;
}) {
  useEffect(() => {
    const index = SCENE_BEATS.indexOf(beat);
    updateSceneScrollState({
      activeIndex: index,
      position: index,
      velocity: 0,
    });
  }, [beat]);

  return (
    <div className="observatory obs-interior">
      <SceneCanvas />
      <div className="obs-vignette" aria-hidden />
      <div className="obs-interior-content">{children}</div>
    </div>
  );
}
