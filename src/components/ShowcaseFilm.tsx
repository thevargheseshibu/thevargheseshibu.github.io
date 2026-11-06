import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../lib/motion";
import "../styles/showcase-film.css";

/** Prebuffer near the viewport, play while visible, and preserve time across rendition changes. */
export default function ShowcaseFilm({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null),
    video = useRef<HTMLVideoElement>(null),
    resumeTime = useRef(0);
  const reduced = useReducedMotion();
  const [near, setNear] = useState(false),
    [visible, setVisible] = useState(false),
    [paused, setPaused] = useState(false),
    [failed, setFailed] = useState(false),
    [ready, setReady] = useState(false),
    [blocked, setBlocked] = useState(false);
  const [quality, setQuality] = useState<"1080" | "4k">("1080");
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  const playable = near && !reduced && !saveData && !failed;
  const play = (film: HTMLVideoElement) =>
    film.play().catch((error: DOMException) => {
      if (error.name === "NotAllowedError") setBlocked(true);
    });
  useEffect(() => {
    const element = root.current!;
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          preload.disconnect();
        }
      },
      { rootMargin: "1200px" },
    );
    // Hysteresis avoids pause/play chatter while the section crosses the viewport edge.
    const visibility = new IntersectionObserver(
      ([entry]) => setVisible((was) => entry.intersectionRatio > 0 && (was || entry.intersectionRatio >= 0.2)),
      { threshold: [0, 0.2] },
    );
    preload.observe(element);
    visibility.observe(element);
    return () => {
      preload.disconnect();
      visibility.disconnect();
    };
  }, []);
  useEffect(() => {
    const film = video.current;
    if (!film || !playable) return;
    const sync = () => {
      if (visible && !paused && !document.hidden) void play(film);
      else film.pause();
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      film.pause();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [visible, paused, playable, quality]);
  const changeQuality = () => {
    if (video.current && video.current.readyState >= 1) resumeTime.current = video.current.currentTime;
    setReady(false);
    setFailed(false);
    setQuality((value) => (value === "4k" ? "1080" : "4k"));
  };
  const toggle = () => {
    if (paused || blocked) {
      setPaused(false);
      setBlocked(false);
      if (video.current) void play(video.current);
    } else {
      setPaused(true);
      video.current?.pause();
    }
  };
  return (
    <div ref={root} className={`showcase-film ${className}`} data-ready={ready}>
      <div className="showcase-screen" onContextMenu={(e) => e.preventDefault()}>
        <img
          src="/images/kerasobha/home-1920.webp"
          srcSet="/images/kerasobha/home-1920.webp 1920w, /images/kerasobha/home-4k.webp 3840w"
          sizes="(max-width:699px) 100vw, 60vw"
          width={3840}
          height={2160}
          loading="lazy"
          alt="Kerasobha website captured at 3840 by 2160 pixels"
        />
        {playable && (
          <video
            ref={video}
            key={quality}
            src={`/media/kerasobha/website-smooth-${quality}.mp4`}
            poster="/images/kerasobha/home-1920.webp"
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            tabIndex={-1}
            aria-label="Read-only recording of the Kerasobha website"
            onLoadedMetadata={(e) => {
              const film = e.currentTarget;
              if (resumeTime.current > 0 && Number.isFinite(film.duration))
                film.currentTime = Math.min(resumeTime.current, film.duration - 0.08);
            }}
            onLoadedData={() => setReady(true)}
            onSeeked={() => setReady(true)}
            onPlaying={() => {
              setReady(true);
              setBlocked(false);
            }}
            onCanPlay={(e) => {
              if (visible && !paused && !document.hidden) void play(e.currentTarget);
            }}
            onError={() => setFailed(true)}
          />
        )}
        <span className="showcase-badge">Kerasobha / Website film</span>
      </div>
      <div className="showcase-controls">
        <span>
          {reduced || saveData
            ? "Still preview / Motion preference respected"
            : failed
              ? "Still preview / Film unavailable"
              : "Website film / 60 fps"}
        </span>
        <div>
          {playable && (
            <button onClick={toggle} aria-label={paused || blocked ? "Play website film" : "Pause website film"}>
              {paused || blocked ? "Play" : "Pause"}
            </button>
          )}
          <button aria-pressed={quality === "4k"} onClick={changeQuality}>
            {quality === "4k" ? "4K" : "HD"} &#8599;
          </button>
        </div>
      </div>
    </div>
  );
}
