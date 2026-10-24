import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
import test from "node:test";

const root = new URL("../public/", import.meta.url);

test("agent catalog covers the components and all its linked references exist", async () => {
  const catalog = await readFile(new URL("agent/SKILL.md", root), "utf8");
  for (const file of await readdir(new URL("../../packages/ui/src/", import.meta.url))) {
    if (!file.endsWith(".tsx")) continue;
    const name = file.slice(0, -4);
    assert.ok(catalog.includes(`- [${name}](`), `Missing ${name}`);
  }
  for (const name of ["llms.txt", "agent/SKILL.md"]) {
    const file = new URL(name, root);
    const content = await readFile(file, "utf8");
    for (const match of content.matchAll(/\]\(([^)]+)\)/g)) {
      if (/^https?:/.test(match[1])) continue;
      await access(new URL(match[1], file));
    }
  }
});

test("canonical agent entry points use English and link English references", async () => {
  for (const name of [
    "llms.txt",
    "llms-full.txt",
    "agent/SKILL.md",
    "bolerish-for-llms.md",
    "installation.md",
  ]) {
    const content = await readFile(new URL(name, root), "utf8");
    assert.doesNotMatch(content, /[가-힣]/, name);
  }
  const index = await readFile(new URL("llms.txt", root), "utf8");
  assert.doesNotMatch(index, /\.\/guidelines\/[^)]+(?<!\.en)\.md\)/);
});

test("public guides are readable Markdown and search discovery lists canonical pages", async () => {
  for (const slug of ["getting-started", "installation", "theming", "styling", "changelog"]) {
    const english = await readFile(new URL(`guides/${slug}.en.md`, root), "utf8");
    const korean = await readFile(new URL(`guides/${slug}.md`, root), "utf8");
    assert.match(english, /^# /);
    assert.match(korean, /^# /);
    assert.doesNotMatch(english, /[가-힣]|LocaleContent/);
    assert.doesNotMatch(korean, /LocaleContent/);
  }
  const installation = await readFile(new URL("guides/installation.en.md", root), "utf8");
  assert.ok(installation.includes('import { Button } from "@bolerish/ui/button";'));
  const sitemap = await readFile(new URL("sitemap.xml", root), "utf8");
  for (const path of [
    "/docs/installation",
    "/docs/installation/ko",
    "/docs/components/item",
    "/docs/components/item/ko",
  ])
    assert.ok(sitemap.includes(`${path}</loc>`), path);
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g))
    assert.doesNotMatch(match[1], /\/preview\/|content-row|\?/);
  const robots = await readFile(new URL("robots.txt", root), "utf8");
  assert.match(robots, /User-agent: \*\nAllow: \/\nSitemap: https:\/\/.+\/sitemap.xml/);
});
