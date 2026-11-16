import { colorVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export const modalBackdropStyles = stylex.create({
  root: {
    backgroundColor: colorVars.bgOverlay,
    WebkitBackdropFilter: "blur(4px)",
    backdropFilter: "blur(4px)",
    "@media (prefers-reduced-transparency: reduce)": {
      WebkitBackdropFilter: "none",
      backdropFilter: "none",
    },
    "@media (forced-colors: active)": {
      backgroundColor: "Canvas",
      WebkitBackdropFilter: "none",
      backdropFilter: "none",
    },
  },
});
