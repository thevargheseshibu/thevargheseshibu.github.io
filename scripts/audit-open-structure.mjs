import { chromium } from "@playwright/test";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const cache = resolve(".cache/open-structure-audit/_npx");
let root;
for (const directory of await readdir(cache)) {
  const candidate = resolve(cache, directory, "node_modules/lighthouse");
  try {
    await import(pathToFileURL(resolve(candidate, "core/index.js")));
    root = candidate;
    break;
  } catch {}
}
if (!root)
  throw new Error("Lighthouse is missing. Install into the ignored cache as documented in docs/open-structure.md.");
const { default: lighthouse } = await import(pathToFileURL(resolve(root, "core/index.js")));
const mode = process.argv[2] || "mobile";
const config =
  mode === "desktop"
    ? (await import(pathToFileURL(resolve(root, "core/config/desktop-config.js")))).default
    : undefined;
const browser = await chromium.launch({ args: ["--remote-debugging-port=9224"] });
await mkdir("artifacts/open-structure/audits", { recursive: true });
try {
  const result = await lighthouse(
    process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4175/",
    {
      port: 9224,
      logLevel: "error",
      output: ["json", "html"],
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    },
    config,
  );
  if (!result || result.lhr.runtimeError) throw new Error(JSON.stringify(result?.lhr.runtimeError));
  await writeFile(`artifacts/open-structure/audits/${mode}.json`, result.report[0]);
  await writeFile(`artifacts/open-structure/audits/${mode}.html`, result.report[1]);
  console.log(
    JSON.stringify(
      {
        mode,
        scores: Object.fromEntries(
          Object.entries(result.lhr.categories).map(([name, item]) => [name, Math.round(item.score * 100)]),
        ),
        metrics: Object.fromEntries(
          ["largest-contentful-paint", "cumulative-layout-shift", "total-blocking-time"].map((name) => [
            name,
            result.lhr.audits[name].displayValue,
          ]),
        ),
        issues: Object.entries(result.lhr.audits)
          .filter(([, audit]) => audit.score !== null && audit.score < 1 && audit.details?.items?.length)
          .map(([id, audit]) => ({
            id,
            title: audit.title,
            score: audit.score,
            items: audit.details.items.slice(0, 4),
          })),
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
