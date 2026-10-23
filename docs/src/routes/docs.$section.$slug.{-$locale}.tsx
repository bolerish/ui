import { createFileRoute, notFound } from "@tanstack/react-router";

import { DocumentPage, loadDocumentPage } from "../documentation/DocumentPage";
export const Route = createFileRoute("/docs/$section/$slug/{-$locale}")({
  ssr: true,
  pendingMs: Infinity,
  staleTime: 300_000,
  loader: ({ params }) => {
    if (!["components", "foundations", "patterns"].includes(params.section)) throw notFound();
    return loadDocumentPage(params.section, params.slug, params.locale);
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.page.title ?? "Not found"} · bolerish/ui` }],
  }),
  component: Page,
});
function Page() {
  return <DocumentPage {...Route.useLoaderData()} />;
}
