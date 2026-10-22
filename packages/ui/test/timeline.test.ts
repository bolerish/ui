import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { TimelineIndicator } from "../dist/timeline.js";
import { Toggle } from "../dist/toggle.js";

const css = readFileSync(new URL("../dist/stylex.css", import.meta.url), "utf8");
function declaration(html: string, property: string) {
  const classes = html.match(/class="([^"]+)"/)?.[1].split(" ") ?? [];
  return classes.flatMap((name) => {
    const value = css.match(new RegExp(`\\.${name}\\s*\\{[^}]*${property}:\\s*([^;]+);`))?.[1];
    return value ? [value] : [];
  });
}

test("timeline progress, persistent selection and errors keep distinct surfaces", () => {
  const complete = renderToStaticMarkup(
    createElement(TimelineIndicator, { variant: "complete" }, "Done"),
  );
  const active = renderToStaticMarkup(
    createElement(TimelineIndicator, { variant: "active" }, "Active"),
  );
  const error = renderToStaticMarkup(
    createElement(TimelineIndicator, { variant: "error" }, "Error"),
  );
  const toggle = renderToStaticMarkup(createElement(Toggle, { pressed: true }, "Selected"));
  assert.notDeepEqual(
    declaration(complete, "background-color"),
    declaration(active, "background-color"),
  );
  assert.notDeepEqual(
    declaration(complete, "background-color"),
    declaration(toggle, "background-color"),
  );
  assert.notDeepEqual(
    declaration(error, "background-color"),
    declaration(complete, "background-color"),
  );
  assert.deepEqual(declaration(complete, "box-shadow"), ["none"]);
  assert.doesNotMatch(declaration(toggle, "box-shadow").join(" "), /inset/);
  assert.match(toggle, /aria-pressed="true"/);
});

test("timeline indicators retain decorative and explicitly named accessibility semantics", () => {
  assert.match(
    renderToStaticMarkup(createElement(TimelineIndicator, {}, "Node")),
    /aria-hidden="true"/,
  );
  const named = renderToStaticMarkup(
    createElement(TimelineIndicator, { "aria-label": "Review complete", variant: "complete" }),
  );
  assert.match(named, /aria-label="Review complete"/);
  assert.doesNotMatch(named, /aria-hidden=/);
});
