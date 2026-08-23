"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { withBasePath } from "@/lib/site";
import { getSceneScrollState } from "@/three/scroll/store";

const CROSSFADE = 0.42;

const SHOTS = [
  {
    activeSection: "top",
    className: "is-iron-man",
    end: 0.58,
    feather: CROSSFADE,
    src: withBasePath("/assets/cinematic-reel/iron-man-reactor.webp"),
    start: 0,
    travelX: -18,
    travelY: -12,
    zoom: 1.02,
  },
  {
    activeSection: "about",
    className: "is-loki-timeline",
    end: 1.58,
    feather: CROSSFADE,
    src: withBasePath("/assets/cinematic-reel/loki-timeline.webp"),
    start: 1,
    travelX: 22,
    travelY: -8,
    zoom: 1.04,
  },
  {
    activeSection: "work",
    className: "is-captain-resolve",
    end: 4.58,
    feather: CROSSFADE,
    src: withBasePath("/assets/cinematic-reel/captain-america-resolve.webp"),
    start: 2,
    travelX: -12,
    travelY: -24,
    zoom: 1.04,
  },
  {
    activeSection: "work",
    className: "is-captain-mjolnir",
    end: 8.58,
    feather: CROSSFADE,
    skipReducedMotion: true,
    src: withBasePath("/assets/cinematic-reel/captain-america-mjolnir.webp"),
    start: 5,
    travelX: 12,
    travelY: -20,
    zoom: 1.04,
  },
  {
    activeSection: "skills",
    className: "is-spider-web",
    end: 9.58,
    feather: CROSSFADE,
    src: withBasePath("/assets/cinematic-reel/spider-man-web.webp"),
    start: 9,
    travelX: -10,
    travelY: -16,
    zoom: 1.03,
  },
  {
    activeSection: "notebook",
    className: "is-wolverine-deadpool",
    end: 10.58,
    feather: CROSSFADE,
    src: withBasePath("/assets/cinematic-reel/wolverine-deadpool.webp"),
    start: 10,
    travelX: 20,
    travelY: -10,
    zoom: 1.04,
  },
  {
    activeSection: "articles",
    className: "is-loki-throne is-reading",
    end: 11.58,
    feather: CROSSFADE,
    src: withBasePath("/assets/cinematic-reel/loki-throne.webp"),
    start: 11,
    travelX: -12,
    travelY: -6,
    zoom: 1.03,
  },
  {
    activeSection: "books",
    className: "is-loki-throne is-books",
    end: 12.58,
    feather: CROSSFADE,
    src: withBasePath("/assets/cinematic-reel/loki-throne.webp"),
    start: 12,
    travelX: 12,
    travelY: -6,
    zoom: 1.03,
  },
  {
    activeSection: "testimonials",
    className: "is-red-hulk",
    end: 13.58,
    feather: CROSSFADE,
    src: withBasePath("/assets/cinematic-reel/red-hulk.webp"),
    start: 13,
    travelX: -10,
    travelY: -16,
    zoom: 1.03,
  },
  {
    activeSection: "personal",
    className: "is-wolverine-deadpool is-personal",
    end: 14.58,
    feather: CROSSFADE,
    src: withBasePath("/assets/cinematic-reel/wolverine-deadpool.webp"),
    start: 14,
    travelX: 24,
    travelY: -12,
    zoom: 1.04,
  },
  {
    activeSection: "contact",
    className: "is-loki-throne is-finale",
    end: 15.2,
    feather: CROSSFADE,
    src: withBasePath("/assets/cinematic-reel/loki-throne.webp"),
    start: 15,
    travelX: 0,
    travelY: 12,
    zoom: 1.05,
  },
] as const;

const OBSERVED_SECTIONS = Array.from(
  new Set(SHOTS.map((shot) => shot.activeSection)),
);

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothstep(value: number, edge0: number, edge1: number) {
  const progress = clamp((value - edge0) / (edge1 - edge0));
  return progress * progress * (3 - 2 * progress);
}

function windowOpacity(
  position: number,
  start: number,
  end: number,
  feather: number,
) {
  const enter = smoothstep(position, start - feather, start);
  const leave = 1 - smoothstep(position, end, end + feather);
  return enter * leave;
}

export default function CinematicBackdrop() {
  const shotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeSectionRef = useRef("top");

  useEffect(() => {
    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible?.target.id) {
          activeSectionRef.current = visible.target.id;
          return;
        }

        if (
          entries.some((entry) => entry.target.id === activeSectionRef.current)
        ) {
          activeSectionRef.current = "";
        }
      },
      { rootMargin: "-42% 0px -42%", threshold: 0 },
    );

    OBSERVED_SECTIONS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    const render = (time: number) => {
      const scroll = getSceneScrollState();
      const compact = window.innerWidth < 768;

      SHOTS.forEach((shot, index) => {
        const element = shotRefs.current[index];
        if (!element) return;

        const opacity = scroll.reducedMotion
          ? activeSectionRef.current === shot.activeSection &&
            !("skipReducedMotion" in shot)
            ? 1
            : 0
          : windowOpacity(scroll.position, shot.start, shot.end, shot.feather);
        const progress = scroll.reducedMotion
          ? 0.5
          : clamp(
              (scroll.position - shot.start) /
                Math.max(0.01, shot.end - shot.start),
            );
        const timelineOffset = progress - 0.5;
        const pointerX = compact || scroll.reducedMotion ? 0 : scroll.pointerX;
        const pointerY = compact || scroll.reducedMotion ? 0 : scroll.pointerY;
        const motionFactor = scroll.reducedMotion ? 0 : compact ? 0.45 : 1;
        const idlePhase = time * 0.00032 + index * 1.37;
        const idleX = Math.sin(idlePhase) * 10 * motionFactor;
        const idleY = Math.cos(idlePhase * 0.83 + 0.7) * 7 * motionFactor;
        const idleScale =
          (Math.sin(idlePhase * 0.61 + 1.2) + 1) * 0.006 * motionFactor;
        const idleRotation = Math.sin(idlePhase * 0.47) * 0.18 * motionFactor;
        const x = timelineOffset * shot.travelX + pointerX * -7 + idleX;
        const y = timelineOffset * shot.travelY + pointerY * -4 + idleY;
        const enterProgress = scroll.reducedMotion
          ? 1
          : smoothstep(scroll.position, shot.start - shot.feather, shot.start);
        const exitProgress = scroll.reducedMotion
          ? 0
          : smoothstep(scroll.position, shot.end, shot.end + shot.feather);
        const baseScale = compact ? Math.max(1, shot.zoom - 0.02) : shot.zoom;
        const transitionScale = (1 - enterProgress) * 0.1 + exitProgress * 0.14;
        const scale = baseScale + transitionScale + idleScale;

        element.style.opacity = opacity.toFixed(3);
        element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotateZ(${idleRotation.toFixed(3)}deg) scale(${scale.toFixed(3)})`;
        element.style.visibility = opacity > 0.005 ? "visible" : "hidden";
      });

      frame = window.requestAnimationFrame(render);
    };

    frame = window.requestAnimationFrame(render);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="cinematic-backdrop" aria-hidden="true">
      <div className="cinematic-reel">
        {SHOTS.map((shot, index) => (
          <div
            key={`${shot.activeSection}-${shot.className}`}
            ref={(element) => {
              shotRefs.current[index] = element;
            }}
            className={`cinematic-shot ${shot.className}`}
          >
            <Image
              className="cinematic-shot-media"
              src={shot.src}
              alt=""
              decoding="async"
              fill
              priority={index === 0}
              sizes="100vw"
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}
