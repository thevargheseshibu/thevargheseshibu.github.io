# Varghese Shibu — Open Structure

A complete portfolio built around an architectural opening: human perspective, real product interfaces, and the structure underneath. React, Vite, TypeScript and GSAP. The phone presentation is independently composed and uses native scrolling.

## Run

Use Node 24. On Windows:

    npm.cmd install
    npm.cmd run dev -- --port 5173
    npm.cmd run build
    npm.cmd test
    npm.cmd run shots

Local home: http://127.0.0.1:5173/
Case study: http://127.0.0.1:5173/work/kerasobha
Earlier direction review: http://127.0.0.1:5173/creative-reset/

`dist/` is the static release output. The Vite build also emits `404.html` for client-side case-study navigation on static hosts. Hosting configuration, CNAME, contact destinations and resume remain in place. Building and merging do not verify a live deployment.

## Experience

- A separately authored desktop or phone opening. A scroll-controlled architectural frame changes from a portrait into an actual Kerasobha interface. The project action is available immediately.
- A real-interface gallery with three product views, relevant engineering context, a full case study and an optional user-initiated walkthrough. No video is loaded initially. Playback pauses offscreen or when the document is hidden; unsupported or stalled media returns to stills.
- An interactive request architecture: interface, edge API, D1 and scheduled delivery. It is explicitly an illustrative explanation, not a running service or invented traffic dashboard.
- All documented engineering engagements, career responsibilities and promotions, education, credentials, awards, resume and contact links.
- A native modal phone menu with explicit focus cycling, Escape dismissal and focus restoration. Reduced motion restores the still opening and normal document flow.

## Main files

- `src/open-structure/Portfolio.tsx` — the complete homepage, practice, career and foundations.
- `src/open-structure/Hero.tsx` — separately composed desktop and mobile openings.
- `src/open-structure/ProjectExperience.tsx` — real project gallery, request lens and engagement index.
- `src/open-structure/shared.tsx` — navigation, contact, lifecycle-safe GSAP scenes and media query utilities.
- `src/open-structure/CaseStudy.tsx` — Kerasobha's complete project narrative.
- `src/open-structure/structure.css` — scoped mineral, carbon and construction-blue identity.
- `src/data/content.ts` — preserved professional and project content contract.

Earlier implementations remain in the repository for reference; `/` and `/work/kerasobha` now use Open Structure. The old Lenis controller is not mounted on these routes.

## Content and imagery

Professional facts and project descriptions come from the existing shared content contract. No new client outcomes, role claims or metrics have been invented. ZARVA needs approved case-study evidence before inclusion. Historical Kerasobha test outcomes are clearly distinguished from this portfolio's current checks.

The environmental and studio portraits are existing AI art-directed repository assets; the footer discloses that treatment. No new identity edits, generated portraits, Flow shots or generated software UI were made for this rebuild. Real Kerasobha screenshots and its existing walkthrough supply the project imagery. Two of the three requested reference videos were found and analyzed during concept work; the third remains unavailable.

## Verification

The active Playwright suite is `tests/open-structure.spec.ts`: seven behavioral/visual tests across eight browser configurations, including 1920, 1440, 1024, 768, 360, 375, 390 and 430 px. It covers motion reversal, reduced-motion changes, media-query remounting, focus behavior, project controls, all engineering engagements, education, promotions, media fallback, direct case-study routes, contact, resume and crawler metadata. Prior-design specs remain as historical references and are excluded from the active release test match.

For a specific production preview:

    npm.cmd run build
    npm.cmd run preview -- --port 4175 --strictPort
    $env:PLAYWRIGHT_BASE_URL='http://127.0.0.1:4175'
    npm.cmd test
    node scripts/record-open-structure.mjs

Screenshots, scroll recordings and lab audit reports live under ignored `artifacts/open-structure/`. See `docs/open-structure.md` for verification scope, audit reproduction and limitations. Concept research and storyboards remain under `docs/creative-reset/`.
