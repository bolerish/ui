import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("foundation source filenames use English by default and kr for Korean", async () => {
  const source = new URL("./", import.meta.url);
  const order = JSON.parse(await readFile(new URL("order.json", source), "utf8"));
  for (const { slug } of order) {
    const directory = new URL(`${slug}/`, source);
    const english = await readFile(new URL("guidelines.md", directory), "utf8");
    const korean = await readFile(new URL("guidelines.kr.md", directory), "utf8");
    assert.doesNotMatch(english, /[가-힣]/, slug);
    assert.match(korean, /[가-힣]/, slug);
    assert.ok(!(await readdir(directory)).includes("guidelines.en.md"), slug);
    const mdx = await readFile(new URL("docs.mdx", directory), "utf8");
    assert.match(mdx, /import english from "\.\/guidelines\.md\?raw"/);
    assert.match(mdx, /import guidelines from "\.\/guidelines\.kr\.md\?raw"/);
  }
});
