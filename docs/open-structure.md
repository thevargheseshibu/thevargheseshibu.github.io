# Open Structure — implementation and verification

The owner authorized the whole build after the recommendation of concept C. The homepage and Kerasobha case study now use that direction. The earlier concept route remains available as an archive. This work preserves the shared content file and the unrelated working-tree changes that were already present.

## Design and behavior

Mineral/limestone opening → carbon project gallery → light engineering section → midnight-blue engagement index → warm-white practice → stone career → light foundations → construction-blue contact. Archivo supplies display typography, Inter Tight the reading text. One rectangular opening carries the motion vocabulary. No stock fade-in system, custom cursor, scroll hijacking or continuously rendered canvas is used.

Desktop and phone heroes have separate DOM compositions and one active mount. The same native scroll progress drives distinct aperture geometries. The project gallery loads a phone capture on phone screens; desktop uses the larger actual interface captures. The engineering layers use shallow spatial composition on desktop and large flat controls on phones. Shared content, labels, request-step data and lifecycle utilities remain common.

The three signature interactions are implemented: portrait-to-interface aperture, a selectable real-interface evidence window, and an enquiry request lens. The system diagram is clearly labeled an architecture study and issues no service calls. Its description explains documented validation, persistence and retry decisions. Other client projects use typographic field notes rather than invented screenshots.

Every major section stays in normal document flow. The opening uses a bounded sticky stage, not an added GSAP pin spacer. A work link is visible immediately. Native anchors and the phone menu provide direct chapter access. The menu uses a native modal dialog plus explicit Tab cycling, Escape dismissal and post-close focus restoration, including WebKit touch behavior.

Reduced motion removes the sticky sequence, keeps the portrait and text visible, disables decorative movement and leaves explicit project/system controls. A change in the OS preference reverts the active GSAP match-media context. Resizing across the breakpoint replaces the presentation branch, clears the previous timeline and remeasures the new geometry. Unmounts cancel timers, listeners, observers and timelines.

The walkthrough is loaded only after a user action, uses native controls, and pauses offscreen/hidden. It is muted because this is a visual demonstration, with a written equivalent beside the still controls. Autoplay restrictions retain native play controls. Missing decoders or a load that cannot reach a usable frame return to stills with a status message. The WebKit test runner on this Windows host may lack MP4 decoding; its fallback is tested separately from Chromium playback. These tests do not represent a physical iPhone media test.

## What was preserved

All data remains sourced from `src/data/content.ts`: profile, contact, social links, resume, engineering projects, Kerasobha's role/problem/decisions/challenges/documented outcomes, employers, dates, promotions, responsibilities, programmes, clients, education, research, certifications and awards. Supplied overlapping career dates are unchanged. ZARVA has not been invented from a name; approved content is still needed.

Existing architectural and studio portraits were reused. No new personal image editing or video generation took place. The third original reference film is still absent. The two available reference analyses remain in `docs/creative-reset/research.md`; source clips stay in ignored local artifacts and are not distributed in the website.

## Reproduction

Build with `npm.cmd run build`. Start `npm.cmd run preview -- --port 4175 --strictPort`. Point browser checks at the built output with `$env:PLAYWRIGHT_BASE_URL='http://127.0.0.1:4175'`.

- `npm.cmd test` — active release suite. Eight configurations cover 1920, 1440, 1024, 768, 390, 360, 375 and 430 px. The 375/430 configurations use WebKit; the others use Chromium.
- `npm.cmd run shots` — screenshot-producing visual-review tests only.
- `node scripts/record-open-structure.mjs` — forward/reverse aperture and chapter walkthroughs at 1440 and 390 px, plus headless frame-interval samples. This is a lab observation, not a real-device frame-rate claim.
- Install optional audit tooling only into the ignored cache: `npm.cmd exec --yes --cache .cache/open-structure-audit --package lighthouse -- lighthouse --version`.
- With other browser tests stopped, run `node scripts/audit-open-structure.mjs mobile`, then `node scripts/audit-open-structure.mjs desktop` sequentially. Reports are in `artifacts/open-structure/audits/`.

The default test match now targets the replacement experience. Previous-design specs are retained for history; their removed CSS selectors, layout assumptions and media expectations are not release gates for this rebuild. The new suite explicitly replaces their behavioral coverage for navigation, contact, career and education, project controls, media, reduced motion, routing and crawlers.

## Review limits

All measurements are local lab results on the development PC and emulated browser viewports. They cannot certify field Core Web Vitals, physical Android/iPhone decoding, screen-reader usability or all-device animation smoothness. Static screenshots establish composition, not motion timing. Review the saved recordings and forward/reverse geometry checks alongside them. A physical phone pass remains advisable before publishing.

The build includes a route fallback and unchanged hosting destination. Committing and merging into main is a local repository result; no live deployment is implied. Unrelated source edits and inaccessible artifact directories were not repaired or incorporated into the commit.
