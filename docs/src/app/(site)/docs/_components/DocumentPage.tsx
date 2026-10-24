import { MDXProvider } from "@mdx-js/react";
import { Suspense } from "react";

import { documentationComponents } from "../../../../shared/ui/markdown/components";
import { documentKey, loadedPages, pages } from "../_lib/documents";
import type { loadDocumentPage } from "../_lib/documents";
import { TableOfContents } from "./TableOfContents";

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
