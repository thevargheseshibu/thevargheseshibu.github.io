# Varghese Shibu — Private Atelier × Digital Engineering

Editorial portfolio with restrained photography, cinematic scroll choreography and detailed engineering work. Built with React, Vite, TypeScript, Tailwind, GSAP, Lenis and Playwright.

## Run

Use Node 24. On Windows use npm.cmd if PowerShell blocks npm.ps1.

    npm install
    npm run dev
    npm run build
    npm test

Production output is in dist/. A 404.html copy supports client-side case-study routes on static hosts. The deployment destination is unchanged; this work does not publish automatically.

## Design and photography

Obsidian and forest alternate with ivory editorial chapters. Instrument Serif carries display typography; Inter Tight carries navigation and prose. Champagne accents remain restrained.

Only facial identity is taken from D:/App Resource/Care face. New wardrobe, settings, poses and lighting are AI art direction. Originals remain unchanged. Source concepts, prompts and the treatment/motion plan are in artifacts/portrait-review/. Optimized images are in public/images/editorial/. The footer discloses AI art direction.

- Private Atelier: opening portrait.
- The Architect: about portrait.
- After Hours: third portrait concept, retained in the review gallery.
- Studio Window: fourth portrait and current closing scene.

Regenerate encodings with node scripts/prepare-editorial.mjs. Earlier portrait-preparation scripts should not replace these assets.

## Motion

The opening portrait settles while the name and details reveal. Scrolling separates photograph and copy, leading into a typography manifesto, image mask, large project studies, interactive architecture, career timeline and closing scene.

The active hero, architectural passage and closing films are described below. The earlier procedural atelier-light film remains a source artifact and is no longer mounted.

The three reference videos mentioned in the pasted brief were not attached in this session. Motion follows the written direction.

## Content and verification

Existing professional facts, resume, project descriptions, clients, credentials and contact destinations are retained. No invented metrics or project screenshots are added. Payment and cargo graphics are architectural studies.

The Kerasobha case study, system nodes, technology tabs, engagement index, experience details, email, telephone, social links and resume remain functional.

Playwright covers 1920, 1440, 1024, 768, 390 and 360 px viewports, reduced motion, navigation, contact actions, routing and portrait framing. Screenshots are in artifacts/portrait-review/.

## Main files

- src/styles/tokens.css — palette, typography and rhythm.
- src/styles/atelier.css — editorial composition and responsive layouts.
- src/sections/ — the complete portfolio narrative.
- src/sections/work/FeaturedEngagements.tsx — payment and cargo studies.
- src/data/content.ts — professional content.
- public/images/editorial/ — optimized portraits.

## The Art of Engineering update

BlueOptima is the owner's current employer and a reference for clearer technical storytelling. The original portfolio identity is retained. The new four-chapter transformation uses live DOM/SVG, selectable system components and a real project preview. Desktop gets a bounded pinned sequence; touch layouts keep native scrolling and explicit controls.

Education now has its own chapter, navigation entry and three dated records. Career information follows the owner's supplied LinkedIn export: BlueOptima (Aug 2025–present), Zemoso (Jun–Jul 2025), CloudBerry360 (Jan 2024–Jul 2025), separate IBS positions, and separate Panasonic positions. Supplied overlapping dates remain unchanged. Current duties are plugin, web and backend development. No inferred metrics or employer-specific implementation details are added.

Screenshots, feasibility notes, optional Flow prompts and test evidence for this update are in artifacts/art-of-engineering/. Employer and education logos are local copies of the image links supplied by the owner; no private profile-edit URLs are used in the site.

## Cinematic asset delivery

Three actual silent films are integrated: a 7-second hero, a 6-second architectural passage and a 7-second closing portrait. Each is provided as H.264 MP4 and VP9 WebM with a WebP poster under public/media/cinematic/. Preferred MP4 delivery is 361–617 KB per scene.

New keyframes were generated with the built-in imagegen tool. Videos use locally rendered camera movement, not synthesized facial/body motion and not Google Flow. Chrome app access timed out during the Flow-access check, so no Flow generation is claimed. The fourth portrait is the new closing scene.

CinematicVideo progressively enables playback only on suitable pointer-capable desktop layouts. It defers loading near the viewport, pauses offscreen and when the document is hidden, and leaves still imagery for mobile, reduced motion, Save-Data, slow connections, low-memory devices or media failure. Only the active architectural chapter enables its film. The live system diagram remains DOM/SVG.

Recreate assets with node scripts/render-cinematic-assets.mjs. The included WebM metadata helper sets finite duration metadata for this renderer's index-free MediaRecorder output. Sources, image prompts, sample frames, technical manifest and a playable local gallery are in artifacts/cinematic-assets/.

## Production review

Phone layouts retain native scrolling, immediate hero details and explicit transformation controls. Desktop editorial effects initialize near their section instead of measuring the whole narrative on arrival. Changing the system reduced-motion preference reverts active shared GSAP scenes. Phones omit the full-screen SVG grain layer and persistent heading compositor hints have been removed.

Crawler files are in public/robots.txt and public/sitemap.xml. Canonical and Open Graph URLs follow the active route; unknown routes use noindex. Audit reports, verification details and the production release package are in artifacts/production-review/. Lighthouse reports are local lab measurements, not field Core Web Vitals.

To repeat the audit, first run the production preview on port 4173, then install the audit tool in the ignored cache with npx --yes --cache .cache/npm --package lighthouse lighthouse --version. Run node scripts/review-production.mjs mobile and node scripts/review-production.mjs desktop sequentially with no concurrent browser tests. LIGHTHOUSE_ROOT can point to a different installed Lighthouse directory.

## Desktop hero refinement

The hero now uses the Atelier v2 portrait and 1920/2560/3840 px responsive WebP variants. A browser-rendered photo reveal and staggered typography replace the lower-resolution hero video overlay, preserving clarity on large screens. The new generated master is 1672 x 941; the 3840 x 2160 delivery variant is upscaled and is not presented as native 4K detail. Mobile retains its existing crop. See artifacts/hero-refinement/ for the source, exact imagegen prompt, screenshots and regression evidence. The earlier Lighthouse scores predate this refinement.
