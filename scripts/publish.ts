import { execFile, spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";

const executeFile = promisify(execFile);
const registryUrl = "https://registry.npmjs.org";
const publishArguments = ["publish", "--access", "public", "--no-provenance"];
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const packageDirectories = ["packages/tokens", "packages/ui"];

type Package = {
  name: string;
  version: string;
};

function run(command: string, arguments_: readonly string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, arguments_, { stdio: "inherit" });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}.`));
    });
  });
}

async function readPackage(directory: string): Promise<Package> {
  const source = await readFile(join(directory, "package.json"), "utf8");
  return JSON.parse(source) as Package;
}

async function isPublished(package_: Package) {
  try {
    await executeFile("npm", [
      "view",
      `${package_.name}@${package_.version}`,
      "version",
      "--json",
      `--registry=${registryUrl}`,
    ]);
    return true;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "stdout" in error &&
      typeof error.stdout === "string"
    ) {
      let response: { error?: { code?: string } } | undefined;
      try {
        response = JSON.parse(error.stdout);
      } catch {
        /* Preserve the original npm failure. */
      }
      if (response?.error?.code === "E404") return false;
    }
    throw error;
  }
}

for (const directory of packageDirectories) {
  const package_ = await readPackage(directory);

  if (await isPublished(package_)) {
    console.log(`${package_.name}@${package_.version} is already published.`);
    continue;
  }

  await run("pnpm", [
    "--dir",
    directory,
    ...publishArguments,
    ...(isGitHubActions ? ["--no-git-checks"] : []),
  ]);
}
