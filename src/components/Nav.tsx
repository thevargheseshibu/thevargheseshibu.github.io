import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { nav, profile } from "../data/content";
import { lockScroll, scrollToTarget } from "../lib/smooth-scroll";
import { gsap, prefersReducedMotion } from "../lib/motion";

/** Compact fixed navigation. Desktop: indexed inline links. Mobile: full-screen menu with focus management. */
export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const headerRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isHome = pathname === "/";

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      const length = document.documentElement.scrollHeight - window.innerHeight;
      headerRef.current?.style.setProperty("--reading-progress", String(length > 0 ? window.scrollY / length : 0));
      const current = nav.find((item) => {
        const bounds = document.getElementById(item.id)?.getBoundingClientRect();
        return bounds && bounds.top <= window.innerHeight * 0.45 && bounds.bottom > window.innerHeight * 0.45;
      });
      setActive(current?.id ?? "");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // Menu open/close: scroll lock, Escape, focus trap, entrance animation.
  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const menu = menuRef.current!;
    const focusables = () => Array.from(menu.querySelectorAll<HTMLElement>("a,button"));
    focusables()[0]?.focus();
    if (!prefersReducedMotion()) {
      gsap.fromTo(
        menu,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.7, ease: "power4.inOut" },
      );
      gsap.from(menu.querySelectorAll("[data-menu-item]"), {
        yPercent: 110,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.06,
        delay: 0.25,
      });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const f = focusables();
        const first = f[0],
          last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (isHome) {
      // Wait a frame so the scroll lock is released first.
      requestAnimationFrame(() => scrollToTarget(`#${id}`));
      history.replaceState(null, "", `#${id}`);
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <header
      ref={headerRef}
      className={`site-nav fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[background-color,backdrop-filter] duration-500 ${
        scrolled && !open ? "bg-ink/70 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="shell flex h-16 items-center justify-between md:h-[72px]">
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label={`VS ${profile.name} — home`}
          onClick={() => setOpen(false)}
        >
          <span className="nav-monogram grid size-9 place-items-center font-display text-xl tracking-tight transition-colors group-hover:text-crimson">
            VS
          </span>
          <span className="label hidden text-bone sm:block">{profile.name}</span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <li key={item.id}>
              <a
                href={`/#${item.id}`}
                aria-current={active === item.id ? "location" : undefined}
                onClick={go(item.id)}
                className="label group relative inline-flex gap-2 py-2 text-bone/80 transition-colors hover:text-bone"
              >
                {item.label}
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-crimson transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${profile.email}`}
            className="label hidden border border-bone/25 px-4 py-2.5 text-bone transition-colors hover:border-crimson hover:bg-crimson md:inline-block"
          >
            Let&rsquo;s talk
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="label relative z-[var(--z-menu)] flex h-11 items-center gap-3 px-1 text-bone lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={`absolute left-0 h-px w-6 bg-bone transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-bone transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </nav>
      <span className="reading-progress" aria-hidden />

      {open && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-0 z-[calc(var(--z-menu)-1)] flex flex-col bg-crimson-deep pt-24 lg:hidden"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_80%_0%,var(--color-crimson)_0%,transparent_60%)] opacity-60" />
          <ul className="shell relative flex flex-1 flex-col justify-center gap-1">
            {nav.map((item) => (
              <li key={item.id} className="overflow-hidden">
                <a
                  data-menu-item
                  href={`/#${item.id}`}
                  onClick={go(item.id)}
                  className="flex items-baseline gap-4 py-2 font-display text-[clamp(3rem,15vw,6rem)] font-normal leading-[0.95] tracking-[-0.02em]"
                >
                  <span className="label text-bone/60">{item.num}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="shell relative flex flex-wrap items-center justify-between gap-4 border-t border-bone/20 py-6">
            <a href={`mailto:${profile.email}`} className="label text-bone">
              {profile.email}
            </a>
            <span className="label text-bone/60">{profile.location}</span>
          </div>
        </div>
      )}
    </header>
  );
}
