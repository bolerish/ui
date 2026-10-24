import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("all canonical MDX pages are independent of Storybook and retain raw examples", async () => {
  let count = 0;
  for (const group of ["components", "foundations", "patterns"]) {
    const root = new URL(`../ui/docs/${group}/`, import.meta.url);
    for (const directory of await readdir(root, { withFileTypes: true })) {
      if (!directory.isDirectory()) continue;
      if (!(await readdir(new URL(`${directory.name}/`, root))).includes("docs.mdx")) continue;
      const source = await readFile(new URL(`${directory.name}/docs.mdx`, root), "utf8");
      assert.doesNotMatch(source, /@storybook|<Meta /);
      for (const match of source.matchAll(/source=\{(\w+)\}/g)) {
        assert.ok(source.includes(`import ${match[1]} from "./`));
        assert.match(source, /\.tsx\?raw/);
      }
      count++;
    }
  }
  assert.equal(count, 73);
});
