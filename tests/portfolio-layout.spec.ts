import { expect, test } from "@playwright/test";

test("the spatial model exposes every component and supports keyboard orbit", async ({ page }) => {
  await page.goto("/");
  if (await page.locator(".mobile-portfolio").count()) {
    for (const button of await page.locator(".mp-system-picker button").all()) {
      const name = (await button.textContent())!.slice(2);
      await button.click();
      await expect(page.locator(".mp-inspector h3")).toHaveText(name);
    }
    const canvas = page.locator(".mp-system-world canvas");
    const before = await canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL());
    await page.locator(".mp-system-world").focus();
    await page.keyboard.press("ArrowRight");
    await expect.poll(() => canvas.evaluate((el) => (el as HTMLCanvasElement).toDataURL())).not.toBe(before);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    return;
  }
  await expect(page.locator("#engineering")).toHaveAttribute("data-end", /\d/);
  await page.evaluate(() => {
    const e = document.getElementById("engineering")!;
    scrollTo(0, Number(e.dataset.start) + (Number(e.dataset.end) - Number(e.dataset.start)) * 0.9);
  });
  for (const button of await page.locator(".spatial-node").all()) {
    const name = (await button.textContent())!.slice(2);
    await button.click();
    await expect(page.locator(".spatial-inspector h3")).toHaveText(name);
    const box = await button.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  }
  const before = await page
    .locator(".spatial-node")
    .first()
    .evaluate((el) => (el as HTMLElement).style.left);
  await page.locator(".spatial-orbit").focus();
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() =>
      page
        .locator(".spatial-node")
        .first()
        .evaluate((el) => (el as HTMLElement).style.left),
    )
    .not.toBe(before);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test("short landscape windows retain readable unpinned chapters", async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/");
  await expect(page.locator("#top")).toHaveAttribute("data-static", "true");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".portrait-copy")).toHaveCSS("opacity", "1");
  await page.locator(".foundation-selector button").first().click();
  await expect(page.locator(".foundation-record h3")).toContainText("Master");
});
