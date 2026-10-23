import assert from "node:assert/strict";
import test from "node:test";

import { themes, defaults, rgba, composite, contrast } from "./themes.test-utils.ts";

for (const mode of ["light", "dark"]) {
  test(`${mode}: readable text and action labels survive state layers`, () => {
    const theme = themes[`${mode}ColorTheme`];
    const canvas = rgba(theme.bgCanvas);
    for (const surface of [
      "bgCanvas",
      "bgSurface",
      "bgSubtle",
      "bgRaised",
      "bgSelected",
      "bgDropTarget",
      "bgSurfacePressed",
      "bgRaisedPressed",
    ]) {
      const background = composite(rgba(theme[surface]), canvas);
      for (const foreground of ["fgPrimary", "fgSecondary", "fgTertiary", "fgAction"]) {
        const ratio = contrast(rgba(theme[foreground]), background);
        assert.ok(ratio >= 4.5, `${foreground}/${surface}: ${ratio.toFixed(2)} < 4.5`);
      }
    }
    for (const role of [
      "ActionPrimary",
      "ActionDestructive",
      "FeedbackInfo",
      "FeedbackSuccess",
      "FeedbackWarning",
      "FeedbackError",
    ]) {
      const background = composite(rgba(theme[`bg${role}`]), canvas);
      const foreground = rgba(theme[`fg${role.startsWith("Feedback") ? role : `On${role}`}`]);
      assert.ok(contrast(foreground, background) >= 4.5, `${role}: unreadable text`);
      if (role.startsWith("Feedback")) continue;
      for (const state of ["interactionSolidHover", "interactionSolidPressed"]) {
        const ratio = contrast(foreground, composite(rgba(theme[state]), background));
        assert.ok(ratio >= 4.5, `${role}/${state}: ${ratio.toFixed(2)} < 4.5`);
      }
    }
    assert.ok(contrast(rgba(theme.fgOnActionPrimary), rgba(theme.bgActionPrimaryHover)) >= 4.5);
    assert.ok(contrast(rgba(theme.fgInverse), rgba(theme.bgInverse)) >= 4.5);
  });
  test(`${mode}: control boundaries and focus remain visible`, () => {
    const theme = themes[`${mode}ColorTheme`];
    assert.ok(theme.strokeControl, "Controls need a boundary separate from decorative hairlines");
    for (const surface of ["bgCanvas", "bgSurface", "bgRaised"]) {
      for (const boundary of [
        "strokeControl",
        "strokeFocus",
        "strokeAction",
        "strokeFeedbackError",
        "strokeDropIndicator",
      ]) {
        const ratio = contrast(rgba(theme[boundary]), rgba(theme[surface]));
        assert.ok(ratio >= 3, `${boundary}/${surface}: ${ratio.toFixed(2)} < 3`);
      }
    }
    // Essential controls sit on canvas/surface; grouped selections use stronger boundaries.
    assert.ok(contrast(rgba(theme.strokeAction), rgba(theme.bgSubtle)) >= 3);
    assert.ok(contrast(rgba(theme.strokeAction), rgba(theme.interactionSelected)) >= 3);
  });
}

for (const mode of ["light", "dark"]) {
  test(`${mode}: translucent navigation surfaces retain readable text`, () => {
    const theme = themes[`${mode}ColorTheme`];
    for (const surface of ["bgSurface", "bgRaised"]) {
      for (let corner = 0; corner < 8; corner++) {
        const backdrop = [corner & 1, (corner >> 1) & 1, (corner >> 2) & 1, 1];
        const background = composite(
          [...rgba(theme[surface]).slice(0, 3), surface === "bgRaised" ? 0.94 : 0.92],
          backdrop,
        );
        for (const foreground of ["fgPrimary", "fgSecondary"]) {
          const ratio = contrast(rgba(theme[foreground]), background);
          assert.ok(ratio >= 4.5, `${foreground}/${surface}/${corner}: ${ratio.toFixed(2)} < 4.5`);
        }
        assert.ok(contrast(rgba(theme.strokeFocus), background) >= 3);
      }
    }
  });
}

test("default surfaces match the explicit light theme", () => {
  for (const role of ["bgCanvas", "bgSurface", "bgSubtle", "strokeDefault", "strokeControl"]) {
    assert.equal(defaults[role], themes.lightColorTheme[role], role);
  }
});
