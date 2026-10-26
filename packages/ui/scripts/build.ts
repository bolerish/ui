import { execFile as execFileCallback } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, relative, resolve } from "node:path";
import { promisify } from "node:util";

import stylex from "@stylexjs/unplugin/esbuild";
import reactCompiler from "babel-plugin-react-compiler";
import { build, type Plugin } from "esbuild";

const sourceDirectory = "src";
const distributionDirectory = "dist";
const execFile = promisify(execFileCallback);
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
    gradient: join(sourceDirectory, "gradient.ts"),
    surface: join(sourceDirectory, "surface.ts"),
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
      const importedPath = resolve(dirname(importer), path).replace(/\.[jt]sx?$/, "");
      if (importedPath !== resolve(entryPoints[name]).replace(/\.[jt]sx?$/, "")) return;
      return { path: `./${name}.js`, external: true };
    });
  },
};

const outputDirectory = await mkdtemp(".dist-build-");
try {
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
  const refraction = await readFile(join(sourceDirectory, "styles/liquid-refraction.svg"), "utf8");
  await writeFile(
    join(outputDirectory, "global.css"),
    `@import "./reset.css";\n@import "./stylex.css";\n\n${globalCss}`,
  );
  await writeFile(join(outputDirectory, "reset.css"), resetCss);
  await writeFile(join(outputDirectory, "liquid-refraction.svg"), refraction);

  await execFile(process.execPath, [
    "node_modules/typescript/bin/tsc",
    "-p",
    "tsconfig.build.json",
    "--outDir",
    outputDirectory,
  ]);
  const files = (await readdir(outputDirectory, { recursive: true, withFileTypes: true }))
    .filter((file) => file.isFile())
    .map((file) => relative(outputDirectory, join(file.parentPath, file.name)));
  // Keep live import paths available while development servers read the previous build.
  for (const file of files) {
    const target = join(distributionDirectory, file);
    await mkdir(dirname(target), { recursive: true });
    await rename(join(outputDirectory, file), target);
  }
  const currentFiles = new Set(files);
  for (const file of await readdir(distributionDirectory, {
    recursive: true,
    withFileTypes: true,
  })) {
    if (!file.isFile()) continue;
    const path = join(file.parentPath, file.name);
    if (!currentFiles.has(relative(distributionDirectory, path))) await rm(path);
  }
} finally {
  await rm(outputDirectory, { force: true, recursive: true });
}
