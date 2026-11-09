import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { SourceTextModule, SyntheticModule } from "node:vm";

import mdx from "@mdx-js/rollup";
import * as jsxRuntime from "react/jsx-runtime";

import { documentHeadings } from "./document-headings.ts";

test("heading metadata preserves IDs and locale boundaries", () => {
  const tree: Parameters<ReturnType<typeof documentHeadings>>[0] = {
    type: "root",
    children: [
      {
        type: "mdxJsxFlowElement",
        name: "LocaleContent",
        attributes: [{ name: "locale", value: "en" }],
        children: [
          {
            type: "element",
            tagName: "h2",
            properties: { id: "public-api-2" },
            children: [{ type: "text", value: "Public API" }],
          },
        ],
      },
      {
        type: "mdxJsxFlowElement",
        name: "LocaleContent",
        attributes: [{ name: "locale", value: "ko" }],
        children: [
          {
            type: "element",
            tagName: "h2",
            properties: { id: "사용법" },
            children: [{ type: "text", value: "사용법" }],
          },
        ],
      },
      {
        type: "mdxJsxFlowElement",
        name: "LocalizedMarkdown",
        attributes: [{ name: "text", value: "## Basic example" }],
      },
    ],
  };
  documentHeadings()(tree);
  const exported = tree.children!.at(-1)!.data as {
    estree: {
      body: { declaration: { declarations: { init: { arguments: { value: string }[] } }[] } }[];
    };
  };
  const headings = JSON.parse(
    exported.estree.body[0].declaration.declarations[0].init.arguments[0].value,
  );
  assert.deepEqual(headings.en, [
    { id: "public-api-2", title: "Public API" },
    { id: "basic-example", title: "Basic example" },
  ]);
  assert.equal(headings.ko[0].id, "사용법");
  assert.equal(headings.ko.length, 2);
});

test("compiled MDX exports each locale's first heading and plain opening summary", async () => {
  const metadata = await compileMetadata(`
<LocaleContent locale="en">

# Button

Choose **emphasis** for the [next action](/docs/components/button) with \`variant\`.

This later paragraph must not replace the opening summary.

</LocaleContent>

<LocaleContent locale="ko">

# 버튼

다음 행동의 강조 수준을 선택합니다.

</LocaleContent>
`);
  assert.deepEqual(metadata, {
    en: { title: "Button", description: "Choose emphasis for the next action with variant." },
    ko: { title: "버튼", description: "다음 행동의 강조 수준을 선택합니다." },
  });
});

test("compiled Guideline metadata reads the imported language-specific Markdown", async () => {
  const path = fileURLToPath(
    new URL("../src/docs/_content/foundations/gradient/docs.mdx", import.meta.url),
  );
  const metadata = await compileMetadata(
    `
import english from "./guidelines.md?raw";
import korean from "./guidelines.kr.md?raw";

<Guideline content={korean} english={english} />
`,
    path,
  );
  assert.equal(metadata.en.title, "Gradient");
  assert.equal(metadata.ko.title, "그라디언트");
  assert.match(metadata.en.description, /^Extend content colors into an atmosphere\./);
  assert.match(metadata.ko.description, /^콘텐츠의 색을 화면의 분위기로 확장할 때 사용합니다\./);
});

test("incomplete language metadata stops the MDX build", async () => {
  await assert.rejects(
    compileMetadata('<LocaleContent locale="en">\n\n# Button\n\nAn action.\n\n</LocaleContent>'),
    /Missing ko document title or summary/,
  );
});

async function compileMetadata(source: string, path = "/metadata-fixture.mdx") {
  const compiled = await mdx({ rehypePlugins: [documentHeadings] }).transform(source, path);
  assert.ok(compiled);
  const module = new SourceTextModule(compiled.code);
  await module.link(async (specifier) => {
    if (specifier === "react/jsx-runtime")
      return new SyntheticModule(Object.keys(jsxRuntime), function () {
        for (const [name, value] of Object.entries(jsxRuntime)) this.setExport(name, value);
      });
    return new SyntheticModule(["default"], function () {
      this.setExport("default", "");
    });
  });
  await module.evaluate();
  return (
    module.namespace as {
      documentMetadata: Record<"en" | "ko", { title: string; description: string }>;
    }
  ).documentMetadata;
}
