import { colorVars, shadowVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export const brandColors = stylex.createTheme(colorVars, {
  bgCanvas: "oklch(31.916842% 0.072455 251.168449)",
  fgPrimary: "oklch(91.43897% 0.058573 66.982873)",
});

export const brandShadows = stylex.createTheme(shadowVars, {
  overlay: "0 0 2px oklch(31.916842% 0.072455 251.168449)",
});
