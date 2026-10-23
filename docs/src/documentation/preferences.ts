import { createServerFn } from "@tanstack/react-start";

import { parseSavedPreferences } from "./settings";
export const getSavedPreferences = createServerFn({ method: "GET" }).handler(async () => {
  const { getCookie } = await import("@tanstack/react-start/server");
  return parseSavedPreferences(getCookie("bolerish-docs-settings"));
});
