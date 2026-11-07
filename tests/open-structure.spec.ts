import { expect, test } from "@playwright/test";
import { education, engineeringProjects, experience, profile } from "../src/data/content";

test("complete portfolio and visual review at the requested viewport", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator(".os-hero-copy h1")).toHaveText("Built withperspective.");
  await expect(page.locator(".os-arrival")).toHaveCount(1);
  const phone = (page.viewportSize()?.width ?? 0) <= 760;
  await expect(page.locator(".os-arrival-phone")).toHaveCount(phone ? 1 : 0);
  await expect(page.locator(".os-arrival-desktop")).toHaveCount(phone ? 0 : 1);
  await expect(page.locator(".os-hero-copy .os-text-link")).toBeInViewport();
  await expect(page.locator(".os-portrait-photo")).toHaveJSProperty("naturalWidth", phone ? 720 : 1400);
  const directory = `artifacts/open-structure/${info.project.name}`;
  await page.screenshot({ path: `${directory}/00-hero.png` });
  for (const [index, id] of ["work", "engineering", "about", "stack", "experience", "education", "contact"].entries()) {
    await page.evaluate((id) => {
      const section = document.getElementById(id)!;
      scrollTo(0, section.getBoundingClientRect().top + scrollY - 80);
    }, id);
    await page.waitForTimeout(150);
    await expect(page.locator(`#${id}`)).toHaveCount(1);
    await page.screenshot({ path: `${directory}/${index + 1}-${id}.png` });
  }
  await expect(page.locator("img:not([alt])")).toHaveCount(0);
  const overflow = await page.evaluate(() => ({
    viewport: innerWidth,
    page: document.documentElement.scrollWidth,
    clippedHeadings: [...document.querySelectorAll<HTMLElement>(".os h1,.os h2,.os h3")]
      .filter((el) => el.scrollWidth > el.clientWidth + 2)
      .map((el) => el.textContent),
  }));
  expect(overflow.page).toBeLessThanOrEqual(overflow.viewport);
  expect(overflow.clippedHeadings).toEqual([]);
  await expect(page.locator("video")).toHaveCount(0);
  expect(errors).toEqual([]);
});

test("aperture motion reverses, preference changes restore the opening and viewport remounts safely", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const portal = page.locator(".os-hero-portal");
  const width = await portal.evaluate((el) => el.getBoundingClientRect().width);
  const end = await page.locator(".os-arrival").evaluate((el) => el.getBoundingClientRect().height - innerHeight);
  await page.evaluate((y) => scrollTo(0, y), end);
  await expect
    .poll(() => portal.evaluate((el) => el.getBoundingClientRect().width), { timeout: 5000 })
    .toBeGreaterThan(width + 20);
  await expect(page.locator(".os-portal-product")).toHaveCSS("opacity", "1");
  await page.evaluate(() => scrollTo(0, 0));
  await expect
    .poll(() => portal.evaluate((el) => Math.round(el.getBoundingClientRect().width)), { timeout: 5000 })
    .toBe(Math.round(width));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".os-hero-copy")).toHaveCSS("opacity", "1");
  await expect(page.locator(".os-portal-product")).toBeHidden();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".os-arrival-phone")).toHaveCount(1);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator(".os-arrival-desktop")).toHaveCount(1);
  await expect(page.locator(".os-arrival-phone")).toHaveCount(0);
});

test("navigation is keyboard accessible and mobile dialog restores focus", async ({ page }) => {
  await page.goto("/");
  if ((page.viewportSize()?.width ?? 0) <= 760) {
    const toggle = page.getByRole("button", { name: "Open navigation" });
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Navigation", exact: true });
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Shift+Tab");
    expect(await page.evaluate(() => document.querySelector("dialog")?.contains(document.activeElement))).toBeTruthy();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
    await dialog.getByRole("link", { name: /Experience/ }).click();
    await expect(dialog).toBeHidden();
    await expect(page.locator("#experience h2")).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.style.overflow)).not.toBe("hidden");
  } else {
    await page
      .getByRole("navigation", { name: "Main navigation" })
      .getByRole("link", { name: "Education", exact: true })
      .click();
    await expect(page.locator("#education h2")).toBeInViewport();
  }
});

test("project evidence, request lens, engagement index and stack controls expose real content", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "02 The interface" }).click();
  await expect(page.locator(".os-evidence-story h3")).toHaveText("Detail with a purpose.");
  await page.getByRole("button", { name: "03 The order journey" }).click();
  await expect(page.locator(".os-evidence-story")).toContainText("manual confirmation");
  for (const name of ["Edge API", "Data", "Delivery"]) {
    await page
      .locator(".os-system-planes")
      .getByRole("button", { name: new RegExp(name) })
      .click();
    await expect(page.locator(".os-system-planes").getByRole("button", { name: new RegExp(name) })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  }
  await expect(page.locator(".os-system-explanation")).toContainText("unsent emails");
  await page.getByRole("button", { name: "Trace an enquiry" }).click();
  await expect(page.locator(".os-request-lens")).toHaveAttribute("data-step", "3", { timeout: 8000 });
  for (const [i, project] of engineeringProjects.entries()) {
    await page.getByLabel("Explore an engagement").selectOption(String(i));
    await expect(page.locator(".os-engagement-card h3")).toHaveText(project.title);
    await expect(page.locator(".os-engagement-card")).toContainText(project.summary);
  }
  await page.getByRole("button", { name: "Backend", exact: true }).click();
  await expect(page.locator(".os-stack-panel")).toContainText("Node.js");
  await page.getByRole("button", { name: "Data", exact: true }).click();
  await expect(page.locator(".os-stack-panel")).toContainText("PostgreSQL");
});

test("professional information, promotions, education, contact and resume remain available", async ({
  page,
  request,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const job of experience) {
    const entry = page.locator(".os-career-list details").filter({ hasText: job.company });
    if (!((await entry.getAttribute("open")) !== null)) await entry.locator("summary").click();
    await expect(entry).toContainText(`${job.start} — ${job.end}`);
    for (const responsibility of job.responsibilities) await expect(entry).toContainText(responsibility);
    for (const position of job.positions ?? [])
      await expect(entry).toContainText(`${position.start} — ${position.end}`);
  }
  for (const item of education) {
    const entry = page.locator(".os-foundations details").filter({ hasText: item.degree });
    await entry.locator("summary").click();
    await expect(entry).toContainText(item.institution);
    await expect(entry).toContainText(item.location);
  }
  await expect(page.locator(".os-contact .os-email")).toHaveAttribute("href", `mailto:${profile.email}`);
  await expect(page.locator(".os-contact a").filter({ hasText: profile.phone })).toHaveAttribute(
    "href",
    profile.phoneHref,
  );
  expect((await request.get(profile.resumeUrl!)).ok()).toBeTruthy();
  for (const name of ["GitHub", "LinkedIn", "Instagram"])
    await expect(page.locator(".os-contact").getByRole("link", { name: new RegExp(name) })).toHaveAttribute(
      "rel",
      /noreferrer/,
    );
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", "https://vargheseshibu.com/");
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", "index, follow");
});

test("walkthrough loads on demand, pauses offscreen and returns to still images", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("video")).toHaveCount(0);
  await page.getByRole("button", { name: "Play walkthrough" }).click();
  const media = page.locator("video");
  await expect(media).toBeVisible();
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const video = document.querySelector("video");
          return video
            ? video.readyState >= 2
            : document.querySelector(".os-evidence-story")?.textContent?.includes("film couldn’t load");
        }),
      { timeout: 15000 },
    )
    .toBeTruthy();
  if ((await media.count()) === 0) {
    await expect(page.locator(".os-evidence-story [role=status]")).toContainText("film couldn’t load");
    await expect(page.locator(".os-evidence-screen img")).toBeVisible();
    return;
  }
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await expect.poll(() => media.evaluate((v) => (v as HTMLVideoElement).paused)).toBeTruthy();
  await page.getByRole("button", { name: "Return to stills" }).click();
  await expect(media).toHaveCount(0);
});

test("case study deep links, project evidence and return navigation work", async ({ page, request }, info) => {
  await page.goto("/work/kerasobha#decisions");
  await expect(page.locator(".os-case-decisions h2")).toBeInViewport();
  await expect(page.locator(".os-decision-grid article")).toHaveCount(6);
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute("href", "https://vargheseshibu.com/work/kerasobha");
  await page.goto("/work/kerasobha");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Kerasobha.");
  await page.screenshot({ path: `artifacts/open-structure/${info.project.name}/case-opening.png` });
  for (const selector of [".os-case-brief", ".os-case-decisions", ".os-case-results"]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/open-structure/${info.project.name}/case-${selector.slice(9)}.png` });
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole("link", { name: "← Selected work", exact: true }).click();
  await expect(page.locator("#work")).toBeInViewport();
  for (const path of ["/robots.txt", "/sitemap.xml"]) expect((await request.get(path)).ok()).toBeTruthy();
  await page.goto("/not-a-route");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/lost/i);
  await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", "noindex, follow");
});
