import { useRef } from "react";
import { awards, certifications, education, educationResearch, experience, profile, stack } from "../../data/content";
import { useChapter } from "../../lib/use-chapter";
import { SceneFooter } from "./PortraitScenes";

export function ToolsetScene() {
  const root = useRef<HTMLElement>(null);
  const { active, choose } = useChapter(root, 1.8, stack.length, (el, p) => {
    el.querySelectorAll<HTMLElement>(".tool-orbit").forEach((ring, i) => {
      ring.style.transform = `rotateX(${55 - p * 25}deg) rotateZ(${p * 200 * (i % 2 ? -1 : 1) + i * 30}deg)`;
    });
    el.querySelectorAll<HTMLElement>(".tool-satellite").forEach((node, i) => {
      const angle = (i / stack.length) * Math.PI * 2 + p * Math.PI * 1.5;
      node.style.transform = `translate(-50%,-50%) translate3d(${Math.cos(angle) * 42}cqw,${Math.sin(angle) * 34}cqh,0) scale(${0.8 + Math.sin(angle) * 0.12})`;
    });
  });
  const group = stack[active];
  return (
    <section
      id="stack"
      ref={root}
      className="portfolio-scene toolset-scene"
      data-scene="toolset"
      aria-labelledby="stack-title"
    >
      <div className="scene-stage">
        <div className="scene-heading">
          <p className="scene-label">04 / The working vocabulary</p>
          <h2 id="stack-title">
            Tools into
            <br />
            <em>possibilities.</em>
          </h2>
        </div>
        <div className="tool-universe" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div className="tool-orbit" key={i} />
          ))}
          <div className="tool-core">
            VS<span>Design → build → ship</span>
          </div>
          {stack.map((g, i) => (
            <div className={`tool-satellite${active === i ? " current" : ""}`} key={g.id}>
              <small>0{i + 1}</small>
              {g.label}
            </div>
          ))}
        </div>
        <div className="tool-discipline">
          <div className="scene-selector" role="tablist" aria-label="Technology disciplines">
            {stack.map((g, i) => (
              <button
                role="tab"
                aria-selected={active === i}
                aria-controls="tool-panel"
                id={`tool-tab-${g.id}`}
                key={g.id}
                onClick={() => choose(i)}
                onKeyDown={(e) => {
                  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                  e.preventDefault();
                  const next = (i + (e.key === "ArrowRight" ? 1 : -1) + stack.length) % stack.length;
                  choose(next);
                  document.getElementById(`tool-tab-${stack[next].id}`)?.focus({ preventScroll: true });
                }}
              >
                {g.label}
              </button>
            ))}
          </div>
          <article id="tool-panel" role="tabpanel" aria-labelledby={`tool-tab-${group.id}`}>
            <p className="scene-label">{group.label} / Applied in practice</p>
            <h3>{group.builds}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <SceneFooter title="Toolset / Chosen for the problem" next="experience" />
      </div>
    </section>
  );
}

const journey = [...experience].reverse();
const companyLogos: Record<string, string> = {
  blueoptima: "blueoptima",
  zemoso: "zemoso",
  cloudberry360: "cloudberry",
  ibs: "ibs",
  panasonic: "panasonic",
};

export function JourneyScene() {
  const root = useRef<HTMLElement>(null);
  const { active, choose } = useChapter(root, 2.5, journey.length, (el, p) => {
    el.querySelector<HTMLElement>(".journey-track")!.style.transform =
      `translateX(${-p * (journey.length - 1) * 100}%)`;
    el.querySelector<HTMLElement>(".journey-line")!.style.transform = `scaleX(${p})`;
    el.querySelector<HTMLElement>(".journey-watermark")!.style.transform = `translateX(${-p * 28}%)`;
  });
  const role = journey[active];
  return (
    <>
      <section
        id="experience"
        ref={root}
        className="portfolio-scene journey-scene"
        data-scene="journey"
        aria-labelledby="experience-title"
      >
        <div className="scene-stage">
          <div className="journey-watermark" aria-hidden="true">
            2019—2026
          </div>
          <div className="scene-heading">
            <p className="scene-label">05 / Research → product → platform</p>
            <h2 id="experience-title">
              Years of
              <br />
              <em>building.</em>
            </h2>
          </div>
          <div className="journey-film">
            <div className="journey-track">
              {journey.map((e, i) => (
                <div className="journey-frame" key={e.id} aria-hidden={active !== i}>
                  <span className="journey-year">{e.yearLabel}</span>
                  <img
                    src={`/images/institutions/${companyLogos[e.id]}.jpg`}
                    width={70}
                    height={70}
                    loading="lazy"
                    alt=""
                  />
                  <h3>{e.company}</h3>
                  <p>{e.role}</p>
                  <small>
                    {e.start} — {e.end}
                  </small>
                </div>
              ))}
            </div>
          </div>
          <article className="journey-detail" aria-live="polite">
            <p className="scene-label">
              {role.end === "Present" ? "Current practice" : "A chapter in the practice"} /{" "}
              {role.location || role.arrangement}
            </p>
            <h3>{role.company}</h3>
            <p>{role.summary}</p>
            <details key={role.id}>
              <summary>
                Explore the role <span>+</span>
              </summary>
              <div className="journey-role-scroll" data-lenis-prevent>
                <ul>
                  {role.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
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
                      {p.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                {role.clients.length > 0 && <p>Engagements: {role.clients.join(" · ")}</p>}
              </div>
            </details>
          </article>
          <div className="journey-navigation">
            <div className="journey-line" />
            {journey.map((e, i) => (
              <button key={e.id} aria-pressed={active === i} onClick={() => choose(i)}>
                <span>{e.yearLabel}</span>
                <b>{e.company}</b>
              </button>
            ))}
          </div>
          <SceneFooter title="Experience / A practice built across industries" next="education" />
        </div>
      </section>
      <div className="credential-ledger">
        <div>
          <p className="scene-label">Qualifications & recognition</p>
          <h3>
            A continuing
            <br />
            <em>practice.</em>
          </h3>
          {profile.resumeUrl && (
            <a className="scene-link" href={profile.resumeUrl} download>
              Download résumé ↗
            </a>
          )}
        </div>
        <div>
          <h4 className="scene-label">Certifications</h4>
          {certifications.map((c) => (
            <p key={c.title}>
              {c.title}
              <span>
                {c.issuer} / {c.year}
              </span>
            </p>
          ))}
        </div>
        <div>
          <h4 className="scene-label">Awards</h4>
          {awards.map((a, i) => (
            <p key={i}>
              {a.title}
              <span>
                {a.issuer}
                {"year" in a ? ` / ${a.year}` : ""}
              </span>
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

export function FoundationScene() {
  const root = useRef<HTMLElement>(null);
  const { active, choose } = useChapter(root, 1.8, education.length, (el, p) => {
    el.querySelectorAll<HTMLElement>(".foundation-sheet").forEach((sheet, i) => {
      const offset = i - p * 2;
      sheet.style.transform = `perspective(1200px) translate3d(${offset * 18}%,${offset * 12}%,${-Math.abs(offset) * 160}px) rotateY(${offset * -10}deg) rotateZ(${offset * 7}deg)`;
      sheet.style.opacity = String(Math.max(0.08, 1 - Math.abs(offset) * 0.65));
      sheet.style.zIndex = String(10 - Math.round(Math.abs(offset) * 3));
    });
  });
  const selected = education[active];
  return (
    <section
      id="education"
      ref={root}
      className="portfolio-scene foundation-scene"
      data-scene="foundations"
      aria-labelledby="education-title"
    >
      <div className="scene-stage">
        <div className="foundation-grid" aria-hidden="true" />
        <div className="scene-heading">
          <p className="scene-label">06 / The foundations of a practice</p>
          <h2 id="education-title">
            Curiosity,
            <br />
            <em>given direction.</em>
          </h2>
        </div>
        <div className="foundation-stack" aria-hidden="true">
          {education.map((e, i) => (
            <div className="foundation-sheet" key={e.id}>
              <span className="scene-label">Foundation / 0{i + 1}</span>
              <img
                src={`/images/institutions/${i === 0 ? "mgu" : "cbse"}.jpg`}
                width={80}
                height={80}
                alt=""
                loading="lazy"
              />
              <span className="foundation-mark">{e.mark}</span>
              <strong>{e.degree}</strong>
              <p>{e.institution}</p>
              <small>
                {e.start} — {e.end}
              </small>
            </div>
          ))}
        </div>
        <article className="foundation-record" aria-live="polite">
          <span className="scene-label">
            {selected.start} — {selected.end}
          </span>
          <h3>{selected.degree}</h3>
          <a href={selected.href} target="_blank" rel="noopener noreferrer">
            {selected.board} ↗
          </a>
          <p>{selected.field}</p>
          <p>
            {selected.institution}
            <br />
            {selected.location}
          </p>
          <small>{selected.note}</small>
          <details key={selected.id}>
            <summary>
              {active === 0 ? "Research & thesis" : "Institution details"} <span>+</span>
            </summary>
            <p>
              {selected.institution}
              <br />
              {selected.location}
              <br />
              {selected.note}
            </p>
            {active === 0 && (
              <p>
                <strong>{educationResearch.title}</strong>
                <br />
                {educationResearch.focus}
                <br />
                {educationResearch.body}
              </p>
            )}
          </details>
        </article>
        <div className="scene-selector foundation-selector" aria-label="Education stages">
          {education.map((e, i) => (
            <button key={e.id} aria-pressed={active === i} onClick={() => choose(i)}>
              <span>0{i + 1}</span>
              {["University", "The sciences", "The beginning"][i]}
            </button>
          ))}
        </div>
        <SceneFooter title="Foundations / Learning is a lifelong pursuit" next="contact" />
      </div>
    </section>
  );
}
