import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, Layers, MousePointer2 } from "lucide-react";
import { gsap, ScrollTrigger, useReducedMotion } from "../lib/motion";
import { scrollToTarget } from "../lib/smooth-scroll";
import { systemNodes } from "../data/engineering";
import "../styles/signature.css";
import CinematicVideo from "../components/CinematicVideo";

const chapters = [
  {
    short: "Perspective",
    title: "It starts with a perspective.",
    body: "Architecture, light and proportion. Before a line of code, an understanding of how the experience should feel.",
    note: "01 / A considered point of view",
  },
  {
    short: "Interface",
    title: "An idea becomes an interface.",
    body: "A clear hierarchy. A deliberate interaction. Expressive design becomes something people can understand and use.",
    note: "02 / Form finds its function",
  },
  {
    short: "System",
    title: "The interface is only the beginning.",
    body: "Follow a request from the browser to the edge, through an API and into persistent data. Select a component to see the decisions underneath.",
    note: "03 / Inspect the architecture",
  },
  {
    short: "Experience",
    title: "Every layer. One experience.",
    body: "Kerasobha connects a cinematic storefront with an edge API, a database and an order journey. Design and engineering, considered together.",
    note: "04 / From a system to a shipped product",
  },
];
const placements = [
  { id: "browser", left: 12, top: 47 },
  { id: "assets", left: 44, top: 19 },
  { id: "worker", left: 44, top: 63 },
  { id: "d1", left: 78, top: 38 },
  { id: "email", left: 78, top: 77 },
];

export default function CloseUp() {
  const root = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const [node, setNode] = useState("worker");
  const reduced = useReducedMotion();
  const selected = systemNodes.find((n) => n.id === node)!;

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1100px) and (prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(element);
      const layers = q(".signature-layer");
      gsap.set(layers, { autoAlpha: 0 });
      gsap.set(layers[0], { autoAlpha: 1 });
      gsap.set(q(".draft-stroke"), { strokeDashoffset: 1 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          pin: q(".signature-stage")[0],
          start: "top top",
          end: "+=165%",
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            element.style.setProperty("--scene-progress", String(self.progress));
            setActive(Math.min(3, Math.floor(self.progress * 4)));
          },
        },
      });
      tl.to(q(".draft-stroke"), { strokeDashoffset: 0, duration: 0.65, stagger: 0.035, ease: "none" }, 0)
        .to(
          q(".architectural-draft"),
          { rotateX: 0, rotateZ: 0, scale: 0.94, duration: 0.55, ease: "power2.inOut" },
          0.4,
        )
        .to(layers[0], { autoAlpha: 0, duration: 0.2 }, 0.85)
        .fromTo(layers[1], { autoAlpha: 0, y: 25 }, { autoAlpha: 1, y: 0, duration: 0.25 }, 0.9)
        .fromTo(q(".interface-window"), { rotateY: -15, rotateX: 8 }, { rotateY: 0, rotateX: 0, duration: 0.5 }, 1)
        .to(layers[1], { autoAlpha: 0, scale: 0.94, duration: 0.2 }, 1.85)
        .fromTo(layers[2], { autoAlpha: 0, scale: 1.06 }, { autoAlpha: 1, scale: 1, duration: 0.25 }, 1.9)
        .fromTo(
          q(".signature-path"),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: 0.65, stagger: 0.03, ease: "none" },
          2,
        )
        .to(layers[2], { autoAlpha: 0, y: -20, duration: 0.2 }, 2.85)
        .fromTo(
          layers[3],
          { autoAlpha: 0, clipPath: "inset(12% 12% 12% 12%)" },
          { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.3 },
          2.9,
        )
        .to({}, { duration: 0.8 });
      timeline.current = tl;
      trigger.current = tl.scrollTrigger!;
      return () => {
        timeline.current = null;
        trigger.current = null;
      };
    });
    return () => mm.revert();
  }, []);

  const choose = (index: number) => {
    setActive(index);
    if (trigger.current && timeline.current) {
      const progress = (index + 0.45) / 4;
      scrollToTarget(trigger.current.start + (trigger.current.end - trigger.current.start) * progress);
    } else if (root.current) {
      scrollToTarget(root.current, -80);
    }
  };

  return (
    <section ref={root} id="closeup" className="signature-section" data-active={active} aria-labelledby="closeup-title">
      <div className="signature-stage">
        <div className="shell signature-shell">
          <div className="signature-kicker label">
            <span>The art of engineering</span>
            <span>One idea. Every layer.</span>
          </div>
          <div className="signature-layout">
            <div className="signature-copy">
              <p className="label signature-note">{chapters[active].note}</p>
              <h2 id="closeup-title">
                Engineering
                <br />
                with precision.
                <br />
                <em>
                  Creating with
                  <br />
                  imagination.
                </em>
              </h2>
              <div className="signature-explanation" aria-live="polite">
                <h3>{chapters[active].title}</h3>
                <p>{chapters[active].body}</p>
              </div>
              {active === 3 ? (
                <Link className="signature-link" to="/work/kerasobha">
                  Inside the case study <ArrowUpRight size={16} aria-hidden />
                </Link>
              ) : (
                <p className="signature-hint">
                  <MousePointer2 size={13} aria-hidden /> <span>Scroll or select a chapter</span>
                </p>
              )}
            </div>
            <div className="signature-visual">
              <div
                className={"signature-layer signature-draft " + (active === 0 ? "is-current" : "")}
                aria-hidden={active !== 0}
                inert={active !== 0}
              >
                <img
                  className="signature-environment-poster"
                  src="/media/cinematic/architectural-passage.webp"
                  width={1280}
                  height={720}
                  alt=""
                  loading="lazy"
                />
                <CinematicVideo
                  base="/media/cinematic/architectural-passage"
                  poster="/media/cinematic/architectural-passage.webp"
                  className="signature-environment-film"
                  enabled={active === 0}
                />
                <div className="draft-caption label">
                  <span>Perspective study</span>
                  <span>Light / Structure / Space</span>
                </div>
                <svg
                  className="architectural-draft"
                  viewBox="0 0 800 600"
                  fill="none"
                  aria-label="Architectural line study"
                >
                  <defs>
                    <pattern id="draftgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 H 0 V 40" stroke="currentColor" strokeOpacity=".09" />
                    </pattern>
                  </defs>
                  <rect width="800" height="600" fill="url(#draftgrid)" />
                  {[
                    "M100 480V180H660V480H100Z",
                    "M180 480V240H590V480",
                    "M260 480V300H520V480",
                    "M100 180L260 300M660 180L520 300M100 480L260 430M660 480L520 430",
                    "M260 430H520M390 300V430",
                    "M60 530H710M60 520V540M710 520V540",
                    "M710 170V490M700 170H720M700 490H720",
                  ].map((d, i) => (
                    <path
                      key={d}
                      d={d}
                      className="draft-stroke"
                      pathLength="1"
                      stroke="currentColor"
                      strokeWidth={i < 3 ? 1.4 : 0.7}
                    />
                  ))}
                  <circle cx="390" cy="365" r="50" stroke="currentColor" strokeOpacity=".4" />
                  <path d="M390 280V450M305 365H475" stroke="currentColor" strokeOpacity=".3" />
                  <text x="335" y="570" fill="currentColor" stroke="none" fontSize="10" letterSpacing="4">
                    A HUMAN PERSPECTIVE
                  </text>
                </svg>
                <div className="draft-footer">
                  <span className="label">The experience starts here.</span>
                  <ArrowDownRight size={26} aria-hidden />
                </div>
              </div>
              <div
                className={"signature-layer signature-interface " + (active === 1 ? "is-current" : "")}
                aria-hidden={active !== 1}
                inert={active !== 1}
              >
                <div className="interface-window">
                  <div className="interface-chrome">
                    <span />
                    <span />
                    <span />
                    <span className="label">Kerasobha / Experience study</span>
                  </div>
                  <div className="interface-content">
                    <span className="label">From Kerala. With care.</span>
                    <p>
                      Rooted in nature.
                      <br />
                      <em>Designed for a ritual.</em>
                    </p>
                    <div className="interface-image">
                      <img
                        src="/images/kerasobha/home-800.webp"
                        width={800}
                        height={500}
                        loading="lazy"
                        alt="Kerasobha storefront interface preview"
                      />
                    </div>
                    <div className="interface-bottom label">
                      <span>Story → Product → Order</span>
                      <Layers size={16} aria-hidden />
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={"signature-layer signature-system " + (active === 2 ? "is-current" : "")}
                aria-hidden={active !== 2}
                inert={active !== 2}
              >
                <p className="label diagram-caption">Live architecture study / Kerasobha</p>
                <div className="signature-network">
                  <svg viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden>
                    {[
                      "M120 235H280V95H440",
                      "M120 235H280V315H440",
                      "M440 315H610V190H780",
                      "M440 315H610V385H780",
                    ].map((d) => (
                      <path key={d} d={d} className="signature-path" pathLength="1" />
                    ))}
                  </svg>
                  {placements.map((p) => {
                    const n = systemNodes.find((n) => n.id === p.id)!;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className={"signature-node " + (node === p.id ? "is-selected" : "")}
                        style={{ left: p.left + "%", top: p.top + "%" }}
                        onClick={() => setNode(p.id)}
                        aria-pressed={node === p.id}
                      >
                        <span className="node-point" />
                        <span>{n.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="signature-inspector" aria-live="polite">
                  <p className="label">Inspect / {selected.label}</p>
                  <p>{selected.description}</p>
                </div>
              </div>
              <div
                className={"signature-layer signature-product " + (active === 3 ? "is-current" : "")}
                aria-hidden={active !== 3}
                inert={active !== 3}
              >
                <img
                  src="/images/kerasobha/home.webp"
                  width={1600}
                  height={1000}
                  loading="lazy"
                  alt="Kerasobha, the completed brand and commerce experience"
                />
                <div className="signature-product-meta">
                  <span className="label">Design + Full-stack engineering</span>
                  <span>
                    Kerasobha <ArrowUpRight size={22} aria-hidden />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="signature-controls" aria-label="Transformation chapters">
            {chapters.map((chapter, i) => (
              <button
                key={chapter.short}
                type="button"
                onClick={() => choose(i)}
                aria-current={active === i ? "step" : undefined}
              >
                <span className="label">0{i + 1}</span>
                <span>{chapter.short}</span>
                <span className="chapter-line" />
              </button>
            ))}
          </div>
          <span
            className="signature-progress"
            aria-hidden
            style={{ transform: "scaleX(" + (reduced ? (active + 1) / 4 : "var(--scene-progress, 0)") + ")" }}
          />
        </div>
      </div>
    </section>
  );
}
