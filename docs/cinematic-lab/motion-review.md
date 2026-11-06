# Original motion study: The passage

The user directed creation of an original concept when the three input references could not be found. The checkout and accessible attachment directory contained no original reference recordings. No timestamp breakdown or claim of visual superiority is possible. This document describes the implementation, not purported observations of missing references.

## Choreography (22-second-equivalent mapping)

| Scroll | Equivalent time | Observable implementation                                                                                                            |
| ------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 0%     | 0.0s            | Full-bleed approved atelier portrait; HTML serif title; warm light and forest shadows.                                               |
| 20%    | 4.4s            | Portrait recedes in perspective, rotates around Y, and contracts into an aperture; title moves on its own depth plane.               |
| 40%    | 8.8s            | Aperture opens into the architectural image; scroll seeks the existing corridor film; projected brass portal ribs pass the camera.   |
| 60%    | 13.2s           | Camera advances through the rib tunnel; the spatial system grows from the shared vanishing region and the palette resolves to green. |
| 80%    | 17.6s           | Perspective ground plane and eight spatial components settle; accessible HTML controls appear at their projected coordinates.        |
| 100%   | 22.0s           | Explore: select any node, inspect its actual documented role, trace three request paths, drag to orbit, zoom and reset.              |

All cinematic state derives from GSAP ScrollTrigger progress, with `scrub: true`. Scrolling backward computes the earlier state. There are no autoplay videos or independent decorative animation loops. The real-time renderer uses Canvas 2D perspective projection instead of a Three.js dependency: one projection positions both drawn geometry and native HTML buttons. The scene redraws on scroll, camera interaction and resize only. This is a spatial diagram of existing architecture, not a live infrastructure monitor.

## Asset provenance

- Portrait: existing `public/images/editorial/atelier-v2-1920.webp`, with existing mobile composition. No facial regeneration.
- Passage: existing `public/media/cinematic/architectural-passage.mp4` and WebP poster. The existing manifest records AI image source plus locally rendered camera motion, **not Google Flow footage**.
- Portal, light field, lattice and component plinths: original runtime canvas drawing. No generated interface assets.
- New browser recordings: desktop/mobile `*-scroll.webm`, created by the review script from the implemented site.
- New Google Flow assets: none. See the shot list for production briefs.

## Review limits and next production improvements

The portrait is a single plane and does not reconstruct real facial depth. The existing passage clip is based on a still, so its photographic parallax is limited; real camera depth comes from the independent projected ribs and spatial system. Purpose-made matched shots would improve material continuity. At intermediate positions, matched materials and masks bridge the two existing photographic scenes, but they are not a continuous filmed location. Canvas is a lightweight perspective renderer, with no physically based lighting or solid 3D occlusion. The small spatial diagram favours inspectable functionality over a large engineering landscape.

Compare visual impact, composition, motion complexity, continuity and mobile behaviour against actual references only if they become available. The screenshot grid compares prototype states with each other; it is not a side-by-side reference comparison.

The prototype remains isolated at `/cinematic-lab`. The main portfolio’s sections and assets have not been changed. Integration remains subject to the approval requested in the supplied brief.
