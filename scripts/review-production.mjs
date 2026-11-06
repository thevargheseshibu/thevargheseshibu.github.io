import { chromium } from "@playwright/test";
import { readdir, writeFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

// Audit tools stay in the ignored npm cache rather than the production dependencies.
const cacheRoot = resolve(".cache/npm/_npx");
let packageRoot = process.env.LIGHTHOUSE_ROOT;
if (!packageRoot) {
  for (const entry of await readdir(cacheRoot)) {
    const candidate = resolve(cacheRoot, entry, "node_modules/lighthouse");
    try {
      await import(pathToFileURL(resolve(candidate, "package.json")), { with: { type: "json" } });
      packageRoot = candidate;
      break;
    } catch {}
  }
}
if (!packageRoot)
  throw new Error("Install the audit tool with npx --yes --cache .cache/npm --package lighthouse lighthouse --version");
const { default: lighthouse } = await import(pathToFileURL(resolve(packageRoot, "core/index.js")));
const mode = process.argv[2] ?? "mobile";
const config =
  mode === "desktop"
    ? (await import(pathToFileURL(resolve(packageRoot, "core/config/desktop-config.js")))).default
    : undefined;
const browser = await chromium.launch({ args: ["--remote-debugging-port=9223"] });
await mkdir("artifacts/production-review", { recursive: true });
try {
  const result = await lighthouse(
    "http://127.0.0.1:4173/",
    {
      port: 9223,
      logLevel: "error",
      output: ["json", "html"],
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    },
    config,
  );
  if (!result) throw new Error("Lighthouse returned no report");
  const label = process.argv[3] ?? "final";
  const base = `artifacts/production-review/${mode}-${label}`;
  await writeFile(base + ".report.json", result.report[0]);
  await writeFile(base + ".report.html", result.report[1]);
  if (result.lhr.runtimeError) throw new Error(JSON.stringify(result.lhr.runtimeError));
  console.log(
    JSON.stringify(
      {
        mode,
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
        ),
        metrics: Object.fromEntries(
          [
            "first-contentful-paint",
            "largest-contentful-paint",
            "total-blocking-time",
            "cumulative-layout-shift",
            "speed-index",
          ].map((key) => [key, result.lhr.audits[key].displayValue]),
        ),
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
