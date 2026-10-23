import { createFileRoute } from "@tanstack/react-router";

import { Home, preloadHome } from "../documentation/Home";
export const Route = createFileRoute("/ko")({
  ssr: true,
  loader: preloadHome,
  pendingMs: Infinity,
  staleTime: 300_000,
  head: () => ({
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
