import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { profile } from "../data/content";
import { gsap, useGsap } from "../lib/motion";
import { scrollToTarget } from "../lib/smooth-scroll";

export default function About() {
  const root = useRef<HTMLElement>(null);
  useGsap(root, () => {
    const q = gsap.utils.selector(root);
    gsap.from(q(".about-photo"), {
      clipPath: "inset(12% 8% 12% 8%)",
      ease: "none",
      scrollTrigger: { trigger: root.current, start: "top 90%", end: "top 15%", scrub: 0.8 },
    });
    gsap.from(q("[data-about-reveal]"), {
      y: 28,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "expo.out",
      scrollTrigger: { trigger: ".about-editorial-copy", start: "top 80%" },
    });
  });
  return (
    <section ref={root} id="about" className="about-editorial paper-section" aria-labelledby="about-title">
      <div className="shell">
        <div className="section-kicker label">
          <span>01 — A little perspective</span>
          <span>The person behind the work</span>
        </div>
        <div className="about-editorial-grid">
          <figure>
            <div className="about-photo">
              <img
                src="/images/editorial/architect.webp"
                width={1672}
                height={941}
                loading="lazy"
                decoding="async"
                alt="AI art-directed portrait of Varghese Shibu in espresso tailoring against limestone architecture"
              />
            </div>
            <figcaption className="label">
              An independent mind. A considered practice.<span>01 / Portrait study</span>
            </figcaption>
          </figure>
          <div className="about-editorial-copy">
            <p data-about-reveal className="label">
              Engineer by discipline. Creator by instinct.
            </p>
            <h2 data-about-reveal id="about-title" className="display">
              A sense of craft.
              <br />
              <em>A mind for systems.</em>
            </h2>
            <p data-about-reveal className="about-lead">
              I’m Varghese, a full-stack developer and senior software engineer at BlueOptima.
            </p>
            {profile.about.map((p) => (
              <p data-about-reveal key={p}>
                {p}
              </p>
            ))}
            <dl data-about-reveal className="about-facts">
              <div>
                <dt className="label">Building since</dt>
                <dd>2019</dd>
              </div>
              <div>
                <dt className="label">Current practice</dt>
                <dd>End to end</dd>
              </div>
              <div>
                <dt className="label">Based in</dt>
                <dd>Bengaluru, India</dd>
              </div>
            </dl>
            <a
              data-about-reveal
              className="paper-link"
              href="#experience"
              onClick={(e) => {
                e.preventDefault();
                scrollToTarget("#experience");
              }}
            >
              Explore my experience <ArrowUpRight size={16} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
