"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { StaticGlobe } from "@/components/three/static-globe";
import { GlobeErrorBoundary } from "@/components/three/globe-error-boundary";

const GlobeScene = dynamic(
  () => import("@/components/three/globe-scene").then((m) => m.GlobeScene),
  {
    ssr: false,
    loading: () => <StaticGlobe className="h-full w-full" />,
  }
);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Sync the current media query value (unavailable during SSR) on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return reduced;
}

function useIsSmallViewport() {
  const [isSmall, setIsSmall] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSmall(mq.matches);
    const listener = (e: MediaQueryListEvent) => setIsSmall(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);
  return isSmall;
}

/**
 * Signature 3D hero. WebGL is disabled entirely for reduced-motion users
 * and small viewports, in favor of the static SVG globe — the hero copy
 * and CTAs never depend on WebGL having loaded successfully.
 */
export function GlobeHero() {
  const reducedMotion = usePrefersReducedMotion();
  const isSmallViewport = useIsSmallViewport();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(true);
  const [mounted, setMounted] = React.useState(false);

  // Standard client-mount flag so WebGL only renders after hydration.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const useWebGL = mounted && !reducedMotion && !isSmallViewport;

  return (
    <div ref={containerRef} className="relative h-full w-full">
      {useWebGL ? (
        <GlobeErrorBoundary fallback={<StaticGlobe className="h-full w-full" />}>
          {isVisible ? (
            <React.Suspense fallback={<StaticGlobe className="h-full w-full" />}>
              <GlobeScene />
            </React.Suspense>
          ) : (
            <StaticGlobe className="h-full w-full" />
          )}
        </GlobeErrorBoundary>
      ) : (
        <StaticGlobe className="h-full w-full" />
      )}
    </div>
  );
}
