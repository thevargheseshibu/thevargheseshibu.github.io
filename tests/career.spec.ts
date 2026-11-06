import { expect, test } from "@playwright/test";
import { education, experience } from "../src/data/content";

test.use({ reducedMotion: "reduce" });

test("all education records and research remain inspectable", async ({ page }) => {
  await page.goto("/");
  if (await page.locator(".mobile-portfolio").count()) {
    for (const record of education) {
      const entry = page.locator(".mp-education-record").filter({ hasText: record.degree });
      await expect(entry).toContainText(record.institution);
      await expect(entry).toContainText(record.location);
      await expect(entry).toContainText(record.start);
      await expect(entry).toContainText(record.end);
    }
    await page.locator(".mp-education-record summary").click();
    await expect(page.locator(".mp-education-record details")).toContainText("MEMNP authentication research");
    return;
  }
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
  await expect(page.locator("#top")).toContainText("Senior Software Engineer");
  await expect(page.locator("#top")).toContainText("BlueOptima");
  if (await page.locator(".mobile-portfolio").count()) {
    for (const role of experience) {
      const entry = page.locator(".mp-role").filter({ hasText: role.company });
      await expect(entry.locator("h3")).toHaveText(role.company);
      await expect(entry).toContainText(`${role.start} — ${role.end}`);
      await entry.locator("summary").click();
      for (const responsibility of role.responsibilities)
        await expect(entry.locator("details")).toContainText(responsibility);
      for (const position of role.positions || [])
        await expect(entry.locator("details")).toContainText(`${position.start} — ${position.end}`);
    }
    return;
  }
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
