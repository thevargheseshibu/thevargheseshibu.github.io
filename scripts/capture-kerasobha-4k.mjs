import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, stat, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";

const origin = process.env.KERASOBHA_CAPTURE_ORIGIN || "https://kerasobha.com";
const ffmpeg = process.env.FFMPEG_PATH;
if (!ffmpeg) throw new Error("Set FFMPEG_PATH to a full FFmpeg build with libx264.");
const evidence = "artifacts/kerasobha-4k";
await mkdir(evidence, { recursive: true });
await mkdir("public/media/kerasobha", { recursive: true });
const browser = await chromium.launch();
const manifest = {
  origin,
  capturedAt: new Date().toISOString(),
  capture: { width: 3840, height: 2160, deviceScaleFactor: 1 },
  stills: [],
  recording: null,
};
try {
  const context = await browser.newContext({ viewport: { width: 3840, height: 2160 }, deviceScaleFactor: 1 });
  for (const [name, route] of [
    ["home", "/"],
    ["story", "/story/"],
    ["product", "/products/virgin-coconut-oil/"],
    ["order", "/order/"],
  ]) {
    const existing = `public/images/kerasobha/${name}-4k.webp`;
    if (process.env.SKIP_STILLS === "1") {
      const metadata = await sharp(existing).metadata();
      if (metadata.width !== 3840 || metadata.height !== 2160) throw new Error("Existing capture is not 4K");
      manifest.stills.push({
        name,
        route,
        path: existing,
        width: 3840,
        height: 2160,
        bytes: (await stat(existing)).size,
      });
      continue;
    }
    const page = await context.newPage();
    const response = await page.goto(origin + route, { waitUntil: "domcontentloaded", timeout: 45000 });
    if (!response?.ok()) throw new Error(`Capture failed: ${route} ${response?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2800);
    const png = await page.screenshot();
    const path = `public/images/kerasobha/${name}-4k.webp`;
    await sharp(png).webp({ quality: 94, effort: 5 }).toFile(path);
    await sharp(png).resize(1920, 1080).webp({ quality: 90 }).toFile(`public/images/kerasobha/${name}-1920.webp`);
    manifest.stills.push({ name, route, path, width: 3840, height: 2160, bytes: (await stat(path)).size });
    console.log(`Captured native 3840x2160: ${name}`);
    await page.close();
  }
  await context.close();
  const film = await browser.newContext({
    viewport: { width: 3840, height: 2160 },
    deviceScaleFactor: 1,
    recordVideo: { dir: `${evidence}/raw`, size: { width: 3840, height: 2160 } },
  });
  const started = Date.now();
  const page = await film.newPage();
  await page.goto(origin, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(3000);
  const offset = (Date.now() - started) / 1000;
  console.log(`Recording public site, no clicks; trim pre-roll ${offset.toFixed(2)}s`);
  const playback = await page.evaluate(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const scroll = async (from, to, duration) =>
      new Promise((resolve) => {
        let begin;
        const frame = (now) => {
          begin ??= now;
          const p = Math.min(1, (now - begin) / duration);
          window.scrollTo(0, from + (to - from) * p);
          if (p < 1) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      });
    const total = document.documentElement.scrollHeight - innerHeight;
    await wait(6000);
    await scroll(0, total * 0.28, 7000);
    await wait(2200);
    await scroll(total * 0.28, total * 0.6, 7000);
    await wait(2200);
    await scroll(total * 0.6, total, 7000);
    await wait(2200);
    return {
      scrollHeight: total + innerHeight,
      seconds: 33.6,
      videos: [...document.querySelectorAll("video")].map((v) => ({
        width: v.videoWidth,
        height: v.videoHeight,
        currentTime: v.currentTime,
      })),
    };
  });
  const recording = page.video();
  await film.close();
  console.log("Browser recording closed; encoding 4K master");
  const raw = `${evidence}/website-4k-raw.webm`;
  await recording.saveAs(raw);
  function encode(args) {
    const result = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
      encoding: "utf8",
      windowsHide: true,
    });
    if (result.status !== 0) throw new Error(result.stderr || "FFmpeg failed");
  }
  const master = "public/media/kerasobha/website-4k.mp4";
  encode([
    "-ss",
    String(offset),
    "-i",
    raw,
    "-t",
    "33.6",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "20",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    master,
  ]);
  encode([
    "-i",
    master,
    "-vf",
    "scale=1920:1080",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "23",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "public/media/kerasobha/website-1080.mp4",
  ]);
  encode(["-i", master, "-frames:v", "1", "-q:v", "2", `${evidence}/film-first-frame.jpg`]);
  manifest.recording = {
    path: master,
    width: 3840,
    height: 2160,
    bytes: (await stat(master)).size,
    playback,
    interaction: "Read-only public website capture. No clicks, form submissions or live iframe.",
  };
  await writeFile("public/media/kerasobha/capture-manifest.json", JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify(manifest, null, 2));
} finally {
  await browser.close();
}
