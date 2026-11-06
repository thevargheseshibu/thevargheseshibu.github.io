import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToTarget } from "../lib/smooth-scroll";
import { ScrollTrigger } from "../lib/motion";
import Hero from "../sections/Hero";
import Practice from "../sections/Practice";
import CloseUp from "../sections/CloseUp";
import About from "../sections/About";
import Work from "../sections/Work";
import Engineering from "../sections/Engineering";
import Stack from "../sections/Stack";
import Experience from "../sections/Experience";
import Education from "../sections/Education";
import Contact from "../sections/Contact";

/** Story order: Hero → Portrait close-up → About → Selected Work → Engineering → Stack → Experience → Contact */
export default function Home() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    // Wait for lazy layout + pinned sections to measure before jumping.
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      scrollToTarget(hash);
    }, 250);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <main id="main">
      <Hero />
      <Practice />
      <CloseUp />
      <About />
      <Work />
      <Engineering />
      <Stack />
      <Experience />
      <Education />
      <Contact />
    </main>
  );
}
