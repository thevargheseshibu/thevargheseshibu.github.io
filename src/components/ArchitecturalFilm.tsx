import { useEffect, useRef, type RefObject } from "react";
import { createVideoScrubber } from "../lib/cinematic-scene";
import { useReducedMotion } from "../lib/motion";

/** Uses the existing chapter's clock; never introduces a second scroll/pin system. */
export default function ArchitecturalFilm({
  chapter,
  native = false,
}: {
  chapter: RefObject<HTMLElement | null>;
  native?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const film = video.current,
      root = chapter.current;
    if (!film || !root) return;
    const scrubber = createVideoScrubber(film);
    let frame = 0;
    const render = () => {
      frame = 0;
      const box = root.getBoundingClientRect();
      const p = native
        ? Math.max(0, Math.min(1, -box.top / Math.max(1, box.height - innerHeight)))
        : Number(root.dataset.progress || 0);
      scrubber.render(p);
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const observer = new MutationObserver(update);
    if (native) {
      addEventListener("scroll", update, { passive: true });
      addEventListener("resize", update);
    } else observer.observe(root, { attributes: true, attributeFilter: ["data-progress"] });
    render();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      scrubber.destroy();
    };
  }, [chapter, native, reduced]);
  if (reduced)
    return (
      <img
        className="architectural-film-poster"
        src="/media/cinematic/arrival-poster.webp"
        alt="Walnut and limestone architectural passage"
      />
    );
  return (
    <video
      ref={video}
      className="architectural-film"
      data-cinematic-walk
      muted
      playsInline
      preload="metadata"
      poster="/media/cinematic/arrival-poster.webp"
      aria-label="Scroll-controlled architectural walking film"
    >
      <source media="(max-width:699px)" src="/media/cinematic/arrival-mobile.mp4" />
      <source src="/media/cinematic/arrival-desktop.mp4" />
    </video>
  );
}
