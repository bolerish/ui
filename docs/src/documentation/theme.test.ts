import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { themes, rgba, contrast } from "../../../packages/tokens/src/themes.test-utils.ts";

test("Documentation shell colors stay aligned with semantic themes", async () => {
  const css = await readFile(new URL("./theme.css", import.meta.url), "utf8");
  const selectors = { light: ":root", dark: ':root[data-color-mode="dark"]' };
  const roles = {
    background: "bgCanvas",
    surface: "bgSurface",
    subtle: "bgSubtle",
    selected: "bgSelected",
    foreground: "fgPrimary",
    muted: "fgSecondary",
    primary: "bgActionPrimary",
    border: "strokeDefault",
    control: "strokeControl",
    focus: "strokeFocus",
  };
  for (const mode of ["light", "dark"] as const) {
    const block = css.slice(css.indexOf(`${selectors[mode]} {`)).split("}")[0];
    const values = Object.fromEntries(
      [...block.matchAll(/--docs-([a-z-]+):\s*(#[0-9a-f]+);/gi)].map((match) => [
        match[1],
        match[2].toUpperCase(),
      ]),
    );
    assert.ok(
      contrast(rgba(values["selection-foreground"]), rgba(values["selection-background"])) >= 4.5,
      `${mode}: selected text remains readable`,
    );
    for (const [name, role] of Object.entries(roles)) {
      assert.equal(
        values[name],
        mode === "light" && name === "background"
          ? "#FFFFFF"
          : themes[`${mode}ColorTheme`][role].toUpperCase(),
        `${mode}/${name}`,
      );
    }
  }
});
