"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getSceneScrollState } from "../scroll/store";

const CAREER_POINTS = [
  [-5.5, 0.1, 0],
  [-3.65, 0.85, -0.25],
  [-1.8, 1.05, 0.15],
  [0, 0.75, -0.35],
  [1.85, 0.25, 0.15],
  [3.7, -0.45, -0.2],
  [5.5, -1.05, 0],
] as const;

const CONDUIT_POINTS = [-4.8, -1.6, 1.6, 4.8] as const;
const MODULE_POINTS = [
  [-3.2, 1.35, 0],
  [0, 1.6, 0],
  [3.2, 1.1, 0],
  [-1.8, -1.35, 0],
  [1.8, -1.45, 0],
] as const;
const PROJECT_POINTS = [
  [-3.8, 1.5, 0],
  [3.5, 1.45, 0],
  [-3.2, -1.55, 0],
  [3.7, -1.35, 0],
] as const;

function createSegments(points: readonly (readonly number[])[]) {
  const values = new Float32Array((points.length - 1) * 6);
  for (let index = 0; index < points.length - 1; index += 1) {
    values.set(points[index], index * 6);
    values.set(points[index + 1], index * 6 + 3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(values, 3));
  return geometry;
}

function createRadialSegments(points: readonly (readonly number[])[]) {
  const values = new Float32Array(points.length * 6);
  points.forEach((point, index) => {
    values.set([0, 0, 0], index * 6);
    values.set(point, index * 6 + 3);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(values, 3));
  return geometry;
}

function createTreeGeometry() {
  const segments: number[] = [];
  const add = (start: number[], end: number[]) =>
    segments.push(...start, ...end);
  let previous = [0, -3.6, 0];
  for (let index = 1; index <= 7; index += 1) {
    const next = [Math.sin(index * 1.3) * 0.08, -3.6 + index * 0.72, 0];
    add(previous, next);
    previous = next;
  }
  for (const side of [-1, 1]) {
    for (let level = 0; level < 6; level += 1) {
      const origin = [0, -0.55 + level * 0.52, 0];
      const bend = [
        side * (0.9 + level * 0.2),
        origin[1] + 0.62,
        side * Math.sin(level * 1.4) * 0.22,
      ];
      const tip = [
        side * (2.15 + level * 0.42),
        origin[1] + 1.35 + level * 0.16,
        side * Math.cos(level * 1.1) * 0.48,
      ];
      add(origin, bend);
      add(bend, tip);
      add(tip, [tip[0] + side * 0.58, tip[1] + 0.58, tip[2] + 0.35]);
      add(tip, [tip[0] + side * 0.5, tip[1] + 0.18, tip[2] - 0.48]);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(segments, 3),
  );
  return geometry;
}

function windowOpacity(
  position: number,
  start: number,
  end: number,
  feather = 0.55,
) {
  const fadeIn = THREE.MathUtils.smoothstep(position, start - feather, start);
  const fadeOut = 1 - THREE.MathUtils.smoothstep(position, end, end + feather);
  return fadeIn * fadeOut;
}

export default function InfrastructureWorld() {
  const root = useRef<THREE.Group>(null);
  const conduit = useRef<THREE.Group>(null);
  const career = useRef<THREE.Group>(null);
  const skills = useRef<THREE.Group>(null);
  const projects = useRef<THREE.Group>(null);
  const archive = useRef<THREE.Group>(null);
  const tree = useRef<THREE.Group>(null);
  const conduitMaterials = useRef<THREE.Material[]>([]);
  const careerLineMaterial = useRef<THREE.LineBasicMaterial>(null);
  const careerMaterials = useRef<THREE.MeshBasicMaterial[]>([]);
  const skillMaterials = useRef<THREE.MeshBasicMaterial[]>([]);
  const projectMaterials = useRef<THREE.Material[]>([]);
  const archiveMaterials = useRef<THREE.MeshBasicMaterial[]>([]);
  const treeMaterials = useRef<THREE.Material[]>([]);

  const conduitLine = useMemo(
    () =>
      createSegments([
        [-5.8, 0, 0],
        [5.8, 0, 0],
      ]),
    [],
  );
  const careerLine = useMemo(() => createSegments(CAREER_POINTS), []);
  const projectLine = useMemo(() => createRadialSegments(PROJECT_POINTS), []);
  const treeGeometry = useMemo(createTreeGeometry, []);

  useEffect(
    () => () => {
      conduitLine.dispose();
      careerLine.dispose();
      projectLine.dispose();
      treeGeometry.dispose();
    },
    [careerLine, conduitLine, projectLine, treeGeometry],
  );

  useFrame(({ clock }, delta) => {
    const scroll = getSceneScrollState();
    const position = scroll.reducedMotion ? 0 : scroll.position;
    const time = clock.elapsedTime;
    const frameDelta = Math.min(delta, 0.05);

    if (root.current && !scroll.reducedMotion) {
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        scroll.pointerX * 0.018,
        3,
        frameDelta,
      );
      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        -scroll.pointerY * 0.012,
        3,
        frameDelta,
      );
    }

    const conduitOpacity = windowOpacity(position, 0.55, 1.35);
    if (conduit.current) conduit.current.visible = conduitOpacity > 0.01;
    conduitMaterials.current.forEach((material, index) => {
      material.opacity = conduitOpacity * (index === 0 ? 0.2 : 0.28);
    });

    const careerOpacity = windowOpacity(position, 1.6, 8.6);
    if (career.current) career.current.visible = careerOpacity > 0.01;
    if (careerLineMaterial.current) {
      careerLineMaterial.current.opacity = careerOpacity * 0.1;
    }
    const activeCareer = Math.round(THREE.MathUtils.clamp(position - 2, 0, 6));
    careerMaterials.current.forEach((material, index) => {
      material.opacity = careerOpacity * (index === activeCareer ? 0.28 : 0.07);
      material.color.set(index === activeCareer ? "#E86A2B" : "#6F8FFF");
    });

    const skillsOpacity = windowOpacity(position, 8.7, 9.35);
    if (skills.current) skills.current.visible = skillsOpacity > 0.01;
    skillMaterials.current.forEach((material, index) => {
      material.opacity = skillsOpacity * (index === 0 ? 0.28 : 0.15);
    });

    const projectsOpacity = windowOpacity(position, 9.7, 10.35);
    if (projects.current) projects.current.visible = projectsOpacity > 0.01;
    projectMaterials.current.forEach((material, index) => {
      material.opacity = projectsOpacity * (index === 0 ? 0.16 : 0.24);
    });

    const archiveOpacity = windowOpacity(position, 10.7, 13.25);
    if (archive.current) archive.current.visible = archiveOpacity > 0.01;
    archiveMaterials.current.forEach((material) => {
      material.opacity = archiveOpacity * 0.11;
    });
    if (archive.current && !scroll.reducedMotion) {
      archive.current.position.y = Math.sin(time * 0.18) * 0.035;
    }

    const treeOpacity = THREE.MathUtils.smoothstep(position, 14.2, 15);
    if (tree.current) tree.current.visible = treeOpacity > 0.01;
    treeMaterials.current.forEach((material, index) => {
      material.opacity = treeOpacity * (index === 0 ? 0.24 : 0.32);
    });
    if (tree.current && !scroll.reducedMotion) {
      tree.current.rotation.y = Math.sin(time * 0.14) * 0.045;
    }
  });

  return (
    <group ref={root}>
      <group ref={conduit}>
        <lineSegments geometry={conduitLine}>
          <lineBasicMaterial
            ref={(material) => {
              if (material) conduitMaterials.current[0] = material;
            }}
            color="#E86A2B"
            transparent
          />
        </lineSegments>
        {CONDUIT_POINTS.map((x, index) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
            <ringGeometry args={[0.34, 0.43, 4]} />
            <meshBasicMaterial
              ref={(material) => {
                if (material) conduitMaterials.current[index + 1] = material;
              }}
              color={index === 3 ? "#F6CF72" : "#E86A2B"}
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
        ))}
      </group>

      <group ref={career}>
        <lineSegments geometry={careerLine}>
          <lineBasicMaterial
            ref={careerLineMaterial}
            color="#6F8FFF"
            transparent
          />
        </lineSegments>
        {CAREER_POINTS.map((point, index) => (
          <mesh key={index} position={point} scale={index === 0 ? 0.34 : 0.23}>
            <icosahedronGeometry args={[1, index === 0 ? 2 : 1]} />
            <meshBasicMaterial
              ref={(material) => {
                if (material) careerMaterials.current[index] = material;
              }}
              color="#6F8FFF"
              transparent
              wireframe={index !== 0}
            />
          </mesh>
        ))}
      </group>

      <group ref={skills}>
        {MODULE_POINTS.map((point, index) => (
          <mesh key={index} position={point} rotation={[0, 0, index * 0.18]}>
            <ringGeometry args={[0.48, 0.54, 6]} />
            <meshBasicMaterial
              ref={(material) => {
                if (material) skillMaterials.current[index] = material;
              }}
              color={index === 0 ? "#E86A2B" : "#4FB493"}
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
        ))}
      </group>

      <group ref={projects}>
        <lineSegments geometry={projectLine}>
          <lineBasicMaterial
            ref={(material) => {
              if (material) projectMaterials.current[0] = material;
            }}
            color="#F6CF72"
            transparent
          />
        </lineSegments>
        <mesh>
          <ringGeometry args={[0.22, 0.36, 12]} />
          <meshBasicMaterial
            ref={(material) => {
              if (material) projectMaterials.current[1] = material;
            }}
            color="#F6CF72"
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
        {PROJECT_POINTS.map((point, index) => (
          <mesh key={index} position={point}>
            <ringGeometry args={[0.26, 0.34, 8]} />
            <meshBasicMaterial
              ref={(material) => {
                if (material) projectMaterials.current[index + 2] = material;
              }}
              color={index % 2 === 0 ? "#6F8FFF" : "#F6CF72"}
              side={THREE.DoubleSide}
              transparent
            />
          </mesh>
        ))}
      </group>

      <group ref={archive}>
        {[-4.4, -1.45, 1.55, 4.45].map((x, index) => (
          <mesh
            key={x}
            position={[x, index % 2 === 0 ? 0.7 : -0.6, -index * 0.12]}
            rotation={[0.02 * index, -0.06 * (index - 1.5), 0]}
          >
            <planeGeometry args={[1.56, 2.16]} />
            <meshBasicMaterial
              ref={(material) => {
                if (material) archiveMaterials.current[index] = material;
              }}
              color={index % 2 === 0 ? "#6F8FFF" : "#E86A2B"}
              side={THREE.DoubleSide}
              transparent
              wireframe
            />
          </mesh>
        ))}
      </group>

      <group ref={tree} position={[0, -0.1, 0]}>
        <lineSegments geometry={treeGeometry}>
          <lineBasicMaterial
            ref={(material) => {
              if (material) treeMaterials.current[0] = material;
            }}
            color="#7DE2A5"
            transparent
          />
        </lineSegments>
        <mesh position={[0, -3.58, 0]}>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshBasicMaterial
            ref={(material) => {
              if (material) treeMaterials.current[1] = material;
            }}
            color="#F6CF72"
            transparent
          />
        </mesh>
      </group>
    </group>
  );
}
