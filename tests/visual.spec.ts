import { test } from "@playwright/test";

/** Section screenshots for visual review → artifacts/screens/<project>/<section>.png */
const SECTIONS = ["top", "closeup", "about", "work", "engineering", "stack", "experience", "education", "contact"];

test("capture section screenshots", async ({ page }, info) => {
  await page.goto("/");
  await page.waitForTimeout(2800); // hero intro
  const dir = `artifacts/screens/${info.project.name}`;
  await page.screenshot({ path: `${dir}/00-hero.png` });

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(25);
  }
  for (const [i, id] of SECTIONS.slice(1).entries()) {
    const top = await page.evaluate((id) => {
      const el = document.getElementById(id);
      return el ? el.getBoundingClientRect().top + window.scrollY : null;
    }, id);
    if (top == null) continue;
    await page.evaluate((t) => window.scrollTo(0, t + 2), top);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${dir}/${String(i + 1).padStart(2, "0")}-${id}.png` });
  }

  await page.goto("/work/kerasobha");
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${dir}/20-case-study.png` });
  await page.screenshot({ path: `${dir}/21-case-study-full.png`, fullPage: true });
});
