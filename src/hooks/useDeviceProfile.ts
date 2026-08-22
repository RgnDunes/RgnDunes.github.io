"use client";

import { useEffect, useState } from "react";

export interface DeviceProfile {
  coarsePointer: boolean;
  reducedMotion: boolean;
  smallScreen: boolean;
  webglAvailable: boolean;
}

const INITIAL_PROFILE: DeviceProfile = {
  coarsePointer: false,
  reducedMotion: false,
  smallScreen: false,
  webglAvailable: false,
};

let cachedWebGLSupport: boolean | undefined;

function supportsWebGL() {
  if (cachedWebGLSupport !== undefined) return cachedWebGLSupport;

  try {
    const canvas = document.createElement("canvas");
    if (!window.WebGLRenderingContext) {
      cachedWebGLSupport = false;
      return cachedWebGLSupport;
    }

    const context = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!context) {
      cachedWebGLSupport = false;
      return cachedWebGLSupport;
    }

    context.getExtension("WEBGL_lose_context")?.loseContext();
    cachedWebGLSupport = true;
    return cachedWebGLSupport;
  } catch {
    cachedWebGLSupport = false;
    return cachedWebGLSupport;
  }
}

export function useDeviceProfile() {
  const [profile, setProfile] = useState<DeviceProfile>(INITIAL_PROFILE);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    const smallScreen = window.matchMedia("(max-width: 767px)");
    const webglAvailable = supportsWebGL();

    const update = () => {
      setProfile({
        coarsePointer: coarsePointer.matches,
        reducedMotion: reducedMotion.matches,
        smallScreen: smallScreen.matches,
        webglAvailable,
      });
    };

    update();
    reducedMotion.addEventListener("change", update);
    coarsePointer.addEventListener("change", update);
    smallScreen.addEventListener("change", update);

    return () => {
      reducedMotion.removeEventListener("change", update);
      coarsePointer.removeEventListener("change", update);
      smallScreen.removeEventListener("change", update);
    };
  }, []);

  return profile;
}
