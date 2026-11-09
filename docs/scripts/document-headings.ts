import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import korean from "../src/docs/_config/locales/content.ko.json" with { type: "json" };

type Node = {
  type: string;
  name?: string;
  tagName?: string;
  value?: string;
  properties?: { id?: string };
  attributes?: { name: string; value?: unknown }[];
  children?: Node[];
  data?: unknown;
};
/** Export document metadata and the same heading IDs produced by rehype-slug. */
export function documentHeadings() {
  return (tree: Node, file?: { path?: string }) => {
    const headings: Record<string, { id: string; title: string }[]> = { en: [], ko: [] };
    const metadata: Record<string, { title: string; description: string }> = {
      en: { title: "", description: "" },
      ko: { title: "", description: "" },
    };
    const text = (node: Node): string => node.value ?? node.children?.map(text).join("") ?? "";
    function collectMetadata(node: Node, lang: string) {
      if (node.tagName === "h1" && !metadata[lang].title) metadata[lang].title = text(node).trim();
      if (node.tagName === "p" && metadata[lang].title && !metadata[lang].description)
        metadata[lang].description = text(node).replace(/\s+/g, " ").trim();
    }
    const imports = new Map<string, string>();
    for (const node of tree.children ?? []) {
      const data = node.data as
        | {
            estree?: {
              body?: {
                type: string;
                source?: { value: string };
                specifiers?: { local: { name: string } }[];
              }[];
            };
          }
        | undefined;
      for (const statement of data?.estree?.body ?? []) {
        if (statement.type === "ImportDeclaration" && statement.source?.value.endsWith("?raw")) {
          for (const specifier of statement.specifiers ?? [])
            imports.set(specifier.local.name, statement.source.value.slice(0, -4));
        }
      }
    }
    function appendMarkdown(source: string, lang: string) {
      renderToStaticMarkup(
        createElement(
          Markdown,
          {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              () => (root: Node) => {
                function collect(node: Node) {
                  collectMetadata(node, lang);
                  if (node.tagName === "h2" && node.properties?.id)
                    headings[lang].push({ id: node.properties.id, title: text(node) });
                  node.children?.forEach(collect);
                }
                collect(root);
              },
            ],
          },
          source,
        ),
      );
    }
    function visit(node: Node, locale?: string) {
      if (node.name === "LocaleContent")
        locale = node.attributes?.find((attr) => attr.name === "locale")?.value as string;
      if (locale) collectMetadata(node, locale);
      if (node.tagName === "h2" && node.properties?.id) {
        for (const lang of locale ? [locale] : ["en", "ko"])
          headings[lang].push({ id: node.properties.id, title: text(node) });
      }
      if (node.name === "LocalizedMarkdown") {
        const value = node.attributes?.find((attr) => attr.name === "text")?.value;
        const expression = value as {
          data?: { estree?: { body?: { expression?: { value?: string } }[] } };
        };
        const source =
          typeof value === "string"
            ? value
            : expression?.data?.estree?.body?.[0]?.expression?.value;
        if (source)
          for (const lang of locale ? [locale] : ["en", "ko"]) {
            const translated =
              lang === "ko" ? ((korean as Record<string, string>)[source] ?? source) : source;
            appendMarkdown(translated, lang);
          }
      }
      if (node.name === "Guideline") {
        for (const [lang, prop] of [
          ["en", "english"],
          ["ko", "content"],
        ]) {
          const value = node.attributes?.find((attr) => attr.name === prop)?.value as {
            data?: { estree?: { body?: { expression?: { name?: string } }[] } };
          };
          const identifier = value?.data?.estree?.body?.[0]?.expression?.name;
          const path = identifier && imports.get(identifier);
          if (!path || !file?.path)
            throw new Error("Cannot resolve Guideline source for heading metadata");
          appendMarkdown(readFileSync(resolve(dirname(file.path), path), "utf8"), lang);
        }
      }
      node.children?.forEach((child) => visit(child, locale));
    }
    visit(tree);
    if (file?.path)
      for (const lang of ["en", "ko"])
        if (!metadata[lang].title || !metadata[lang].description)
          throw new Error(`Missing ${lang} document title or summary: ${file.path}`);
    tree.children?.push({
      type: "mdxjsEsm",
      value: "",
      data: {
        estree: {
          type: "Program",
          sourceType: "module",
          body: [
            ["documentHeadings", headings],
            ["documentMetadata", metadata],
          ].map(([name, value]) => ({
            type: "ExportNamedDeclaration",
            specifiers: [],
            source: null,
            declaration: {
              type: "VariableDeclaration",
              kind: "const",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: { type: "Identifier", name },
                  init: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "JSON" },
                      property: { type: "Identifier", name: "parse" },
                      computed: false,
                      optional: false,
                    },
                    arguments: [{ type: "Literal", value: JSON.stringify(value) }],
                    optional: false,
                  },
                },
              ],
            },
          })),
        },
      },
    });
  };
}
