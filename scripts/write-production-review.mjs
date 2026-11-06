import { readFile, writeFile, readdir, copyFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { resolve, relative } from "node:path";
const output = "artifacts/production-review";
const audit = JSON.parse(await readFile(output + "/lighthouse-summary.json", "utf8"));
const logBytes = await readFile(output + "/final-tests.log");
const log = logBytes.readUInt16LE(0) === 0xfeff ? logBytes.toString("utf16le") : logBytes.toString("utf8");
const passed = [...log.matchAll(/(\d+) passed/g)].at(-1)?.[1];
const skipped = [...log.matchAll(/(\d+) skipped/g)].at(-1)?.[1] ?? "0";
if (!passed || /\d+ failed/.test(log))
  throw new Error("A completed successful test run is required before writing the final review");
const assets = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else {
      const bytes = await readFile(file);
      assets.push({
        path: relative(resolve("dist"), file).replaceAll("\\", "/"),
        bytes: bytes.length,
        sha256: createHash("sha256").update(bytes).digest("hex"),
      });
    }
  }
}
await walk(resolve("dist"));
assets.sort((a, b) => a.path.localeCompare(b.path));
await writeFile(
  output + "/release-manifest.json",
  JSON.stringify(
    { files: assets.length, bytes: assets.reduce((total, file) => total + file.bytes, 0), assets },
    null,
    2,
  ),
);
for (const [source, target] of [
  ["desktop-1440/00-hero.png", "hero-desktop.png"],
  ["mobile-390/00-hero.png", "hero-mobile.png"],
  ["desktop-1440/07-education.png", "education-desktop.png"],
  ["mobile-390/07-education.png", "education-mobile.png"],
])
  await copyFile("artifacts/screens/" + source, output + "/" + target);
const rows = Object.entries(audit.layouts)
  .map(
    ([mode, value]) =>
      `| ${mode} | ${value.scores.performance} | ${value.scores.accessibility} | ${value.scores["best-practices"]} | ${value.scores.seo} |`,
  )
  .join("\n");
const verification = `# Production review - 6 November 2026

The cinematic portfolio, distinct education chapter and supplied career dates are implemented. Three silent camera-motion films have desktop playback and still-image fallbacks. The fourth portrait is the closing scene.

Production build passed (TypeScript and Vite). The full Playwright suite completed: **${passed} passed, ${skipped} device-specific skips, zero failures** across 1920, 1440, 1024, 768, 390 and 360 px layouts. This includes section screenshots, routing, navigation, education and career facts, film decoding/playback/fallbacks, keyboard controls, crawler files, canonical URLs and changing reduced-motion preferences.

## Lighthouse 13.6.0

| Layout | Performance | Accessibility | Best practices | SEO |
| --- | ---: | ---: | ---: | ---: |
${rows}

Each reported performance score is the median of three valid sequential samples. Mobile ranged ${audit.layouts.mobile.performanceRange.join("-")}; desktop ranged ${audit.layouts.desktop.performanceRange.join("-")}. The shared Windows host showed substantial run-to-run variation. One desktop NO_FCP run is retained separately and excluded; it was replaced with a successful sample. Raw JSON, HTML and the complete sample summary are included. These are local lab measurements against Vite's production preview, not field Core Web Vitals or deployed-host scores. Mobile still has room to reduce main-thread work.

## Changes from the audit

- Phone hero details appear immediately, with a shorter title reveal. Phone layouts use native scrolling and explicit chapter controls; scroll-triggered editorial effects are reserved for larger layouts.
- Desktop scene setup waits until the section approaches the viewport. Repeated initial page measurements from tabs and accordions are removed; measurements still update when their state changes.
- Persistent heading compositor hints are removed; phone layouts omit the SVG grain compositor layer.
- Ivory labels, chapter controls, education metadata and the large date marker have improved contrast. SVG diagram and home-link accessible names include their visible text. Selection and skip-link contrast is corrected.
- Real robots.txt and sitemap.xml files prevent the SPA fallback being served to crawlers. Canonical and Open Graph URLs follow the current route; unknown routes use noindex.

## Delivery and limits

The release archive contains the contents of dist/ at its root. release-manifest.json records every production file's byte count and SHA-256 hash. Existing Netlify configuration and domain are retained. **No deployment or Git push was performed.**

Cinematic image sources were made with built-in imagegen and locally animated camera movement; Google Flow was not used. The three reference videos were not attached, so no video-by-video comparison is claimed. The Zarva project connection still returns an internal error, so no unverified case study is added. The existing resume PDF is retained.
`;
await writeFile(output + "/verification.md", verification);
const tableRows = Object.entries(audit.layouts)
  .map(
    ([mode, value]) =>
      `<tr><th scope="row">${mode}</th><td>${value.scores.performance}</td><td>${value.scores.accessibility}</td><td>${value.scores["best-practices"]}</td><td>${value.scores.seo}</td></tr>`,
  )
  .join("");
await writeFile(
  output + "/index.html",
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Varghese Shibu - Production review</title><style>body{margin:0;background:#e9e3d5;color:#283126;font:16px/1.6 system-ui,sans-serif}main{max-width:1120px;margin:auto;padding:60px 24px}h1{font:400 clamp(44px,6vw,84px)/1.05 Georgia,serif;margin:12px 0 30px}h2{font:400 34px Georgia,serif;margin-top:60px}a{color:#334c30;text-underline-offset:4px}p{max-width:760px}.eyebrow{text-transform:uppercase;font-size:12px;letter-spacing:.16em}.actions{display:flex;gap:22px;flex-wrap:wrap;margin:30px 0}table{border-collapse:collapse;width:100%;margin:30px 0;text-align:left}th,td{padding:14px 12px;border-bottom:1px solid #aaa78f}.gallery{display:grid;grid-template-columns:2fr 1fr;gap:24px;align-items:start}figure{margin:0}img{width:100%;height:auto;display:block}figcaption{padding-top:12px;font-size:13px}footer{margin-top:60px;border-top:1px solid #aaa78f;padding-top:24px;font-size:14px}@media(max-width:640px){.gallery{grid-template-columns:1fr}table{font-size:12px}th,td{padding:10px 4px}main{padding-top:40px}}</style><main><p class="eyebrow">The art of engineering / 6 November 2026</p><h1>Ready for review.</h1><p>The cinematic portfolio is built and packaged. ${passed} automated checks passed, with ${skipped} device-specific skips. The production build passed. This package has not been published.</p><div class="actions"><a href="portfolio-production.zip" download>Download production ZIP</a><a href="verification.md">Read verification</a><a href="../cinematic-assets/index.html">Preview the films</a></div><h2>Production audit</h2><table><thead><tr><th>Layout</th><th>Performance</th><th>Accessibility</th><th>Best practices</th><th>SEO</th></tr></thead><tbody>${tableRows}</tbody></table><p>Median of three valid local Lighthouse 13.6.0 runs per layout. Performance varied on the shared host; these are lab measurements. See the <a href="lighthouse-summary.json">complete sample summary</a>. Mobile main-thread work remains an opportunity.</p><div class="actions"><a href="desktop-final.report.html">Desktop report</a><a href="mobile-final.report.html">Mobile report</a><a href="release-manifest.json">Release file hashes</a></div><h2>The arrival</h2><div class="gallery"><figure><img src="hero-desktop.png" alt="Desktop portfolio hero with tailored portrait and editorial typography"><figcaption>Desktop / cinematic scene</figcaption></figure><figure><img src="hero-mobile.png" alt="Mobile portfolio hero with readable introduction and still portrait"><figcaption>Phone / immediate details and still imagery</figcaption></figure></div><h2>A distinct education chapter</h2><div class="gallery"><figure><img loading="lazy" src="education-desktop.png" alt="Desktop education chapter with dated academic timeline"></figure><figure><img loading="lazy" src="education-mobile.png" alt="Mobile education chapter with responsive academic records"></figure></div><footer>Source imagery uses the owner's facial identity with AI art direction. Films use local camera movement. Full provenance and remaining external verification limits are in the verification file.</footer></main></html>`,
);
console.log(
  JSON.stringify({
    passed: Number(passed),
    skipped: Number(skipped),
    productionFiles: assets.length,
    productionBytes: assets.reduce((total, file) => total + file.bytes, 0),
  }),
);
