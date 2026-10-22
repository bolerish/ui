import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { defaultConfig, validateConfig, type BolerishTheme } from "./config.js";

const marker = "// Bolerish generated theme: ";
const cssMarker = "/* Bolerish generated theme: ";

export function getThemeFiles(theme: BolerishTheme = {}) {
  const defaults = {
    density: theme.density ?? "default",
    motion: theme.motion ?? "system",
    fonts: theme.fonts ?? {},
    ...(theme.unit !== undefined ? { unit: theme.unit } : {}),
  };
  const metadata = JSON.stringify(defaults);
  const declarations: string[] = [];
  if (theme.unit) declarations.push(`  --bolerish-unit: ${theme.unit === "px" ? "16px" : "1rem"};`);
  for (const role of ["body", "heading"] as const) {
    const font = defaults.fonts[role];
    if (font) declarations.push(`  --bolerish-font-${role}: ${font};`);
  }
  const offSelector =
    defaults.motion === "off"
      ? ':root:not([data-bolerish-motion]), :root[data-bolerish-motion="off"]'
      : ':root[data-bolerish-motion="off"]';
  const suppress = `  animation-duration: 0s !important;
  animation-iteration-count: 1 !important;
  transition-duration: 0s !important;
  scroll-behavior: auto !important;`;
  return [
    {
      name: "settings.stylex.ts",
      content: `${marker}${metadata}
${
  typeof defaults.density === "number"
    ? `import * as stylex from "@stylexjs/stylex";

const density = stylex.create({ root: { "--bolerish-density": ${defaults.density} } });
export const themeStyles = [density.root];`
    : `import { densityStyles } from "./tokens/density.stylex";

export const themeStyles = [densityStyles.${defaults.density}];`
}
export type MotionPreference = "system" | "on" | "off";
export const motionDefault: Exclude<MotionPreference, "on"> = ${JSON.stringify(defaults.motion)};
`,
    },
    {
      name: "preferences.css",
      content: `${cssMarker}${metadata} */
${declarations.length ? `:root {\n${declarations.join("\n")}\n}\n` : ""}
:is(${offSelector}),
:is(${offSelector}) *,
:is(${offSelector}) *::before,
:is(${offSelector}) *::after {
${suppress}
}

@media (prefers-reduced-motion: reduce) {
  :root:not([data-bolerish-motion="on"]),
  :root:not([data-bolerish-motion="on"]) *,
  :root:not([data-bolerish-motion="on"]) *::before,
  :root:not([data-bolerish-motion="on"]) *::after {
${suppress}
  }
}
`,
    },
  ];
}

/** Refresh untouched generated files; preserve any consumer edits even with --force. */
export async function prepareThemeFiles(directory: string, theme: BolerishTheme | undefined) {
  const files: { path: string; source: string; flag: "w" | "wx" }[] = [];
  for (const file of getThemeFiles(theme)) {
    const path = join(directory, file.name);
    try {
      const current = await readFile(path, "utf8");
      const firstLine = current.split("\n")[0];
      const prefix = [
        file.name.endsWith(".css") ? cssMarker : marker,
        file.name.endsWith(".css") ? "/* Nuee generated theme: " : "// Nuee generated theme: ",
      ].find((value) => firstLine.startsWith(value));
      if (!prefix) continue;
      const metadata = firstLine.slice(prefix.length).replace(/ \*\/$/, "");
      let previous: BolerishTheme | undefined;
      try {
        previous = validateConfig({ ...defaultConfig, theme: JSON.parse(metadata) }).theme;
      } catch {
        continue;
      }
      const original = getThemeFiles(previous).find((entry) => entry.name === file.name)!;
      const legacy = original.content
        .replace(
          'export type MotionPreference = "system" | "on" | "off";\nexport const motionDefault: Exclude<MotionPreference, "on">',
          "export const motionDefault",
        )
        .replace(
          '  :root:not([data-bolerish-motion="on"]),\n  :root:not([data-bolerish-motion="on"]) *,\n  :root:not([data-bolerish-motion="on"]) *::before,\n  :root:not([data-bolerish-motion="on"]) *::after',
          "  :root, :root *, :root *::before, :root *::after",
        );
      const normalized = current
        .replace(prefix, file.name.endsWith(".css") ? cssMarker : marker)
        .replaceAll("--nuee-", "--bolerish-")
        .replaceAll("data-nuee-motion", "data-bolerish-motion")
        .replace('from "./density.stylex"', 'from "./tokens/density.stylex"');
      if ((normalized === original.content || normalized === legacy) && current !== file.content) {
        files.push({ path, source: file.content, flag: "w" });
      }
    } catch (error) {
      if (typeof error !== "object" || !error || !("code" in error) || error.code !== "ENOENT")
        throw error;
      files.push({ path, source: file.content, flag: "wx" });
    }
  }
  return files;
}
