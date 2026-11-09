import { Link } from "@bolerish/ui/link";
import * as stylex from "@stylexjs/stylex";
import { createFileRoute } from "@tanstack/react-router";

import { documentStyles } from "@/shared/styles/document";

export function NotFound() {
  return (
    <article {...stylex.props(documentStyles.article)} data-docs="document">
      <h1 {...stylex.props(documentStyles.title)}>Page not found</h1>
      <p {...stylex.props(documentStyles.paragraph)}>Choose a document from the navigation.</p>
      <Link href="/docs/getting-started">Go to documentation</Link>
    </article>
  );
}

// The build renders this adapter to 404.html; unknown routes reuse NotFound directly.
export const Route = createFileRoute("/404/")({
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  component: NotFound,
});
