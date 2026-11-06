import { useRef, useState } from "react";
import { usePortfolioPreview, originalPortrait } from "../../lib/portfolio-preview";
import { profile, socials } from "../../data/content";
import { useChapter } from "../../lib/use-chapter";
import { ease, phase } from "../../lib/cinematic-scene";
import { scrollToTarget } from "../../lib/smooth-scroll";

export default function ClosingScene() {
  const preview = usePortfolioPreview();
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false),
    [copyError, setCopyError] = useState(false);
  useChapter(root, 1.4, 1, (el, p) => {
    el.querySelector<HTMLElement>(".closing-iris")!.style.clipPath = `circle(${8 + ease(p) * 110}% at 73% 44%)`;
    el.querySelector<HTMLElement>(".closing-iris img")!.style.transform = `scale(${1.25 - p * 0.25})`;
    el.querySelector<HTMLElement>(".closing-orbit")!.style.transform =
      `translate(-50%,-50%) rotate(${p * 80}deg) scale(${1 + p * 0.8})`;
    el.querySelector<HTMLElement>(".closing-copy")!.style.transform =
      `translateY(${(1 - ease(phase(p, 0, 0.65))) * 40}px)`;
  });
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <section
      id="contact"
      ref={root}
      className="portfolio-scene closing-scene"
      data-scene="closing"
      aria-labelledby="contact-title"
    >
      <div className="scene-stage">
        <div className="closing-iris">
          <img
            src={preview ? originalPortrait.src : "/images/editorial/after-hours.webp"}
            width={1672}
            height={941}
            loading="lazy"
            alt={preview ? originalPortrait.alt : "An evening portrait of Varghese Shibu"}
          />
          <div />
        </div>
        <div className="closing-orbit" aria-hidden="true" />
        <div className="closing-copy">
          <p className="scene-label">07 / The next chapter</p>
          <h2 id="contact-title">
            Let's make
            <br />
            <em>it matter.</em>
          </h2>
          <p>
            A considered idea deserves
            <br />
            an equally considered execution.
          </p>
          <a className="closing-email cta" href={`mailto:${profile.email}`}>
            {profile.email}
            <span>↗</span>
            <i className="cta-fill" />
          </a>
          <div className="closing-actions">
            <button onClick={copy}>{copied ? "Email copied ✓" : "Copy email"}</button>
            <a href={profile.phoneHref}>{profile.phone}</a>
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} download>
                Résumé ↗
              </a>
            )}
          </div>
          <p className="closing-copy-status" role="status">
            {copyError
              ? "Copy unavailable. Use the email link above."
              : copied
                ? "Email address copied to clipboard."
                : ""}
          </p>
        </div>
        <div className="closing-socials">
          {socials.map((s) => (
            <a href={s.href} target="_blank" rel="noopener noreferrer" key={s.label}>
              {s.label} ↗
            </a>
          ))}
        </div>
        <footer className="closing-footer">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <span>Portraits art-directed with AI</span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget(0);
            }}
          >
            Return to the beginning ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
