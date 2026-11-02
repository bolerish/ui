import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { chromium, expect } from "@playwright/test";
import { createServer } from "vite";

test(
  "development StyleX updates preserve dark and light component colors",
  { timeout: 120_000 },
  async () => {
    const server = await createServer({
      root: fileURLToPath(new URL("../", import.meta.url)),
      server: { host: "127.0.0.1", port: 0 },
    });
    const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE_PATH });
    try {
      await server.listen();
      const page = await browser.newPage();
      for (const [mode, expected] of [
        ["dark", "rgb(245, 246, 248)"],
        ["light", "rgb(8, 9, 10)"],
      ] as const) {
        await page.goto(
          `${server.resolvedUrls!.local[0]}docs/components/toggle-group?colorMode=${mode}`,
        );
        const button = page.getByRole("button", { name: "Left", exact: true }).first();
        await button.waitFor();
        await page.waitForFunction(() =>
          Boolean(document.getElementById("__stylex_virtual__")?.textContent),
        );
        await expect(button).toHaveCSS("color", expected);
      }
      const css = await (
        await page.request.get(`${server.resolvedUrls!.local[0]}virtual:stylex.css`)
      ).text();
      assert.ok(css.includes("@layer priority1"));
    } finally {
      await browser.close();
      await server.close();
    }
  },
);
