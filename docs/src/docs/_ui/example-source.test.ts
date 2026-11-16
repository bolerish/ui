import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";

import { getExampleSource } from "./example-source.ts";

test("displayed component sources explicitly select usage ranges", () => {
  const root = new URL("../_content/components/", import.meta.url);
  for (const directory of readdirSync(root)) {
    const folder = new URL(`${directory}/`, root);
    const document = readFileSync(new URL("docs.mdx", folder), "utf8");
    for (const match of document.matchAll(/from "(\.\/[^"\n]+\.tsx)\?raw"/g)) {
      const source = readFileSync(new URL(match[1], folder), "utf8");
      const code = getExampleSource(source);
      assert.notEqual(code, source, `${directory}/${match[1]} needs an example range`);
      assert.ok(!code.includes("export default"), `${directory}/${match[1]}`);
    }
  }
});

test("published primary examples show usage without layout wrappers or rendering loops", () => {
  const root = new URL("../_content/components/", import.meta.url);
  for (const directory of readdirSync(root)) {
    const folder = new URL(`${directory}/`, root);
    const document = readFileSync(new URL("docs.mdx", folder), "utf8");
    const source = document.match(/import \w+ from "(\.\/[^"\n]+\?raw)"/);
    assert.ok(source, directory);
    const code = getExampleSource(readFileSync(new URL(source[1].slice(0, -4), folder), "utf8"));
    assert.doesNotMatch(code, /<(div|figure)\b|stylex\.create|\.map\(|Array\.from/, directory);
  }
});

test("shows Input usage without preview setup", () => {
  const source = readFileSync(
    new URL("../_content/components/input/States.tsx", import.meta.url),
    "utf8",
  );
  const code = getExampleSource(source);
  assert.ok(
    code.startsWith('<Input aria-label="Invalid email" aria-invalid defaultValue="min@" />'),
  );
  assert.ok(code.includes('aria-label="Disabled name" disabled defaultValue="Jordan Lee"'));
  assert.ok(!code.includes("import "));
  assert.ok(!code.includes("export default"));
  assert.ok(!code.includes("layout."));
  assert.ok(!code.includes("@example-"));
});

test("retains state required by the displayed component", () => {
  const source = readFileSync(
    new URL("../_content/components/date-picker/Default.tsx", import.meta.url),
    "utf8",
  );
  assert.equal(
    getExampleSource(source),
    [
      "const [date, setDate] = useState<Date | undefined>();",
      "",
      "<DatePicker value={date} onValueChange={setDate} />",
    ].join("\n"),
  );
});

test("keeps unmarked source unchanged", () => {
  const source = "<Button>Save</Button>\n";
  assert.equal(getExampleSource(source), source);
});

test("rejects incomplete, nested and unmatched ranges", () => {
  for (const source of [
    "/* @example-start */\n<Button />",
    "/* @example-end */",
    "/* @example-start */\n/* @example-start */\n/* @example-end */",
  ])
    assert.throws(() => getExampleSource(source));
});
