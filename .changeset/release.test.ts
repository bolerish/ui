import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const cli = resolve("node_modules/@changesets/cli/bin.js");
const packages = ["tokens", "ui", "eslint-plugin-ui"];

test("release groups propagate token changes without coupling the lint plugin", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-release-"));
  try {
    await symlink(resolve("node_modules"), join(directory, "node_modules"), "dir");
    await mkdir(join(directory, ".changeset"));
    await cp(".changeset/config.json", join(directory, ".changeset/config.json"));
    await writeFile(join(directory, "package.json"), JSON.stringify({ private: true }));
    await writeFile(
      join(directory, "pnpm-workspace.yaml"),
      "packages:\n  - packages/*\n  - docs\n",
    );
    for (const name of [...packages, "docs"]) {
      const target = name === "docs" ? "docs" : `packages/${name}`;
      await mkdir(join(directory, target), { recursive: true });
      await cp(`${target}/package.json`, join(directory, target, "package.json"));
    }
    const readManifest = async (name: string) =>
      JSON.parse(await readFile(join(directory, name, "package.json"), "utf8"));
    const originalUi = await readManifest("packages/ui");
    const originalLint = await readManifest("packages/eslint-plugin-ui");
    const originalDocs = await readManifest("docs");
    await writeFile(
      join(directory, ".changeset/token-change.md"),
      '---\n"@bolerish/tokens": patch\n---\n\nCorrect a token value.\n',
    );
    await execFile(process.execPath, [cli, "version"], { cwd: directory });
    const tokens = await readManifest("packages/tokens");
    const ui = await readManifest("packages/ui");
    assert.notEqual(ui.version, originalUi.version);
    assert.equal(ui.version, tokens.version);
    assert.equal(ui.dependencies["@bolerish/tokens"], "workspace:*");
    assert.equal((await readManifest("packages/eslint-plugin-ui")).version, originalLint.version);
    assert.equal((await readManifest("docs")).version, originalDocs.version);
    assert.match(
      await readFile(join(directory, "packages/ui/CHANGELOG.md"), "utf8"),
      new RegExp(ui.version.replaceAll(".", "\\.")),
    );

    await writeFile(
      join(directory, ".changeset/ui-change.md"),
      '---\n"@bolerish/ui": minor\n---\n\nAdd a UI capability.\n',
    );
    await execFile(process.execPath, [cli, "version"], { cwd: directory });
    const nextUi = await readManifest("packages/ui");
    assert.notEqual(nextUi.version, ui.version);
    assert.equal((await readManifest("packages/tokens")).version, nextUi.version);

    await writeFile(
      join(directory, ".changeset/lint-change.md"),
      '---\n"@bolerish/eslint-plugin-ui": patch\n---\n\nImprove a lint diagnostic.\n',
    );
    await execFile(process.execPath, [cli, "version"], { cwd: directory });
    assert.notEqual(
      (await readManifest("packages/eslint-plugin-ui")).version,
      originalLint.version,
    );
    assert.equal((await readManifest("packages/ui")).version, nextUi.version);
    assert.equal((await readManifest("packages/tokens")).version, nextUi.version);
    assert.equal((await readManifest("docs")).version, originalDocs.version);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
