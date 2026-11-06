# Mobile motion architecture

The public `/` route retains its desktop composition. Below 700px, the existing mobile portfolio now owns its animation lifecycle in `src/lib/mobile-choreography.ts`.

- Arrival: one-time portrait/name entrance, followed by reversible depth and parallax while scrolling.
- Passage: the existing native sticky corridor gains layered perspective ribs and a forward/reverse portal transition.
- About: the photograph opens from an inset frame and moves independently of the readable copy.
- Product: the actual Kerasobha film unfolds through perspective. Only the screen transforms; playback/quality controls stay flat and retain reliable touch hit areas.
- Engineering: the existing Canvas 2D perspective model travels from portal geometry to assembled nodes as the section enters. Drag, keyboard orbit, selection and enquiry tracing remain live.
- Tools: counter-rotating orbital geometry follows scroll; tab changes animate the panel locally.
- Career: role cards enter from alternating depth planes and a gold timeline fills with reading progress.
- Education: records settle into place as layered cards while keeping native disclosures.
- Contact: a reversible circular portrait reveal introduces the contact actions.

Shared heading choreography, local selection transitions, expanding native disclosures and a page progress line connect the scenes. Horizontal choice strips center tapped options. No scroll interception or GSAP pin spacers were added. Animation uses the already-installed GSAP/ScrollTrigger and existing image assets; there are no new libraries, videos or generated portraits.

The mobile scene context reverts on unmount and motion preference changes. Reduced motion renders all content without scene animation; the architecture model still responds to direct interaction. Scroll-driven effects stop changing when scrolling stops. The model renderer redraws on progress, resize or interaction rather than running an idle loop.

Verification covers native scrolling and reversing the product transformation, model assembly with usable component controls, dynamic reduced-motion cleanup, HD/4K playback controls, all career/education content, responsive switching, and horizontal overflow. Layouts were inspected at 320, 390 and 430 CSS pixels. A browser recording is retained locally in ignored `artifacts/mobile-motion/mobile-walkthrough.webm`.
