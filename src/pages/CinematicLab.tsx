import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createScrollScene, createVideoScrubber, ease, phase } from "../lib/cinematic-scene";
import { createWorld } from "../lib/cinematic-world";
import { useReducedMotion } from "../lib/motion";
import { systemNodes } from "../data/engineering";
import "../styles/cinematic-lab.css";

const chapters = ["The individual", "The passage", "The architecture"];
const routes = {
  page: {
    label: "Page request",
    nodes: ["browser", "assets"],
    text: "Browser → Edge assets. A static page is served directly; no API execution.",
  },
  enquiry: {
    label: "Enquiry",
    nodes: ["browser", "worker", "enquiries", "d1"],
    text: "Browser → Worker → Enquiries → D1. Validate consent and input, then persist an idempotent submission.",
  },
  email: {
    label: "Scheduled email",
    nodes: ["cron", "worker", "email", "d1"],
    text: "Cron → Worker → Resend, with outbox state in D1. Failed messages are retried with idempotency keys.",
  },
};

export default function CinematicLab() {
  const root = useRef<HTMLElement>(null),
    stage = useRef<HTMLDivElement>(null),
    canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const scene = useRef<ReturnType<typeof createScrollScene> | null>(null);
  const world = useRef<ReturnType<typeof createWorld> | null>(null);
  const [chapter, setChapter] = useState(0),
    [selected, setSelected] = useState("worker");
  const [trace, setTrace] = useState<keyof typeof routes | null>(null);
  const reduced = useReducedMotion();
  const node = systemNodes.find((n) => n.id === selected)!;

  useEffect(() => {
    const oldTitle = document.title;
    document.title = "The passage — Varghese Shibu / Cinematic lab";
    return () => {
      document.title = oldTitle;
    };
  }, []);

  useEffect(() => {
    const el = root.current!,
      view = stage.current!;
    const renderer = createWorld(canvas.current!, Array.from(el.querySelectorAll<HTMLElement>(".lab-node")));
    world.current = renderer;
    const scrubber = video.current ? createVideoScrubber(video.current) : null;
    const portrait = el.querySelector<HTMLElement>(".lab-portrait")!;
    const passage = el.querySelector<HTMLElement>(".lab-passage")!;
    const intro = el.querySelector<HTMLElement>(".lab-intro")!;
    const crossing = el.querySelector<HTMLElement>(".lab-crossing")!;
    const interfaceEl = el.querySelector<HTMLElement>(".lab-interface")!;
    const meter = el.querySelector<HTMLElement>(".lab-meter-fill")!;
    const counter = el.querySelector<HTMLElement>(".lab-counter")!;
    const heading = el.querySelector<HTMLElement>(".lab-world-title")!;
    let lastChapter = -1;
    scene.current = createScrollScene({
      root: el,
      stage: view,
      reduced,
      render(p) {
        el.dataset.progress = p.toFixed(4);
        const pull = ease(phase(p, 0.06, 0.34));
        const through = ease(phase(p, 0.3, 0.59));
        portrait.style.transform = `perspective(1400px) translate3d(${pull * -9}%,${pull * -2}%,${pull * -650}px) rotateY(${pull * 12}deg)`;
        portrait.style.clipPath = `inset(${pull * 9}% ${pull * 17}% ${pull * 9}% ${pull * 17}%)`;
        portrait.style.opacity = String(1 - ease(phase(p, 0.27, 0.37)));
        passage.style.clipPath = `inset(${(1 - ease(phase(p, 0.24, 0.44))) * 43}% ${(1 - ease(phase(p, 0.24, 0.44))) * 46}%)`;
        passage.style.transform = `scale(${1 + through * 1.9})`;
        passage.style.opacity = String(ease(phase(p, 0.24, 0.36)) * (1 - ease(phase(p, 0.48, 0.66))));
        intro.style.transform = `translate3d(${-pull * 30}%,${-pull * 35}%,0)`;
        intro.style.opacity = String(1 - phase(p, 0.12, 0.29));
        crossing.style.opacity = String(ease(phase(p, 0.3, 0.4)) * (1 - ease(phase(p, 0.49, 0.59))));
        crossing.style.transform = `translate(-50%,-50%) scale(${0.9 + through * 0.35})`;
        const interactive = p >= 0.78;
        interfaceEl.style.opacity = String(ease(phase(p, 0.7, 0.84)));
        interfaceEl.inert = !interactive;
        heading.style.opacity = String(ease(phase(p, 0.62, 0.76)));
        heading.style.transform = `translateY(${(1 - ease(phase(p, 0.62, 0.8))) * 65}px)`;
        view.style.setProperty("--world-light", String(ease(phase(p, 0.46, 0.8))));
        meter.style.transform = `scaleX(${p})`;
        counter.textContent = `${Math.round(p * 100)
          .toString()
          .padStart(3, "0")} / 100`;
        const current = p < 0.3 ? 0 : p < 0.65 ? 1 : 2;
        if (current !== lastChapter) {
          lastChapter = current;
          setChapter(current);
        }
        scrubber?.render(phase(p, 0.28, 0.62));
        renderer.render(p);
      },
    });
    return () => {
      scene.current?.destroy();
      renderer.destroy();
      scrubber?.destroy();
    };
  }, [reduced]);

  useEffect(() => {
    world.current?.select(selected, trace ? routes[trace].nodes : []);
  }, [selected, trace, reduced]);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const go = (p: number) => scene.current?.go(p);

  return (
    <main id="main" className={`cinematic-lab${reduced ? " lab-reduced" : ""}`} ref={root}>
      <div className="lab-stage" ref={stage}>
        <div className="lab-atmosphere" aria-hidden="true" />
        <div className="lab-passage" aria-hidden="true">
          {reduced ? (
            <img src="/media/cinematic/architectural-passage.webp" alt="" />
          ) : (
            <video
              ref={video}
              muted
              playsInline
              preload="auto"
              poster="/media/cinematic/architectural-passage.webp"
              src="/media/cinematic/architectural-passage.mp4"
            />
          )}
        </div>
        <div className="lab-portrait">
          <picture>
            <source media="(max-width: 650px)" srcSet="/images/editorial/atelier-mobile.webp" />
            <img
              src="/images/editorial/atelier-v2-1920.webp"
              alt="Varghese Shibu seated in a warmly lit, wood-panelled atelier"
              fetchPriority="high"
            />
          </picture>
          <div className="lab-portrait-shade" />
        </div>
        <canvas className="lab-canvas" ref={canvas} aria-hidden="true" />
        <header className="lab-header">
          <Link to="/" aria-label="Return to portfolio" className="lab-monogram">
            VS<span>Varghese Shibu</span>
          </Link>
          <span className="lab-edition">An interactive study / No. 01</span>
          <button onClick={() => go(0.86)}>
            Explore the system <span>↗</span>
          </button>
        </header>
        <div className="lab-intro">
          <p className="lab-eyebrow">Software engineer · Creative technologist</p>
          <h1>
            Every system
            <br />
            begins with
            <br />
            <em>a perspective.</em>
          </h1>
          <p className="lab-intro-note">
            A passage from the person
            <br />
            to the architecture beneath.
          </p>
        </div>
        <div className="lab-crossing" aria-hidden="true">
          <span className="lab-eyebrow">Beyond the surface</span>
          <p>
            Enter the
            <br />
            <em>architecture.</em>
          </p>
        </div>
        <div className="lab-world-title">
          <p className="lab-eyebrow">Kerasobha / A system, made spatial</p>
          <h2>
            Intent becomes <em>structure.</em>
          </h2>
        </div>
        <div className="lab-interface">
          <div
            className="lab-orbit"
            aria-label="Drag to rotate the architecture"
            onPointerDown={(e) => {
              if (e.target !== e.currentTarget) return;
              drag.current = { x: e.clientX, y: e.clientY };
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              world.current?.orbit(e.clientX - drag.current.x, e.clientY - drag.current.y);
              drag.current = { x: e.clientX, y: e.clientY };
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
          >
            {systemNodes.map((n, i) => (
              <button
                className={`lab-node${selected === n.id ? " selected" : ""}${trace && routes[trace].nodes.includes(n.id) ? " traced" : ""}`}
                key={n.id}
                aria-pressed={selected === n.id}
                aria-controls="lab-inspector"
                onClick={() => setSelected(n.id)}
              >
                <small>{String(i + 1).padStart(2, "0")}</small>
                {n.label}
              </button>
            ))}
          </div>
          <aside id="lab-inspector" className="lab-inspector" aria-live="polite">
            <p className="lab-eyebrow">Inspect / {node.id}</p>
            <h3>{node.label}</h3>
            <p>{node.description}</p>
            <span className="lab-inspector-foot">Architecture model · No live requests</span>
          </aside>
          <div className="lab-tools">
            <span className="lab-eyebrow">Trace a route</span>
            <div>
              {Object.entries(routes).map(([id, r]) => (
                <button
                  key={id}
                  aria-pressed={trace === id}
                  onClick={() => setTrace(trace === id ? null : (id as keyof typeof routes))}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <p aria-live="polite">
              {trace ? routes[trace].text : "Select a component to inspect. Drag the space to orbit."}
            </p>
          </div>
          <div className="lab-camera">
            <button aria-label="Zoom out" onClick={() => world.current?.zoom(-0.12)}>
              −
            </button>
            <button onClick={() => world.current?.reset()}>Reset view</button>
            <button aria-label="Zoom in" onClick={() => world.current?.zoom(0.12)}>
              +
            </button>
          </div>
        </div>
        <footer className="lab-footer">
          <div className="lab-chapters">
            {chapters.map((label, i) => (
              <button
                key={label}
                onClick={() => go([0, 0.42, 0.9][i])}
                aria-current={chapter === i ? "step" : undefined}
              >
                <span>0{i + 1}</span>
                <b>{label}</b>
              </button>
            ))}
          </div>
          <span className="lab-scroll-note">
            {reduced
              ? "Reduced motion · Explore freely"
              : chapter === 2
                ? "Scroll back to retrace the passage"
                : "Scroll to travel ↓"}
          </span>
          <span className="lab-counter">000 / 100</span>
        </footer>
        <div className="lab-meter">
          <div className="lab-meter-fill" />
        </div>
      </div>
    </main>
  );
}
