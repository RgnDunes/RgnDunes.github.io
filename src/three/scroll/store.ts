export const SCENE_SECTIONS = [
  "top",
  "about",
  "work",
  "skills",
  "notebook",
  "products",
  "writing",
  "testimonials",
  "contact",
] as const;

export type SceneSectionId = (typeof SCENE_SECTIONS)[number];

export interface SceneScrollState {
  activeIndex: number;
  pointerX: number;
  pointerY: number;
  position: number;
  progress: number;
  reducedMotion: boolean;
  velocity: number;
}

const state: SceneScrollState = {
  activeIndex: 0,
  pointerX: 0,
  pointerY: 0,
  position: 0,
  progress: 0,
  reducedMotion: false,
  velocity: 0,
};

export function getSceneScrollState() {
  return state;
}

export function updateSceneScrollState(next: Partial<SceneScrollState>) {
  Object.assign(state, next);
}

export function resetSceneScrollState() {
  Object.assign(state, {
    activeIndex: 0,
    pointerX: 0,
    pointerY: 0,
    position: 0,
    progress: 0,
    reducedMotion: false,
    velocity: 0,
  });
}
