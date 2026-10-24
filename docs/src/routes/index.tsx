import { createFileRoute } from "@tanstack/react-router";

import { localizedLinks } from "../documentation/head";
import { Home } from "../documentation/Home";
import { preloadHome } from "../documentation/home-gallery";
export const Route = createFileRoute("/")({
  ssr: true,
  loader: preloadHome,
  pendingMs: Infinity,
  staleTime: 300_000,
  head: () => ({
    links: localizedLinks("/", "en"),
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
