import assert from "node:assert/strict";
import test from "node:test";

import { compactEmptyJsx } from "./compact-empty-jsx.ts";

test("compacts empty JSX while preserving content and attributes", () => {
  assert.equal(compactEmptyJsx("<SidebarInset>\n  </SidebarInset>"), "<SidebarInset />");
  assert.equal(
    compactEmptyJsx('<Footer aria-label="User"></Footer>'),
    '<Footer aria-label="User" />',
  );
  const content = "<Panel><Title>Home</Title>{/* Content */}<Body /></Panel>";
  assert.equal(compactEmptyJsx(content), content);
  assert.equal(
    compactEmptyJsx("<Panel><Header></Header><Body> </Body></Panel>"),
    "<Panel><Header /><Body /></Panel>",
  );
});
