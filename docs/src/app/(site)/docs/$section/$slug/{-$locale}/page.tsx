import { createFileRoute, notFound } from "@tanstack/react-router";

import { DocumentPage } from "@/app/(site)/docs/_components/DocumentPage";
import { loadDocumentPage } from "@/app/(site)/docs/_lib/documents";
import { documentHead } from "@/shared/lib/head";
export const Route = createFileRoute("/(site)/docs/$section/$slug/{-$locale}/")({
  ssr: true,
  pendingMs: Infinity,
  staleTime: 300_000,
  loader: ({ params }) => {
    if (!["components", "foundations"].includes(params.section)) throw notFound();
    return loadDocumentPage(params.section, params.slug, params.locale);
  },
  head: ({ loaderData, params }) =>
    documentHead(loaderData?.page, params.locale === "ko" ? "ko" : "en"),
  component: Page,
});
function Page() {
  return <DocumentPage {...Route.useLoaderData()} />;
}
