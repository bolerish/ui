import assert from "node:assert/strict";
import test from "node:test";

import { searchDocuments } from "./search.ts";
const documents = ["components/table", "foundations/state"].map((id) => ({
  id,
  title: id,
  section: id.split("/")[0]!,
  url: id,
  content: "selection",
}));
test("phrase boundaries, whitespace, foundations and residual AND", () => {
  assert.equal(searchDocuments(documents, "selected   row").length, 2);
  assert.equal(searchDocuments(documents, "선택된 행").length, 2);
  for (const query of [
    "notselected row",
    "selected rowsomething",
    "미선택된 행",
    "선택된 행동",
    "selected row unknown",
    "selected row immediate setting",
  ]) {
    assert.equal(searchDocuments(documents, query).length, 0, query);
  }
  assert.equal(searchDocuments(documents, "table")[0]?.id, "components/table");
  assert.equal("rank" in searchDocuments(documents, "table")[0]!, false);
});
