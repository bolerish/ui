import assert from "node:assert/strict";
import test from "node:test";

import { localizedPath, documentPath, legacyDocumentPath } from "./paths.ts";

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
