import "@bolerish/ui/global.css";
import { bolerishRegistry } from "@bolerish/json-render";
import { bolerishCatalog } from "@bolerish/json-render/catalog";

import type { PreviewAdapter } from "../contracts.ts";
import { createBolerishHandlers, parseBolerishPreview } from "./bolerish-preview.ts";

export const bolerishAdapter: PreviewAdapter = {
  catalog: bolerishCatalog,
  registry: bolerishRegistry,
  parse: parseBolerishPreview,
  createHandlers: createBolerishHandlers,
  applyTheme(document, theme) {
    if (theme !== "light" && theme !== "dark")
      throw new Error(`지원하지 않는 bolerish 테마예요: ${theme}`);
    document.documentElement.dataset.bolerishTheme = theme;
    document.documentElement.style.colorScheme = theme;
  },
};
