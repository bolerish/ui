import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ToggleGroup, ToggleGroupItem } from "../dist/toggle-group.js";
import { Toggle } from "../dist/toggle.js";

const css = readFileSync(new URL("../dist/stylex.css", import.meta.url), "utf8");

// Inspect compiled declarations, so removing a state style fails even if ARIA is unchanged.
function background(html: string) {
  const classes = html.match(/<button[^>]*class="([^"]+)"/)?.[1].split(" ") ?? [];
  const declarations = classes.flatMap((name) => {
    const match = css.match(new RegExp(`\\.${name}\\s*\\{\\s*background-color:\\s*([^;]+);`));
    return match ? [match[1]] : [];
  });
  assert.equal(declarations.length, 1);
  return declarations[0];
}

test("disabled toggles retain the selected surface in every variant", () => {
  for (const variant of ["default", "outline", "soft"] as const) {
    for (const grouped of [false, true]) {
      function render(pressed: boolean, disabled: boolean) {
        if (!grouped) {
          return renderToStaticMarkup(
            createElement(Toggle, { pressed, disabled, variant }, "Choice"),
          );
        }
        return renderToStaticMarkup(
          createElement(ToggleGroup, {
            value: pressed ? ["choice"] : [],
            variant,
            // oxlint-disable-next-line react/no-children-prop -- Required children type in this non-JSX Node test.
            children: createElement(ToggleGroupItem, { value: "choice", disabled }, "Choice"),
          }),
        );
      }
      const selected = render(true, false);
      const unavailable = render(true, true);
      assert.match(unavailable, /aria-pressed="true"/);
      assert.match(unavailable, /disabled=""/);
      assert.equal(background(selected), background(unavailable));
      assert.notEqual(background(unavailable), background(render(false, true)));
    }
  }
});

test("outlined toggle groups do not clip external keyboard focus rings", () => {
  const html = renderToStaticMarkup(
    createElement(ToggleGroup, {
      variant: "outline",
      // oxlint-disable-next-line react/no-children-prop -- Required children type in this non-JSX Node test.
      children: createElement(ToggleGroupItem, { value: "choice" }, "Choice"),
    }),
  );
  const classes = html.match(/class="([^"]+)"/)?.[1].split(" ") ?? [];
  assert.ok(classes.length > 0);
  for (const name of classes) {
    const rule = css.match(new RegExp(`\\.${name}\\s*\\{([^}]+)\\}`))?.[1] ?? "";
    assert.doesNotMatch(rule, /overflow(?:-[xy])?:\s*(hidden|clip)/);
  }
});

test("only outline toggles add a selected inset border", () => {
  for (const variant of ["default", "outline", "soft"] as const) {
    for (const grouped of [false, true]) {
      const element = createElement(Toggle, { pressed: true, variant }, "Choice");
      const html = renderToStaticMarkup(
        grouped
          ? createElement(ToggleGroup, {
              value: ["choice"],
              variant,
              // oxlint-disable-next-line react/no-children-prop -- Required children type in this non-JSX Node test.
              children: createElement(ToggleGroupItem, { value: "choice" }, "Choice"),
            })
          : element,
      );
      const classes = html.match(/<button[^>]*class="([^"]+)"/)?.[1].split(" ") ?? [];
      const inset = classes.some((name) => {
        const rule = css.match(new RegExp(`\\.${name}\\s*\\{([^}]+)\\}`))?.[1] ?? "";
        return /box-shadow:\s*inset/.test(rule);
      });
      assert.equal(inset, variant === "outline", `${grouped ? "grouped" : "single"}/${variant}`);
    }
  }
});
