import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { registryVersion } from "@bolerish/registry";

import { defaultConfig, writeConfig } from "../dist/config.js";
import { doctor } from "../dist/doctor.js";
import { init } from "../dist/init.js";
import { writeTsconfig } from "./helpers.ts";

test("doctor verifies local StyleX sources, the compiler, and a CSS entry point", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeTsconfig(projectDirectory);
    await writeFile(
      join(projectDirectory, "package.json"),
      JSON.stringify({
        dependencies: { "@stylexjs/stylex": "1.0.0" },
        devDependencies: { "@stylexjs/unplugin": "1.0.0" },
      }),
    );
    await writeFile(
      join(projectDirectory, "vite.config.ts"),
      'import { unplugin } from "@stylexjs/unplugin";\nimport { defineConfig } from "vite";\nexport default defineConfig({ plugins: [unplugin.vite()] });\n',
    );
    await mkdir(join(projectDirectory, "src"), { recursive: true });
    await writeFile(join(projectDirectory, "src/main.tsx"), 'import "./index.css";\n');
    await init(projectDirectory, { defaults: true, vite: true, "skip-dependencies": true });

    assert.equal(await doctor(projectDirectory), true);
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

for (const version of [registryVersion, "0.0.0", undefined, null]) {
  test(`doctor reports recorded source version ${version} without editing config`, async (t) => {
    const directory = await mkdtemp(join(tmpdir(), "bolerish-doctor-"));
    try {
      await writeTsconfig(directory);
      await writeConfig(directory, {
        ...defaultConfig,
        components: { button: version ?? null },
      });
      const configPath = join(directory, ".bolerish.json");
      const before = await readFile(configPath, "utf8");
      const messages: string[] = [];
      t.mock.method(console, "log", (message: string) => messages.push(message));
      await doctor(directory);
      const message = messages.find((line) => line.includes("Installed source (button)"));
      assert.ok(message);
      assert.ok(message.startsWith(version === registryVersion ? "✓" : "!"));
      assert.match(
        message,
        version == null ? /Version unknown/ : /Metadata does not verify local edits/,
      );
      assert.ok(
        messages.some((line) => line.includes("Installed source (Foundation): Version unknown")),
      );
      assert.equal(await readFile(configPath, "utf8"), before);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}
