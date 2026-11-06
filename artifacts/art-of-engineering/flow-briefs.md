# Optional Google Flow production briefs

Google Flow was not connected during this work. These are ready-to-use specifications, not claims of completed generation. The working signature interaction uses live DOM/SVG and does not depend on these assets.

## Atelier light

- Concept: a controlled sweep of daylight through a dark architectural study.
- Prompt: Slow, restrained daylight crossing a walnut architectural wall in a private contemporary study. Deep forest shadows, warm ivory highlights, subtle atmospheric depth, realistic diffuse light. Camera locked. No people, text, logos, luxury props, neon or visible particle spectacle. Seamless beginning and end, left half predominantly dark for HTML typography.
- Duration and framing: 6 seconds, 16:9, 1280×720 delivery.
- Intended use: very low-opacity decorative hero layer, never replacing the portrait or HTML content.
- Transition: fade in after playable; pause offscreen; no seeking required.
- Compression: VP9 WebM plus H.264 MP4 fallback; no audio; target under 700 KB each, 24 fps; avoid loading on Save-Data or reduced motion.
- Static fallback: existing hero portrait and CSS lighting. The current implementation includes a local procedural light film already.

## Architectural transition

- Concept: soft light moving from ivory stone into forest shadow.
- Prompt: A minimal architectural opening framed in warm limestone, a slow change in daylight revealing geometric planes and shadow. Subtle contemporary atmosphere, ivory to forest-charcoal palette, physically plausible light, locked camera and restrained movement. No human subject, no text, no symbols or technology overlays. Leave ample simple negative space.
- Duration and framing: 5 seconds, 16:9, 1280×720 delivery.
- Intended use: optional environmental layer behind the first transformation chapter only.
- Transition: low-opacity blend into the live SVG drafting scene; HTML and SVG remain fully independent.
- Compression: VP9/WebM and H.264/MP4 without audio, under 600 KB each. Lazy load near viewport; use CSS fallback on ordinary mobile devices.
- Static fallback: the live architectural SVG already implemented. This optional asset is not required for completion or navigation.
