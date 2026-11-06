import { useEffect, useLayoutEffect, type RefObject } from "react";
import { gsap, useReducedMotion } from "./motion";

/** Mobile scenes share native scrolling; each owns a distinct reversible transformation. */
export function useMobileChoreography(root: RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    element.dataset.motion = reduced ? "reduced" : "animated";
    if (reduced) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(element);
      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
      entrance
        .fromTo(q(".mp-arrival-image"), { scale: 1.12 }, { scale: 1, duration: 1.3 })
        .fromTo(
          q(".mp-arrival-copy h1"),
          { y: 65, rotationX: 22, opacity: 0 },
          { y: 0, rotationX: 0, opacity: 1, duration: 1 },
          0.12,
        )
        .fromTo(
          q(".mp-arrival-copy>.mp-eyebrow,.mp-arrival-copy>p,.mp-arrival-copy>.mp-link"),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.09, duration: 0.65 },
          0.35,
        );
      gsap.to(q(".mp-arrival-copy"), {
        yPercent: -22,
        rotationX: 7,
        ease: "none",
        scrollTrigger: { trigger: q(".mp-arrival")[0], start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(q(".mp-arrival-image"), {
        yPercent: 16,
        ease: "none",
        scrollTrigger: { trigger: q(".mp-arrival")[0], start: "top top", end: "bottom top", scrub: true },
      });
      const passage = gsap.timeline({
        scrollTrigger: { trigger: q(".mp-passage")[0], start: "top top", end: "bottom bottom", scrub: true },
      });
      passage
        .to(q(".mp-passage-image"), { scale: 1.65, xPercent: -8, ease: "none" }, 0)
        .to(q(".mp-passage-frame"), { scale: 4, opacity: 0, ease: "power1.in" }, 0)
        .to(q(".mp-passage-rib"), { scale: 3.4, opacity: 0, stagger: 0.045, ease: "power1.in" }, 0)
        .to(q(".mp-passage-word"), { yPercent: -24, scale: 1.1, ease: "none" }, 0);
      element.querySelectorAll<HTMLElement>(".mp-heading").forEach((heading) => {
        gsap.fromTo(
          heading,
          { y: 55, rotationX: 14 },
          {
            y: 0,
            rotationX: 0,
            ease: "none",
            scrollTrigger: { trigger: heading, start: "top 96%", end: "top 58%", scrub: true },
          },
        );
      });
      gsap.fromTo(
        q(".mp-about-photo"),
        { clipPath: "inset(13% 9% 0% 9%)", rotationY: -9, scale: 0.94 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          rotationY: 0,
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: q(".mp-about-photo")[0], start: "top 95%", end: "top 30%", scrub: true },
        },
      );
      gsap.fromTo(
        q(".mp-about-photo img"),
        { scale: 1.18, yPercent: -7 },
        {
          scale: 1,
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: q(".mp-about-photo")[0], start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        q(".mp-film-shell .showcase-screen"),
        { rotationX: 5, scale: 0.92, y: 18 },
        {
          rotationX: 0,
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: q(".mp-film-stage")[0], start: "top 95%", end: "top 55%", scrub: 0.18 },
        },
      );
      gsap.fromTo(
        q(".mp-project-number"),
        { x: 40 },
        {
          x: 0,
          ease: "none",
          scrollTrigger: { trigger: q(".mp-work-story")[0], start: "top bottom", end: "top center", scrub: true },
        },
      );
      gsap.to(q(".mp-tools-mark>i:first-child"), {
        rotation: 155,
        ease: "none",
        scrollTrigger: { trigger: q(".mp-tools")[0], start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.to(q(".mp-tools-mark>i:nth-child(2)"), {
        rotation: -145,
        ease: "none",
        scrollTrigger: { trigger: q(".mp-tools")[0], start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.fromTo(
        q(".mp-tools-mark>span"),
        { scale: 0.75, rotationY: -35 },
        {
          scale: 1,
          rotationY: 0,
          ease: "none",
          scrollTrigger: { trigger: q(".mp-tools-mark")[0], start: "top 95%", end: "top 40%", scrub: true },
        },
      );
      element.querySelectorAll<HTMLElement>(".mp-role").forEach((card, i) => {
        gsap.fromTo(
          card,
          { x: i % 2 ? 24 : -24, rotationY: i % 2 ? -9 : 9, y: 35 },
          {
            x: 0,
            rotationY: 0,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 94%", end: "top 43%", scrub: true },
          },
        );
      });
      gsap.fromTo(
        q(".mp-career"),
        { "--career-progress": 0 },
        {
          "--career-progress": 1,
          ease: "none",
          scrollTrigger: { trigger: q(".mp-career")[0], start: "top 70%", end: "bottom 70%", scrub: true },
        },
      );
      element.querySelectorAll<HTMLElement>(".mp-education-record").forEach((card, i) => {
        gsap.fromTo(
          card,
          { rotationX: 12, rotationZ: i % 2 ? -2 : 2, scale: 0.92, y: 50 },
          {
            rotationX: 0,
            rotationZ: 0,
            scale: 1,
            y: 0,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top 98%", end: "top 44%", scrub: true },
          },
        );
      });
      gsap.fromTo(
        q(".mp-contact-portrait"),
        { clipPath: "circle(21% at 70% 28%)", scale: 1.12 },
        {
          clipPath: "circle(120% at 70% 28%)",
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: q(".mp-contact")[0], start: "top 95%", end: "top 8%", scrub: true },
        },
      );
      gsap.fromTo(
        q(".mp-contact-copy"),
        { y: 70 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: { trigger: q(".mp-contact-copy")[0], start: "top bottom", end: "top 60%", scrub: true },
        },
      );
      gsap.fromTo(
        q(".mp-reading-progress>span"),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: element, start: "top top", end: "bottom bottom", scrub: true },
        },
      );
    }, element);
    const centerChoice = (event: MouseEvent) => {
      const button = (event.target as Element).closest<HTMLElement>(".mp-chip-strip button,.mp-system-picker button");
      const strip = button?.parentElement;
      if (!button || !strip) return;
      const a = button.getBoundingClientRect(),
        b = strip.getBoundingClientRect();
      strip.scrollBy({ left: a.left + a.width / 2 - b.left - b.width / 2, behavior: "smooth" });
    };
    element.addEventListener("click", centerChoice);
    return () => {
      element.removeEventListener("click", centerChoice);
      ctx.revert();
    };
  }, [root, reduced]);
}

/** Selection changes animate locally; scrolling never jumps to a new section. */
export function useMobilePanelMotion(root: RefObject<HTMLElement | null>, key: unknown) {
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.current,
        { y: 18, rotationX: 7, opacity: 0.55 },
        { y: 0, rotationX: 0, opacity: 1, duration: 0.42, ease: "power2.out", clearProps: "transform,opacity" },
      );
    }, root);
    return () => ctx.revert();
  }, [root, key, reduced]);
}
