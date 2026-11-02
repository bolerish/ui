import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";

import { chromium } from "@playwright/test";

test(
  "SSG document HTML includes complete TOC and selected preview tabs",
  { timeout: 120_000 },
  async () => {
    const root = new URL("../dist/client/docs/", import.meta.url);
    const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE_PATH });
    try {
      const page = await browser.newPage({ javaScriptEnabled: false });
      let checked = 0;
      for (const file of await readdir(root, { recursive: true })) {
        if (!file.endsWith("index.html")) continue;
        const html = await readFile(join(root.pathname, file), "utf8");
        await page.setContent(html, { waitUntil: "domcontentloaded" });
        const headings = await page
          .locator("article.document h2[id]")
          .evaluateAll((nodes) =>
            nodes.map((node) => ({ id: `#${node.id}`, title: node.textContent })),
          );
        const toc = await page
          .locator(".table-of-contents a")
          .evaluateAll((nodes) =>
            nodes.map((node) => ({ id: node.getAttribute("href"), title: node.textContent })),
          );
        assert.deepEqual(toc, headings, file);
        for (const tab of await page.getByRole("tab", { name: "Preview", exact: true }).all())
          assert.equal(await tab.getAttribute("aria-selected"), "true", file);
        checked++;
      }
      assert.ok(checked > 100, `checked ${checked} generated documents`);
    } finally {
      await browser.close();
    }
  },
);
