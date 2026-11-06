import { readFile, writeFile, copyFile } from "node:fs/promises";
const root = "artifacts/production-review";
const summary = {
  note: "Local Lighthouse lab measurements against the production preview. Three sequential cold browser samples per layout; representative reports use the median performance score. These are not field Core Web Vitals.",
  layouts: {},
};
for (const mode of ["mobile", "desktop"]) {
  const samples = [];
  for (let sample = 1; sample <= 3; sample++) {
    const base = `${mode}-sample-${sample}`;
    const report = JSON.parse(await readFile(`${root}/${base}.report.json`, "utf8"));
    if (report.runtimeError) throw new Error(JSON.stringify(report.runtimeError));
    samples.push({
      base,
      version: report.lighthouseVersion,
      fetchTime: report.fetchTime,
      scores: Object.fromEntries(
        Object.entries(report.categories).map(([key, value]) => [key, Math.round(value.score * 100)]),
      ),
      metrics: Object.fromEntries(
        [
          "first-contentful-paint",
          "largest-contentful-paint",
          "total-blocking-time",
          "cumulative-layout-shift",
          "speed-index",
        ].map((key) => [key, { value: report.audits[key].numericValue, display: report.audits[key].displayValue }]),
      ),
    });
  }
  const representative = [...samples].sort((a, b) => a.scores.performance - b.scores.performance)[1];
  for (const ext of ["json", "html"])
    await copyFile(`${root}/${representative.base}.report.${ext}`, `${root}/${mode}-final.report.${ext}`);
  summary.layouts[mode] = {
    representative: representative.base,
    scores: representative.scores,
    performanceRange: [
      Math.min(...samples.map((s) => s.scores.performance)),
      Math.max(...samples.map((s) => s.scores.performance)),
    ],
    samples,
  };
}
await writeFile(`${root}/lighthouse-summary.json`, JSON.stringify(summary, null, 2));
console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(summary.layouts).map(([key, value]) => [
        key,
        { scores: value.scores, range: value.performanceRange },
      ]),
    ),
  ),
);
