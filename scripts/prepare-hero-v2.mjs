import sharp from "sharp";
for (const width of [1920, 2560, 3840]) {
  const path = `public/images/editorial/atelier-v2-${width}.webp`;
  await sharp("artifacts/hero-refinement/atelier-v2-master.png")
    .resize(width, Math.round((width * 9) / 16), { fit: "cover", kernel: "lanczos3" })
    .webp({ quality: 94, effort: 6 })
    .toFile(path);
  console.log(path, (await sharp(path).metadata()).width);
}
