import assert from "node:assert/strict";
import test from "node:test";

import { createBundle } from "./catalog.ts";

test("bundle identifies content deterministically at unchanged document count", () => {
  const documents = [{ id: "a", title: "A", section: "guides", url: "a", content: "before" }];
  const first = createBundle("1", {}, documents);
  assert.deepEqual(createBundle("1", {}, documents), first);
  const changed = createBundle("1", {}, [{ ...documents[0]!, content: "after" }]);
  assert.equal(first.documentCount, changed.documentCount);
  assert.notEqual(first.contentHash, changed.contentHash);
});
