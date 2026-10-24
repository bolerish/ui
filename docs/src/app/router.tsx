import { createRouter } from "@tanstack/react-router";

import { DocumentError } from "@/app/_components/DocumentError";

import { routeTree } from "./routeTree.gen";
export function getRouter() {
  return createRouter({
    defaultErrorComponent: DocumentError,
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
  });
}
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
