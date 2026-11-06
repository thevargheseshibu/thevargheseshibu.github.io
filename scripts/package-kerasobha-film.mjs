import { spawnSync } from "node:child_process";
import { readFile, writeFile, stat } from "node:fs/promises";
const ffmpeg = process.env.FFMPEG_PATH;
if (!ffmpeg) throw Error("Set FFMPEG_PATH");
const source = JSON.parse(await readFile("artifacts/kerasobha-smooth/manifest.json", "utf8"));
function run(args) {
  const r = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    windowsHide: true,
    encoding: "utf8",
    maxBuffer: 2000000,
  });
  if (r.status !== 0) throw Error(r.stderr);
}
const master = "public/media/kerasobha/website-smooth-4k.mp4",
  hd = "public/media/kerasobha/website-smooth-1080.mp4";
const probe = spawnSync(
  ffmpeg,
  [
    "-hide_banner",
    "-i",
    source.output,
    "-vf",
    "scale=1920:1080,freezedetect=n=-45dB:d=0.4",
    "-an",
    "-f",
    "null",
    "NUL",
  ],
  { windowsHide: true, encoding: "utf8", maxBuffer: 2000000 },
);
if (probe.status !== 0) throw Error(probe.stderr);
let idleStart = null;
const idle = [];
for (const line of probe.stderr.split("\n")) {
  const start = line.match(/freeze_start: ([\d.]+)/),
    end = line.match(/freeze_end: ([\d.]+)/);
  if (start) idleStart = Number(start[1]);
  if (end && idleStart !== null) {
    idle.push({ start: idleStart, end: Number(end[1]) });
    idleStart = null;
  }
}
if (idleStart !== null) idle.push({ start: idleStart, end: source.seconds });
const removed = idle
  .map(({ start, end }) => ({ start: Math.ceil((start + 0.08) * 60), end: Math.floor((end - 0.08) * 60) }))
  .filter((r) => r.end >= r.start);
const removedFrames = removed.reduce((n, r) => n + r.end - r.start + 1, 0);
const frameCount = source.frames - removedFrames;
const duration = frameCount / 60,
  blend = 0.4;
const keep = removed.length
  ? "not(" + removed.map((r) => "between(n," + r.start + "," + r.end + ")").join("+") + ")"
  : "1";
const cut = `select='${keep}',setpts=N/(60*TB),`;
console.log(
  JSON.stringify({ idleSections: removed.length, removedSeconds: removedFrames / 60, outputSeconds: duration }),
);
// Blend the last frames back to the actual first frame for a continuous loop boundary.
run([
  "-i",
  source.output,
  "-filter_complex",
  `[0:v]${cut}split[base][seed];[seed]trim=end_frame=1,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=1,trim=duration=${blend}[still];[base][still]xfade=transition=fade:duration=${blend}:offset=${duration - blend},format=yuv420p[out]`,
  "-map",
  "[out]",
  "-t",
  String(duration),
  "-r",
  "60",
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
  "-g",
  "120",
  "-movflags",
  "+faststart",
  master,
]);
console.log("Encoded smooth 4K loop");
run([
  "-i",
  master,
  "-vf",
  "scale=1920:1080:flags=lanczos",
  "-an",
  "-c:v",
  "libx264",
  "-preset",
  "fast",
  "-crf",
  "23",
  "-maxrate",
  "5M",
  "-bufsize",
  "10M",
  "-pix_fmt",
  "yuv420p",
  "-profile:v",
  "high",
  "-level:v",
  "4.2",
  "-g",
  "120",
  "-movflags",
  "+faststart",
  hd,
]);
console.log("Encoded smooth HD rendition");
const result = spawnSync(
  ffmpeg,
  ["-hide_banner", "-i", hd, "-vf", "freezedetect=n=-45dB:d=0.4", "-an", "-f", "null", "NUL"],
  { windowsHide: true, encoding: "utf8", maxBuffer: 2000000 },
);
if (result.status !== 0) throw Error(result.stderr);
const holds = [...result.stderr.matchAll(/freeze_duration: ([\d.]+)/g)].map((m) => Number(m[1]));
const report = {
  holds: holds.length,
  totalSeconds: holds.reduce((a, b) => a + b, 0),
  longestSeconds: Math.max(0, ...holds),
  thresholdSeconds: 0.4,
};
await writeFile("artifacts/kerasobha-smooth/new-film-freezes.json", JSON.stringify(report, null, 2));
const manifest = JSON.parse(await readFile("public/media/kerasobha/capture-manifest.json", "utf8"));
manifest.recording = {
  path: master,
  width: 3840,
  height: 2160,
  bytes: (await stat(master)).size,
  capturedAt: source.capturedAt,
  method: source.method,
  playback: {
    scrollHeight: source.scrollHeight,
    seconds: duration,
    fps: 60,
    frames: frameCount,
    removedIdleSeconds: removedFrames / 60,
    loop: "0.4-second crossfade back to the first recorded frame",
  },
  renditions: [{ path: hd, width: 1920, height: 1080, fps: 60, bytes: (await stat(hd)).size }],
  freezeAnalysis: report,
  interaction: "Read-only public website capture. No clicks, form submissions or live iframe.",
};
await writeFile("public/media/kerasobha/capture-manifest.json", JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest.recording));
