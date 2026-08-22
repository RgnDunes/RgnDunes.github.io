"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type Origin = { x: number; y: number };
type RouteTransitionContextValue = {
  navigate: (href: string, origin: Origin) => void;
  transitioning: boolean;
};

const RouteTransitionContext =
  createContext<RouteTransitionContextValue | null>(null);

export function useRouteTransition() {
  return useContext(RouteTransitionContext);
}

export default function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "departing" | "arriving">("idle");
  const timer = useRef<number>();
  const destination = useRef<string | null>(null);

  const navigate = useCallback(
    (href: string, origin: Origin) => {
      if (phase !== "idle") return;
      destination.current = href;
      document.documentElement.style.setProperty(
        "--route-origin-x",
        `${origin.x}px`,
      );
      document.documentElement.style.setProperty(
        "--route-origin-y",
        `${origin.y}px`,
      );

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }

      setPhase("departing");
      timer.current = window.setTimeout(() => router.push(href), 720);
    },
    [phase, router],
  );

  useEffect(() => {
    if (!destination.current) return;
    destination.current = null;
    setPhase("arriving");
    window.scrollTo(0, 0);
    timer.current = window.setTimeout(() => setPhase("idle"), 620);
  }, [pathname]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  return (
    <RouteTransitionContext.Provider
      value={{ navigate, transitioning: phase !== "idle" }}
    >
      <div className="route-transition-root" data-route-phase={phase}>
        <div className="route-stage">{children}</div>
        <div className="route-transition" aria-hidden="true">
          <div className="route-transition-rings" />
          <div className="route-transition-core" />
        </div>
      </div>
    </RouteTransitionContext.Provider>
  );
}
