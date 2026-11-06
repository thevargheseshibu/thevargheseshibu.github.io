import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Review the production preview; no dependency installation or site mutation.
const base = process.env.RESET_REVIEW_URL || "http://127.0.0.1:4175";
const output = "artifacts/creative-reset";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const widths = [1920, 1440, 1024, 360, 375, 390, 430];
const results = [];
const motionChecks = [];
try {
  for (const concept of ["a", "b", "c"]) {
    const thumbnails = [];
    for (const width of widths) {
      const height = width > 700 ? (width === 1920 ? 1080 : 900) : 844;
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "no-preference" });
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("response", (response) => {
        if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
      });
      await page.goto(`${base}/creative-reset/?concept=${concept}`);
      await page.evaluate(() => document.fonts.ready);
      await page.locator(".portrait").evaluate((img) => img.decode());
      assert.equal(await page.locator(".hero").count(), 1);
      assert.equal(await page.locator(".hero.phone").count(), width <= 700 ? 1 : 0);
      assert.equal(await page.locator("h1").count(), 1);
      assert(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `overflow ${concept}/${width}`,
      );
      const cta = page.locator(".hero .work-action");
      const ctaBox = await cta.boundingBox();
      assert(ctaBox.height >= 44, `CTA touch size ${concept}/${width}`);
      assert(ctaBox.y + ctaBox.height <= height + 2, `CTA below opening viewport ${concept}/${width}`);
      const heroFile = `${output}/${concept}-${width}-hero.png`;
      await page.screenshot({ path: heroFile });
      if ([1440, 390].includes(width)) {
        const thumb = await sharp(heroFile)
          .resize(width === 1440 ? 640 : 300, width === 1440 ? 400 : 650)
          .toBuffer();
        thumbnails.push({ input: thumb, left: width === 1440 ? 0 : 650, top: 0 });
      }
      await page.locator(".hero .work-action").click();
      assert.equal(new URL(page.url()).hash, "#project");
      await page.locator(".project-image img").evaluate((img) => img.decode());
      await page.screenshot({ path: `${output}/${concept}-${width}-project.png` });
      await page.locator("#direction").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/${concept}-${width}-direction.png` });
      if (concept === "b") {
        await page.evaluate(() => scrollTo(0, 0));
        await page.getByRole("button", { name: "02 API", exact: true }).click();
        assert.equal(await page.locator(".field").getAttribute("data-layer"), "api");
        await page.getByRole("button", { name: "03 Data", exact: true }).click();
        assert.equal(await page.locator(".field").getAttribute("data-layer"), "data");
        assert.match(await page.locator(".layer-copy").textContent(), /persistent records/);
      }
      assert.deepEqual(errors, [], `browser errors ${concept}/${width}`);
      results.push({ concept, width, height, overflow: false, visibleHeroCTA: true, browserErrors: errors });
      await context.close();
    }
    await sharp({ create: { width: 950, height: 650, channels: 3, background: "#d9d6cf" } })
      .composite(thumbnails)
      .png()
      .toFile(`${output}/${concept}-dual-hero.png`);
    for (const width of [1440, 390]) {
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 900 },
        recordVideo: { dir: `${output}/recordings`, size: { width, height: width === 390 ? 844 : 900 } },
      });
      const page = await context.newPage();
      await page.goto(`${base}/creative-reset/?concept=${concept}`);
      await page.evaluate(() => document.fonts.ready);
      const movingElement = page.locator({ a: ".a-photo", b: ".field", c: ".portal" }[concept]);
      const initialTransform = await movingElement.evaluate((el) => getComputedStyle(el).transform);
      for (let step = 0; step < 36; step++) {
        await page.evaluate((y) => scrollTo(0, y), step * 18);
        await page.waitForTimeout(40);
      }
      assert(Number(await page.locator(".hero").evaluate((el) => el.style.getPropertyValue("--travel"))) > 0);
      const forwardTransform = await movingElement.evaluate((el) => getComputedStyle(el).transform);
      assert.notEqual(forwardTransform, initialTransform, `visible scroll transform ${concept}/${width}`);
      await page.screenshot({ path: `${output}/${concept}-${width}-motion-forward.png` });
      for (let step = 35; step >= 0; step--) {
        await page.evaluate((y) => scrollTo(0, y), step * 18);
        await page.waitForTimeout(25);
      }
      const video = page.video();
      await page.waitForTimeout(80);
      const reverseTransform = await movingElement.evaluate((el) => getComputedStyle(el).transform);
      assert.equal(reverseTransform, initialTransform, `reverse restores opening ${concept}/${width}`);
      motionChecks.push({ concept, width, initialTransform, forwardTransform, reverseTransform });
      await context.close();
      await video.saveAs(`${output}/${concept}-${width}-motion.webm`);
    }
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await page.goto(`${base}/creative-reset/?concept=c`);
  await page.evaluate(() => scrollTo(0, 250));
  await page.waitForTimeout(100);
  assert.equal(
    await page.locator(".hero").evaluate((el) => getComputedStyle(el).getPropertyValue("--travel").trim()),
    "0",
  );
  await page.evaluate(() => scrollTo(0, 0));
  await page.getByRole("button", { name: "A Afterimage", exact: true }).focus();
  await page.keyboard.press("Enter");
  assert.equal(new URL(page.url()).searchParams.get("concept"), "a");
  await page.setViewportSize({ width: 1440, height: 900 });
  assert.equal(await page.locator(".hero.desktop").count(), 1);
  assert.equal(await page.locator(".hero.phone").count(), 0);
  await writeFile(
    `${output}/verification.json`,
    JSON.stringify(
      {
        base,
        results,
        motionChecks,
        reducedMotion: true,
        keyboardConceptSelection: true,
        viewportRemount: true,
        scope: "Concept prototypes only; no field performance or full production motion claim.",
      },
      null,
      2,
    ),
  );
  console.log(
    `Passed ${results.length} concept/viewport reviews, keyboard controls, resize and reduced motion. Screenshots and six scroll recordings: ${output}`,
  );
} finally {
  await browser.close();
}
