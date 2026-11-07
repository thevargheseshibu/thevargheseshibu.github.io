import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { engineeringProjects, kerasobha } from "../data/content";
import { Arrow, Label, usePhone } from "./shared";

const views = [
  { id: "home", label: "The experience", title: "A story you can shop.", detail: kerasobha.overview[0] },
  {
    id: "product",
    label: "The interface",
    title: "Detail with a purpose.",
    detail: "Product information, native Malayalam labels and care rituals connect the brand story to the collection.",
  },
  {
    id: "order",
    label: "The order journey",
    title: "Clarity all the way through.",
    detail: kerasobha.decisions[5].body,
  },
] as const;

export function EvidenceWindow({ caseStudy = false }: { caseStudy?: boolean }) {
  const [selected, setSelected] = useState(0);
  const [playing, setPlaying] = useState(false);
  const phone = usePhone();
  const video = useRef<HTMLVideoElement>(null);
  const [mediaError, setMediaError] = useState(false);
  const active = views[selected];
  useEffect(() => {
    setPlaying(false);
  }, [selected, phone]);
  useEffect(() => {
    const media = video.current;
    if (!media || !playing) return;
    media.load();
    void media.play().catch((error: DOMException) => {
      if (error.name === "NotSupportedError") {
        setPlaying(false);
        setMediaError(true);
      }
    });
    const fallback = setTimeout(() => {
      if (media.readyState < 2) {
        setPlaying(false);
        setMediaError(true);
      }
    }, 8000);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) media.pause();
    });
    observer.observe(media);
    const pause = () => {
      if (document.hidden) media.pause();
    };
    document.addEventListener("visibilitychange", pause);
    return () => {
      clearTimeout(fallback);
      observer.disconnect();
      document.removeEventListener("visibilitychange", pause);
    };
  }, [playing]);
  return (
    <div className={`os-evidence ${phone ? "os-evidence-phone" : "os-evidence-desktop"}`}>
      <div className="os-evidence-controls" role="group" aria-label="Kerasobha interface views">
        {views.map((view, i) => (
          <button
            key={view.id}
            onClick={() => {
              setSelected(i);
              setMediaError(false);
            }}
            aria-pressed={i === selected}
          >
            <span>0{i + 1}</span>
            {view.label}
            <Arrow />
          </button>
        ))}
      </div>
      <div className="os-evidence-frame">
        <div className="os-browser-bar">
          <span aria-hidden="true">○ ○ ○</span>
          <span>kerasobha.com / {active.id === "home" ? "collection" : active.id}</span>
          <a href={kerasobha.liveUrl} target="_blank" rel="noreferrer" aria-label="Visit Kerasobha website">
            <Arrow />
          </a>
        </div>
        <div
          className="os-evidence-screen"
          role="region"
          aria-label="Scrollable project interface preview"
          tabIndex={0}
          id={caseStudy ? "case-interface" : "project-interface"}
        >
          {playing ? (
            <video
              ref={video}
              controls
              autoPlay
              muted
              playsInline
              preload="auto"
              poster={`/images/kerasobha/${phone ? "home-mobile" : "home-1920"}.webp`}
              onError={() => {
                setPlaying(false);
                setMediaError(true);
              }}
            >
              <source src="/media/kerasobha/website-smooth-1080.mp4" type="video/mp4" />
              <track
                kind="captions"
                src="/media/kerasobha/walkthrough.vtt"
                srcLang="en"
                label="English descriptions"
                default
              />
            </video>
          ) : (
            <img
              key={`${active.id}-${phone}`}
              src={`/images/kerasobha/${active.id}${phone && active.id === "home" ? "-mobile" : phone && active.id === "product" ? "-mobile" : "-1920"}.webp`}
              alt={`Actual Kerasobha ${active.label.toLowerCase()} screenshot`}
              width={phone && active.id !== "order" ? 390 : 1920}
              height={phone && active.id !== "order" ? 844 : 1200}
              loading="lazy"
            />
          )}
        </div>
        <div className="os-evidence-caption">
          <span>Real interface / {kerasobha.year}</span>
          <button
            onClick={() => {
              setPlaying(!playing);
              setMediaError(false);
            }}
            aria-pressed={playing}
          >
            {playing ? "Return to stills" : "Play walkthrough"} <span aria-hidden="true">{playing ? "×" : "▷"}</span>
          </button>
        </div>
      </div>
      <div className="os-evidence-story" aria-live="polite">
        <Label>
          0{selected + 1} / {active.label}
        </Label>
        <h3>{active.title}</h3>
        <p>{active.detail}</p>
        {mediaError && <p role="status">The film couldn’t load. The interface images remain available.</p>}
      </div>
    </div>
  );
}

export function FeaturedWork() {
  return (
    <section className="os-work" id="work">
      <div className="os-section-top">
        <Label>01 / Selected work</Label>
        <span>From an idea to the whole product.</span>
      </div>
      <div className="os-work-title">
        <h2>
          {kerasobha.title}
          <span aria-hidden="true">↗</span>
        </h2>
        <div>
          <Label>{kerasobha.category}</Label>
          <p>{kerasobha.summary}</p>
          <Link className="os-text-link" to="/work/kerasobha">
            Explore the case study <Arrow />
          </Link>
        </div>
      </div>
      <EvidenceWindow />
      <div className="os-project-spec">
        <div>
          <Label>My role</Label>
          <p>{kerasobha.role}</p>
        </div>
        <div>
          <Label>Interface</Label>
          <p>React / Next.js / TypeScript</p>
        </div>
        <div>
          <Label>Infrastructure</Label>
          <p>Cloudflare Workers / D1</p>
        </div>
        <Link to="/work/kerasobha" aria-label="Read Kerasobha engineering decisions" className="os-circle-link">
          <Arrow />
        </Link>
      </div>
    </section>
  );
}

const steps = [
  {
    name: "Interface",
    code: "01 / React",
    heading: "Start with the person.",
    body: "An enquiry starts in the browser. Product information and a clear consent step prepare a request the API can validate.",
    node: "Browser",
    detail: "A static export serves the experience. Only /api/* requests reach the Worker.",
  },
  {
    name: "Edge API",
    code: "02 / Worker",
    heading: "Make the boundary deliberate.",
    body: kerasobha.decisions[2].body,
    node: "Validation",
    detail: "Same-origin checks, server validation, honeypot, consent and rate limiting protect public endpoints.",
  },
  {
    name: "Data",
    code: "03 / D1",
    heading: "Remember what matters.",
    body: kerasobha.decisions[1].body,
    node: "Persistence",
    detail: "Versioned SQL migrations keep the data model explicit as the product grows.",
  },
  {
    name: "Delivery",
    code: "04 / Cron + email",
    heading: "Plan for the second attempt.",
    body: kerasobha.decisions[4].body,
    node: "Retry",
    detail: "Scheduled maintenance handles unsent email and abandoned data. Retry is part of the design.",
  },
] as const;

export function RequestLens() {
  const [step, setStep] = useState(0);
  const [tracing, setTracing] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setTracing(false);
  };
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
    },
    [],
  );
  const trace = () => {
    stop();
    setStep(0);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(3);
      return;
    }
    setTracing(true);
    let current = 0;
    timer.current = setInterval(() => {
      current++;
      setStep(current);
      if (current === 3) stop();
    }, 1300);
  };
  const active = steps[step];
  return (
    <section className="os-system" id="engineering">
      <div className="os-section-top">
        <Label>02 / Beneath the surface</Label>
        <span>Architecture study / Kerasobha</span>
      </div>
      <div className="os-system-title">
        <h2>
          The structure
          <br />
          behind the feeling<span>.</span>
        </h2>
        <p>
          Good experiences depend on decisions you never see.
          <br />
          Follow one enquiry beneath the interface.
        </p>
      </div>
      <div className="os-request-lens" data-step={step}>
        <div className="os-system-model">
          <div className="os-system-ruler" aria-hidden="true">
            <span>REQUEST → RESPONSE</span>
            <span>SECTION A—A</span>
          </div>
          <div className="os-system-planes" role="group" aria-label="Explore request architecture">
            {steps.map((s, i) => (
              <button
                className={`os-system-plane ${i <= step ? "is-reached" : ""}`}
                key={s.name}
                aria-pressed={i === step}
                onClick={() => {
                  stop();
                  setStep(i);
                }}
              >
                <span>{s.code}</span>
                <strong>{s.name}</strong>
                <i aria-hidden="true">{i === step ? "↗" : "+"}</i>
              </button>
            ))}
          </div>
          <div className="os-trace-footer">
            <button className="os-trace-button" onClick={tracing ? stop : trace}>
              {tracing ? "Pause trace" : "Trace an enquiry"} <span aria-hidden="true">{tracing ? "Ⅱ" : "→"}</span>
            </button>
            <span>
              Illustrated request path.
              <br />
              No live service calls.
            </span>
          </div>
        </div>
        <div className="os-system-explanation" aria-live="polite" aria-atomic="true">
          <Label>{active.code}</Label>
          <h3>{active.heading}</h3>
          <p>{active.body}</p>
          <div className="os-system-detail">
            <span aria-hidden="true">↳</span>
            <p>{active.detail}</p>
          </div>
          <Link className="os-text-link" to="/work/kerasobha#decisions">
            Read the engineering decisions <Arrow />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Engagements() {
  const [index, setIndex] = useState(0);
  const project = engineeringProjects[index];
  const change = (value: number) => setIndex((value + engineeringProjects.length) % engineeringProjects.length);
  return (
    <section className="os-engagements" aria-labelledby="engagement-title">
      <div className="os-section-top">
        <Label>Selected engineering engagements</Label>
        <span>Payments / Aviation / Research / Commerce</span>
      </div>
      <div className="os-engagement-layout">
        <div className="os-engagement-index">
          <h2 id="engagement-title">
            Different contexts.
            <br />
            The same care.
          </h2>
          <label htmlFor="engagement-select">Explore an engagement</label>
          <select id="engagement-select" value={index} onChange={(e) => setIndex(Number(e.target.value))}>
            {engineeringProjects.map((p, i) => (
              <option value={i} key={p.slug}>
                {p.index} — {p.title}
              </option>
            ))}
          </select>
          <div className="os-engagement-paging">
            <button onClick={() => change(index - 1)} aria-label="Previous engagement">
              ←
            </button>
            <span>
              {String(index + 1).padStart(2, "0")} / {engineeringProjects.length}
            </span>
            <button onClick={() => change(index + 1)} aria-label="Next engagement">
              →
            </button>
          </div>
        </div>
        <article className="os-engagement-card" aria-live="polite" aria-atomic="true">
          <div className="os-engagement-drawing" aria-hidden="true">
            <i />
            <i />
            <i />
            <span>{project.index}</span>
            <small>ENGINEERING / FIELD NOTES</small>
          </div>
          <Label>
            {project.client} / {project.category}
          </Label>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <ul className="os-tags">
            {project.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="os-engagement-disclosure">
            Client engagement · Illustrative composition; no client interface shown.
          </p>
        </article>
      </div>
    </section>
  );
}
