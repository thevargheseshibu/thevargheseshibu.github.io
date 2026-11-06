import { useRef } from "react";
import ArchitecturalFilm from "../../components/ArchitecturalFilm";
import { usePortfolioPreview, originalPortrait } from "../../lib/portfolio-preview";
import { Link } from "react-router-dom";
import { profile } from "../../data/content";
import { ease, phase } from "../../lib/cinematic-scene";
import { useChapter } from "../../lib/use-chapter";
import { scrollToTarget } from "../../lib/smooth-scroll";

export function SceneFooter({ title, next }: { title: string; next?: string }) {
  return (
    <div className="scene-footer">
      <span>{title}</span>
      <span className="scene-motion-hint">Scroll to travel · Reverse to retrace</span>
      {next && (
        <a
          href={`#${next}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(`#${next}`);
          }}
        >
          Next chapter ↘
        </a>
      )}
      <i />
    </div>
  );
}

export function PortraitScene() {
  const preview = usePortfolioPreview();
  const root = useRef<HTMLElement>(null);
  useChapter(root, 1.8, 1, (el, p) => {
    const pull = ease(p);
    const image = el.querySelector<HTMLElement>(".portrait-plane")!;
    image.style.transform = `perspective(1300px) translate3d(${pull * 8}%,0,${-pull * 700}px) rotateY(${-pull * 13}deg)`;
    image.style.clipPath = `inset(${pull * 10}% ${pull * 10}%)`;
    const copy = el.querySelector<HTMLElement>(".portrait-copy")!;
    copy.style.transform = `translate3d(${-pull * 25}%,${-pull * 15}%,0)`;
    copy.style.opacity = String(1 - ease(phase(p, 0.2, 0.7)));
    el.querySelector<HTMLElement>(".portrait-destination")!.style.transform = `translate3d(0,${(1 - pull) * 110}%,0)`;
  });
  return (
    <section
      id="top"
      ref={root}
      className="portfolio-scene portrait-scene"
      data-scene="portrait"
      aria-labelledby="hero-title"
    >
      <div className="scene-stage">
        <div className="portrait-plane">
          {preview ? (
            <picture className="authentic-portrait">
              <img data-portrait {...originalPortrait} fetchPriority="high" />
            </picture>
          ) : (
            <picture>
              <source media="(max-width:650px)" srcSet="/images/editorial/atelier-mobile.webp" />
              <source
                media="(min-width:651px)"
                srcSet="/images/editorial/atelier-v2-1920.webp 1920w, /images/editorial/atelier-v2-2560.webp 2560w, /images/editorial/atelier-v2-3840.webp 3840w"
                sizes="100vw"
              />
              <img
                data-portrait
                src="/images/editorial/atelier-v2-1920.webp"
                width={1920}
                height={1080}
                alt="Varghese Shibu seated in a walnut atelier, wearing charcoal tailoring"
                fetchPriority="high"
              />
            </picture>
          )}
          <div />
        </div>
        <div className="portrait-copy">
          <p className="scene-label">
            {profile.title} / {profile.employer}
          </p>
          <h1 id="hero-title">
            Varghese <br />
            <em>Shibu.</em>
            <span className="sr-only"> — Full-Stack Developer</span>
          </h1>
          <p>
            Considered interfaces.
            <br />
            <em>Exceptional systems.</em>
          </p>
          <a
            className="scene-link"
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#work");
            }}
          >
            Explore selected work ↗
          </a>
        </div>
        <div className="portrait-destination" aria-hidden="true">
          <span>Perspective</span>
          <small>The beginning of everything.</small>
        </div>
        <SceneFooter title="00 / The individual" next="closeup" />
      </div>
    </section>
  );
}

export function PassageScene() {
  const preview = usePortfolioPreview();
  const root = useRef<HTMLElement>(null);
  useChapter(root, 1.5, 1, (el, p) => {
    el.querySelector<HTMLElement>(".passage-photo")!.style.transform = `scale(${1 + p * 0.45}) translateX(${-p * 7}%)`;
    el.querySelector<HTMLElement>(".passage-shutter-left")!.style.transform = `translateX(${-ease(p) * 101}%)`;
    el.querySelector<HTMLElement>(".passage-shutter-right")!.style.transform = `translateX(${ease(p) * 101}%)`;
    el.querySelectorAll<HTMLElement>(".passage-rib").forEach((rib, i) => {
      const z = (i + 1) * 1.7 - p * 13;
      rib.style.transform = `translate(-50%,-50%) scale(${z > 0.9 ? 2 / z : 2.22})`;
      rib.style.opacity = z > 0.9 ? String(Math.min(0.8, 2 / z)) : "0";
    });
    el.querySelector<HTMLElement>(".passage-title")!.style.transform = `translate(-50%,-50%) scale(${0.8 + p * 0.65})`;
  });
  return (
    <section
      ref={root}
      id="closeup"
      className="portfolio-scene passage-scene"
      data-scene="passage"
      aria-labelledby="closeup-title"
    >
      <div className="scene-stage">
        {preview ? (
          <div className="passage-photo passage-film">
            <ArchitecturalFilm chapter={root} />
          </div>
        ) : (
          <>
            <img
              className="passage-photo"
              src="/media/cinematic/architectural-passage.webp"
              alt="A sunlit passage of walnut and stone"
              loading="lazy"
            />
          </>
        )}
        <div className="passage-shade" />
        <div className="passage-shutter passage-shutter-left" aria-hidden="true" />
        <div className="passage-shutter passage-shutter-right" aria-hidden="true" />
        <div className="passage-ribs" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => (
            <i key={i} className="passage-rib" />
          ))}
        </div>
        <div className="passage-title">
          <p className="scene-label">The art of engineering</p>
          <h2 id="closeup-title">
            Look beyond
            <br />
            <em>the surface.</em>
          </h2>
          <p>One perspective. Every layer.</p>
        </div>
        <SceneFooter title="A passage / Light becomes structure" next="about" />
      </div>
    </section>
  );
}

export function PerspectiveScene() {
  const preview = usePortfolioPreview();
  const root = useRef<HTMLElement>(null);
  useChapter(root, 1.6, 1, (el, p) => {
    const photo = el.querySelector<HTMLElement>(".perspective-photo")!;
    photo.style.width = window.innerWidth < 700 ? "100%" : `${100 - p * 46}%`;
    photo.style.clipPath = window.innerWidth < 700 ? "none" : "polygon(0 0,92% 0,100% 100%,0 100%)";
    el.querySelector<HTMLElement>(".perspective-photo img")!.style.transform =
      `scale(${1.15 - p * 0.15}) translateX(${-p * 8}%)`;
    el.querySelector<HTMLElement>(".perspective-statement")!.style.transform =
      `translateX(${-p * 80}%) rotate(${-p * 5}deg)`;
    const copy = el.querySelector<HTMLElement>(".perspective-copy")!;
    copy.style.transform = `translateX(${(1 - ease(phase(p, 0.05, 0.75))) * 42}%)`;
  });
  return (
    <section
      ref={root}
      id="about"
      className="portfolio-scene perspective-scene"
      data-scene="perspective"
      aria-labelledby="about-title"
    >
      <div className="scene-stage">
        <div className="perspective-photo">
          <img
            src={preview ? originalPortrait.src : "/images/editorial/architect.webp"}
            width={1672}
            height={941}
            loading="lazy"
            alt={preview ? originalPortrait.alt : "Varghese Shibu in espresso tailoring against limestone architecture"}
          />
        </div>
        <div className="perspective-statement" aria-hidden="true">
          An independent mind.
        </div>
        <article className="perspective-copy">
          <p className="scene-label">01 / The person behind the work</p>
          <h2 id="about-title">
            A sense of craft.
            <br />
            <em>A mind for systems.</em>
          </h2>
          <p>{profile.intro}</p>
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div className="perspective-facts">
            <span>
              Building since <b>2019</b>
            </span>
            <span>
              Based in <b>Bengaluru, India</b>
            </span>
          </div>
          <Link to="/cinematic-lab" className="scene-link">
            Visit the original motion study ↗
          </Link>
        </article>
        <SceneFooter title="Perspective / The individual opens into the practice" next="work" />
      </div>
    </section>
  );
}
