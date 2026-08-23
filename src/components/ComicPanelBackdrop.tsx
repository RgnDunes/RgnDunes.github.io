"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { getSceneScrollState } from "@/three/scroll/store";

const PANELS = [
  {
    activeSection: "top",
    className: "is-armored",
    end: 1.2,
    feather: 0.42,
    src: "/assets/comic-panels/armored-engineer.svg",
    start: 0,
  },
  {
    activeSection: "work",
    className: "is-timekeeper",
    end: 8.12,
    feather: 0.34,
    src: "/assets/comic-panels/timekeeper-tree.svg",
    start: 1,
  },
  {
    activeSection: "notebook",
    className: "is-acrobat",
    end: 10.8,
    feather: 0.2,
    src: "/assets/comic-panels/network-acrobat.svg",
    start: 9.4,
  },
  {
    activeSection: "contact",
    className: "is-finale",
    end: 15.2,
    feather: 0.44,
    src: "/assets/comic-panels/timekeeper-tree.svg",
    start: 14.05,
  },
] as const;

function smoothstep(value: number, edge0: number, edge1: number) {
  const progress = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
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

export default function ComicPanelBackdrop() {
  const panelRefs = useRef<Array<HTMLImageElement | null>>([]);
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

    ["top", "work", "notebook", "contact"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    const render = () => {
      const scroll = getSceneScrollState();
      const position = scroll.position;
      const compact = window.innerWidth < 768;

      PANELS.forEach((panel, index) => {
        const element = panelRefs.current[index];
        if (!element) return;

        const opacity =
          activeSectionRef.current === panel.activeSection
            ? windowOpacity(
                scroll.reducedMotion ? panel.start : position,
                panel.start,
                panel.end,
                panel.feather,
              )
            : 0;
        const travel = scroll.reducedMotion
          ? 0
          : Math.min(1, Math.max(-1, position - panel.start));
        const x = compact ? 0 : scroll.pointerX * -7;
        const y = scroll.reducedMotion
          ? 0
          : travel * -10 + scroll.pointerY * -4;
        const scale = 1.035 + opacity * 0.015;

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
    <div className="comic-panel-backdrop" aria-hidden="true">
      {PANELS.map((panel, index) => (
        <Image
          key={`${panel.className}-${panel.start}`}
          ref={(element) => {
            panelRefs.current[index] = element;
          }}
          className={`comic-panel ${panel.className}`}
          src={panel.src}
          alt=""
          decoding="async"
          fill
          priority={index === 0}
          sizes="100vw"
          unoptimized
        />
      ))}
    </div>
  );
}
