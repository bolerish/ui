import { createFileRoute } from "@tanstack/react-router";

import { DocumentPage } from "../documentation/DocumentPage";
import { loadDocumentPage } from "../documentation/documents";
export const Route = createFileRoute("/docs/$guide_/ko")({
  ssr: true,
  pendingMs: Infinity,
  staleTime: 300_000,
  loader: ({ params }) => loadDocumentPage("guide", params.guide, "ko"),
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.page.title ?? "Not found"} · bolerish/ui` }],
  }),
  component: Page,
});
function Page() {
  return <DocumentPage {...Route.useLoaderData()} />;
}
