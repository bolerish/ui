import { createFileRoute, notFound } from "@tanstack/react-router";

import { loadDocumentPage } from "@/docs/_shared/documents";
import { DocumentPage } from "@/docs/_ui/DocumentPage";
import { documentHead } from "@/shared/lib/head";
export const Route = createFileRoute("/docs/$section/$slug/{-$locale}/")({
  ssr: true,
  pendingMs: Infinity,
  staleTime: 300_000,
  loader: ({ params }) => {
    if (!["components", "foundations", "api"].includes(params.section)) throw notFound();
    return loadDocumentPage(params.section, params.slug, params.locale);
  },
  head: ({ loaderData, params }) =>
    documentHead(
      loaderData?.page,
      params.locale === "ko" ? "ko" : "en",
      loaderData?.metadata[params.locale === "ko" ? "ko" : "en"],
    ),
  component: Page,
});
function Page() {
  return <DocumentPage {...Route.useLoaderData()} />;
}
