import { ArrowUpRight } from "lucide-react";
import { scrollToTarget } from "../lib/smooth-scroll";

export default function Practice() {
  return (
    <aside className="practice-strip" aria-label="Professional background">
      <div className="shell practice-layout">
        <p className="label">
          A practice built
          <br />
          <span>across industries.</span>
        </p>
        <ul>
          <li>
            <span>BlueOptima</span>
            <small>Now · Plugins, web &amp; backend</small>
          </li>
          <li>
            <span>CloudBerry360</span>
            <small>Payments & digital platforms</small>
          </li>
          <li>
            <span>IBS Software</span>
            <small>Aviation & logistics</small>
          </li>
          <li>
            <span>Panasonic R&D</span>
            <small>Research & secure systems</small>
          </li>
        </ul>
        <a
          href="#experience"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget("#experience");
          }}
          className="label"
        >
          The journey <ArrowUpRight size={16} aria-hidden />
        </a>
      </div>
    </aside>
  );
}
