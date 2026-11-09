import { createFileRoute } from "@tanstack/react-router";

import { DocumentNotFound } from "@/_shared/DocumentError";
export const Route = createFileRoute("/404/")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: DocumentNotFound,
});
