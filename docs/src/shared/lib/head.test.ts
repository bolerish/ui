import assert from "node:assert/strict";
import test from "node:test";

import { documentHead, localizedLinks } from "./head.ts";
import { siteOrigin } from "./site.ts";

test("localized metadata points to the canonical language and matching Markdown", () => {
  for (const [section, slug, markdown] of [
    ["guide", "theming", "guides/theming"],
    ["components", "item", "guidelines/item"],
    ["foundations", "color", "guidelines/color"],
    ["api", "surface", "api/surface"],
  ])
    for (const locale of ["en", "ko"] as const) {
      const head = documentHead({ section, slug, title: slug }, locale);
      assert.ok(head.links);
      const path = section === "guide" ? `/docs/${slug}` : `/docs/${section}/${slug}`;
      assert.equal(
        head.links.find((link) => link.rel === "canonical")?.href,
        `${siteOrigin}${path}${locale === "ko" ? "/ko" : ""}`,
      );
      assert.equal(
        head.links.find((link) => "type" in link)?.href,
        `/${markdown}${locale === "en" ? ".en" : ""}.md`,
      );
      assert.equal(head.links.filter((link) => "hrefLang" in link).length, 3);
    }
  assert.equal(localizedLinks("/", "ko")[0].href, `${siteOrigin}/ko`);
  assert.equal(localizedLinks("/", "en")[0].href, `${siteOrigin}/`);
  assert.deepEqual(documentHead(undefined, "en"), {
    meta: [{ name: "robots", content: "noindex" }],
  });
});
