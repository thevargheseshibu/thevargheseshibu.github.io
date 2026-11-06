/** Offline-render the public site at fixed scroll positions; real-time 4K screencasting drops frames. */
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, writeFile, stat } from "node:fs/promises";
const ffmpeg = process.env.FFMPEG_PATH;
if (!ffmpeg) throw Error("Set FFMPEG_PATH to a full build with libx264");
const origin = process.env.KERASOBHA_CAPTURE_ORIGIN || "https://kerasobha.com";
const fps = 60,
  seconds = 24,
  frames = fps * seconds;
const folder = "artifacts/kerasobha-smooth";
await mkdir(folder, { recursive: true });
const browser = await chromium.launch();
let encoder;
let errorLog = "";
try {
  const page = await browser.newPage({ viewport: { width: 3840, height: 2160 }, deviceScaleFactor: 1 });
  const response = await page.goto(origin, { waitUntil: "domcontentloaded", timeout: 60000 });
  if (!response?.ok()) throw Error("Public website did not load");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1600);
  // Load assets throughout the real site before the first rendered frame.
  let total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= total; y += 1800) {
    await page.evaluate((top) => scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(1600);
  total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await page.addStyleTag({
    content:
      "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}",
  });
  const cdp = await page.context().newCDPSession(page);
  const output = folder + "/website-smooth-4k.mp4";
  encoder = spawn(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-f",
      "image2pipe",
      "-framerate",
      String(fps),
      "-i",
      "pipe:0",
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-maxrate",
      "12M",
      "-bufsize",
      "24M",
      "-pix_fmt",
      "yuv420p",
      "-g",
      "120",
      "-movflags",
      "+faststart",
      output,
    ],
    { windowsHide: true },
  );
  encoder.stderr.on("data", (b) => {
    errorLog += b.toString();
  });
  encoder.stdin.on("error", () => {});
  const done = once(encoder, "close");
  console.log(JSON.stringify({ phase: "rendering", width: 3840, height: 2160, fps, frames, scrollDistance: total }));
  for (let i = 0; i < frames; i++) {
    const progress = i / (frames - 1);
    // Ease into and out of the continuous forward journey.
    const eased = progress * progress * (3 - 2 * progress);
    const top = total * eased;
    await page.evaluate(
      async ({ top, time }) => {
        scrollTo(0, top);
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const visible = [...document.querySelectorAll("video")].filter((v) => {
          const r = v.getBoundingClientRect();
          return (
            v.readyState >= 2 && r.bottom > 0 && r.top < innerHeight && Number.isFinite(v.duration) && v.duration > 0
          );
        });
        await Promise.all(
          visible.map(
            (v) =>
              new Promise((resolve) => {
                v.pause();
                const target = time % Math.max(0.1, v.duration - 0.05);
                if (Math.abs(v.currentTime - target) < 0.02) return resolve();
                let timer;
                const ready = () => {
                  clearTimeout(timer);
                  v.removeEventListener("seeked", ready);
                  resolve();
                };
                v.addEventListener("seeked", ready, { once: true });
                timer = setTimeout(ready, 45);
                v.currentTime = target;
              }),
          ),
        );
      },
      { top, time: i / fps },
    );
    const { data } = await cdp.send("Page.captureScreenshot", {
      format: "jpeg",
      quality: 85,
      optimizeForSpeed: true,
      fromSurface: true,
      captureBeyondViewport: false,
    });
    const jpeg = Buffer.from(data, "base64");
    if (!encoder.stdin.write(jpeg)) await once(encoder.stdin, "drain");
    if (i % 120 === 0) console.log(JSON.stringify({ frame: i, frames, percent: Math.round(progress * 100) }));
  }
  encoder.stdin.end();
  const [code] = await done;
  if (code !== 0) throw Error(errorLog);
  const manifest = {
    origin,
    capturedAt: new Date().toISOString(),
    method:
      "Fixed-position offline browser frames, with visible source videos paused and sampled against the output clock",
    width: 3840,
    height: 2160,
    fps,
    frames,
    seconds,
    scrollHeight: total + 2160,
    bytes: (await stat(output)).size,
    interaction: "Public site recording, no clicks or live iframe",
    output,
  };
  await writeFile(folder + "/manifest.json", JSON.stringify(manifest, null, 2));
  console.log(JSON.stringify(manifest));
} finally {
  encoder?.stdin.end();
  await browser.close();
}
