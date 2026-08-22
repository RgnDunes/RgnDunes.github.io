"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import ParticleField from "./ParticleField";

export default function SceneManager({
  count,
  onReady,
}: {
  count: number;
  onReady: () => void;
}) {
  const { gl, scene } = useThree();
  const notified = useRef(false);

  useEffect(() => {
    scene.background = null;
    scene.fog = new THREE.Fog("#F6F0E7", 9, 27);
    gl.setClearColor(0x000000, 0);
    return () => {
      scene.fog = null;
    };
  }, [gl, scene]);

  useFrame(() => {
    if (notified.current) return;
    notified.current = true;
    onReady();
  });

  return <ParticleField count={count} />;
}
