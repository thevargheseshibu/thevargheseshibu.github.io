import { expect, test } from "@playwright/test";
test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test("mobile project unfolds with scroll, reverses, and keeps native scrolling", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".mobile-portfolio")).toHaveAttribute("data-motion", "animated");
  const stage = page.locator(".mp-film-stage"),
    shell = page.locator(".mp-film-shell .showcase-screen");
  const top = await stage.evaluate((e) => e.getBoundingClientRect().top + scrollY);
  const height = page.viewportSize()!.height;
  await page.evaluate((y) => scrollTo(0, y), top - height * 0.96);
  await expect.poll(() => shell.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m11)).toBeLessThan(0.95);
  const before = await shell.evaluate((e) => getComputedStyle(e).transform);
  await page.evaluate((y) => scrollTo(0, y), top - height * 0.2);
  await expect
    .poll(() => shell.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m11))
    .toBeGreaterThan(0.99);
  await page.evaluate((y) => scrollTo(0, y), top - height * 0.96);
  await expect.poll(() => shell.evaluate((e) => getComputedStyle(e).transform)).toBe(before);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
test("architecture assembles on entry and remains touch and keyboard interactive", async ({ page }) => {
  await page.goto("/");
  const root = page.locator(".mp-system");
  await root.waitFor();
  const top = await root.evaluate((e) => e.getBoundingClientRect().top + scrollY);
  await page.evaluate((y) => scrollTo(0, y), top - 900);
  await expect.poll(() => root.getAttribute("data-model-progress").then(Number)).toBeLessThan(0.6);
  const bottom = await page.locator(".mp-system-world").evaluate((e) => e.getBoundingClientRect().bottom + scrollY);
  await page.evaluate((y) => scrollTo(0, y), bottom - 300);
  await expect.poll(() => root.getAttribute("data-model-progress").then(Number)).toBeGreaterThan(0.99);
  await page.locator(".mp-system-picker button").filter({ hasText: "D1 / SQLite" }).click();
  await expect(page.locator(".mp-inspector")).toContainText("Numbered SQL migrations");
  const canvas = page.locator(".mp-system-world canvas");
  const initial = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.locator(".mp-system-world").focus();
  await page.keyboard.press("ArrowRight");
  expect(await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL())).not.toBe(initial);
});
test("motion preference changes restore every section and remove animated transforms", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".mobile-portfolio")).toHaveAttribute("data-motion", "animated");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".mobile-portfolio")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator(".mp-reading-progress")).toBeHidden();
  for (const selector of [".mp-film-shell .showcase-screen", ".mp-heading", ".mp-education-record", ".mp-role"])
    await expect(page.locator(selector).first()).toHaveCSS("transform", "none");
  await expect(page.locator("[data-mobile-chapter]")).toHaveCount(9);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.locator(".mp-education-record summary").click();
  await expect(page.getByRole("heading", { name: "MEMNP authentication research", exact: true })).toBeVisible();
});
