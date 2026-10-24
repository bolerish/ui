import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { createServer } from "vite";

test(
  "cold development SSR renders the first document and later Markdown routes",
  { timeout: 90_000 },
  async () => {
    const cacheDir = await mkdtemp(join(tmpdir(), "bolerish-dev-"));
    const server = await createServer({
      root: fileURLToPath(new URL("../", import.meta.url)),
      cacheDir,
      server: { host: "127.0.0.1", port: 0 },
    });
    try {
      await server.listen();
      const base = server.resolvedUrls!.local[0];
      for (const path of [
        "docs/getting-started",
        "docs/foundations/overview",
        "docs/components/button",
        "docs/getting-started",
      ]) {
        const response = await fetch(new URL(path, base));
        assert.equal(response.status, 200, path);
        const html = await response.text();
        assert.match(
          html,
          /<h1[ >]/,
          `${path}: SSR must contain the document, not just a streamed shell`,
        );
        assert.doesNotMatch(
          html,
          /Invalid hook call|Cannot read properties of null|Could not load this page/,
        );
      }
    } finally {
      await server.close();
      await rm(cacheDir, { recursive: true, force: true });
    }
  },
);
