import { colorVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export const surfaceStyles = stylex.create({
  edge: {
    borderColor: colorVars.strokeDefault,
    "@media (forced-colors: active)": { borderColor: "CanvasText" },
  },
  translucent: {
    backgroundColor: {
      default: colorVars.bgSurface,
      "@supports (backdrop-filter: blur(1px)) and (background-color: color-mix(in srgb, white, transparent))": `color-mix(in srgb, ${colorVars.bgSurface} 92%, transparent)`,
    },
    backdropFilter: "blur(16px)",
    "@media (prefers-reduced-transparency: reduce)": {
      backgroundColor: colorVars.bgSurface,
      backdropFilter: "none",
    },
    "@media (forced-colors: active)": {
      backgroundColor: "Canvas",
      backdropFilter: "none",
    },
  },
  floating: {
    backgroundColor: {
      default: colorVars.bgRaised,
      "@supports (backdrop-filter: blur(1px)) and (background-color: color-mix(in srgb, white, transparent))": `color-mix(in srgb, ${colorVars.bgRaised} 94%, transparent)`,
    },
    backdropFilter: "blur(16px)",
    "@media (prefers-reduced-transparency: reduce)": {
      backgroundColor: colorVars.bgRaised,
      backdropFilter: "none",
    },
    "@media (forced-colors: active)": {
      backgroundColor: "Canvas",
      backdropFilter: "none",
    },
  },
});
