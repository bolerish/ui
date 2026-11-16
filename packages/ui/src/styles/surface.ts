import { colorVars, shadowVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export const surfaceStyles = stylex.create({
  edge: {
    borderColor: colorVars.strokeDefault,
    "@media (forced-colors: active)": { borderColor: "CanvasText" },
  },
  panel: {
    backgroundColor: colorVars.bgSurface,
    "@media (forced-colors: active)": { backgroundColor: "Canvas" },
  },
  control: {
    backgroundColor: colorVars.bgSurface,
    "@media (forced-colors: active)": { backgroundColor: "Canvas" },
  },
  subtle: {
    backgroundColor: colorVars.bgSubtle,
    "@media (forced-colors: active)": { backgroundColor: "Canvas" },
  },
  outline: {
    backgroundColor: colorVars.interactionDefault,
    "@media (forced-colors: active)": { backgroundColor: "Canvas" },
  },
  raised: {
    backgroundColor: colorVars.bgRaised,
    boxShadow: shadowVars.overlay,
    "@media (forced-colors: active)": { backgroundColor: "Canvas", boxShadow: "none" },
  },
  floating: {
    backgroundColor: colorVars.bgRaised,
    boxShadow: shadowVars.floating,
    "@media (forced-colors: active)": { backgroundColor: "Canvas", boxShadow: "none" },
  },
});
