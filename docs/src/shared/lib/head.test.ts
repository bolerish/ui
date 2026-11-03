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

test("search metadata uses localized summaries and distinguishes guidelines from APIs", () => {
  for (const [locale, title, summary, guidelineTitle, apiTitle] of [
    [
      "en",
      "Gradient",
      "Choose gradients for content backgrounds.",
      "Gradient design guidelines",
      "Gradient API reference",
    ],
    [
      "ko",
      "그라디언트",
      "콘텐츠 배경에 사용할 그라디언트를 선택합니다.",
      "그라디언트 설계 지침",
      "그라디언트 API 참조",
    ],
  ] as const) {
    const metadata = { title, description: summary };
    const guideline = documentHead(
      { section: "foundations", slug: "gradient", title: "Gradient" },
      locale,
      metadata,
    );
    const api = documentHead(
      { section: "api", slug: "gradient", title: "Gradient" },
      locale,
      metadata,
    );
    assert.deepEqual(guideline.meta[0], { title: `${guidelineTitle} · bolerish/ui` });
    assert.deepEqual(api.meta[0], { title: `${apiTitle} · bolerish/ui` });
    assert.equal(guideline.meta[1].content, summary);
    assert.equal(api.meta[1].content, summary);
  }
  const component = documentHead({ section: "components", slug: "button", title: "Button" }, "en", {
    title: "Button",
    description: "Choose emphasis for the next action.",
  });
  assert.deepEqual(component.meta[0], { title: "React Button component · bolerish/ui" });
});
