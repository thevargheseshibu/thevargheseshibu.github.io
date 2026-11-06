import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { kerasobha, engineeringProjects } from "../../data/content";
import { useChapter } from "../../lib/use-chapter";
import { ease } from "../../lib/cinematic-scene";
import { SceneFooter } from "./PortraitScenes";

const frames = [
  { id: "story", title: "The origin", caption: "A story, rooted in Kerala.", image: "story-800.webp" },
  { id: "home", title: "The experience", caption: "A considered first impression.", image: "home-800.webp" },
  { id: "product", title: "The collection", caption: "From discovery to a daily ritual.", image: "product-800.webp" },
  { id: "order", title: "The order", caption: "A clear path from interest to enquiry.", image: "order-800.webp" },
];
export default function ProductScene() {
  const root = useRef<HTMLElement>(null);
  const [project, setProject] = useState(0);
  const { active, choose } = useChapter(root, 2.8, 4, (el, p) => {
    el.querySelectorAll<HTMLElement>(".product-plane").forEach((plane, i) => {
      const offset = i - p * 3;
      plane.style.transform = `translate3d(${offset * 102}%,${Math.abs(offset) * 8}%,${-Math.abs(offset) * 220}px) rotateY(${-offset * 18}deg) rotateZ(${offset * 2}deg)`;
      plane.style.opacity = String(Math.max(0, 1 - Math.abs(offset) * 0.32));
    });
    el.querySelector<HTMLElement>(".product-orbit")!.style.transform = `rotate(${-25 + ease(p) * 50}deg)`;
  });
  const item = engineeringProjects[project];
  return (
    <>
      <section
        id="work"
        ref={root}
        className="portfolio-scene product-scene"
        data-scene="product"
        aria-labelledby="work-title"
      >
        <div className="scene-stage">
          <div className="product-orbit" aria-hidden="true" />
          <div className="scene-heading">
            <p className="scene-label">02 / Selected product · {kerasobha.year}</p>
            <h2 id="work-title">
              A story you can
              <br />
              <em>move through.</em>
            </h2>
          </div>
          <div className="product-theatre" aria-label="Kerasobha product journey">
            {frames.map((frame, i) => (
              <figure key={frame.id} className="product-plane" aria-hidden={active !== i}>
                <div className="product-chrome">
                  <span />
                  <span />
                  <span />
                  <small>kerasobha.com / {frame.title}</small>
                </div>
                <img
                  src={`/images/kerasobha/${frame.image}`}
                  width={800}
                  height={500}
                  loading="lazy"
                  alt={`Kerasobha ${frame.title.toLowerCase()} — actual site capture`}
                />
                <figcaption>{frame.caption}</figcaption>
              </figure>
            ))}
          </div>
          <div className="product-caption">
            <span className="scene-label">Kerasobha / {frames[active].title}</span>
            <p>{kerasobha.summary}</p>
            <div>
              <Link className="scene-link" to="/work/kerasobha">
                Inside the case study ↗
              </Link>
              <a className="scene-link" href={kerasobha.liveUrl} target="_blank" rel="noopener noreferrer">
                Visit the product ↗
              </a>
            </div>
          </div>
          <div className="scene-selector product-selector" aria-label="Product chapters">
            {frames.map((frame, i) => (
              <button key={frame.id} onClick={() => choose(i)} aria-pressed={active === i}>
                <span>0{i + 1}</span>
                {frame.title}
              </button>
            ))}
          </div>
          <SceneFooter title="Product / Design & full-stack engineering" next="engineering" />
        </div>
      </section>
      <section className="engagement-gallery" aria-label="Engineering engagements">
        <div>
          <p className="scene-label">The engineering index / {engineeringProjects.length} engagements</p>
          <h3>
            Different problems.
            <br />
            <em>The same care.</em>
          </h3>
          <div className="engagement-picker" role="group" aria-label="Choose an engineering engagement">
            {engineeringProjects.map((p, i) => (
              <button key={p.slug} onClick={() => setProject(i)} aria-pressed={project === i}>
                {p.index} / {p.client}
              </button>
            ))}
          </div>
        </div>
        <article className="engagement-record" aria-live="polite">
          <span className="scene-label">{item.category}</span>
          <h4>{item.title}</h4>
          <p>{item.summary}</p>
          <ul>
            {item.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <span className="scene-label">{item.client} / Engineering contribution</span>
        </article>
      </section>
    </>
  );
}
