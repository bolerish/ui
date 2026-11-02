import assert from "node:assert/strict";
import test from "node:test";

import { documentHeadings } from "./document-headings.ts";

test("heading metadata preserves IDs and locale boundaries", () => {
  const tree: Parameters<ReturnType<typeof documentHeadings>>[0] = {
    type: "root",
    children: [
      {
        type: "mdxJsxFlowElement",
        name: "LocaleContent",
        attributes: [{ name: "locale", value: "en" }],
        children: [
          {
            type: "element",
            tagName: "h2",
            properties: { id: "public-api-2" },
            children: [{ type: "text", value: "Public API" }],
          },
        ],
      },
      {
        type: "mdxJsxFlowElement",
        name: "LocaleContent",
        attributes: [{ name: "locale", value: "ko" }],
        children: [
          {
            type: "element",
            tagName: "h2",
            properties: { id: "사용법" },
            children: [{ type: "text", value: "사용법" }],
          },
        ],
      },
      {
        type: "mdxJsxFlowElement",
        name: "LocalizedMarkdown",
        attributes: [{ name: "text", value: "## Basic example" }],
      },
    ],
  };
  documentHeadings()(tree);
  const exported = tree.children!.at(-1)!.data as {
    estree: {
      body: { declaration: { declarations: { init: { arguments: { value: string }[] } }[] } }[];
    };
  };
  const headings = JSON.parse(
    exported.estree.body[0].declaration.declarations[0].init.arguments[0].value,
  );
  assert.deepEqual(headings.en, [
    { id: "public-api-2", title: "Public API" },
    { id: "basic-example", title: "Basic example" },
  ]);
  assert.equal(headings.ko[0].id, "사용법");
  assert.equal(headings.ko.length, 2);
});
