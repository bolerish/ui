import { readFile, readdir, rm, writeFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

import stylex from "@stylexjs/unplugin/esbuild";
import reactCompiler from "babel-plugin-react-compiler";
import { build, type Plugin } from "esbuild";

const sourceDirectory = "src";
const outputDirectory = "dist";
type StylexCompilerOptions = NonNullable<Parameters<typeof stylex>[0]> & {
  babelConfig: { plugins: [[typeof reactCompiler, { sources: (filename: string) => boolean }]] };
};

const entryPoints = await getEntryPoints();
const clientModules = new Set<string>();
for (const sourcePath of Object.values(entryPoints)) {
  if ((await readFile(sourcePath, "utf8")).startsWith('"use client";')) {
    clientModules.add(resolve(sourcePath));
  }
}

const stylexCompilerOptions: StylexCompilerOptions = {
  babelConfig: {
    plugins: [[reactCompiler, { sources: (filename) => clientModules.has(filename) }]],
  },
  useCSSLayers: true,
};

async function getEntryPoints() {
  const entries: Record<string, string> = {
    index: join(sourceDirectory, "index.ts"),
    primitives: join(sourceDirectory, "primitives.ts"),
    theme: join(sourceDirectory, "theme.ts"),
    // Include definitions even when StyleX inlines their references in components.
    _tokens: resolve("../tokens/src/index.ts"),
  };
  const files = await readdir(sourceDirectory, { withFileTypes: true });

  for (const file of files) {
    if (!file.isFile() || !file.name.endsWith(".tsx")) continue;
    entries[file.name.replace(/\.tsx$/, "")] = join(sourceDirectory, file.name);
  }

  return entries;
}

await rm(outputDirectory, { force: true, recursive: true });

// Keep component imports as module boundaries so RSC consumers can see directives.
const componentModules: Plugin = {
  name: "component-modules",
  setup(builder) {
    builder.onResolve({ filter: /^@bolerish\/tokens\/themes\.stylex$/ }, () => ({
      path: resolve("../tokens/src/themes.stylex.ts"),
    }));
    builder.onResolve({ filter: /^\.\// }, ({ path, importer }) => {
      if (!importer.startsWith(join(process.cwd(), sourceDirectory))) return;
      const name = basename(path).replace(/\.[jt]sx?$/, "");
      if (!(name in entryPoints)) return;
      return { path: `./${name}.js`, external: true };
    });
  },
};

await build({
  bundle: true,
  entryPoints,
  format: "esm",
  jsx: "automatic",
  outdir: outputDirectory,
  packages: "external",
  platform: "browser",
  plugins: [componentModules, stylex(stylexCompilerOptions)],
  metafile: true,
  sourcemap: true,
  target: "es2022",
});

const globalCss = await readFile(join(sourceDirectory, "styles/global.css"), "utf8");
const resetCss = await readFile(join(sourceDirectory, "styles/reset.css"), "utf8");
await writeFile(
  join(outputDirectory, "global.css"),
  `@import "./reset.css";\n@import "./stylex.css";\n\n${globalCss}`,
);
await writeFile(join(outputDirectory, "reset.css"), resetCss);
