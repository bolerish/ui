import assert from "node:assert/strict";
import test from "node:test";

import { localizedPath, documentPath, documentLink, legacyDocumentPath } from "./paths.ts";

test("short localized paths and legacy routes", () => {
  assert.equal(localizedPath("/", "ko"), "/ko");
  assert.equal(localizedPath("/ko", "en"), "/");
  assert.equal(localizedPath("/docs/components/button/ko", "en"), "/docs/components/button");
  assert.equal(
    documentPath({ section: "guide", slug: "getting-started" }, "ko"),
    "/docs/getting-started/ko",
  );
  assert.equal(documentPath({ section: "components", slug: "button" }), "/docs/components/button");
  assert.equal(legacyDocumentPath("/components/button"), "/docs/components/button");
  assert.equal(legacyDocumentPath("/docs/ko"), "/docs/getting-started/ko");
  assert.equal(legacyDocumentPath("/docs/guide/getting-started"), "/docs/getting-started");
});

test("each guide keeps its own localized URL and typed route parameters", () => {
  for (const slug of ["getting-started", "installation", "theming", "styling", "changelog"]) {
    const page = { section: "guide", slug };
    assert.equal(documentPath(page), `/docs/${slug}`);
    assert.equal(documentPath(page, "ko"), `/docs/${slug}/ko`);
    assert.deepEqual(documentLink(page, "en"), {
      to: "/docs/$guide",
      params: { guide: slug },
    });
    assert.deepEqual(documentLink(page, "ko"), {
      to: "/docs/$guide/ko",
      params: { guide: slug },
    });
    assert.equal(legacyDocumentPath(`/docs/guide/${slug}/ko`), `/docs/${slug}/ko`);
  }
});
