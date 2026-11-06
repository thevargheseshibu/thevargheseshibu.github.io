import { useRef } from "react";
import { profile } from "../../data/content";
import { gsap, useIsoLayoutEffect, useReducedMotion } from "../../lib/motion";
import { scrollToTarget } from "../../lib/smooth-scroll";
import "../../styles/mobile-arrival.css";

/** A portrait composition with its own motion, independent of the desktop camera. */
export default function MobileArrival() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useIsoLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root.current);
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(q(".ma-light"), { opacity: 0.75, duration: 1.4 })
        .from(q(".ma-portrait"), { scale: 1.045, duration: 1.5 }, 0)
        .from(q(".ma-line > span"), { yPercent: 110, duration: 1, stagger: 0.12 }, 0.2)
        .from(
          q(".ma-kicker,.ma-role,.ma-actions,.ma-caption"),
          { opacity: 0, y: 12, duration: 0.7, stagger: 0.08 },
          0.55,
        );
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        })
        .to(q(".ma-depth"), { scale: 1.09, yPercent: -4 }, 0)
        .to(q(".ma-copy"), { y: -45 }, 0)
        .to(q(".ma-exit"), { opacity: 0.7 }, 0);
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={root}
      id="top"
      className="mp-arrival ma-arrival"
      data-mobile-chapter="portrait"
      aria-labelledby="hero-title"
    >
      <div className="ma-stage">
        <div className="ma-depth">
          <img
            className="ma-portrait"
            data-portrait
            src="/images/editorial/atelier-mobile.webp"
            width={800}
            height={1200}
            alt={`${profile.name} in the walnut atelier`}
            fetchPriority="high"
          />
        </div>
        <div className="ma-shade" aria-hidden="true" />
        <div className="ma-light" aria-hidden="true" />
        <p className="ma-kicker">
          <span>Creative engineering</span>
          <span>Selected portfolio / 2026</span>
        </p>
        <div className="ma-copy">
          <h1 id="hero-title" aria-label={`${profile.name} — ${profile.title}`}>
            <span className="ma-line">
              <span>{profile.name.split(" ")[0]}</span>
            </span>
            <span className="ma-line">
              <span>
                <em>{profile.name.split(" ").slice(1).join(" ")}.</em>
              </span>
            </span>
          </h1>
          <p className="ma-role">
            {profile.title}
            <span>{profile.employer} · Bengaluru</span>
          </p>
          <div className="ma-actions">
            <a
              href="#work"
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget("#work");
              }}
            >
              Explore the work <span aria-hidden="true">↗</span>
            </a>
            <a
              href="#closeup"
              aria-label="Enter the next chapter"
              onClick={(event) => {
                event.preventDefault();
                scrollToTarget("#closeup");
              }}
            >
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <p className="ma-caption">
          <span>The private atelier</span>
          <span>01 / The arrival</span>
        </p>
        <div className="ma-exit" aria-hidden="true" />
      </div>
    </section>
  );
}
