import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../lib/motion";

type Props = {
  /** Base path without extension, e.g. "/media/atelier-light" → .webm/.mp4 */
  base: string;
  className?: string;
};

/**
 * Decorative background loop. Loads only when near the viewport, never on reduced motion or Save-Data,
 * and fades in once playable. If the files are missing it simply never appears — the CSS
 * atmosphere underneath is the designed fallback.
 */
export default function AmbientVideo({ base, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const saveData =
    typeof navigator !== "undefined" &&
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
        if (ready) entry.isIntersecting ? el.play().catch(() => {}) : el.pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  if (reduced || saveData || failed) return null;

  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      autoPlay
      preload="none"
      onCanPlay={() => setReady(true)}
      onError={() => setFailed(true)}
      className={`pointer-events-none object-cover transition-opacity duration-[1500ms] ${ready ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {visible && (
        <>
          <source src={`${base}.webm`} type="video/webm" />
          <source src={`${base}.mp4`} type="video/mp4" onError={() => setFailed(true)} />
        </>
      )}
    </video>
  );
}
