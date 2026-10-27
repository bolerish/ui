import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("the distributable contains a complete unique snapshot without tests", async () => {
  const root = new URL("./dist/", import.meta.url);
  const files = await readdir(root);
  assert.ok(files.includes("cli.js"));
  assert.ok(files.includes("documents.json"));
  assert.ok(files.every((file) => !file.includes(".test.")));
  const catalog = JSON.parse(await readFile(new URL("documents.json", root), "utf8"));
  const ids = catalog.documents.map(({ id }: { id: string }) => id);
  assert.equal(new Set(ids).size, ids.length);
  const components = await readdir(
    new URL("../../docs/src/app/(site)/docs/_content/components/", import.meta.url),
  );
  for (const name of components) assert.ok(ids.includes(`components/${name}`), name);
  assert.ok(catalog.documents.every(({ content }: { content: string }) => content.trim()));
});
