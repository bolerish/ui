import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { registryItems, registryVersion } from "@bolerish/registry";

import { add, getMissingDependencies } from "../dist/add.js";
import { configFileName, defaultConfig, readConfig } from "../dist/config.js";
import { init } from "../dist/init.js";
import { resolveComponent } from "../dist/registry.js";
import { writeTsconfig } from "./helpers.ts";

test("add creates the default config and copies a component with its foundation", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await add(projectDirectory, "button", { defaults: true, skipDependencyInstall: true });
    assert.deepEqual(await readConfig(projectDirectory), {
      ...defaultConfig,
      version: registryVersion,
      components: { button: registryVersion },
    });
    await access(join(projectDirectory, configFileName));

    const buttonSource = await readFile(
      join(projectDirectory, "src/components/ui/button.tsx"),
      "utf8",
    );
    assert.match(buttonSource, /export function Button/);
    assert.match(buttonSource, /from "@\/styles\/tokens\/semantic\.stylex"/);
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add installs multiple components with one command", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await add(projectDirectory, ["button", "toast"], {
      defaults: true,
      skipDependencyInstall: true,
    });

    await access(join(projectDirectory, "src/components/ui/button.tsx"));
    await access(join(projectDirectory, "src/components/ui/toast.tsx"));
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add uses the configured local token directory", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await mkdir(join(projectDirectory, "src"), { recursive: true });
    await init(projectDirectory, {
      defaults: true,
      "skip-dependencies": true,
      ui: "@/design/ui",
      tokens: "@/design-system/bolerish",
    });
    await add(projectDirectory, "card", { skipDependencyInstall: true });

    assert.match(
      await readFile(join(projectDirectory, "src/design/ui/card.tsx"), "utf8"),
      /from "@\/design-system\/bolerish\/tokens\/semantic\.stylex"/,
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add retains OS reduced-motion rules despite legacy developer configuration", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });
    await writeFile(
      join(projectDirectory, configFileName),
      JSON.stringify({
        ...defaultConfig,
        accessibility: { respectReducedMotion: false },
      }),
    );
    await add(projectDirectory, "dialog", { skipDependencyInstall: true });

    const dialogSource = await readFile(
      join(projectDirectory, "src/components/ui/dialog.tsx"),
      "utf8",
    );
    assert.match(dialogSource, /prefers-reduced-motion/);
    assert.match(dialogSource, /transform: "scale\(0\.95\)"/);
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add resolves aliases from tsconfig paths", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeFile(
      join(projectDirectory, "tsconfig.json"),
      `{
  // TypeScript config accepts comments.
  "compilerOptions": {
    "paths": {
      "~shared/*": ["./src/shared/*"],
    },
  },
}
`,
    );
    await init(projectDirectory, {
      defaults: true,
      "skip-dependencies": true,
      styles: "~shared/styles",
      ui: "~shared/ui",
    });
    await add(projectDirectory, "card", { skipDependencyInstall: true });

    await access(join(projectDirectory, "src/shared/ui/card.tsx"));
    assert.match(
      await readFile(join(projectDirectory, "src/shared/ui/card.tsx"), "utf8"),
      /from "~shared\/styles\/tokens\/semantic\.stylex"/,
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add installs the components used by a field", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });
    await add(projectDirectory, "field", { skipDependencyInstall: true });

    await access(join(projectDirectory, "src/components/ui/checkbox.tsx"));
    await access(join(projectDirectory, "src/components/ui/field.tsx"));
    await access(join(projectDirectory, "src/components/ui/input.tsx"));
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add skips dependencies already declared in package.json", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeFile(
      join(projectDirectory, "package.json"),
      JSON.stringify({ dependencies: { "@base-ui/react": "^1.7.0" } }),
    );

    assert.deepEqual(
      await getMissingDependencies(projectDirectory, [
        "@base-ui/react@^1.7.0",
        "@stylexjs/stylex@^0.19.0",
      ]),
      ["@stylexjs/stylex@^0.19.0"],
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add uses the supported external dependency versions", async () => {
  const calendar = await resolveComponent("calendar");
  const carousel = await resolveComponent("carousel");

  assert.ok(calendar.externalDependencies.includes("@daypicker/react@^10.0.1"));
  assert.ok(carousel.externalDependencies.includes("embla-carousel-react@^8.6.0"));
});

test("add checks every overwrite before writing component dependencies", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });
    await mkdir(join(projectDirectory, "src/components/ui"), { recursive: true });
    await writeFile(join(projectDirectory, "src/components/ui/field.tsx"), "// Customized Field\n");

    await assert.rejects(
      () => add(projectDirectory, "field", { skipDependencyInstall: true }),
      /Component installation canceled/,
    );
    await assert.rejects(() => access(join(projectDirectory, "src/components/ui/checkbox.tsx")));
    await assert.rejects(() => access(join(projectDirectory, "src/components/ui/input.tsx")));
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add uses packaged registry content without a UI source directory", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeTsconfig(projectDirectory);
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });
    await add(projectDirectory, "card", { skipDependencyInstall: true });

    assert.match(
      await readFile(join(projectDirectory, "src/components/ui/card.tsx"), "utf8"),
      /export function Card/,
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("every registry component uses the project's local StyleX tokens", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });

    for (const componentName of Object.keys(registryItems)) {
      await add(projectDirectory, componentName, { skipDependencyInstall: true });
    }

    for (const item of Object.values(registryItems)) {
      for (const file of item.files) {
        if (!file.endsWith(".tsx")) continue;

        const source = await readFile(join(projectDirectory, "src/components/ui", file), "utf8");
        assert.doesNotMatch(source, /@bolerish\/tokens/);
      }
    }
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add installs renamed and new components", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeTsconfig(projectDirectory);
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });
    await add(projectDirectory, "banner", { skipDependencyInstall: true });
    await add(projectDirectory, "link", { skipDependencyInstall: true });

    assert.match(
      await readFile(join(projectDirectory, "src/components/ui/banner.tsx"), "utf8"),
      /export function Banner/,
    );
    assert.match(
      await readFile(join(projectDirectory, "src/components/ui/link.tsx"), "utf8"),
      /export const Link/,
    );
    await assert.rejects(
      () => add(projectDirectory, "alert", { skipDependencyInstall: true }),
      /Unknown component: alert/,
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add dry-run does not write files", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeTsconfig(projectDirectory);
    await add(projectDirectory, "card", { "dry-run": true, skipDependencyInstall: true });
    await assert.rejects(() => access(join(projectDirectory, configFileName)));
    await assert.rejects(() => access(join(projectDirectory, "src/components/ui/card.tsx")));
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add installs a component from a registry URL", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));
  const item = {
    dependencies: [],
    files: [{ path: "notice.ts", content: "export const notice = true;\n" }],
    name: "notice",
    registryDependencies: [],
  };

  try {
    await writeTsconfig(projectDirectory);
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });
    await add(
      projectDirectory,
      `data:application/json,${encodeURIComponent(JSON.stringify(item))}`,
      {
        skipDependencyInstall: true,
      },
    );
    assert.equal(
      await readFile(join(projectDirectory, "src/components/ui/notice.ts"), "utf8"),
      item.files[0].content,
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});

test("add rejects a registry file path that escapes the UI directory", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));
  const item = {
    dependencies: [],
    files: [{ path: "../outside.ts", content: "export const outside = true;\n" }],
    name: "outside",
    registryDependencies: [],
  };

  try {
    await writeTsconfig(projectDirectory);
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });
    await assert.rejects(
      () =>
        add(projectDirectory, `data:application/json,${encodeURIComponent(JSON.stringify(item))}`, {
          skipDependencyInstall: true,
        }),
      /must stay inside the UI directory/,
    );
    await assert.rejects(() => access(join(projectDirectory, "src/components/outside.ts")));
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});
