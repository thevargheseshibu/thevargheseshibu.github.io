import { kerasobha, profile } from "../data/content";
import { Link } from "react-router-dom";
import { Arrow, Label } from "./shared";

function Portal({ phone }: { phone: boolean }) {
  return (
    <div className="os-hero-portal">
      <div className="os-portal-line" aria-hidden="true" />
      <span className="os-measure" aria-hidden="true">
        VS — 001 / PERSPECTIVE
      </span>
      <img
        className="os-portrait-photo"
        src={`/images/editorial/${phone ? "architect-phone" : "architect"}.webp`}
        width={phone ? 720 : 1400}
        height={phone ? 1000 : 788}
        alt="Varghese Shibu in a daylit architectural setting"
        fetchPriority="high"
      />
      <div className="os-portal-product" aria-hidden="true">
        <img
          src={`/images/kerasobha/${phone ? "home-mobile" : "home-1920"}.webp`}
          width={phone ? 390 : 1920}
          height={phone ? 844 : 1200}
          alt=""
        />
        <div className="os-portal-caption">
          <span>01 / A perspective, made tangible</span>
          <strong>{kerasobha.title}</strong>
          <span>Product design & full-stack engineering ↗</span>
        </div>
      </div>
      <span className="os-portrait-caption">01 / A human perspective</span>
    </div>
  );
}

export function DesktopHero() {
  return (
    <section className="os-arrival os-arrival-desktop" aria-label="Introduction" id="top">
      <div className="os-hero-stage">
        <div className="os-hero-topline">
          <span>
            {profile.title} / {profile.employer}
          </span>
          <span>Independent perspective — {profile.since} onwards</span>
        </div>
        <div className="os-hero-copy">
          <Label>Full-stack development / Creative engineering</Label>
          <h1>
            Built with
            <br />
            perspective<span>.</span>
          </h1>
          <p>
            Expressive on the surface.
            <br />
            Considered underneath.
          </p>
          <a className="os-text-link" href="#work">
            Explore selected work <Arrow />
          </a>
        </div>
        <Portal phone={false} />
        <span className="os-hero-axis" aria-hidden="true">
          +
        </span>
        <div className="os-arrival-foot">
          <span>
            {profile.location}
            <br />
            Building across the stack.
          </span>
          <span>
            Scroll to open the structure <span aria-hidden="true">↓</span>
          </span>
        </div>
      </div>
    </section>
  );
}
export function MobileHero() {
  return (
    <section className="os-arrival os-arrival-phone" aria-label="Introduction" id="top">
      <div className="os-hero-stage">
        <div className="os-hero-topline">
          <span>{profile.title}</span>
          <span>{profile.employer} / India</span>
        </div>
        <Portal phone />
        <div className="os-hero-copy">
          <Label>Creative engineering</Label>
          <h1>
            Built with
            <br />
            perspective<span>.</span>
          </h1>
          <Link className="os-text-link" to="/work/kerasobha">
            Explore selected work <Arrow />
          </Link>
        </div>
        <div className="os-arrival-foot">
          <span>{profile.location}</span>
          <span>Scroll to open ↓</span>
        </div>
      </div>
    </section>
  );
}
