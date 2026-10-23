import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Button } from "../../dist/button.js";
import { Card } from "../../dist/card.js";
import { Collapsible, CollapsibleTrigger } from "../../dist/collapsible.js";
import { Input } from "../../dist/input.js";
import { Link } from "../../dist/link.js";
import { NativeSelect } from "../../dist/native-select.js";
import { ScrollArea, ScrollBar } from "../../dist/scroll-area.js";
import { Textarea } from "../../dist/textarea.js";

const css = readFileSync(new URL("../../dist/stylex.css", import.meta.url), "utf8");
function declarations(html: string, property: string) {
  const classes = [...html.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1].split(" "));
  return classes.flatMap((name) => {
    const rule = css.match(new RegExp(`\\.${name}\\s*\\{([^}]+)\\}`))?.[1] ?? "";
    const value = rule.match(new RegExp(`(?:^|;)\\s*${property}:([^;]+)`))?.[1];
    return value ? [value.trim()] : [];
  });
}

test("resting fields and outline actions share the quiet surface edge", () => {
  const border = declarations(renderToStaticMarkup(createElement(Card)), "border-color").filter(
    (value) => value.startsWith("var("),
  );
  for (const element of [
    createElement(Input),
    createElement(Textarea),
    createElement(NativeSelect),
    // oxlint-disable-next-line react/no-children-prop -- Required children type in this non-JSX Node test.
    createElement(Button, { variant: "outline", children: "Cancel" }),
  ]) {
    assert.deepEqual(
      declarations(renderToStaticMarkup(element), "border-color").filter((value) =>
        value.startsWith("var("),
      ),
      border,
    );
  }
});

test("collapsible labels are not constrained to an icon square", () => {
  const html = renderToStaticMarkup(
    createElement(
      Collapsible,
      null,
      createElement(CollapsibleTrigger, null, "Order details with a longer label"),
    ),
  );
  assert.ok(declarations(html, "width").includes("fit-content"));
  assert.ok(declarations(html, "max-width").includes("100%"));
  assert.ok(declarations(html, "overflow-wrap").includes("anywhere"));
});

test("scrollbar thumb does not flex to fill its track or force a 20px cross-axis", () => {
  const html = renderToStaticMarkup(
    createElement(ScrollArea, {
      scrollbars: "vertical",
      // oxlint-disable-next-line react/no-children-prop -- Required children type in this non-JSX Node test.
      children: createElement(ScrollBar, { keepMounted: true }),
    }),
  );
  assert.ok(declarations(html, "width").includes("8px"));
  assert.ok(declarations(html, "width").includes("100%"));
  assert.deepEqual(declarations(html, "flex-grow"), []);
  assert.deepEqual(declarations(html, "min-width"), []);
  assert.ok(declarations(html, "opacity").includes("0"));
});

test("external link icons stay small and aligned above the text baseline", () => {
  const html = renderToStaticMarkup(createElement(Link.ExternalIcon));
  assert.match(html, /aria-hidden="true"/);
  assert.match(html, /width="0.8em"/);
  assert.ok(declarations(html, "align-self").includes("flex-start"));
  assert.ok(declarations(html, "flex-shrink").includes("0"));
});
