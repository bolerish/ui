import { notFound } from "@tanstack/react-router";
import { lazy, type ComponentType } from "react";

import { findDocument } from "../../../../shared/lib/catalog";
import { preloadExamples } from "../../../../shared/lib/examples";

const modules = import.meta.glob<{ default: ComponentType }>([
  "../../../../shared/ui/docs/components/*/docs.mdx",
  "../../../../shared/ui/docs/foundations/*/docs.mdx",
  "../../../../shared/ui/docs/patterns/*/docs.mdx",
  "../../../../shared/ui/docs/guides/*.mdx",
]);
export const loadedPages: Record<string, ComponentType> = {};
const loadingPages: Record<string, Promise<{ default: ComponentType }>> = {};
export function documentKey(page: { section: string; slug: string }) {
  return page.section === "guide"
    ? `../../../../shared/ui/docs/guides/${page.slug}.mdx`
    : `../../../../shared/ui/docs/${page.section}/${page.slug}/docs.mdx`;
}
async function loadDocument(key: string) {
  try {
    const module = await (loadingPages[key] ??= modules[key]());
    loadedPages[key] = module.default;
    return module;
  } catch (error) {
    delete loadingPages[key];
    throw error;
  }
}
export const pages = Object.fromEntries(
  Object.keys(modules).map((key) => [key, lazy(() => loadDocument(key))]),
);
export async function loadDocumentPage(section: string, slug: string, locale?: string) {
  if (locale !== undefined && locale !== "ko") throw notFound();
  const page = findDocument(section, slug);
  if (!page) throw notFound();
  await Promise.all([loadDocument(documentKey(page)), preloadExamples(page.slug)]);
  return { page };
}
