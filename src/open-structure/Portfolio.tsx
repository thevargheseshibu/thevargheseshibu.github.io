import { useEffect, useRef, useState } from "react";
import { awards, certifications, education, educationResearch, experience, profile, stack } from "../data/content";
import { DesktopHero, MobileHero } from "./Hero";
import { Engagements, FeaturedWork, RequestLens } from "./ProjectExperience";
import { Arrow, Contact, Header, Label, PageLocation, usePageScene, usePhone } from "./shared";

function Practice() {
  const [selected, setSelected] = useState(0);
  return (
    <section className="os-practice" id="about">
      <div className="os-section-top">
        <Label>03 / A point of view</Label>
        <span>Human intent. System thinking.</span>
      </div>
      <div className="os-about-layout">
        <div className="os-about-portrait">
          <img
            src="/images/editorial/after-hours.webp"
            alt="Varghese Shibu seated in a softly lit studio"
            width="1400"
            height="788"
            loading="lazy"
          />
          <span>A considered way of working.</span>
        </div>
        <div className="os-about-copy">
          <h2>
            The surface.
            <br />
            The system.
            <br />
            The whole thing<span>.</span>
          </h2>
          <p className="os-lead">{profile.intro}</p>
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {profile.resumeUrl && (
            <a className="os-text-link" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              A little more about me / Résumé <Arrow />
            </a>
          )}
        </div>
      </div>
      <div className="os-line" data-structure-line />
      <div className="os-toolkit" id="stack">
        <div>
          <Label>A working vocabulary</Label>
          <h3>Across the stack.</h3>
          <p>Choose a discipline to look inside.</p>
        </div>
        <div className="os-stack-explorer">
          <div className="os-stack-tabs" role="group" aria-label="Engineering disciplines">
            {stack.map((group, i) => (
              <button key={group.id} aria-pressed={selected === i} onClick={() => setSelected(i)}>
                {group.label}
              </button>
            ))}
          </div>
          <div className="os-stack-panel" aria-live="polite">
            <p>{stack[selected].builds}</p>
            <ul>
              {stack[selected].items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
function Journey() {
  return (
    <section className="os-journey" id="experience">
      <div className="os-section-top">
        <Label>04 / Experience</Label>
        <span>{profile.since} — Present</span>
      </div>
      <div className="os-journey-heading">
        <h2>
          Built through
          <br />
          experience<span>.</span>
        </h2>
        <p>From research environments to the systems people use every day.</p>
      </div>
      <div className="os-career-list">
        {experience.map((job, i) => (
          <details key={job.id} open={i === 0}>
            <summary>
              <span className="os-career-year">
                {job.start} — {job.end}
              </span>
              <span className="os-career-main">
                <strong>{job.company}</strong>
                <span>{job.role}</span>
              </span>
              <span className="os-career-toggle" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="os-career-body">
              <p>{job.summary}</p>
              <span>{[job.location, job.arrangement].filter(Boolean).join(" · ")}</span>
              {job.positions && (
                <div className="os-positions">
                  {job.positions.map((p) => (
                    <div key={p.role}>
                      <strong>{p.role}</strong>
                      <span>
                        {p.start} — {p.end}
                      </span>
                      <p>{p.summary}</p>
                    </div>
                  ))}
                </div>
              )}
              <ul>
                {job.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              {job.programmes?.map((p) => (
                <div className="os-programme" key={p.name}>
                  <strong>{p.name}</strong>
                  <p>{p.where}</p>
                  <ul>
                    {p.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
              {job.clients.length > 0 && <p className="os-career-clients">Engagements / {job.clients.join(" · ")}</p>}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
function Foundations() {
  return (
    <section className="os-foundations" id="education">
      <div className="os-section-top">
        <Label>05 / Foundations</Label>
        <span>Learning is part of the practice.</span>
      </div>
      <div className="os-foundations-title">
        <h2>
          Always
          <br />
          in progress<span>.</span>
        </h2>
        <p>Education, research and the recognition along the way.</p>
      </div>
      <div className="os-foundations-grid">
        <div>
          <h3>Education</h3>
          {education.map((item) => (
            <details key={item.id}>
              <summary>
                <span>
                  {item.start} — {item.end}
                </span>
                <strong>{item.degree}</strong>
                <i aria-hidden="true">+</i>
              </summary>
              <div>
                <p>{item.institution}</p>
                <p>
                  {item.board} / {item.field}
                </p>
                <p>{item.note}</p>
                <span>{item.location}</span>
              </div>
            </details>
          ))}
          <div className="os-research-note">
            <Label>{educationResearch.focus}</Label>
            <h4>{educationResearch.title}</h4>
            <p>{educationResearch.body}</p>
          </div>
        </div>
        <div>
          <h3>Credentials & recognition</h3>
          <div className="os-credential-list">
            {certifications.map((c) => (
              <div key={c.title}>
                <span>{c.year}</span>
                <p>
                  <strong>{c.title}</strong>
                  <small>{c.issuer}</small>
                </p>
              </div>
            ))}
          </div>
          <div className="os-awards">
            {awards.map((award, i) => (
              <p key={award.title + i}>
                <span aria-hidden="true">↗</span>
                <strong>{award.title}</strong>
                <small>
                  {award.issuer}
                  {"year" in award ? ` / ${award.year}` : ""}
                </small>
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
export default function Portfolio() {
  const phone = usePhone();
  const scope = useRef<HTMLElement>(null);
  usePageScene(scope, phone);
  useEffect(() => {
    document.title = "Varghese Shibu — Built with perspective";
  }, []);
  return (
    <div className="os">
      <Header />
      <PageLocation />
      <main id="main" ref={scope} tabIndex={-1}>
        {phone ? <MobileHero /> : <DesktopHero />}
        <FeaturedWork />
        <RequestLens />
        <Engagements />
        <Practice />
        <Journey />
        <Foundations />
      </main>
      <Contact />
    </div>
  );
}
