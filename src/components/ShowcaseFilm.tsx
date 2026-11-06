import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../lib/motion";
import "../styles/showcase-film.css";

/** A local recording, never an interactive third-party frame. Deferred and paused offscreen. */
export default function ShowcaseFilm({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null),
    video = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false),
    [visible, setVisible] = useState(false),
    [paused, setPaused] = useState(false),
    [failed, setFailed] = useState(false);
  const [quality, setQuality] = useState<"1080" | "4k">("1080");
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNear((v) => v || entry.isIntersecting);
      },
      { rootMargin: "400px" },
    );
    const visibility = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(root.current!);
    visibility.observe(root.current!);
    return () => {
      observer.disconnect();
      visibility.disconnect();
    };
  }, []);
  useEffect(() => {
    const film = video.current;
    if (!film) return;
    if (visible && !paused && !document.hidden) film.play().catch(() => {});
    else film.pause();
    const onVisibility = () => {
      if (document.hidden) film.pause();
      else if (visible && !paused) film.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      film.pause();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [visible, paused, near, quality]);
  const playable = near && !reduced && !saveData && !failed;
  return (
    <div ref={root} className={`showcase-film ${className}`}>
      <div className="showcase-screen" onContextMenu={(e) => e.preventDefault()}>
        <img
          src="/images/kerasobha/home-1920.webp"
          srcSet="/images/kerasobha/home-1920.webp 1920w, /images/kerasobha/home-4k.webp 3840w"
          sizes="100vw"
          width={3840}
          height={2160}
          loading="lazy"
          alt="Kerasobha website captured at 3840 by 2160 pixels"
        />
        {playable && (
          <video
            ref={video}
            key={quality}
            src={`/media/kerasobha/website-${quality}.mp4`}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            tabIndex={-1}
            aria-label="Read-only recording of the Kerasobha website"
            onCanPlay={(event) => {
              if (visible && !paused && !document.hidden) event.currentTarget.play().catch(() => {});
            }}
            onError={() => setFailed(true)}
          />
        )}
        <span className="showcase-badge">Kerasobha / Website film</span>
      </div>
      <div className="showcase-controls">
        <span>
          {reduced || saveData
            ? "Still preview · Motion preference respected"
            : failed
              ? "Still preview · Film unavailable"
              : "Recorded website · No embedded site controls"}
        </span>
        <div>
          {playable && (
            <button onClick={() => setPaused(!paused)} aria-label={paused ? "Play website film" : "Pause website film"}>
              {paused ? "Play" : "Pause"}
            </button>
          )}
          <button aria-pressed={quality === "4k"} onClick={() => setQuality(quality === "4k" ? "1080" : "4k")}>
            {quality === "4k" ? "4K" : "HD"} ↗
          </button>
        </div>
      </div>
    </div>
  );
}
