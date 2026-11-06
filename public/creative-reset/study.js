const concepts = {
  a: {
    name: "Afterimage",
    category: "A / Cinematic modern luxury",
    headline: "A lasting<br>impression.",
    kicker: "Interfaces with feeling. Systems with intent.",
    rationale:
      "A filmic identity built around the tension between an intimate human portrait and monumental typography. Ultramarine acts as a hard editorial cut between a charcoal opening, photographic passages and a pale project stage.",
    colors: [
      ["#142acb", "Ultramarine"],
      ["#17191e", "Graphite"],
      ["#edf0f4", "Porcelain"],
      ["#a8b4cc", "Mist"],
    ],
    type: "Inter Tight / compressed, oversized names; quiet sentence-case supporting copy.",
    photo:
      "Wide environmental portraits, side light, everyday tailoring. On phones, a dedicated waist-up portrait with room above the head. Existing portrait is a composition proxy, not the proposed shoot.",
    motion:
      "A single lateral aperture: image, name and project crop move on related planes. Native vertical scrolling on phones; no scroll trapping.",
    signature:
      "Afterimage cut — a photographic rectangle resolves into the exact boundaries of a live project preview. Text stays in the DOM.",
    project:
      "Full-bleed project title cards alternate with white, readable case-study chapters. Kerasobha opens immediately after the identity scene.",
    mobile:
      "An edge-to-edge portrait stage, name split into two lines above the face, bottom thumb-reachable project action. Shorter reveal with a vertical aperture rather than a desktop pan.",
    feasibility:
      "CSS masks and GSAP transforms. A still-image prototype first; no WebGL required. Perspective matching needs approved footage before production.",
    performance:
      "One responsive portrait loaded initially. Defer film until near view; target ≤1.5 MB opening media and ≤250 KB compressed route JS. These are budgets, not measurements.",
    materials: ["Light / shadow", "Photographic scale", "Ultramarine cut"],
  },
  b: {
    name: "Signal / Field",
    category: "B / Experimental creative technology",
    headline: "Human intent.<br>System thinking.",
    kicker: "From an idea to everything underneath.",
    rationale:
      "The portfolio becomes a working spatial instrument. A soft violet field holds a human image, a request path and precise technical annotations. The visitor can move from the finished interface into its underlying system.",
    colors: [
      ["#dedbf3", "Chalk violet"],
      ["#29213e", "Aubergine ink"],
      ["#fbfaf7", "Paper"],
      ["#5740b5", "Iris"],
    ],
    type: "Archivo / bold geometric statements, open spacing; tabular system labels in a system monospace.",
    photo:
      "Natural studio portraits integrated as rectangular image planes. Keep the face unwarped. No holographic bodies, cyberpunk lighting or anonymous 3D objects.",
    motion:
      "A coherent expansion from one interface plane into a small set of meaningful system planes. Phone uses a vertical request path and explicit tap controls.",
    signature:
      "Request lens — select Interface, API or Data to reveal the real responsibilities of a Kerasobha request. The plane selection in this hero is an illustrative interaction study.",
    project:
      "A spatial project viewer with a persistent case-study link. Each view has one engineering decision and an accessible linear explanation.",
    mobile:
      "Large portrait at the top; three full-width layer controls below. Touch changes a single focused plane. No small orbit controls or drag-only navigation.",
    feasibility:
      "DOM, SVG and CSS perspective cover this prototype. Add one lazy-loaded WebGL surface only if depth testing proves that DOM compositing cannot deliver the approved interaction.",
    performance:
      "No continuous rendering when idle. At most one active scene. Cancel animation offscreen; fall back to a flat diagram for reduced motion and constrained devices.",
    materials: ["Translucent planes", "Soft violet field", "Request / response"],
  },
  c: {
    name: "Open Structure",
    category: "C / Architectural digital atelier · Recommended",
    headline: "Built with<br>perspective.",
    kicker: "Expressive on the surface. Considered underneath.",
    rationale:
      "Architecture becomes a way of explaining engineering: an opening, a structure, then the life inside it. Warm paper, blue construction marks and an off-axis portrait create a contemporary identity with a clear human center.",
    colors: [
      ["#eeeae2", "Limestone"],
      ["#23272c", "Carbon"],
      ["#234cd8", "Construction blue"],
      ["#bdb7ab", "Mineral"],
    ],
    type: "Archivo / variable width, sculptural scale and precise line breaks; Inter Tight for readable supporting copy. No repeated serif display headings.",
    photo:
      "Natural light through an architectural opening. One environmental hero, then working and seated scenes only where they advance the story. Request new original photography or approve identity-preserving editing after direction approval.",
    motion:
      "The same rectangular opening governs every transition: portrait frame, project viewport and system cross-section. Desktop moves through the opening; phone reveals upwards through it.",
    signature:
      "Open section — the portrait aperture becomes the Kerasobha viewport, then separates into interface, edge API and data layers. A readable case-study route remains available throughout.",
    project:
      "One immersive Kerasobha study with real screenshots, role, problem and decisions. The architecture opens into the actual interface; diagrams are labeled studies, never presented as shipped UI.",
    mobile:
      "A tall portrait opening anchors the upper two-thirds. A compact two-line statement sits on the solid lower plinth. The project action is visible without completing an animation.",
    feasibility:
      "CSS clip-path, SVG construction lines and one GSAP scene. Separate mobile and desktop presentation templates share the same data; only the active template mounts.",
    performance:
      "The opening works with a still image and no canvas. Reserve image dimensions; use local fonts and native scroll. Optional video gets a poster, manual fallback and a separate portrait encode.",
    materials: ["Daylit stone", "Structural opening", "Blue construction line"],
  },
};
const main = document.querySelector("main");
const media = matchMedia("(max-width: 700px)");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let current = ["a", "b", "c"].includes(new URL(location.href).searchParams.get("concept"))
  ? new URL(location.href).searchParams.get("concept")
  : "c";
let frame = 0;
const portrait =
  '<img class="portrait" src="/images/editorial/architect.webp" width="1400" height="788" alt="Existing art-directed portrait of Varghese Shibu in an architectural setting; composition reference" fetchpriority="high" />';
const identity =
  '<div class="identity"><strong>Varghese Shibu</strong><span>Senior Software Engineer<br>Bengaluru, India</span></div>';
const action = '<a class="work-action" href="#project">Explore selected work <span aria-hidden="true">↗</span></a>';
function hero(d) {
  if (current === "b")
    return `<section class="hero hero-b ${media.matches ? "phone" : "desktop"}" aria-label="${d.name} hero study">${identity}<div class="b-title"><p class="eyebrow">Creative engineering / Independent perspective</p><h1>${d.headline}</h1></div><div class="field" aria-hidden="true"><div class="plane plane-back"></div><div class="plane plane-image">${portrait}</div><div class="plane plane-front"><span>01 — Interface</span><i></i><span>02 — Edge API</span><i></i><span>03 — Data</span></div></div><div class="layer-controls" aria-label="Explore illustrative system planes"><button data-layer="interface" aria-pressed="true">01 Interface</button><button data-layer="api" aria-pressed="false">02 API</button><button data-layer="data" aria-pressed="false">03 Data</button><p class="layer-copy" aria-live="polite">Interface / where someone touches the product.</p></div><div class="hero-bottom"><p>${d.kicker}</p>${action}</div></section>`;
  if (current === "a")
    return `<section class="hero hero-a ${media.matches ? "phone" : "desktop"}" aria-label="${d.name} hero study"><div class="a-photo">${portrait}</div>${identity}<p class="a-side eyebrow">Full-stack development / Creative engineering</p><h1><span>VARGHESE</span><span>SHIBU<span class="name-dot" aria-hidden="true">↗</span></span></h1><div class="a-note"><span class="eyebrow">A practice in contrast</span><p>${d.headline}</p></div><div class="hero-bottom"><p>${d.kicker}</p>${action}</div></section>`;
  // Distinct templates: the phone has its own portrait-first visual order and short copy.
  return media.matches
    ? `<section class="hero hero-c phone" aria-label="${d.name} mobile hero study">${identity}<div class="portal">${portrait}<span class="portal-label">01 / A human perspective</span><span class="measure">VS — 001</span></div><div class="c-title"><p class="eyebrow">Creative engineering</p><h1>Built with<br>perspective.</h1></div><div class="hero-bottom">${action}<span class="edition">Selected work / 01</span></div></section>`
    : `<section class="hero hero-c desktop" aria-label="${d.name} desktop hero study">${identity}<div class="c-title"><p class="eyebrow">Full-stack development / Creative engineering</p><h1>${d.headline}</h1><p class="statement">${d.kicker}</p>${action}</div><div class="portal">${portrait}<span class="portal-label">01 / A human perspective</span><span class="measure">VS — 001</span></div><div class="hero-bottom"><span>Bengaluru ↗ Everywhere</span><span>Scroll to open the structure ↓</span></div><span class="axis" aria-hidden="true">+</span></section>`;
}
function render() {
  const d = concepts[current];
  document.body.dataset.concept = current;
  document
    .querySelectorAll("[data-concept]")
    .forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.concept === current)));
  main.innerHTML = `${hero(d)}
    <section class="project-study" id="project"><div class="project-heading"><p class="eyebrow">01 / Selected work · Presentation study</p><h2>Kerasobha</h2><p>Product design and full-stack engineering.<br>A Kerala coconut-care commerce platform.</p><a href="/work/kerasobha">Read the existing case study ↗</a></div><a class="project-image" href="/work/kerasobha" aria-label="Read the Kerasobha case study"><picture><source media="(max-width: 700px)" srcset="/images/kerasobha/home-mobile.webp" width="390" height="844" /><img src="/images/kerasobha/home-800.webp" alt="Actual Kerasobha website screenshot; mobile capture on phones" width="800" height="500" loading="lazy" /></picture></a><div class="project-facts"><span>Interface<br><strong>React / Next.js</strong></span><span>Edge API<br><strong>Cloudflare Workers</strong></span><span>Data<br><strong>Cloudflare D1</strong></span></div></section>
    <section class="direction" id="direction" aria-label="Creative direction details"><div class="direction-intro"><p class="eyebrow">${d.category}</p><h2>${d.name}</h2><p>${d.rationale}</p></div><div class="moodboard" aria-label="Material and color moodboard"><div class="material material-one"><span>${d.materials[0]}</span></div><div class="material material-two"><span>${d.materials[1]}</span></div><div class="material material-three"><span>${d.materials[2]}</span></div></div><div class="swatches">${d.colors.map(([hex, label]) => `<div><i style="background:${hex}"></i><strong>${label}</strong><span>${hex}</span></div>`).join("")}</div><div class="direction-grid">${[
      ["Typography", d.type],
      ["Portrait direction", d.photo],
      ["Independent mobile composition", d.mobile],
      ["Motion language", d.motion],
      ["Signature interaction", d.signature],
      ["Project presentation", d.project],
      ["Technical feasibility", d.feasibility],
      ["Performance strategy", d.performance],
    ]
      .map(([h, p]) => `<article><h3>${h}</h3><p>${p}</p></article>`)
      .join(
        "",
      )}</div><div class="approval-note"><p class="eyebrow">Decision / Before production</p><h3>Approve a direction.<br>Then build the experience.</h3><p>Review this concept at desktop and phone widths. Choose A, B or C in the conversation, with any changes to palette, type, portrait treatment or motion. A choice here previews a study; it does not record approval.</p><p>Reference analysis, scene storyboards and the staged production plan are in <code>docs/creative-reset/</code>.</p></div></section>`;
  main.querySelectorAll("[data-layer]").forEach((button) =>
    button.addEventListener("click", () => {
      main.querySelectorAll("[data-layer]").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      main.querySelector(".field").dataset.layer = button.dataset.layer;
      main.querySelector(".layer-copy").textContent = {
        interface: "Interface / where someone touches the product.",
        api: "Edge API / validation and request handling.",
        data: "Data / persistent records and versioned migrations.",
      }[button.dataset.layer];
    }),
  );
  updateMotion();
}
function updateMotion() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(() => {
    const hero = main.querySelector(".hero");
    const progress = reduced.matches
      ? 0
      : Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / hero.offsetHeight));
    hero.style.setProperty("--travel", String(progress));
  });
}
document.querySelectorAll("[data-concept]").forEach((button) =>
  button.addEventListener("click", () => {
    current = button.dataset.concept;
    const url = new URL(location.href);
    url.searchParams.set("concept", current);
    url.hash = "";
    history.replaceState(null, "", url);
    render();
    window.scrollTo({ top: 0, behavior: "instant" });
  }),
);
media.addEventListener("change", render);
reduced.addEventListener("change", updateMotion);
addEventListener("scroll", updateMotion, { passive: true });
render();
