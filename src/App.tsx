import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "./open-structure/Portfolio";
import { ScrollTrigger } from "./lib/motion";

const CaseStudy = lazy(() => import("./open-structure/CaseStudy"));
const NotFound = lazy(() => import("./open-structure/NotFound"));
const CinematicLab = lazy(() => import("./pages/CinematicLab"));

function RouteEffects() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const publicRoute = pathname === "/" || pathname === "/work/kerasobha";
    const canonical = new URL(pathname, "https://vargheseshibu.com").href;
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", canonical);
    document.querySelector('meta[property="og:url"]')?.setAttribute("content", canonical);
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.append(robots);
    }
    robots.content = publicRoute ? "index, follow" : "noindex, follow";
  }, [pathname]);
  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname !== "/cinematic-lab") return;
    let disposed = false;
    let stop: (() => void) | undefined;
    void import("./lib/smooth-scroll").then((controller) => {
      if (disposed) return;
      controller.startSmoothScroll();
      stop = controller.stopSmoothScroll;
    });
    return () => {
      disposed = true;
      stop?.();
    };
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <RouteEffects />
      <Suspense fallback={<div style={{ minHeight: "100dvh", background: "#eeeae2" }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/kerasobha" element={<CaseStudy />} />
          <Route path="/cinematic-lab" element={<CinematicLab />} />
          <Route path="/cinematic" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
