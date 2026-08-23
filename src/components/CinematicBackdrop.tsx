"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { withBasePath } from "@/lib/site";
import { getSceneScrollState } from "@/three/scroll/store";

const SHOTS = [
  {
    activeSection: "top",
    className: "is-iron-man",
    end: 0.72,
    feather: 0.34,
    src: withBasePath("/assets/cinematic-reel/iron-man-reactor.webp"),
    start: 0,
    travelX: -18,
    travelY: -12,
  },
  {
    activeSection: "about",
    className: "is-loki-timeline",
    end: 1.34,
    feather: 0.3,
    src: withBasePath("/assets/cinematic-reel/loki-timeline.webp"),
    start: 0.72,
    travelX: 22,
    travelY: -8,
  },
  {
    activeSection: "work",
    className: "is-captain-resolve",
    end: 4.7,
    feather: 0.68,
    src: withBasePath("/assets/cinematic-reel/captain-america-resolve.webp"),
    start: 1.45,
    travelX: -12,
    travelY: -24,
  },
  {
    activeSection: "work",
    className: "is-captain-mjolnir",
    end: 8.28,
    feather: 0.68,
    src: withBasePath("/assets/cinematic-reel/captain-america-mjolnir.webp"),
    start: 5.38,
    travelX: 12,
    travelY: -20,
  },
  {
    activeSection: "skills",
    className: "is-spider-web",
    end: 9.28,
    feather: 0.26,
    src: withBasePath("/assets/cinematic-reel/spider-man-web.webp"),
    start: 8.72,
    travelX: -10,
    travelY: -16,
  },
  {
    activeSection: "notebook",
    className: "is-wolverine-deadpool",
    end: 10.3,
    feather: 0.28,
    src: withBasePath("/assets/cinematic-reel/wolverine-deadpool.webp"),
    start: 9.7,
    travelX: 20,
    travelY: -10,
  },
  {
    activeSection: "articles",
    className: "is-loki-throne is-reading",
    end: 11.3,
    feather: 0.28,
    src: withBasePath("/assets/cinematic-reel/loki-throne.webp"),
    start: 10.7,
    travelX: -12,
    travelY: -6,
  },
  {
    activeSection: "books",
    className: "is-loki-throne is-books",
    end: 12.3,
    feather: 0.28,
    src: withBasePath("/assets/cinematic-reel/loki-throne.webp"),
    start: 11.7,
    travelX: 12,
    travelY: -6,
  },
  {
    activeSection: "testimonials",
    className: "is-red-hulk",
    end: 13.3,
    feather: 0.28,
    src: withBasePath("/assets/cinematic-reel/red-hulk.webp"),
    start: 12.7,
    travelX: -10,
    travelY: -16,
  },
  {
    activeSection: "personal",
    className: "is-wolverine-deadpool is-personal",
    end: 14.34,
    feather: 0.32,
    src: withBasePath("/assets/cinematic-reel/wolverine-deadpool.webp"),
    start: 13.66,
    travelX: 24,
    travelY: -12,
  },
  {
    activeSection: "contact",
    className: "is-loki-throne is-finale",
    end: 15.2,
    feather: 0.38,
    src: withBasePath("/assets/cinematic-reel/loki-throne.webp"),
    start: 14.62,
    travelX: 0,
    travelY: 12,
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
  const shotRefs = useRef<Array<HTMLImageElement | null>>([]);
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

    const render = () => {
      const scroll = getSceneScrollState();
      const compact = window.innerWidth < 768;

      SHOTS.forEach((shot, index) => {
        const element = shotRefs.current[index];
        if (!element) return;

        const samplePosition = scroll.reducedMotion
          ? (shot.start + shot.end) / 2
          : scroll.position;
        const opacity =
          activeSectionRef.current === shot.activeSection
            ? windowOpacity(samplePosition, shot.start, shot.end, shot.feather)
            : 0;
        const progress = scroll.reducedMotion
          ? 0.5
          : clamp(
              (scroll.position - shot.start) /
                Math.max(0.01, shot.end - shot.start),
            );
        const timelineOffset = progress - 0.5;
        const pointerX = compact || scroll.reducedMotion ? 0 : scroll.pointerX;
        const pointerY = compact || scroll.reducedMotion ? 0 : scroll.pointerY;
        const x = timelineOffset * shot.travelX + pointerX * -7;
        const y = timelineOffset * shot.travelY + pointerY * -4;
        const scale = scroll.reducedMotion ? 1.055 : 1.04 + progress * 0.035;

        element.style.opacity = opacity.toFixed(3);
        element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
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
          <Image
            key={`${shot.activeSection}-${shot.className}`}
            ref={(element) => {
              shotRefs.current[index] = element;
            }}
            className={`cinematic-shot ${shot.className}`}
            src={shot.src}
            alt=""
            decoding="async"
            fill
            priority={index === 0}
            sizes="100vw"
            unoptimized
          />
        ))}
      </div>
    </div>
  );
}
