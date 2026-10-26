import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src",
  testMatch: "**/*.browser.spec.ts",
  fullyParallel: false,
  workers: 1,
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    {
      name: "firefox",
      testMatch: ["**/liquid.browser.spec.ts", "**/surface-refraction.browser.spec.ts"],
      use: { browserName: "firefox", launchOptions: {} },
    },
    {
      name: "webkit",
      testMatch: ["**/liquid.browser.spec.ts", "**/surface-refraction.browser.spec.ts"],
      use: { browserName: "webkit", launchOptions: {} },
    },
  ],
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4175",
    launchOptions: process.env.BROWSER_EXECUTABLE_PATH
      ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH }
      : {},
  },
  webServer: {
    command:
      "pnpm exec vite build --config playwright.vite.config.ts && pnpm exec vite preview --config playwright.vite.config.ts --host 127.0.0.1 --port 4175 --strictPort",
    url: "http://127.0.0.1:4175",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
