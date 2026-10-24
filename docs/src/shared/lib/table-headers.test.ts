import assert from "node:assert/strict";
import test from "node:test";

import { createElement as h } from "react";

import { tableHeaders } from "./table-headers.ts";

test("reads rendered MDX table headers without a Markdown AST node", () => {
  const children = [
    h(
      "thead",
      { key: "head" },
      h(
        "tr",
        null,
        h("th", null, "Prop"),
        h("th", null, h("code", null, "Default")),
        h("th", null, "Values"),
        h("th", null, "Meaning"),
      ),
    ),
    h("tbody", { key: "body" }, h("tr", null, h("td", null, "variant"))),
  ];
  assert.deepEqual(tableHeaders(children), ["Prop", "Default", "Values", "Meaning"]);
  assert.deepEqual(
    tableHeaders(
      h(
        "thead",
        null,
        h("tr", null, ...["속성", "기본값", "값", "용도"].map((x) => h("th", { key: x }, x))),
      ),
    ),
    ["속성", "기본값", "값", "용도"],
  );
  assert.deepEqual(tableHeaders(h("tbody", null, h("tr", null, h("td", null, "data")))), []);
});
