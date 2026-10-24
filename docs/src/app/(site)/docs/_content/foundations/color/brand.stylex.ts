import { colorVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export const brand = stylex.createTheme(colorVars, {
  bgActionPrimary: "#00458C",
  bgActionPrimaryHover: "#00458C",
  fgOnActionPrimary: "#FFFFFF",
  fgAction: "#00458C",
  strokeAction: "#00458C",
  strokeFocus: "#00458C",
  interactionFocus: "#00458C",
});
