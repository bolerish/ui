import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { registryVersion } from "@bolerish/registry";

import { hasConfig, readConfig, resolveConfigAlias } from "./config.js";
import { inspectViteConfig } from "./source.js";

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type Check = {
  detail: string;
  name: string;
  status: "pass" | "warn";
};

const entryFileNames = [
  "src/main.tsx",
  "src/main.jsx",
  "src/main.ts",
  "src/main.js",
  "src/index.tsx",
  "src/index.jsx",
  "src/index.ts",
  "src/index.js",
  "src/app/layout.tsx",
  "src/app/layout.jsx",
  "app/layout.tsx",
  "app/layout.jsx",
];

const viteConfigFileNames = [
  "vite.config.ts",
  "vite.config.mts",
  "vite.config.js",
  "vite.config.mjs",
];

const tokenFileNames = ["color-palette.stylex.ts", "semantic.stylex.ts", "themes.stylex.ts"];

function isNotFoundError(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

async function readProjectFile(projectDirectory: string, fileName: string) {
  try {
    return await readFile(resolve(projectDirectory, fileName), "utf8");
  } catch (error) {
    if (!isNotFoundError(error)) throw error;
    return undefined;
  }
}

async function readPackageJson(projectDirectory: string): Promise<PackageJson | undefined> {
  const source = await readProjectFile(projectDirectory, "package.json");
  return source === undefined ? undefined : (JSON.parse(source) as PackageJson);
}

async function readEntrySources(projectDirectory: string) {
  const sources = await Promise.all(
    entryFileNames.map((fileName) => readProjectFile(projectDirectory, fileName)),
  );
  return sources.filter((source): source is string => source !== undefined);
}

async function hasStylexCompiler(projectDirectory: string) {
  const sources = await Promise.all(
    viteConfigFileNames.map((fileName) => readProjectFile(projectDirectory, fileName)),
  );
  return sources.some((source) => source !== undefined && inspectViteConfig(source)?.hasCompiler);
}

async function hasTokenFiles(tokenDirectory: string) {
  for (const fileName of tokenFileNames) {
    try {
      await access(resolve(tokenDirectory, fileName));
    } catch (error) {
      if (!isNotFoundError(error)) throw error;
      return false;
    }
  }
  return true;
}

function hasDependency(packageJson: PackageJson | undefined, dependency: string) {
  return Boolean(
    packageJson?.dependencies?.[dependency] ?? packageJson?.devDependencies?.[dependency],
  );
}

async function inspectLocalConfiguration(projectDirectory: string): Promise<Check[]> {
  if (!(await hasConfig(projectDirectory))) {
    return [
      {
        detail: "Run `bolerish init` to configure UI and styles aliases.",
        name: ".bolerish.json",
        status: "warn",
      },
    ];
  }

  const config = await readConfig(projectDirectory);
  try {
    const uiDirectory = await resolveConfigAlias(projectDirectory, config.aliases.ui, "aliases.ui");
    const tokenDirectory = await resolveConfigAlias(
      projectDirectory,
      config.aliases.styles,
      "aliases.styles",
    );
    const tokenCheck: Check =
      (await hasTokenFiles(resolve(tokenDirectory, "tokens"))) ||
      (await hasTokenFiles(tokenDirectory))
        ? {
            detail: `${config.aliases.styles} contains local token sources.`,
            name: "Local tokens",
            status: "pass",
          }
        : {
            detail: `Create local token sources in ${config.aliases.styles} with \`bolerish init --force\`.`,
            name: "Local tokens",
            status: "warn",
          };

    const versions = [
      ["Foundation", config.version],
      ...Object.entries(config.components ?? {}),
    ] as const;
    const versionChecks: Check[] = versions.map(([name, version]) => ({
      name: `Installed source (${name})`,
      status: version === registryVersion ? "pass" : "warn",
      detail:
        version === undefined || version === null
          ? "Version unknown. Compare local sources before updating; preserve local edits."
          : `Recorded ${version}; bundled registry ${registryVersion}. Metadata does not verify local edits.`,
    }));

    return [
      ...versionChecks,
      {
        detail: `${config.aliases.ui} → ${uiDirectory}`,
        name: "UI path",
        status: "pass",
      },
      tokenCheck,
    ];
  } catch (error) {
    return [
      {
        detail: error instanceof Error ? error.message : "Could not resolve bolerish aliases.",
        name: "Aliases",
        status: "warn",
      },
    ];
  }
}

export async function doctor(projectDirectory: string) {
  const packageJson = await readPackageJson(projectDirectory);
  const entrySources = await readEntrySources(projectDirectory);
  const checks = await inspectLocalConfiguration(projectDirectory);

  if (hasDependency(packageJson, "@stylexjs/stylex")) {
    checks.push({
      detail: "@stylexjs/stylex is installed.",
      name: "StyleX runtime",
      status: "pass",
    });
  } else {
    checks.push({
      detail:
        "It is installed automatically by the first `bolerish add`. Use --skip-dependencies to skip installation.",
      name: "StyleX runtime",
      status: "warn",
    });
  }

  if (await hasStylexCompiler(projectDirectory)) {
    checks.push({
      detail: "A Vite plugins array enables the StyleX compiler.",
      name: "StyleX compiler",
      status: "pass",
    });
  } else {
    checks.push({
      detail:
        "Could not verify a Vite StyleX compiler. Other bundlers require manual verification. Vite users can run `bolerish init --vite`.",
      name: "StyleX compiler",
      status: "warn",
    });
  }

  const hasCssEntry = entrySources.some((source) => /import\s+["'][^"']+\.css["']/.test(source));
  checks.push(
    hasCssEntry
      ? {
          detail: "An application entry imports a CSS entry point for StyleX output.",
          name: "CSS entry point",
          status: "pass",
        }
      : {
          detail: "Import an application CSS file from an entry point so StyleX can emit CSS.",
          name: "CSS entry point",
          status: "warn",
        },
  );

  if (hasDependency(packageJson, "@stylexjs/unplugin")) {
    checks.push({
      detail: "@stylexjs/unplugin is installed.",
      name: "StyleX build plugin",
      status: "pass",
    });
  } else {
    checks.push({
      detail: "Add @stylexjs/unplugin to your bundler configuration, such as Vite or esbuild.",
      name: "StyleX build plugin",
      status: "warn",
    });
  }

  for (const check of checks) {
    console.log(`${check.status === "pass" ? "✓" : "!"} ${check.name}: ${check.detail}`);
  }

  return checks.every((check) => check.status === "pass");
}
