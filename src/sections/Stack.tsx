import { useLayoutRefresh } from "../lib/motion";
import { useId, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { stack } from "../data/content";
import "../styles/sections/stack.css";
export default function Stack() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const group = stack[active];
  useLayoutRefresh(active);
  return (
    <section id="stack" className="stack-section owned-section">
      <div className="shell">
        <div className="section-kicker label">
          <span className="text-crimson">04 — Stack</span>
          <span>Chosen for the work</span>
        </div>
        <h2 className="display owned-heading">
          Tools into
          <br />
          <span className="serif-accent">possibilities.</span>
        </h2>
        <div className="stack-console">
          <div className="stack-tabs" role="tablist" aria-label="Technology disciplines" aria-orientation="vertical">
            {stack.map((g, i) => (
              <button
                key={g.id}
                id={uid + g.id}
                role="tab"
                aria-selected={active === i}
                aria-controls={uid + "panel"}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  let next = active;
                  if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (active + 1) % stack.length;
                  else if (e.key === "ArrowUp" || e.key === "ArrowLeft")
                    next = (active - 1 + stack.length) % stack.length;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = stack.length - 1;
                  else return;
                  e.preventDefault();
                  setActive(next);
                  document.getElementById(uid + stack[next].id)?.focus();
                }}
              >
                <span className="label">0{i + 1}</span>
                <span>{g.label}</span>
                <ArrowUpRight size={18} />
              </button>
            ))}
          </div>
          <div role="tabpanel" id={uid + "panel"} aria-labelledby={uid + group.id} tabIndex={0} className="stack-panel">
            <div className="label stack-prompt">
              / {group.id} <span aria-hidden="true">_</span>
            </div>
            <p className="stack-builds">{group.builds}</p>
            <ul className="stack-items">
              {group.items.map((t, i) => (
                <li key={t}>
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                  {t}
                </li>
              ))}
            </ul>
            <div className="label stack-footer">
              {String(active + 1).padStart(2, "0")} / {String(stack.length).padStart(2, "0")} disciplines
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
