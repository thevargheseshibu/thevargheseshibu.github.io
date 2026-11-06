import { useEffect, useRef, useState, type RefObject } from "react";
import { createScrollScene } from "./cinematic-scene";
import { useReducedMotion } from "./motion";

/** Each chapter has its own spatial choreography, all driven by one reversible clock. */
export function useChapter(
  root: RefObject<HTMLElement | null>,
  screens: number,
  steps: number,
  paint: (element: HTMLElement, progress: number) => void,
) {
  const prefersReduced = useReducedMotion();
  const [shortViewport, setShortViewport] = useState(() => window.matchMedia("(max-height: 650px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-height: 650px)");
    const update = () => setShortViewport(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const reduced = prefersReduced || shortViewport;
  const [active, setActive] = useState(0);
  const painter = useRef(paint);
  painter.current = paint;
  const controller = useRef<ReturnType<typeof createScrollScene> | null>(null);
  useEffect(() => {
    const element = root.current!;
    element.dataset.static = String(reduced);
    let previous = -1;
    controller.current = createScrollScene({
      root: element,
      stage: element.querySelector<HTMLElement>(".scene-stage")!,
      screens: window.innerWidth < 700 ? screens * 0.8 : screens,
      reduced,
      render(progress) {
        element.dataset.progress = progress.toFixed(4);
        element.style.setProperty("--p", String(progress));
        painter.current(element, progress);
        const next = Math.round(progress * (steps - 1));
        if (previous !== next) {
          previous = next;
          setActive(next);
        }
      },
    });
    return () => controller.current?.destroy();
  }, [root, screens, steps, reduced]);
  return {
    active,
    reduced,
    go: (progress: number) => controller.current?.go(progress),
    choose: (index: number) => controller.current?.go(steps > 1 ? index / (steps - 1) : 0.9),
  };
}
