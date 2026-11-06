# Cinematic review route

Review at `/cinematic`. This route is isolated from the portfolio homepage and has `noindex`. The owner rejected the separate six-act redesign and asked for a merge into the stronger existing design.

## Shared architecture

`Cinematic.tsx` wraps the existing `Home` in a review-only context; it does not duplicate section content, layouts or interactions. It reuses all nine portfolio sections, the existing navigation, the product film and case study, interactive 3D engineering model, tools, career, education and contact. Below 700px it uses the same independently built mobile portfolio. Main route behavior is unchanged by the default context value.

`PortfolioPreview` controls optional enhancements in the existing components. `ArchitecturalFilm` follows the existing passage chapter's progress attribute on desktop and the native passage scroll range on mobile. It creates no extra pin, smooth-scroll controller or scene clock. Seeking is coalesced, reversible, and removed with motion preference changes. The full video frame is contained to preserve the Flow watermark; reduced motion uses a still.

Authentic original portrait assets replace generated people only in the review variant. Scoped review CSS adds architecture around those originals while leaving shared typography and layouts in place. Navigation targets remain inside `/cinematic`; the brand link returns to the public homepage.

## Identity

The owner rejected the first two generated portraits because the face did not match. They are preserved only under ignored `artifacts/flow-walking/rejected-*`, excluded from public assets and deployment. Do not reuse them as identity references.

The owner then supplied `D:\App Resource\Care face`. The original front-facing selfie `WhatsApp Image 2026-10-09 at 2.19.07 AM (1).jpeg` is the reference for any future generation. Do not use previous generated faces as references. Other people and unrelated Care plans in the folder are outside this task.

Both coffee candidates made from the actual selfie were rejected by the owner. The first was briefly accepted, then rejected; the relaxed version was explicitly described as worse. Do not reuse either as a likeness reference or animate them. The relaxed version has been removed from public assets and preserved only under ignored artifacts. No personal video generation has been charged or submitted.

The preview currently displays the owner's unchanged original selfie in a framed composition. The owner clarified that facial likeness is the problem. Keep the original face pixels unchanged; do not generate another face or animate the rejected candidates. Personal walking, drinking and staircase movies remain future work; the existing architectural walking films contain no people. Prior built-in imagegen prompts and source PNGs remain under ignored artifacts for provenance.

## Playback repair

Kerasobha defaults to the lighter 1080p recording; a 3840x2160 master remains selectable. Interrupted play promises no longer turn into a permanent user pause. `canplay` retries when visible; explicit play/pause controls remain. The desktop product scene now scrolls naturally without the former 2.8 viewport pin. Still selectors change frames locally without jumping the page.

The four project pages have real 3840x2160 browser captures and 1920 variants. The homepage film is a read-only recording of the public website, not an iframe. The browser was recorded at 4K; underlying source movies may have lower native resolution. See `/media/kerasobha/capture-manifest.json`.
