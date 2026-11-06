import { expect, test } from "@playwright/test";

test.use({ isMobile: true, hasTouch: true });

for (const [width, height] of [
  [360, 800],
  [375, 812],
  [390, 844],
  [393, 873],
  [430, 932],
  [768, 1024],
  [390, 600],
  [844, 390],
]) {
  test(`arrival stays framed and touch accessible at ${width}x${height}`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height });
    await page.goto("/");
    const portrait = page.locator(".ma-portrait");
    await expect(portrait).toBeVisible();
    await portrait.evaluate((image: HTMLImageElement) => image.decode());
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator(".ma-line > span").last()).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    const stage = await page.locator(".ma-stage").boundingBox();
    expect(stage!.height).toBe(height);
    const heading = await page.locator("#hero-title").boundingBox();
    expect(heading!.x).toBeGreaterThanOrEqual(20);
    expect(heading!.x + heading!.width).toBeLessThanOrEqual(width - 20);
    for (const action of await page.locator(".ma-actions a").all()) {
      const box = await action.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.y + box!.height).toBeLessThan(height);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await page.screenshot({ path: testInfo.outputPath(`arrival-${width}.png`) });
    await page.getByRole("button", { name: "Menu", exact: true }).tap();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("link", { name: "Enter the next chapter" }).tap();
    await expect(page.locator("#closeup-title")).toBeInViewport();
    expect(errors).toEqual([]);
  });
}

test("arrival scroll is reversible and reduced motion restores the static composition", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const depth = page.locator(".ma-depth");
  await expect(page.locator(".ma-line > span").last()).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  await page.evaluate(() => scrollTo(0, 450));
  await expect
    .poll(() => depth.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m11))
    .toBeGreaterThan(1.02);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => depth.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m11)).toBe(1);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(depth).toHaveCSS("transform", "none");
  await expect(page.locator(".ma-stage")).toHaveCSS("position", "relative");
  await expect(page.locator(".ma-line > span").last()).toHaveCSS("transform", "none");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".ma-arrival")).toHaveCount(0);
  await expect(page.locator(".cinematic-portfolio")).toHaveCount(1);
});
