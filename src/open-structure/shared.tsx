import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { nav, profile, socials } from "../data/content";
import { gsap, ScrollTrigger } from "../lib/motion";
import "./structure.css";

export function Arrow({ back = false }: { back?: boolean }) {
  return (
    <span aria-hidden="true" className="os-arrow">
      {back ? "↙" : "↗"}
    </span>
  );
}
export function Label({ children }: { children: React.ReactNode }) {
  return <p className="os-label">{children}</p>;
}
export function usePhone() {
  const [phone, setPhone] = useState(() => matchMedia("(max-width: 760px)").matches);
  useEffect(() => {
    const query = matchMedia("(max-width: 760px)");
    const update = () => setPhone(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return phone;
}

export function Header({ study = false }: { study?: boolean }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const restoreFocus = useRef(false);
  const { pathname } = useLocation();
  const prefix = study ? "/" : "";
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;
    if (!open) {
      if (modal.open) modal.close();
      if (restoreFocus.current) {
        restoreFocus.current = false;
        const frame = requestAnimationFrame(() => button.current?.focus({ preventScroll: true }));
        return () => cancelAnimationFrame(frame);
      }
      return;
    }
    restoreFocus.current = true;
    modal.showModal();
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const trap = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const controls = [...modal.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),[tabindex="0"]')];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    modal.addEventListener("keydown", trap);
    return () => {
      modal.removeEventListener("keydown", trap);
      document.documentElement.style.overflow = previous;
    };
  }, [open]);
  const close = () => setOpen(false);
  return (
    <>
      <header className="os-nav">
        <Link to="/" aria-label={`${profile.name}, home`} className="os-wordmark">
          vs<span>Varghese Shibu</span>
          <i aria-hidden="true">+</i>
        </Link>
        <nav className="os-desktop-nav" aria-label="Main navigation">
          {nav.map((n) => (
            <a key={n.id} href={`${prefix}#${n.id}`}>
              {n.label}
            </a>
          ))}
        </nav>
        <div className="os-nav-end">
          <span>{profile.location}</span>
          <a className="os-nav-contact" href={`${prefix}#contact`}>
            Let’s talk <Arrow />
          </a>
          <button
            ref={button}
            className="os-menu-toggle"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            Menu <span aria-hidden="true">＝</span>
          </button>
        </div>
      </header>
      <dialog ref={dialog} className="os-menu" onCancel={close} onClose={close} aria-label="Navigation">
        <div className="os-menu-top">
          <span>Varghese Shibu / Index</span>
          <button onClick={close} aria-label="Close navigation">
            Close ×
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          {nav.map((n, i) => (
            <a key={n.id} href={`${prefix}#${n.id}`} onClick={close}>
              <small>0{i + 1}</small>
              {n.label}
              <Arrow />
            </a>
          ))}
        </nav>
        <a className="os-menu-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
      </dialog>
    </>
  );
}

export function Contact() {
  const [copied, setCopied] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied("Email copied");
    } catch {
      setCopied("Select the email link to get in touch");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(""), 3500);
  };
  return (
    <footer className="os-contact" id="contact">
      <div className="os-section-top">
        <Label>06 / The next conversation</Label>
        <a href="#top">Back to the beginning ↑</a>
      </div>
      <div className="os-contact-intro">
        <h2>
          Let’s make
          <br />
          it matter<span>.</span>
        </h2>
        <p>
          A thoughtful interface.
          <br />A difficult engineering problem.
          <br />A better way to build it.
        </p>
      </div>
      <div className="os-contact-actions">
        <a className="os-email" href={`mailto:${profile.email}`}>
          {profile.email}
          <Arrow />
        </a>
        <button onClick={copy} aria-label="Copy email address">
          Copy email <span aria-hidden="true">⧉</span>
        </button>
        <span className="os-copy-status" role="status">
          {copied}
        </span>
      </div>
      <div className="os-contact-grid">
        <div>
          <Label>Find me</Label>
          {socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
              <Arrow />
            </a>
          ))}
        </div>
        <div>
          <Label>Start a conversation</Label>
          <a href={profile.phoneHref}>{profile.phone}</a>
          {profile.resumeUrl && (
            <a href={profile.resumeUrl} target="_blank" rel="noreferrer">
              View résumé <Arrow />
            </a>
          )}
        </div>
        <div>
          <Label>Based in</Label>
          <p>
            {profile.location}
            <br />
            {profile.title}
            <br />
            {profile.employer}
          </p>
        </div>
      </div>
      <div className="os-footer-name" aria-hidden="true">
        VARGHESE SHIBU
      </div>
      <div className="os-footer-bottom">
        <span>
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span>Designed & engineered with perspective.</span>
        <small>Portraits use AI art direction.</small>
      </div>
    </footer>
  );
}

export function usePageScene(scope: React.RefObject<HTMLElement | null>, phone: boolean) {
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    let disposed = false;
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        const hero = root.querySelector<HTMLElement>(".os-arrival");
        if (hero) {
          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.65,
              invalidateOnRefresh: true,
            },
          });
          timeline
            .to(".os-hero-copy", { y: phone ? -65 : -40, x: phone ? 0 : -50, opacity: 0, duration: 0.35 }, 0)
            .to(".os-portrait-photo", { opacity: 0, scale: 1.06, duration: 0.35 }, 0.2)
            .to(
              ".os-hero-portal",
              { top: "8%", left: "4%", width: "92%", height: "82%", duration: 0.7, ease: "power2.inOut" },
              0.12,
            )
            .fromTo(
              ".os-portal-product",
              { opacity: 0, clipPath: "inset(15% 15% 15% 15%)" },
              { opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.45 },
              0.35,
            )
            .to(".os-portal-caption", { opacity: 1, y: 0, duration: 0.25 }, 0.65)
            .to(".os-arrival-foot", { opacity: 0, duration: 0.2 }, 0);
        }
        root.querySelectorAll<HTMLElement>("[data-structure-line]").forEach((element) => {
          gsap.fromTo(
            element,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              scrollTrigger: { trigger: element, start: "top 90%", end: "top 55%", scrub: true },
            },
          );
        });
        const portrait = root.querySelector(".os-about-portrait img");
        if (portrait)
          gsap.fromTo(
            portrait,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: portrait.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
      },
      root,
    );
    document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    const timeout = setTimeout(() => {
      if (!disposed) ScrollTrigger.refresh();
    }, 400);
    return () => {
      disposed = true;
      clearTimeout(timeout);
      mm.revert();
    };
  }, [phone, scope]);
}

export function PageLocation() {
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const timer = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "instant" }), 100);
    return () => clearTimeout(timer);
  }, [hash]);
  return null;
}
