# Cinematic lab delivery

Local route: `http://127.0.0.1:4185/cinematic-lab`

The prototype is available on the standalone `/cinematic-lab` route. The user has requested merging completed changes into `main`; the home page remains separate from this prototype. A Git merge alone does not verify a live deployment.

## Review files

- [Review gallery, recordings and twelve checkpoints](../../artifacts/cinematic-lab/index.html)
- [Desktop recording](../../artifacts/cinematic-lab/desktop-scroll.webm)
- [Mobile recording](../../artifacts/cinematic-lab/mobile-scroll.webm)
- [Machine-readable verification](../../artifacts/cinematic-lab/verification.json)
- [Original motion design and limitations](motion-review.md)
- [Three Google Flow production briefs](flow-shot-list.md)

The generated evidence is in the repository's existing ignored `artifacts/` directory. Retain it separately if transferring only tracked source files.

## Implemented source

- [Cinematic scene and functional interface](../../src/pages/CinematicLab.tsx)
- [Reusable scroll clock, frame-sequence adapter and video seeking](../../src/lib/cinematic-scene.ts)
- [Perspective renderer and shared HTML projection](../../src/lib/cinematic-world.ts)
- [Responsive composition](../../src/styles/cinematic-lab.css)
- [Route registration](../../src/App.tsx)
- [Repeatable browser recording and verification](../../scripts/review-cinematic-lab.mjs)

## Validation

Production build and TypeScript check passed. Browser verification used the production build. Desktop (1440×900) and mobile emulation (390×844) passed forward and reverse scroll tests, all eight component inspections, enquiry tracing, zoom, reset, and drag orbit. Reverse scrolling restored the opening composition with zero pixel difference. Every adjacent checkpoint changed visibly. No page errors, console errors, failed HTTP responses or horizontal overflow were observed.

Additional viewports 360×780, 768×1024, 1024×1366 and 1920×1080 passed all eight node-click checks and overflow checks. Reduced-motion mode passed with static, operable architecture, no video and no pinned scroll journey. Chapter navigation and reverse video seeking passed separately, as did return navigation to the existing home page.

Measured during continuous scroll and browser recording, desktop averaged a 28.6 ms animation-frame interval (about 35 fps), p95 50 ms, with 27 intervals over 50 ms. Mobile emulation averaged 16.7 ms (about 60 fps), p95 16.7 ms, with no intervals over 50 ms. A separate unrecorded desktop run averaged 20.8 ms, p95 33.4 ms. These are local Chromium measurements on this host, not physical-device benchmarks. Desktop performance remains a production refinement item; smooth 60 fps is not established.

There were no available input reference videos. No reference comparison or claim of superiority is made. No new Google Flow assets were generated. Existing portrait and architectural assets were reused with original runtime geometry and HTML controls; the produced videos are browser recordings of this implementation.

## Reproduce

Run `npm.cmd run build` followed by `npm.cmd run preview -- --port 4185 --strictPort`, then `node scripts/review-cinematic-lab.mjs`. Set `LAB_URL` to use another local preview URL. The review script records a 14-second forward journey and six-second return, captures six positions per device, verifies controls and generates the gallery. `LAB_REUSE=1` retains existing recordings and runs the additional layout checks before regenerating the gallery.
