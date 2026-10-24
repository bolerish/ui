import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import { SourceTextModule, SyntheticModule } from "node:vm";

const stylex = new SyntheticModule(["defineVars", "createTheme"], function () {
  this.setExport("defineVars", (values: Record<string, unknown>) => values);
  this.setExport(
    "createTheme",
    (_base: Record<string, unknown>, values: Record<string, unknown>) => values,
  );
});
const modules = new Map<string, SourceTextModule>();
async function load(url: URL): Promise<SourceTextModule> {
  if (modules.has(url.href)) return modules.get(url.href)!;
  const source = await readFile(url, "utf8");
  const module = new SourceTextModule(stripTypeScriptTypes(source), { identifier: url.href });
  modules.set(url.href, module);
  await module.link((specifier, parent) =>
    specifier === "@stylexjs/stylex" ? stylex : load(new URL(`${specifier}.ts`, parent.identifier)),
  );
  return module;
}
const themeModule = await load(new URL("./themes.stylex.ts", import.meta.url));
await themeModule.evaluate();
export const themes = themeModule.namespace as Record<string, Record<string, string>>;
export const defaults = (
  modules.get(new URL("./semantic.stylex.ts", import.meta.url).href)!.namespace as {
    colorVars: Record<string, string>;
  }
).colorVars;

export function rgba(value: string) {
  assert.match(value, /^#[0-9A-F]{6}([0-9A-F]{2})?$/i);
  const hex = value.slice(1);
  return [0, 2, 4]
    .map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .concat(hex.length === 8 ? parseInt(hex.slice(6), 16) / 255 : 1);
}
export function composite(foreground: number[], background: number[]) {
  return foreground
    .slice(0, 3)
    .map((channel, index) => channel * foreground[3] + background[index] * (1 - foreground[3]))
    .concat(1);
}
function luminance(color: number[]) {
  const linear = color
    .slice(0, 3)
    .map((channel) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4));
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}
export function contrast(foreground: number[], background: number[]) {
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
assert.equal(contrast(rgba("#ffffff"), rgba("#000000")), 21);
