import * as stylex from "@stylexjs/stylex";

/** Keep focus strokes, 24px icon-xs controls and touch targets independent of density. */
export const densityStyles = stylex.create({
  default: { "--bolerish-density": 1 },
  compact: { "--bolerish-density": 0.875 },
});
