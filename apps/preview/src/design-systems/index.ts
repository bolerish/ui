import type { DesignSystemRegistration } from "../contracts.ts";

export const designSystems: Record<string, DesignSystemRegistration> = {
  bolerish: {
    label: "bolerish",
    themes: [
      { id: "light", label: "밝게" },
      { id: "dark", label: "어둡게" },
    ],
    load: async () => (await import("./bolerish.ts")).bolerishAdapter,
  },
};
