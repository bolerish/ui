import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

import { unstable_readConfig } from "wrangler";

test("deployment serves built assets behind canonical redirects", async () => {
  const config = unstable_readConfig({
    config: fileURLToPath(new URL("../wrangler.jsonc", import.meta.url)),
  });
  assert.equal(config.main, fileURLToPath(new URL("../worker.ts", import.meta.url)));
  assert.equal(config.assets?.directory, "./dist/client");
  assert.equal(config.assets.binding, "ASSETS");
  assert.equal(config.assets.run_worker_first, true);
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

test("every sitemap page exposes its own metadata, one primary heading and a language selector", async () => {
  const root = new URL("../dist/client/", import.meta.url);
  const xml = await readFile(new URL("sitemap.xml", root), "utf8");
  const titles = { en: new Set<string>(), ko: new Set<string>() };
  const descriptions = { en: new Set<string>(), ko: new Set<string>() };
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
  assert.ok(urls.length > 0);
  for (const url of urls) {
    assert.equal(url.origin, "https://ui.bolerish.com");
    const path = url.pathname;
    const html = await readFile(
      new URL(path === "/" ? "index.html" : `${path.slice(1)}/index.html`, root),
      "utf8",
    );
    const locale = path.endsWith("/ko") ? "ko" : "en";
    const alternate = locale === "en" ? `${path === "/" ? "" : path}/ko` : path.slice(0, -3) || "/";
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
    assert.ok(title, path);
    assert.ok(description, path);
    assert.ok(!titles[locale].has(title), `Duplicate ${locale} title: ${title}`);
    assert.ok(
      !descriptions[locale].has(description),
      `Duplicate ${locale} summary: ${description}`,
    );
    titles[locale].add(title);
    descriptions[locale].add(description);
    assert.doesNotMatch(
      description,
      /usage, examples and design guidance|의 사용 방법, 예제와 디자인 지침/,
    );
    assert.equal([...html.matchAll(/<h1[\s>]/g)].length, 1, path);
    assert.ok(html.includes(`rel="canonical" href="${url.href}"`), path);
    const links = [...html.matchAll(/<link\b[^>]*>/g)].map((match) => match[0]);
    assert.ok(
      links.some(
        (link) =>
          link.includes('rel="alternate"') &&
          link.includes(`href="${url.origin}${alternate}"`) &&
          link.includes(`hrefLang="${locale === "en" ? "ko" : "en"}"`),
      ),
      `Missing alternate language metadata: ${path}`,
    );
    const selector = html.match(/<button\b[^>]*data-docs="language-select"[^>]*>/)?.[0];
    assert.ok(selector, `Missing language selector: ${path}`);
    assert.ok(selector.includes('role="combobox"'), path);
    assert.ok(selector.includes(`aria-label="${locale === "ko" ? "언어" : "Language"}"`), path);
  }
  const koreanInstallation = await readFile(
    new URL("docs/installation/ko/index.html", root),
    "utf8",
  );
  assert.match(koreanInstallation, /<title>설치 · bolerish\/ui<\/title>/);
});
