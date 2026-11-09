import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";

import { examples, loadedExamples, loadExample } from "@/_shared/examples";
export const Route = createFileRoute("/preview/$example/")({
  // Render the trigger immediately; interactivity stays isolated in its own document.
  ssr: true,
  pendingMs: Infinity,
  staleTime: 300_000,
  head: () => ({ meta: [{ name: "robots", content: "noindex" }] }),
  loader: async ({ params }) => {
    if (!Object.hasOwn(examples, params.example)) throw notFound();
    await loadExample(params.example);
    return params.example;
  },
  component: Preview,
});
function Preview() {
  const name = Route.useLoaderData();
  const Example = loadedExamples[name] ?? examples[name];
  return (
    <main {...stylex.props(styles.root)}>
      <Suspense fallback={null}>
        <Example />
      </Suspense>
    </main>
  );
}

// These dimensions preserve the documentation layout; controls keep their own DS behavior.
const styles = stylex.create({
  root: {
    minHeight: "100vh",
    paddingTop: spacingVars.space6,
    paddingRight: spacingVars.space6,
    paddingBottom: spacingVars.space6,
    paddingLeft: spacingVars.space6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
