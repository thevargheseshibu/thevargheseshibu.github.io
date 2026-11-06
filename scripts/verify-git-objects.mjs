import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
const revision = process.argv[2];
const listing = execFileSync("git", revision ? ["rev-list", "--objects", revision] : ["ls-files", "--stage"], {
  encoding: "utf8",
});
const ids = [
  ...new Set(
    listing
      .trim()
      .split("\n")
      .map((line) => (revision ? line.split(" ")[0] : line.split(" ")[1])),
  ),
];
const result = spawnSync("git", ["cat-file", "--batch"], {
  input: ids.join("\n") + "\n",
  maxBuffer: 128 * 1024 * 1024,
});
if (result.status !== 0) throw new Error(result.stderr.toString());
let offset = 0;
for (const expected of ids) {
  const end = result.stdout.indexOf(10, offset);
  const [id, type, rawSize] = result.stdout.subarray(offset, end).toString().split(" ");
  const size = Number(rawSize);
  if (id !== expected || !Number.isFinite(size)) throw new Error("Missing object: " + expected);
  const data = result.stdout.subarray(end + 1, end + 1 + size);
  const actual = createHash("sha1")
    .update(Buffer.from(type + " " + size + "\0"))
    .update(data)
    .digest("hex");
  if (actual !== expected) throw new Error("Object hash mismatch: " + expected);
  offset = end + 1 + size + 1;
}
console.log(JSON.stringify({ scope: revision ?? "index", verifiedObjects: ids.length }));
