import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

import { unstable_readConfig } from "wrangler";

test("deployment uploads static assets without a request-time rendering entry", async () => {
  const config = unstable_readConfig({
    config: fileURLToPath(new URL("../wrangler.jsonc", import.meta.url)),
  });
  assert.equal(config.main, undefined);
  assert.equal(config.assets?.directory, "./dist/client");
  assert.equal(config.assets.not_found_handling, "404-page");
  assert.equal(config.assets.html_handling, "drop-trailing-slash");
});

test("built head applies saved, explicit and system color modes before React loads", async () => {
  const html = await readFile(new URL("../dist/client/index.html", import.meta.url), "utf8");
  const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, "the static document includes a prepaint appearance script");
  for (const [cookie, search, systemDark, expected] of [
    [encodeURIComponent('{"colorMode":"dark"}'), "", false, "dark"],
    [encodeURIComponent('{"colorMode":"dark"}'), "?colorMode=light", false, "light"],
    [encodeURIComponent('{"colorMode":"system"}'), "", true, "dark"],
    [encodeURIComponent('{"colorMode":"system"}'), "", false, "light"],
    ["%", "?colorMode=dark", false, "dark"],
    ["null", "", false, "light"],
  ] as const) {
    const element = { dataset: {} as Record<string, string>, className: "consumer-root" };
    runInNewContext(script, {
      document: { cookie: `bolerish-docs-settings=${cookie}`, documentElement: element },
      location: { search },
      URLSearchParams,
      matchMedia: () => ({ matches: systemDark }),
    });
    assert.equal(element.dataset.bolerishTheme, expected);
    assert.equal(element.className, "consumer-root");
  }
});
