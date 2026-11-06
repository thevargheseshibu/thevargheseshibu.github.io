import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto("http://127.0.0.1:4173");
await page.waitForTimeout(650);
await page.screenshot({ path: "artifacts/hero-refinement/opening-desktop.png" });
await page.waitForTimeout(2100);
await page.screenshot({ path: "artifacts/hero-refinement/settled-desktop.png" });
await page.setViewportSize({ width: 3840, height: 2160 });
await page.reload();
await page.waitForTimeout(2600);
await page.screenshot({ path: "artifacts/hero-refinement/settled-4k.png" });
const result = await page
  .locator("[data-portrait]")
  .evaluate((image) => ({
    source: image.currentSrc,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
    fit: getComputedStyle(image).objectFit,
    position: getComputedStyle(image).objectPosition,
    heroHeight: document.querySelector("#top").getBoundingClientRect().height,
    viewportHeight: innerHeight,
    heroVideo: document.querySelectorAll("#top video").length,
    overflow: document.documentElement.scrollWidth > innerWidth,
  }));
await writeFile("artifacts/hero-refinement/visual-verification.json", JSON.stringify({ errors, ...result }, null, 2));
console.log(JSON.stringify({ errors, ...result }));
await browser.close();
