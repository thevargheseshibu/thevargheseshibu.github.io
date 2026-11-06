import { useLayoutRefresh } from "../../lib/motion";
import { useId, useState } from "react";
import { Plus, Minus } from "lucide-react";
import { systemNodes, systemEdges } from "../../data/engineering";
import "../../styles/sections/engineering.css";
export default function SystemMap() {
  const [active, setActive] = useState<string>("worker");
  const uid = useId().replace(/:/g, "");
  useLayoutRefresh(active);
  const selected = systemNodes.find((n) => n.id === active) ?? systemNodes[2];
  return (
    <div className="system-interface">
      <div className="system-status label">
        <span>
          <i /> Kerasobha / System topology
        </span>
        <span>Static pages. Stateful services.</span>
      </div>
      <div className="system-desktop">
        <svg
          className="system-svg"
          viewBox="0 0 1110 590"
          role="group"
          aria-label="Interactive Kerasobha architecture. Focus a node for its description."
        >
          <defs>
            <marker
              id={uid + "arrow"}
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
            </marker>
          </defs>
          {systemEdges.map(([from, to]) => {
            const a = systemNodes.find((n) => n.id === from)!;
            const b = systemNodes.find((n) => n.id === to)!;
            const sx = a.x + 105,
              sy = a.y + 38,
              tx = b.x + 105,
              ty = b.y + 38;
            const d =
              from === "cron"
                ? "M " + (a.x + 210) + " " + sy + " H 272 V " + (b.y + 60) + " H " + b.x
                : "M " + (sx + 105) + " " + sy + " H " + (sx + tx) / 2 + " V " + ty + " H " + (tx - 110);
            return (
              <path
                key={from + to}
                d={d}
                className={active === from || active === to ? "system-edge active" : "system-edge"}
                markerEnd={"url(#" + uid + "arrow)"}
              />
            );
          })}
          {systemNodes.map((n) => (
            <g
              key={n.id}
              role="button"
              tabIndex={0}
              aria-label={n.label + " " + n.sub}
              aria-pressed={active === n.id}
              aria-describedby={uid + "description"}
              onMouseEnter={() => setActive(n.id)}
              onFocus={() => setActive(n.id)}
              onClick={() => setActive(n.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(n.id);
                }
              }}
              className={active === n.id ? "system-node active" : "system-node"}
              transform={"translate(" + n.x + " " + n.y + ")"}
            >
              <rect width="210" height="76" rx="2" />
              <text x="16" y="30" className="system-node-title">
                {n.label}
              </text>
              <text x="16" y="53" className="system-node-sub">
                {n.sub}
              </text>
            </g>
          ))}
        </svg>
        <div className="system-description" id={uid + "description"}>
          <span className="label">Inspect / {selected.id}</span>
          <h3>{selected.label}</h3>
          <p>{selected.description}</p>
        </div>
      </div>
      <div className="system-mobile">
        {systemNodes.map((n, i) => (
          <div className="system-mobile-node" key={n.id}>
            <button
              aria-expanded={active === n.id}
              aria-controls={uid + n.id}
              onClick={() => setActive(active === n.id ? "" : n.id)}
            >
              <span className="label">{String(i + 1).padStart(2, "0")}</span>
              <span>
                {n.label}
                <small>{n.sub}</small>
              </span>
              {active === n.id ? <Minus size={16} /> : <Plus size={16} />}
            </button>
            <p id={uid + n.id} hidden={active !== n.id}>
              {n.description}
            </p>
          </div>
        ))}
        <p className="label system-flow-note">
          Routes: Browser → assets or Worker. Worker → enquiries, admin, D1 & Resend. Enquiries & admin → D1. Cron →
          Worker.
        </p>
      </div>
    </div>
  );
}
