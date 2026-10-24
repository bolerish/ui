import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";
const base = process.env.DOCS_URL ?? "http://localhost:3000";

test("all documents render through the Workers SSR entry", async () => {
  let count = 0;
  for (const group of ["components", "foundations", "patterns"]) {
    const root = new URL(`../src/${group}/`, import.meta.url);
    for (const entry of await readdir(root, { withFileTypes: true })) {
      if (
        !entry.isDirectory() ||
        !(await readdir(new URL(`${entry.name}/`, root))).includes("docs.mdx")
      )
        continue;
      const response = await fetch(`${base}/docs/${group}/${entry.name}`);
      assert.equal(response.status, 200, `${group}/${entry.name}`);
      const html = await response.text();
      assert.match(html, /<!DOCTYPE html>/i);
      assert.match(html, /<h1[ >]/);
      assert.doesNotMatch(
        html,
        /Could not load this page|Example not found|Loading document…|Source reference|Loading source reference…|Loading example…/,
      );
      count++;
    }
  }
  assert.equal(count, 73);
});

test("SSR settings, saved preferences, legacy links and missing pages", async () => {
  const dark = await fetch(
    `${base}/docs/components/button?locale=en&colorMode=dark&density=compact`,
  );
  const html = await dark.text();
  assert.match(html, /data-color-mode="dark"/);
  assert.match(html, /--bolerish-density:0.875/);
  assert.match(html, /Make the next useful action/);
  assert.doesNotMatch(html, /Source reference/);
  const saved = encodeURIComponent(JSON.stringify({ colorMode: "dark", locale: "en" }));
  const preferences = await fetch(`${base}/docs/components/input`, {
    headers: { cookie: `bolerish-docs-settings=${saved}` },
    redirect: "manual",
  });
  assert.equal(preferences.status, 200);
  assert.equal(preferences.headers.get("location"), null);
  assert.match(await preferences.text(), /data-color-mode="dark"/);
  const defaults = await fetch(`${base}/docs/components/button`, {
    headers: {
      cookie: `bolerish-docs-settings=${encodeURIComponent(JSON.stringify({ colorMode: "light", locale: "ko" }))}`,
    },
  });
  assert.equal(defaults.status, 200, "default saved preferences must not redirect forever");
  const explicit = await fetch(`${base}/docs/components/button?colorMode=light`, {
    headers: { cookie: `bolerish-docs-settings=${saved}` },
  });
  assert.match(await explicit.text(), /data-color-mode="light"/);
  const legacy = await fetch(`${base}/?path=/docs/components-dialog--docs`);
  assert.match(legacy.url, /\/docs\/components\/dialog/);
  const missing = await fetch(`${base}/docs/components/not-a-component?locale=en`);
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Page not found/);
  const inlineDialog = await (await fetch(`${base}/docs/components/dialog?locale=en`)).text();
  assert.match(inlineDialog, /<button[^>]*>Open profile/);
  assert.doesNotMatch(inlineDialog, /<iframe/);
  const inlineTooltip = await (await fetch(`${base}/docs/components/tooltip?locale=en`)).text();
  assert.match(inlineTooltip, /<button[^>]*aria-label="Help"/);
  assert.doesNotMatch(inlineTooltip, /<iframe/);
  const preview = await fetch(`${base}/preview/dialog--Default?locale=en`);
  assert.equal(preview.status, 200);
  assert.equal((await fetch(`${base}/preview/toString?locale=en`)).status, 404);
  assert.match(await preview.text(), /<button[^>]*>Open profile/);
});

test("server reference corpus stays out of the client bundle", async () => {
  for (const file of await readdir(new URL("../dist/client/assets/", import.meta.url))) {
    if (!file.endsWith(".js")) continue;
    const source = await readFile(
      new URL(`../dist/client/assets/${file}`, import.meta.url),
      "utf8",
    );
    assert.doesNotMatch(source, /async function readReference\(|export interface ButtonProps/);
  }
});

test("localized home gallery and canonical redirects", async () => {
  for (const suffix of ["", "/ko"]) {
    const response = await fetch(`${base}${suffix || "/"}`);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, new RegExp(`lang="${suffix ? "ko" : "en"}"`));
    assert.match(html, /bolerish<span>\/ui/);
    assert.equal((html.match(/class="gallery-item"/g) ?? []).length, 57);
    assert.match(html, /Create account/);
    assert.equal((html.match(/<header><h3>/g) ?? []).length, 57);
    assert.doesNotMatch(html, /<iframe/);
    assert.doesNotMatch(html, /gallery-placeholder|Could not load this page/);
    const previews = html.match(/<div class="gallery-preview" lang="en">/g) ?? [];
    assert.equal(previews.length, 57, "every example must render on the initial SSR response");
    assert.doesNotMatch(html, /<div class="gallery-preview" lang="en"><\/div>/);
  }
  for (const path of [
    "/docs/getting-started",
    "/docs/getting-started/ko",
    "/docs/components/button/ko",
    "/docs/foundations/color/ko",
  ]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), /<h1[ >]/);
  }
  const redirect = await fetch(`${base}/docs/components/button?locale=ko&colorMode=dark`, {
    redirect: "manual",
  });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get("location"), "/docs/components/button/ko?colorMode=dark");
  for (const path of ["/docs/components/button/kr", "/docs/getting-started/fr"])
    assert.equal((await fetch(`${base}${path}`)).status, 404);
});

test("guides render in both languages and keep internal links localized", async () => {
  for (const [slug, english, korean] of [
    ["getting-started", "Introduction", "소개"],
    ["installation", "Installation", "설치"],
    ["theming", "Theming", "테마"],
    ["styling", "Styling", "스타일링"],
    ["changelog", "Changelog", "변경 기록"],
  ]) {
    for (const [suffix, title] of [
      ["", english],
      ["/ko", korean],
    ]) {
      const response = await fetch(`${base}/docs/${slug}${suffix}`);
      assert.equal(response.status, 200, `${slug}${suffix}`);
      const html = await response.text();
      assert.match(html, new RegExp(`<h1[^>]*>${title}</h1>`));
      assert.match(html, new RegExp(`href="/docs/installation${suffix}"`));
      assert.match(html, new RegExp(`href="/docs/theming${suffix}"`));
      assert.match(html, new RegExp(`href="/docs/styling${suffix}"`));
      assert.doesNotMatch(html, /Could not load this page/);
    }
  }
  for (const path of ["/docs/not-a-guide", "/docs/theming/fr"])
    assert.equal((await fetch(`${base}${path}`)).status, 404, path);
});

test("previous short URLs redirect to the docs hierarchy", async () => {
  for (const [from, to] of [
    ["/docs", "/docs/getting-started"],
    ["/docs/ko", "/docs/getting-started/ko"],
    ["/components/button", "/docs/components/button"],
    ["/foundations/color/ko", "/docs/foundations/color/ko"],
  ]) {
    const response = await fetch(`${base}${from}`, { redirect: "manual" });
    assert.equal(response.status, 308);
    assert.equal(response.headers.get("location"), to);
  }
});

test("surface preferences, Item docs and crawler discovery cross real HTTP boundaries", async () => {
  const response = await fetch(`${base}/docs/installation/ko?surface=liquid`);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /data-bolerish-surface="liquid"/);
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map((match) => match[0]);
  assert.ok(
    links.some((link) => link.includes('rel="describedby"') && link.includes('href="/llms.txt"')),
  );
  assert.ok(
    links.some(
      (link) =>
        link.includes('type="text/markdown"') && link.includes('href="/guides/installation.md"'),
    ),
  );
  assert.ok(
    links.some(
      (link) =>
        link.includes('rel="canonical"') &&
        link.includes('/docs/installation/ko"') &&
        !link.includes("?"),
    ),
  );
  const markdown = await fetch(`${base}/guides/installation.md`);
  assert.equal(markdown.status, 200);
  assert.match(await markdown.text(), /^# 설치/m);
  assert.equal((await fetch(`${base}/docs/components/item`)).status, 200);
  assert.equal((await fetch(`${base}/docs/components/content-row`)).status, 404);
  for (const file of ["llms.txt", "llms-full.txt", "robots.txt", "sitemap.xml"])
    assert.equal((await fetch(`${base}/${file}`)).status, 200, file);
  const preview = await (await fetch(`${base}/preview/card--Default`)).text();
  assert.match(preview, /name="robots" content="noindex"/);
});
