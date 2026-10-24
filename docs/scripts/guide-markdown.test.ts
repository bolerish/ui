import assert from "node:assert/strict";
import test from "node:test";

import { guideMarkdown } from "./guide-markdown.ts";

test("Markdown exports select a locale and preserve shared example code verbatim", () => {
  const source = [
    'import { LocaleContent } from "../documentation/locale";',
    '<LocaleContent locale="en">',
    "# Installation",
    "English instructions.",
    "</LocaleContent>",
    '<LocaleContent locale="ko">',
    "# 설치",
    "한국어 안내.",
    "</LocaleContent>",
    "```tsx",
    'import { Item } from "@bolerish/ui/item";',
    '<Item title="example" />;',
    "```",
  ].join("\n");
  const english = guideMarkdown(source, "en", "guide.mdx");
  const korean = guideMarkdown(source, "ko", "guide.mdx");
  assert.match(english, /# Installation\nEnglish instructions/);
  assert.doesNotMatch(english, /[가-힣]|LocaleContent/);
  assert.match(korean, /# 설치\n한국어 안내/);
  assert.doesNotMatch(korean, /English instructions|LocaleContent/);
  for (const result of [english, korean])
    assert.ok(
      result.includes(
        '```tsx\nimport { Item } from "@bolerish/ui/item";\n<Item title="example" />;\n```',
      ),
    );
});

test("unsupported guide syntax fails instead of publishing incomplete reference text", () => {
  for (const source of [
    '<LocaleContent locale="en">\n# Unclosed',
    "```tsx\nconst value = 1;",
    "<CustomPreview />",
    "import {\nItem\n} from 'package';",
    "</LocaleContent>",
    '<LocaleContent locale="en">\n<LocaleContent locale="ko">',
  ])
    assert.throws(() => guideMarkdown(source, "en", "guide.mdx"));
});

test("indented tilde and backtick fences preserve JSX, including shorter and different markers", () => {
  for (const marker of ["````", "~~~~"]) {
    const source = [
      "- Example",
      `  ${marker}tsx`,
      "  <Example />",
      "  ```",
      "  ~~~",
      "  <StillCode />",
      `  ${marker}`,
    ].join("\n");
    assert.equal(guideMarkdown(source, "en", "nested.mdx"), `${source}\n`);
  }
});

test("locale delimiters tolerate indentation, trailing whitespace, single quotes and CRLF", () => {
  const source =
    "  <LocaleContent locale='ko'>  \r\n한국어\r\n  </LocaleContent>  \r\n<LocaleContent locale=\"en\">\r\nEnglish\r\n</LocaleContent>";
  assert.equal(guideMarkdown(source, "ko", "locale.mdx"), "한국어\n");
  assert.equal(guideMarkdown(source, "en", "locale.mdx"), "English\n");
});

test("unsupported JSX and HTML report the required source filename, line and content", () => {
  for (const line of ["<Preview />", "<!-- comment -->", "<details>"]) {
    assert.throws(
      () => guideMarkdown(`Heading\n  ${line}`, "en", "guides/example.mdx"),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.equal(
          error.message,
          `guides/example.mdx:2: Guide JSX or HTML must be in a code fence: ${line}`,
        );
        return true;
      },
    );
  }
});

test("CRLF inside shared multi-line code is normalized without changing content", () => {
  assert.equal(
    guideMarkdown("```tsx\r\n<Example />\r\n<Other />\r\n```", "en", "windows.mdx"),
    "```tsx\n<Example />\n<Other />\n```\n",
  );
});
