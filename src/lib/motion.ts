import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/** Shared motion vocabulary — keep GSAP timings consistent across sections. */
export const motion = {
  ease: {
    out: "expo.out",
    inOut: "power4.inOut",
    cine: "power3.inOut",
  },
  dur: { fast: 0.18, base: 0.42, slow: 0.9, reveal: 1.2 },
  stagger: { tight: 0.04, base: 0.08, loose: 0.14 },
} as const;

const query = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia(query).matches;
}

/** Reactive reduced-motion flag. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(prefersReducedMotion);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Scoped GSAP setup. Runs `setup` inside gsap.context bound to `scope`, and reverts on unmount.
 * `setup` is skipped entirely when reduced motion is on — content must already be visible by default.
 */
export function useGsap(
  scope: React.RefObject<HTMLElement | null>,
  setup: (ctx: { reduced: boolean; isMobile: boolean }) => void,
  deps: React.DependencyList = [],
  { runWhenReduced = false }: { runWhenReduced?: boolean } = {},
) {
  const reduced = useReducedMotion();
  useIsoLayoutEffect(() => {
    const element = scope.current;
    if (!element) return;
    if (reduced && !runWhenReduced) return;
    // Touch-first phones keep the chapter controls and readable native document.
    // Reserve scroll-triggered editorial effects for larger layouts.
    if (window.matchMedia("(max-width: 767px)").matches && element.id !== "top") return;
    let ctx: gsap.Context | undefined;
    const start = () => {
      if (ctx) return;
      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      ctx = gsap.context(() => setup({ reduced, isMobile }), scope);
    };
    // Keep below-fold layout and tween measurement out of the arrival's critical path.
    // The normal DOM stays visible until its scene approaches the viewport.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        start();
      },
      { rootMargin: "400px" },
    );
    if (element.getBoundingClientRect().top <= window.innerHeight + 400) start();
    else observer.observe(element);
    return () => {
      observer.disconnect();
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reduced, runWhenReduced]);
}

/** State changes can alter chapter height; the initial layout is already measured at page mount. */
export function useLayoutRefresh(value: unknown) {
  const previous = useRef(value);
  useEffect(() => {
    if (Object.is(previous.current, value)) return;
    previous.current = value;
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [value]);
}
