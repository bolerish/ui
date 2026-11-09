import { MDXProvider } from "@mdx-js/react";
import * as stylex from "@stylexjs/stylex";
import { Suspense } from "react";

import { documentKey, readDocument } from "@/docs/_shared/documents";
import type { loadDocumentPage } from "@/docs/_shared/documents";
import { documentStyles } from "@/shared/styles/document";

import { documentationComponents } from "./components";
import { TableOfContents } from "./TableOfContents";

export function DocumentPage({ page }: Awaited<ReturnType<typeof loadDocumentPage>>) {
  const key = documentKey(page);
  const module = readDocument(key);
  const Page = module.default;
  return (
    <div {...stylex.props(styles.layout)} key={key}>
      <article {...stylex.props(documentStyles.article)} data-docs="document">
        <MDXProvider components={documentationComponents}>
          <Suspense fallback={null}>
            <Page />
          </Suspense>
        </MDXProvider>
      </article>
      <TableOfContents headings={module.documentHeadings ?? {}} />
    </div>
  );
}

// These dimensions preserve the documentation layout; controls keep their own DS behavior.
const styles = stylex.create({
  layout: {
    display: {
      default: "grid",
      "@media (max-width: 1150px)": "block",
    },
    gridTemplateColumns: "minmax(0, 1fr) 190px",
  },
});
