import { useRef } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile } from "../data/content";
import { gsap, useGsap } from "../lib/motion";
import { scrollToTarget } from "../lib/smooth-scroll";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, ({ isMobile }) => {
    const q = gsap.utils.selector(root);
    const arrival = gsap.timeline({ defaults: { ease: "expo.out" } });
    if (!isMobile) {
      arrival
        .fromTo(q(".hero-opening-mark"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, 0)
        .to(q(".hero-opening-mark"), { opacity: 0, y: -12, duration: 0.3 }, 0.55)
        .from(q(".hero-camera"), { clipPath: "inset(0% 0% 0% 100%)", duration: 1.45, ease: "power3.inOut" }, 0.12)
        .from(q(".hero-camera"), { scale: 1.075, xPercent: 1.5, duration: 2.1 }, 0.12)
        .from(q(".hero-rule"), { scaleX: 0, transformOrigin: "left", duration: 0.8 }, 1.15);
    }
    arrival
      .from(
        q(".hero-title .mask > span"),
        {
          yPercent: isMobile ? 20 : 112,
          rotate: isMobile ? 0 : 2,
          duration: isMobile ? 0.6 : 1.25,
          stagger: 0.16,
        },
        isMobile ? 0 : 0.55,
      )
      .from(
        q("[data-hero-detail]"),
        {
          opacity: isMobile ? 1 : 0,
          y: isMobile ? 8 : 18,
          stagger: isMobile ? 0 : 0.075,
          duration: isMobile ? 0.45 : 0.8,
        },
        isMobile ? 0 : 0.95,
      );
    if (isMobile) return;
    gsap
      .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 } })
      .to(q(".hero-image-wrap"), { yPercent: isMobile ? 8 : 18, scale: 1.045, ease: "none" }, 0)
      .to(q(".hero-copy"), { yPercent: -15, opacity: 0.15, ease: "none" }, 0);
  });
  return (
    <section id="top" ref={root} className="atelier-hero grain" aria-labelledby="hero-title">
      <div className="hero-opening-mark" aria-hidden="true">
        <span>VS / 01</span>
        <span>The art of engineering</span>
      </div>
      <div className="hero-image-wrap">
        <div className="hero-camera">
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/editorial/atelier-mobile.webp" />
            <source
              media="(min-width: 768px)"
              srcSet="/images/editorial/atelier-v2-1920.webp 1920w, /images/editorial/atelier-v2-2560.webp 2560w, /images/editorial/atelier-v2-3840.webp 3840w"
              sizes="100vw"
            />
            <img
              data-portrait
              src="/images/editorial/atelier-v2-1920.webp"
              width={3840}
              height={2160}
              alt="AI art-directed portrait of Varghese Shibu in charcoal tailoring, seated in a walnut study"
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </div>
      </div>
      <div className="hero-shade" />
      <div className="hero-copy shell">
        <p data-hero-detail className="hero-eyebrow label">
          {profile.title} / {profile.employer}
        </p>
        <h1 className="hero-title" id="hero-title">
          <span className="mask">
            <span>{profile.first}</span>
          </span>{" "}
          <span className="mask">
            <span>
              {profile.last}
              <i>.</i>
            </span>
          </span>
          <span className="sr-only"> — {profile.role}</span>
        </h1>
        <div data-hero-detail className="hero-intro">
          <span className="hero-rule" />
          <p>
            Considered interfaces.
            <br />
            <em>Exceptional systems.</em>
          </p>
        </div>
        <a
          data-hero-detail
          href="#work"
          className="hero-work-link"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("#work");
          }}
        >
          Explore selected work <ArrowUpRight size={17} aria-hidden />
        </a>
      </div>
      <div className="hero-footer shell" data-hero-detail>
        <div>
          <span className="status-dot" /> <span className="label">{profile.specialism}</span>
          <p className="label">{profile.employer} · Aug 2025 — Present</p>
        </div>
        <button type="button" onClick={() => scrollToTarget("#closeup")} className="hero-scroll label">
          Scroll to discover <ArrowDown size={17} aria-hidden />
        </button>
        <span className="label hero-edition">Selected portfolio / 2026</span>
      </div>
    </section>
  );
}
