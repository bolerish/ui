import assert from "node:assert/strict";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Button } from "../dist/button.js";
import { Heading } from "../dist/heading.js";

test("heading level remains independent of its visual size", () => {
  for (const size of ["page", "section", "subsection"] as const) {
    const html = renderToStaticMarkup(
      createElement(Heading, { level: 3, size, id: "settings" }, "Settings"),
    );
    assert.match(html, /^<h3\b/);
    assert.match(html, /id="settings"/);
    assert.doesNotMatch(html, /\b(?:size|level)=/);
  }
});

test("heading supports every HTML heading level", () => {
  for (const level of [1, 2, 3, 4, 5, 6] as const) {
    const html = renderToStaticMarkup(createElement(Heading, { level }, "Section"));
    assert.ok(html.startsWith(`<h${level} `));
    assert.ok(html.endsWith(`</h${level}>`));
  }
});

test("paragraph variants render semantic paragraphs without leaking style props", async () => {
  const { P } = await import("../dist/index.js");
  assert.equal(typeof P, "function");
  for (const variant of ["body", "description", "caption"] as const) {
    const html = renderToStaticMarkup(createElement(P, { variant, id: "details" }, "Details"));
    assert.match(html, /^<p\b/);
    assert.match(html, /id="details"/);
    assert.doesNotMatch(html, /\bvariant=/);
  }
});

test("button renders caller content directly", () => {
  const html = renderToStaticMarkup(
    createElement(Button, null, createElement("svg", { "aria-hidden": true }), "Save"),
  );
  assert.match(html, /<button[^>]*><svg/);
  assert.match(html, /<\/svg>Save<\/button>/);
  assert.doesNotMatch(html, /<span/);
});

test("Paragraph is the canonical component and P remains a compatible alias", async () => {
  const { Paragraph, P } = await import("../dist/index.js");
  assert.equal(typeof Paragraph, "function");
  assert.equal(P, Paragraph);
  const entry = await import("../dist/paragraph.js");
  assert.equal(entry.Paragraph, Paragraph);
});
