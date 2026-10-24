import { createFileRoute } from "@tanstack/react-router";

import { DocumentPage } from "../documentation/DocumentPage";
import { loadDocumentPage } from "../documentation/documents";
import { documentHead } from "../documentation/head";
export const Route = createFileRoute("/docs/$guide_/ko")({
  ssr: true,
  pendingMs: Infinity,
  staleTime: 300_000,
  loader: ({ params }) => loadDocumentPage("guide", params.guide, "ko"),
  head: ({ loaderData }) => documentHead(loaderData?.page, "ko"),
  component: Page,
});
function Page() {
  return <DocumentPage {...Route.useLoaderData()} />;
}
