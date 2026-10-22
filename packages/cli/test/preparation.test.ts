import assert from "node:assert/strict";
import { execFile as execute } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { isRegistryItem } from "@bolerish/registry";

import { add } from "../dist/add.js";
import { configureVite, inspectViteConfig, removeReducedMotionStyles } from "../dist/source.js";

const execFile = promisify(execute);

test("dry-run validates the same Vite initialization plan as add", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-plan-"));
  try {
    for (const dryRun of [true, false]) {
      await assert.rejects(
        add(directory, "card", {
          vite: true,
          "dry-run": dryRun,
          "skip-dependencies": true,
        }),
        /Could not find a Vite config file/,
      );
    }
    await assert.rejects(access(join(directory, ".bolerish.json")));
    await assert.rejects(access(join(directory, "src")));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("motion transformation preserves adjacent comments and accepts repeated rules", () => {
  const result = removeReducedMotionStyles(
    `const a = {"@media (prefers-reduced-motion: reduce)": {opacity: 0} /* between */ , color: 'red'}; const b = {'@media (prefers-reduced-motion: reduce)': {opacity: 1}};`,
  );
  assert.match(result, /color: 'red'/);
  assert.doesNotMatch(result, /prefers-reduced-motion/);
});

test("local registry validates array members before accepting a typed item", () => {
  assert.equal(
    isRegistryItem({
      name: "a",
      primaryExport: "A",
      files: [],
      dependencies: [123],
      registryDependencies: [],
    }),
    false,
  );
});

for (const code of ["ENOTFOUND", "E404"]) {
  test(`publish distinguishes npm ${code} without contacting npm`, async () => {
    const directory = await mkdtemp(join(tmpdir(), "bolerish-publish-"));
    try {
      for (const name of ["registry", "tokens", "cli", "ui"]) {
        await mkdir(join(directory, "packages", name), { recursive: true });
        await writeFile(
          join(directory, "packages", name, "package.json"),
          JSON.stringify({ name: `@bolerish/${name}`, version: "0.0.0-test" }),
        );
      }
      const bin = join(directory, "bin");
      await mkdir(bin);
      await writeFile(
        join(bin, "npm"),
        `#!/bin/sh\nprintf '%s\\n' '{"error":{"code":"${code}"}}'\nexit 1\n`,
        { mode: 0o755 },
      );
      await writeFile(join(bin, "pnpm"), '#!/bin/sh\nprintf "called\\n" >> published.txt\n', {
        mode: 0o755,
      });
      const promise = execFile(
        process.execPath,
        [
          "--experimental-strip-types",
          fileURLToPath(new URL("../../../scripts/publish.ts", import.meta.url)),
        ],
        { cwd: directory, env: { ...process.env, PATH: bin } },
      );
      if (code === "ENOTFOUND") {
        await assert.rejects(promise);
        await assert.rejects(access(join(directory, "published.txt")));
      } else {
        await promise;
        assert.equal(
          (await readFile(join(directory, "published.txt"), "utf8")).trim().split("\n").length,
          4,
        );
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}

test("Vite inspection follows defineConfig and compiler import aliases", () => {
  const source = `import { defineConfig as config } from "vite";
import compiler from "@stylexjs/unplugin";
export default config({ "plugins": [compiler.vite()] });`;
  assert.equal(inspectViteConfig(source)?.hasCompiler, true);
  assert.equal(configureVite(source), source);
  const direct = `import compiler from "@stylexjs/unplugin/vite";
export default { plugins: [compiler()] };`;
  assert.equal(inspectViteConfig(direct)?.hasCompiler, true);
  assert.equal(configureVite(direct), direct);
});

test("Vite inspection refuses ambiguous config and unrelated calls", () => {
  for (const source of [
    "export default defineConfig({ plugins: [] });",
    'import { defineConfig } from "elsewhere"; export default defineConfig({ plugins: [] });',
    "export default { plugins: [], plugins: [] };",
    "export default { plugins: [], ...other };",
    'export default { ["plugins"]: [] };',
  ]) {
    assert.equal(inspectViteConfig(source), undefined);
  }
  for (const source of [
    'import sx from "@stylexjs/unplugin"; export default { plugins: [sx()] };',
    'import sx from "@stylexjs/unplugin/vite"; export default { plugins: [sx.vite()] };',
    'import sx from "@stylexjs/unplugin"; export default { plugins: [sx["vite"]()] };',
  ]) {
    assert.equal(inspectViteConfig(source)?.hasCompiler, false);
  }
});

test("motion removal removes nested ranges once and preserves unrelated properties", () => {
  const source = `const styles = {
    before: 1,
    "@media (prefers-reduced-motion: reduce)": {
      "@media (prefers-reduced-motion: reduce)": { opacity: 0 },
      opacity: 1,
    },
    after: { color: "red" },
    other: { "@media (prefers-reduced-motion: reduce)": {}, kept: true },
  };`;
  const result = removeReducedMotionStyles(source);
  assert.doesNotMatch(result, /prefers-reduced-motion/);
  assert.match(result, /before: 1/);
  assert.match(result, /after: \{ color: "red" \}/);
  assert.match(result, /kept: true/);
});
