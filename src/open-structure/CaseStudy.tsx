import { useEffect } from "react";
import { Link } from "react-router-dom";
import { kerasobha } from "../data/content";
import { EvidenceWindow, RequestLens } from "./ProjectExperience";
import { Arrow, Contact, Header, Label, PageLocation } from "./shared";

export default function CaseStudy() {
  useEffect(() => {
    document.title = "Kerasobha — Varghese Shibu / Selected work";
    return () => {
      document.title = "Varghese Shibu — Built with perspective";
    };
  }, []);
  return (
    <div className="os os-case">
      <Header study />
      <PageLocation />
      <main id="main" tabIndex={-1}>
        <section className="os-case-opening" id="top">
          <Link to="/#work" className="os-back-link">
            ← Selected work
          </Link>
          <div className="os-section-top">
            <Label>01 / Product design & full-stack engineering</Label>
            <span>{kerasobha.year} / Kerala, India</span>
          </div>
          <h1>
            {kerasobha.title}
            <span>.</span>
          </h1>
          <div className="os-case-intro">
            <p>{kerasobha.summary}</p>
            <a className="os-text-link" href={kerasobha.liveUrl} target="_blank" rel="noreferrer">
              Visit the live project <Arrow />
            </a>
          </div>
          <EvidenceWindow caseStudy />
        </section>
        <section className="os-case-brief">
          <Label>The brief</Label>
          <h2>
            A richer story.
            <br />A reliable product.
          </h2>
          <p className="os-lead">{kerasobha.problem}</p>
          <div className="os-case-facts">
            <div>
              <Label>My role</Label>
              <p>{kerasobha.role}</p>
            </div>
            <div>
              <Label>Interface</Label>
              <p>{kerasobha.stack.frontend.join(" · ")}</p>
            </div>
            <div>
              <Label>Backend</Label>
              <p>{kerasobha.stack.backend.join(" · ")}</p>
            </div>
            <div>
              <Label>Quality</Label>
              <p>{kerasobha.stack.quality.join(" · ")}</p>
            </div>
          </div>
        </section>
        <section className="os-case-overview">
          <Label>Building the experience</Label>
          <h2>
            One story.
            <br />
            Across the whole stack<span>.</span>
          </h2>
          {kerasobha.overview.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
        <RequestLens />
        <section className="os-case-decisions" id="decisions">
          <div className="os-section-top">
            <Label>Engineering decisions</Label>
            <span>The choices beneath the surface.</span>
          </div>
          <h2>
            Deliberate by design<span>.</span>
          </h2>
          <div className="os-decision-grid">
            {kerasobha.decisions.map((decision, i) => (
              <article key={decision.title}>
                <span>0{i + 1}</span>
                <h3>{decision.title}</h3>
                <p>{decision.body}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="os-case-results">
          <div>
            <Label>The challenges</Label>
            <h2>Designing for reality.</h2>
            {kerasobha.challenges.map((c) => (
              <p key={c}>{c}</p>
            ))}
          </div>
          <div>
            <Label>Documented project outcomes</Label>
            <h2>Built. Tested. Shipped.</h2>
            <ul>
              {kerasobha.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
            <p className="os-outcome-note">
              These are the documented Kerasobha project results, not new benchmark measurements from this portfolio
              redesign.
            </p>
            <a className="os-text-link" href={kerasobha.liveUrl} target="_blank" rel="noreferrer">
              Explore Kerasobha <Arrow />
            </a>
          </div>
        </section>
        <div className="os-case-return">
          <Link className="os-text-link" to="/#work">
            ← Back to selected work
          </Link>
        </div>
      </main>
      <Contact />
    </div>
  );
}
