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

function deploymentConduit(count: number) {
  const positions = new Float32Array(count * 3);
  const stages = [-4.8, -1.6, 1.6, 4.8];
  for (let index = 0; index < count; index += 1) {
    const family = index % 5;
    const progress = random(index, 4.4);
    if (family < 3) {
      positions[index * 3] = -5.6 + progress * 11.2;
      positions[index * 3 + 1] = (family - 1) * 0.26;
      positions[index * 3 + 2] =
        Math.sin(progress * Math.PI * 8 + family) * 0.12;
      continue;
    }

    const stage = stages[Math.floor(random(index, 4.8) * stages.length)];
    const angle = progress * Math.PI * 2;
    const radius = family === 3 ? 0.48 : 0.72;
    positions[index * 3] = stage + Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius;
    positions[index * 3 + 2] = (random(index, 5.2) - 0.5) * 0.16;
  }
  return positions;
}

const MODULE_CENTERS = [
  [-3.2, 1.35],
  [0, 1.6],
  [3.2, 1.1],
  [-1.8, -1.35],
  [1.8, -1.45],
] as const;

function nanotechModules(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const moduleIndex = index % MODULE_CENTERS.length;
    const [centerX, centerY] = MODULE_CENTERS[moduleIndex];
    const side = Math.floor(random(index, 10.1) * 6);
    const progress = random(index, 10.5);
    const startAngle = (side / 6) * Math.PI * 2;
    const endAngle = ((side + 1) / 6) * Math.PI * 2;
    const radius = moduleIndex === 0 ? 0.78 : 0.62;
    positions[index * 3] =
      centerX +
      THREE.MathUtils.lerp(
        Math.cos(startAngle) * radius,
        Math.cos(endAngle) * radius,
        progress,
      );
    positions[index * 3 + 1] =
      centerY +
      THREE.MathUtils.lerp(
        Math.sin(startAngle) * radius,
        Math.sin(endAngle) * radius,
        progress,
      );
    positions[index * 3 + 2] =
      (random(index, 10.9) - 0.5) * 0.22 + moduleIndex * 0.035;
  }
  return positions;
}

function projectConstellation(count: number) {
  const positions = new Float32Array(count * 3);
  const nodes = [
    [-3.8, 1.5],
    [3.5, 1.45],
    [-3.2, -1.55],
    [3.7, -1.35],
  ] as const;
  for (let index = 0; index < count; index += 1) {
    const nodeIndex = index % nodes.length;
    const [nodeX, nodeY] = nodes[nodeIndex];
    const progress = random(index, 12.1);
    if (index % 3 === 0) {
      positions[index * 3] = nodeX * progress;
      positions[index * 3 + 1] = nodeY * progress;
      positions[index * 3 + 2] = Math.sin(progress * Math.PI) * 0.18;
    } else {
      const angle = progress * Math.PI * 2;
      const radius = index % 6 === 1 ? 0.56 : 0.34;
      positions[index * 3] = nodeX + Math.cos(angle) * radius;
      positions[index * 3 + 1] = nodeY + Math.sin(angle) * radius;
      positions[index * 3 + 2] = (random(index, 12.7) - 0.5) * 0.12;
    }
  }
  return positions;
}

function cosmicArchive(count: number) {
  const positions = new Float32Array(count * 3);
  const pages = [
    [-4.4, 0.7, -0.5],
    [-1.45, -0.65, 0.1],
    [1.55, 0.65, -0.15],
    [4.45, -0.55, -0.6],
  ] as const;
  for (let index = 0; index < count; index += 1) {
    const pageIndex = index % pages.length;
    const [centerX, centerY, centerZ] = pages[pageIndex];
    const edge = Math.floor(random(index, 14.1) * 4);
    const progress = random(index, 14.5);
    const halfWidth = 0.78;
    const halfHeight = 1.08;
    const corners = [
      [-halfWidth, halfHeight],
      [halfWidth, halfHeight],
      [halfWidth, -halfHeight],
      [-halfWidth, -halfHeight],
    ];
    const start = corners[edge];
    const end = corners[(edge + 1) % corners.length];
    positions[index * 3] =
      centerX + THREE.MathUtils.lerp(start[0], end[0], progress);
    positions[index * 3 + 1] =
      centerY + THREE.MathUtils.lerp(start[1], end[1], progress);
    positions[index * 3 + 2] = centerZ + (random(index, 14.9) - 0.5) * 0.08;
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
    opacity: 0.14,
    size: 1.22,
    target: [0.35, 0, 0],
  },
  {
    id: "about",
    build: deploymentConduit,
    camera: [0.4, 0.2, 7.8],
    color: "#E86A2B",
    drift: 0.22,
    opacity: 0.42,
    size: 0.92,
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
    build: nanotechModules,
    camera: [0, 0.35, 8.2],
    color: "#4FB493",
    drift: 0.18,
    opacity: 0.36,
    size: 0.9,
  },
  {
    id: "notebook",
    build: projectConstellation,
    camera: [0, 0.25, 8.2],
    color: "#F6CF72",
    drift: 0.16,
    opacity: 0.38,
    size: 0.86,
  },
  {
    id: "articles",
    build: cosmicArchive,
    camera: [0.4, 0.2, 8.8],
    color: "#6F8FFF",
    drift: 0.1,
    opacity: 0.28,
    size: 0.86,
  },
  {
    id: "books",
    build: cosmicArchive,
    camera: [-0.5, 0.35, 8.4],
    color: "#E86A2B",
    drift: 0.1,
    opacity: 0.3,
    size: 0.88,
    target: [-0.6, 0, 0],
  },
  {
    id: "testimonials",
    build: cosmicArchive,
    camera: [0.7, -0.2, 7.8],
    color: "#4FB493",
    drift: 0.08,
    opacity: 0.24,
    size: 0.84,
    target: [0.5, 0, 0],
  },
  {
    id: "personal",
    build: inkMotes,
    camera: [0.6, 0.35, 7.4],
    color: "#6FE0AA",
    drift: 0.16,
    opacity: 0.14,
    size: 0.8,
    target: [0.8, 0.2, 0],
  },
  {
    id: "contact",
    build: timelineTree,
    camera: [0, 0.4, 7.2],
    color: "#A7E86D",
    drift: 0.12,
    opacity: 0.36,
    size: 0.94,
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
