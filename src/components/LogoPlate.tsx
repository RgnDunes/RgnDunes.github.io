"use client";

import Image, { StaticImageData } from "next/image";

interface Props {
  src: string | StaticImageData;
  alt: string;
  /** Visual size in px (renders inside a square plate). */
  size?: number;
  /** Padding around the logo (px). Higher = more air = shows less of the raw background. */
  pad?: number;
  /** Tile background: "paper" (default), "paper-2", or "white" for logos that need a white matte. */
  surface?: "paper" | "paper-2" | "white";
  className?: string;
}

/**
 * A consistent frame for third-party logos. Neutralizes each logo's own
 * bounding box (solid squares, baked-in white cards) by:
 *
 *   1. Sitting the logo inside a paper-toned plate with a hair rule
 *   2. Padding generously so the logo reads as a mark, not an upload
 *   3. Applying a soft inset shadow so the plate has physical weight
 */
export default function LogoPlate({
  src,
  alt,
  size = 44,
  pad = 8,
  surface = "paper",
  className = "",
}: Props) {
  const bg =
    surface === "white"
      ? "rgb(255, 255, 255)"
      : surface === "paper-2"
      ? "rgb(var(--paper-2))"
      : "rgb(var(--paper))";

  return (
    <span
      className={`relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-rule ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(20,20,22,0.04)",
      }}
    >
      <span
        className="relative"
        style={{ width: size - pad * 2, height: size - pad * 2 }}
      >
        <Image src={src} alt={alt} fill sizes={`${size}px`} className="object-contain" />
      </span>
    </span>
  );
}
