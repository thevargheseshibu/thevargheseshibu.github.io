# Creative reset — direction review

Review route: `/creative-reset/` (static, noindex). Direct studies: `?concept=a`, `?concept=b`, `?concept=c`. The default is C. This is a review surface, not a replacement portfolio or a claim that the cinematic rebuild is complete.

## Recommendation

**C — Open Structure** gives Varghese the strongest combination of hiring clarity, human presence, mobile composition and a motion idea that can explain actual engineering. The architectural opening can become a project viewport and then a system cross-section. It works with still photography, so its identity does not depend on video loading or a GPU.

A — Afterimage is the strongest immediate graphic statement. Its risk is that oversized typography and photography carry less distinctive engineering meaning. B — Signal / Field offers the most exploratory interaction, but has the greatest legibility, compositing and discovery risk. C makes the projects easier to reach while retaining room for ambitious transitions.

These are creative judgments, not measured hiring outcomes. Three different live hero studies and abstract material moodboards are available in the route. Each includes a palette, type system, portrait brief, mobile composition, motion language, signature interaction, project treatment, feasibility and performance strategy.

## What exists now

- Three independent directions, each with phone and desktop hero compositions. C uses separately authored templates. A and B have dedicated phone framing and controls. Only one hero mounts at a time; viewport changes remount the active composition.
- A real Kerasobha screenshot and a link to the existing case study. Its shared project facts come from `src/data/content.ts`; the small static study repeats only name, role and stack as a frozen review snapshot. Production must use the shared content contract.
- Lightweight scroll studies: lateral image/type separation in A, a moving plane group in B, and portrait aperture movement in C. B also offers keyboard-accessible layer controls. These are directional sketches, not completed cinematic scene transitions.
- Existing AI art-directed architectural portrait reused, explicitly labeled as a composition placeholder. No new identity generation, editing, footage generation or Flow job performed.
- Research in [research.md](research.md); storyboard and proposed asset production in [storyboards.md](storyboards.md); validation evidence in [validation.md](validation.md).

## Approval gates

| Gate                    | Status / next decision                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 — Research            | Repository and current desktop/phone audited. Two supplied videos sampled. Third video still needed. Public-source review has explicit observation limits.   |
| 2 — Concepts            | Three materially distinct directions and dual hero studies ready for review.                                                                                 |
| 3 — Art direction       | **Awaiting owner approval:** concept, palette, type, portrait treatment and motion premise.                                                                  |
| 4 — Dual hero           | Preliminary code studies supplied as requested by the final instruction. Refine the selected phone hero and secure mobile approval before expanding desktop. |
| 5 — Motion prototype    | Pending approval and reference completion. Build one complete forward/reverse scene and record it on phone and desktop.                                      |
| 6 — Case study          | Pending. Deliver Kerasobha with real interface and documented decisions. ZARVA needs approved role, features, imagery, disclosure scope and results first.   |
| 7 — Full implementation | Pending explicit creative direction and mobile approval.                                                                                                     |
| 8 — Full audit          | Pending implementation. Current checks cover the studies only.                                                                                               |

Review C first on a real phone, then desktop. In the conversation, approve A, B or C and any adjustments. Choosing a concept tab only changes the preview; it does not grant approval. Supply the third reference before finalizing the motion storyboard. A separate approval is required for new identity-preserving generation. The brief requests these approval gates; the Sites skill does not add another approval requirement.

## Integration ownership

The brief names Claude Code as lead engineer and Codex as creative implementation specialist. No Claude session was available or invoked here, and no claim of that collaboration is made. The work is deliberately contained in `public/creative-reset/`, `docs/creative-reset/` and `scripts/review-creative-reset.mjs` so a lead engineer can integrate the approved direction without file conflicts. Approximate 20% production ownership can be assigned once the selected design and complete implementation scope exist.

The current homepage and unrelated uncommitted edits are preserved. The repository initially showed inaccessible/corrupt artifact directories under `artifacts/hero-refinement` and `artifacts/production-review`; this work does not repair, restore or delete them. Reference videos and generated review evidence remain in ignored `artifacts/creative-reset/`; personal Downloads footage is not committed or published.

## Run

`npm.cmd run dev -- --port 5173` → `http://127.0.0.1:5173/creative-reset/`

For production-output review: `npm.cmd run build`, `npm.cmd run preview -- --port 4175 --strictPort`, then `node scripts/review-creative-reset.mjs`. Set `RESET_REVIEW_URL` to review another preview origin. Local preview is not verified live deployment.
