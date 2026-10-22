import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { registryVersion } from "@bolerish/registry";

import {
  configFileName,
  defaultConfig,
  getDefaultAliases,
  readConfig,
  resolveTokenAlias,
} from "../dist/config.js";
import { init } from "../dist/init.js";

test("init stores a custom UI path", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await init(projectDirectory, {
      "skip-dependencies": true,
      ui: "@/design/ui",
    });

    assert.deepEqual(await readConfig(projectDirectory), {
      ...defaultConfig,
      version: registryVersion,
      aliases: { ...defaultConfig.aliases, ui: "@/design/ui" },
    });
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("readConfig explains how to replace an older configuration", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeFile(
      join(projectDirectory, configFileName),
      JSON.stringify({ paths: { ui: "src/components/ui", tokens: "src/styles/bolerish" } }),
    );

    await assert.rejects(
      () => readConfig(projectDirectory),
      /uses an older format\. Run `bolerish init --force`/,
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("init creates local StyleX sources without changing an entry point", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await mkdir(join(projectDirectory, "src"), { recursive: true });
    await writeFile(join(projectDirectory, "src/main.tsx"), "export {};\n");
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });

    await access(join(projectDirectory, "src/styles/tokens/color-palette.stylex.ts"));
    await access(join(projectDirectory, "src/styles/tokens/semantic.stylex.ts"));
    await access(join(projectDirectory, "src/styles/tokens/themes.stylex.ts"));
    assert.equal(await readFile(join(projectDirectory, "src/main.tsx"), "utf8"), "export {};\n");
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("init keeps existing local token files", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await mkdir(join(projectDirectory, "src/styles/tokens"), { recursive: true });
    await writeFile(
      join(projectDirectory, "src/styles/tokens/semantic.stylex.ts"),
      "/* custom */\n",
    );
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });

    assert.equal(
      await readFile(join(projectDirectory, "src/styles/tokens/semantic.stylex.ts"), "utf8"),
      "/* custom */\n",
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("init copies customized flat tokens into tokens while preserving legacy files", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-layout-"));
  try {
    await mkdir(join(directory, "src/styles"), { recursive: true });
    const legacy = join(directory, "src/styles/semantic.stylex.ts");
    await writeFile(legacy, "/* customized legacy tokens */\n");
    assert.equal(await resolveTokenAlias(directory, "@/styles"), "@/styles");
    await init(directory, { defaults: true, "skip-dependencies": true });
    assert.equal(
      await readFile(join(directory, "src/styles/tokens/semantic.stylex.ts"), "utf8"),
      await readFile(legacy, "utf8"),
    );
    assert.equal(await resolveTokenAlias(directory, "@/styles"), "@/styles/tokens");
    assert.match(
      await readFile(join(directory, "src/styles/settings.stylex.ts"), "utf8"),
      /from "\.\/tokens\/density\.stylex"/,
    );
    await writeFile(
      join(directory, "src/styles/tokens/semantic.stylex.ts"),
      "/* newer customization */\n",
    );
    await init(directory, { defaults: true, force: true, "skip-dependencies": true });
    assert.equal(
      await readFile(join(directory, "src/styles/tokens/semantic.stylex.ts"), "utf8"),
      "/* newer customization */\n",
    );
    assert.equal(await readFile(legacy, "utf8"), "/* customized legacy tokens */\n");
  } finally {
    await rm(directory, { recursive: true });
  }
});

test("init --force refreshes legacy semantic defaults", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await mkdir(join(projectDirectory, "src/styles/tokens"), { recursive: true });
    await writeFile(
      join(projectDirectory, "src/styles/tokens/semantic.stylex.ts"),
      'export const colorVars = { bgCanvas: "initial" };\nexport const shadowVars = { overlay: "initial" };\n',
    );
    await init(projectDirectory, { defaults: true, force: true, "skip-dependencies": true });

    assert.doesNotMatch(
      await readFile(join(projectDirectory, "src/styles/tokens/semantic.stylex.ts"), "utf8"),
      /bgCanvas: "initial"/,
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("init --vite configures a standard Vite project", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeFile(
      join(projectDirectory, "vite.config.ts"),
      'import { defineConfig } from "vite";\n\nexport default defineConfig({ plugins: [] });\n',
    );
    await mkdir(join(projectDirectory, "src"), { recursive: true });
    await writeFile(join(projectDirectory, "src/main.tsx"), "export {};\n");
    await writeFile(join(projectDirectory, "src/index.css"), "body { color: black; }\n");
    await init(projectDirectory, { defaults: true, vite: true, "skip-dependencies": true });

    assert.match(
      await readFile(join(projectDirectory, "vite.config.ts"), "utf8"),
      /unstable_moduleResolution: \{ type: "commonJS" \}/,
    );
    assert.doesNotMatch(
      await readFile(join(projectDirectory, "vite.config.ts"), "utf8"),
      /aliases:|resolve:/,
    );
    assert.equal(
      await readFile(join(projectDirectory, "src/index.css"), "utf8"),
      '@import "./styles/reset.css";\n@import "./styles/preferences.css";\n\nbody { color: black; }\n',
    );
    await access(join(projectDirectory, "src/styles/reset.css"));
    await access(join(projectDirectory, "src/styles/tokens/themes.stylex.ts"));
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("init --vite explains a missing Vite config", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await assert.rejects(
      init(projectDirectory, {
        defaults: true,
        vite: true,
        "skip-dependencies": true,
      }),
      /Could not find a Vite config file/,
    );
    await assert.rejects(() => access(join(projectDirectory, configFileName)));
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("init keeps an existing StyleX configuration", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeFile(
      join(projectDirectory, "vite.config.ts"),
      `import stylex from "@stylexjs/unplugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    stylex.vite({
      useCSSLayers: true,
      aliases: { "@/styles/*": ["/ROOT/src/styles/*"] },
      unstable_moduleResolution: {
        type: "commonJS",
        rootDir: new URL(".", import.meta.url).pathname,
      },
    }),
  ],
});
`,
    );
    await mkdir(join(projectDirectory, "src"), { recursive: true });
    await init(projectDirectory, {
      defaults: true,
      force: true,
      vite: true,
      "skip-dependencies": true,
    });

    assert.match(
      await readFile(join(projectDirectory, "vite.config.ts"), "utf8"),
      /useCSSLayers|aliases:/,
    );
    assert.match(
      await readFile(join(projectDirectory, "vite.config.ts"), "utf8"),
      /rootDir: new URL\(".", import.meta.url\)\.pathname/,
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("init does not change a Vite project when its plugin array cannot be updated safely", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    const configSource = "export default defineConfig({});\n";
    await writeFile(join(projectDirectory, "vite.config.ts"), configSource);
    await mkdir(join(projectDirectory, "src"), { recursive: true });
    await writeFile(join(projectDirectory, "src/main.tsx"), "export {};\n");

    await assert.rejects(
      init(projectDirectory, { defaults: true, vite: true, "skip-dependencies": true }),
      /Could not safely update/,
    );
    assert.equal(await readFile(join(projectDirectory, "vite.config.ts"), "utf8"), configSource);
    await assert.rejects(() =>
      access(join(projectDirectory, "src/styles/tokens/semantic.stylex.ts")),
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("init derives aliases from a project root path mapping", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeFile(
      join(projectDirectory, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { paths: { "~/*": ["./src/*"] } } }),
    );

    assert.deepEqual(await getDefaultAliases(projectDirectory), {
      ui: "~/components/ui",
      styles: "~/styles",
    });
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });

    assert.deepEqual((await readConfig(projectDirectory)).aliases, {
      ui: "~/components/ui",
      styles: "~/styles",
    });
    await access(join(projectDirectory, "src/styles/tokens/semantic.stylex.ts"));
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("init writes tokens to a configured project-local directory", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await mkdir(join(projectDirectory, "src"), { recursive: true });
    await init(projectDirectory, {
      defaults: true,
      "skip-dependencies": true,
      tokens: "@/design-system/bolerish",
    });

    const config = await readConfig(projectDirectory);
    assert.equal(config.aliases.styles, "@/design-system/bolerish");
    await access(join(projectDirectory, "src/design-system/bolerish/tokens/semantic.stylex.ts"));
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("init rejects a path outside the project", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await assert.rejects(
      () =>
        init(projectDirectory, {
          defaults: true,
          "skip-dependencies": true,
          tokens: "../outside",
        }),
      /Could not resolve aliases\.styles/,
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});
