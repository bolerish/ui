import { notFound } from "@tanstack/react-router";
import { type ComponentType } from "react";

import type { DocumentMetadata } from "@/shared/lib/head";
import { documentPath } from "@/shared/lib/paths";

import { catalog, findDocument } from "./catalog";
import { preloadExamples } from "./examples";

const modules = import.meta.glob<DocumentModule>([
  "../_content/components/*/docs.mdx",
  "../_content/foundations/*/docs.mdx",
  "../_content/api/*/docs.mdx",
  "../_content/guides/*.mdx",
]);
type DocumentModule = {
  default: ComponentType;
  documentHeadings?: Record<string, { id: string; title: string }[]>;
  documentMetadata: Record<"en" | "ko", DocumentMetadata>;
};
const loadedDocuments: Record<string, DocumentModule> = {};
const loadingPages: Record<string, Promise<DocumentModule>> = {};
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
      loadedDocuments[key] = module;
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
  const module = await loadDocument(documentKey(page));
  return { page, metadata: module.documentMetadata };
}

export function readDocument(key: string) {
  if (loadedDocuments[key]) return loadedDocuments[key];
  throw loadDocument(key);
}

export async function preloadDocumentPath(pathname: string) {
  const locale = pathname.endsWith("/ko") ? "ko" : "en";
  const page = catalog.find((page) => documentPath(page, locale) === pathname);
  if (page) await loadDocument(documentKey(page));
}
