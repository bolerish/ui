export type DocumentationGlobals = {
  unit: "rem" | "px";
  density: "default" | "compact" | "spacious";
  fontPreset: "default" | "serif-heading";
  locale: "ko" | "en";
  colorMode: "system" | "light" | "dark";
  surface: "solid" | "liquid";
  motionPreference: "system" | "reduce" | "no-preference";
  q: string;
};

function choice<T extends string>(value: unknown, values: readonly T[], fallback: T): T {
  return values.includes(value as T) ? (value as T) : fallback;
}

export function validateSettings(search: Record<string, unknown>): DocumentationGlobals {
  return {
    unit: choice(search.unit, ["rem", "px"], "rem"),
    density: choice(search.density, ["default", "compact", "spacious"], "default"),
    fontPreset: choice(search.fontPreset, ["default", "serif-heading"], "default"),
    locale: choice(search.locale, ["ko", "en"], "en"),
    colorMode: choice(search.colorMode, ["system", "light", "dark"], "light"),
    surface: choice(search.surface, ["solid", "liquid"], "solid"),
    motionPreference: choice(
      search.motionPreference,
      ["system", "reduce", "no-preference"],
      "system",
    ),
    q: typeof search.q === "string" ? search.q.slice(0, 100) : "",
  };
}

export function validateSearch(search: Record<string, unknown>): Partial<DocumentationGlobals> {
  const settings = validateSettings(search);
  return Object.fromEntries(Object.entries(settings).filter(([key]) => Object.hasOwn(search, key)));
}

export function parseSavedPreferences(value: string | undefined) {
  if (!value) return null;
  try {
    const parsed: unknown = JSON.parse(decodeURIComponent(value));
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    return validateSettings(parsed as Record<string, unknown>);
  } catch {
    return null;
  }
}
