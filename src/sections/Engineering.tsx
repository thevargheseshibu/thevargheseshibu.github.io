import { useRef } from "react";
import { kerasobha } from "../data/content";
import { gsap, useGsap } from "../lib/motion";
import SystemMap from "./engineering/SystemMap";
export default function Engineering() {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, () => {
    gsap.from(".decision-row", {
      y: 24,
      opacity: 0,
      stagger: 0.08,
      duration: 0.7,
      scrollTrigger: { trigger: ".engineering-decisions", start: "top 90%" },
    });
  });
  return (
    <section ref={ref} id="engineering" className="engineering-section owned-section relative isolate overflow-hidden">
      <div className="shell">
        <div className="section-kicker label">
          <span className="text-crimson">03 — Systems</span>
          <span>Under the interface / Kerasobha</span>
        </div>
        <h2 className="display owned-heading">
          The system
          <br />
          behind the <span className="serif-accent">scene.</span>
        </h2>
        <p className="engineering-intro">{kerasobha.overview[1]}</p>
        <SystemMap />
        <div className="engineering-decisions">
          <div className="label decisions-label">Design decisions / 01—06</div>
          {kerasobha.decisions.map((d, i) => (
            <article className="decision-row" key={d.title}>
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              <h3>{d.title}</h3>
              <p>{d.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
