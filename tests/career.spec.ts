import { expect, test } from "@playwright/test";
import { education, experience } from "../src/data/content";

test.use({ reducedMotion: "reduce" });

test("all education records and research remain inspectable", async ({ page }) => {
  await page.goto("/");
  for (const [index, record] of education.entries()) {
    await page.locator(".foundation-selector button").nth(index).click();
    const detail = page.locator(".foundation-record");
    await expect(detail.locator("h3")).toHaveText(record.degree);
    await expect(detail).toContainText(`${record.start} — ${record.end}`);
    await detail.locator("summary").click();
    await expect(detail.locator("details")).toContainText(record.institution);
    await expect(detail.locator("details")).toContainText(record.location);
    if (index === 0) await expect(detail.locator("details")).toContainText("MEMNP authentication research");
  }
});

test("every career chapter preserves dates, responsibilities and promotions", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#top")).toContainText("Senior Software Engineer / BlueOptima");
  for (const role of experience) {
    await page.locator(".journey-navigation button").filter({ hasText: role.company }).click();
    await expect(page.locator(".journey-detail>h3")).toHaveText(role.company);
    await expect(page.locator(".journey-frame").filter({ hasText: role.company })).toContainText(
      `${role.start} — ${role.end}`,
    );
    await page.locator(".journey-detail summary").click();
    for (const responsibility of role.responsibilities)
      await expect(page.locator(".journey-role-scroll")).toContainText(responsibility);
    for (const position of role.positions || [])
      await expect(page.locator(".journey-role-scroll")).toContainText(`${position.start} — ${position.end}`);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
