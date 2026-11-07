import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;
const previewURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "tests",
  // Previous-art-direction specs remain as historical references. The release
  // suite below exercises the replacement experience and its content contract.
  testMatch: ["open-structure.spec.ts"],
  timeout: 90_000,
  workers: 2,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: previewURL || `http://127.0.0.1:${PORT}`, trace: "retain-on-failure" },
  webServer: previewURL
    ? undefined
    : {
        command: `npm run build && npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
        url: `http://127.0.0.1:${PORT}`,
        reuseExistingServer: true,
        timeout: 180_000,
      },
  projects: [
    { name: "desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "desktop-1920", use: { ...devices["Desktop Chrome"], viewport: { width: 1920, height: 1080 } } },
    {
      name: "tablet-1024",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 1366 }, hasTouch: true },
    },
    {
      name: "tablet-768",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, hasTouch: true, isMobile: true },
    },
    { name: "mobile-390", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
    { name: "mobile-360", use: { ...devices["Pixel 7"], viewport: { width: 360, height: 780 } } },
    { name: "mobile-375", use: { ...devices["iPhone 13"], viewport: { width: 375, height: 812 } } },
    { name: "mobile-430", use: { ...devices["iPhone 13"], viewport: { width: 430, height: 932 } } },
  ],
});
