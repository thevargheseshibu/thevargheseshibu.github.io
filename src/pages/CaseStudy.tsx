import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { kerasobha } from "../data/content";
import { gsap, useGsap } from "../lib/motion";
import SystemMap from "../sections/engineering/SystemMap";
import "../styles/sections/work.css";
import "../styles/sections/case-study.css";
const gallery = [
  {
    name: "product",
    alt: "Kerasobha virgin coconut oil product page",
    caption: "01 / Product — ingredient, ritual and bottle",
  },
  {
    name: "story",
    alt: "Kerasobha Kerala origin story page",
    caption: "02 / Story — a place, an ingredient, a ritual",
  },
  {
    name: "order",
    alt: "Kerasobha order journey with bag and delivery steps",
    caption: "03 / Order — a deliberate path to checkout",
  },
];
export default function CaseStudy() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const old = document.title;
    document.title = "Kerasobha — Case Study / Varghese Shibu";
    return () => {
      document.title = old;
    };
  }, []);
  useGsap(ref, () => {
    gsap.from(".case-hero-image", { scale: 1.1, duration: 1.5, ease: "power3.out" });
    gsap.from(".case-title .mask>span", { yPercent: 105, stagger: 0.12, duration: 1.2, ease: "expo.out" });
  });
  return (
    <main id="main" ref={ref} className="case-study">
      <div className="shell case-top">
        <Link to="/#work" className="owned-link">
          <ArrowLeft size={16} /> Selected work
        </Link>
        <span className="label">Case study / {kerasobha.year}</span>
      </div>
      <header className="case-hero">
        <picture>
          <source media="(max-width:767px)" srcSet="/images/kerasobha/home-mobile.webp" />
          <img
            className="case-hero-image"
            src="/images/kerasobha/home.webp"
            alt="Kerasobha's cinematic coconut-care homepage"
            width="1600"
            height="1000"
            fetchPriority="high"
          />
        </picture>
        <div className="case-hero-shade" />
        <div className="shell case-title">
          <p className="label">{kerasobha.category}</p>
          <h1 className="display">
            <span className="mask">
              <span>{kerasobha.title}</span>
            </span>
          </h1>
          <p className="case-subtitle">{kerasobha.summary}</p>
        </div>
      </header>
      <div className="shell case-body">
        <section className="case-overview case-block">
          <div>
            <p className="label">01 / Overview</p>
            <h2 className="display">
              Kerala roots.
              <br />
              <span className="serif-accent">Edge architecture.</span>
            </h2>
          </div>
          <div className="case-prose">
            {kerasobha.overview.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="case-role">
              <span className="label">My role</span>
              <p>{kerasobha.role}</p>
            </div>
            <a className="owned-link" href={kerasobha.liveUrl} target="_blank" rel="noopener noreferrer">
              Visit live site <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
        <section className="case-block case-stack">
          <h2 className="label">02 / Stack</h2>
          <div>
            {Object.entries(kerasobha.stack).map(([group, items]) => (
              <div className="case-stack-row" key={group}>
                <h3 className="label">{group}</h3>
                <p>{items.join(" / ")}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="case-block case-problem">
          <span className="label">03 / The problem</span>
          <h2>{kerasobha.problem}</h2>
        </section>
        <section className="case-block">
          <p className="label">04 / Architecture</p>
          <h2 className="display case-section-title">
            Follow the <span className="serif-accent">request.</span>
          </h2>
          <SystemMap />
        </section>
        <section className="case-block">
          <p className="label">05 / Key decisions</p>
          <h2 className="display case-section-title">
            Small API.
            <br />
            Considered <span className="serif-accent">decisions.</span>
          </h2>
          <div className="engineering-decisions">
            {kerasobha.decisions.map((d, i) => (
              <article className="decision-row" key={d.title}>
                <span className="label">0{i + 1}</span>
                <h3>{d.title}</h3>
                <p>{d.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="case-block case-gallery">
          <p className="label">06 / Interface studies</p>
          <h2 className="display case-section-title">
            A world worth
            <br />
            <span className="serif-accent">exploring.</span>
          </h2>
          {gallery.map((g) => (
            <figure key={g.name}>
              <img
                src={"/images/kerasobha/" + g.name + ".webp"}
                srcSet={"/images/kerasobha/" + g.name + "-800.webp 800w, /images/kerasobha/" + g.name + ".webp 1600w"}
                sizes="(max-width:767px) 100vw, 90vw"
                alt={g.alt}
                width="1600"
                height="1000"
                loading="lazy"
              />
              <figcaption className="label">{g.caption}</figcaption>
            </figure>
          ))}
          <div className="case-mobile-study">
            <figure>
              <img
                src="/images/kerasobha/home-mobile.webp"
                alt="Kerasobha homepage designed for a narrow mobile screen"
                width="390"
                height="844"
                loading="lazy"
              />
              <figcaption className="label">04 / Mobile homepage</figcaption>
            </figure>
            <figure>
              <img
                src="/images/kerasobha/product-mobile.webp"
                alt="Kerasobha product details on mobile"
                width="390"
                height="844"
                loading="lazy"
              />
              <figcaption className="label">05 / Mobile product</figcaption>
            </figure>
          </div>
        </section>
        <section className="case-block case-findings">
          <div>
            <p className="label">07 / Challenges</p>
            <h2 className="display case-section-title">
              The hard <span className="serif-accent">parts.</span>
            </h2>
            <ul>
              {kerasobha.challenges.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label">08 / Verified outcomes</p>
            <h2 className="display case-section-title">
              What <span className="serif-accent">shipped.</span>
            </h2>
            <ul>
              {kerasobha.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </div>
        </section>
        <footer className="case-end">
          <Link className="owned-link" to="/#work">
            <ArrowLeft size={18} /> Back to selected work
          </Link>
          <a className="owned-link" href={kerasobha.liveUrl} target="_blank" rel="noopener noreferrer">
            Explore Kerasobha <ArrowUpRight size={18} />
          </a>
        </footer>
      </div>
    </main>
  );
}
