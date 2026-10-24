import { createFileRoute, notFound } from "@tanstack/react-router";

import { DocumentPage } from "../documentation/DocumentPage";
import { loadDocumentPage } from "../documentation/documents";
import { documentHead } from "../documentation/head";
export const Route = createFileRoute("/docs/$section/$slug/{-$locale}")({
  ssr: true,
  pendingMs: Infinity,
  staleTime: 300_000,
  loader: ({ params }) => {
    if (!["components", "foundations", "patterns"].includes(params.section)) throw notFound();
    return loadDocumentPage(params.section, params.slug, params.locale);
  },
  head: ({ loaderData, params }) =>
    documentHead(loaderData?.page, params.locale === "ko" ? "ko" : "en"),
  component: Page,
});
function Page() {
  return <DocumentPage {...Route.useLoaderData()} />;
}
