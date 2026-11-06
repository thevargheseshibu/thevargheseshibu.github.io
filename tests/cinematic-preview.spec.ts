import { expect, test } from "@playwright/test";

test("review route merges the real portfolio and keeps the original face", async ({ page }) => {
  await page.goto("/cinematic");
  await expect(page.locator("[data-experience]")).toBeVisible();
  const mobile = await page.locator(".mobile-portfolio").count();
  await expect(page.locator(mobile ? "[data-mobile-chapter]" : "[data-scene]")).toHaveCount(9);
  await expect(page.locator('[data-experience="merged-portfolio"]')).toHaveCount(1);
  await expect(page.locator(".cinematic-review [data-portrait]")).toHaveAttribute(
    "src",
    "/images/cinematic/original-portrait.jpg",
  );
  expect(
    await page
      .locator(".cinematic-review img")
      .evaluateAll((es) => es.some((i) => /editorial|coffee-natural/.test(i.getAttribute("src") || ""))),
  ).toBe(false);
  await expect(page.locator(mobile ? ".mp-system-picker button" : ".spatial-node")).toHaveCount(8);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
test("existing passage clock scrubs the film in both directions", async ({ page }) => {
  await page.goto("/cinematic");
  await expect(page.locator("[data-experience]")).toBeVisible();
  const mobile = await page.locator(".mobile-portfolio").count();
  const root = page.locator("#closeup");
  const video = page.locator("[data-cinematic-walk]");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThan(1);
  const range = await root.evaluate((e, m) => {
    const r = e.getBoundingClientRect(),
      s = Number((e as HTMLElement).dataset.start);
    return m
      ? { start: r.top + scrollY, length: r.height - innerHeight }
      : { start: s, length: Number((e as HTMLElement).dataset.end) - s };
  }, !!mobile);
  await page.evaluate((r) => scrollTo(0, r.start + r.length * 0.8), range);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(7);
  await page.evaluate((r) => scrollTo(0, r.start), range);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeLessThan(0.2);
  await expect(video).toHaveCSS("object-fit", "contain");
});
test("reduced motion keeps shared content usable and main route remains independent", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/cinematic");
  await expect(page.locator("[data-cinematic-walk]")).toHaveCount(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("#work")).toBeAttached();
  await expect(page.locator("#education")).toBeAttached();
  await page.goto("/");
  await expect(page.locator('[data-experience="merged-portfolio"]')).toHaveCount(0);
  await expect(page.locator("[data-portrait]")).toHaveAttribute("src", /editorial/);
});

test("shared navigation stays inside the cinematic review route", async ({ page }) => {
  await page.goto("/cinematic");
  await expect(page.locator("[data-experience]")).toBeVisible();
  if ((page.viewportSize()?.width || 1440) < 1024)
    await page.getByRole("button", { name: "Menu", exact: true }).click();
  const link = page.locator('a[href="/cinematic#work"]').filter({ visible: true }).first();
  await link.click();
  await expect(page).toHaveURL(/\/cinematic#work$/);
  await expect(page.locator("#work")).toBeInViewport();
});
