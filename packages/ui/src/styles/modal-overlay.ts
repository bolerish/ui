import { colorVars, shadowVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export const modalOverlayStyles = stylex.create({
  backdrop: {
    WebkitBackdropFilter: {
      default: "none",
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and (background-color: color-mix(in srgb, white, transparent)) and selector(:has(*))":
        "var(--bolerish-modal-backdrop-filter, none)",
    },
    backdropFilter: {
      default: "none",
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and (background-color: color-mix(in srgb, white, transparent)) and selector(:has(*))":
        "var(--bolerish-modal-backdrop-filter, none)",
    },
    backgroundColor: {
      default: colorVars.bgOverlay,
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and (background-color: color-mix(in srgb, white, transparent)) and selector(:has(*))": `color-mix(in srgb, ${colorVars.bgOverlay} var(--bolerish-modal-backdrop-opacity, 100%), transparent)`,
    },
  },
  outsideScrim: {
    "--bolerish-material-opacity": {
      default: "100%",
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and (background-color: color-mix(in srgb, white, transparent)) and selector(:has(*))":
        "var(--bolerish-floating-opacity, 100%)",
    },
    "--bolerish-material-filter": {
      default: "none",
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and (background-color: color-mix(in srgb, white, transparent)) and selector(:has(*))":
        "var(--bolerish-floating-filter, none)",
    },
    // A nested panel owns the existing dimming while its transform animates.
    ":is([data-nested])": {
      "--bolerish-modal-transition-opacity": "var(--bolerish-modal-nested-opacity, 0)",
    },
    "--bolerish-modal-current-spread": "var(--bolerish-modal-scrim-spread, 0px)",
    "--bolerish-material-shadow": `${shadowVars.overlay}, 0 0 0 var(--bolerish-modal-current-spread) ${colorVars.bgOverlay}`,
  },
});
