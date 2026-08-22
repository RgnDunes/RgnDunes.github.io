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

type LineSegment = readonly [number, number, number, number];

export const REPULSOR_PALM_SEGMENTS: readonly LineSegment[] = [
  [-0.7, -0.15, -0.2, -0.55],
  [-0.2, -0.55, 0.55, -0.6],
  [0.55, -0.6, 1.05, -0.2],
  [1.05, -0.2, 1.15, 0.55],
  [1.15, 0.55, 0.82, 1.8],
  [0.82, 1.8, 0.55, 1.78],
  [0.55, 1.78, 0.52, 0.55],
  [0.52, 0.55, 0.26, 2.15],
  [0.26, 2.15, -0.05, 2.12],
  [-0.05, 2.12, -0.1, 0.55],
  [-0.1, 0.55, -0.4, 1.95],
  [-0.4, 1.95, -0.68, 1.86],
  [-0.68, 1.86, -0.62, 0.42],
  [-0.62, 0.42, -1.02, 1.48],
  [-1.02, 1.48, -1.27, 1.32],
  [-1.27, 1.32, -0.92, -0.18],
  [-0.92, -0.18, -0.7, -0.15],
];

function lineDrawing(
  count: number,
  segments: readonly LineSegment[],
  seed: number,
  depth = 0.18,
) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const segmentIndex = Math.min(
      segments.length - 1,
      Math.floor(random(index, seed) * segments.length),
    );
    const [startX, startY, endX, endY] = segments[segmentIndex];
    const progress = random(index, seed + 0.7);
    const jitter = (random(index, seed + 1.3) - 0.5) * 0.018;
    positions[index * 3] =
      THREE.MathUtils.lerp(startX, endX, progress) + jitter;
    positions[index * 3 + 1] =
      THREE.MathUtils.lerp(startY, endY, progress) + jitter;
    positions[index * 3 + 2] = (random(index, seed + 1.9) - 0.5) * depth;
  }
  return positions;
}

function arcReactor(count: number) {
  const positions = new Float32Array(count * 3);
  const centerX = 3.3;
  for (let index = 0; index < count; index += 1) {
    const family = index % 10;
    const progress = random(index, 20.1);
    const angle = progress * Math.PI * 2;
    let x = 0;
    let y = 0;

    if (family < 6) {
      const ring = family % 3;
      const radius = 0.72 + ring * 0.7;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
    } else if (family < 8) {
      const spoke = Math.floor(random(index, 20.7) * 12);
      const spokeAngle = (spoke / 12) * Math.PI * 2;
      const radius = 0.45 + progress * 1.65;
      x = Math.cos(spokeAngle) * radius;
      y = Math.sin(spokeAngle) * radius;
    } else {
      const side = Math.floor(random(index, 21.1) * 3);
      const points = [
        [0, 0.78],
        [-0.7, -0.54],
        [0.7, -0.54],
      ];
      const start = points[side];
      const end = points[(side + 1) % points.length];
      x = THREE.MathUtils.lerp(start[0], end[0], progress);
      y = THREE.MathUtils.lerp(start[1], end[1], progress);
    }

    positions[index * 3] = centerX + x;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] =
      Math.sin(angle * 2) * 0.12 + (random(index, 21.7) - 0.5) * 0.08;
  }
  return positions;
}

function multiverseRoutes(count: number) {
  const positions = new Float32Array(count * 3);
  const branches = 9;
  for (let index = 0; index < count; index += 1) {
    const branch = Math.floor(random(index, 22.1) * branches);
    const progress = random(index, 22.7);
    const x = -6.4 + progress * 12.8;
    const split = Math.sin(progress * Math.PI);
    const branchOffset = (branch - (branches - 1) / 2) * 0.31;
    const rejoin = Math.pow(split, 0.72);
    positions[index * 3] = x;
    positions[index * 3 + 1] =
      branchOffset * rejoin + Math.sin(progress * Math.PI * 3 + branch) * 0.08;
    positions[index * 3 + 2] =
      Math.cos(progress * Math.PI * 2 + branch * 0.7) *
      rejoin *
      (0.14 + branch * 0.025);
  }
  return positions;
}

function repulsorPalm(count: number) {
  const positions = lineDrawing(count, REPULSOR_PALM_SEGMENTS, 23.1, 0.22);
  for (let index = 0; index < count; index += 1) {
    positions[index * 3] += 2.2;

    if (index % 4 === 0) {
      const progress = random(index, 23.5);
      positions[index * 3] = -6.4 + progress * 7.9;
      positions[index * 3 + 1] =
        (index % 8 === 0 ? -0.14 : 0.14) + (random(index, 23.6) - 0.5) * 0.035;
      positions[index * 3 + 2] = 0.02;
    }

    if (index % 14 === 0) {
      const angle = random(index, 23.7) * Math.PI * 2;
      const radius = 0.22 + (index % 28 === 0 ? 0.24 : 0);
      positions[index * 3] = 2.2 + Math.cos(angle) * radius;
      positions[index * 3 + 1] = Math.sin(angle) * radius;
      positions[index * 3 + 2] = 0.08;
    }
  }
  return positions;
}

function webLattice(count: number) {
  const positions = new Float32Array(count * 3);
  const centerX = 1.2;
  const centerY = 0.2;
  for (let index = 0; index < count; index += 1) {
    const family = index % 3;
    const progress = random(index, 24.1);
    const spoke = Math.floor(random(index, 24.7) * 13);
    const angle = (spoke / 13) * Math.PI * 2 + 0.18;
    let radius: number;
    if (family === 0) {
      radius = progress * 4.3;
    } else {
      const ring = 1 + Math.floor(random(index, 25.3) * 7);
      radius = ring * 0.58 + Math.sin(angle * 3) * ring * 0.035;
    }
    positions[index * 3] = centerX + Math.cos(angle) * radius * 1.25;
    positions[index * 3 + 1] = centerY + Math.sin(angle) * radius * 0.72;
    positions[index * 3 + 2] =
      Math.sin(angle * 2 + radius) * 0.2 + (random(index, 25.9) - 0.5) * 0.08;
  }
  return positions;
}

function timekeeperCrown(count: number) {
  const segments: LineSegment[] = [
    [-1.45, -2.2, -1.75, -0.5],
    [-1.75, -0.5, -1.55, 0.65],
    [-1.55, 0.65, -2.5, 1.55],
    [-2.5, 1.55, -3.15, 3.25],
    [-3.15, 3.25, -3.05, 1.4],
    [-3.05, 1.4, -1.8, 0.05],
    [-1.8, 0.05, -1.2, 1.4],
    [-1.2, 1.4, 0, 1.72],
    [0, 1.72, 1.2, 1.4],
    [1.2, 1.4, 1.8, 0.05],
    [1.8, 0.05, 3.05, 1.4],
    [3.05, 1.4, 3.15, 3.25],
    [3.15, 3.25, 2.5, 1.55],
    [2.5, 1.55, 1.55, 0.65],
    [1.55, 0.65, 1.75, -0.5],
    [1.75, -0.5, 1.45, -2.2],
    [1.45, -2.2, 0.65, -2.7],
    [0.65, -2.7, -0.65, -2.7],
    [-0.65, -2.7, -1.45, -2.2],
    [-0.82, -0.55, -0.25, -0.42],
    [0.82, -0.55, 0.25, -0.42],
  ];
  return lineDrawing(count, segments, 26.1, 0.28);
}

function inkMotes(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const radius = Math.pow(random(index, 1.3), 0.72) * 6.8;
    const angle = random(index, 2.7) * Math.PI * 2;
    const wave = Math.sin(angle * 2.4) * 0.45;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = wave + (random(index, 3.1) - 0.5) * 1.4;
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
      Math.sin(z * 0.65 + ribbon) * 0.75 + (random(index, 5.2) - 0.5) * 0.24;
    positions[index * 3 + 1] = y + Math.cos(z * 0.4 + ribbon) * 0.2;
    positions[index * 3 + 2] = z;
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

function timelineTree(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const path = random(index, 18.1);
    if (path < 0.28) {
      const progress = random(index, 18.3);
      positions[index * 3] =
        Math.sin(progress * Math.PI * 3) * 0.16 +
        (random(index, 18.5) - 0.5) * 0.2;
      positions[index * 3 + 1] = -3.4 + progress * 5.2;
      positions[index * 3 + 2] = (random(index, 18.7) - 0.5) * 0.26;
      continue;
    }

    const branch = Math.floor(random(index, 18.9) * 11);
    const side = branch % 2 === 0 ? -1 : 1;
    const level = Math.floor(branch / 2);
    const progress = random(index, 19.1);
    const originY = -0.2 + level * 0.38;
    const reach = 1.4 + level * 0.48 + random(index, 19.3) * 0.8;
    const curl = Math.sin(progress * Math.PI) * (0.25 + level * 0.08);
    positions[index * 3] =
      side * progress * reach +
      side * curl +
      (random(index, 19.5) - 0.5) * 0.18;
    positions[index * 3 + 1] =
      originY +
      progress * (1.35 + level * 0.17) +
      (random(index, 19.7) - 0.5) * 0.16;
    positions[index * 3 + 2] =
      Math.sin(progress * Math.PI * (1.5 + level * 0.12)) *
        side *
        (0.25 + level * 0.1) +
      (random(index, 19.9) - 0.5) * 0.14;
  }
  return positions;
}

const SPECS: FormationSpec[] = [
  {
    id: "top",
    build: arcReactor,
    camera: [0, 0.15, 8.8],
    color: "#F6CF72",
    drift: 0.38,
    opacity: 0.94,
    size: 1.38,
    target: [0.35, 0, 0],
  },
  {
    id: "about",
    build: pipelineRibbons,
    camera: [0.4, 0.35, 6.6],
    color: "#E86A2B",
    drift: 1,
    opacity: 0.72,
    size: 1.14,
  },
  {
    id: "work-rippling",
    build: multiverseRoutes,
    camera: [-5.8, 1.4, 5.4],
    color: "#E86A2B",
    drift: 0.55,
    opacity: 0.22,
    size: 0.94,
    target: [-5.2, 0.1, 0],
  },
  {
    id: "work-razorpay",
    build: multiverseRoutes,
    camera: [-3.8, -0.1, 4.7],
    color: "#6F8FFF",
    drift: 0.5,
    opacity: 0.2,
    size: 0.92,
    target: [-3.4, 0.8, 0],
  },
  {
    id: "work-acciojob",
    build: multiverseRoutes,
    camera: [-1.8, 1.1, 4.4],
    color: "#4FB493",
    drift: 0.48,
    opacity: 0.2,
    size: 0.9,
    target: [-1.6, 1.0, 0],
  },
  {
    id: "work-airtribe",
    build: multiverseRoutes,
    camera: [0.2, 1.7, 4.6],
    color: "#E86A2B",
    drift: 0.46,
    opacity: 0.19,
    size: 0.9,
    target: [0.2, 1.0, 0],
  },
  {
    id: "work-correlations",
    build: multiverseRoutes,
    camera: [2.3, 1.3, 4.5],
    color: "#4FB493",
    drift: 0.42,
    opacity: 0.19,
    size: 0.88,
    target: [2.2, 0.5, 0],
  },
  {
    id: "work-geeksforgeeks",
    build: multiverseRoutes,
    camera: [4.2, 0.5, 4.7],
    color: "#6F8FFF",
    drift: 0.4,
    opacity: 0.18,
    size: 0.88,
    target: [4.0, -0.3, 0],
  },
  {
    id: "work-taghive",
    build: multiverseRoutes,
    camera: [6.0, -0.1, 5.2],
    color: "#E86A2B",
    drift: 0.38,
    opacity: 0.18,
    size: 0.86,
    target: [5.5, -1.1, 0],
  },
  {
    id: "skills",
    build: skillLattice,
    camera: [0, 0.7, 7.2],
    color: "#4FB493",
    drift: 0.65,
    opacity: 0.64,
    size: 1.08,
  },
  {
    id: "notebook",
    build: repulsorPalm,
    camera: [0, 2.7, 7.6],
    color: "#F6CF72",
    drift: 0.24,
    opacity: 0.7,
    size: 0.86,
    target: [-0.4, 0.35, 0],
  },
  {
    id: "articles",
    build: webLattice,
    camera: [0.5, 0.25, 8.4],
    color: "#6F8FFF",
    drift: 0.2,
    opacity: 0.58,
    size: 1.02,
  },
  {
    id: "books",
    build: (count) => pagePlanes(count, 14.7),
    camera: [-0.8, 0.5, 7.4],
    color: "#E86A2B",
    drift: 0.24,
    opacity: 0.52,
    size: 1.04,
    target: [-0.6, 0, 0],
  },
  {
    id: "testimonials",
    build: (count) => inkMotes(count),
    camera: [0.7, -0.2, 7.8],
    color: "#4FB493",
    drift: 0.2,
    opacity: 0.58,
    size: 1.04,
    target: [0.5, 0, 0],
  },
  {
    id: "personal",
    build: timekeeperCrown,
    camera: [0.6, 0.35, 7.4],
    color: "#6FE0AA",
    drift: 0.16,
    opacity: 0.88,
    size: 1.24,
    target: [0.8, 0.2, 0],
  },
  {
    id: "contact",
    build: timelineTree,
    camera: [0, 0.4, 7.2],
    color: "#A7E86D",
    drift: 0.12,
    opacity: 0.92,
    size: 1.36,
    target: [0, 0.5, 0],
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
