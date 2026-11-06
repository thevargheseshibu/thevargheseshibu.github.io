# Research and evidence

Review date: 6 November 2026. Preserve identity and repository-supported professional information; reset the visual identity. No external professional-history verification was performed. Existing content is the supplied source of record, not evidence for new claims.

## Current implementation audit

Read `src/pages/Home.tsx`, `src/App.tsx`, `src/data/content.ts`, `src/styles/tokens.css`, README and the available assets. Captured the current homepage at 1440 × 900 and 390 × 844 with reduced motion to inspect settled composition. Screenshots: `artifacts/creative-reset/current-desktop.png` and `current-mobile.png`.

Observed: forest/near-black and champagne dominate the first screen; the italic serif name and formal portrait repeat the established luxury vocabulary. Phone has a large portrait already, but keeps that same visual identity and a long vertical narrative. The reset should preserve its clear role and immediate project access while replacing its art direction. The current React implementation already switches presentation at a media boundary; keep that useful architecture rather than mounting two media experiences.

Kerasobha has a documented role, problem, stack, decisions and screenshots. Existing case-study outcomes are repository assertions; do not restate historic passing checks as current validation. ZARVA is requested in the new brief but lacks a verified case-study contract in the inspected portfolio data. Reserve its place until the owner supplies approved content. Preserve contact, resume, employment and existing case-study functionality during a future integration.

## Supplied videos

Folder supplied by the owner: `C:/Users/theva/Downloads/Mobile Devices`. It contains **two**, not three, MP4 files. Source copies are retained only under ignored local review artifacts. Browser-reported metadata:

| Reference                          | Duration | Encoded dimensions | Review method                          |
| ---------------------------------- | -------- | ------------------ | -------------------------------------- |
| `Agentic Build … (1).mp4`          | 57.329 s | 720 × 1280         | 12 ordered frames across the full clip |
| `POV- Got bored at home_… (1).mp4` | 11.283 s | 720 × 1280         | 12 ordered frames across the full clip |

Contact sheets: `artifacts/creative-reset/references/reference-1-sheet.png` and `reference-2-sheet.png`. Timestamps below are approximate sampled positions, not an event-by-event playback measurement. Frame sampling reveals state changes; it does not establish easing, frame rate or scroll synchronization.

### Reference 1 — evidence and systems

- Opening frames: a filmed laptop in a purple-lit room, a dark portfolio with large outlined red “PORTFOLIO” typography, filled white identity text and a red portrait block. The desktop content uses several columns and a persistent top navigation.
- Around 10–16 s: biography/background gives way to a project heading. Around 21–31 s: one large technical project dominates, then smaller engineering project cards follow. Around 36–42 s: a “Systems Matrix” presents structured technical categories. Around 47–57 s: the closing invitation appears; small colored pointer-like marks occupy the dark field.
- Memorable principle: assert identity quickly, then devote meaningful screen area to engineering evidence. Typography establishes a hierarchy between the person, featured project and supporting technical content.
- Depth is partly the physical filmed laptop and its oblique perspective. That is not evidence of WebGL depth within the website. The colored marks change positions between samples, but the samples do not establish whether they are cursors, scripted particles or a recording overlay.
- Usability visible in samples: conventional navigation, readable section labels, project links and closing contact action. Actual hit areas, keyboard behavior and phone layouts are unverified. This portrait video shows a desktop screen, not a phone website.
- Adaptation: retain the sequence identity → flagship project → engineering decisions → invitation; replace the dense desktop matrix with one focused phone decision at a time.

### Reference 2 — portrait as stage

- Early frames show a widescreen browser capture letterboxed inside a portrait video: red atmospheric backdrop, large central portrait, condensed white name on the left and a small secondary portrait/interface panel on the right.
- Around 2 s: small information cards sit in front of the central portrait. Around 3 s: multiple project previews occupy the stage. Around 4–7 s: the portrait changes scale and crop behind biography/experience content; a close-up with a hand at the glasses becomes a large background. Around 8–11 s: the opening identity composition returns.
- Memorable principle: the person remains the spatial anchor while the content changes scale and density. Portrait, typography and project frames share the stage instead of occupying disconnected sections.
- Observed state changes support a concept of foreground/background layering. They do not prove a specific mask technique, pinning, scroll driver, camera model or video-to-DOM transform. The return to the opening may be a recording edit or user navigation; do not infer looping site behavior.
- Usability visible: clear name, conventional top navigation, visually distinct project previews. Small dense labels in a letterboxed recording cannot establish legibility on a real phone.
- Adaptation: one large, identity-consistent environmental portrait; meaningful transitions into actual project UI. Keep the interface live in the browser. Avoid copying its red palette, sunglasses styling or generic card clusters.

### Missing evidence

The third original reference is still required. Neither supplied clip demonstrates independently designed mobile navigation or a real mobile composition. Motion timing, touch behavior and accessibility must be validated in prototypes, not inferred from these recordings.

## Contemporary public sources

The following were read as primary published pages. These are source-based design observations and our proposed applications, not claims of live motion inspection or measured performance. No external screenshots, brand assets or page code were copied.

| Source                                                                                             | Directly supported observation                                                                                                                                                                                        | Design inference / application                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [14islands — Cartier](https://www.14islands.com/work/cartier)                                      | The studio describes a chapter-based 2024 digital yearbook, Netflix-style navigation, 32 articles and micro-interactions; publishes paired desktop/mobile design images and lists design/developer awards.            | Treat narrative and navigation as one system; art-direct the phone chapter rather than shrink the desktop. Do not copy the luxury brand styling.                                         |
| [14islands](https://www.14islands.com/)                                                            | Its work index names clients, industries and projects; design and technology are presented together.                                                                                                                  | Put specific project evidence next to creative ambition.                                                                                                                                 |
| [Bruno Simon](https://bruno-simon.com/)                                                            | The portfolio describes a navigable world, offers mobile/tablet and keyboard controls, quality controls and recovery actions; its behind-the-scenes section identifies Three.js.                                      | A signature interaction should have a coherent premise, clear instructions and an escape/recovery path. Our portfolio needs faster case-study access than an exploratory driving world.  |
| [Snøhetta](https://www.snohetta.com/)                                                              | The project-led index connects people, process and disciplines, with direct project and contact navigation; the page also offers data-use settings.                                                                   | Architecture can structure content and wayfinding; make material atmosphere subordinate to projects and provide a lightweight experience. Motion implementation not established.         |
| [Aesop](https://www.aesop.com/)                                                                    | Its published page connects product collections, narrative campaigns and an editorial library including architecture/design and film. The fetched page also includes an offline/error notice.                         | Build contrast between storytelling and actionable product detail. Do not infer live transition quality from this limited response.                                                      |
| [Awwwards Mobile Excellence guidelines](https://www.awwwards.com/mobile-excellence-guidelines.pdf) | Published checklist includes legible type, tap targets, contrast, correctly sized content, visible key actions and prioritized visible content. It includes legacy tooling and is not a current performance standard. | Review phone composition and basic usability together. Use contemporary browser measurements during production; do not equate a visual study with an award or performance certification. |

Active Theory was also opened, but the response only said to enable JavaScript. No design or motion conclusion is drawn from it. Some award search results were inaccessible or third-party summaries; those are not used as evidence.

## Decisions carried into the studies

1. Three distinct atmospheres: saturated photographic blue, soft violet spatial instrument, daylit mineral architecture.
2. One project immediately follows each hero. No decorative chapter gate before work.
3. One motion premise per concept. No blanket reveal/fade library.
4. All critical content and actions exist in normal document flow and remain available with reduced motion.
5. Any production video depicts atmosphere and people; software UI is rendered separately from verified screenshots and real DOM.
