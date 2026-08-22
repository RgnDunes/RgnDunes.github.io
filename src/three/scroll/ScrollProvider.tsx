"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useDeviceProfile } from "@/hooks/useDeviceProfile";
import {
  resetSceneScrollState,
  SCENE_BEATS,
  triggerScenePulse,
  updateSceneScrollState,
} from "./store";

gsap.registerPlugin(ScrollTrigger);

function interpolateSectionPosition(scrollY: number, stops: number[]) {
  if (stops.length < 2 || scrollY <= stops[0]) return 0;

  const last = stops.length - 1;
  if (scrollY >= stops[last]) return last;

  for (let index = 0; index < last; index += 1) {
    const start = stops[index];
    const end = stops[index + 1];
    if (scrollY <= end) {
      return index + (scrollY - start) / Math.max(1, end - start);
    }
  }

  return last;
}

export default function ScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = useDeviceProfile();

  useEffect(() => {
    updateSceneScrollState({ reducedMotion: profile.reducedMotion });
  }, [profile.reducedMotion]);

  useEffect(() => {
    if (profile.coarsePointer || profile.reducedMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      updateSceneScrollState({
        pointerX: (event.clientX / window.innerWidth) * 2 - 1,
        pointerY: (event.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [profile.coarsePointer, profile.reducedMotion]);

  useEffect(() => {
    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    const useSmoothScroll = !profile.coarsePointer && !profile.reducedMotion;
    const lenis = useSmoothScroll
      ? new Lenis({
          anchors: false,
          duration: 1.1,
          easing: (value) => 1 - Math.pow(1 - value, 3),
          smoothWheel: true,
        })
      : null;

    const tickLenis = (time: number) => lenis?.raf(time * 1000);
    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tickLenis);
      gsap.ticker.lagSmoothing(0);
    }

    let sectionStops: number[] = [];
    const measureSections = () => {
      sectionStops = SCENE_BEATS.map((id) => {
        const element = document.querySelector<HTMLElement>(
          `[data-scene-beat="${id}"]`,
        );
        if (!element) return 0;
        const rect = element.getBoundingClientRect();
        return Math.max(
          0,
          window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2,
        );
      });
    };

    measureSections();
    const pageTrigger = ScrollTrigger.create({
      start: 0,
      end: () =>
        Math.max(1, document.documentElement.scrollHeight - window.innerHeight),
      invalidateOnRefresh: true,
      onRefresh: measureSections,
      onUpdate: (self) => {
        const position = profile.reducedMotion
          ? 0
          : interpolateSectionPosition(self.scroll(), sectionStops);
        updateSceneScrollState({
          activeIndex: Math.min(
            SCENE_BEATS.length - 1,
            Math.max(0, Math.round(position)),
          ),
          position,
          progress: self.progress,
          velocity: self.getVelocity(),
        });
      },
    });

    const effectTriggers: ScrollTrigger[] = [];
    const effectTweens: gsap.core.Tween[] = [];
    if (!profile.reducedMotion) {
      document.querySelectorAll("[data-scene-pulse]").forEach((card) => {
        effectTriggers.push(
          ScrollTrigger.create({
            trigger: card,
            start: "top 84%",
            onEnter: triggerScenePulse,
          }),
        );
      });

      const marquee = document.querySelector<HTMLElement>("[data-scene-stats]");
      if (marquee) {
        const counters = Array.from(
          marquee.querySelectorAll<HTMLElement>("[data-counter]"),
        );
        effectTriggers.push(
          ScrollTrigger.create({
            trigger: marquee,
            start: "top 88%",
            once: true,
            onEnter: () => {
              triggerScenePulse();
              counters.forEach((counter) => {
                const raw = counter.dataset.counter ?? "";
                const match = raw.match(/^(\d+)(K)?(\+)?$/);
                if (!match) return;
                const target = Number(match[1]);
                const suffix = `${match[2] ?? ""}${match[3] ?? ""}`;
                const value = { current: 0 };
                effectTweens.push(
                  gsap.to(value, {
                    current: target,
                    duration: 1.4,
                    ease: "power2.out",
                    onUpdate: () => {
                      counter.textContent = `${Math.round(value.current)}${suffix}`;
                    },
                  }),
                );
              });
            },
          }),
        );
      }
    }

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest(
        "a[href^='#']",
      ) as HTMLAnchorElement | null;
      const hash = anchor?.getAttribute("href");
      if (!hash || hash === "#") return;

      const destination = document.getElementById(hash.slice(1));
      if (!destination) return;

      event.preventDefault();
      if (lenis) {
        lenis.scrollTo(destination, { duration: 1.05, offset: -64 });
      } else {
        destination.scrollIntoView({ block: "start" });
      }
      window.history.replaceState(null, "", hash);
    };

    document.addEventListener("click", handleAnchorClick);
    const refreshFrame = window.requestAnimationFrame(() =>
      ScrollTrigger.refresh(),
    );

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      document.removeEventListener("click", handleAnchorClick);
      pageTrigger.kill();
      effectTriggers.forEach((trigger) => trigger.kill());
      effectTweens.forEach((tween) => tween.kill());
      if (lenis) {
        gsap.ticker.remove(tickLenis);
        lenis.destroy();
      }
      html.style.scrollBehavior = previousScrollBehavior;
      resetSceneScrollState();
    };
  }, [profile.coarsePointer, profile.reducedMotion]);

  return children;
}
