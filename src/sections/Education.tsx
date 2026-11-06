import { useRef } from "react";
import { ArrowUpRight, Plus } from "lucide-react";
import { education, educationResearch, sectionIndex } from "../data/content";
import { gsap, ScrollTrigger, useGsap } from "../lib/motion";
import { scrollToTarget } from "../lib/smooth-scroll";
import "../styles/sections/education.css";

export default function Education() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, () => {
    const q = gsap.utils.selector(root);
    q(".education-record").forEach((entry: HTMLElement) => {
      gsap.from(entry.querySelectorAll("[data-education-reveal]"), {
        y: 25,
        opacity: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: entry, start: "top 85%" },
      });
    });
    gsap.from(q(".education-rail-progress"), {
      scaleY: 0,
      transformOrigin: "top",
      ease: "none",
      scrollTrigger: { trigger: q(".education-records")[0], start: "top 75%", end: "bottom 65%", scrub: 0.5 },
    });
  });
  return (
    <section id="education" ref={root} className="education-section" aria-labelledby="education-title">
      <div className="shell">
        <div className="section-kicker label">
          <span>{sectionIndex.education} — Education</span>
          <span>The foundations of a practice</span>
        </div>
        <div className="education-heading">
          <h2 id="education-title">
            Curiosity,
            <br />
            <em>given direction.</em>
          </h2>
          <p>
            From the first questions to a deeper understanding of how things work. The education behind the engineer.
          </p>
        </div>
        <div className="education-layout">
          <aside className="education-aside">
            <span className="education-years" aria-hidden>
              2000
              <br />
              <i>—</i>
              <br />
              2019
            </span>
            <p className="label">
              A foundation.
              <br />A field of study.
              <br />A lifelong pursuit.
            </p>
            <nav aria-label="Education stages">
              {education.map((item, i) => (
                <a
                  href={"#education-" + item.id}
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToTarget("#education-" + item.id, -100);
                  }}
                >
                  <span>0{i + 1}</span>
                  {["University", "Science", "Foundations"][i]}
                  <ArrowUpRight size={13} aria-hidden />
                </a>
              ))}
            </nav>
          </aside>
          <div className="education-record-wrap">
            <span className="education-rail-progress" aria-hidden />
            <ol className="education-records">
              {education.map((item, i) => (
                <li
                  className={"education-record " + (i === 0 ? "education-degree" : "")}
                  key={item.id}
                  id={"education-" + item.id}
                >
                  <div className="education-record-top" data-education-reveal>
                    <span className="label">
                      {item.start} — {item.end}
                    </span>
                    <span className="label education-record-index">
                      0{i + 1} / {["Higher education", "The sciences", "The beginning"][i]}
                    </span>
                  </div>
                  <div className="education-institution" data-education-reveal>
                    <img
                      src={"/images/institutions/" + (i === 0 ? "mgu" : "cbse") + ".jpg"}
                      width={64}
                      height={64}
                      alt=""
                      loading="lazy"
                    />
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.board}
                      <ArrowUpRight size={16} aria-hidden />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </div>
                  <h3 data-education-reveal>{item.degree}</h3>
                  <p className="education-field" data-education-reveal>
                    {item.field}
                  </p>
                  <div className="education-school" data-education-reveal>
                    <p>{item.institution}</p>
                    <span>{item.location}</span>
                  </div>
                  <p className="education-note" data-education-reveal>
                    {item.note}
                  </p>
                  {item.skills.length > 0 && (
                    <ul className="education-skills" aria-label="Selected skills" data-education-reveal>
                      {item.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  )}
                  {i === 0 && (
                    <details
                      className="education-research"
                      onToggle={() => requestAnimationFrame(() => ScrollTrigger.refresh())}
                    >
                      <summary>
                        <span>Research &amp; thesis</span>
                        <Plus size={16} aria-hidden />
                      </summary>
                      <div>
                        <p className="label">{educationResearch.focus}</p>
                        <h4>{educationResearch.title}</h4>
                        <p>{educationResearch.body}</p>
                      </div>
                    </details>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
