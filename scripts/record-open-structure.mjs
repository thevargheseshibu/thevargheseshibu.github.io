import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const output = "artifacts/open-structure";
const base = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4175";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const reports = [];
try {
  for (const width of [1440, 390]) {
    const height = width === 390 ? 844 : 900;
    const context = await browser.newContext({
      viewport: { width, height },
      recordVideo: { dir: `${output}/recordings`, size: { width, height } },
    });
    const page = await context.newPage();
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const report = await page.evaluate(async () => {
      const end = document.querySelector(".os-arrival").getBoundingClientRect().height - innerHeight;
      const frames = [];
      let last = performance.now();
      const sweep = async (reverse = false) => {
        const start = performance.now();
        await new Promise((resolve) => {
          const tick = (time) => {
            const progress = Math.min(1, (time - start) / 2000);
            frames.push(time - last);
            last = time;
            scrollTo(0, end * (reverse ? 1 - progress : progress));
            if (progress < 1) requestAnimationFrame(tick);
            else resolve();
          };
          requestAnimationFrame(tick);
        });
      };
      await sweep();
      await new Promise((r) => setTimeout(r, 700));
      const endPortal = document.querySelector(".os-hero-portal").getBoundingClientRect().toJSON();
      await sweep(true);
      await new Promise((r) => setTimeout(r, 700));
      const initialPortal = document.querySelector(".os-hero-portal").getBoundingClientRect().toJSON();
      // Deliberate settled holds are excluded from frame-interval samples.
      const intervals = frames.filter((v) => v > 0 && v < 250).sort((a, b) => a - b);
      return {
        width: innerWidth,
        endPortal,
        initialPortal,
        samples: intervals.length,
        medianFrameIntervalMs: intervals[Math.floor(intervals.length * 0.5)],
        p95FrameIntervalMs: intervals[Math.floor(intervals.length * 0.95)],
        framesOver50ms: intervals.filter((v) => v > 50).length,
        environment: "Headless Chromium on development PC, with video capture; not an on-device or field benchmark",
      };
    });
    for (const id of ["work", "engineering", "about", "experience", "education", "contact"]) {
      await page.evaluate(
        (id) =>
          scrollTo({ top: document.getElementById(id).getBoundingClientRect().top + scrollY - 80, behavior: "smooth" }),
        id,
      );
      await page.waitForTimeout(900);
      if (id === "work") {
        await page.getByRole("button", { name: "02 The interface" }).click();
        await page.waitForTimeout(700);
        await page.getByRole("button", { name: "03 The order journey" }).click();
        await page.waitForTimeout(700);
      }
      if (id === "engineering") {
        await page.getByRole("button", { name: "Trace an enquiry" }).click();
        await page.waitForTimeout(4200);
        await page.screenshot({ path: `${output}/${width}-request-traced.png` });
      }
    }
    const video = page.video();
    await context.close();
    await video.saveAs(`${output}/${width}-walkthrough.webm`);
    reports.push(report);
  }
  await writeFile(`${output}/motion-review.json`, JSON.stringify(reports, null, 2));
  console.log(JSON.stringify(reports, null, 2));
} finally {
  await browser.close();
}
