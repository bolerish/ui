import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

test("palette check rejects manually edited output", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-palette-"));
  try {
    for (const folder of ["palette", "src"]) {
      await mkdir(join(directory, folder), { recursive: true });
    }
    for (const path of [
      "palette/generate-palette.ts",
      "palette/palette-color.ts",
      "palette.oklch.json",
      "src/color-palette.stylex.ts",
    ]) {
      await copyFile(new URL(`../${path}`, import.meta.url), join(directory, path));
    }
    const target = join(directory, "src/color-palette.stylex.ts");
    await writeFile(
      target,
      (await readFile(target, "utf8")).replace('white: "#FFFFFF"', 'white: "#FEFEFE"'),
    );
    assert.throws(
      () =>
        execFileSync(
          process.execPath,
          ["--experimental-strip-types", join(directory, "palette/generate-palette.ts"), "--check"],
          { stdio: "pipe" },
        ),
      /Command failed/,
    );
    execFileSync(process.execPath, [
      "--experimental-strip-types",
      join(directory, "palette/generate-palette.ts"),
    ]);
    execFileSync(process.execPath, [
      "--experimental-strip-types",
      join(directory, "palette/generate-palette.ts"),
      "--check",
    ]);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
