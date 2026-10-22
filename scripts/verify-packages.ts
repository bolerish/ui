import { execFile as execFileCallback } from "node:child_process";
import { mkdir, readdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const packageDirectories = ["packages/tokens", "packages/ui"];
const outputDirectory = resolve(".artifacts/packages");

type PackageManifest = {
  bin?: string | Record<string, string>;
  exports?: unknown;
  name: string;
};

function getExportTargets(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value !== "object" || value === null) return [];

  return Object.values(value).flatMap(getExportTargets);
}

async function getArchiveEntries(archivePath: string) {
  const { stdout } = await execFile("tar", ["-tzf", archivePath]);
  return new Set(stdout.trim().split("\n").filter(Boolean));
}

function verifyEntry(
  entries: Set<string>,
  target: string,
  packageName: string,
  requiresDeclaration = true,
) {
  if (!target.startsWith("./")) {
    throw new Error(`${packageName} exports a non-relative target: ${target}`);
  }

  const entryPath = `package/${target.slice(2)}`;
  if (!entries.has(entryPath)) {
    throw new Error(`${packageName} is missing its exported file: ${target}`);
  }

  if (!requiresDeclaration || !target.endsWith(".js")) return;

  const declarationPath = entryPath.replace(/\.js$/, ".d.ts");
  if (!entries.has(declarationPath)) {
    throw new Error(`${packageName} is missing a declaration file for: ${target}`);
  }
}

async function verifyPackage(directory: string) {
  const previousArchives = new Set(await readdir(outputDirectory));
  await execFile("pnpm", [
    "--filter",
    `./${directory}`,
    "pack",
    "--pack-destination",
    outputDirectory,
  ]);

  const archives = await readdir(outputDirectory);
  const archiveName = archives.find((archive) => !previousArchives.has(archive));
  if (!archiveName) throw new Error(`Could not find the tarball for ${directory}.`);

  const entries = await getArchiveEntries(join(outputDirectory, archiveName));
  const packageJsonEntry = [...entries].find((entry) => entry.endsWith("/package.json"));
  if (!packageJsonEntry) throw new Error(`${directory} tarball does not contain package.json.`);

  const { stdout } = await execFile("tar", [
    "-xOf",
    join(outputDirectory, archiveName),
    packageJsonEntry,
  ]);
  const manifest = JSON.parse(stdout) as PackageManifest;
  const targets = getExportTargets(manifest.exports);
  let binTargets: string[] = [];
  if (typeof manifest.bin === "string") binTargets = [manifest.bin];
  else if (typeof manifest.bin === "object" && manifest.bin !== null)
    binTargets = Object.values(manifest.bin);

  for (const target of targets) verifyEntry(entries, target, manifest.name);
  for (const target of binTargets) verifyEntry(entries, target, manifest.name, false);
}

await rm(outputDirectory, { force: true, recursive: true });
await mkdir(outputDirectory, { recursive: true });

try {
  for (const directory of packageDirectories) await verifyPackage(directory);
} finally {
  await rm(outputDirectory, { force: true, recursive: true });
}
