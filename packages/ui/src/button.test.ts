import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { createElement, type ComponentProps } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { Button } from "../dist/button.js";

const css = readFileSync(new URL("../dist/stylex.css", import.meta.url), "utf8");

test("size=icon is square and composes with every visual variant", () => {
  for (const variant of ["primary", "secondary", "outline", "ghost", "destructive"] as const) {
    const props: ComponentProps<typeof Button> = {
      size: "icon",
      variant,
      "aria-label": "Add",
      children: "+",
    };
    const html = renderToStaticMarkup(createElement(Button, props));
    assert.match(html, /aria-label="Add"/);
    assert.doesNotMatch(html, /size=|variant=/);
    const classes = html.match(/class="([^"]+)"/)![1].split(" ");
    const declarations = classes.map(
      (name) => css.match(new RegExp(`\\.${name}\\s*\\{([^}]+)\\}`))?.[1] ?? "",
    );
    const width = declarations.join(";").match(/(?:^|[;\s])width:\s*([^;}]+)/)?.[1];
    const height = declarations.join(";").match(/(?:^|[;\s])height:\s*([^;}]+)/)?.[1];
    assert.ok(width, `${variant}: square width`);
    assert.equal(width, height);
  }
});
