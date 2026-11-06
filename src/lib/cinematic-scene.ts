import { gsap, ScrollTrigger } from "./motion";

export const clamp = (v: number) => Math.max(0, Math.min(1, v));
export const phase = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const ease = (v: number) => v * v * (3 - 2 * v);

/** One clock for all scene layers. No independent autoplay or elapsed-time animation. */
export function createScrollScene(options: {
  root: HTMLElement;
  stage: HTMLElement;
  render: (progress: number) => void;
  reduced: boolean;
  screens?: number;
}) {
  const { root, stage, render, reduced } = options;
  if (reduced) {
    render(1);
    return {
      destroy() {},
      go(progress: number) {
        render(clamp(progress));
      },
    };
  }
  const clock = { progress: 0 };
  const tween = gsap.to(clock, {
    progress: 1,
    ease: "none",
    onUpdate: () => render(clock.progress),
    scrollTrigger: {
      trigger: root,
      pin: stage,
      start: "top top",
      end: () => `+=${window.innerHeight * (options.screens ?? (window.innerWidth < 700 ? 4 : 5.5))}`,
      scrub: true,
      invalidateOnRefresh: true,
      onRefresh: (s) => {
        root.dataset.start = String(s.start);
        root.dataset.end = String(s.end);
      },
    },
  });
  render(0);
  ScrollTrigger.refresh();
  return {
    destroy: () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    },
    go: (progress: number) => {
      const trigger = tween.scrollTrigger;
      if (trigger)
        window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * clamp(progress), behavior: "instant" });
    },
  };
}

/** Bounded decoding: preload a sequence once; draw only when its frame changes. */
export function createFrameSequence(canvas: HTMLCanvasElement, sources: string[]) {
  const images = sources.map((src) => {
    const image = new Image();
    image.src = src;
    return image;
  });
  let previous = -1;
  return {
    ready: Promise.all(images.map((image) => image.decode())),
    render(progress: number) {
      const frame = Math.round(clamp(progress) * (images.length - 1));
      const image = images[frame];
      if (frame === previous || !image?.complete || !image.naturalWidth) return;
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext("2d")?.drawImage(image, 0, 0);
      previous = frame;
    },
    destroy() {
      images.forEach((image) => {
        image.src = "";
      });
    },
  };
}

/** Coalesce seeking; the most recent scroll target wins in either direction. */
export function createVideoScrubber(video: HTMLVideoElement) {
  let target = 0;
  const seek = () => {
    if (!Number.isFinite(video.duration) || video.seeking) return;
    const time = Math.min(video.duration - 0.04, target * video.duration);
    if (Math.abs(video.currentTime - time) > 0.035) video.currentTime = Math.max(0, time);
  };
  video.addEventListener("seeked", seek);
  video.addEventListener("loadedmetadata", seek);
  return {
    render(progress: number) {
      target = clamp(progress);
      seek();
    },
    destroy() {
      video.removeEventListener("seeked", seek);
      video.removeEventListener("loadedmetadata", seek);
      video.pause();
    },
  };
}
