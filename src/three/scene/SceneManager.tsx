"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import ParticleField from "./ParticleField";
import InfrastructureWorld from "./InfrastructureWorld";

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
    scene.fog = new THREE.Fog("#05070A", 7, 26);
    gl.setClearColor(0x05070a, 1);
    return () => {
      scene.fog = null;
    };
  }, [gl, scene]);

  useFrame(() => {
    if (notified.current) return;
    notified.current = true;
    onReady();
  });

  return (
    <>
      <ParticleField count={count} />
      <InfrastructureWorld />
    </>
  );
}
