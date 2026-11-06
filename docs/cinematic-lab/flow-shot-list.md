# Production shot list — The passage

Status: production briefs only. No new Google Flow jobs were submitted, no credits spent, and no new Flow-generated files are claimed. The working prototype uses the existing approved portrait, existing locally rendered architectural footage, and a real-time perspective renderer. All text and architecture controls are live HTML, never generated footage.

Shared delivery: 24 fps, silent, 16:9 at 1920×1080, plus a separately composed 9:16 at 1080×1920. Deliver original files before web encoding. Keep highlights champagne, shadows forest green, and midtones warm walnut. No text, logos, watermarks added by prompting, dashboards, fake interfaces, neon, facial morphs, or cuts. Any platform-required watermark must remain.

## 01 / The individual — 8 seconds

Exact visual prompt:

“Use the supplied approved atelier portrait as the exact first frame and sole identity reference. A composed Indian male software engineer sits in a dark leather chair inside a private walnut-panelled atelier, charcoal tailoring, open ivory collar. Preserve the reference face, hairline, skin texture, proportions, gaze, clothes and pose throughout. A warm, soft window key illuminates the right side of the room, with restrained champagne highlights and deep forest-green shadows. The camera slowly dollies backward by one metre on a straight track, revealing the edges of a large rectangular architectural opening around the portrait composition. The person remains still. Natural optical perspective and physically plausible parallax, no face reshaping, no lip motion, no camera shake, no cuts. End on a symmetrical walnut opening enclosing the original portrait, with its four inner corners at 30% and 70% of image width, 18% and 82% of image height. Leave the left third visually quiet. No text or interface elements.”

- Camera: straight backward dolly, 50 mm equivalent; no zoom simulation in generated source.
- Lighting: window key, no animated brightness pulses.
- Opening frame: approved `public/images/editorial/atelier-v2-1920.webp`, full bleed.
- Closing frame: dark walnut opening, geometry as specified above.
- Transition: final rectangle becomes shot 02’s doorway; approve a matched pair before production.
- Identity: compare face and pose at 0, 2, 4, 6 and 7.95 seconds. Reject any drift.
- Mobile: portrait in upper half, quiet lower half for HTML title. Do not crop the face out of the source frame.

## 02 / The passage — 8 seconds

Exact visual prompt:

“Begin with a symmetrical, dark walnut architectural opening, inner corners at 30% and 70% of image width and 18% and 82% of image height, matching the supplied final frame from the approved portrait shot. Beyond it, a quiet contemporary passage of travertine, walnut and softly lit warm brass ribs recedes to one central vanishing point. The camera travels forward continuously through the opening and along the passage. Afternoon light grazes the stone; shadows gradually deepen to forest green. Brass ribs become finer and more regularly spaced as the camera approaches the final opening. End facing a dark forest-green rectangular opening at centre, framed by extremely fine warm brass lines. No people, no text, no screens, no changes of location, no cuts, no dissolves, no dramatic exposure changes.”

- Camera: forward dolly, 35 mm equivalent; steady horizon and central vanishing point.
- Lighting: restrained raking sunlight giving way to indirect brass edge lighting.
- Opening: approved shot 01 closing frame supplied as ingredient.
- Closing: green opening, 40–60% width and 30–70% height.
- Transition: opening coordinates align with the live renderer’s first portal; image sequence yields to drawn geometry through a spatial mask.
- Identity: no person in this asset. Never synthesize a replacement face.
- Mobile: same central opening, vertical corridor composition, separate generation.

## 03 / Structure emerges — 6 seconds

Exact visual prompt:

“Begin at the exact dark forest-green rectangular opening with warm brass edges shown in the supplied closing frame of the architectural passage. Move forward through it into a quiet abstract architectural model, made from thin champagne brass lines and dark green translucent glass. The central opening’s four edges extend into a continuous perspective lattice. The camera cranes gently upward and tilts down to reveal eight low architectural plinths arranged over a green ground plane. Physical model, restrained luxury materiality, precise linework, no science-fiction neon. End in a stable oblique view, empty space across the top and right, with no text, no symbols, no data, no software interface, no people, no cuts.”

- Camera: forward move becomes upward crane and 35° downward pitch; ease to rest.
- Lighting: large soft top source, champagne rim, no flashing particles.
- Opening: shot 02 closing frame.
- Closing: oblique wireframe model, approximately 35° pitch, central-left composition.
- Transition: match projection of real HTML controls and canvas topology; retain functional code as the final scene. Generated geometry must not impersonate the actual system diagram.
- Identity: no people permitted.
- Duration across three shots: 22 seconds. Scroll progress, not elapsed time, controls delivery.

## Conversion and acceptance

For each approved shot, verify codec, frame rate, dimensions, duration and audio with ffprobe; extract regular review frames with FFmpeg. Generate 24 fps WebP sequences with a mobile resolution tier, then compare decoded size and seeking latency against MP4 before choosing delivery. Do not preload hundreds of full-resolution frames at arrival. Use the reusable frame-sequence adapter with progressive loading for a production sequence; the current prototype only loads one compact existing MP4.

No original reference videos were supplied or found, so these are original production designs, not descriptions of observed references. A comparative motion review remains unavailable.
