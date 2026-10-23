import { createFileRoute } from "@tanstack/react-router";

import { DocumentPage, loadDocumentPage } from "../documentation/DocumentPage";
export const Route = createFileRoute("/docs/getting-started/{-$locale}")({
  ssr: true,
  pendingMs: Infinity,
  staleTime: 300_000,
  loader: ({ params }) => loadDocumentPage("guide", "getting-started", params.locale),
  head: () => ({ meta: [{ title: "Get started · bolerish/ui" }] }),
  component: Page,
});
function Page() {
  return <DocumentPage {...Route.useLoaderData()} />;
}
