import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test",
  testMatch: "*.browser.spec.ts",
  fullyParallel: true,
  workers: 2,
  timeout: 180000,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://127.0.0.1:3005", screenshot: "only-on-failure" },
  projects: [
    {
      name: "chromium",
      use: {
        browserName: "chromium",
        launchOptions: process.env.BROWSER_EXECUTABLE_PATH
          ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH }
          : {},
      },
    },
    {
      name: "mobile-webkit",
      grep: /critical/,
      use: { ...devices["iPhone 13"], browserName: "webkit" },
    },
  ],
  webServer: {
    command:
      "pnpm exec wrangler dev --config wrangler.jsonc --persist-to .wrangler/responsive-tests --ip 127.0.0.1 --port 3005",
    url: "http://127.0.0.1:3005",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
