import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Nav from "./components/Nav";
import { startSmoothScroll, stopSmoothScroll } from "./lib/smooth-scroll";
import { ScrollTrigger } from "./lib/motion";

const CaseStudy = lazy(() => import("./pages/CaseStudy"));
const NotFound = lazy(() => import("./pages/NotFound"));
const CinematicLab = lazy(() => import("./pages/CinematicLab"));
const Cinematic = lazy(() => import("./pages/Cinematic"));

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
    startSmoothScroll();
    return () => stopSmoothScroll();
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <RouteEffects />
      {!pathname.startsWith("/cinematic") && <Nav />}
      <Suspense fallback={<div className="min-h-dvh bg-ink" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/kerasobha" element={<CaseStudy />} />
          <Route path="/cinematic-lab" element={<CinematicLab />} />
          <Route path="/cinematic" element={<Cinematic />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}
