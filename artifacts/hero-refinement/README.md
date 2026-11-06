# Hero refinement

The desktop hero now uses the regenerated Atelier v2 portrait with 1920, 2560 and 3840 pixel WebP delivery variants. Built-in imagegen preserved the facial identity, tailoring and study setting while improving detail and headroom. Its output master is 1672 x 941; the 3840 x 2160 delivery file is a Lanczos upscale, not native 4K detail. Encoding script: scripts/prepare-hero-v2.mjs. Exact generation prompt: prompt.txt.

The 1536 px hero video is retained in the film gallery but no longer covers the desktop photograph. Desktop opening choreography uses a directional photo reveal, camera settle, short identity mark, masked typography and a rule reveal. The high-resolution still remains on screen. Existing mobile imagery and reduced-motion fallbacks remain available. Architecture and closing films continue to progressively enhance their scenes.

The earlier full regression baseline passed 126 checks with 18 device-specific skips. Focused hero/media/navigation regression evidence is recorded in regression.log. The production Lighthouse reports predate this hero change; their scores are not claimed for this revision.

Final hero checks: 54 passed, 18 device-specific skips, zero failures in the focused hero/media/navigation run. The preceding full-suite baseline passed 126 with 18 skips. Final visual review at 1920 x 1080 and 3840 x 2160 confirmed full viewport height, top-aligned portrait framing, no video overlay, no horizontal overflow and no browser errors. Screenshots and visual-verification.json are local generated review artifacts.
