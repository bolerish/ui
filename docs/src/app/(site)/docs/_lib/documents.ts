import { notFound } from "@tanstack/react-router";
import { type ComponentType } from "react";

import { findDocument } from "./catalog";
import { preloadExamples } from "./examples";

const modules = import.meta.glob<{
  default: ComponentType;
  documentHeadings?: Record<string, { id: string; title: string }[]>;
}>([
  "../_content/components/*/docs.mdx",
  "../_content/foundations/*/docs.mdx",
  "../_content/api/*/docs.mdx",
  "../_content/guides/*.mdx",
]);
const loadingPages: Record<
  string,
  Promise<{
    default: ComponentType;
    documentHeadings?: Record<string, { id: string; title: string }[]>;
  }>
> = {};
export function documentKey(page: { section: string; slug: string }) {
  return page.section === "guide"
    ? `../_content/guides/${page.slug}.mdx`
    : `../_content/${page.section}/${page.slug}/docs.mdx`;
}
export function loadDocument(key: string) {
  return (loadingPages[key] ??= modules[key]()
    .then(async (module) => {
      if (!key.includes("/_content/api/") && !key.includes("/_content/guides/"))
        await preloadExamples(key.split("/").at(-2)!);
      return module;
    })
    .catch((error) => {
      delete loadingPages[key];
      throw error;
    }));
}
export async function loadDocumentPage(section: string, slug: string, locale?: string) {
  if (locale !== undefined && locale !== "ko") throw notFound();
  const page = findDocument(section, slug);
  if (!page) throw notFound();
  await loadDocument(documentKey(page));
  return { page };
}
