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
      await page.addInitScript(() => {
        const state = window as Window & {
          firstDocument?: Element;
          missingDocumentFrames?: number;
        };
        state.missingDocumentFrames = 0;
        function sample() {
          const article = document.querySelector("article[data-docs=document]");
          if (article && !state.firstDocument) state.firstDocument = article;
          if (state.firstDocument && !article) state.missingDocumentFrames!++;
          requestAnimationFrame(sample);
        }
        requestAnimationFrame(sample);
      });
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
        const continuity = await page.evaluate(() => {
          const state = window as Window & {
            firstDocument?: Element;
            missingDocumentFrames?: number;
          };
          return {
            same:
              Boolean(state.firstDocument) &&
              state.firstDocument === document.querySelector("article[data-docs=document]"),
            missingFrames: state.missingDocumentFrames,
          };
        });
        assert.deepEqual(
          continuity,
          { same: true, missingFrames: 0 },
          `${mode}: retain SSG document through hydration`,
        );
      }
      for (const preference of ["dark", "system", "light"] as const) {
        const codePage = await browser.newPage();
        await codePage.emulateMedia({ colorScheme: "dark" });
        const url = `${server.resolvedUrls!.local[0]}docs/installation?colorMode=${preference}`;
        await codePage.route("**/*", (route) =>
          route.request().resourceType() === "script" ? route.abort() : route.continue(),
        );
        await codePage.goto(url, { waitUntil: "networkidle" });
        const dark = preference !== "light";
        const block = codePage.locator("[data-docs=codeblock]").first();
        await expect(block).toBeVisible();
        await expect(block).toHaveCSS(
          "background-color",
          dark ? "rgb(22, 23, 24)" : "rgb(245, 245, 245)",
        );
        await expect(
          codePage.locator(dark ? "[data-docs=theme-icon-dark]" : "[data-docs=theme-icon-light]"),
        ).toBeVisible();
        const before = await block
          .locator("[data-code-token]")
          .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).color));
        await codePage.unroute("**/*");
        await codePage.reload({ waitUntil: "networkidle" });
        await expect(block).toHaveCSS(
          "background-color",
          dark ? "rgb(22, 23, 24)" : "rgb(245, 245, 245)",
        );
        const after = await block
          .locator("[data-code-token]")
          .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).color));
        assert.deepEqual(after, before, `${preference}: token colors before and after hydration`);
        await codePage.close();
      }
      for (const preference of ["dark", "system", "light"] as const) {
        const previewPage = await browser.newPage();
        await previewPage.emulateMedia({ colorScheme: "dark" });
        await previewPage.route("**/*", (route) =>
          route.request().resourceType() === "script" ? route.abort() : route.continue(),
        );
        await previewPage.goto(
          `${server.resolvedUrls!.local[0]}docs/components/toggle-group?colorMode=${preference}`,
          { waitUntil: "networkidle" },
        );
        const canvas = previewPage.locator("[data-docs=preview-canvas]").first();
        const toc = previewPage.locator("[data-docs=table-of-contents] a");
        const headingIds = await previewPage
          .locator("article h2[id]")
          .evaluateAll((nodes) => nodes.map((node) => `#${node.id}`));
        assert.ok(headingIds.length > 0);
        assert.deepEqual(
          await toc.evaluateAll((nodes) => nodes.map((node) => node.getAttribute("href"))),
          headingIds,
        );
        const beforeColors = await previewPage
          .locator(
            "[data-docs=site-header] a, [data-docs=site-header] button, [data-docs=table-of-contents] a",
          )
          .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).color));
        const selectedTab = previewPage
          .getByRole("button", { name: "Preview", exact: true })
          .first();
        const selectedBackground = await selectedTab.evaluate(
          (node) => getComputedStyle(node).backgroundColor,
        );
        assert.notEqual(selectedBackground, "rgba(0, 0, 0, 0)");
        const beforeHeight = (await canvas.boundingBox())!.height;
        await expect(
          previewPage.getByRole("button", { name: "Preview", exact: true }).first(),
        ).toHaveAttribute("aria-pressed", "true");
        const expected = preference === "light" ? "rgb(238, 238, 238)" : "rgb(8, 9, 10)";
        await expect(canvas).toHaveCSS("background-color", expected);
        await previewPage.unroute("**/*");
        await previewPage.reload({ waitUntil: "networkidle" });
        await expect(canvas).toHaveCSS("background-color", expected);
        assert.equal(
          (await canvas.boundingBox())!.height,
          beforeHeight,
          `${preference}: preview height survives hydration`,
        );
        await expect(toc).toHaveCount(headingIds.length);
        assert.deepEqual(
          await previewPage
            .locator(
              "[data-docs=site-header] a, [data-docs=site-header] button, [data-docs=table-of-contents] a",
            )
            .evaluateAll((nodes) => nodes.map((node) => getComputedStyle(node).color)),
          beforeColors,
          `${preference}: header and TOC colors survive hydration`,
        );
        await expect(selectedTab).toHaveCSS("background-color", selectedBackground);
        await previewPage.close();
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
