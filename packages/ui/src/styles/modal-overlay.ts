import { colorVars, shadowVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export const modalOverlayStyles = stylex.create({
  backdrop: {
    backgroundColor: {
      default: colorVars.bgOverlay,
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and (background-color: color-mix(in srgb, white, transparent)) and selector(:has(*))": `color-mix(in srgb, ${colorVars.bgOverlay} var(--bolerish-modal-backdrop-opacity, 100%), transparent)`,
    },
  },
  outsideScrim: {
    // A nested panel owns the existing dimming while its transform animates.
    ":is([data-nested])": {
      "--bolerish-modal-transition-opacity": "var(--bolerish-modal-nested-opacity, 0)",
    },
    "--bolerish-modal-current-spread": "var(--bolerish-modal-scrim-spread, 0px)",
    "--bolerish-material-shadow": `var(--bolerish-raised-shadow, ${shadowVars.overlay}), 0 0 0 var(--bolerish-modal-current-spread) ${colorVars.bgOverlay}`,
  },
});
