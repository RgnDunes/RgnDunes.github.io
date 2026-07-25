import { TILE } from "./landmarks";

/** Half of the isometric tile diamond width & height (in px). */
export const ISO = {
  halfW: TILE, // 44 → tile diamond is 88 wide
  halfH: TILE / 2, // 22 → tile diamond is 44 tall
};

/**
 * Project a world (tile-space) coordinate to screen (px) coordinates.
 * The world's tile (0,0) sits at origin (0,0) in screen space; callers
 * translate the whole scene when following the reader.
 */
export function project(tx: number, ty: number) {
  return {
    x: (tx - ty) * ISO.halfW,
    y: (tx + ty) * ISO.halfH,
  };
}

/** Inverse projection — screen (px) → tile-space. Used for tap-to-move. */
export function unproject(sx: number, sy: number) {
  return {
    x: (sx / ISO.halfW + sy / ISO.halfH) / 2,
    y: (sy / ISO.halfH - sx / ISO.halfW) / 2,
  };
}
