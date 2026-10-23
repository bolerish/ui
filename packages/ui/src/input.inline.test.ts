import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Combobox, ComboboxInput } from "../dist/combobox.js";
import { Input } from "../dist/input.js";

const css = readFileSync(new URL("../dist/stylex.css", import.meta.url), "utf8");

function hasFocusOutline(html: string) {
  const classes = [...html.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1].split(" "));
  return classes.some((name) =>
    new RegExp(`\\.${name}:focus-(?:visible|within)[^{]*\\{[^}]*outline-style:\\s*solid`).test(css),
  );
}

test("inline Input retains a focus indication without leaking its visual prop to the DOM", () => {
  const html = renderToStaticMarkup(
    createElement(Input, {
      variant: "inline",
      "aria-label": "Bookmark title",
      "aria-invalid": true,
    }),
  );
  assert.doesNotMatch(html, /variant=/);
  assert.match(html, /aria-invalid="true"/);
  assert.ok(hasFocusOutline(html));
});

test("inline Combobox preserves named addons and group focus indication", () => {
  const html = renderToStaticMarkup(
    createElement(
      Combobox,
      {},
      createElement(ComboboxInput, {
        variant: "inline",
        "aria-label": "Search",
        startAddon: createElement("button", { "aria-label": "Search engine" }, "Engine"),
        endAddon: createElement("span", {}, "Shortcut"),
      }),
    ),
  );
  assert.match(html, /Search engine/);
  assert.match(html, /Shortcut/);
  assert.match(html, /role="combobox"/);
  assert.doesNotMatch(html, /variant=|startAddon=|endAddon=/);
  assert.ok(hasFocusOutline(html));
});
