import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { init } from "../dist/init.js";
import { newComponent } from "../dist/new-component.js";
import { writeTsconfig } from "./helpers.ts";

test("new creates a StyleX component without overwriting an existing file", async () => {
  const projectDirectory = await mkdtemp(join(tmpdir(), "bolerish-cli-"));

  try {
    await writeTsconfig(projectDirectory);
    await init(projectDirectory, { defaults: true, "skip-dependencies": true });
    await newComponent(projectDirectory, "status-chip");

    const componentPath = join(projectDirectory, "src/components/ui/status-chip.tsx");
    const componentSource = await readFile(componentPath, "utf8");
    assert.match(componentSource, /export function StatusChip/);
    assert.match(componentSource, /from "@\/styles\/tokens\/semantic\.stylex"/);
    assert.match(componentSource, /Omit<ComponentProps<"div">, "className" \| "style">/);
    assert.doesNotMatch(componentSource, /className=|style=\{\{/);
    await assert.rejects(
      () => newComponent(projectDirectory, "status-chip"),
      /will not be overwritten/,
    );
  } finally {
    await rm(projectDirectory, { recursive: true });
  }
});
