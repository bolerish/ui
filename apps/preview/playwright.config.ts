import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./test",
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  use: {
    baseURL: "http://127.0.0.1:3011",
    browserName: "chromium",
    launchOptions: process.env.BROWSER_EXECUTABLE_PATH
      ? { executablePath: process.env.BROWSER_EXECUTABLE_PATH }
      : {},
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "pnpm exec vite --port 3011 --mode test",
    url: "http://127.0.0.1:3011",
    reuseExistingServer: false,
    timeout: 60000,
  },
});
