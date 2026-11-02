import { MDXProvider } from "@mdx-js/react";
import { Suspense } from "react";

import { Shell } from "@/app/(site)/_components/Shell";
import { documentKey, readDocument } from "@/app/(site)/docs/_lib/documents";
import type { loadDocumentPage } from "@/app/(site)/docs/_lib/documents";

import { documentationComponents } from "./components";
import { TableOfContents } from "./TableOfContents";

export function DocumentPage({ page }: Awaited<ReturnType<typeof loadDocumentPage>>) {
  const key = documentKey(page);
  const module = readDocument(key);
  const Page = module.default;
  return (
    <Shell>
      <div className="document-layout" key={key}>
        <article className="document">
          <MDXProvider components={documentationComponents}>
            <Suspense fallback={null}>
              <Page />
            </Suspense>
          </MDXProvider>
        </article>
        <TableOfContents headings={module.documentHeadings ?? {}} />
      </div>
    </Shell>
  );
}
