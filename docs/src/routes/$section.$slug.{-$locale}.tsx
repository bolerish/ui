import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

import { findDocument } from "../documentation/catalog";
import { documentPath } from "../documentation/paths";
export const Route = createFileRoute("/$section/$slug/{-$locale}")({
  beforeLoad: ({ params }) => {
    const page = findDocument(params.section, params.slug);
    if (!page || (params.locale !== undefined && params.locale !== "ko")) throw notFound();
    throw redirect({
      href: documentPath(page, params.locale === "ko" ? "ko" : "en"),
      statusCode: 308,
    });
  },
});
