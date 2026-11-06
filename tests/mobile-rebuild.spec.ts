import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

test("mobile has a separate readable composition and all eight large system controls", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator(".mobile-portfolio")).toHaveCount(1);
  await expect(page.locator(".cinematic-portfolio")).toHaveCount(0);
  await expect(page.locator("[data-mobile-chapter]")).toHaveCount(9);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".mp-prose>p").first()).toHaveCSS("font-size", "30px");
  for (const button of await page.locator(".mp-system-picker button").all()) {
    const label = (await button.textContent())!.slice(2);
    await button.click();
    await expect(page.locator(".mp-inspector h3")).toHaveText(label);
    const box = await button.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await page.getByRole("button", { name: "Trace an enquiry", exact: true }).click();
  await expect(page.locator(".mp-trace-path")).toContainText("Browser → Worker → Enquiries → D1");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(errors).toEqual([]);
});

test("responsive switching removes desktop pins and hash navigation reaches native mobile chapters", async ({
  page,
}) => {
  await page.goto("/#education");
  await expect(page.locator("#education-title")).toBeInViewport({ timeout: 6000 });
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".cinematic-portfolio")).toHaveCount(1);
  await expect(page.locator(".pin-spacer")).not.toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".mobile-portfolio")).toHaveCount(1);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.getByRole("tab", { name: "Backend", exact: true }).click();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Data", exact: true })).toHaveAttribute("aria-selected", "true");
});

test("recorded website has HD and genuine 3840x2160 renditions, pauses offscreen and exposes no site actions", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".showcase-film").scrollIntoViewIfNeeded();
  const video = page.locator(".showcase-screen video");
  await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).videoWidth)).toBe(1920);
  await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0.1);
  await page.locator(".showcase-controls button[aria-pressed]").click();
  await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).videoWidth)).toBe(3840);
  await expect(video).toHaveJSProperty("controls", false);
  await expect(video).toHaveCSS("pointer-events", "none");
  await expect(page.locator(".showcase-screen a,.showcase-screen button,iframe")).toHaveCount(0);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => video.evaluate((v) => (v as HTMLVideoElement).paused)).toBe(true);
});

test("reduced motion preserves stills and access to the full career and education", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.locator(".showcase-film").scrollIntoViewIfNeeded();
  await expect(page.locator("video")).toHaveCount(0);
  await page.locator(".mp-still-gallery summary").click();
  for (const image of await page.locator(".mp-still-gallery img").all()) {
    await expect(image).toHaveAttribute("srcset", /3840w/);
  }
  await expect(page.locator(".mp-role")).toHaveCount(5);
  await expect(page.locator(".mp-education-record")).toHaveCount(3);
  await page.locator(".mp-education-record summary").click();
  await expect(page.getByRole("heading", { name: "MEMNP authentication research", exact: true })).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});
