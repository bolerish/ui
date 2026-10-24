import { createRouter } from "@tanstack/react-router";

import { preloadHome } from "@/app/(site)/_lib/home-gallery";
import { DocumentError } from "@/app/_components/DocumentError";

import { routeTree } from "./routeTree.gen";
export function getRouter() {
  return createRouter({
    defaultErrorComponent: DocumentError,
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    hydrate: async () => {
      // Initial SSR loader data is restored without rerunning the gallery loader.
      if (window.location.pathname === "/" || window.location.pathname === "/ko") {
        try {
          await preloadHome();
        } catch {
          // Let Home report missing examples through the existing route error UI.
        }
      }
    },
  });
}
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
