import { expect, test } from "@playwright/test";

test("each cinematic section transforms and restores its state on reverse scroll", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  if (await page.locator(".mobile-portfolio").count()) {
    await expect(page.locator("[data-mobile-chapter]")).toHaveCount(9);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    const passage = page.locator("#closeup");
    await passage.scrollIntoViewIfNeeded();
    await expect(passage.locator("h2")).toContainText("Step");
    return;
  }
  await expect(page.locator("[data-scene]")).toHaveCount(9);
  for (const section of await page.locator('[data-scene]:not([data-static="true"])').all()) {
    const { start, end } = await section.evaluate((el) => ({
      start: Number((el as HTMLElement).dataset.start),
      end: Number((el as HTMLElement).dataset.end),
    }));
    await page.evaluate((y) => scrollTo(0, y), start + (end - start) * 0.8);
    await expect.poll(() => section.getAttribute("data-progress").then(Number)).toBeGreaterThan(0.78);
    await page.evaluate((y) => scrollTo(0, y), start);
    await expect.poll(() => section.getAttribute("data-progress").then(Number)).toBeLessThan(0.02);
  }
});

test("product and system chapters remain functional with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  if (await page.locator(".mobile-portfolio").count()) {
    await page.locator(".mp-still-gallery summary").click();
    await expect(page.locator(".mp-still-gallery img")).toHaveCount(4);
    await page.locator(".mp-system-picker button").filter({ hasText: "D1 / SQLite" }).click();
    await expect(page.locator(".mp-inspector")).toContainText("Numbered SQL migrations");
    await page.getByRole("button", { name: "Trace an enquiry" }).click();
    await expect(page.locator(".mp-trace-path")).toContainText("Browser → Worker → Enquiries → D1");
    return;
  }
  await page.locator(".product-selector button").nth(2).click();
  await expect(page.locator(".product-caption")).toContainText("The collection");
  await expect(page.getByRole("link", { name: "Inside the case study" })).toHaveAttribute("href", "/work/kerasobha");
  await page.locator(".spatial-node").filter({ hasText: "D1 / SQLite" }).click();
  await expect(page.locator(".spatial-inspector")).toContainText("Numbered SQL migrations");
  await page.getByRole("button", { name: "Trace an enquiry" }).click();
  await expect(page.locator(".spatial-hint")).toContainText("Browser → Worker → Enquiries → D1");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
