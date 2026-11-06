import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./motion";

let lenis: Lenis | null = null;
const tick = (t: number) => lenis?.raf(t * 1000);

/** Lenis drives smooth scroll on pointer devices; touch devices keep native scrolling. */
export function startSmoothScroll() {
  if (lenis || prefersReducedMotion() || !window.matchMedia("(pointer: fine)").matches) return null;
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function stopSmoothScroll() {
  gsap.ticker.remove(tick);
  lenis?.destroy();
  lenis = null;
}

export function scrollToTarget(target: string | HTMLElement | number, offset = 0) {
  const destination = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (destination == null) return;
  const resolvedOffset = typeof destination === "number" ? offset : offset || -(parseFloat(getComputedStyle(destination).scrollMarginTop) || 0);
  if (lenis) {
    lenis.scrollTo(destination, { offset: resolvedOffset, duration: 1.2, onComplete: () => {
      // Pin measurements and web fonts may settle during a long chapter jump.
      // Resolve the element again at completion rather than keeping an old pixel target.
      if (typeof destination !== "number") lenis?.scrollTo(destination, { offset: resolvedOffset, immediate: true });
    } });
    return;
  }
  const top = typeof destination === "number" ? destination : destination.getBoundingClientRect().top + window.scrollY + resolvedOffset;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "instant" : "smooth" });
}

export function lockScroll(locked: boolean) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
