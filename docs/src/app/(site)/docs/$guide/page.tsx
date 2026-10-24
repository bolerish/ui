import { createFileRoute } from "@tanstack/react-router";

import { documentHead } from "../../../../shared/lib/head";
import { DocumentPage } from "../_components/DocumentPage";
import { loadDocumentPage } from "../_lib/documents";
export const Route = createFileRoute("/(site)/docs/$guide/")({
  ssr: true,
  pendingMs: Infinity,
  staleTime: 300_000,
  loader: ({ params }) => loadDocumentPage("guide", params.guide),
  head: ({ loaderData }) => documentHead(loaderData?.page, "en"),
  component: Page,
});
function Page() {
  return <DocumentPage {...Route.useLoaderData()} />;
}
