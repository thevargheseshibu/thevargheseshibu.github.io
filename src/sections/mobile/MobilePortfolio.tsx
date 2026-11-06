import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  awards,
  certifications,
  education,
  educationResearch,
  engineeringProjects,
  experience,
  kerasobha,
  profile,
  socials,
  stack,
} from "../../data/content";
import { systemNodes } from "../../data/engineering";
import { createWorld } from "../../lib/cinematic-world";
import { gsap, ScrollTrigger, useReducedMotion } from "../../lib/motion";
import { scrollToTarget } from "../../lib/smooth-scroll";
import ShowcaseFilm from "../../components/ShowcaseFilm";
import ArchitecturalFilm from "../../components/ArchitecturalFilm";
import { usePortfolioPreview, originalPortrait } from "../../lib/portfolio-preview";
import "../../styles/mobile-portfolio.css";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mp-eyebrow">{children}</p>;
}
function ChapterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <a
      className="mp-link"
      href={`#${to}`}
      onClick={(e) => {
        e.preventDefault();
        scrollToTarget(`#${to}`);
      }}
    >
      {children}
      <span>↗</span>
    </a>
  );
}

function MobileArrival() {
  const preview = usePortfolioPreview();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.to(".mp-arrival-image", {
        yPercent: 12,
        scale: 1.08,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <section ref={root} id="top" className="mp-arrival" data-mobile-chapter="portrait" aria-labelledby="hero-title">
      <img
        className="mp-arrival-image"
        data-portrait
        src={preview ? originalPortrait.src : "/images/editorial/atelier-mobile.webp"}
        width={900}
        height={1500}
        alt={preview ? originalPortrait.alt : "Varghese Shibu in the walnut atelier"}
        fetchPriority="high"
      />
      <div className="mp-arrival-shade" />
      <div className="mp-arrival-copy">
        <Eyebrow>Varghese Shibu / Creative engineering</Eyebrow>
        <h1 id="hero-title">
          Varghese <br />
          <em>Shibu.</em>
          <span className="sr-only"> — Full-Stack Developer</span>
        </h1>
        <p>
          {profile.title}
          <span>{profile.employer} · Bengaluru</span>
        </p>
        <ChapterLink to="work">Explore the work</ChapterLink>
      </div>
      <div className="mp-arrival-foot">
        <span>Selected portfolio / 2026</span>
        <a
          href="#closeup"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("#closeup");
          }}
        >
          Enter the experience ↓
        </a>
      </div>
    </section>
  );
}

function MobilePassage() {
  const preview = usePortfolioPreview();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true },
      });
      tl.to(".mp-passage-image", { scale: 1.6, xPercent: -8, ease: "none" }, 0)
        .to(".mp-passage-frame", { scale: 4, opacity: 0, ease: "power1.in" }, 0)
        .to(".mp-passage-word", { yPercent: -30, ease: "none" }, 0);
    }, root);
    return () => ctx.revert();
  }, [reduced]);
  return (
    <section
      id="closeup"
      ref={root}
      className="mp-passage"
      data-mobile-chapter="passage"
      aria-labelledby="closeup-title"
    >
      <div className="mp-passage-stage">
        {preview ? (
          <div className="mp-passage-image mp-passage-film">
            <ArchitecturalFilm chapter={root} native />
          </div>
        ) : (
          <>
            <img
              className="mp-passage-image"
              src="/media/cinematic/architectural-passage.webp"
              alt="A passage through warm walnut, travertine and light"
              loading="lazy"
            />
          </>
        )}
        <div className="mp-passage-shade" />
        <div className="mp-passage-frame" aria-hidden="true" />
        <div className="mp-passage-word">
          <Eyebrow>A considered point of view</Eyebrow>
          <h2 id="closeup-title">
            Step
            <br />
            <em>inside.</em>
          </h2>
          <p>
            From the person
            <br />
            to the systems beneath.
          </p>
        </div>
        <span className="mp-passage-note">A perspective becomes a practice.</span>
      </div>
    </section>
  );
}

function MobileAbout() {
  const preview = usePortfolioPreview();
  return (
    <section id="about" className="mp-about mp-paper" data-mobile-chapter="perspective" aria-labelledby="about-title">
      <div className="mp-heading">
        <Eyebrow>01 / Behind the work</Eyebrow>
        <h2 id="about-title">
          An independent
          <br />
          <em>mind.</em>
        </h2>
      </div>
      <figure className="mp-about-photo">
        <img
          src={preview ? originalPortrait.src : "/images/editorial/architect.webp"}
          width={1400}
          height={788}
          loading="lazy"
          alt={preview ? originalPortrait.alt : "Varghese against limestone architecture"}
        />
        <figcaption>Engineer by discipline. Creator by instinct.</figcaption>
      </figure>
      <div className="mp-prose">
        <p className="mp-lead">{profile.intro}</p>
        {profile.about.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <div className="mp-about-facts">
          <span>
            Building since <b>2019</b>
          </span>
          <span>
            Based in <b>Bengaluru, India</b>
          </span>
        </div>
        <ChapterLink to="experience">The journey so far</ChapterLink>
      </div>
    </section>
  );
}

function MobileWork() {
  const [selected, setSelected] = useState(0);
  const project = engineeringProjects[selected];
  return (
    <section id="work" className="mp-work" data-mobile-chapter="product" aria-labelledby="work-title">
      <div className="mp-heading">
        <Eyebrow>02 / Product & platform</Eyebrow>
        <h2 id="work-title">
          A little Kerala.
          <br />
          <em>A whole world.</em>
        </h2>
        <p>Design, storytelling and a complete commerce platform.</p>
      </div>
      <ShowcaseFilm />
      <div className="mp-work-story">
        <span className="mp-project-number">01 / 2026</span>
        <h3>Kerasobha.</h3>
        <p>{kerasobha.summary}</p>
        <div className="mp-work-links">
          <Link className="mp-link" to="/work/kerasobha">
            Inside the case study <span>↗</span>
          </Link>
          <a className="mp-link" href={kerasobha.liveUrl} target="_blank" rel="noopener noreferrer">
            Visit the product <span>↗</span>
          </a>
        </div>
        <details className="mp-still-gallery">
          <summary>
            Explore the 4K captures <span>+</span>
          </summary>
          {["home", "story", "product", "order"].map((name) => (
            <figure key={name}>
              <img
                src={`/images/kerasobha/${name}-1920.webp`}
                srcSet={`/images/kerasobha/${name}-1920.webp 1920w, /images/kerasobha/${name}-4k.webp 3840w`}
                sizes="100vw"
                width={3840}
                height={2160}
                loading="lazy"
                alt={`Kerasobha ${name} — native 4K website capture`}
              />
              <figcaption>{name} / 3840 × 2160 capture</figcaption>
            </figure>
          ))}
        </details>
      </div>
      <div className="mp-engagements">
        <Eyebrow>Further engineering / {engineeringProjects.length} engagements</Eyebrow>
        <h3>
          Different challenges.
          <br />
          <em>The same care.</em>
        </h3>
        <div className="mp-chip-strip engagement-picker" aria-label="Engineering engagements">
          {engineeringProjects.map((p, i) => (
            <button key={p.slug} aria-pressed={selected === i} onClick={() => setSelected(i)}>
              {p.client}
            </button>
          ))}
        </div>
        <article className="mp-engagement-record engagement-record" aria-live="polite">
          <span className="mp-eyebrow">{project.category}</span>
          <h4>{project.title}</h4>
          <p>{project.summary}</p>
          <ul>
            {project.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function MobileSystem() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const world = useRef<ReturnType<typeof createWorld> | null>(null);
  const [active, setActive] = useState("worker"),
    [trace, setTrace] = useState(false);
  const drag = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const renderer = createWorld(canvas.current!, []);
    renderer.render(1);
    world.current = renderer;
    return () => renderer.destroy();
  }, []);
  useEffect(() => {
    world.current?.select(active, trace ? ["browser", "worker", "enquiries", "d1"] : []);
  }, [active, trace]);
  const node = systemNodes.find((n) => n.id === active)!;
  return (
    <section id="engineering" className="mp-system" data-mobile-chapter="system" aria-labelledby="engineering-title">
      <div className="mp-heading">
        <Eyebrow>03 / Beneath the interface</Eyebrow>
        <h2 id="engineering-title">
          Every layer.
          <br />
          <em>Connected.</em>
        </h2>
        <p>Move through the architecture. Inspect what each part does.</p>
      </div>
      <div
        className="mp-system-world"
        role="group"
        tabIndex={0}
        aria-label="Spatial architecture. Drag horizontally or use arrow keys to orbit."
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            world.current?.orbit(e.key === "ArrowRight" ? 18 : -18, 0);
          }
        }}
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          world.current?.orbit(e.clientX - drag.current.x, 0);
          drag.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <canvas ref={canvas} aria-hidden="true" />
        <span className="mp-world-caption">Kerasobha / {node.label}</span>
        <span className="mp-world-drag">Drag to orbit ↔</span>
      </div>
      <div className="mp-model-tools">
        <button onClick={() => world.current?.zoom(-0.12)} aria-label="Zoom out">
          −
        </button>
        <button onClick={() => world.current?.reset()}>Reset view</button>
        <button onClick={() => world.current?.zoom(0.12)} aria-label="Zoom in">
          +
        </button>
      </div>
      <div className="mp-system-picker" aria-label="Architecture components">
        {systemNodes.map((n, i) => (
          <button
            key={n.id}
            aria-pressed={active === n.id}
            aria-controls="mobile-system-inspector"
            onClick={() => setActive(n.id)}
          >
            <small>0{i + 1}</small>
            {n.label}
          </button>
        ))}
      </div>
      <article className="mp-inspector" id="mobile-system-inspector" aria-live="polite">
        <Eyebrow>Inspect / {node.id}</Eyebrow>
        <h3>{node.label}</h3>
        <p>{node.description}</p>
      </article>
      <button
        className="mp-trace"
        onClick={() => setTrace(!trace)}
        aria-pressed={trace}
        aria-label={trace ? "Hide enquiry route" : "Trace an enquiry"}
      >
        {trace ? "Hide enquiry route" : "Trace an enquiry"}
        <span aria-hidden="true">↗</span>
      </button>
      {trace && <p className="mp-trace-path">Browser → Worker → Enquiries → D1</p>}
      <p className="mp-model-note">Architecture model · No live requests</p>
      <div className="mp-decisions">
        {kerasobha.decisions.map((d, i) => (
          <details key={d.title}>
            <summary>
              <small>0{i + 1}</small>
              {d.title}
              <span>+</span>
            </summary>
            <p>{d.body}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function MobileTools() {
  const [active, setActive] = useState(0);
  const group = stack[active];
  return (
    <section id="stack" className="mp-tools mp-paper" data-mobile-chapter="toolset" aria-labelledby="stack-title">
      <div className="mp-heading">
        <Eyebrow>04 / The working vocabulary</Eyebrow>
        <h2 id="stack-title">
          Chosen
          <br />
          <em>with care.</em>
        </h2>
      </div>
      <div className="mp-tools-mark" aria-hidden="true">
        <i />
        <i />
        <span>VS</span>
      </div>
      <div className="mp-chip-strip" role="tablist" aria-label="Technology disciplines">
        {stack.map((g, i) => (
          <button
            role="tab"
            id={`mobile-tool-${g.id}`}
            aria-controls="mobile-tool-panel"
            aria-selected={active === i}
            key={g.id}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const next = (i + (e.key === "ArrowRight" ? 1 : -1) + stack.length) % stack.length;
              setActive(next);
              document.getElementById(`mobile-tool-${stack[next].id}`)?.focus({ preventScroll: true });
            }}
          >
            {g.label}
          </button>
        ))}
      </div>
      <article
        className="mp-tool-panel"
        id="mobile-tool-panel"
        role="tabpanel"
        aria-labelledby={`mobile-tool-${group.id}`}
      >
        <h3>{group.builds}</h3>
        <ul>
          {group.items.map((t, i) => (
            <li key={t}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {t}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

function MobileJourney() {
  return (
    <section id="experience" className="mp-journey" data-mobile-chapter="journey" aria-labelledby="experience-title">
      <div className="mp-heading">
        <Eyebrow>05 / Research → product → platform</Eyebrow>
        <h2 id="experience-title">
          A practice
          <br />
          <em>in motion.</em>
        </h2>
        <p>Research labs. Airline platforms. Payment infrastructure. One continuous pursuit of better work.</p>
      </div>
      <ol className="mp-career">
        {experience.map((role) => (
          <li className="mp-role" key={role.id}>
            <div className="mp-role-date">
              <span>{role.yearLabel}</span>
              {role.end === "Present" && <b>Current</b>}
            </div>
            <h3>{role.company}</h3>
            <p className="mp-role-title">{role.role}</p>
            <p className="mp-role-range">
              {role.start} — {role.end}
            </p>
            <p>{role.summary}</p>
            <details>
              <summary>
                Inside the role <span>+</span>
              </summary>
              <div>
                <ul>
                  {role.responsibilities.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                {role.positions?.map((p) => (
                  <p key={p.role}>
                    <strong>{p.role}</strong>
                    <br />
                    {p.start} — {p.end}
                    <br />
                    {p.summary}
                  </p>
                ))}
                {role.programmes?.map((p) => (
                  <div key={p.name}>
                    <strong>{p.name}</strong>
                    <p>{p.where}</p>
                    <ul>
                      {p.points.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {role.clients.length > 0 && <p>Engagements: {role.clients.join(" · ")}</p>}
              </div>
            </details>
          </li>
        ))}
      </ol>
      <div className="mp-credentials">
        <Eyebrow>A continuing practice</Eyebrow>
        <h3>
          Qualifications
          <br />
          <em>& recognition.</em>
        </h3>
        {profile.resumeUrl && (
          <a className="mp-resume" href={profile.resumeUrl} download>
            Download résumé <span>↗</span>
          </a>
        )}
        <details>
          <summary>
            Certifications <span>+</span>
          </summary>
          {certifications.map((c) => (
            <p key={c.title}>
              {c.title}
              <small>
                {c.issuer} / {c.year}
              </small>
            </p>
          ))}
        </details>
        <details>
          <summary>
            Awards <span>+</span>
          </summary>
          {awards.map((a, i) => (
            <p key={i}>
              {a.title}
              <small>
                {a.issuer}
                {"year" in a ? ` / ${a.year}` : ""}
              </small>
            </p>
          ))}
        </details>
      </div>
    </section>
  );
}

function MobileEducation() {
  return (
    <section
      id="education"
      className="mp-education mp-paper"
      data-mobile-chapter="foundations"
      aria-labelledby="education-title"
    >
      <div className="mp-heading">
        <Eyebrow>06 / The foundations</Eyebrow>
        <h2 id="education-title">
          Curiosity,
          <br />
          <em>given direction.</em>
        </h2>
      </div>
      <ol>
        {education.map((e, i) => (
          <li className="mp-education-record" key={e.id}>
            <div className="mp-education-top">
              <img
                src={`/images/institutions/${i === 0 ? "mgu" : "cbse"}.jpg`}
                width={54}
                height={54}
                alt=""
                loading="lazy"
              />
              <span>
                {e.start}
                <br />— {e.end}
              </span>
            </div>
            <h3>{e.degree}</h3>
            <p className="mp-education-field">{e.field}</p>
            <a href={e.href} target="_blank" rel="noopener noreferrer">
              {e.board} ↗
            </a>
            <p>
              {e.institution}
              <br />
              {e.location}
            </p>
            <p>{e.note}</p>
            {i === 0 && (
              <details>
                <summary>
                  Research & thesis <span>+</span>
                </summary>
                <div>
                  <h4>{educationResearch.title}</h4>
                  <p>{educationResearch.focus}</p>
                  <p>{educationResearch.body}</p>
                </div>
              </details>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

function MobileContact() {
  const preview = usePortfolioPreview();
  const [copied, setCopied] = useState(false),
    [error, setError] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setError(false);
    } catch {
      setError(true);
    }
  };
  return (
    <section id="contact" className="mp-contact" data-mobile-chapter="closing" aria-labelledby="contact-title">
      <div className="mp-contact-portrait">
        <img
          src={preview ? originalPortrait.src : "/images/editorial/after-hours.webp"}
          width={1400}
          height={788}
          alt={preview ? originalPortrait.alt : "An evening portrait of Varghese Shibu"}
          loading="lazy"
        />
        <div />
      </div>
      <div className="mp-contact-copy">
        <Eyebrow>07 / The next chapter</Eyebrow>
        <h2 id="contact-title">
          Let's make
          <br />
          <em>it matter.</em>
        </h2>
        <p>
          A considered idea deserves
          <br />
          an equally considered execution.
        </p>
        <a className="mp-email cta" href={`mailto:${profile.email}`}>
          {profile.email}
          <span>↗</span>
          <i className="cta-fill" />
        </a>
        <div className="mp-contact-actions">
          <button onClick={copy}>{copied ? "Copied ✓" : "Copy email"}</button>
          <a href={profile.phoneHref}>{profile.phone}</a>
        </div>
        <p className="mp-copy-status" role="status">
          {error ? "Copy unavailable. Use the email link above." : copied ? "Email copied to clipboard." : ""}
        </p>
        <div className="mp-socials">
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
      <footer>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>Portraits art-directed with AI</p>
        <ChapterLink to="top">Return to the beginning</ChapterLink>
      </footer>
    </section>
  );
}

export default function MobilePortfolio() {
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <main id="main" className="mobile-portfolio">
      <MobileArrival />
      <MobilePassage />
      <MobileAbout />
      <MobileWork />
      <MobileSystem />
      <MobileTools />
      <MobileJourney />
      <MobileEducation />
      <MobileContact />
    </main>
  );
}
