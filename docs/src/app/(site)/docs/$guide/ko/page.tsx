import { createFileRoute } from "@tanstack/react-router";

import { documentHead } from "../../../../../shared/lib/head";
import { DocumentPage } from "../../_components/DocumentPage";
import { loadDocumentPage } from "../../_lib/documents";
export const Route = createFileRoute("/(site)/docs/$guide/ko/")({
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
