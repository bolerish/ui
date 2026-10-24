import { createFileRoute, notFound } from "@tanstack/react-router";
import { Suspense } from "react";

import { examples, loadedExamples, loadExample } from "../documentation/examples";
export const Route = createFileRoute("/preview/$example")({
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
    <main className="isolated-preview">
      <Suspense fallback={null}>
        <Example />
      </Suspense>
    </main>
  );
}
