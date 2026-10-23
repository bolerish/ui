import assert from "node:assert/strict";
import { execFile as execFileCallback } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { setTimeout } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import { build } from "vite";

const execFile = promisify(execFileCallback);
const testDirectory = dirname(fileURLToPath(import.meta.url));

test("package distribution has no source-copy CLI dependencies", async () => {
  const manifest = JSON.parse(await readFile(new URL("./package.json", import.meta.url), "utf8"));
  assert.equal(manifest.bin, undefined);
  assert.equal(manifest.dependencies["@bolerish/cli"], undefined);
  assert.equal(manifest.dependencies["@bolerish/registry"], undefined);
  const files = await readdir(new URL("./dist/", import.meta.url));
  assert.ok(!files.includes("cli.js"));
});

test("production StyleX CSS contains no invalid numeric declarations", async () => {
  const css = await readFile(new URL("./dist/stylex.css", import.meta.url), "utf8");
  assert.doesNotMatch(css, /:\s*[^;}]*\b(?:(?:NaN|Infinity)[a-z%]*|undefined\b)/);
});

test("published component entries preserve their source client boundaries", async () => {
  const sourceDirectory = new URL("./src/", import.meta.url);
  for (const name of await readdir(sourceDirectory)) {
    if (!name.endsWith(".tsx") && name !== "primitives.ts") continue;
    const source = await readFile(new URL(name, sourceDirectory), "utf8");
    const output = await readFile(
      new URL(`./dist/${name.replace(/\.tsx?$/, ".js")}`, import.meta.url),
      "utf8",
    );
    assert.equal(output.startsWith('"use client";'), source.startsWith('"use client";'), name);
  }
  const index = await readFile(new URL("./dist/index.js", import.meta.url), "utf8");
  assert.match(index, /from "\.\/button\.js"/);
  assert.doesNotMatch(index, /createContext\(/);
});

test("published display components execute in the React server environment", async () => {
  const cardUrl = new URL("./dist/card.js", import.meta.url).href;
  const { stdout } = await execFile(process.execPath, [
    "--conditions=react-server",
    "--input-type=module",
    "-e",
    `import { Card } from ${JSON.stringify(cardUrl)}; console.log(Card({ children: "Server card" }).type);`,
  ]);
  assert.equal(stdout.trim(), "div");
});

test("published controls generate server HTML without browser globals", async () => {
  const directory = fileURLToPath(new URL("./", import.meta.url));
  const { stdout } = await execFile(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `
    import { createElement } from "react";
    import { renderToString } from "react-dom/server";
    import { Button } from "./dist/button.js";
    import { Switch } from "./dist/switch.js";
    console.log(renderToString(createElement(Button, null, "Server action")));
    console.log(renderToString(createElement(Switch, { "aria-label": "Server switch" })));
  `,
    ],
    { cwd: directory },
  );
  assert.match(stdout, /Server action/);
  assert.match(stdout, /role="switch"/);
});

test("package consumers build components and both themes without a StyleX plugin", async () => {
  const projectDirectory = await mkdtemp(join(testDirectory, ".package-app-"));
  try {
    await mkdir(join(projectDirectory, "src"));
    await mkdir(join(projectDirectory, "node_modules/@bolerish"), { recursive: true });
    await symlink(
      fileURLToPath(new URL("./", import.meta.url)),
      join(projectDirectory, "node_modules/@bolerish/ui"),
      "dir",
    );
    await writeFile(join(projectDirectory, "package.json"), JSON.stringify({ type: "module" }));
    await writeFile(
      join(projectDirectory, "index.html"),
      '<div id="root"></div><script type="module" src="/src/main.tsx"></script>',
    );
    await writeFile(
      join(projectDirectory, "src/main.tsx"),
      [
        'import React from "react";',
        'import { createRoot } from "react-dom/client";',
        'import { Button } from "@bolerish/ui";',
        'import { themeClassNames } from "@bolerish/ui/theme";',
        'import "./custom.css";',
        'document.documentElement.classList.add(...themeClassNames.dark.split(" "));',
        'createRoot(document.getElementById("root")!).render(<Button className="consumer-button" style={{ maxWidth: 320 }}>Save</Button>);',
      ].join("\n"),
    );
    await writeFile(
      join(projectDirectory, "src/custom.css"),
      '@import "@bolerish/ui";\n.consumer-button { border-radius: 12px; }\n',
    );
    const readme = await readFile(new URL("./../../README.md", import.meta.url), "utf8");
    const examples = [...readme.matchAll(/```tsx\n([\s\S]*?)```/g)];
    assert.ok(examples.length > 0, "README must contain a runnable TSX example.");
    for (const [index, example] of examples.entries()) {
      await writeFile(join(projectDirectory, `src/readme-${index}.tsx`), example[1]);
    }
    await writeFile(
      join(projectDirectory, "tsconfig.json"),
      JSON.stringify({
        compilerOptions: {
          target: "ES2022",
          module: "ESNext",
          moduleResolution: "Bundler",
          jsx: "react-jsx",
          strict: true,
          skipLibCheck: true,
          noEmit: true,
        },
        include: ["src/readme-*.tsx"],
      }),
    );
    await execFile(process.execPath, [
      fileURLToPath(new URL("./node_modules/typescript/bin/tsc", import.meta.url)),
      "-p",
      join(projectDirectory, "tsconfig.json"),
    ]);
    const result = await build({
      configFile: false,
      root: projectDirectory,
      build: { write: false, minify: false },
    });
    assert.ok(!Array.isArray(result) && "output" in result);
    const styles = result.output.filter(
      (entry) => entry.type === "asset" && entry.fileName.endsWith(".css"),
    );
    assert.equal(styles.length, 1);
    assert.equal(styles[0].type, "asset");
    const css = String(styles[0].source);
    const { themeClassNames } = await import("./dist/theme.js");
    for (const mode of ["light", "dark"] as const) {
      assert.ok(themeClassNames[mode].length > 0);
      const rules = themeClassNames[mode].split(" ").filter((name) => css.includes(`.${name}`));
      assert.ok(rules.length >= 2, `${mode} must include both color and shadow theme rules`);
    }
    assert.match(css, /prefers-reduced-motion/);
  } finally {
    await rm(projectDirectory, { recursive: true, force: true });
  }
});

test("rebuilds keep exported component entries continuously readable", async () => {
  const packageDirectory = testDirectory;
  const entries = [
    "button.js",
    "button.d.ts",
    "tooltip.js",
    "empty.js",
    "global.css",
    "stylex.css",
  ];
  let finished = false;
  let checks = 0;
  const rebuild = execFile(process.execPath, ["--experimental-strip-types", "scripts/build.ts"], {
    cwd: packageDirectory,
  }).finally(() => {
    finished = true;
  });
  try {
    while (!finished) {
      await Promise.all(
        entries.map(async (entry) => {
          const source = await readFile(join(packageDirectory, "dist", entry), "utf8");
          assert.ok(source.length > 0, `${entry} remains complete during rebuild`);
        }),
      );
      checks++;
      await setTimeout(5);
    }
  } finally {
    await rebuild;
  }
  assert.ok(checks > 1, "sampled live entry files during the build");
});
