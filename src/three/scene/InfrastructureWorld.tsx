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

function createTimelineTreeGeometry() {
  const segments: number[] = [];
  const addSegment = (start: number[], end: number[]) => {
    segments.push(...start, ...end);
  };

  let previous = [0, -3.6, 0];
  for (let index = 1; index <= 7; index += 1) {
    const next = [Math.sin(index * 1.3) * 0.08, -3.6 + index * 0.72, 0];
    addSegment(previous, next);
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
      addSegment(origin, bend);
      addSegment(bend, tip);
      addSegment(tip, [
        tip[0] + side * (0.58 + level * 0.04),
        tip[1] + 0.58,
        tip[2] + 0.35,
      ]);
      addSegment(tip, [
        tip[0] + side * (0.5 + level * 0.05),
        tip[1] + 0.18,
        tip[2] - 0.48,
      ]);
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
  feather = 0.6,
) {
  const fadeIn = THREE.MathUtils.smoothstep(position, start - feather, start);
  const fadeOut = 1 - THREE.MathUtils.smoothstep(position, end, end + feather);
  return fadeIn * fadeOut;
}

export default function InfrastructureWorld() {
  const root = useRef<THREE.Group>(null);
  const tunnel = useRef<THREE.Group>(null);
  const career = useRef<THREE.Group>(null);
  const skills = useRef<THREE.Group>(null);
  const projects = useRef<THREE.Group>(null);
  const archive = useRef<THREE.Group>(null);
  const cosmic = useRef<THREE.Group>(null);
  const timelineTree = useRef<THREE.Group>(null);
  const careerMaterials = useRef<THREE.MeshBasicMaterial[]>([]);
  const cosmicMaterials = useRef<THREE.MeshBasicMaterial[]>([]);
  const treeLineMaterial = useRef<THREE.LineBasicMaterial>(null);
  const treeGlowMaterials = useRef<THREE.MeshBasicMaterial[]>([]);

  const careerLine = useMemo(() => {
    const positions = new Float32Array((CAREER_POINTS.length - 1) * 6);
    for (let index = 0; index < CAREER_POINTS.length - 1; index += 1) {
      positions.set(CAREER_POINTS[index], index * 6);
      positions.set(CAREER_POINTS[index + 1], index * 6 + 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  const timelineTreeGeometry = useMemo(createTimelineTreeGeometry, []);

  useEffect(
    () => () => {
      careerLine.dispose();
      timelineTreeGeometry.dispose();
    },
    [careerLine, timelineTreeGeometry],
  );

  useFrame(({ clock }, delta) => {
    const scroll = getSceneScrollState();
    const position = scroll.reducedMotion ? 0 : scroll.position;
    const time = clock.elapsedTime;
    const frameDelta = Math.min(delta, 0.05);

    if (root.current && !scroll.reducedMotion) {
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        scroll.pointerX * 0.035,
        3,
        frameDelta,
      );
      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        -scroll.pointerY * 0.02,
        3,
        frameDelta,
      );
    }

    if (tunnel.current) {
      tunnel.current.visible = position < 2.6;
      tunnel.current.rotation.z = scroll.reducedMotion ? 0 : time * 0.025;
      tunnel.current.children.forEach((child, index) => {
        const material = (child as THREE.Mesh)
          .material as THREE.MeshBasicMaterial;
        material.opacity =
          windowOpacity(position, 0, 2.1) * (0.08 + index * 0.006);
      });
    }

    if (career.current) {
      career.current.visible = position > 1.25 && position < 9.5;
      const opacity = windowOpacity(position, 1.5, 8.7);
      const line = career.current.children[0] as THREE.LineSegments;
      (line.material as THREE.LineBasicMaterial).opacity = opacity * 0.38;
      const active = Math.round(THREE.MathUtils.clamp(position - 2, 0, 6));
      careerMaterials.current.forEach((material, index) => {
        material.opacity = opacity * (index === active ? 0.58 : 0.18);
        material.color.set(index === active ? "#E86A2B" : "#6F8FFF");
      });
    }

    if (skills.current) {
      const opacity = windowOpacity(position, 8.55, 9.65);
      skills.current.visible = opacity > 0.01;
      skills.current.rotation.y = scroll.reducedMotion ? 0.4 : time * 0.08;
      skills.current.children.forEach((child) => {
        const material = (child as THREE.Mesh)
          .material as THREE.MeshBasicMaterial;
        material.opacity = opacity * 0.42;
      });
    }

    if (projects.current) {
      const opacity = windowOpacity(position, 9.55, 10.6);
      projects.current.visible = opacity > 0.01;
      projects.current.rotation.y = scroll.reducedMotion ? 0 : time * 0.04;
      projects.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh;
        (mesh.material as THREE.MeshBasicMaterial).opacity = opacity * 0.5;
        if (!scroll.reducedMotion)
          mesh.rotation.x += frameDelta * (0.04 + index * 0.01);
      });
    }

    if (archive.current) {
      const opacity = windowOpacity(position, 10.55, 13.65);
      archive.current.visible = opacity > 0.01;
      archive.current.children.forEach((child, index) => {
        const mesh = child as THREE.Mesh;
        (mesh.material as THREE.MeshBasicMaterial).opacity = opacity * 0.22;
        if (!scroll.reducedMotion)
          mesh.position.y += Math.sin(time * 0.25 + index) * 0.0008;
      });
    }

    if (cosmic.current) {
      const opacity = windowOpacity(position, 13.25, 14.45, 0.45);
      cosmic.current.visible = opacity > 0.01;
      cosmic.current.rotation.z = scroll.reducedMotion ? 0.28 : time * 0.07;
      cosmic.current.rotation.y = scroll.reducedMotion ? -0.18 : time * 0.035;
      cosmicMaterials.current.forEach((material, index) => {
        material.opacity = opacity * (index === 0 ? 0.9 : 0.34);
      });
    }

    if (timelineTree.current) {
      const opacity = THREE.MathUtils.smoothstep(position, 14.1, 15);
      timelineTree.current.visible = opacity > 0.01;
      timelineTree.current.rotation.y = scroll.reducedMotion
        ? -0.08
        : Math.sin(time * 0.16) * 0.08;
      if (treeLineMaterial.current) {
        treeLineMaterial.current.opacity = opacity * 0.72;
      }
      treeGlowMaterials.current.forEach((material, index) => {
        material.opacity = opacity * (index === 0 ? 0.92 : 0.3);
      });
    }
  });

  return (
    <group ref={root}>
      <group ref={tunnel} rotation={[Math.PI / 2, 0, 0]}>
        {Array.from({ length: 18 }, (_, index) => (
          <mesh key={index} position={[0, 0, -index * 0.72 + 4.5]}>
            <torusGeometry args={[2.2 + index * 0.035, 0.012, 4, 64]} />
            <meshBasicMaterial
              color={index % 3 === 0 ? "#E86A2B" : "#6F8FFF"}
              transparent
            />
          </mesh>
        ))}
      </group>

      <group ref={career}>
        <lineSegments geometry={careerLine}>
          <lineBasicMaterial color="#6F8FFF" transparent />
        </lineSegments>
        {CAREER_POINTS.map((point, index) => (
          <mesh key={index} position={point} scale={index < 2 ? 0.34 : 0.24}>
            <icosahedronGeometry args={[1, index < 2 ? 2 : 1]} />
            <meshBasicMaterial
              ref={(material) => {
                if (material) careerMaterials.current[index] = material;
              }}
              color="#6F8FFF"
              transparent
              wireframe={index > 1}
            />
          </mesh>
        ))}
      </group>

      <group ref={skills}>
        {[0, 1, 2].map((index) => (
          <mesh key={index} rotation={[index * 0.8, index * 0.55, index * 0.4]}>
            <torusGeometry args={[2.1 + index * 0.7, 0.018, 5, 96]} />
            <meshBasicMaterial
              color={index === 1 ? "#E86A2B" : "#4FB493"}
              transparent
            />
          </mesh>
        ))}
      </group>

      <group ref={projects}>
        {[-3.6, -1.2, 1.2, 3.6].map((x, index) => (
          <mesh
            key={x}
            position={[x, Math.sin(index) * 0.8, index % 2 ? -0.8 : 0.4]}
            rotation={[0.4, index * 0.5, 0.2]}
          >
            <boxGeometry args={[1.1, 1.1, 1.1]} />
            <meshBasicMaterial
              color={index === 0 ? "#E86A2B" : "#6F8FFF"}
              transparent
              wireframe
            />
          </mesh>
        ))}
      </group>

      <group ref={archive}>
        {Array.from({ length: 8 }, (_, index) => (
          <mesh
            key={index}
            position={[
              (index - 3.5) * 1.25,
              ((index % 3) - 1) * 0.8,
              -Math.abs(index - 3.5) * 0.45,
            ]}
            rotation={[0.08 * index, -0.15 * (index - 3.5), 0.04 * index]}
          >
            <planeGeometry args={[0.82, 1.18, 1, 1]} />
            <meshBasicMaterial
              color={index % 3 === 0 ? "#E86A2B" : "#F2EEE7"}
              side={THREE.DoubleSide}
              transparent
              wireframe
            />
          </mesh>
        ))}
      </group>

      <group ref={cosmic} position={[0.8, 0.2, 0]} rotation={[0.15, -0.18, 0]}>
        <mesh>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshBasicMaterial
            ref={(material) => {
              if (material) cosmicMaterials.current[0] = material;
            }}
            color="#F6CF72"
            transparent
          />
        </mesh>
        {[1.25, 1.9, 2.7].map((radius, index) => (
          <mesh
            key={radius}
            rotation={[Math.PI / 2 + index * 0.16, index * 0.42, 0]}
          >
            <torusGeometry args={[radius, 0.018 + index * 0.006, 5, 128]} />
            <meshBasicMaterial
              ref={(material) => {
                if (material) cosmicMaterials.current[index + 1] = material;
              }}
              color={index === 1 ? "#F6CF72" : "#6FE0AA"}
              transparent
            />
          </mesh>
        ))}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.035, 0.18, 7.5, 8, 1, true]} />
          <meshBasicMaterial
            ref={(material) => {
              if (material) cosmicMaterials.current[4] = material;
            }}
            color="#6FE0AA"
            side={THREE.DoubleSide}
            transparent
            wireframe
          />
        </mesh>
      </group>

      <group ref={timelineTree} position={[0, -0.1, 0]}>
        <lineSegments geometry={timelineTreeGeometry}>
          <lineBasicMaterial
            ref={treeLineMaterial}
            color="#7DE2A5"
            transparent
          />
        </lineSegments>
        <mesh position={[0, -3.58, 0]}>
          <sphereGeometry args={[0.14, 20, 20]} />
          <meshBasicMaterial
            ref={(material) => {
              if (material) treeGlowMaterials.current[0] = material;
            }}
            color="#F6CF72"
            transparent
          />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <sphereGeometry args={[1.1, 24, 24]} />
          <meshBasicMaterial
            ref={(material) => {
              if (material) treeGlowMaterials.current[1] = material;
            }}
            color="#7DE2A5"
            transparent
            wireframe
          />
        </mesh>
      </group>
    </group>
  );
}
