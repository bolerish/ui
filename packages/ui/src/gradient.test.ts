import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import stylexPlugin from "@stylexjs/unplugin/vite";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { build } from "vite";

import { gradient } from "../dist/gradient.js";

const options = { colors: ["#80414b", "#b49058"] as const };

test("gradient applies to an existing element and keeps dynamic colors", () => {
  const props = gradient.props(options);
  assert.ok(props.className?.length);
  assert.ok(Object.values(props.style!).includes(options.colors[0]));
  assert.ok(Object.values(props.style!).includes(options.colors[1]));
  const html = renderToStaticMarkup(createElement("body", props, "Content"));
  assert.match(html, /^<body /);
  assert.match(html, />Content<\/body>$/);
  assert.doesNotMatch(html, /<div/);
});

test("gradient rejects missing, empty or incorrectly sized color input", () => {
  for (const colors of [
    undefined,
    null,
    [],
    ["red"],
    ["red", "blue", "green"],
    ["", "blue"],
    [" ", "blue"],
    [42, "blue"],
  ]) {
    assert.throws(() => Reflect.apply(gradient.props, undefined, [{ colors }]), TypeError);
  }
});

test("a real StyleX consumer preserves compiled classes and both sets of dynamic variables", async () => {
  const directory = await mkdtemp(fileURLToPath(new URL("../.gradient-app-", import.meta.url)));
  try {
    await mkdir(join(directory, "dist"));
    await writeFile(join(directory, "package.json"), '{"type":"module"}');
    const entry = join(directory, "entry.ts");
    await writeFile(
      entry,
      `
      import * as stylex from "@stylexjs/stylex";
      import { gradient } from ${JSON.stringify(fileURLToPath(new URL("../dist/gradient.js", import.meta.url)))};
      const styles = stylex.create({
        layout: { display: "grid", gap: 12, padding: 24, borderRadius: 16 },
        override: { backgroundColor: "#123456" },
        width: (value: number) => ({ maxWidth: value }),
      });
      export const base = stylex.props(styles.layout, styles.width(480));
      export const plain = gradient.props({ colors: ["#80414b", "#b49058"] });
      export const merged = gradient.props({ colors: ["#80414b", "#b49058"] }, styles.layout, styles.width(480));
      export const nativeOverride = stylex.props(styles.override);
      export const overridden = gradient.props({ colors: ["#80414b", "#b49058"] }, styles.override);
      export const nested = gradient.props({ colors: ["#80414b", "#b49058"] }, [styles.layout, false, styles.width(480)]);
      export const changed = gradient.props({ colors: ["#294c79", "#688e91"] }, styles.layout, styles.width(480));
    `,
    );
    await build({
      configFile: false,
      root: directory,
      logLevel: "silent",
      plugins: [stylexPlugin({ useCSSLayers: true })],
      build: { ssr: entry, outDir: "dist", minify: false },
    });
    const { base, merged, changed, plain, nativeOverride, overridden, nested } = await import(
      pathToFileURL(join(directory, "dist/entry.js")).href
    );
    assert.deepEqual(nested, merged);
    for (const name of nativeOverride.className.split(" "))
      assert.ok(overridden.className.split(" ").includes(name));
    assert.ok(
      plain.className
        .split(" ")
        .some((name: string) => !overridden.className.split(" ").includes(name)),
      "StyleX must remove the earlier background-color class",
    );
    assert.ok(base.className?.length > 0);
    for (const name of base.className.split(" "))
      assert.ok(merged.className.split(" ").includes(name));
    assert.ok(
      Object.keys(base.style).length > 0,
      "consumer must exercise real dynamic StyleX variables",
    );
    for (const [key, value] of Object.entries(base.style)) assert.equal(merged.style[key], value);
    assert.ok(Object.values(merged.style).includes("#80414b"));
    assert.ok(Object.values(changed.style).includes("#294c79"));
    assert.equal(changed.className, merged.className);
    for (const [key, value] of Object.entries(base.style)) assert.equal(changed.style[key], value);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
