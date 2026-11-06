import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createVideoScrubber } from "../lib/cinematic-scene";
import { useReducedMotion } from "../lib/motion";
import { profile, experience } from "../data/content";
import { systemNodes } from "../data/engineering";
import ShowcaseFilm from "../components/ShowcaseFilm";
import "../styles/cinematic-preview.css";

const chapters = ["Arrival", "Ritual", "The portal", "Engineering", "The ascent", "Invitation"];
export default function Cinematic() {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [chapter, setChapter] = useState(0);
  const [node, setNode] = useState("worker");
  const selected = systemNodes.find((n) => n.id === node)!;
  useEffect(() => {
    const title = document.title;
    document.title = "The architect of digital worlds — Varghese Shibu";
    const el = root.current!;
    const sections = Array.from(el.querySelectorAll<HTMLElement>(".film-chapter"));
    const video = el.querySelector<HTMLVideoElement>(".film-walk");
    const scrubber = video ? createVideoScrubber(video) : null;
    let frame = 0;
    const paint = () => {
      frame = 0;
      let current = 0;
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
        section.style.setProperty("--progress", String(reduced ? 0.5 : p));
        section.dataset.progress = p.toFixed(3);
        if (rect.top < innerHeight * 0.5) current = i;
        if (i === 0) scrubber?.render(reduced ? 0 : p);
      });
      setChapter(current);
    };
    const update = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    paint();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      scrubber?.destroy();
      document.title = title;
    };
  }, [reduced]);
  return (
    <main id="main" ref={root} className="cinema" data-reduced={reduced}>
      <header className="film-nav">
        <Link to="/" aria-label="Back to portfolio">
          VS<span> / CINEMA</span>
        </Link>
        <span className="film-preview">A concept in six acts</span>
        <a href="#invitation">Let's talk ↗</a>
      </header>
      <nav className="film-index" aria-label="Film chapters">
        {chapters.map((name, i) => (
          <a key={name} href={"#act-" + i} aria-label={name} aria-current={chapter === i ? "step" : undefined}>
            <span>0{i + 1}</span>
            <b>{name}</b>
          </a>
        ))}
      </nav>
      <section className="film-chapter film-arrival" id="act-0" aria-label="Arrival">
        <div className="film-stage">
          {!reduced && (
            <video
              className="film-walk"
              muted
              playsInline
              preload="auto"
              poster="/media/cinematic/arrival-poster.webp"
              aria-label="Scroll-controlled architectural walking film"
            >
              <source media="(max-width: 699px)" src="/media/cinematic/arrival-mobile.mp4" />
              <source src="/media/cinematic/arrival-desktop.mp4" />
            </video>
          )}
          <div className="film-shade" />
          <div className="film-arrival-title">
            <p className="film-eyebrow">Varghese Shibu / Creative engineering</p>
            <h1>
              Architecture
              <br />
              of the <em>possible.</em>
            </h1>
            <p>
              I build the interfaces you feel.
              <br />
              And the systems you can trust.
            </p>
          </div>
          <div className="film-portal" aria-hidden="true" />
          <span className="film-scroll">Scroll to enter the world ↓</span>
          <span className="film-credit">AI architectural film · Google Flow</span>
        </div>
      </section>
      <section className="film-chapter film-ritual" id="act-1" aria-label="Ritual">
        <div className="film-stage">
          <div className="film-library" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="film-ring" aria-hidden="true" />
          <div className="film-copy">
            <p className="film-eyebrow">02 / The ritual</p>
            <h2>
              Before the build,
              <br />
              <em>the thought.</em>
            </h2>
            <p>{profile.about[1]}</p>
            <span className="film-note">Original portrait. Coffee motion awaits likeness review.</span>
          </div>
          <figure className="film-original">
            <img
              src="/images/cinematic/original-portrait.jpg"
              alt="Original photograph of Varghese Shibu"
              width="1080"
              height="1080"
            />
            <figcaption>Varghese Shibu / Original photograph</figcaption>
          </figure>
          <div className="film-cup" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>
      <section className="film-chapter film-project" id="act-2" aria-label="The portal">
        <div className="film-stage">
          <div className="film-project-heading">
            <p className="film-eyebrow">03 / Through the portal</p>
            <h2>
              From a story.
              <br />
              <em>To something real.</em>
            </h2>
          </div>
          <div className="film-product">
            <ShowcaseFilm />
            <div className="film-project-caption">
              <div>
                <span className="film-eyebrow">Selected work / Kerasobha</span>
                <p>A considered commerce experience, from first impression to the engineering underneath.</p>
              </div>
              <Link to="/work/kerasobha">Explore the case study ↗</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="film-chapter film-engineer" id="act-3" aria-label="Engineering">
        <div className="film-stage">
          <div className="film-copy">
            <p className="film-eyebrow">04 / The engineer</p>
            <h2>
              Beautiful outside.
              <br />
              <em>Considered within.</em>
            </h2>
            <p>Follow a real request through Kerasobha. Choose a component to see the decisions behind it.</p>
          </div>
          <div className="film-system">
            <div className="film-system-grid">
              {systemNodes.map((n, i) => (
                <button key={n.id} onClick={() => setNode(n.id)} aria-pressed={node === n.id}>
                  <span>0{i + 1}</span>
                  {n.label}
                  <small>{n.sub}</small>
                </button>
              ))}
            </div>
            <article aria-live="polite">
              <span className="film-eyebrow">System / {selected.sub}</span>
              <h3>{selected.label}</h3>
              <p>{selected.description}</p>
            </article>
          </div>
        </div>
      </section>
      <section className="film-chapter film-ascent" id="act-4" aria-label="The ascent">
        <div className="film-stage">
          <div className="film-copy">
            <p className="film-eyebrow">05 / The ascent</p>
            <h2>
              Every step.
              <br />
              <em>A wider view.</em>
            </h2>
            <p>Research, platforms, payments, and the craft of building for people.</p>
          </div>
          <ol className="film-steps">
            {[...experience].reverse().map((role, i) => (
              <li key={role.id} style={{ "--step": i } as React.CSSProperties}>
                <span>
                  {role.start} — {role.end}
                </span>
                <h3>{role.company}</h3>
                <p>{role.role}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="film-chapter film-invitation" id="act-5" aria-label="Invitation">
        <div className="film-stage" id="invitation">
          <p className="film-eyebrow">06 / The invitation</p>
          <h2>
            Let's build
            <br />
            something
            <br />
            <em>exceptional.</em>
          </h2>
          <a className="film-contact" href={"mailto:" + profile.email}>
            {profile.email} ↗
          </a>
          <footer>
            <span>Varghese Shibu / Bengaluru, India</span>
            <Link to="/">Return to the portfolio ↗</Link>
            <span>Concept preview · Awaiting review</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
