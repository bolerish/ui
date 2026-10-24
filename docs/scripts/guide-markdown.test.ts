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
  const english = guideMarkdown(source, "en");
  const korean = guideMarkdown(source, "ko");
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
    assert.throws(() => guideMarkdown(source, "en"));
});
