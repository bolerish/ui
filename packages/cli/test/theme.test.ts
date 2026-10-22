import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { add } from "../dist/add.js";
import { defaultConfig, readConfig, validateConfig, writeConfig } from "../dist/config.js";
import { init } from "../dist/init.js";
import { getThemeFiles, prepareThemeFiles } from "../dist/theme.js";

test("theme configuration validates modes and font-family lists, retaining legacy values", () => {
  assert.equal(validateConfig(defaultConfig).theme, undefined);
  const theme = {
    density: "compact",
    motion: "off",
    fonts: { body: '"Inter", sans-serif', heading: "Georgia, serif" },
  } as const;
  assert.deepEqual(validateConfig({ ...defaultConfig, theme }).theme, theme);
  for (const invalid of [
    null,
    [],
    { density: "tiny" },
    { motion: true },
    { motion: "on" },
    { fonts: null },
    { fonts: { body: "" } },
    { fonts: { heading: "x; color:red" } },
    { fonts: { body: "*/" } },
  ]) {
    assert.throws(() => validateConfig({ ...defaultConfig, theme: invalid }));
  }
});

test("initialization generates compact defaults, refreshes untouched output and preserves edits", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-theme-"));
  try {
    const theme = {
      density: "compact",
      motion: "off",
      fonts: { body: "Arial, sans-serif", heading: "Georgia, serif" },
    } as const;
    await writeConfig(directory, {
      ...defaultConfig,
      theme,
      accessibility: { respectReducedMotion: false },
    });
    await init(directory, { defaults: true, force: true, "skip-dependencies": true });
    assert.deepEqual((await readConfig(directory)).theme, theme);
    assert.equal((await readConfig(directory)).accessibility.respectReducedMotion, false);
    for (const file of getThemeFiles(theme))
      assert.equal(await readFile(join(directory, "src/styles", file.name), "utf8"), file.content);
    const stylesheet = join(directory, "src/styles/preferences.css");
    const source = await readFile(stylesheet, "utf8");
    assert.match(source, /--bolerish-font-heading: Georgia, serif/);
    assert.match(source, /:root:not\(\[data-bolerish-motion\]\)/);
    assert.match(source, /prefers-reduced-motion: reduce/);
    await add(directory, "dialog", { "skip-dependencies": true });
    assert.match(
      await readFile(join(directory, "src/components/ui/dialog.tsx"), "utf8"),
      /prefers-reduced-motion/,
    );
    await writeFile(stylesheet, source + "/* consumer edit */\n");
    await writeConfig(directory, {
      ...defaultConfig,
      theme: { density: "default", motion: "system" },
    });
    await init(directory, { defaults: true, force: true, "skip-dependencies": true });
    assert.equal(await readFile(stylesheet, "utf8"), source + "/* consumer edit */\n");
    assert.match(
      await readFile(join(directory, "src/styles/settings.stylex.ts"), "utf8"),
      /densityStyles.default/,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("length units and numeric density validate and generate without changing legacy output", () => {
  for (const unit of ["rem", "px"] as const) {
    const theme = { unit, density: 0.9 };
    assert.deepEqual(validateConfig({ ...defaultConfig, theme }).theme, theme);
    const files = getThemeFiles(theme);
    assert.match(files[0].content, /"--bolerish-density": 0.9/);
    assert.ok(files[1].content.includes(`--bolerish-unit: ${unit === "px" ? "16px" : "1rem"}`));
  }
  for (const theme of [
    { unit: "em" },
    { density: 0 },
    { density: -1 },
    { density: Infinity },
    { density: 2.1 },
  ]) {
    assert.throws(() => validateConfig({ ...defaultConfig, theme }));
  }
  assert.doesNotMatch(getThemeFiles()[1].content, /--bolerish-unit/);
});

test("runtime on stays out of JSON and untouched legacy preferences upgrade without overwriting edits", async () => {
  assert.throws(() => validateConfig({ ...defaultConfig, theme: { motion: "on" } }));
  const directory = await mkdtemp(join(tmpdir(), "bolerish-motion-upgrade-"));
  try {
    const files = getThemeFiles({ motion: "off" });
    for (const file of files) {
      const legacy = file.content
        .replace(
          'export type MotionPreference = "system" | "on" | "off";\nexport const motionDefault: Exclude<MotionPreference, "on">',
          "export const motionDefault",
        )
        .replace(
          '  :root:not([data-bolerish-motion="on"]),\n  :root:not([data-bolerish-motion="on"]) *,\n  :root:not([data-bolerish-motion="on"]) *::before,\n  :root:not([data-bolerish-motion="on"]) *::after',
          "  :root, :root *, :root *::before, :root *::after",
        );
      await writeFile(join(directory, file.name), legacy);
    }
    const plan = await prepareThemeFiles(directory, { motion: "off" });
    assert.equal(plan.length, 2);
    for (const file of files)
      assert.equal(plan.find((entry) => entry.path.endsWith(file.name))?.source, file.content);
    const css = files.find((file) => file.name === "preferences.css")!;
    await writeFile(join(directory, css.name), css.content + "/* user edit */\n");
    assert.equal(
      (await prepareThemeFiles(directory, { motion: "system" })).some((file) =>
        file.path.endsWith(css.name),
      ),
      false,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("old branding upgrades untouched generated files while retaining consumer edits", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-brand-upgrade-"));
  const theme = { density: 0.9, unit: "px", fonts: { body: "Arial" } } as const;
  try {
    const files = getThemeFiles(theme);
    for (const file of files) {
      await writeFile(
        join(directory, file.name),
        file.content.replaceAll("bolerish", "nuee").replaceAll("Bolerish", "Nuee"),
      );
    }
    const plan = await prepareThemeFiles(directory, theme);
    assert.equal(plan.length, 2);
    for (const file of files)
      assert.equal(plan.find((entry) => entry.path.endsWith(file.name))?.source, file.content);
    const css = files.find((file) => file.name === "preferences.css")!;
    const path = join(directory, css.name);
    await writeFile(path, (await readFile(path, "utf8")) + "/* user edit */\n");
    assert.equal(
      (await prepareThemeFiles(directory, theme)).some((file) => file.path === path),
      false,
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
