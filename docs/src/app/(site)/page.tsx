import { createFileRoute } from "@tanstack/react-router";

import { Home } from "@/app/(site)/_components/Home";
import { preloadHome } from "@/app/(site)/_lib/home-gallery";
import { localizedLinks } from "@/shared/lib/head";
export const Route = createFileRoute("/(site)/")({
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
