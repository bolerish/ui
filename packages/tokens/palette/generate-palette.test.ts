import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFile, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { SourceTextModule, SyntheticModule } from "node:vm";

test("palette generation preserves authored colors, checks output and rejects invalid sources", async () => {
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
      (await readFile(target, "utf8")).replace(
        'white: "oklch(100% 0 0)"',
        'white: "oklch(99% 0 0)"',
      ),
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
    const generated = new SourceTextModule(stripTypeScriptTypes(await readFile(target, "utf8")));
    const stylex = new SyntheticModule(["defineVars"], function () {
      this.setExport("defineVars", (values: Record<string, string>) => values);
    });
    await generated.link(() => stylex);
    await generated.evaluate();
    const source = join(directory, "palette.oklch.json");
    const authored = JSON.parse(await readFile(source, "utf8"));
    assert.deepEqual(
      { ...(generated.namespace as { colorPalette: Record<string, string> }).colorPalette },
      authored,
    );

    const validOutput = await readFile(target, "utf8");
    for (const value of ["#FFFFFF", "oklch(50% 0.5 30)"]) {
      await writeFile(source, JSON.stringify({ ...authored, white: value }));
      assert.throws(
        () =>
          execFileSync(
            process.execPath,
            ["--experimental-strip-types", join(directory, "palette/generate-palette.ts")],
            { stdio: "pipe" },
          ),
        /Command failed/,
      );
      assert.equal(await readFile(target, "utf8"), validOutput);
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
