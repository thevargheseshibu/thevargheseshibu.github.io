import { chromium } from "@playwright/test";
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
const origin = process.env.KERASOBHA_CAPTURE_ORIGIN || "https://kerasobha.com";
console.log("Capture origin:", origin);
const dir = new URL("../public/images/kerasobha/", import.meta.url);
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [name, route, mobile] of [
    ["home", "/", false],
    ["product", "/products/virgin-coconut-oil/", false],
    ["story", "/story/", false],
    ["order", "/order/", false],
    ["home-mobile", "/", true],
    ["product-mobile", "/products/virgin-coconut-oil/", true],
  ]) {
    const page = await browser.newPage({
      viewport: mobile ? { width: 390, height: 844 } : { width: 1600, height: 1000 },
    });
    console.log("Capturing", name);
    if (origin.includes("127.0.0.1"))
      await page.route("**/*", (route) =>
        route.request().url().startsWith(origin) || route.request().url().startsWith("data:")
          ? route.continue()
          : route.abort(),
      );
    await page.goto(origin + route, { waitUntil: "domcontentloaded" });
    console.log("DOM ready");
    await page.waitForLoadState("networkidle", { timeout: 12000 }).catch(() => {});
    console.log("Network settled");
    await page.evaluate(async () => {
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 5000))]);
      window.scrollTo(0, Math.min(600, innerHeight));
    });
    await page.waitForTimeout(1200);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2200);
    console.log("Taking screenshot");
    const png = await page.screenshot({ timeout: 15000 });
    console.log("Encoding", png.length);
    await sharp(png)
      .webp({ quality: 84 })
      .toFile(fileURLToPath(new URL(name + ".webp", dir)));
    if (!mobile)
      await sharp(png)
        .resize({ width: 800 })
        .webp({ quality: 82 })
        .toFile(fileURLToPath(new URL(name + "-800.webp", dir)));
    await page.close();
  }
} finally {
  await browser.close();
}
