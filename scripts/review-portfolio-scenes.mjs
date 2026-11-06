import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import sharp from "sharp";

const url = process.env.PORTFOLIO_URL || "http://127.0.0.1:4185/";
const directory = "artifacts/portfolio-scenes";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const report = { url, devices: [] };
for (const [name, width, height] of [
  ["desktop", 1440, 900],
  ["mobile", 390, 844],
]) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: name === "mobile",
    hasTouch: name === "mobile",
    ...(process.env.RECORD ? { recordVideo: { dir: `${directory}/recordings`, size: { width, height } } } : {}),
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
  });
  await page.goto(url);
  await page.locator("[data-scene]").last().waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() =>
    [...document.querySelectorAll("[data-scene]")].every((el) => Number(el.dataset.end) > 0),
  );
  const scenes = await page.locator("[data-scene]").evaluateAll((elements) =>
    elements.map((el) => ({
      id: el.id,
      name: el.dataset.scene,
      start: Number(el.dataset.start),
      end: Number(el.dataset.end),
    })),
  );
  const checkpoints = [];
  for (const scene of scenes) {
    for (const percent of [0, 50, 100]) {
      const target = scene.start + ((scene.end - scene.start) * percent) / 100;
      await page.evaluate((y) => scrollTo(0, y), target);
      await page.waitForTimeout(160);
      await page.screenshot({ path: `${directory}/${name}-${scene.id}-${percent}.png` });
      const state = await page.locator(`#${scene.id}`).evaluate((el) => ({
        id: el.id,
        progress: Number(el.dataset.progress),
        overflow: document.documentElement.scrollWidth > innerWidth,
      }));
      assert(!state.overflow, `Overflow at ${scene.id}`);
      assert(Math.abs(state.progress - percent / 100) < 0.015, `Scroll not synchronized in ${scene.id}`);
      checkpoints.push(state);
    }
  }
  const changes = [];
  for (const scene of scenes) {
    const a = await sharp(`${directory}/${name}-${scene.id}-0.png`).resize(160, 100).removeAlpha().raw().toBuffer();
    const b = await sharp(`${directory}/${name}-${scene.id}-100.png`).resize(160, 100).removeAlpha().raw().toBuffer();
    const difference = a.reduce((sum, value, i) => sum + Math.abs(value - b[i]), 0) / a.length;
    assert(difference > 1, `No observable transformation: ${scene.id}`);
    changes.push({ id: scene.id, meanPixelChange: difference });
  }
  const timing = [];
  if (process.env.RECORD) {
    for (const scene of scenes) {
      const measurement = await page.evaluate(async ({ start, end }) => {
        const intervals = [];
        const move = async (from, to, duration) =>
          new Promise((resolve) => {
            let startTime, previous;
            const frame = (now) => {
              startTime ??= now;
              if (previous !== undefined) intervals.push(now - previous);
              previous = now;
              const p = Math.min(1, (now - startTime) / duration);
              scrollTo(0, from + (to - from) * p);
              if (p < 1) requestAnimationFrame(frame);
              else resolve();
            };
            requestAnimationFrame(frame);
          });
        await move(start, end, 1800);
        await move(end, start, 700);
        const sorted = intervals.slice().sort((a, b) => a - b);
        return {
          meanFrameMs: intervals.reduce((sum, n) => sum + n, 0) / intervals.length,
          p95FrameMs: sorted[Math.floor(sorted.length * 0.95)],
          framesOver50ms: intervals.filter((n) => n > 50).length,
        };
      }, scene);
      timing.push({ id: scene.id, ...measurement });
    }
  }
  // Native chapter controls, not pixel-only checks.
  await page.locator(".product-selector button").nth(2).click();
  await page.waitForTimeout(200);
  assert.equal(await page.locator(".product-selector button[aria-pressed=true]").textContent(), "03The collection");
  await page.getByRole("tab", { name: "Backend", exact: true }).click();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(200);
  assert.equal(await page.getByRole("tab", { name: "Data", exact: true }).getAttribute("aria-selected"), "true");
  await page.locator(".journey-navigation button").last().click();
  await page.waitForTimeout(200);
  assert.equal(await page.locator(".journey-detail>h3").textContent(), "BlueOptima");
  await page.locator(".foundation-selector button").first().click();
  await page.waitForTimeout(200);
  assert((await page.locator(".foundation-record h3").textContent()).includes("Master"));
  const system = scenes.find((s) => s.id === "engineering");
  await page.evaluate((y) => scrollTo(0, y), system.start + (system.end - system.start) * 0.9);
  await page.waitForTimeout(200);
  await page.locator(".spatial-node").filter({ hasText: "D1 / SQLite" }).click();
  assert.equal(await page.locator(".spatial-inspector h3").textContent(), "D1 / SQLite");
  await page.getByRole("button", { name: "Trace an enquiry" }).click();
  assert((await page.locator(".spatial-hint").textContent()).includes("D1"));
  // Reverse all clocks to their starts and verify the same state is restored.
  for (const scene of [...scenes].reverse()) {
    await page.evaluate((y) => scrollTo(0, y), scene.start);
    await page.waitForTimeout(80);
    const progress = await page.locator(`#${scene.id}`).getAttribute("data-progress");
    assert(Number(progress) < 0.01, `Reverse failed: ${scene.id}`);
  }
  assert.deepEqual(errors, []);
  const recording = page.video();
  await context.close();
  if (recording) await recording.saveAs(`${directory}/${name}-journey.webm`);
  report.devices.push({
    name,
    width,
    height,
    checkpoints,
    changes,
    timing,
    errors,
    reverse: "passed",
    controls: "product chapter, keyboard stack, career, education, system nodes and trace passed",
  });
}
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const page = await context.newPage();
await page.goto(url);
await page.locator("[data-scene]").last().waitFor();
assert.equal(await page.locator(".pin-spacer").count(), 0);
assert.equal(await page.locator("video").count(), 0);
assert.equal(await page.locator("h1").evaluate((el) => getComputedStyle(el.parentElement).opacity), "1");
await page.locator(".product-selector button").first().click();
assert.equal(await page.locator(".product-selector button").first().getAttribute("aria-pressed"), "true");
await page.getByRole("tab", { name: "Frontend", exact: true }).click();
assert.equal(await page.getByRole("tab", { name: "Frontend", exact: true }).getAttribute("aria-selected"), "true");
await page.locator(".foundation-selector button").first().click();
await page.locator(".foundation-record summary").click();
assert(await page.getByText("MEMNP authentication research", { exact: true }).isVisible());
report.reducedMotion = "No pinning or videos; readable hero, selectable product/toolset/education and research passed";
await context.close();
await browser.close();
await writeFile(`${directory}/verification.json`, JSON.stringify(report, null, 2));
const ids = report.devices[0].changes.map((s) => s.id);
await writeFile(
  `${directory}/index.html`,
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Portfolio / Motion review</title><style>body{background:#101b14;color:#eee8da;font:14px/1.6 system-ui;margin:5vw}h1,h2{font-family:Georgia;font-weight:400}h1{font-size:60px}h2{font-size:36px;margin-top:60px}section{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}img{width:100%}figure{margin:0}video{max-width:100%;max-height:80vh}a{color:#d6c297}p{color:#b3bfa8}summary{cursor:pointer}@media(max-width:700px){section{grid-template-columns:1fr}h1{font-size:42px}}</style><h1>One practice. Different worlds.</h1><p>Nine distinct, reversible scroll scenes on the main portfolio. <a href="${url}">Open portfolio ↗</a></p>${report.devices.map((d) => `<h2>${d.name}</h2>${process.env.RECORD ? `<video controls preload="metadata" src="${d.name}-journey.webm"></video>` : ""}${ids.map((id) => `<details open><summary>${id}</summary><section>${[0, 50, 100].map((p) => `<figure><a href="${d.name}-${id}-${p}.png"><img loading="lazy" src="${d.name}-${id}-${p}.png" alt="${d.name}, ${id}, ${p}% progress"></a><figcaption>${p}%</figcaption></figure>`).join("")}</section></details>`).join("")}`).join("")}<p><a href="verification.json">Verification data</a>. Source and delivery notes: docs/portfolio-scenes.md.</p></html>`,
);
console.log(
  JSON.stringify({
    devices: report.devices.map((d) => ({
      name: d.name,
      scenes: d.changes.length,
      errors: d.errors,
      reverse: d.reverse,
      controls: d.controls,
    })),
    reducedMotion: report.reducedMotion,
  }),
);
