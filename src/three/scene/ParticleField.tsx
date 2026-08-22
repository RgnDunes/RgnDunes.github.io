"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getSceneScrollState } from "../scroll/store";
import { buildFormations } from "./formations";

const vertexShader = /* glsl */ `
  precision mediump float;

  attribute vec3 positionA;
  attribute vec3 positionB;
  attribute float seed;

  uniform float uDrift;
  uniform float uMix;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uTime;

  varying float vDepth;
  varying float vSeed;

  float ease(float value) {
    return value * value * (3.0 - 2.0 * value);
  }

  void main() {
    float transition = ease(clamp(uMix, 0.0, 1.0));
    vec3 point = mix(positionA, positionB, transition);
    point += vec3(
      sin(uTime * 0.23 + seed * 31.0),
      cos(uTime * 0.19 + seed * 23.0),
      sin(uTime * 0.17 + seed * 17.0)
    ) * 0.055 * uDrift;

    vec4 viewPosition = modelViewMatrix * vec4(point, 1.0);
    float distanceToCamera = max(0.5, -viewPosition.z);
    gl_PointSize = clamp(
      uSize * uPixelRatio * (24.0 / distanceToCamera),
      1.0,
      8.0
    );
    gl_Position = projectionMatrix * viewPosition;
    vDepth = 1.0 - smoothstep(7.0, 24.0, distanceToCamera);
    vSeed = seed;
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uMix;
  uniform float uOpacity;

  varying float vDepth;
  varying float vSeed;

  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    if (distanceToCenter > 0.5) discard;
    float edge = smoothstep(0.5, 0.06, distanceToCenter);
    vec3 color = mix(uColorA, uColorB, clamp(uMix, 0.0, 1.0));
    color *= 0.82 + vSeed * 0.28;
    gl_FragColor = vec4(color, edge * vDepth * uOpacity);
  }
`;

export default function ParticleField({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera, gl } = useThree();
  const formations = useMemo(() => buildFormations(count), [count]);

  const geometry = useMemo(() => {
    const nextGeometry = new THREE.BufferGeometry();
    const first = formations[0].positions;
    nextGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(first.slice(), 3)
    );
    nextGeometry.setAttribute(
      "positionA",
      new THREE.BufferAttribute(first.slice(), 3)
    );
    nextGeometry.setAttribute(
      "positionB",
      new THREE.BufferAttribute(formations[1].positions.slice(), 3)
    );

    const seeds = new Float32Array(count);
    for (let index = 0; index < count; index += 1) {
      seeds[index] = index / count;
    }
    nextGeometry.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));
    return nextGeometry;
  }, [count, formations]);

  const uniforms = useMemo(
    () => ({
      uColorA: { value: formations[0].color.clone() },
      uColorB: { value: formations[1].color.clone() },
      uDrift: { value: formations[0].drift },
      uMix: { value: 0 },
      uOpacity: { value: 0 },
      uPixelRatio: { value: Math.min(1.5, gl.getPixelRatio()) },
      uSize: { value: formations[0].size },
      uTime: { value: 0 },
    }),
    [formations, gl]
  );

  const currentPair = useRef<[number, number]>([0, 1]);
  const cameraPosition = useRef(formations[0].camera.clone());
  const cameraTarget = useRef(formations[0].target.clone());
  const nextCameraPosition = useRef(new THREE.Vector3());
  const nextCameraTarget = useRef(new THREE.Vector3());
  const visibleOpacity = useRef(0);

  useEffect(() => {
    camera.position.copy(formations[0].camera);
    camera.lookAt(formations[0].target);
    return () => geometry.dispose();
  }, [camera, formations, geometry]);

  useFrame((_, delta) => {
    const frameDelta = Math.min(delta, 0.05);
    const scroll = getSceneScrollState();
    const lastIndex = formations.length - 1;
    const position = scroll.reducedMotion
      ? 0
      : THREE.MathUtils.clamp(scroll.position, 0, lastIndex - 0.0001);
    const startIndex = Math.floor(position);
    const endIndex = Math.min(lastIndex, startIndex + 1);
    const mix = position - startIndex;

    if (
      currentPair.current[0] !== startIndex ||
      currentPair.current[1] !== endIndex
    ) {
      const positionA = geometry.getAttribute(
        "positionA"
      ) as THREE.BufferAttribute;
      const positionB = geometry.getAttribute(
        "positionB"
      ) as THREE.BufferAttribute;
      positionA.copyArray(formations[startIndex].positions);
      positionB.copyArray(formations[endIndex].positions);
      positionA.needsUpdate = true;
      positionB.needsUpdate = true;
      currentPair.current = [startIndex, endIndex];
    }

    const start = formations[startIndex];
    const end = formations[endIndex];
    uniforms.uMix.value = mix;
    uniforms.uDrift.value = THREE.MathUtils.lerp(start.drift, end.drift, mix);
    uniforms.uSize.value = THREE.MathUtils.lerp(start.size, end.size, mix);
    uniforms.uColorA.value.copy(start.color);
    uniforms.uColorB.value.copy(end.color);
    if (!scroll.reducedMotion) uniforms.uTime.value += frameDelta;

    const targetOpacity = THREE.MathUtils.lerp(
      start.opacity,
      end.opacity,
      mix
    );
    visibleOpacity.current = THREE.MathUtils.damp(
      visibleOpacity.current,
      targetOpacity,
      3,
      frameDelta
    );
    uniforms.uOpacity.value = visibleOpacity.current;

    nextCameraPosition.current.copy(start.camera).lerp(end.camera, mix);
    nextCameraTarget.current.copy(start.target).lerp(end.target, mix);
    cameraPosition.current.lerp(
      nextCameraPosition.current,
      1 - Math.exp(-frameDelta * 3.2)
    );
    cameraTarget.current.lerp(
      nextCameraTarget.current,
      1 - Math.exp(-frameDelta * 3.2)
    );

    const parallaxX = scroll.reducedMotion ? 0 : scroll.pointerX * 0.24;
    const parallaxY = scroll.reducedMotion ? 0 : -scroll.pointerY * 0.16;
    camera.position.set(
      cameraPosition.current.x + parallaxX,
      cameraPosition.current.y + parallaxY,
      cameraPosition.current.z
    );
    camera.lookAt(cameraTarget.current);

    if (pointsRef.current && !scroll.reducedMotion) {
      pointsRef.current.rotation.y += frameDelta * 0.018;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        blending={THREE.NormalBlending}
        depthWrite={false}
        fragmentShader={fragmentShader}
        transparent
        uniforms={uniforms}
        vertexShader={vertexShader}
      />
    </points>
  );
}
