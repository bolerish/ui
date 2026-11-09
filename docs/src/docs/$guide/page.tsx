import { createFileRoute } from "@tanstack/react-router";

import { loadDocumentPage } from "@/docs/_shared/documents";
import { DocumentPage } from "@/docs/_ui/DocumentPage";
import { documentHead } from "@/shared/lib/head";
export const Route = createFileRoute("/docs/$guide/")({
  ssr: true,
  pendingMs: Infinity,
  staleTime: 300_000,
  loader: ({ params }) => loadDocumentPage("guide", params.guide),
  head: ({ loaderData }) => documentHead(loaderData?.page, "en", loaderData?.metadata.en),
  component: Page,
});
function Page() {
  return <DocumentPage {...Route.useLoaderData()} />;
}
