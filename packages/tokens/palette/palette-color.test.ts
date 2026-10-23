import assert from "node:assert/strict";
import test from "node:test";

import { oklchToHex } from "./palette-color.ts";

test("OKLCH converts known sRGB colors and alpha to HEX", () => {
  for (const [source, expected] of [
    ["oklch(0% 0 0)", "#000000"],
    ["oklch(100% 0 0)", "#FFFFFF"],
    ["oklch(62.795536% 0.257683 29.233885)", "#FF0000"],
    ["oklch(59.98708% 0 0)", "#808080"],
    ["oklch(0% 0 0 / 32%)", "#00000052"],
    ["oklch(100% 0 0 / 0%)", "#FFFFFF00"],
  ])
    assert.equal(oklchToHex(source), expected);
});

test("invalid and out-of-gamut authoring values fail instead of silently clipping", () => {
  for (const value of [
    null,
    "#FFFFFF",
    "oklch(101% 0 0)",
    "oklch(50% -0.1 0)",
    "oklch(50% 0 0 / 101%)",
    "oklch(50% 0.5 30)",
  ]) {
    assert.throws(() => oklchToHex(value));
  }
});
