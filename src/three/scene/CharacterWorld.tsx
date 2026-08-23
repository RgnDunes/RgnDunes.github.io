"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getSceneScrollState } from "../scroll/store";

type Point = readonly [number, number];

function Limb({
  color,
  end,
  materialRef,
  start,
  width,
}: {
  color: string;
  end: Point;
  materialRef: (material: THREE.MeshBasicMaterial | null) => void;
  start: Point;
  width: number;
}) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.hypot(dx, dy);
  return (
    <mesh
      position={[(start[0] + end[0]) / 2, (start[1] + end[1]) / 2, -0.035]}
      rotation={[0, 0, Math.atan2(dy, dx)]}
    >
      <planeGeometry args={[length, width]} />
      <meshBasicMaterial
        ref={materialRef}
        color={color}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
}

function lineGeometry(paths: readonly (readonly Point[])[]) {
  const segments: number[] = [];
  paths.forEach((path) => {
    for (let index = 0; index < path.length - 1; index += 1) {
      const from = path[index];
      const to = path[index + 1];
      segments.push(from[0], from[1], 0, to[0], to[1], 0);
    }
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(segments, 3),
  );
  return geometry;
}

function webGeometry() {
  const paths: Point[][] = [];
  const center: Point = [1.2, -0.15];
  for (let spoke = 0; spoke < 12; spoke += 1) {
    const angle = (spoke / 12) * Math.PI * 2;
    paths.push([
      center,
      [center[0] + Math.cos(angle) * 5.3, center[1] + Math.sin(angle) * 4.1],
    ]);
  }
  for (let ring = 1; ring <= 4; ring += 1) {
    const points: Point[] = [];
    for (let step = 0; step <= 24; step += 1) {
      const angle = (step / 24) * Math.PI * 2;
      const wobble = 1 + Math.sin(step * 2.6 + ring) * 0.055;
      points.push([
        center[0] + Math.cos(angle) * ring * 1.16 * wobble,
        center[1] + Math.sin(angle) * ring * 0.86 * wobble,
      ]);
    }
    paths.push(points);
  }
  return lineGeometry(paths);
}

function windowOpacity(
  position: number,
  start: number,
  end: number,
  feather = 0.55,
) {
  const enter = THREE.MathUtils.smoothstep(position, start - feather, start);
  const leave = 1 - THREE.MathUtils.smoothstep(position, end, end + feather);
  return enter * leave;
}

const IRON_PATHS: Point[][] = [
  [
    [1.1, -3.1],
    [0.75, -1.25],
    [1.2, 0.15],
    [2.35, 0.8],
    [3.3, 0.2],
    [3.65, -1.3],
    [3.25, -3.1],
  ],
  [
    [1.72, 0.68],
    [1.45, 1.78],
    [1.75, 2.78],
    [2.35, 3.18],
    [2.92, 2.78],
    [3.22, 1.78],
    [2.95, 0.72],
  ],
  [
    [1.72, 2.25],
    [2.03, 2.5],
    [2.7, 2.5],
    [3.02, 2.25],
  ],
  [
    [1.87, 1.94],
    [2.17, 1.78],
    [2.58, 1.78],
    [2.9, 1.94],
  ],
  [
    [1.45, 1.55],
    [1.82, 1.22],
    [2.88, 1.22],
    [3.22, 1.55],
  ],
  [
    [2.92, 0.25],
    [3.72, 0.95],
    [4.32, 2.0],
    [4.48, 3.05],
  ],
  [
    [3.72, 0.95],
    [4.55, 1.38],
    [4.92, 2.42],
  ],
  [
    [4.18, 3.0],
    [4.2, 3.65],
  ],
  [
    [4.38, 3.04],
    [4.5, 3.78],
  ],
  [
    [4.58, 3.02],
    [4.8, 3.68],
  ],
  [
    [4.77, 2.92],
    [5.06, 3.48],
  ],
  [
    [1.05, -0.95],
    [0.18, -1.65],
    [-0.42, -2.5],
  ],
];

const LOKI_PATHS: Point[][] = [
  [
    [-1.22, -3.2],
    [-1.08, -1.18],
    [-0.58, 0.08],
    [0, 0.48],
    [0.58, 0.08],
    [1.08, -1.18],
    [1.22, -3.2],
  ],
  [
    [-0.58, 0.12],
    [-0.75, 1.22],
    [-0.54, 2.18],
    [0, 2.62],
    [0.54, 2.18],
    [0.75, 1.22],
    [0.58, 0.12],
  ],
  [
    [-0.48, 2.15],
    [-1.28, 2.76],
    [-1.82, 3.72],
    [-1.72, 4.55],
    [-1.42, 3.74],
    [-0.72, 3.04],
    [-0.25, 2.78],
  ],
  [
    [0.48, 2.15],
    [1.28, 2.76],
    [1.82, 3.72],
    [1.72, 4.55],
    [1.42, 3.74],
    [0.72, 3.04],
    [0.25, 2.78],
  ],
  [
    [-0.48, 1.52],
    [-0.16, 1.62],
  ],
  [
    [0.48, 1.52],
    [0.16, 1.62],
  ],
  [
    [-0.34, 0.98],
    [0, 0.82],
    [0.34, 0.98],
  ],
];

const DOOM_PATHS: Point[][] = [
  [
    [-1.8, -3.2],
    [-1.52, -1.1],
    [-0.92, 0.25],
    [0, 0.74],
    [0.92, 0.25],
    [1.52, -1.1],
    [1.8, -3.2],
  ],
  [
    [-0.92, 0.28],
    [-1.18, 1.45],
    [-0.72, 2.65],
    [0, 3.22],
    [0.72, 2.65],
    [1.18, 1.45],
    [0.92, 0.28],
  ],
  [
    [-0.65, 2.16],
    [-0.4, 1.12],
    [0, 0.78],
    [0.4, 1.12],
    [0.65, 2.16],
  ],
  [
    [-0.48, 1.78],
    [-0.14, 1.7],
  ],
  [
    [0.48, 1.78],
    [0.14, 1.7],
  ],
  [
    [-1.15, -0.25],
    [-2.35, 0.18],
    [-3.25, 1.15],
  ],
  [
    [1.15, -0.25],
    [2.35, 0.18],
    [3.25, 1.15],
  ],
  [
    [-3.62, 1.2],
    [-3.28, 1.55],
    [-2.92, 1.22],
    [-3.25, 0.82],
    [-3.62, 1.2],
  ],
  [
    [3.62, 1.2],
    [3.28, 1.55],
    [2.92, 1.22],
    [3.25, 0.82],
    [3.62, 1.2],
  ],
];

const SPIDER_PATHS: Point[][] = [
  [
    [-0.42, 0.42],
    [-0.72, 1.28],
    [-0.32, 2.16],
    [0.35, 2.18],
    [0.72, 1.3],
    [0.42, 0.42],
  ],
  [
    [-0.3, 1.45],
    [-0.08, 1.58],
  ],
  [
    [0.3, 1.45],
    [0.08, 1.58],
  ],
  [
    [-0.38, 0.45],
    [-1.25, -0.2],
    [-2.15, -1.12],
    [-3.4, -1.3],
  ],
  [
    [0.38, 0.45],
    [1.05, -0.25],
    [2.12, -0.5],
    [3.25, -0.12],
  ],
  [
    [-1.2, -0.18],
    [-0.6, -1.25],
    [0.32, -1.55],
  ],
  [
    [1.03, -0.25],
    [0.78, -1.4],
    [1.72, -2.35],
  ],
  [
    [3.25, -0.12],
    [4.0, 0.95],
    [4.5, 2.75],
  ],
  [
    [-0.15, 0.5],
    [0, -0.55],
    [0.15, 0.5],
  ],
];

const DEADPOOL_PATHS: Point[][] = [
  [
    [-0.88, -1.5],
    [-1.08, 0.2],
    [-0.62, 1.68],
    [0, 2.15],
    [0.62, 1.68],
    [1.08, 0.2],
    [0.88, -1.5],
  ],
  [
    [-0.58, 1.1],
    [-0.12, 0.7],
    [-0.48, 0.08],
  ],
  [
    [0.58, 1.1],
    [0.12, 0.7],
    [0.48, 0.08],
  ],
  [
    [-1.62, -2.8],
    [1.52, 2.8],
  ],
  [
    [1.62, -2.8],
    [-1.52, 2.8],
  ],
  [
    [-1.05, -1.42],
    [-1.7, -2.9],
  ],
  [
    [1.05, -1.42],
    [1.7, -2.9],
  ],
];

export default function CharacterWorld() {
  const { camera, size } = useThree();
  const root = useRef<THREE.Group>(null);
  const iron = useRef<THREE.Group>(null);
  const loki = useRef<THREE.Group>(null);
  const doom = useRef<THREE.Group>(null);
  const spider = useRef<THREE.Group>(null);
  const deadpool = useRef<THREE.Group>(null);
  const finale = useRef<THREE.Group>(null);
  const portal = useRef<THREE.Group>(null);
  const web = useRef<THREE.LineSegments>(null);
  const ironBeam = useRef<THREE.Mesh>(null);
  const ironPalm = useRef<THREE.Mesh>(null);
  const doomEnergy = useRef<THREE.Group>(null);
  const materials = useRef<Record<string, THREE.Material[]>>({});

  const geometries = useMemo(
    () => ({
      deadpool: lineGeometry(DEADPOOL_PATHS),
      doom: lineGeometry(DOOM_PATHS),
      iron: lineGeometry(IRON_PATHS),
      loki: lineGeometry(LOKI_PATHS),
      spider: lineGeometry(SPIDER_PATHS),
      web: webGeometry(),
    }),
    [],
  );

  useEffect(
    () => () => Object.values(geometries).forEach((item) => item.dispose()),
    [geometries],
  );

  const remember = (key: string, material: THREE.Material | null) => {
    if (!material) return;
    const list = materials.current[key] ?? [];
    if (!list.includes(material)) list.push(material);
    materials.current[key] = list;
  };

  const setOpacity = (key: string, opacity: number) => {
    materials.current[key]?.forEach((material) => {
      material.opacity = opacity;
    });
  };

  useFrame(({ clock }, delta) => {
    if (!root.current) return;
    const scroll = getSceneScrollState();
    const position = scroll.reducedMotion ? 0 : scroll.position;
    const compact = size.width < 768;
    const time = clock.elapsedTime;
    const frameDelta = Math.min(delta, 0.05);

    root.current.position.copy(camera.position);
    root.current.quaternion.copy(camera.quaternion);
    root.current.position.x += scroll.reducedMotion
      ? 0
      : scroll.pointerX * 0.035;
    root.current.position.y -= scroll.reducedMotion
      ? 0
      : scroll.pointerY * 0.025;

    const ironOpacity = windowOpacity(position, 0, 1.15, 0.42);
    if (iron.current) {
      iron.current.visible = ironOpacity > 0.01;
      iron.current.position.x = compact ? 0.15 : 1.1;
      iron.current.scale.setScalar(compact ? 0.32 : 0.62);
      iron.current.rotation.z = scroll.reducedMotion
        ? 0
        : Math.sin(time * 0.42) * 0.008;
    }
    setOpacity("iron", ironOpacity * 0.66);
    setOpacity("ironFill", ironOpacity * 0.42);
    setOpacity("ironGlow", ironOpacity * (0.72 + Math.sin(time * 2.4) * 0.14));
    if (ironPalm.current && !scroll.reducedMotion) {
      ironPalm.current.scale.setScalar(0.88 + Math.sin(time * 3.1) * 0.12);
    }
    if (ironBeam.current) {
      ironBeam.current.scale.x = scroll.reducedMotion
        ? 0.45
        : 0.55 + Math.sin(time * 2.2) * 0.18;
    }

    const portalOpacity = windowOpacity(position, 1.05, 2.3, 0.32);
    if (portal.current) {
      portal.current.visible = portalOpacity > 0.01;
      portal.current.position.x = compact ? 0.55 : 3.05;
      portal.current.rotation.z = scroll.reducedMotion ? 0 : time * 0.065;
      portal.current.scale.setScalar(
        (compact ? 0.52 : 1) * (0.8 + portalOpacity * 0.2),
      );
    }
    setOpacity("portal", portalOpacity * 0.62);

    const lokiOpacity = windowOpacity(position, 1.72, 8.2, 0.25);
    if (loki.current) {
      loki.current.visible = lokiOpacity > 0.01;
      loki.current.position.x = compact ? 0.55 : 3.15;
      loki.current.scale.setScalar(compact ? 0.3 : 0.54);
      loki.current.position.y = scroll.reducedMotion
        ? 0
        : Math.sin(time * 0.31) * 0.045;
    }
    setOpacity("loki", lokiOpacity * 0.82);
    setOpacity("lokiFill", lokiOpacity * 0.72);
    setOpacity("lokiGlow", lokiOpacity * 0.9);

    const doomOpacity = windowOpacity(position, 8.42, 9.45, 0.28);
    if (doom.current) {
      doom.current.visible = doomOpacity > 0.01;
      doom.current.position.x = compact ? 0.5 : 2.75;
      doom.current.scale.setScalar(compact ? 0.28 : 0.55);
      doom.current.rotation.y = THREE.MathUtils.damp(
        doom.current.rotation.y,
        scroll.reducedMotion ? 0 : scroll.pointerX * 0.025,
        3,
        frameDelta,
      );
    }
    setOpacity("doom", doomOpacity * 0.7);
    setOpacity("doomFill", doomOpacity * 0.52);
    setOpacity("doomGlow", doomOpacity * (0.58 + Math.sin(time * 1.7) * 0.12));
    if (doomEnergy.current && !scroll.reducedMotion) {
      doomEnergy.current.rotation.z = -time * 0.11;
      doomEnergy.current.scale.setScalar(0.94 + Math.sin(time * 1.7) * 0.06);
    }

    const spiderOpacity = windowOpacity(position, 9.55, 10.4, 0.36);
    if (spider.current) {
      spider.current.visible = spiderOpacity > 0.01;
      spider.current.position.x = compact ? 0 : 1.5;
      spider.current.scale.setScalar(compact ? 0.32 : 0.65);
      spider.current.rotation.z = scroll.reducedMotion
        ? -0.08
        : -0.08 + Math.sin(time * 0.5) * 0.025;
      spider.current.position.y = scroll.reducedMotion
        ? 0
        : Math.sin(time * 0.55) * 0.12;
    }
    setOpacity("spider", spiderOpacity * 0.5);
    setOpacity("spiderFill", spiderOpacity * 0.4);
    setOpacity("spiderGlow", spiderOpacity * 0.72);
    setOpacity("web", spiderOpacity * 0.24);
    if (web.current && !scroll.reducedMotion) {
      web.current.rotation.z = time * 0.018;
    }

    const deadpoolOpacity = windowOpacity(position, 10.62, 11.15, 0.18);
    if (deadpool.current) {
      deadpool.current.visible = deadpoolOpacity > 0.01;
      deadpool.current.position.x = THREE.MathUtils.lerp(
        compact ? 1.8 : 5.3,
        compact ? 0.85 : 3.85,
        deadpoolOpacity,
      );
      deadpool.current.scale.setScalar(compact ? 0.34 : 0.58);
    }
    setOpacity("deadpool", deadpoolOpacity * 0.44);
    setOpacity("deadpoolFill", deadpoolOpacity * 0.44);
    setOpacity("deadpoolGlow", deadpoolOpacity * 0.78);

    const finaleOpacity = THREE.MathUtils.smoothstep(position, 14.18, 14.82);
    if (finale.current) {
      finale.current.visible = finaleOpacity > 0.01;
      finale.current.position.x = compact ? 0.65 : 3.65;
      finale.current.scale.setScalar(compact ? 0.32 : 0.58);
      finale.current.position.y = scroll.reducedMotion
        ? 0
        : Math.sin(time * 0.22) * 0.035;
    }
    setOpacity("finale", finaleOpacity * 0.5);
    setOpacity("finaleFill", finaleOpacity * 0.28);
    setOpacity("finaleGlow", finaleOpacity * 0.62);
  });

  return (
    <group ref={root} position={[0, 0, 0]}>
      <group position={[0, 0, -6.4]}>
        <group ref={iron} position={[1.1, -0.35, 0]} scale={0.62}>
          <mesh position={[2.35, -1.1, -0.06]} scale={[1.3, 2.05, 1]}>
            <circleGeometry args={[1, 6]} />
            <meshBasicMaterial
              ref={(value) => remember("ironFill", value)}
              color="#8F2F20"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <mesh position={[2.35, 1.86, -0.05]} scale={[0.82, 1.12, 1]}>
            <circleGeometry args={[1, 6]} />
            <meshBasicMaterial
              ref={(value) => remember("ironFill", value)}
              color="#B54525"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <Limb
            color="#9A3522"
            end={[4.48, 2.92]}
            materialRef={(value) => remember("ironFill", value)}
            start={[3.05, 0.05]}
            width={0.62}
          />
          <Limb
            color="#8F2F20"
            end={[0.05, -2.62]}
            materialRef={(value) => remember("ironFill", value)}
            start={[1.32, -0.15]}
            width={0.58}
          />
          <lineSegments geometry={geometries.iron}>
            <lineBasicMaterial
              ref={(value) => remember("iron", value)}
              color="#F6CF72"
              transparent
            />
          </lineSegments>
          {[2.02, 2.7].map((x) => (
            <mesh
              key={x}
              position={[x, 2.28, 0.03]}
              rotation={[0, 0, x < 2.3 ? 0.12 : -0.12]}
            >
              <planeGeometry args={[0.38, 0.08]} />
              <meshBasicMaterial
                ref={(value) => remember("ironGlow", value)}
                blending={THREE.AdditiveBlending}
                color="#F6CF72"
                transparent
              />
            </mesh>
          ))}
          <mesh position={[2.36, -0.05, 0.02]}>
            <ringGeometry args={[0.18, 0.34, 3]} />
            <meshBasicMaterial
              ref={(value) => remember("ironGlow", value)}
              color="#F6CF72"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <mesh ref={ironPalm} position={[4.48, 2.92, 0.02]}>
            <ringGeometry args={[0.13, 0.28, 18]} />
            <meshBasicMaterial
              ref={(value) => remember("ironGlow", value)}
              color="#F6CF72"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <mesh ref={ironBeam} position={[5.42, 2.92, -0.02]}>
            <planeGeometry args={[2.05, 0.16]} />
            <meshBasicMaterial
              ref={(value) => remember("ironGlow", value)}
              blending={THREE.AdditiveBlending}
              color="#E86A2B"
              transparent
            />
          </mesh>
        </group>

        <group ref={portal} position={[3.05, 0.18, -0.08]}>
          {[1.28, 1.6, 1.94].map((radius, index) => (
            <mesh key={radius} rotation={[0, 0, index * 0.22]}>
              <ringGeometry args={[radius, radius + 0.025, 64]} />
              <meshBasicMaterial
                ref={(value) => remember("portal", value)}
                color={index === 1 ? "#F6CF72" : "#6FE0AA"}
                side={THREE.DoubleSide}
                transparent
              />
            </mesh>
          ))}
        </group>

        <group ref={loki} position={[3.15, -0.4, 0]} scale={0.54}>
          <mesh position={[0, -1.35, -0.06]} scale={[1.4, 2.05, 1]}>
            <circleGeometry args={[1, 3]} />
            <meshBasicMaterial
              ref={(value) => remember("lokiFill", value)}
              color="#2A896C"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <mesh position={[0, 1.42, -0.05]} scale={[0.76, 1.05, 1]}>
            <circleGeometry args={[1, 7]} />
            <meshBasicMaterial
              ref={(value) => remember("lokiFill", value)}
              color="#4D9B68"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <mesh position={[-0.82, 3.15, -0.04]} rotation={[0, 0, -0.34]}>
            <coneGeometry args={[0.28, 2.55, 5]} />
            <meshBasicMaterial
              ref={(value) => remember("lokiGlow", value)}
              color="#CFAE49"
              transparent
            />
          </mesh>
          <mesh position={[0.82, 3.15, -0.04]} rotation={[0, 0, 0.34]}>
            <coneGeometry args={[0.28, 2.55, 5]} />
            <meshBasicMaterial
              ref={(value) => remember("lokiGlow", value)}
              color="#CFAE49"
              transparent
            />
          </mesh>
          <lineSegments geometry={geometries.loki}>
            <lineBasicMaterial
              ref={(value) => remember("loki", value)}
              color="#6FE0AA"
              transparent
            />
          </lineSegments>
          {[-0.24, 0.24].map((x) => (
            <mesh
              key={x}
              position={[x, 1.58, 0.03]}
              rotation={[0, 0, x < 0 ? 0.12 : -0.12]}
            >
              <planeGeometry args={[0.25, 0.055]} />
              <meshBasicMaterial
                ref={(value) => remember("lokiGlow", value)}
                blending={THREE.AdditiveBlending}
                color="#F6CF72"
                transparent
              />
            </mesh>
          ))}
          <mesh position={[0, 0.05, 0.02]}>
            <ringGeometry args={[0.26, 0.3, 6]} />
            <meshBasicMaterial
              ref={(value) => remember("lokiGlow", value)}
              color="#F6CF72"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
        </group>

        <group ref={doom} position={[2.75, -0.2, 0]} scale={0.55}>
          <mesh position={[0, -1.45, -0.07]} scale={[1.75, 2.15, 1]}>
            <circleGeometry args={[1, 3]} />
            <meshBasicMaterial
              ref={(value) => remember("doomFill", value)}
              color="#244A3B"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <mesh position={[0, 1.45, -0.05]} scale={[0.78, 1.12, 1]}>
            <circleGeometry args={[1, 6]} />
            <meshBasicMaterial
              ref={(value) => remember("doomFill", value)}
              color="#77827A"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <lineSegments geometry={geometries.doom}>
            <lineBasicMaterial
              ref={(value) => remember("doom", value)}
              color="#6FE0AA"
              transparent
            />
          </lineSegments>
          {[-0.28, 0.28].map((x) => (
            <mesh
              key={x}
              position={[x, 1.67, 0.03]}
              rotation={[0, 0, x < 0 ? 0.12 : -0.12]}
            >
              <planeGeometry args={[0.3, 0.065]} />
              <meshBasicMaterial
                ref={(value) => remember("doomGlow", value)}
                blending={THREE.AdditiveBlending}
                color="#B8FFD5"
                transparent
              />
            </mesh>
          ))}
          <group ref={doomEnergy}>
            {[-3.28, 3.28].map((x) => (
              <mesh key={x} position={[x, 1.18, 0.02]}>
                <ringGeometry args={[0.2, 0.58, 8]} />
                <meshBasicMaterial
                  ref={(value) => remember("doomGlow", value)}
                  blending={THREE.AdditiveBlending}
                  color="#6FE0AA"
                  side={THREE.DoubleSide}
                  transparent
                />
              </mesh>
            ))}
          </group>
        </group>

        <lineSegments
          ref={web}
          geometry={geometries.web}
          position={[0.2, 0, -0.18]}
        >
          <lineBasicMaterial
            ref={(value) => remember("web", value)}
            color="#F2EEE7"
            transparent
          />
        </lineSegments>
        <group ref={spider} position={[1.5, 0, 0]} scale={0.65}>
          <mesh position={[0, 1.3, -0.04]} scale={[0.62, 0.86, 1]}>
            <circleGeometry args={[1, 12]} />
            <meshBasicMaterial
              ref={(value) => remember("spiderFill", value)}
              color="#9E2E2A"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <mesh position={[0, -0.2, -0.05]} scale={[0.62, 1.15, 1]}>
            <circleGeometry args={[1, 6]} />
            <meshBasicMaterial
              ref={(value) => remember("spiderFill", value)}
              color="#273E83"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <Limb
            color="#273E83"
            end={[-3.4, -1.3]}
            materialRef={(value) => remember("spiderFill", value)}
            start={[-0.4, 0.42]}
            width={0.35}
          />
          <Limb
            color="#9E2E2A"
            end={[3.25, -0.12]}
            materialRef={(value) => remember("spiderFill", value)}
            start={[0.4, 0.42]}
            width={0.34}
          />
          <Limb
            color="#273E83"
            end={[1.72, -2.35]}
            materialRef={(value) => remember("spiderFill", value)}
            start={[0.25, -0.75]}
            width={0.38}
          />
          <lineSegments geometry={geometries.spider}>
            <lineBasicMaterial
              ref={(value) => remember("spider", value)}
              color="#6F8FFF"
              transparent
            />
          </lineSegments>
          <mesh position={[-0.19, 1.48, 0.02]} rotation={[0, 0, 0.28]}>
            <circleGeometry args={[0.16, 3]} />
            <meshBasicMaterial
              ref={(value) => remember("spiderGlow", value)}
              color="#F2EEE7"
              transparent
            />
          </mesh>
          <mesh position={[0.19, 1.48, 0.02]} rotation={[0, 0, -0.28]}>
            <circleGeometry args={[0.16, 3]} />
            <meshBasicMaterial
              ref={(value) => remember("spiderGlow", value)}
              color="#F2EEE7"
              transparent
            />
          </mesh>
        </group>

        <group ref={deadpool} position={[5.3, 0.1, 0]} scale={0.58}>
          <mesh position={[0, 0.35, -0.05]} scale={[1.02, 1.75, 1]}>
            <circleGeometry args={[1, 16]} />
            <meshBasicMaterial
              ref={(value) => remember("deadpoolFill", value)}
              color="#8E2727"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <lineSegments geometry={geometries.deadpool}>
            <lineBasicMaterial
              ref={(value) => remember("deadpool", value)}
              color="#E86A2B"
              transparent
            />
          </lineSegments>
          {[-0.42, 0.42].map((x) => (
            <mesh key={x} position={[x, 0.92, 0.02]} scale={[0.45, 0.9, 1]}>
              <circleGeometry args={[0.46, 8]} />
              <meshBasicMaterial
                ref={(value) => remember("deadpoolGlow", value)}
                color="#111318"
                transparent
              />
            </mesh>
          ))}
          {[-0.42, 0.42].map((x) => (
            <mesh
              key={`eye-${x}`}
              position={[x, 0.94, 0.04]}
              rotation={[0, 0, x < 0 ? 0.2 : -0.2]}
            >
              <circleGeometry args={[0.13, 3]} />
              <meshBasicMaterial
                ref={(value) => remember("deadpoolGlow", value)}
                color="#F2EEE7"
                transparent
              />
            </mesh>
          ))}
        </group>

        <group ref={finale} position={[3.65, -0.45, 0]} scale={0.58}>
          <mesh position={[0, -1.35, -0.06]} scale={[1.4, 2.05, 1]}>
            <circleGeometry args={[1, 3]} />
            <meshBasicMaterial
              ref={(value) => remember("finaleFill", value)}
              color="#164D3D"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <mesh position={[0, 1.42, -0.05]} scale={[0.76, 1.05, 1]}>
            <circleGeometry args={[1, 7]} />
            <meshBasicMaterial
              ref={(value) => remember("finaleFill", value)}
              color="#356B48"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          {[-1, 1].map((side) => (
            <mesh
              key={side}
              position={[side * 0.82, 3.15, -0.04]}
              rotation={[0, 0, side * 0.34]}
            >
              <coneGeometry args={[0.28, 2.55, 5]} />
              <meshBasicMaterial
                ref={(value) => remember("finaleGlow", value)}
                color="#CFAE49"
                transparent
              />
            </mesh>
          ))}
          <lineSegments geometry={geometries.loki}>
            <lineBasicMaterial
              ref={(value) => remember("finale", value)}
              color="#6FE0AA"
              transparent
            />
          </lineSegments>
          <mesh position={[0, -3.35, 0.02]}>
            <circleGeometry args={[0.11, 18]} />
            <meshBasicMaterial
              ref={(value) => remember("finaleGlow", value)}
              color="#F6CF72"
              transparent
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
