import { expect, test } from "@playwright/test";
test.use({ reducedMotion: "reduce" });

test("education has its own chapter with all institutions and exact dates", async ({ page }) => {
  await page.goto("/");
  // The semantic heading and section remain distinct from career credentials.
  await expect(page.locator("#education h2")).toContainText("Curiosity,");
  const education = page.locator("#education");
  await expect(education.locator(".education-record")).toHaveCount(3);
  await expect(education).toContainText("Jun 2014 — May 2019");
  await expect(education).toContainText("Jun 2010 — May 2014");
  await expect(education).toContainText("Jan 2000 — Jun 2010");
  for (const text of [
    "Mahatma Gandhi University, Keralam",
    "North Paravur",
    "St. Xavier's International Public School",
    "Angamaly",
    "Sree Sarada Vidyalaya (Sainik School)",
    "Kalady",
  ])
    await expect(education).toContainText(text);
  await expect(page.locator("#experience .credentials-education")).toHaveCount(0);
  await education.getByText("Research & thesis", { exact: true }).click();
  await expect(education.getByRole("heading", { name: "MEMNP authentication research" })).toBeVisible();
  await expect(education.locator('a[href*="/edit/"]')).toHaveCount(0);
});

test("current employer, duties and historic promotions match the supplied chronology", async ({ page }) => {
  await page.goto("/");
  const current = page.locator(".experience-current");
  await expect(current).toHaveCount(1);
  for (const text of [
    "BlueOptima",
    "Senior Software Engineer",
    "Aug 2025 — Present",
    "Plugin development, web development and backend development",
  ])
    await expect(current).toContainText(text);
  await expect(page.locator("#top")).toContainText("Senior Software Engineer / BlueOptima");
  await expect(page.locator("#experience")).toContainText("Jun 2025 — Jul 2025");
  await expect(page.locator("#experience")).toContainText("Jan 2024 — Jul 2025");
  const positions = page.locator(".experience-positions");
  const positionsText = (await positions.allTextContents()).join(" ");
  for (const text of ["Jul 2023 — Jan 2024", "Nov 2021 — Aug 2023", "Jan 2020 — Oct 2021", "May 2019 — Dec 2019"])
    expect(positionsText).toContain(text);
  for (const image of await page.locator("#education img,.experience-brand img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
