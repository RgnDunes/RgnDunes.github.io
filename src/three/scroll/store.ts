export const SCENE_BEATS = [
  "top",
  "about",
  "work-rippling",
  "work-razorpay",
  "work-acciojob",
  "work-airtribe",
  "work-geeksforgeeks",
  "work-correlations",
  "work-taghive",
  "skills",
  "notebook",
  "archive",
  "contact",
] as const;

export type SceneSectionId = (typeof SCENE_BEATS)[number];

export interface SceneScrollState {
  activeIndex: number;
  pointerX: number;
  pointerY: number;
  position: number;
  progress: number;
  pulseId: number;
  reducedMotion: boolean;
  rotationNudge: number;
  velocity: number;
}

const state: SceneScrollState = {
  activeIndex: 0,
  pointerX: 0,
  pointerY: 0,
  position: 0,
  progress: 0,
  pulseId: 0,
  reducedMotion: false,
  rotationNudge: 0,
  velocity: 0,
};

export function getSceneScrollState() {
  return state;
}

export function updateSceneScrollState(next: Partial<SceneScrollState>) {
  Object.assign(state, next);
}

export function triggerScenePulse() {
  state.pulseId += 1;
}

export function nudgeSceneRotation() {
  state.rotationNudge += 1;
}

export function resetSceneScrollState() {
  Object.assign(state, {
    activeIndex: 0,
    pointerX: 0,
    pointerY: 0,
    position: 0,
    progress: 0,
    pulseId: 0,
    reducedMotion: false,
    rotationNudge: 0,
    velocity: 0,
  });
}
