import { createFileRoute } from "@tanstack/react-router";

import { Home, preloadHome } from "../documentation/Home";
export const Route = createFileRoute("/")({
  ssr: true,
  loader: preloadHome,
  pendingMs: Infinity,
  staleTime: 300_000,
  head: () => ({
    meta: [
      { title: "bolerish/ui — React components" },
      {
        name: "description",
        content:
          "React components for consistent surfaces and interactions. Explore every component and block.",
      },
    ],
  }),
  component: Home,
});
