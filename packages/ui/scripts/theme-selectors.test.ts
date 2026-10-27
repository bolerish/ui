import assert from "node:assert/strict";
import test from "node:test";

import postcss from "postcss";

import { addThemeSelectors } from "./theme-selectors.ts";

test("attribute themes preserve conditional declarations and leave descendants alone", () => {
  const css = addThemeSelectors(
    ".light.light,.light.light:root{--tone:white}.dark.dark{--tone:black}" +
      "@supports(color:lab(0% 0 0)){.dark.dark:root{--tone:lab(0% 0 0)}}" +
      ".dark .item{color:red}",
    { light: "light", dark: "dark" },
  );
  const root = postcss.parse(css);
  const declarations: Array<{ value: string; conditional: boolean }> = [];
  root.walkRules((rule) => {
    if (rule.selectors.includes('[data-bolerish-theme="dark"]')) {
      declarations.push({
        value: rule.nodes[0].type === "decl" ? rule.nodes[0].value : "",
        conditional: rule.parent?.type === "atrule" && rule.parent.name === "supports",
      });
    }
    if (rule.selector.includes(".item")) assert.equal(rule.selector, ".dark .item");
  });
  assert.deepEqual(declarations, [
    { value: "black", conditional: false },
    { value: "lab(0% 0 0)", conditional: true },
  ]);
});

test("missing compiled theme classes fail the build rather than omit a mode", () => {
  assert.throws(
    () => addThemeSelectors(".light{color:white}", { light: "light", dark: "dark" }),
    /Missing compiled dark theme rules/,
  );
  assert.throws(
    () => addThemeSelectors(".dark{color:black}", { light: "", dark: "dark" }),
    /Missing compiled light theme rules/,
  );
});

test("only variable definitions enter the StyleX variable layer", () => {
  const root = postcss.parse(
    addThemeSelectors(".light{--tone:white}.dark{--tone:black}.control{color:red}", {
      light: "light",
      dark: "dark",
    }),
  );
  const layers: string[] = [];
  root.walkDecls((decl) => {
    const parent = decl.parent?.parent;
    if (decl.prop === "--tone") {
      assert.equal(parent?.type, "atrule");
      if (parent?.type === "atrule") layers.push(parent.params);
    } else assert.equal(parent?.type, "root");
  });
  assert.deepEqual(layers, ["priority1", "priority1"]);
});
