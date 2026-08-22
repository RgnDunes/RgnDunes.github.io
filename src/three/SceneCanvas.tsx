"use client";

import { useCallback, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import SceneManager from "./scene/SceneManager";

export default function SceneCanvas() {
  const profile = useDeviceProfile();
  const [ready, setReady] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const particleCount = useMemo(() => {
    if (profile.reducedMotion) return 1200;
    if (profile.smallScreen || profile.coarsePointer) return 1900;
    return 4800;
  }, [
    profile.coarsePointer,
    profile.reducedMotion,
    profile.smallScreen,
  ]);

  if (!profile.webglAvailable) return null;

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0"
      >
        <Canvas
          camera={{ far: 40, fov: 45, near: 0.1, position: [0, 0.25, 7.6] }}
          dpr={[1, 1.5]}
          frameloop={profile.reducedMotion ? "demand" : "always"}
          gl={{
            alpha: true,
            antialias: false,
            depth: true,
            powerPreference: "high-performance",
            stencil: false,
          }}
          style={{ pointerEvents: "none" }}
        >
          <SceneManager count={particleCount} onReady={handleReady} />
        </Canvas>
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      >
        <span className="rounded-full border border-rule bg-paper/90 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted backdrop-blur-sm">
          Folio 01 · binding…
        </span>
      </div>
    </>
  );
}
