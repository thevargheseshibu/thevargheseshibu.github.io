# Main portfolio: nine spatial chapters

Route: `/` — the cinematic treatment now lives on the main portfolio. Direct chapter links are `/#about`, `/#work`, `/#engineering`, `/#stack`, `/#experience`, `/#education` and `/#contact`. The original `/cinematic-lab` remains available as its own study.

## Distinct motion, shared direction

| Chapter     | Choreography                                                                                                        | Functional content                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Portrait    | Full-bleed portrait pulls back in perspective; the name leaves on another plane; oversized destination type enters. | Name, current role, employer, selected-work link.                                                           |
| Passage     | A camera push travels through architectural ribs and the existing corridor photograph.                              | Transition into the practice.                                                                               |
| Perspective | The portrait's architectural plane contracts into an angled composition, revealing the biography.                   | Full biography, location, practice, original lab link.                                                      |
| Product     | Four actual product captures travel through a perspective theatre with independently selectable stops.              | Kerasobha story, storefront, product and order; real case-study and live-site links.                        |
| System      | The architecture grows from a vanishing region into an explorable perspective ground plane.                         | Eight inspectable nodes, request tracing, drag/keyboard orbit, zoom/reset, six expandable design decisions. |
| Toolset     | Three independently rotating orbital planes carry the technology disciplines around a central monogram.             | Six keyboard-selectable disciplines and their actual tools.                                                 |
| Journey     | A horizontal career filmstrip crosses large chronological typography and a progress rail.                           | Every employer, exact dates, responsibilities, promotions, programmes, credentials and résumé.              |
| Foundations | Education sheets telescope, rotate and exchange depth across a drafting grid.                                       | Three education records, institutions, dates, locations and thesis research.                                |
| Closing     | An iris opens into the evening portrait while circular geometry and the contact composition move independently.     | Email, clipboard copy with failure feedback, phone, résumé, social links and back to top.                   |

`useChapter` owns each reversible scroll clock and selected chapter state. `createScrollScene` now accepts chapter-specific scroll lengths and exposes selectable static states. The original lab keeps its original default duration. Resize observation and font-ready remeasurement keep downstream pins aligned after unpinned ledgers change height.

The main portfolio does not load autoplay footage. It uses existing approved imagery, actual product screenshots, CSS perspective and the existing lightweight canvas renderer. No new paid or generated video assets are claimed. The new recordings are browser evidence of the implemented motion.

## Responsive behaviour

Mobile gets distinct compositions and shorter scroll distances. Reduced-motion preferences and windows 650 px high or shorter use unpinned scenes with selectable content. Native touch scrolling is retained; keyboard users can rotate the architecture with arrow keys and switch tool disciplines with left/right arrows. Long career details have a bounded, independently scrollable disclosure.

## Verification and review

The production build and TypeScript checks pass. Desktop/mobile browser review captures 0%, 50% and 100% for all nine scenes, checks visible pixel changes, retraces every scroll clock, and verifies product stops, keyboard toolset, career selection, education selection, system inspection and request tracing. Reduced motion verifies no pins or videos and access to research details.

The updated regression tests cover the new interfaces while retaining checks for profile facts, career promotions, education dates, image delivery, navigation/menu behaviour, contact actions, canonical routes and the original cinematic lab.

In the final short recorded scroll samples, desktop mean frame intervals ranged from 16.8 to 26.9 ms across chapters (approximately 37–60 fps), with p95 at most 33.4 ms. Mobile emulation averaged approximately 16.7 ms (60 fps) in each chapter. The passage was optimized by replacing extreme photographic enlargement and a moving image clip with restrained image movement, transform-only shutters and culled architectural ribs; the main navigation also avoids a continuously composited backdrop blur. These measurements describe local Chromium while recording, not physical-device or production performance guarantees.

Review artifacts are generated in the repository's existing ignored evidence directory:

- [Desktop/mobile gallery](../artifacts/portfolio-scenes/index.html)
- [Desktop motion recording](../artifacts/portfolio-scenes/desktop-journey.webm)
- [Mobile motion recording](../artifacts/portfolio-scenes/mobile-journey.webm)
- [Checkpoint and timing data](../artifacts/portfolio-scenes/verification.json)

To reproduce, serve the production build on port 4185 and run `node scripts/review-portfolio-scenes.mjs`. Set `RECORD=1` to capture continuous forward/reverse motion and animation-frame timing. Timings are local Chromium measurements while recording; they are not physical-device performance guarantees.

Desktop/mobile regression coverage completed with 46 passing tests and four device-specific skips. The twelve additional layout checks passed across six configured viewport projects; they exercise all eight nodes, keyboard orbit and the short-landscape fallback. Eight synchronization, reduced-motion and routing tests passed again after the passage performance refinement.

Run `npm.cmd exec playwright -- test --project=desktop-1440 --project=mobile-390 --workers=2` for desktop/mobile regression coverage. Set `PLAYWRIGHT_BASE_URL` to reuse an already running production preview without starting another web-server process. `tests/portfolio-layout.spec.ts` exercises the six configured viewport projects.
