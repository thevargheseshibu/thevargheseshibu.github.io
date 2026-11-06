# Validation scope

The reset is a concept review, not the full portfolio rebuild. `npm.cmd run build` passes (TypeScript plus Vite). The unchanged production site still includes pre-existing uncommitted work; passing the build does not validate those unrelated edits or certify their design.

Run `node scripts/review-creative-reset.mjs` against the production preview on port 4175. It checks all three directions at **1920, 1440, 1024, 360, 375, 390 and 430 px**, captures each hero, project and direction section, records six forward/reverse scroll walkthroughs, and writes `artifacts/creative-reset/verification.json`.

Checks include:

- Exactly one active hero and one H1; correct phone/desktop branch.
- No horizontal page overflow at the requested widths.
- Hero project action at least 44 px high and visible in the initial viewport.
- Real project navigation target and successfully decoded portrait/project images.
- B layer selection and accessible descriptions, keyboard concept selection, viewport switching and reduced-motion setting.
- No browser page errors or HTTP failures during these isolated study visits.

The script does not test contact/resume or the existing case-study behavior, because those files were not changed. It does not establish WCAG conformance, production animation quality, on-device decode performance or field Core Web Vitals.

Visual review includes dual hero contact sheets for A/B/C, phone and desktop project/direction captures and scroll states. At this stage the strongest composition is C: a tall phone portrait opening, substantial type on a clear background and a visible work action. B has a larger face crop after review so the foreground system plane does not dominate the person. A's former registration glyph was replaced by a directional mark to avoid implying a registered personal trademark.

The recordings are evidence of the implemented light scroll studies, not of the future matched film-to-interface scene. Their generation alone is not proof of smoothness. The review checks sampled scroll transforms in forward/reverse states and treats easing and frame pacing on actual devices as a later production gate. No source-video easing or motion quality was inferred from still captures.

Output remains in ignored `artifacts/creative-reset/` and is not shipped in the site. Local fonts retain OFL license notices. The review page contains no new third-party scripts, tracking, generated portraits or footage.
