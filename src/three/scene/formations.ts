import * as THREE from "three";
import type { SceneSectionId } from "../scroll/store";

export interface Formation {
  camera: THREE.Vector3;
  color: THREE.Color;
  drift: number;
  id: SceneSectionId;
  opacity: number;
  positions: Float32Array;
  size: number;
  target: THREE.Vector3;
}

interface FormationSpec {
  build: (count: number) => Float32Array;
  camera: [number, number, number];
  color: string;
  drift: number;
  id: SceneSectionId;
  opacity: number;
  size: number;
  target?: [number, number, number];
}

function random(index: number, seed: number) {
  const value = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function inkMotes(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const radius = Math.pow(random(index, 1.3), 0.72) * 6.8;
    const angle = random(index, 2.7) * Math.PI * 2;
    const wave = Math.sin(angle * 2.4) * 0.45;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] =
      wave + (random(index, 3.1) - 0.5) * 1.4;
    positions[index * 3 + 2] = Math.sin(angle) * radius * 0.68;
  }
  return positions;
}

function pipelineRibbons(count: number) {
  const positions = new Float32Array(count * 3);
  const ribbons = 7;
  for (let index = 0; index < count; index += 1) {
    const ribbon = index % ribbons;
    const z = (random(index, 4.4) - 0.5) * 22;
    const y = (ribbon / (ribbons - 1) - 0.5) * 4.2;
    positions[index * 3] =
      Math.sin(z * 0.65 + ribbon) * 0.75 +
      (random(index, 5.2) - 0.5) * 0.24;
    positions[index * 3 + 1] =
      y + Math.cos(z * 0.4 + ribbon) * 0.2;
    positions[index * 3 + 2] = z;
  }
  return positions;
}

function workRoute(count: number) {
  const positions = new Float32Array(count * 3);
  const nodeCount = 6;
  for (let index = 0; index < count; index += 1) {
    const node = Math.min(
      nodeCount - 1,
      Math.floor(random(index, 6.1) * nodeCount)
    );
    const nodeProgress = node / (nodeCount - 1);
    const nodeX = (nodeProgress - 0.5) * 13;
    const nodeY = Math.sin(nodeProgress * Math.PI * 1.7) * 1.5 - 0.4;
    const nodeZ = Math.cos(nodeProgress * Math.PI) * 1.3;

    if (index % 3 === 0) {
      const routeProgress = random(index, 7.3) * (nodeCount - 1);
      const routeNode = Math.floor(routeProgress);
      const mix = routeProgress - routeNode;
      const nextProgress = Math.min(nodeCount - 1, routeNode + 1) /
        (nodeCount - 1);
      const startProgress = routeNode / (nodeCount - 1);
      positions[index * 3] =
        (startProgress + (nextProgress - startProgress) * mix - 0.5) * 13;
      positions[index * 3 + 1] =
        Math.sin(
          (startProgress + (nextProgress - startProgress) * mix) *
            Math.PI *
            1.7
        ) * 1.5 -
        0.4 +
        (random(index, 7.8) - 0.5) * 0.18;
      positions[index * 3 + 2] =
        Math.cos(
          (startProgress + (nextProgress - startProgress) * mix) * Math.PI
        ) * 1.3;
    } else {
      const radius = Math.pow(random(index, 8.4), 1.8) * 0.95;
      const angle = random(index, 8.9) * Math.PI * 2;
      positions[index * 3] = nodeX + Math.cos(angle) * radius;
      positions[index * 3 + 1] =
        nodeY + (random(index, 9.4) - 0.5) * radius;
      positions[index * 3 + 2] = nodeZ + Math.sin(angle) * radius;
    }
  }
  return positions;
}

function skillLattice(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const radius = 2.8 + (random(index, 10.1) - 0.5) * 0.7;
    const theta = random(index, 10.5) * Math.PI * 2;
    const phi = Math.acos(1 - 2 * random(index, 10.9));
    const lattice = index % 5 === 0 ? 0.74 : 1;
    positions[index * 3] =
      Math.round(radius * Math.sin(phi) * Math.cos(theta) * lattice * 3) / 3;
    positions[index * 3 + 1] =
      Math.round(radius * Math.cos(phi) * lattice * 3) / 3;
    positions[index * 3 + 2] =
      Math.round(radius * Math.sin(phi) * Math.sin(theta) * lattice * 3) / 3;
  }
  return positions;
}

function deployField(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const x = (random(index, 11.4) - 0.5) * 15;
    const z = (random(index, 11.8) - 0.5) * 11;
    positions[index * 3] = x;
    positions[index * 3 + 1] =
      Math.sin(x * 0.7) * 0.18 + (random(index, 12.2) - 0.5) * 0.25 - 1;
    positions[index * 3 + 2] = z;
  }
  return positions;
}

function pagePlanes(count: number, seed: number) {
  const positions = new Float32Array(count * 3);
  const planes = 4;
  for (let index = 0; index < count; index += 1) {
    const plane = index % planes;
    const x = (random(index, seed) - 0.5) * 8;
    const y = (random(index, seed + 0.4) - 0.5) * 4.8;
    positions[index * 3] = x + (plane - 1.5) * 1.2;
    positions[index * 3 + 1] = y + (plane % 2 === 0 ? 0.8 : -0.8);
    positions[index * 3 + 2] =
      (random(index, seed + 0.8) - 0.5) * 0.18 + (plane - 1.5) * 1.4;
  }
  return positions;
}

function testimonyHalo(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const angle = random(index, 16.1) * Math.PI * 2;
    const radius = 2.8 + (random(index, 16.4) - 0.5) * 1.2;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius * 0.7;
    positions[index * 3 + 2] = (random(index, 16.8) - 0.5) * 3;
  }
  return positions;
}

function finalLight(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const radius = Math.pow(random(index, 17.2), 3.4) * 3.1;
    const theta = random(index, 17.6) * Math.PI * 2;
    const phi = Math.acos(1 - 2 * random(index, 17.9));
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.cos(phi);
    positions[index * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  return positions;
}

const SPECS: FormationSpec[] = [
  {
    id: "top",
    build: inkMotes,
    camera: [0, 0.25, 7.6],
    color: "#141416",
    drift: 0.8,
    opacity: 0.16,
    size: 0.9,
  },
  {
    id: "about",
    build: pipelineRibbons,
    camera: [0, 0.5, 8.6],
    color: "#B25022",
    drift: 1,
    opacity: 0.14,
    size: 0.92,
  },
  {
    id: "work",
    build: workRoute,
    camera: [0, 1, 9.6],
    color: "#E86A2B",
    drift: 0.55,
    opacity: 0.18,
    size: 1.05,
  },
  {
    id: "skills",
    build: skillLattice,
    camera: [0, 0.7, 8.8],
    color: "#27584A",
    drift: 0.65,
    opacity: 0.17,
    size: 0.9,
  },
  {
    id: "notebook",
    build: deployField,
    camera: [0, 2.7, 9.7],
    color: "#B25022",
    drift: 0.45,
    opacity: 0.16,
    size: 0.86,
    target: [0, -1, 0],
  },
  {
    id: "products",
    build: (count) => pagePlanes(count, 13.1),
    camera: [0, 0.25, 10.4],
    color: "#141416",
    drift: 0.35,
    opacity: 0.12,
    size: 0.8,
  },
  {
    id: "writing",
    build: (count) => pagePlanes(count, 14.7),
    camera: [0, 0.15, 10.8],
    color: "#27584A",
    drift: 0.28,
    opacity: 0.1,
    size: 0.76,
  },
  {
    id: "testimonials",
    build: testimonyHalo,
    camera: [0, 0.2, 9.6],
    color: "#27584A",
    drift: 0.25,
    opacity: 0.13,
    size: 0.84,
  },
  {
    id: "contact",
    build: finalLight,
    camera: [0, 0.1, 7.7],
    color: "#E86A2B",
    drift: 0.15,
    opacity: 0.24,
    size: 1.05,
  },
];

export function buildFormations(count: number) {
  return SPECS.map<Formation>((spec) => ({
    camera: new THREE.Vector3(...spec.camera),
    color: new THREE.Color(spec.color),
    drift: spec.drift,
    id: spec.id,
    opacity: spec.opacity,
    positions: spec.build(count),
    size: spec.size,
    target: new THREE.Vector3(...(spec.target ?? [0, 0, 0])),
  }));
}
