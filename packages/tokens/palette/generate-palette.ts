import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";

import { oklchToHex } from "./palette-color.ts";

const source = new URL("../palette.oklch.json", import.meta.url);
const target = new URL("../src/color-palette.stylex.ts", import.meta.url);
const colors = JSON.parse(await readFile(source, "utf8"));
assert.ok(
  colors && typeof colors === "object" && !Array.isArray(colors) && Object.keys(colors).length > 0,
  "Palette must be a non-empty token object.",
);
const values = Object.entries(colors).map(([name, value]) => {
  assert.match(name, /^[a-zA-Z][a-zA-Z0-9]*$/, "Palette names must be identifiers.");
  return `  ${name}: "${oklchToHex(value)}",`;
});
const current = await readFile(target, "utf8");
const block = /export const colorPalette = stylex\.defineVars\(\{[\s\S]*?\n\}\);/;
assert.match(current, block, "Could not find the static StyleX palette.");
const generated = current.replace(
  block,
  `export const colorPalette = stylex.defineVars({\n${values.join("\n")}\n});`,
);
if (process.argv.includes("--check")) {
  assert.equal(current, generated, "Palette is stale. Run pnpm palette:generate.");
} else {
  await writeFile(target, generated);
}
