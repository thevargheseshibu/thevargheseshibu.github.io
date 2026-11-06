import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { experience } from "../data/content";
import { gsap, useLayoutRefresh, useGsap } from "../lib/motion";
import Credentials from "./experience/Credentials";
import "../styles/sections/experience.css";
const companyLogos: Record<string, string> = {
  blueoptima: "blueoptima",
  zemoso: "zemoso",
  cloudberry360: "cloudberry",
  ibs: "ibs",
  panasonic: "panasonic",
};
export default function Experience() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<string | null>(experience[0].id);
  useLayoutRefresh(open);
  useGsap(ref, ({ isMobile }) => {
    if (!isMobile)
      gsap.fromTo(
        ".experience-progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".experience-timeline", start: "top 65%", end: "bottom 65%", scrub: true },
        },
      );
  });
  return (
    <section id="experience" ref={ref} className="experience-section owned-section">
      <div className="shell">
        <div className="section-kicker label">
          <span className="text-crimson">05 — Experience</span>
          <span>Research → product → platform</span>
        </div>
        <h2 className="display owned-heading">
          Years of
          <br />
          <span className="serif-accent">building.</span>
        </h2>
        <div className="experience-timeline">
          <div className="experience-rail" aria-hidden="true">
            <span className="experience-progress" />
          </div>
          {experience.map((e) => (
            <article key={e.id} className={"experience-entry " + (e.end === "Present" ? "experience-current" : "")}>
              <div className="experience-year display">{e.yearLabel}</div>
              <div className="experience-content">
                <button
                  className="experience-toggle"
                  aria-expanded={open === e.id}
                  aria-controls={"experience-" + e.id}
                  onClick={() => setOpen(open === e.id ? null : e.id)}
                >
                  <span>
                    <span className="experience-meta label">
                      <span>
                        {e.start} — {e.end}
                      </span>
                      {e.location && <span className="experience-location">{e.location}</span>}
                      {e.end === "Present" && <span className="experience-current-badge">Current role</span>}
                    </span>
                    <span className="experience-brand">
                      <img
                        src={"/images/institutions/" + companyLogos[e.id] + ".jpg"}
                        width={48}
                        height={48}
                        alt=""
                        loading="lazy"
                      />
                      <span className="experience-company">{e.company}</span>
                    </span>
                    <span className="experience-role">{e.role}</span>
                    {e.arrangement && <span className="experience-arrangement label">{e.arrangement}</span>}
                  </span>
                  {open === e.id ? <Minus size={20} aria-hidden="true" /> : <Plus size={20} aria-hidden="true" />}
                </button>
                <p className="experience-summary">{e.summary}</p>
                {e.positions && (
                  <ol className="experience-positions" aria-label={e.company + " roles"}>
                    {e.positions.map((position) => (
                      <li key={position.role}>
                        <div>
                          <h3>{position.role}</h3>
                          <p className="label">
                            {position.start} — {position.end}
                          </p>
                        </div>
                        <p>{position.summary}</p>
                      </li>
                    ))}
                  </ol>
                )}
                <div id={"experience-" + e.id} hidden={open !== e.id} className="experience-details">
                  <ul className="experience-responsibilities">
                    {e.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  {e.programmes && e.programmes.length > 0 && (
                    <div className="experience-programmes">
                      <p className="label">Programmes</p>
                      {e.programmes.map((programme) => (
                        <div className="experience-programme" key={programme.name}>
                          <h3>{programme.name}</h3>
                          {programme.where && <p className="label">{programme.where}</p>}
                          <ul>
                            {programme.points.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                  {e.clients.length > 0 && (
                    <div className="experience-clients">
                      <span className="label">Client engagements</span>
                      <p>{e.clients.join(" / ")}</p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        <Credentials />
      </div>
    </section>
  );
}
