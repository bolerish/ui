import assert from "node:assert/strict";
import test from "node:test";

import * as tsParser from "@typescript-eslint/parser";
import { Linter } from "eslint";

import plugin from "../dist/index.js";

const prefix = 'import * as stylex from "@stylexjs/stylex";';
function lint(code: string, rules: Linter.RulesRecord = plugin.configs.recommended.rules) {
  const config: Linter.Config = {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "bolerish-ui": plugin },
    rules,
  };
  return new Linter().verify(code, config);
}

test("three independent rules report raw colors, typography and spacing", () => {
  const messages = lint(`${prefix} const styles = stylex.create({ panel: {
    color: "#123456", fontSize: 13, gap: "13px", width: "100%"
  } });`);
  assert.deepEqual(
    messages.map((message) => message.ruleId),
    ["bolerish-ui/color-tokens", "bolerish-ui/typography-tokens", "bolerish-ui/spacing-tokens"],
  );
  assert.ok(messages.every((message) => message.severity === 1 && !message.fix));
  assert.match(messages[0].message, /colorVars/);
  assert.match(messages[1].message, /typo/);
  assert.match(messages[2].message, /spacingVars/);
});

test("inline styles and StyleX conditions retain their property context", () => {
  const messages = lint(`${prefix}
    const styles = stylex.create({ panel: { color: { default: "red", ":hover": "blue" },
      "@media (min-width: 600px)": { padding: -3 },
      gap: condition ? 8 : spacingVars.space2,
      margin: [0, "12px"]
    } });
    const element = <div style={{ fontWeight: 600, rowGap: 9 }} />;
  `);
  assert.equal(messages.length, 7);
  assert.ok(messages.every((message) => message.ruleId?.startsWith("bolerish-ui/")));
});

test("tokens, CSS variables, zero spacing, CSS keywords and dynamic values pass", () => {
  assert.deepEqual(
    lint(`${prefix} const styles = stylex.create({ panel: {
    color: colorVars.fgPrimary, backgroundColor: "transparent", borderColor: "currentColor",
    fontSize: typo.fontSizeMd, fontWeight: "inherit", lineHeight: "normal",
    gap: spacingVars.space4, margin: "auto", padding: 0, rowGap: "0px",
    paddingInline: "var(--custom-space)", columnGap: customGap, color: "CanvasText"
  }, dynamic: (gap) => ({ gap }) });`),
    [],
  );
});

test("data objects, unrelated create calls and shadowed imports are ignored", () => {
  assert.deepEqual(
    lint(`${prefix}
    const payload = { color: "red", fontSize: 17, gap: 9 };
    other.create({ panel: { color: "blue" } });
    function local(stylex) { return stylex.create({ panel: { color: "red" } }); }
    const element = <Widget data={{ color: "red" }} />;
  `),
    [],
  );
});

test("aliased namespace and named create imports work", () => {
  assert.equal(
    lint('import * as sx from "@stylexjs/stylex"; sx.create({ x: { gap: 8 } });').length,
    1,
  );
  assert.equal(
    lint('import { create as make } from "@stylexjs/stylex"; make({ x: { gap: 8 } });').length,
    1,
  );
});

test("group presets, individual off and line exceptions use standard lint configuration", () => {
  const code = `${prefix} stylex.create({ x: { gap: 9, color: "red" } });`;
  assert.equal(lint(code, plugin.configs.spacing.rules).length, 1);
  assert.equal(
    lint(code, { ...plugin.configs.recommended.rules, "bolerish-ui/spacing-tokens": "off" }).length,
    1,
  );
  assert.equal(
    lint(
      `${prefix}\n// eslint-disable-next-line bolerish-ui/spacing-tokens -- deliberate optical offset\nstylex.create({ x: { gap: 9 } });`,
    ).length,
    0,
  );
});

test("computed property keys, templates and unary values are covered", () => {
  assert.equal(
    lint(prefix + ' stylex.create({ x: { ["fontSize"]: `13px`, padding: +8 } });').length,
    2,
  );
});

test("objects passed to unrelated calls inside a style expression are not style declarations", () => {
  assert.deepEqual(lint(prefix + ' stylex.create({ x: lookup({ color: "red" }) });'), []);
});

test("guidance connects each CSS property with the matching token family", () => {
  const messages = lint(`${prefix} stylex.create({ x: {
    color: "red", backgroundColor: "red", borderColor: "red",
    fontSize: 13, fontWeight: 600, lineHeight: "24px", fontFamily: "Arial", gap: 13
  } });`);
  for (const [index, property, tokens] of [
    [0, "color", "colorVars.fg*"],
    [1, "backgroundColor", "colorVars.bg*"],
    [2, "borderColor", "colorVars.stroke*"],
    [3, "fontSize", "typo.fontSize*"],
    [4, "fontWeight", "typo.fontWeight*"],
    [5, "lineHeight", "typo.lineHeight*"],
    [6, "fontFamily", "typo.fontFamily*"],
    [7, "gap", "spacingRoleVars or spacingVars"],
  ] as const) {
    assert.ok(messages[index].message.startsWith(`When setting ${property}, use ${tokens}`));
  }
});

test("ESLint supports next-line, same-line, block and file exceptions without disabling other rules", () => {
  const declaration = 'stylex.create({ x: { gap: 9, color: "red" } });';
  for (const code of [
    `${prefix}\n// eslint-disable-next-line bolerish-ui/spacing-tokens -- deliberate spacing\n${declaration}`,
    `${prefix}\n${declaration} // eslint-disable-line bolerish-ui/spacing-tokens -- deliberate spacing`,
    `${prefix}\n/* eslint-disable bolerish-ui/spacing-tokens -- deliberate spacing */\n${declaration}\n/* eslint-enable bolerish-ui/spacing-tokens */`,
    `/* eslint-disable bolerish-ui/spacing-tokens -- deliberate spacing */\n${prefix}\n${declaration}`,
  ]) {
    assert.deepEqual(
      lint(code).map((message) => message.ruleId),
      ["bolerish-ui/color-tokens"],
    );
  }
  const resumed = lint(
    `${prefix}\n/* eslint-disable bolerish-ui/spacing-tokens -- deliberate spacing */\nstylex.create({ x: { gap: 9 } });\n/* eslint-enable bolerish-ui/spacing-tokens */\nstylex.create({ x: { gap: 9 } });`,
  );
  assert.deepEqual(
    resumed.map((message) => message.ruleId),
    ["bolerish-ui/spacing-tokens"],
  );
});

test("dynamic style functions ignore local data but check the returned styles", () => {
  const messages = lint(`${prefix} stylex.create({ x: (gap) => {
    const data = { color: "red", gap: 9 };
    function readData() { return { color: "blue" }; }
    class Cache { entry = { color: "purple", gap: 11 }; }
    data.extra = { color: "green" };
    return { color: "red", gap };
  } });`);
  assert.deepEqual(
    messages.map((message) => message.ruleId),
    ["bolerish-ui/color-tokens"],
  );
});

test("ESLint parses TSX assertions and ignores TypeScript import-equals safely", () => {
  const config: Linter.Config = {
    files: ["**/*.tsx"],
    languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { "bolerish-ui": plugin },
    rules: plugin.configs.recommended.rules,
  };
  const messages = new Linter().verify(
    `
    import * as sx from "@stylexjs/stylex";
    const styles = sx.create({ x: { padding: 8 as number, fontSize: (13 satisfies number) } });
    const view = <div style={{ gap: 9 as number }} />;
    import legacy = require("@stylexjs/stylex");
    legacy.create({ x: { color: "red" } });
  `,
    config,
    { filename: "screen.tsx" },
  );
  assert.deepEqual(
    messages.map((message) => message.ruleId),
    ["bolerish-ui/spacing-tokens", "bolerish-ui/typography-tokens", "bolerish-ui/spacing-tokens"],
  );
});

test("create from a different library does not trigger StyleX rules", () => {
  assert.deepEqual(
    lint(`import * as other from "@example/styles";
      import { create as make } from "@example/styles";
      other.create({ panel: { color: "red", fontSize: 13, gap: 9 } });
      make({ panel: { color: "red", fontSize: 13, gap: 9 } });
    `),
    [],
  );
});

test("raw values on either conditional branch are diagnosed at their actual location", () => {
  const messages = lint(`${prefix}
const styles = stylex.create({
  panel: {
    gap: compact ? spacingVars.space2 : 13,
    color: active ? "red" : colorVars.fgPrimary,
    fontSize: compact ? 13 : 17,
  },
});`);
  assert.deepEqual(
    messages.map(({ ruleId, line, column, endColumn }) => ({ ruleId, line, column, endColumn })),
    [
      { ruleId: "bolerish-ui/spacing-tokens", line: 4, column: 41, endColumn: 43 },
      { ruleId: "bolerish-ui/color-tokens", line: 5, column: 21, endColumn: 26 },
      { ruleId: "bolerish-ui/typography-tokens", line: 6, column: 25, endColumn: 27 },
      { ruleId: "bolerish-ui/typography-tokens", line: 6, column: 30, endColumn: 32 },
    ],
  );
});

test("component-relative typography and icon spacing do not need suppressions", () => {
  assert.deepEqual(
    lint(`${prefix} stylex.create({
    icon: { marginBlockStart: "0.05em", gap: "0.1875em" },
    prose: { fontSize: "0.9em", lineHeight: 1.8 },
    joined: { marginInlineStart: \`calc(\${sizeVars.stroke} * -1)\` }
  }); const inline = <span style={{ fontSize: "0.9em", lineHeight: "1.8" }} />;`),
    [],
  );
});

test("relative allowances retain token checks for fixed sizes and unrelated properties", () => {
  for (const [property, value] of [
    ["fontSize", "0.9rem"],
    ["lineHeight", "24px"],
    ["gap", 13],
    ["marginInlineStart", -1],
    ["padding", "0.2em"],
    ["color", "#FFFFFF"],
    ["lineHeight", 0],
    ["fontSize", "-1em"],
    ["gap", "-1em"],
  ]) {
    const messages = lint(
      `${prefix} stylex.create({ x: { ${property}: ${JSON.stringify(value)} } });`,
    );
    assert.equal(messages.length, 1, `${property}: ${value}`);
    assert.ok(messages[0].message.startsWith(`When setting ${property}, use `));
  }
});

test("relative spacing shorthands accept each supported component within CSS cardinality", () => {
  for (const [property, value] of [
    ["margin", "0 0.05em"],
    ["margin", "-0.1em auto 0 0.05em"],
    ["marginInline", "0.05em 0.1em"],
    ["gap", "0 0.2em"],
  ])
    assert.deepEqual(
      lint(`${prefix} stylex.create({ x: { ${property}: ${JSON.stringify(value)} } });`),
      [],
      `${property}: ${value}`,
    );
  for (const [property, value] of [
    ["margin", "0 1px"],
    ["margin", "0 0 0 0 0.1em"],
    ["marginInline", "0 0.1em 0"],
    ["marginTop", "0 0.1em"],
    ["gap", "0 -0.1em"],
    ["gap", "0.1em 0.2em 0.3em"],
    ["fontSize", "0.9em 1em"],
  ])
    assert.equal(
      lint(`${prefix} stylex.create({ x: { ${property}: ${JSON.stringify(value)} } });`).length,
      1,
      `${property}: ${value}`,
    );
});
