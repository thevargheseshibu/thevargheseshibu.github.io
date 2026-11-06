import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { withWebmDuration } from "./webm-metadata.mjs";

const assets = [
  {
    name: "hero-cinema",
    source: "artifacts/portrait-review/assets/01-private-atelier.png",
    width: 1536,
    height: 864,
    seconds: 7,
    bitrate: 1800000,
    zoom: 0.013,
    pan: 3,
    type: "portrait",
  },
  {
    name: "architectural-passage",
    source: "artifacts/cinematic-assets/sources/architectural-passage.png",
    width: 1280,
    height: 720,
    seconds: 6,
    bitrate: 1200000,
    zoom: 0.024,
    pan: 10,
    type: "architecture",
  },
  {
    name: "closing-cinema",
    source: "artifacts/cinematic-assets/sources/closing-portrait.png",
    width: 1280,
    height: 720,
    seconds: 7,
    bitrate: 1400000,
    zoom: 0.016,
    pan: 4,
    type: "portrait",
  },
];
await mkdir("public/media/cinematic", { recursive: true });
await mkdir("artifacts/cinematic-assets/frames", { recursive: true });
const browser = await chromium.launch();
const manifest = [];
for (const asset of assets) {
  const base = "public/media/cinematic/" + asset.name;
  await sharp(asset.source)
    .resize({ width: asset.width })
    .webp({ quality: 88 })
    .toFile(base + ".webp");
  const dataUrl = "data:image/png;base64," + (await readFile(asset.source)).toString("base64");
  const page = await browser.newPage({ viewport: { width: asset.width, height: asset.height } });
  const result = await page.evaluate(
    async ({ asset, dataUrl }) => {
      const img = new Image();
      img.src = dataUrl;
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = asset.width;
      canvas.height = asset.height;
      document.body.style.margin = "0";
      document.body.append(canvas);
      const ctx = canvas.getContext("2d", { alpha: false });
      const stream = canvas.captureStream(24);
      const formats = [
        { extension: "webm", mime: "video/webm;codecs=vp9" },
        { extension: "mp4", mime: "video/mp4;codecs=avc1.42001E" },
      ];
      const captures = formats.map((format) => {
        if (!MediaRecorder.isTypeSupported(format.mime)) throw new Error("Unsupported format: " + format.mime);
        const chunks = [];
        const recorder = new MediaRecorder(stream, { mimeType: format.mime, videoBitsPerSecond: asset.bitrate });
        const done = new Promise((resolve, reject) => {
          recorder.ondataavailable = (e) => {
            if (e.data.size) chunks.push(e.data);
          };
          recorder.onerror = (e) => reject(new Error(e.error?.message || "Encoder failed"));
          recorder.onstop = async () => {
            const bytes = new Uint8Array(await new Blob(chunks, { type: format.mime }).arrayBuffer());
            let binary = "";
            for (let offset = 0; offset < bytes.length; offset += 32768)
              binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
            resolve({ ...format, mime: recorder.mimeType, data: btoa(binary) });
          };
        });
        return { recorder, done };
      });
      const duration = asset.seconds * 1000;
      const draw = (progress) => {
        const phase = progress * Math.PI * 2;
        const breathing = (1 - Math.cos(phase)) / 2;
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height) * (1.015 + asset.zoom * breathing);
        const w = img.width * scale,
          h = img.height * scale;
        const x = (canvas.width - w) / 2 + Math.sin(phase) * asset.pan;
        const y = (canvas.height - h) / 2 + Math.sin(phase) * asset.pan * 0.25;
        ctx.fillStyle = "#111511";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, w, h);
        if (asset.type === "architecture") {
          const light = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          light.addColorStop(0, "rgba(18,28,19," + (0.035 + 0.015 * breathing) + ")");
          light.addColorStop(0.7, "rgba(235,220,185," + (0.012 + 0.012 * breathing) + ")");
          light.addColorStop(1, "rgba(0,0,0,.025)");
          ctx.fillStyle = light;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      };
      draw(0);
      for (const capture of captures) capture.recorder.start(1000);
      const start = performance.now();
      await new Promise((resolve) => {
        const frame = (now) => {
          const elapsed = now - start;
          if (elapsed >= duration) {
            draw(0);
            for (const capture of captures) capture.recorder.stop();
            resolve();
            return;
          }
          draw(elapsed / duration);
          requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      });
      const samples = [0, 0.25, 0.5, 0.75].map((progress) => {
        draw(progress);
        return { progress, data: canvas.toDataURL("image/jpeg", 0.85).split(",")[1] };
      });
      for (const track of stream.getTracks()) track.stop();
      return { videos: await Promise.all(captures.map((c) => c.done)), samples };
    },
    { asset, dataUrl },
  );
  const videos = [];
  for (const video of result.videos) {
    const bytes = Buffer.from(video.data, "base64");
    await writeFile(
      base + "." + video.extension,
      video.extension === "webm" ? withWebmDuration(bytes, asset.seconds * 1000) : bytes,
    );
    videos.push({ format: video.extension, codec: video.mime, bytes: (await stat(base + "." + video.extension)).size });
  }
  for (const sample of result.samples)
    await writeFile(
      "artifacts/cinematic-assets/frames/" + asset.name + "-" + sample.progress + ".jpg",
      Buffer.from(sample.data, "base64"),
    );
  manifest.push({
    ...asset,
    sourceKind: "AI image keyframe with locally rendered camera motion",
    poster: "/media/cinematic/" + asset.name + ".webp",
    videos,
  });
  console.log(asset.name, JSON.stringify(videos));
  await page.close();
}
await browser.close();
await writeFile(
  "artifacts/cinematic-assets/manifest.json",
  JSON.stringify({ audio: false, fps: 24, assets: manifest }, null, 2),
);
