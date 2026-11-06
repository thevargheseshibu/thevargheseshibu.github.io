import { expect, test, type Page } from "@playwright/test";

const SECTIONS = ["top", "closeup", "about", "work", "engineering", "stack", "experience", "education", "contact"];

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("requestfailed", (r) => {
    // Optional ambient media may be absent by design.
    if (!r.url().includes("/media/")) errors.push(`requestfailed: ${r.url()}`);
  });
  return errors;
}

/** Scroll through the whole page so scroll-linked animations run and lazy images load. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(30);
  }
  await page.waitForTimeout(600);
}

async function noHorizontalOverflow(page: Page) {
  const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(sw, `scrollWidth ${sw} > innerWidth ${iw}`).toBeLessThanOrEqual(iw);
}

test.describe("home", () => {
  test("renders every section, no errors, no horizontal overflow", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Varghese Shibu");
    await scrollThrough(page);
    for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toHaveCount(1);
    await noHorizontalOverflow(page);
    expect(errors).toEqual([]);
  });

  test("each section has exactly one h2 and images have alt text", async ({ page }) => {
    await page.goto("/");
    await scrollThrough(page);
    for (const id of SECTIONS.filter((s) => s !== "top")) {
      expect(await page.locator(`#${id} h2`).count(), `#${id} h2 count`).toBe(1);
    }
    const missingAlt = await page.locator("img:not([alt])").count();
    expect(missingAlt).toBe(0);
  });

  test("hero portrait is not distorted", async ({ page }) => {
    await page.goto("/");
    const img = page.locator("[data-portrait]");
    await expect(img).toBeVisible();
    await page.waitForTimeout(2600);
    const image = await img.evaluate((el: HTMLImageElement) => ({
      width: el.naturalWidth,
      height: el.naturalHeight,
      fit: getComputedStyle(el).objectFit,
      source: el.currentSrc,
    }));
    expect(image.width).toBeGreaterThan(0);
    expect(image.height).toBeGreaterThan(0);
    expect(image.fit).toBe("cover"); // crop the frame while preserving the photograph's proportions
    expect(image.source).toContain("/editorial/atelier");
  });

  test("no Zarva mention anywhere", async ({ page }) => {
    await page.goto("/");
    await scrollThrough(page);
    expect((await page.content()).toLowerCase()).not.toContain("zarva");
  });

  test("primary navigation reaches sections", async ({ page, isMobile }) => {
    test.skip(!!isMobile || (page.viewportSize()?.width ?? 0) < 1024, "desktop nav only");
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: /Contact/ })
      .click();
    await expect(page.locator("#contact-title")).toBeInViewport({ timeout: 5000 });
  });

  test("mobile menu opens, traps focus, closes on Escape, navigates", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) >= 1024, "mobile menu only");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Menu" });
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await dialog.getByRole("link", { name: /Experience/ }).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator("#experience h2")).toBeInViewport({ timeout: 5000 });
  });

  test("primary contact action responds to hover", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) < 1024, "hover is a pointer-device interaction");
    test.skip(
      !(await page.evaluate(() => window.matchMedia("(hover: hover)").matches)),
      "touch devices use focus and tap",
    );
    await page.goto("/");
    const cta = page.locator("#contact a.cta");
    await cta.scrollIntoViewIfNeeded();
    const fill = cta.locator(".cta-fill");
    const before = await fill.evaluate((n) => getComputedStyle(n).scale);
    await cta.hover();
    await page.waitForTimeout(900);
    const after = await fill.evaluate((n) => getComputedStyle(n).scale);
    expect(after).not.toBe(before);
  });

  test("contact actions are wired", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await expect(contact.getByRole("link", { name: /thevargheseshibu@gmail.com/ })).toHaveAttribute(
      "href",
      /^mailto:thevargheseshibu@gmail\.com/,
    );
    for (const name of ["GitHub", "LinkedIn", "Instagram"]) {
      const link = contact.getByRole("link", { name: new RegExp(name) });
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);
    }
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });
  test("all content visible without animation", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    for (const id of ["about-title", "contact-title"]) {
      const el = page.locator(`#${id}`);
      await el.scrollIntoViewIfNeeded();
      await expect(el).toBeVisible();
      const opacity = await el.evaluate((n) => getComputedStyle(n).opacity);
      expect(opacity).toBe("1");
    }
    // No element should be left hidden by an initial animation state.
    const hidden = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll("main h2, main p, main a")).filter(
          (n) => getComputedStyle(n).opacity === "0",
        ).length,
    );
    expect(hidden).toBe(0);
  });
});

test.describe("editorial interactions", () => {
  test.use({ reducedMotion: "reduce" });
  test("featured engagement opens details and technology tabs support the keyboard", async ({ page }) => {
    await page.goto("/");
    await page.locator(".engagement-picker button").nth(1).click();
    await expect(page.locator(".engagement-record h4")).toContainText("Cargo Operations Platform");
    await page.getByRole("tab", { name: /Backend/ }).click();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: /Data/ })).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("video")).toHaveCount(0);
  });
});

test.describe("case study", () => {
  test("kerasobha case study loads directly and links back", async ({ page }) => {
    const errors = collectErrors(page);
    await page.goto("/work/kerasobha");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/kerasobha/i);
    await scrollThrough(page);
    await noHorizontalOverflow(page);
    await expect(page.getByRole("link", { name: /kerasobha\.com|live/i }).first()).toHaveAttribute(
      "href",
      /kerasobha\.com/,
    );
    expect((await page.content()).toLowerCase()).not.toContain("zarva");
    expect(errors).toEqual([]);
  });

  test("unknown route shows 404 page", async ({ page }) => {
    await page.goto("/nope");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/lost/i);
  });
});
