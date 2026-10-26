import { notFound } from "@tanstack/react-router";
import { lazy, type ComponentType } from "react";

import { findDocument } from "./catalog";
import { preloadExamples } from "./examples";

const modules = import.meta.glob<{ default: ComponentType }>([
  "../_content/components/*/docs.mdx",
  "../_content/foundations/*/docs.mdx",
  "../_content/api/*/docs.mdx",
  "../_content/guides/*.mdx",
]);
export const loadedPages: Record<string, ComponentType> = {};
const loadingPages: Record<string, Promise<{ default: ComponentType }>> = {};
export function documentKey(page: { section: string; slug: string }) {
  return page.section === "guide"
    ? `../_content/guides/${page.slug}.mdx`
    : `../_content/${page.section}/${page.slug}/docs.mdx`;
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
  await Promise.all([
    loadDocument(documentKey(page)),
    page.section === "api" ? undefined : preloadExamples(page.slug),
  ]);
  return { page };
}
