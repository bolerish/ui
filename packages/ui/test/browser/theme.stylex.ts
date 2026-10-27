import { colorVars, shadowVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export const brandColors = stylex.createTheme(colorVars, {
  bgCanvas: "#123456",
  fgPrimary: "#fedcba",
});

export const brandShadows = stylex.createTheme(shadowVars, {
  overlay: "0 0 2px #123456",
});
