"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { getSceneScrollState } from "../scroll/store";

type Point = readonly [number, number];

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
  const { camera } = useThree();
  const root = useRef<THREE.Group>(null);
  const iron = useRef<THREE.Group>(null);
  const loki = useRef<THREE.Group>(null);
  const doom = useRef<THREE.Group>(null);
  const spider = useRef<THREE.Group>(null);
  const deadpool = useRef<THREE.Group>(null);
  const finale = useRef<THREE.Group>(null);
  const portal = useRef<THREE.Group>(null);
  const web = useRef<THREE.LineSegments>(null);
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
      iron.current.rotation.z = scroll.reducedMotion
        ? 0
        : Math.sin(time * 0.42) * 0.008;
    }
    setOpacity("iron", ironOpacity * 0.66);
    setOpacity("ironGlow", ironOpacity * (0.48 + Math.sin(time * 2.4) * 0.08));

    const portalOpacity = windowOpacity(position, 1.05, 2.3, 0.32);
    if (portal.current) {
      portal.current.visible = portalOpacity > 0.01;
      portal.current.rotation.z = scroll.reducedMotion ? 0 : time * 0.065;
      portal.current.scale.setScalar(0.8 + portalOpacity * 0.2);
    }
    setOpacity("portal", portalOpacity * 0.28);

    const lokiOpacity = windowOpacity(position, 1.72, 8.55, 0.48);
    if (loki.current) {
      loki.current.visible = lokiOpacity > 0.01;
      loki.current.position.y = scroll.reducedMotion
        ? 0
        : Math.sin(time * 0.31) * 0.045;
    }
    setOpacity("loki", lokiOpacity * 0.56);
    setOpacity("lokiGlow", lokiOpacity * 0.4);

    const doomOpacity = windowOpacity(position, 8.72, 9.45, 0.34);
    if (doom.current) {
      doom.current.visible = doomOpacity > 0.01;
      doom.current.rotation.y = THREE.MathUtils.damp(
        doom.current.rotation.y,
        scroll.reducedMotion ? 0 : scroll.pointerX * 0.025,
        3,
        frameDelta,
      );
    }
    setOpacity("doom", doomOpacity * 0.5);
    setOpacity("doomGlow", doomOpacity * (0.35 + Math.sin(time * 1.7) * 0.09));

    const spiderOpacity = windowOpacity(position, 9.55, 10.4, 0.36);
    if (spider.current) {
      spider.current.visible = spiderOpacity > 0.01;
      spider.current.rotation.z = scroll.reducedMotion
        ? -0.08
        : -0.08 + Math.sin(time * 0.5) * 0.025;
      spider.current.position.y = scroll.reducedMotion
        ? 0
        : Math.sin(time * 0.55) * 0.12;
    }
    setOpacity("spider", spiderOpacity * 0.5);
    setOpacity("web", spiderOpacity * 0.105);
    if (web.current && !scroll.reducedMotion) {
      web.current.rotation.z = time * 0.018;
    }

    const deadpoolOpacity = windowOpacity(position, 10.62, 11.15, 0.18);
    if (deadpool.current) {
      deadpool.current.visible = deadpoolOpacity > 0.01;
      deadpool.current.position.x = THREE.MathUtils.lerp(
        5.3,
        3.85,
        deadpoolOpacity,
      );
    }
    setOpacity("deadpool", deadpoolOpacity * 0.44);

    const finaleOpacity = THREE.MathUtils.smoothstep(position, 14.18, 14.82);
    if (finale.current) {
      finale.current.visible = finaleOpacity > 0.01;
      finale.current.position.y = scroll.reducedMotion
        ? 0
        : Math.sin(time * 0.22) * 0.035;
    }
    setOpacity("finale", finaleOpacity * 0.22);
    setOpacity("finaleGlow", finaleOpacity * 0.32);
  });

  return (
    <group ref={root} position={[0, 0, 0]}>
      <group position={[0, 0, -6.4]}>
        <group ref={iron} position={[0.45, -0.08, 0]} scale={0.82}>
          <lineSegments geometry={geometries.iron}>
            <lineBasicMaterial
              ref={(value) => remember("iron", value)}
              color="#F6CF72"
              transparent
            />
          </lineSegments>
          <mesh position={[2.36, -0.05, 0.02]}>
            <ringGeometry args={[0.18, 0.34, 3]} />
            <meshBasicMaterial
              ref={(value) => remember("ironGlow", value)}
              color="#F6CF72"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <mesh position={[4.48, 2.92, 0.02]}>
            <ringGeometry args={[0.13, 0.28, 18]} />
            <meshBasicMaterial
              ref={(value) => remember("ironGlow", value)}
              color="#F6CF72"
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
          <mesh position={[5.45, 2.92, -0.02]} rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[0.035, 1.72]} />
            <meshBasicMaterial
              ref={(value) => remember("ironGlow", value)}
              blending={THREE.AdditiveBlending}
              color="#E86A2B"
              transparent
            />
          </mesh>
        </group>

        <group ref={portal} position={[-2.95, 0.18, -0.08]}>
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

        <group ref={loki} position={[3.15, -0.3, 0]} scale={0.72}>
          <lineSegments geometry={geometries.loki}>
            <lineBasicMaterial
              ref={(value) => remember("loki", value)}
              color="#6FE0AA"
              transparent
            />
          </lineSegments>
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

        <group ref={doom} position={[2.8, -0.12, 0]} scale={0.78}>
          <lineSegments geometry={geometries.doom}>
            <lineBasicMaterial
              ref={(value) => remember("doom", value)}
              color="#6FE0AA"
              transparent
            />
          </lineSegments>
          {[-3.28, 3.28].map((x) => (
            <mesh key={x} position={[x, 1.18, 0.02]}>
              <ringGeometry args={[0.18, 0.42, 8]} />
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
        <group ref={spider} position={[-0.5, 0.1, 0]} scale={0.82}>
          <lineSegments geometry={geometries.spider}>
            <lineBasicMaterial
              ref={(value) => remember("spider", value)}
              color="#6F8FFF"
              transparent
            />
          </lineSegments>
        </group>

        <group ref={deadpool} position={[5.3, 0.1, 0]} scale={0.72}>
          <lineSegments geometry={geometries.deadpool}>
            <lineBasicMaterial
              ref={(value) => remember("deadpool", value)}
              color="#E86A2B"
              transparent
            />
          </lineSegments>
        </group>

        <group ref={finale} position={[3.65, -0.45, 0]} scale={0.58}>
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
