import assert from "node:assert/strict";
import test from "node:test";

import { checkDeclarations } from "../dist/declarations.js";

test("parsed declarations diagnose raw tokens with original locations and CSS/JS property names", () => {
  const result = checkDeclarations([
    { property: "background-color", value: "#fff", line: 2, column: 3 },
    { property: "marginInlineStart", value: "16px", line: 3, column: 5 },
    { property: "FONT-SIZE", value: "14px !important", line: 4, column: 3 },
  ]);
  assert.deepEqual(
    result.diagnostics.map(({ ruleId, line, column }) => [ruleId, line, column]),
    [
      ["bolerish-ui/color-tokens", 2, 3],
      ["bolerish-ui/spacing-tokens", 3, 5],
      ["bolerish-ui/typography-tokens", 4, 3],
    ],
  );
  assert.equal(result.diagnostics[0].property, "background-color");
  assert.equal(result.diagnostics[2].value, "14px !important");
  assert.equal(result.diagnostics[0].tokens, "colorVars.bg*");
  assert.equal(result.coverage.complete, true);
});

test("allowed static components remain distinct from unresolved or unsupported values", () => {
  const declarations = [
    ["padding", "0px 0rem"],
    ["margin", "auto 0px -0.2em"],
    ["gap", "0px .2em"],
    ["border-color", "transparent currentColor"],
    ["line-height", "1.75"],
    ["color", "CanvasText"],
    ["font-size", "1.2em"],
  ].map(([property, value]) => ({ property, value, line: 1, column: 1 }));
  assert.deepEqual(checkDeclarations(declarations).diagnostics, []);
  assert.equal(checkDeclarations(declarations).coverage.checked, 7);
  assert.equal(checkDeclarations(declarations).coverage.complete, true);
  for (const [property, value] of [
    ["padding", "var(--a, 0) 16px var(--b)"],
    ["padding", "var(--a) var(--b)"],
    ["color", "var(--token, #123456)"],
    ["margin", "calc(12px + 4px)"],
    ["padding", "0/**/16px"],
    ["font-family", '"Example Font"'],
    ["border-bottom", "1px solid #fff"],
    ["outline", "2px solid currentColor"],
    ["text-decoration", "underline red"],
    ["--docs-background", "#fff"],
    ["-webkit-text-fill-color", "red"],
  ]) {
    const result = checkDeclarations([{ property, value, line: 1, column: 1 }]);
    assert.equal(result.coverage.complete, false, `${property}: ${value}`);
    assert.equal(result.coverage.unreviewed.length, 1);
    assert.deepEqual(result.diagnostics, []);
  }
  for (const [property, value] of [
    ["padding", "1em"],
    ["gap", "0px 16px"],
    ["color", "red blue"],
    ["font-size", "0px"],
  ])
    assert.equal(
      checkDeclarations([{ property, value, line: 1, column: 1 }]).diagnostics.length,
      1,
    );
  assert.equal(checkDeclarations([]).coverage.complete, false);
  assert.equal(
    checkDeclarations([{ property: "width", value: "736px", line: 1, column: 1 }]).coverage
      .complete,
    false,
  );
});
