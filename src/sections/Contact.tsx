import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { profile, socials } from "../data/content";
import { gsap, useGsap } from "../lib/motion";
import { scrollToTarget } from "../lib/smooth-scroll";
import CinematicVideo from "../components/CinematicVideo";

function useIndiaTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(
      new Date(),
    );
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 30_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/** Closing scene: oversized headline, magnetic primary email action, socials, minimal footer. */
export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const cta = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);
  const time = useIndiaTime();

  useGsap(root, ({ isMobile }) => {
    const q = gsap.utils.selector(root);
    gsap.from(q("[data-headline] .mask > span"), {
      yPercent: 110,
      duration: 1.3,
      ease: "expo.out",
      stagger: 0.1,
      scrollTrigger: { trigger: q("[data-headline]")[0], start: "top 80%" },
    });
    gsap.fromTo(
      q("[data-light]"),
      { opacity: 0.2, scale: 0.8 },
      {
        opacity: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
      },
    );
    gsap.from(q("[data-fade]"), {
      opacity: 0,
      y: 20,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.08,
      scrollTrigger: { trigger: q("[data-actions]")[0], start: "top 90%" },
    });

    // Magnetic primary action (fine pointers only).
    if (isMobile || !window.matchMedia("(pointer: fine)").matches || !cta.current) return;
    const el = cta.current;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.3);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* Clipboard unavailable — the mailto link remains the primary path. */
    }
  };

  return (
    <section
      ref={root}
      id="contact"
      aria-labelledby="contact-title"
      className="contact-editorial grain relative isolate overflow-hidden bg-ink pt-[var(--spacing-section)]"
    >
      {/* A separate closing portrait with a progressive camera-motion film. */}
      <div data-light aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-[90%]">
        <img
          src="/media/cinematic/closing-cinema.webp"
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          alt=""
          className="contact-portrait"
        />
        <CinematicVideo
          base="/media/cinematic/closing-cinema"
          poster="/media/cinematic/closing-cinema.webp"
          className="contact-cinematic-video"
        />
        <div className="contact-shade" />
      </div>

      <div className="shell">
        <div className="mb-12 flex items-center justify-between border-t border-line pt-5 md:mb-16">
          <p className="label label-accent">07 — Contact</p>
          <p className="label">
            <span className="text-bone">{time}</span> IST · {profile.location}
          </p>
        </div>

        <h2 id="contact-title" data-headline className="display contact-heading text-bone">
          <span className="mask">
            <span>Good things</span>
          </span>
          <span className="mask">
            <span>
              <span className="serif-accent text-crimson">begin with</span>
            </span>
          </span>
          <span className="mask">
            <span>a conversation.</span>
          </span>
        </h2>

        <div data-actions className="mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
          {/* Primary action */}
          <div className="md:col-span-7">
            <p data-fade className="label mb-4">
              Start a conversation
            </p>
            <a
              ref={cta}
              data-fade
              href={`mailto:${profile.email}?subject=${encodeURIComponent("Project enquiry")}`}
              className="cta group relative inline-flex max-w-full items-center gap-4 overflow-hidden border border-bone/30 px-5 py-5 text-bone md:gap-6 md:px-8 md:py-7"
            >
              <span
                aria-hidden
                className="cta-fill absolute inset-0 origin-bottom scale-y-0 bg-crimson transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
              />
              <span className="relative min-w-0 truncate font-display text-[clamp(1.05rem,4.6vw,2.6rem)] font-[750] lowercase tracking-[-0.02em] [font-stretch:80%]">
                {profile.email}
              </span>
              <span className="relative grid size-10 shrink-0 place-items-center rounded-full border border-bone/40 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-45 group-hover:border-bone md:size-14">
                <ArrowUpRight className="size-5 md:size-6" aria-hidden />
              </span>
            </a>
            <div data-fade className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              <button
                type="button"
                onClick={copy}
                className="label inline-flex min-h-11 items-center gap-2 text-bone hover:text-crimson"
              >
                {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
                <span aria-live="polite">{copied ? "Copied to clipboard" : "Copy email"}</span>
              </button>
              <a
                href={profile.phoneHref}
                className="label inline-flex min-h-11 items-center text-bone hover:text-crimson"
              >
                {profile.phone}
              </a>
              {profile.resumeUrl ? (
                <a
                  href={profile.resumeUrl}
                  download="Varghese_Shibu_Resume.pdf"
                  className="label inline-flex min-h-11 items-center text-bone hover:text-crimson"
                >
                  Download résumé (PDF)
                </a>
              ) : (
                <a
                  href={`mailto:${profile.email}?subject=${encodeURIComponent("Résumé request")}`}
                  className="label inline-flex min-h-11 items-center text-bone hover:text-crimson"
                >
                  Request résumé
                </a>
              )}
            </div>
          </div>

          {/* Socials */}
          <ul className="md:col-span-4 md:col-start-9" aria-label="Elsewhere">
            {socials.map((s) => (
              <li data-fade key={s.label} className="border-t border-line last:border-b">
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between py-4 text-bone"
                >
                  <span className="font-display text-2xl font-[800] uppercase tracking-tight [font-stretch:70%]">
                    {s.label}
                  </span>
                  <span className="label flex items-center gap-2 transition-colors group-hover:text-crimson">
                    {s.handle}
                    <ArrowUpRight
                      className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <footer className="shell mt-[var(--spacing-section)] flex flex-col gap-3 border-t border-line py-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="label">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="label">Designed &amp; engineered in Kerala</p>
        <p className="label portrait-disclosure">Portraits art-directed with AI</p>
        <a
          href="#top"
          className="label text-bone hover:text-crimson"
          onClick={(e) => {
            e.preventDefault();
            scrollToTarget(0);
          }}
        >
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
