import { expect, test } from "@playwright/test";

const assets = ["hero-cinema", "architectural-passage", "closing-cinema"];
const finePointer = async (page: import("@playwright/test").Page) =>
  page.evaluate(() => matchMedia("(min-width:768px) and (pointer:fine)").matches);

test("cinematic files decode in both formats with no audio", async ({ page }) => {
  await page.goto("/");
  for (const asset of assets)
    for (const extension of ["mp4", "webm"]) {
      const media = await page.evaluate(
        async ({ asset, extension }) => {
          const video = document.createElement("video");
          video.muted = true;
          video.playsInline = true;
          video.preload = "auto";
          video.src = "/media/cinematic/" + asset + "." + extension;
          const loaded = new Promise<void>((resolve, reject) => {
            video.onloadeddata = () => resolve();
            video.onerror = () => reject(new Error("Decode error " + asset + "." + extension));
          });
          document.body.append(video);
          await loaded;
          const audioTracks = (video as HTMLVideoElement & { captureStream: () => MediaStream })
            .captureStream()
            .getAudioTracks().length;
          const result = { width: video.videoWidth, height: video.videoHeight, duration: video.duration, audioTracks };
          video.pause();
          video.removeAttribute("src");
          video.load();
          video.remove();
          return result;
        },
        { asset, extension },
      );
      expect(media.width).toBeGreaterThanOrEqual(1280);
      expect(media.height).toBeGreaterThanOrEqual(720);
      expect(media.duration).toBeGreaterThanOrEqual(5.8);
      expect(media.duration).toBeLessThan(8.5);
      expect(media.audioTracks).toBe(0);
    }
});

test("desktop film advances, pauses offscreen and defers the closing film", async ({ page }) => {
  const videos: string[] = [];
  page.on("request", (r) => {
    if (/\.(mp4|webm)(\?|$)/.test(r.url())) videos.push(r.url());
  });
  await page.goto("/");
  test.skip(!(await finePointer(page)), "Pointer-capable desktop enhancement");
  await expect(page.locator('video[data-cinematic="hero-cinema"]')).toHaveCount(0);
  await page.locator("#closeup").getByRole("button", { name: "01 Perspective" }).click();
  const hero = page.locator('video[data-cinematic="architectural-passage"]');
  await expect(hero).toHaveAttribute("data-ready", "true");
  await expect.poll(() => hero.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(0.2);
  expect(videos.some((url) => url.includes("closing-cinema"))).toBe(false);
  await expect(hero).toHaveJSProperty("muted", true);
  // Let the chapter control finish its smooth jump before moving back outside the pinned scene.
  await page.waitForTimeout(1300);
  await page.evaluate(() => scrollTo(0, 0));
  await expect.poll(() => hero.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
  await page.locator("#contact").evaluate((el) => scrollTo(0, el.getBoundingClientRect().top + scrollY - 80));
  const closing = page.locator('video[data-cinematic="closing-cinema"]');
  await expect(closing).toHaveAttribute("data-ready", "true");
  await expect.poll(() => closing.evaluate((el: HTMLVideoElement) => el.currentTime)).toBeGreaterThan(0.15);
});

test("mobile and reduced-motion visitors keep posters without video requests", async ({ page }) => {
  const videos: string[] = [];
  page.on("request", (r) => {
    if (/\.(mp4|webm)(\?|$)/.test(r.url())) videos.push(r.url());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.locator("[data-portrait]")).toBeVisible();
  await expect(page.locator(".signature-environment-poster")).toHaveAttribute("src", /architectural-passage.webp/);
  expect(videos).toEqual([]);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  if (!(await finePointer(page))) {
    await expect(page.locator("video")).toHaveCount(0);
    expect(videos).toEqual([]);
  }
});

test("Save-Data keeps still imagery", async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: Object.assign(new EventTarget(), { saveData: true, effectiveType: "4g" }),
    }),
  );
  const videos: string[] = [];
  page.on("request", (r) => {
    if (/\.(mp4|webm)(\?|$)/.test(r.url())) videos.push(r.url());
  });
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  await expect(page.locator("[data-portrait]")).toBeVisible();
  expect(videos).toEqual([]);
});

test("media failure leaves the architectural poster and content available", async ({ page }) => {
  let attempted = false;
  page.on("request", (request) => {
    if (request.url().includes("/architectural-passage.mp4")) attempted = true;
  });
  await page.route("**/media/cinematic/*.{mp4,webm}", (route) => route.abort());
  await page.goto("/");
  test.skip(!(await finePointer(page)), "Pointer-capable desktop enhancement");
  await page.locator("#closeup").getByRole("button", { name: "01 Perspective" }).click();
  await expect.poll(() => attempted).toBe(true);
  await expect(page.locator('video[data-cinematic="architectural-passage"]')).toHaveCount(0, { timeout: 10000 });
  await expect(page.locator("[data-portrait]")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Varghese Shibu");
  expect(await page.locator("[data-portrait]").evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
});
