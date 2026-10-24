import assert from "node:assert/strict";
import { execFile as callback } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import plugin from "../dist/index.js";

const execFile = promisify(callback);

test("Oxlint reports the same rules on TSX and honors per-rule overrides", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-lint-"));
  try {
    const config = join(directory, ".oxlintrc.json");
    const fixture = join(directory, "screen.tsx");
    await writeFile(
      fixture,
      `import * as sx from "@stylexjs/stylex";
      const styles = sx.create({ panel: { color: "#123456", fontSize: 13, padding: 9 } });
      export const Screen = () => <div style={{ gap: 9 as number }} />;
    `,
    );
    const rules: Record<string, string> = { ...plugin.configs.recommended.rules };
    const settings = {
      categories: { correctness: "off" },
      jsPlugins: [
        {
          name: "bolerish-ui",
          specifier: fileURLToPath(new URL("../dist/index.js", import.meta.url)),
        },
      ],
      rules,
    };
    const binary = fileURLToPath(new URL("../node_modules/.bin/oxlint", import.meta.url));
    async function run() {
      await writeFile(config, JSON.stringify(settings));
      const { stdout } = await execFile(binary, ["--config", config, "--format", "json", fixture]);
      const output: { diagnostics: { message: string }[] } = JSON.parse(stdout);
      return output.diagnostics;
    }
    const diagnostics = await run();
    assert.equal(diagnostics.length, 4);
    assert.ok(diagnostics.some((entry) => entry.message.includes("colorVars")));
    assert.ok(diagnostics.some((entry) => entry.message.includes("typo")));
    settings.rules = { ...settings.rules, "bolerish-ui/spacing-tokens": "off" };
    assert.equal((await run()).length, 2);
    await writeFile(
      fixture,
      'import * as sx from "@stylexjs/stylex"; sx.create({ panel: { gap: spacingVars.space4, color: colorVars.fgPrimary } });',
    );
    assert.deepEqual(await run(), []);
    settings.rules = plugin.configs.recommended.rules;
    await writeFile(
      fixture,
      'import * as sx from "@stylexjs/stylex"; sx.create({ icon: { gap: "0.1875em", marginBlockStart: "0.05em" }, text: { fontSize: "0.9em", lineHeight: 1.8 } });',
    );
    assert.deepEqual(await run(), []);
    await writeFile(
      fixture,
      'import * as sx from "@stylexjs/stylex"; sx.create({ text: { fontSize: "13px", lineHeight: "24px" } });',
    );
    assert.equal((await run()).length, 2);
    const prefix = 'import * as sx from "@stylexjs/stylex";';
    const declaration = 'sx.create({ x: { gap: 9, color: "red" } });';
    for (const directive of ["eslint", "oxlint"]) {
      for (const code of [
        `${prefix}\n// ${directive}-disable-next-line bolerish-ui/spacing-tokens -- deliberate spacing\n${declaration}`,
        `${prefix}\n${declaration} // ${directive}-disable-line bolerish-ui/spacing-tokens -- deliberate spacing`,
        `${prefix}\n/* ${directive}-disable bolerish-ui/spacing-tokens -- deliberate spacing */\n${declaration}\n/* ${directive}-enable bolerish-ui/spacing-tokens */`,
        `/* ${directive}-disable bolerish-ui/spacing-tokens -- deliberate spacing */\n${prefix}\n${declaration}`,
      ]) {
        await writeFile(fixture, code);
        const remaining = await run();
        assert.equal(remaining.length, 1, `${directive}: only the selected rule is disabled`);
        assert.ok(remaining[0].message.includes("colorVars"));
      }
      await writeFile(
        fixture,
        `${prefix}\n/* ${directive}-disable bolerish-ui/spacing-tokens -- deliberate spacing */\nsx.create({ x: { gap: 9 } });\n/* ${directive}-enable bolerish-ui/spacing-tokens */\nsx.create({ x: { gap: 9 } });`,
      );
      const resumed = await run();
      assert.equal(resumed.length, 1);
      assert.ok(
        resumed[0].message.startsWith("When setting gap, use spacingRoleVars or spacingVars"),
      );
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("workspace configuration rejects token violations in shared TS and TSX", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-workspace-lint-"));
  try {
    const settings = JSON.parse(
      await readFile(new URL("../../../.oxlintrc.json", import.meta.url), "utf8"),
    );
    settings.jsPlugins[0].specifier = fileURLToPath(new URL("../dist/index.js", import.meta.url));
    await writeFile(join(directory, ".oxlintrc.json"), JSON.stringify(settings));
    for (const path of [
      "packages/ui/src/styles/probe.ts",
      "packages/ui/src/probe.tsx",
      "docs/src/probe.ts",
    ]) {
      const fixture = join(directory, path);
      await mkdir(join(fixture, ".."), { recursive: true });
      await writeFile(
        fixture,
        'import * as sx from "@stylexjs/stylex"; sx.create({ x: { color: "red", gap: 13 } });',
      );
      const binary = fileURLToPath(new URL("../node_modules/.bin/oxlint", import.meta.url));
      let result: { stdout: string; code?: number };
      try {
        result = await execFile(binary, ["--format", "json", path], { cwd: directory });
      } catch (error) {
        result = error as { stdout: string; code: number };
      }
      assert.equal(result.code, 1, "token violations must fail CI");
      const output = JSON.parse(result.stdout);
      assert.equal(
        output.diagnostics.filter((entry: { message: string }) =>
          entry.message.startsWith("When setting"),
        ).length,
        2,
        path,
      );
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
