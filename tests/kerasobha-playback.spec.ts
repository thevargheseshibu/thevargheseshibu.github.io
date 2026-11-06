import { expect, test } from "@playwright/test";
test("Kerasobha keeps its place when changing quality and resumes after leaving", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const film = page.locator(".showcase-film");
  await film.scrollIntoViewIfNeeded();
  const video = film.locator("video");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.6);
  await expect(film).toHaveAttribute("data-ready", "true");
  await film.getByRole("button", { name: "Pause website film" }).click();
  const time = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
  await film.locator("button[aria-pressed]").click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.videoWidth)).toBe(3840);
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement, savedTime) => Math.abs(v.currentTime - savedTime), time))
    .toBeLessThan(0.15);
  await expect(video).toHaveJSProperty("paused", true);
  await film.getByRole("button", { name: "Play website film" }).click();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(time + 0.2);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await film.scrollIntoViewIfNeeded();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
});
test("Kerasobha presents changing frames and scrolling passes through without a pin", async ({ page }) => {
  await page.goto("/");
  const film = page.locator(".showcase-film");
  await film.scrollIntoViewIfNeeded();
  const video = film.locator("video");
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState)).toBeGreaterThan(2);
  const hashes = await video.evaluate(async (v: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext("2d")!;
    const hashes: string[] = [];
    for (let i = 0; i < 7; i++) {
      await new Promise((r) => setTimeout(r, 200));
      ctx.drawImage(v, 0, 0, 160, 90);
      hashes.push(canvas.toDataURL());
    }
    return new Set(hashes).size;
  });
  expect(hashes).toBeGreaterThan(4);
  const start = await film.evaluate((e) => e.getBoundingClientRect().top);
  const before = await page.evaluate(() => scrollY);
  await page.evaluate(() => scrollBy(0, 500));
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(before + 490);
  const after = await film.evaluate((e) => e.getBoundingClientRect().top);
  expect(start - after).toBeGreaterThan(490);
});
