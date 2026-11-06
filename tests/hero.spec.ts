import { expect, test } from "@playwright/test";

test("desktop hero keeps the high-resolution image visible without a video overlay", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 1100, "Desktop hero");
  const videoRequests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("hero-cinema")) videoRequests.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator("[data-portrait]")).toBeVisible();
  await page.waitForTimeout(2500);
  const source = await page
    .locator("[data-portrait]")
    .evaluate((image: HTMLImageElement) => ({
      src: image.currentSrc,
      loaded: image.naturalWidth > 0,
      filter: getComputedStyle(image).filter,
    }));
  expect(source.src).toContain("/editorial/atelier-v2-");
  expect(source.loaded).toBe(true);
  expect(source.filter).toBe("none");
  await expect(page.locator("#top video")).toHaveCount(0);
  expect(videoRequests).toEqual([]);
});

test("4K delivery image decodes at the advertised dimensions", async ({ page }) => {
  await page.goto("/");
  const dimensions = await page.evaluate(async () => {
    const image = new Image();
    image.src = "/images/editorial/atelier-v2-3840.webp";
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  expect(dimensions).toEqual({ width: 3840, height: 2160 });
});
