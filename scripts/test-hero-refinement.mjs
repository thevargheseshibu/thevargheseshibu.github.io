import { spawnSync } from "node:child_process";
import { openSync, closeSync, readFileSync } from "node:fs";
const output = "artifacts/hero-refinement/regression.log";
const fd = openSync(output, "w");
const env = { ...process.env };
delete env.NO_COLOR;
delete env.FORCE_COLOR;
const batches = [
  ["tests/hero.spec.ts", "tests/cinematic.spec.ts"],
  ["tests/site.spec.ts", "--grep", "renders every|hero portrait|primary navigation|mobile menu|all content visible"],
];
let resultCode = 0;
try {
  for (const batch of batches) {
    const result = spawnSync(
      process.execPath,
      ["node_modules/@playwright/test/cli.js", "test", ...batch, "--workers=3", "--reporter=line"],
      { stdio: ["ignore", fd, fd], env },
    );
    if (result.status !== 0) {
      resultCode = result.status ?? 1;
      break;
    }
  }
} finally {
  closeSync(fd);
}
console.log(readFileSync(output, "utf8").split("\n").slice(-12).join("\n"));
process.exitCode = resultCode;
