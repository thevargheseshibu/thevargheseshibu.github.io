import { expect, test } from "@playwright/test";

test("transformation chapters expose an inspectable system and link to the real case study", async ({ page }) => {
  await page.goto("/");
  const scene = page.locator("#closeup");
  const controls = scene.getByRole("button", { name: /03 System/ });
  await controls.click();
  await expect(scene).toHaveAttribute("data-active", "2");
  await scene.getByRole("button", { name: "D1 / SQLite", exact: true }).click();
  await expect(scene.locator(".signature-inspector")).toContainText("Numbered SQL migrations");
  await scene.getByRole("button", { name: /04 Experience/ }).click();
  await expect(scene).toHaveAttribute("data-active", "3");
  await expect(scene.getByRole("link", { name: "Inside the case study" })).toHaveAttribute("href", "/work/kerasobha");
  await scene.getByRole("button", { name: /01 Perspective/ }).click();
  await expect(scene).toHaveAttribute("data-active", "0");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test("transformation works without motion and does not pin on touch layouts", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const scene = page.locator("#closeup");
  await scene.getByRole("button", { name: /03 System/ }).click();
  await expect(scene.locator(".signature-system")).toBeVisible();
  await expect(scene.locator(".signature-stage")).not.toHaveCSS("position", "fixed");
  await expect(scene.getByRole("button", { name: /03 System/ })).toHaveAttribute("aria-current", "step");
  await expect(page.locator("video")).toHaveCount(0);
});
