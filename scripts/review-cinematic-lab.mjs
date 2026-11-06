import { chromium } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";
import assert from "node:assert/strict";

const directory = "artifacts/cinematic-lab";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const reuse = process.env.LAB_REUSE === "1";
const report = reuse
  ? JSON.parse(await readFile(`${directory}/verification.json`, "utf8"))
  : { url: process.env.LAB_URL || "http://127.0.0.1:4185/cinematic-lab", devices: [] };
for (const [name, width, height] of reuse
  ? []
  : [
      ["desktop", 1440, 900],
      ["mobile", 390, 844],
    ]) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: name === "mobile",
    hasTouch: name === "mobile",
    recordVideo: { dir: `${directory}/recordings`, size: { width, height } },
  });
  const page = await context.newPage();
  const errors = [],
    failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(report.url);
  await page.locator(".lab-portrait img").evaluate((img) => img.decode());
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => Number(document.querySelector("main")?.dataset.end) > 0);
  const end = await page.locator("main").evaluate((el) => Number(el.dataset.end));
  const seek = async (p) => {
    await page.evaluate((y) => scrollTo(0, y), end * p);
    await page.waitForFunction((p) => Math.abs(Number(document.querySelector("main").dataset.progress) - p) < 0.005, p);
    await page.waitForTimeout(120);
  };
  const stages = [];
  for (const percent of [0, 20, 40, 60, 80, 100]) {
    await seek(percent / 100);
    const path = `${directory}/${name}-${percent}.png`;
    await page.screenshot({ path });
    stages.push(
      await page.evaluate(() => ({
        progress: Number(document.querySelector("main").dataset.progress),
        portrait: getComputedStyle(document.querySelector(".lab-portrait")).transform,
        videoTime: document.querySelector("video")?.currentTime,
        overflow: document.documentElement.scrollWidth > innerWidth,
      })),
    );
  }
  const differences = [];
  for (let i = 0; i < 5; i++) {
    const a = await sharp(`${directory}/${name}-${i * 20}.png`)
      .resize(160, 100)
      .removeAlpha()
      .raw()
      .toBuffer();
    const b = await sharp(`${directory}/${name}-${(i + 1) * 20}.png`)
      .resize(160, 100)
      .removeAlpha()
      .raw()
      .toBuffer();
    const mean = a.reduce((s, v, j) => s + Math.abs(v - b[j]), 0) / a.length;
    assert(mean > 1, `Insufficient visual change at ${i * 20}%`);
    differences.push(Number(mean.toFixed(2)));
  }
  // Record a genuine continuous scroll journey, then retrace it in reverse.
  await seek(0);
  const timing = await page.evaluate(async (end) => {
    const deltas = [];
    let previous = 0;
    const travel = async (from, to, duration) =>
      new Promise((resolve) => {
        let start;
        function frame(now) {
          if (start === undefined) start = now;
          if (previous) deltas.push(now - previous);
          previous = now;
          const p = Math.min(1, (now - start) / duration);
          scrollTo(0, end * (from + (to - from) * p));
          if (p < 1) requestAnimationFrame(frame);
          else resolve();
        }
        requestAnimationFrame(frame);
      });
    await travel(0, 1, 14000);
    await travel(1, 0, 6000);
    const sorted = deltas.slice().sort((a, b) => a - b);
    return {
      frames: deltas.length,
      meanFrameMs: deltas.reduce((a, b) => a + b, 0) / deltas.length,
      p95FrameMs: sorted[Math.floor(sorted.length * 0.95)],
      framesOver50ms: deltas.filter((d) => d > 50).length,
    };
  }, end);
  await seek(0.4);
  const reverse = await page.locator("main").getAttribute("data-progress");
  await seek(0);
  assert.equal(await page.locator(".lab-counter").textContent(), "000 / 100");
  await page.screenshot({ path: `${directory}/${name}-reverse-zero.png` });
  const original = await sharp(`${directory}/${name}-0.png`).raw().toBuffer();
  const reversed = await sharp(`${directory}/${name}-reverse-zero.png`).raw().toBuffer();
  const reverseDifference = original.reduce((s, v, i) => s + Math.abs(v - reversed[i]), 0) / original.length;
  assert(reverseDifference < 1, "Reverse did not restore initial composition");
  await seek(0.9);
  for (const label of [
    "Browser",
    "Edge assets",
    "Worker",
    "Enquiries",
    "Admin",
    "D1 / SQLite",
    "Cron trigger",
    "Resend",
  ]) {
    await page.locator(".lab-node").filter({ hasText: label }).click();
    assert.equal(await page.locator(".lab-inspector h3").textContent(), label);
  }
  await page.getByRole("button", { name: "Enquiry", exact: true }).click();
  assert.equal(await page.locator(".lab-node.traced").count(), 4);
  const before = await page
    .locator(".lab-node")
    .first()
    .evaluate((e) => e.style.left);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  assert.notEqual(
    await page
      .locator(".lab-node")
      .first()
      .evaluate((e) => e.style.left),
    before,
  );
  await page.getByRole("button", { name: "Reset view", exact: true }).click();
  const background = await page.evaluate(() => {
    for (const fy of [0.45, 0.55, 0.65, 0.72])
      for (const fx of [0.35, 0.45, 0.55, 0.65]) {
        const x = innerWidth * fx,
          y = innerHeight * fy;
        if (document.elementFromPoint(x, y)?.classList.contains("lab-orbit")) return { x, y };
      }
    return null;
  });
  assert(background, "No exposed orbit surface");
  await page.mouse.move(background.x, background.y);
  await page.mouse.down();
  await page.mouse.move(background.x + 60, background.y + 20, { steps: 8 });
  await page.mouse.up();
  assert.notEqual(
    await page
      .locator(".lab-node")
      .first()
      .evaluate((e) => e.style.left),
    before,
  );
  await page.screenshot({ path: `${directory}/${name}-interaction.png` });
  assert.deepEqual(errors, []);
  assert.deepEqual(failed, []);
  assert(stages.every((s) => !s.overflow));
  const video = page.video();
  await context.close();
  await video.saveAs(`${directory}/${name}-scroll.webm`);
  report.devices.push({
    name,
    width,
    height,
    stages,
    meanPixelChanges: differences,
    reverseProgress: reverse,
    reversePixelDifference: reverseDifference,
    timing,
    errors,
    failed,
    controls: "8 nodes, enquiry trace, zoom, reset, orbit passed",
  });
}
if (!reuse) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(report.url);
  await page.locator(".lab-node").first().click();
  assert.equal(await page.locator("video").count(), 0);
  assert.equal(await page.locator(".pin-spacer").count(), 0);
  assert.equal(await page.locator(".lab-inspector h3").textContent(), "Browser");
  await page.screenshot({ path: `${directory}/reduced-motion.png` });
  report.reducedMotion = "No pin, no video, static interactive architecture; node selection passed";
  await context.close();
}
report.additionalLayouts = [];
for (const [width, height] of [
  [360, 780],
  [768, 1024],
  [1024, 1366],
  [1920, 1080],
]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.goto(report.url);
  await page.waitForFunction(() => Number(document.querySelector("main")?.dataset.end) > 0);
  await page.evaluate(() => scrollTo(0, Number(document.querySelector("main").dataset.end) * 0.9));
  await page.waitForFunction(() => Number(document.querySelector("main").dataset.progress) > 0.89);
  for (const button of await page.locator(".lab-node").all()) {
    await button.click({ timeout: 5000 });
    const box = await button.boundingBox();
    assert(box.x >= 0 && box.x + box.width <= width, "Node outside viewport");
  }
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await page.screenshot({ path: `${directory}/layout-${width}.png` });
  report.additionalLayouts.push({ width, height, result: "8 nodes clickable, no horizontal overflow" });
  await context.close();
}
await browser.close();
await writeFile(`${directory}/verification.json`, JSON.stringify(report, null, 2));
await writeFile(
  `${directory}/index.html`,
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>The passage â€” motion review</title><style>body{background:#101b14;color:#eee8da;font:15px/1.6 system-ui;margin:0;padding:5vw}h1{font:64px Georgia;font-weight:400;margin-bottom:20px}h2{font:32px Georgia;font-weight:400;margin-top:60px}p{max-width:850px;color:#bcc4b5}a{color:#dfc89f}video{width:100%;max-height:80vh;background:#060e09}section{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}figure{margin:0}img{width:100%}figcaption{font-size:12px;color:#c2b38e}table{border-collapse:collapse}td,th{text-align:left;border-bottom:1px solid #54614d;padding:12px 20px 12px 0}@media(max-width:750px){section{grid-template-columns:1fr 1fr}h1{font-size:42px}}</style><p>Varghese Shibu / Cinematic lab / Original motion study</p><h1>The passage.</h1><p>Portrait â†’ architectural passage â†’ explorable spatial system. Scroll drives the entire transformation in both directions. <a href="${report.url}">Open the working prototype â†—</a></p><p>Created from an original concept because the three input references were unavailable. No new Google Flow footage was generated. Existing portrait and passage assets are combined with original runtime geometry. See <a href="../../docs/cinematic-lab/motion-review.md">motion review and limitations</a> and <a href="../../docs/cinematic-lab/flow-shot-list.md">Flow production shot list</a>.</p>${report.devices.map((d) => `<h2>${d.name} / Forward, reverse & interaction</h2><video controls preload="metadata" src="${d.name}-scroll.webm" poster="${d.name}-0.png"></video><p>The recording includes six checkpoint captures, a continuous 14-second forward journey, a 6-second reverse journey and control tests.</p><section>${[0, 20, 40, 60, 80, 100].map((p) => `<figure><a href="${d.name}-${p}.png"><img loading="lazy" src="${d.name}-${p}.png" alt="${d.name} composition at ${p}% scroll"></a><figcaption>${p}% scroll</figcaption></figure>`).join("")}</section>`).join("")}<h2>Measured locally</h2><table><tr><th>Viewport</th><th>Mean rAF interval</th><th>95th percentile</th><th>Frames over 50 ms</th></tr>${report.devices.map((d) => `<tr><td>${d.name}</td><td>${d.timing.meanFrameMs.toFixed(1)} ms</td><td>${d.timing.p95FrameMs.toFixed(1)} ms</td><td>${d.timing.framesOver50ms}</td></tr>`).join("")}</table><p>Chromium on this machine while recording, without CPU/network throttling. Not a device benchmark or production Lighthouse score. Video capture itself is encoded at the browser recorderâ€™s frame rate.</p><p>Checks: eight nodes, route trace, zoom, reset, orbit, reverse restoration, reduced motion, four extra layouts, zero page/console errors or failed HTTP responses. <a href="verification.json">Full verification data</a>.</p><h2>Reduced motion</h2><p>Unpinned static architecture, fully operable controls, no video.</p><img style="max-width:390px" src="reduced-motion.png" alt="Reduced motion architecture interface"><p>Main portfolio integration awaits the approval required in the supplied brief.</p></html>`,
);
console.log(JSON.stringify(report, null, 2));
