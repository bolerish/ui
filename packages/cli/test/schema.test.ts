import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { defaultConfig, hasConfig, readConfig, writeConfig } from "../dist/config.js";
import { init } from "../dist/init.js";

test("configuration links packaged completion values and retains the schema on rewrites", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-schema-"));
  try {
    await init(directory, { defaults: true, "skip-dependencies": true }, false);
    const config = JSON.parse(await readFile(join(directory, ".bolerish.json"), "utf8"));
    assert.equal(config.$schema, "./node_modules/@bolerish/ui/configuration_schema.json");
    await assert.rejects(readFile(join(directory, ".nuee.schema.json")), { code: "ENOENT" });
    const schema = JSON.parse(
      await readFile(new URL("../../ui/configuration_schema.json", import.meta.url), "utf8"),
    );
    assert.deepEqual(schema.properties.theme.properties.motion.enum, ["system", "off"]);
    assert.deepEqual(schema.properties.theme.properties.unit.enum, ["rem", "px"]);
    assert.deepEqual(schema.properties.theme.properties.density.anyOf[0].enum, [
      "default",
      "compact",
    ]);
    await writeConfig(directory, { ...defaultConfig, theme: { motion: "off" } });
    assert.equal((await readConfig(directory)).theme?.motion, "off");
    assert.equal(
      JSON.parse(await readFile(join(directory, ".bolerish.json"), "utf8")).$schema,
      config.$schema,
    );
  } finally {
    await rm(directory, { recursive: true });
  }
});

test("init migrates legacy filenames while preserving preferences and originals", async () => {
  for (const filename of [".nuee.json", "nuee.json"]) {
    const directory = await mkdtemp(join(tmpdir(), "bolerish-migration-"));
    const config = {
      ...defaultConfig,
      aliases: { ui: "@/custom/ui", styles: "@/custom/styles" },
      theme: { motion: "off", density: 0.875, fonts: { body: "Arial" } },
    };
    const source = JSON.stringify(config);
    try {
      await writeFile(join(directory, filename), source);
      assert.equal(await hasConfig(directory), true);
      await init(directory, { defaults: true, force: true, "skip-dependencies": true }, false);
      assert.equal(await readFile(join(directory, filename), "utf8"), source);
      const migrated = await readConfig(directory);
      assert.deepEqual(migrated.aliases, config.aliases);
      assert.deepEqual(migrated.theme, config.theme);
      assert.equal(
        JSON.parse(await readFile(join(directory, ".bolerish.json"), "utf8")).$schema,
        "./node_modules/@bolerish/ui/configuration_schema.json",
      );
    } finally {
      await rm(directory, { recursive: true });
    }
  }
});
