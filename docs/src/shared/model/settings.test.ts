import assert from "node:assert/strict";
import test from "node:test";

import { validateSettings, validateSearch, parseSavedPreferences } from "./settings.ts";

test("invalid URL and saved preferences normalize to safe defaults", () => {
  assert.equal(validateSettings({}).locale, "en");
  assert.deepEqual(
    validateSettings({
      colorMode: "purple",
      surface: "glass",
      locale: [],
      density: -1,
      unit: "vw",
      motionPreference: "on",
      fontPreset: {},
      q: null,
    }),
    validateSettings({}),
  );
  assert.deepEqual(validateSearch({}), {});
  assert.deepEqual(validateSearch({ colorMode: "light" }), { colorMode: "light" });
  assert.equal(validateSettings({ q: "a".repeat(200) }).q.length, 100);
  const settings = validateSettings({
    locale: "en",
    density: "compact",
    colorMode: "dark",
    surface: "liquid",
    motionPreference: "reduce",
    unit: "px",
    fontPreset: "serif-heading",
  });
  assert.equal(settings.colorMode, "dark");
  assert.equal(settings.surface, "liquid");
  assert.equal(validateSettings({}).surface, "solid");
  assert.deepEqual(validateSearch({ surface: "liquid" }), { surface: "liquid" });
  assert.equal(
    parseSavedPreferences(encodeURIComponent('{"surface":"liquid"}'))!.surface,
    "liquid",
  );
  assert.equal(settings.density, "compact");
  assert.equal(settings.locale, "en");
});

test("malformed preference cookies normalize safely", () => {
  for (const value of [undefined, "%", "null", "[]", "true"])
    assert.equal(parseSavedPreferences(value), null);
  assert.equal(
    parseSavedPreferences(encodeURIComponent('{"colorMode":"dark"}'))!.colorMode,
    "dark",
  );
});
