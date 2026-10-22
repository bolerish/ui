import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { registryVersion } from "@bolerish/registry";

import { add } from "../dist/add.js";
import { defaultConfig, readConfig, validateConfig, writeConfig } from "../dist/config.js";
import { init } from "../dist/init.js";
import { resolveComponent } from "../dist/registry.js";

test("version metadata is optional and validated", () => {
  assert.deepEqual(validateConfig(defaultConfig), defaultConfig);
  for (const metadata of [
    { version: 12 },
    { version: "" },
    { components: [] },
    { components: { button: false } },
  ]) {
    assert.throws(() => validateConfig({ ...defaultConfig, ...metadata }));
  }
  assert.equal(
    validateConfig({ ...defaultConfig, components: { custom: null } }).components?.custom,
    null,
  );
});

test("add preserves foundation and other component versions and records dependencies", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-versions-"));
  try {
    await writeConfig(directory, {
      ...defaultConfig,
      version: "0.5.1",
      components: { button: "0.5.1" },
    });
    await add(directory, "alert-dialog", { "skip-dependencies": true });
    const config = await readConfig(directory);
    assert.equal(config.version, "0.5.1");
    const resolved = await resolveComponent("alert-dialog");
    for (const name of resolved.components)
      assert.equal(config.components?.[name], registryVersion);
    if (!resolved.components.includes("button")) assert.equal(config.components?.button, "0.5.1");
    const before = await readFile(join(directory, ".bolerish.json"), "utf8");
    await add(directory, "card", { "dry-run": true, "skip-dependencies": true });
    assert.equal(await readFile(join(directory, ".bolerish.json"), "utf8"), before);
    await writeFile(join(directory, "src/components/ui/alert-dialog.tsx"), "// user edit");
    await assert.rejects(add(directory, "alert-dialog", { "skip-dependencies": true }), /canceled/);
    assert.equal(await readFile(join(directory, ".bolerish.json"), "utf8"), before);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("force init preserves installed metadata when existing foundation is retained", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-versions-"));
  try {
    await init(directory, { defaults: true, "skip-dependencies": true });
    assert.equal((await readConfig(directory)).version, registryVersion);
    await writeConfig(directory, {
      ...defaultConfig,
      version: "0.5.1",
      components: { button: "0.5.1" },
    });
    await writeFile(join(directory, "src/styles/reset.css"), "/* customized */");
    await init(directory, { defaults: true, force: true, "skip-dependencies": true });
    const config = await readConfig(directory);
    assert.equal(config.version, "0.5.1");
    assert.equal(config.components?.button, "0.5.1");
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("adding to legacy config keeps unknown foundation version and marks remote source unknown", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-versions-"));
  try {
    await writeConfig(directory, defaultConfig);
    const item = {
      name: "custom",
      primaryExport: "Custom",
      dependencies: [],
      registryDependencies: [],
      files: [{ path: "custom.ts", content: "export {};" }],
    };
    await add(directory, `data:application/json,${encodeURIComponent(JSON.stringify(item))}`, {
      "skip-dependencies": true,
    });
    const config = await readConfig(directory);
    assert.equal(config.version, undefined);
    assert.equal(config.components?.custom, null);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
