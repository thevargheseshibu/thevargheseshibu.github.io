import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../lib/motion";
import "../styles/cinematic.css";

type Props = { base: string; poster: string; className?: string; enabled?: boolean };
type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };

/** Decorative films progressively enhance a separate, always-available still image. */
export default function CinematicVideo({ base, poster, className = "", enabled = true }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const inViewport = useRef(false);
  const reduced = useReducedMotion();
  const [capable, setCapable] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (pointer: fine)");
    const device = navigator as Navigator & { connection?: Connection; deviceMemory?: number };
    const update = () =>
      setCapable(
        media.matches &&
          !device.connection?.saveData &&
          !["slow-2g", "2g"].includes(device.connection?.effectiveType ?? "") &&
          (device.deviceMemory ?? 8) >= 4 &&
          (device.hardwareConcurrency || 8) >= 4,
      );
    update();
    media.addEventListener("change", update);
    device.connection?.addEventListener("change", update);
    return () => {
      media.removeEventListener("change", update);
      device.connection?.removeEventListener("change", update);
    };
  }, []);

  const eligible = capable && enabled && !reduced && !failed;

  useEffect(() => {
    const element = ref.current;
    if (!eligible || !element) return;
    let loadTimer: ReturnType<typeof setTimeout> | undefined;
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadTimer = setTimeout(() => setLoaded(true), 350);
          loadObserver.disconnect();
        }
      },
      { rootMargin: "160px" },
    );
    const reconcile = () => {
      if (inViewport.current && document.visibilityState === "visible" && element.readyState >= 2) {
        element.play().catch((error: DOMException) => {
          if (error.name !== "AbortError") setFailed(true);
        });
      } else element.pause();
    };
    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport.current = entry.isIntersecting;
        reconcile();
      },
      { threshold: 0.02 },
    );
    element.addEventListener("loadeddata", reconcile);
    document.addEventListener("visibilitychange", reconcile);
    loadObserver.observe(element);
    playbackObserver.observe(element);
    return () => {
      if (loadTimer) clearTimeout(loadTimer);
      loadObserver.disconnect();
      playbackObserver.disconnect();
      element.removeEventListener("loadeddata", reconcile);
      document.removeEventListener("visibilitychange", reconcile);
      element.pause();
    };
  }, [eligible, base]);

  useEffect(() => {
    if (eligible && loaded) ref.current?.load();
  }, [eligible, loaded, base]);

  if (!eligible) return null;
  return (
    <video
      ref={ref}
      aria-hidden="true"
      tabIndex={-1}
      muted
      loop
      playsInline
      preload={loaded ? "auto" : "none"}
      poster={poster}
      data-cinematic={base.split("/").pop()}
      data-ready={ready}
      className={"cinematic-video " + (ready ? "is-ready " : "") + className}
      onLoadedData={() => setReady(true)}
      onError={() => setFailed(true)}
    >
      {loaded && (
        <>
          <source src={base + ".mp4"} type="video/mp4" />
          <source src={base + ".webm"} type="video/webm" onError={() => setFailed(true)} />
        </>
      )}
    </video>
  );
}
