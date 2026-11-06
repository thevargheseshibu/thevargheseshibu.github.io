import { expect, test } from "@playwright/test";

test("crawler files and canonical URLs describe the public routes", async ({ page, request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain("Sitemap: https://vargheseshibu.com/sitemap.xml");
  expect(robots.headers()["content-type"]).toContain("text/plain");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain("https://vargheseshibu.com/work/kerasobha");
  for (const route of ["/", "/work/kerasobha"]) {
    await page.goto(route);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://vargheseshibu.com" + route);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  }
  await page.goto("/unavailable-review-page");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
});

test("changing reduced motion restores content and removes cinematic playback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("#hero-title")).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("video[data-cinematic]")).toHaveCount(0);
  await expect(page.locator(".hero-title .mask > span").first()).toHaveCSS("transform", "none");
  await expect(page.locator(".hero-eyebrow")).toHaveCSS("opacity", "1");
  await page.locator("#education").scrollIntoViewIfNeeded();
  await expect(page.locator("#education-title")).toBeVisible();
  await expect(page.locator(".education-record").first()).toBeVisible();
});
