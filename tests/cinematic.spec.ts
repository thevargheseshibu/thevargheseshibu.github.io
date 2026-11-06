import { expect, test } from "@playwright/test";

test("the website recording stays deferred until its read-only preview approaches", async ({ page }) => {
  const videos: string[] = [];
  page.on("request", (r) => {
    if (/\.(mp4|webm)(\?|$)/.test(r.url())) videos.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator("[data-scene],[data-mobile-chapter]")).toHaveCount(9);
  await expect(page.locator(".showcase-screen video")).toHaveCount(0);
  expect(videos).toEqual([]);
  await page.locator(".showcase-film").scrollIntoViewIfNeeded();
  await expect(page.locator(".showcase-screen video")).toHaveCount(1);
  await expect(page.locator(".showcase-screen video")).toHaveJSProperty("controls", false);
  await expect(page.locator(".showcase-screen video")).toHaveCSS("pointer-events", "none");
  await expect(page.locator("iframe")).toHaveCount(0);
});

test("the original lab still synchronizes its film with scrolling", async ({ page }) => {
  await page.goto("/cinematic-lab");
  const main = page.locator("main");
  await expect(main).toHaveAttribute("data-end", /\d/);
  const end = await main.evaluate((el) => Number(el.dataset.end));
  await page.evaluate((y) => scrollTo(0, y), end * 0.6);
  await expect
    .poll(() => page.locator("video").evaluate((v) => (v as HTMLVideoElement).currentTime))
    .toBeGreaterThan(5);
  await page.evaluate((y) => scrollTo(0, y), end * 0.4);
  await expect.poll(() => page.locator("video").evaluate((v) => (v as HTMLVideoElement).currentTime)).toBeLessThan(3);
  await expect(page.locator("video")).toHaveJSProperty("paused", true);
});

test("reduced motion uses an interactive static architecture in the lab", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cinematic-lab");
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.locator(".lab-node").filter({ hasText: "Browser" }).click();
  await expect(page.locator(".lab-inspector h3")).toHaveText("Browser");
});
