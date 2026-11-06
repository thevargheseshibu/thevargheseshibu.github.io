import { useLayoutRefresh } from "../../lib/motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { engineeringProjects } from "../../data/content";
export default function ProjectIndex() {
  const [open, setOpen] = useState<string | null>(engineeringProjects[0].slug);
  useLayoutRefresh(open);
  return (
    <div className="project-index">
      <div className="project-index-heading label">
        <span>02—12 / Engineering engagements</span>
        <span>Explore the index</span>
      </div>
      {engineeringProjects.map((p) => (
        <article className={open === p.slug ? "project-row is-open" : "project-row"} key={p.slug}>
          <button
            className="project-toggle"
            aria-expanded={open === p.slug}
            aria-controls={"project-" + p.slug}
            onClick={() => setOpen(open === p.slug ? null : p.slug)}
          >
            <span className="label project-number">{p.index}</span>
            <span className="project-name">
              {p.title}
              <span className="label project-client">{p.client}</span>
            </span>
            <span className="label project-category">{p.category}</span>
            {open === p.slug ? <Minus size={18} /> : <Plus size={18} />}
          </button>
          <div id={"project-" + p.slug} className="project-detail" hidden={open !== p.slug}>
            <p className="label project-detail-category">{p.category}</p>
            <p>{p.summary}</p>
            <ul className="technical-tags">
              {p.tech.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
