import assert from "node:assert/strict";
import { access, chmod, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { add } from "../dist/add.js";
import { parseArguments } from "../dist/arguments.js";
import { defaultConfig, resolveConfigAlias, validateConfig, writeConfig } from "../dist/config.js";
import { doctor } from "../dist/doctor.js";
import { run } from "../dist/index.js";
import { init } from "../dist/init.js";
import { resolveComponent } from "../dist/registry.js";

async function fixture(action: (directory: string) => Promise<void>) {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-regression-"));
  try {
    await action(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
function remote(item: unknown) {
  return `data:application/json,${encodeURIComponent(JSON.stringify(item))}`;
}

for (const value of [null, { ...defaultConfig, accessibility: null }]) {
  test(`config rejects ${JSON.stringify(value)} with an actionable error`, () => {
    assert.throws(
      () => validateConfig(value),
      (error: unknown) =>
        error instanceof Error && !(error instanceof TypeError) && /Configure/.test(error.message),
    );
  });
}
test("boolean options preserve following component names", () => {
  assert.deepEqual(parseArguments(["add", "--dry-run", "button"]).positionals, ["button"]);
  assert.equal(parseArguments(["add", "--dry-run", "button"]).options["dry-run"], true);
});
test("string options require a value", () => {
  assert.throws(() => parseArguments(["init", "--ui"]));
});
test("CLI reports option errors without rejecting run", async () => {
  assert.equal(await run(["init", "--ui"]), false);
});

test("Vite initialization changes only the exported plugins array", () =>
  fixture(async (directory) => {
    const source =
      "const babelOptions = { plugins: ['babel-plugin-react-compiler'] };\nexport default { plugins: [react({babel: babelOptions})] };";
    await writeFile(join(directory, "vite.config.ts"), source);
    await init(directory, { vite: true, defaults: true, "skip-dependencies": true }, false);
    const result = await readFile(join(directory, "vite.config.ts"), "utf8");
    assert.ok(
      result.includes("const babelOptions = { plugins: ['babel-plugin-react-compiler'] };"),
    );
    assert.match(result, /export default \{ plugins: \[\w+\.vite\(/);
  }));
test("Vite initialization preserves direct compiler imports", () =>
  fixture(async (directory) => {
    const source =
      'import sx from "@stylexjs/unplugin/vite"; export default { plugins: [sx({useCSSLayers: true})] };';
    await writeFile(join(directory, "vite.config.ts"), source);
    await init(directory, { vite: true, defaults: true, "skip-dependencies": true }, false);
    assert.equal(await readFile(join(directory, "vite.config.ts"), "utf8"), source);
  }));
test("unsupported Vite functions leave all foundation files absent", () =>
  fixture(async (directory) => {
    const source = "export default () => ({ plugins: [] });";
    await writeFile(join(directory, "vite.config.ts"), source);
    await assert.rejects(
      init(directory, { vite: true, defaults: true, "skip-dependencies": true }),
    );
    assert.equal(await readFile(join(directory, "vite.config.ts"), "utf8"), source);
    await assert.rejects(access(join(directory, "src/styles")));
  }));
for (const [name, paths, alias, expected] of [
  ["explicit @ mapping", { "@/*": ["./app/*"] }, "@/ui", "app/ui"],
  [
    "longest prefix",
    { "~/*": ["./src/*"], "~/ui/*": ["./custom/*"] },
    "~/ui/button",
    "custom/button",
  ],
] as const) {
  test(`aliases respect ${name}`, () =>
    fixture(async (directory) => {
      await writeFile(
        join(directory, "tsconfig.json"),
        JSON.stringify({ compilerOptions: { paths } }),
      );
      assert.equal(await resolveConfigAlias(directory, alias, "ui"), join(directory, expected));
    }));
}
test("inherited aliases retain the parent directory as their base", () =>
  fixture(async (directory) => {
    await mkdir(join(directory, "config"));
    await writeFile(
      join(directory, "config/base.json"),
      '{"compilerOptions":{"paths":{"~/*":["../app/*"]}}}',
    );
    await writeFile(join(directory, "tsconfig.json"), '{"extends":"./config/base.json"}');
    assert.equal(await resolveConfigAlias(directory, "~/ui", "ui"), join(directory, "app/ui"));
  }));
test("malformed tsconfig is not silently ignored", () =>
  fixture(async (directory) => {
    await writeFile(join(directory, "tsconfig.json"), "{");
    await assert.rejects(resolveConfigAlias(directory, "@/ui", "ui"));
  }));
for (const [key, value] of [
  ["dependencies", [123]],
  ["registryDependencies", [null]],
  ["name", 123],
  ["primaryExport", {}],
] as const) {
  test(`remote registry rejects invalid ${key}`, async () => {
    await assert.rejects(
      resolveComponent(remote({ files: [], dependencies: [], [key]: value })),
      new RegExp(`Invalid registry item: ${key}`),
    );
  });
}
test("invalid component names cannot initialize a project", () =>
  fixture(async (directory) => {
    await assert.rejects(add(directory, "not-a-real-component", { "skip-dependencies": true }));
    await assert.rejects(access(join(directory, ".bolerish.json")));
    await assert.rejects(access(join(directory, "src/styles")));
  }));
test("invalid package manifest cannot create component files", () =>
  fixture(async (directory) => {
    await writeConfig(directory, defaultConfig);
    await writeFile(join(directory, "package.json"), "{");
    await assert.rejects(add(directory, "card", { "skip-dependencies": true }));
    await assert.rejects(access(join(directory, "src/components/ui/card.tsx")));
  }));
test(
  "unreadable existing tokens remain intact and block foundation writes",
  { skip: process.getuid?.() === 0 },
  () =>
    fixture(async (directory) => {
      await mkdir(join(directory, "src/styles/tokens"), { recursive: true });
      const path = join(directory, "src/styles/tokens/semantic.stylex.ts");
      await writeFile(path, "/* user data */");
      await chmod(path, 0o200);
      try {
        await assert.rejects(init(directory, { defaults: true, "skip-dependencies": true }));
      } finally {
        await chmod(path, 0o600);
      }
      assert.equal(await readFile(path, "utf8"), "/* user data */");
      await assert.rejects(access(join(directory, "src/styles/tokens/color-palette.stylex.ts")));
    }),
);
test("legacy configuration preserves remote motion rules and sibling styles", () =>
  fixture(async (directory) => {
    await writeConfig(directory, {
      ...defaultConfig,
      accessibility: { respectReducedMotion: false },
    });
    const source = `const styles = stylex.create({root: {color: 'red', "@media (prefers-reduced-motion: reduce)": {content: '}'}, opacity: 1}});`;
    await add(
      directory,
      remote({ files: [{ path: "sample.tsx", content: source }], dependencies: [] }),
      { "skip-dependencies": true },
    );
    const result = await readFile(join(directory, "src/components/ui/sample.tsx"), "utf8");
    assert.match(result, /const styles = stylex\.create/);
    assert.match(result, /color: 'red'/);
    assert.match(result, /opacity: 1/);
    assert.match(result, /prefers-reduced-motion/);
  }));
test("doctor failure becomes a failing command result", () =>
  fixture(async (directory) => {
    assert.equal(await run(["doctor", "--cwd", directory]), false);
  }));
test("doctor recognizes the direct Vite compiler entry", () =>
  fixture(async (directory) => {
    await init(directory, { defaults: true, "skip-dependencies": true }, false);
    await writeFile(
      join(directory, "package.json"),
      JSON.stringify({ dependencies: { "@stylexjs/stylex": "*", "@stylexjs/unplugin": "*" } }),
    );
    await writeFile(join(directory, "src/main.tsx"), 'import "./index.css";');
    await writeFile(
      join(directory, "vite.config.ts"),
      'import compiler from "@stylexjs/unplugin/vite"; export default {plugins:[compiler()]};',
    );
    assert.equal(await doctor(directory), true);
  }));
