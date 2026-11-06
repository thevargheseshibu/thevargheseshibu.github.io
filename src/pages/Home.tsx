import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTarget } from "../lib/smooth-scroll";
import { ScrollTrigger } from "../lib/motion";
import { PortraitScene, PassageScene, PerspectiveScene } from "../sections/portfolio/PortraitScenes";
import ProductScene from "../sections/portfolio/ProductScene";
import SystemScene from "../sections/portfolio/SystemScene";
import { ToolsetScene, JourneyScene, FoundationScene } from "../sections/portfolio/KnowledgeScenes";
import ClosingScene from "../sections/portfolio/ClosingScene";
import "../styles/portfolio-scenes.css";
import MobilePortfolio from "../sections/mobile/MobilePortfolio";

/** Story order: Hero → Portrait close-up → About → Selected Work → Engineering → Stack → Experience → Contact */
export default function Home() {
  const { hash } = useLocation();
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width:899px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(max-width:899px)");
    const update = () => setMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    let disposed = false;
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
    };
    // The short unpinned ledgers can change height after font loading or disclosure.
    // Re-measure every downstream pin so the final chapter can reach its exact end.
    const observer = new ResizeObserver(refresh);
    document
      .querySelectorAll(".engagement-gallery,.system-decisions,.credential-ledger,.mobile-portfolio")
      .forEach((el) => observer.observe(el));
    document.fonts.ready.then(refresh);
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [mobile]);
  useEffect(() => {
    if (!hash) return;
    // Wait for lazy layout + pinned sections to measure before jumping.
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToTarget(hash);
    }, 250);
    return () => clearTimeout(t);
  }, [hash]);

  if (mobile) return <MobilePortfolio />;
  return (
    <main id="main" className="cinematic-portfolio">
      <PortraitScene />
      <PassageScene />
      <PerspectiveScene />
      <ProductScene />
      <SystemScene />
      <ToolsetScene />
      <JourneyScene />
      <FoundationScene />
      <ClosingScene />
    </main>
  );
}
