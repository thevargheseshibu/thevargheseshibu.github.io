import { ArrowDownRight, ArrowRight } from "lucide-react";
import { engineeringProjects } from "../../data/content";

export default function FeaturedEngagements() {
  const payment = engineeringProjects[0];
  const cargo = engineeringProjects[1];
  return (
    <div className="engagements">
      <article className="engagement-stage payment-stage">
        <div className="engagement-copy">
          <p className="label">02 / Apexx Global · Payment infrastructure</p>
          <h3>
            One integration.
            <br />
            <em>Many possibilities.</em>
          </h3>
          <p>{payment.summary}</p>
          <ul className="technical-tags">
            {payment.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <a
            href="#project-payment-sdk"
            className="engagement-anchor"
            onClick={(e) => {
              e.preventDefault();
              const toggle = document
                .getElementById("project-payment-sdk")
                ?.closest("article")
                ?.querySelector("button");
              if (toggle?.getAttribute("aria-expanded") === "false") toggle.click();
              document
                .getElementById("project-payment-sdk")
                ?.closest("article")
                ?.scrollIntoView({
                  behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
                  block: "center",
                });
            }}
          >
            Explore the engagement <ArrowDownRight size={16} aria-hidden />
          </a>
        </div>
        <div className="payment-study" aria-label="Payment SDK architecture study">
          <div className="study-top label">
            <span>Integration study</span>
            <span>01 → 04</span>
          </div>
          <div className="payment-input">
            <span className="label">Commerce experience</span>
            <span>One considered checkout</span>
          </div>
          <div className="study-connector" aria-hidden />
          <div className="payment-core">
            <span className="label">JavaScript</span>
            <strong>Payment SDK</strong>
            <span className="label">Multi-gateway rendering</span>
          </div>
          <div className="gateway-branches" aria-hidden />
          <div className="payment-gateways">
            {["PayPal", "Google Pay", "Apple Pay", "Volt"].map((x) => (
              <span key={x}>{x}</span>
            ))}
          </div>
          <p className="study-note label">System concept · No transaction data</p>
        </div>
      </article>
      <article className="engagement-stage cargo-stage">
        <div className="engagement-copy">
          <p className="label">03 / Korean Air · Logistics platforms</p>
          <h3>
            Complex operations.
            <br />
            <em>A clearer experience.</em>
          </h3>
          <p>{cargo.summary}</p>
          <p className="cargo-secondary">
            Web and mobile engineering, from shipment tracking to the systems that support airline logistics.
          </p>
          <ul className="technical-tags">
            {["React", "React Native", "Node.js", "MongoDB"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="cargo-study" aria-label="Cargo platform architecture study">
          <div className="study-top label">
            <span>Platform study</span>
            <span>Web / Mobile</span>
          </div>
          <div className="cargo-orbit" aria-hidden>
            <span />
            <span />
            <span />
            <i />
            <i />
            <i />
          </div>
          <p className="cargo-study-title">
            Connected
            <br />
            <em>by design.</em>
          </p>
          <div className="cargo-flow">
            <span>Interface</span>
            <ArrowRight size={15} aria-hidden />
            <span>Services</span>
            <ArrowRight size={15} aria-hidden />
            <span>Data</span>
          </div>
          <p className="study-note label">React · Node.js · MongoDB</p>
        </div>
      </article>
    </div>
  );
}
