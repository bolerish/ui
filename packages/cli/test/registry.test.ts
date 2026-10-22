import assert from "node:assert/strict";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { isRegistryItem, parseRegistryItem } from "@bolerish/registry";

import { add } from "../dist/add.js";
import { resolveComponent } from "../dist/registry.js";

const item = {
  name: "notice",
  primaryExport: "Notice",
  dependencies: [],
  registryDependencies: [],
  files: [{ path: "notice.ts", content: "" }],
};

test("registry parsing returns owned data and preserves empty file content", () => {
  const input = structuredClone(item);
  const parsed = parseRegistryItem({ ...input, extra: true });
  input.files[0].content = "changed";
  assert.deepEqual(parsed, item);
  assert.equal(isRegistryItem(item), true);
  assert.equal(isRegistryItem({ ...item, files: [null] }), false);
});

test("registry parsing identifies malformed fields", () => {
  for (const [value, message] of [
    [[], /expected an object/],
    [{ ...item, name: "" }, /name must/],
    [{ ...item, primaryExport: null }, /primaryExport must/],
    [{ ...item, dependencies: [false] }, /dependencies\[0\]/],
    [{ ...item, registryDependencies: null }, /registryDependencies must/],
    [{ ...item, files: null }, /files must/],
    [{ ...item, files: [null] }, /files\[0\] must/],
    [{ ...item, files: [{ path: 1, content: "" }] }, /files\[0\]\.path/],
    [{ ...item, files: [{ path: "notice.ts", content: null }] }, /files\[0\]\.content/],
  ] as const) {
    assert.throws(() => parseRegistryItem(value), message);
  }
});

test("remote registry defaults apply only to omitted fields", async () => {
  const url = (value: unknown) =>
    `data:application/json,${encodeURIComponent(JSON.stringify(value))}`;
  const parsed = await resolveComponent(url({ name: "notice", dependencies: [], files: [] }));
  assert.equal(parsed.primaryExport, "notice");
  await assert.rejects(
    resolveComponent(url({ ...item, registryDependencies: null })),
    /registryDependencies must/,
  );
});

test("invalid remote registry reports its field before writing any project files", async () => {
  const directory = await mkdtemp(join(tmpdir(), "bolerish-registry-"));
  try {
    const value = { ...item, files: [{ path: "notice.ts", content: false }] };
    await assert.rejects(
      add(directory, `data:application/json,${encodeURIComponent(JSON.stringify(value))}`, {
        defaults: true,
        skipDependencyInstall: true,
      }),
      /files\[0\]\.content/,
    );
    assert.deepEqual(await readdir(directory), []);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
