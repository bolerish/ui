import { parseBolerishSpec } from "@bolerish/json-render/catalog";
import type { StateModel, StateStore } from "@json-render/core";

import { createProfileSettingsHandlers, profileSettingsStateSchema } from "./profile-settings.ts";

export function parseBolerishPreview(spec: unknown, state: StateModel, example?: string) {
  checkExample(example);
  if (example) profileSettingsStateSchema.parse(state);
  const parsed = parseBolerishSpec(spec, state);
  const handlers = example ? ["validate", "preference", "save", "failNextSave"] : [];
  for (const [id, element] of Object.entries(parsed.elements)) {
    for (const binding of Object.values(element.on ?? {})) {
      if (!handlers.includes(binding.action))
        throw new Error(`${id}: 등록되지 않은 액션이에요: ${binding.action}`);
    }
  }
  return parsed;
}

export function createBolerishHandlers(store: StateStore, example?: string) {
  checkExample(example);
  if (!example) return {};
  profileSettingsStateSchema.parse(store.getSnapshot());
  return createProfileSettingsHandlers(store);
}

function checkExample(example?: string) {
  if (example !== undefined && example !== "profile-settings")
    throw new Error(`지원하지 않는 예제예요: ${example}`);
}
