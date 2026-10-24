import { createFileRoute } from "@tanstack/react-router";

import { Home } from "@/app/(site)/_components/Home";
import { preloadHome } from "@/app/(site)/_lib/home-gallery";
import { localizedLinks } from "@/shared/lib/head";
export const Route = createFileRoute("/(site)/ko/")({
  ssr: true,
  loader: preloadHome,
  pendingMs: Infinity,
  staleTime: 300_000,
  head: () => ({
    links: localizedLinks("/", "ko"),
    meta: [
      { title: "bolerish/ui — React 컴포넌트" },
      {
        name: "description",
        content: "일관된 표면과 상호작용을 위한 React 컴포넌트. 모든 컴포넌트와 블록을 둘러보세요.",
      },
    ],
  }),
  component: Home,
});
