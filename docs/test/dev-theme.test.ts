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
      for (const preference of ["dark", "system", "light"] as const) {
        await page.emulateMedia({ colorScheme: "dark" });
        const url = `${server.resolvedUrls!.local[0]}docs/installation?colorMode=${preference}`;
        await page.route("**/*", (route) =>
          route.request().resourceType() === "script" ? route.abort() : route.continue(),
        );
        await page.goto(url, { waitUntil: "networkidle" });
        const dark = preference !== "light";
        const block = page.locator(".docs-codeblock").first();
        await expect(block).toBeVisible();
        await expect(block).toHaveCSS(
          "background-color",
          dark ? "rgb(22, 23, 24)" : "rgb(245, 245, 245)",
        );
        await expect(page.locator(dark ? ".theme-icon-dark" : ".theme-icon-light")).toBeVisible();
        const before = await block
          .locator(".token")
          .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).color));
        await page.unroute("**/*");
        await page.reload({ waitUntil: "networkidle" });
        await expect(block).toHaveCSS(
          "background-color",
          dark ? "rgb(22, 23, 24)" : "rgb(245, 245, 245)",
        );
        const after = await block
          .locator(".token")
          .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).color));
        assert.deepEqual(after, before, `${preference}: token colors before and after hydration`);
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
