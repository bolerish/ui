import assert from "node:assert/strict";
import test from "node:test";

import { getSections } from "./sections.ts";
test("unique Korean headings, fences and parent source boundaries", () => {
  const source =
    "# a\n## 자식\ntext\n```js\n# ignored\n~~~\n```\n# a\n# a-2\n~~~\n# ignored\n~~~\n# 끝 ###\n";
  const sections = getSections(source);
  assert.deepEqual(
    sections.map((s) => s.id),
    ["a", "자식", "a-2", "a-2-2", "끝"],
  );
  assert.equal(
    source.slice(sections[0].start, sections[0].end),
    source.slice(0, source.indexOf("# a\n", 1)),
  );
  assert.equal(getSections("# C#\n")[0].title, "C#");
});

test("shorter and mismatched fences preserve exact section boundaries", () => {
  for (const [open, short, mismatch] of [
    ["````", "```", "~~~~"],
    ["~~~~", "~~~", "````"],
  ]) {
    const child = `## Child\n${open}\n# Hidden\n${short}\n## Still hidden\n${mismatch}\n# Also hidden\n${open}\nbody\n`;
    const sibling = "## Sibling\nsibling body\n";
    const source = `# Parent\nintro\n${child}${sibling}# Next\nend\n`;
    const sections = getSections(source);
    assert.deepEqual(
      sections.map(({ id }) => id),
      ["parent", "child", "sibling", "next"],
    );
    assert.equal(
      source.slice(sections[0].start, sections[0].end),
      `# Parent\nintro\n${child}${sibling}`,
    );
    assert.equal(source.slice(sections[1].start, sections[1].end), child);
    assert.equal(source.slice(sections[2].start, sections[2].end), sibling);
    assert.equal(source.slice(sections[3].start, sections[3].end), "# Next\nend\n");
  }
});
