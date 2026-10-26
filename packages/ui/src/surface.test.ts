import assert from "node:assert/strict";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { surface } from "../dist/surface.js";

test("surface selects either material without taking ownership of classes or styles", () => {
  for (const mode of ["solid", "liquid"] as const) {
    const attributes = surface.props({ mode });
    assert.deepEqual(attributes, { "data-bolerish-surface": mode });
    const existing = { className: "consumer-layout", style: { display: "grid" } };
    assert.deepEqual({ ...existing, ...attributes }, { ...attributes, ...existing });
    const html = renderToStaticMarkup(
      createElement("html", { ...existing, ...attributes }, "Content"),
    );
    assert.match(html, new RegExp(`data-bolerish-surface="${mode}"`));
    assert.match(html, /class="consumer-layout"/);
    assert.match(html, /style="display:grid"/);
    assert.doesNotMatch(html, /<div/);
  }
});

test("surface rejects missing or unsupported material modes", () => {
  for (const options of [
    undefined,
    null,
    {},
    { mode: undefined },
    { mode: "glass" },
    { mode: 1 },
  ]) {
    assert.throws(() => Reflect.apply(surface.props, undefined, [options]), TypeError);
  }
});
