import { useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { kerasobha } from "../data/content";
import { gsap, useGsap } from "../lib/motion";
import ProjectIndex from "./work/ProjectIndex";
import FeaturedEngagements from "./work/FeaturedEngagements";
import "../styles/sections/work.css";
export default function Work() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, () => {
    gsap.fromTo(
      ".work-frame",
      { clipPath: "inset(12% 8% 12% 8%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: { trigger: ".work-frame", start: "top 90%", end: "top 20%", scrub: 1 },
      },
    );
    gsap.from(".work-image", {
      scale: 1.12,
      ease: "none",
      scrollTrigger: { trigger: ".work-frame", start: "top bottom", end: "bottom top", scrub: 1 },
    });
    gsap.utils.toArray<HTMLElement>(".engagement-stage").forEach((el) => {
      gsap.from(el.querySelectorAll(".engagement-copy > *, .payment-study, .cargo-study"), {
        y: 35,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });
    });
  });
  return (
    <section id="work" ref={ref} className="selected-work owned-section">
      <div className="shell">
        <div className="section-kicker label">
          <span className="text-crimson">02 — Work</span>
          <span>Product &amp; platform</span>
        </div>
        <h2 className="display owned-heading">
          Built to <span className="serif-accent">matter.</span>
        </h2>
      </div>
      <div className="work-feature">
        <div className="work-frame">
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/kerasobha/home-mobile.webp" />
            <img
              className="work-image"
              src="/images/kerasobha/home.webp"
              srcSet="/images/kerasobha/home-800.webp 800w, /images/kerasobha/home.webp 1600w"
              sizes="100vw"
              alt="Kerasobha homepage with its Kerala coconut-care story"
              width="1600"
              height="1000"
              loading="lazy"
            />
          </picture>
        </div>
        <div className="work-index display" aria-hidden="true">
          {kerasobha.index}
        </div>
      </div>
      <div className="shell">
        <div className="work-caption">
          <div>
            <p className="label">
              {kerasobha.category} / {kerasobha.year}
            </p>
            <h3 className="display">{kerasobha.title}</h3>
          </div>
          <div className="work-description">
            <p>{kerasobha.summary}</p>
            <div className="work-links">
              <Link className="owned-link" to="/work/kerasobha">
                View case study <ArrowRight size={17} />
              </Link>
              <a className="owned-link secondary" href={kerasobha.liveUrl} target="_blank" rel="noopener noreferrer">
                Visit live site <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </div>
        <ul className="technical-tags work-tech">
          {[...kerasobha.stack.frontend.slice(0, 3), ...kerasobha.stack.backend.slice(0, 2)].map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <div className="project-evidence">
          <div><p className="label">My contribution</p><p>{kerasobha.role}</p></div>
          <div><p className="label">The engineering</p><p>Static storefront. Edge API.<br />Versioned data. Protected admin.</p></div>
          <div><p className="label">The result</p><p>A live commerce experience.<br />One coherent order journey.</p></div>
        </div>
        <FeaturedEngagements />
        <ProjectIndex />
      </div>
    </section>
  );
}
