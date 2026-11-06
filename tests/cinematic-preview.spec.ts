import { expect, test } from "@playwright/test";
test("cinematic preview keeps exact original face, reversible film, and usable engineering", async ({ page }) => {
  await page.goto("/cinematic");
  await expect(page.locator(".film-chapter")).toHaveCount(6);
  await expect(page.locator(".film-original img")).toHaveAttribute("src", "/images/cinematic/original-portrait.jpg");
  await expect(page.locator('img[src*="portrait.webp"]')).toHaveCount(0);
  await expect
    .poll(() => page.locator(".film-walk").evaluate((v: HTMLVideoElement) => v.readyState))
    .toBeGreaterThan(1);
  const height = await page.locator(".film-arrival").evaluate((e) => e.getBoundingClientRect().height - innerHeight);
  await page.evaluate((y) => scrollTo(0, y), height * 0.7);
  await expect
    .poll(() => page.locator(".film-walk").evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeGreaterThan(5);
  await page.evaluate(() => scrollTo(0, 0));
  await expect
    .poll(() => page.locator(".film-walk").evaluate((v: HTMLVideoElement) => v.currentTime))
    .toBeLessThan(0.2);
  await page.locator(".film-system button").filter({ hasText: "D1 / SQLite" }).click();
  await expect(page.locator(".film-system article")).toContainText("Numbered SQL migrations");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
test("reduced motion keeps every act readable without video", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cinematic");
  await expect(page.locator(".film-walk")).toHaveCount(0);
  await expect(page.locator(".film-steps li")).toHaveCount(5);
  await expect(page.locator(".film-contact")).toHaveAttribute("href", /^mailto:/);
});
test("Kerasobha film advances, resumes after returning, and does not pin the page", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const work = page.locator("#work");
  await work.scrollIntoViewIfNeeded();
  await expect(work.locator("video")).toHaveCount(1);
  await expect.poll(() => work.locator("video").evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.3);
  expect(await work.evaluate((e) => e.parentElement?.classList.contains("pin-spacer"))).toBe(false);
  await page.evaluate(() => scrollTo(0, 0));
  await work.scrollIntoViewIfNeeded();
  await expect.poll(() => work.locator("video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  await work.getByRole("button", { name: "Pause website film" }).click();
  await expect.poll(() => work.locator("video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await work.getByRole("button", { name: "Play website film" }).click();
  await expect.poll(() => work.locator("video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
});
