import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { searchDocuments, searchText, type SearchDocument } from "./search.ts";

test("search finds body text, combines terms and shows a nearby excerpt", () => {
  const documents = [
    {
      section: "foundations",
      slug: "state",
      title: "State",
      text: `${"Introduction. ".repeat(30)}Keyboard focus remains visible. More guidance.`,
    },
  ];
  const results = searchDocuments(documents, " KEYBOARD state ");
  assert.equal(results.length, 1);
  const [result] = results;
  assert.equal(result.slug, "state");
  assert.match(result.description, /Keyboard focus/);
  assert.ok(result.description.startsWith("…"));
  assert.equal(searchDocuments(documents, "keyboard missing").length, 0);
  assert.equal(searchDocuments(documents, "").length, 1);
  assert.equal(
    searchText("# Title\n[Focus](./state) **visible**\n```tsx\nsecret code\n```"),
    "Title Focus visible",
  );
});

test("generated localized indexes cover all docs and search actual body content", async () => {
  for (const locale of ["en", "ko"]) {
    const index: SearchDocument[] = JSON.parse(
      await readFile(new URL(`../../../public/search.${locale}.json`, import.meta.url), "utf8"),
    );
    assert.equal(index.length, 78);
    assert.equal(new Set(index.map((item) => `${item.section}/${item.slug}`)).size, 78);
    assert.ok(index.every((item) => item.title && item.text));
    const results = searchDocuments(index, locale === "en" ? "portals" : "포털");
    assert.ok(results.some((item) => item.slug === "theming"));
    assert.ok(index.some((item) => item.slug === "item"));
    assert.ok(!index.some((item) => item.slug === "content-row"));
  }
});
