import assert from "node:assert/strict";
import { execFile as callback } from "node:child_process";
import { access, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFile = promisify(callback);

test("the packed plugin loads outside the workspace without a TS loader or runtime dependencies", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-plugin-package-"));
  try {
    const packageDirectory = fileURLToPath(new URL("./", import.meta.url));
    const { stdout } = await execFile(
      "npm",
      ["pack", "--ignore-scripts", "--json", "--pack-destination", directory],
      { cwd: packageDirectory },
    );
    const packages: { filename: string }[] = JSON.parse(stdout);
    const target = join(directory, "node_modules", "@bolerish", "lint");
    await mkdir(target, { recursive: true });
    await execFile("tar", [
      "-xzf",
      join(directory, packages[0].filename),
      "--strip-components=1",
      "-C",
      target,
    ]);
    await access(join(target, "dist", "index.d.ts"));
    const consumer = await execFile(
      process.execPath,
      [
        "--input-type=module",
        "--eval",
        `
      import plugin from "@bolerish/lint";
      import foundations from "@bolerish/lint/foundations" with { type: "json" };
      console.log(JSON.stringify({ name: plugin.meta.name, rules: Object.keys(plugin.rules), groups: Object.keys(foundations) }));
    `,
      ],
      { cwd: directory },
    );
    const result = JSON.parse(consumer.stdout);
    assert.equal(result.name, "@bolerish/lint");
    assert.deepEqual(result.rules, ["color-tokens", "typography-tokens", "spacing-tokens"]);
    assert.deepEqual(result.groups, ["color", "typography", "spacing"]);
    const manifest = JSON.parse(await readFile(join(target, "package.json"), "utf8"));
    assert.equal(manifest.dependencies, undefined);
    assert.notEqual(manifest.private, true);
    assert.equal(manifest.publishConfig.access, "public");
    await access(join(target, "LICENSE"));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
