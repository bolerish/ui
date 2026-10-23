import { MDXProvider } from "@mdx-js/react";
import { notFound } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";

import { findDocument } from "./catalog";
import { documentationComponents } from "./components";
import { preloadExamples } from "./examples";
import { TableOfContents } from "./TableOfContents";

const modules = import.meta.glob<{ default: ComponentType }>([
  "../components/*/docs.mdx",
  "../foundations/*/docs.mdx",
  "../patterns/*/docs.mdx",
  "../getting-started.mdx",
]);
const loadedPages: Record<string, ComponentType> = {};
const loadingPages: Record<string, Promise<{ default: ComponentType }>> = {};
function documentKey(page: { section: string; slug: string }) {
  return page.section === "guide"
    ? "../getting-started.mdx"
    : `../${page.section}/${page.slug}/docs.mdx`;
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
const pages = Object.fromEntries(
  Object.keys(modules).map((key) => [key, lazy(() => loadDocument(key))]),
);
export function DocumentPage({ page }: Awaited<ReturnType<typeof loadDocumentPage>>) {
  const key = documentKey(page);
  const Page = loadedPages[key] ?? pages[key];
  return (
    <div className="document-layout" key={key}>
      <article className="document">
        <MDXProvider components={documentationComponents}>
          <Suspense fallback={null}>
            <Page />
          </Suspense>
        </MDXProvider>
      </article>
      <TableOfContents />
    </div>
  );
}

export async function loadDocumentPage(section: string, slug: string, locale?: string) {
  if (locale !== undefined && locale !== "ko") throw notFound();
  const page = findDocument(section, slug);
  if (!page) throw notFound();
  await Promise.all([loadDocument(documentKey(page)), preloadExamples(page.slug)]);
  return { page };
}
