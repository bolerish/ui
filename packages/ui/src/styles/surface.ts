import { colorVars, shadowVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  edge: {
    borderColor: colorVars.strokeDefault,
    "@media (forced-colors: active)": { borderColor: "CanvasText" },
  },
  material: {
    "--bolerish-material-shadow": "0 0 transparent",
    "--bolerish-material-highlight": "0 0 transparent",
    boxShadow: "var(--bolerish-material-highlight), var(--bolerish-material-shadow)",
    backgroundColor: {
      default: `var(--bolerish-material-color, ${colorVars.bgSurface})`,
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and (background-color: color-mix(in srgb, white, transparent))": `color-mix(in srgb, var(--bolerish-material-color, ${colorVars.bgSurface}) var(--bolerish-material-opacity), transparent)`,
    },
    WebkitBackdropFilter: {
      default: "none",
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and (background-color: color-mix(in srgb, white, transparent))":
        "var(--bolerish-material-filter)",
    },
    backdropFilter: {
      default: "none",
      "@supports ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) and (background-color: color-mix(in srgb, white, transparent))":
        "var(--bolerish-material-filter)",
    },
    "@media (prefers-reduced-transparency: reduce)": {
      backgroundColor: `var(--bolerish-material-color, ${colorVars.bgSurface})`,
      WebkitBackdropFilter: "none",
      backdropFilter: "none",
      boxShadow: "var(--bolerish-material-shadow)",
    },
    "@media (forced-colors: active)": {
      backgroundColor: "Canvas",
      WebkitBackdropFilter: "none",
      backdropFilter: "none",
      boxShadow: "none",
    },
  },
  panel: {
    "--bolerish-material-highlight": "var(--bolerish-surface-highlight, 0 0 transparent)",
    "--bolerish-material-color": colorVars.bgSurface,
    "--bolerish-material-opacity": "var(--bolerish-panel-opacity, 100%)",
    "--bolerish-material-filter": "var(--bolerish-panel-filter, none)",
  },
  control: {
    "--bolerish-material-color": colorVars.bgSurface,
    "--bolerish-material-opacity": "100%",
    "--bolerish-material-filter": "none",
  },
  subtle: {
    "--bolerish-material-color": colorVars.bgSubtle,
    "--bolerish-material-opacity": "100%",
    "--bolerish-material-filter": "none",
  },
  outline: {
    "--bolerish-material-color": colorVars.interactionDefault,
    "--bolerish-material-opacity": "100%",
    "--bolerish-material-filter": "none",
  },
  raised: {
    "--bolerish-material-highlight": "var(--bolerish-surface-highlight, 0 0 transparent)",
    "--bolerish-material-shadow": shadowVars.overlay,
    "--bolerish-material-color": colorVars.bgRaised,
    "--bolerish-material-opacity": "var(--bolerish-floating-opacity, 100%)",
    "--bolerish-material-filter": "var(--bolerish-floating-filter, none)",
  },
  translucent: {
    "--bolerish-material-highlight": "var(--bolerish-surface-highlight, 0 0 transparent)",
    "--bolerish-material-color": colorVars.bgSurface,
    "--bolerish-material-opacity": "var(--bolerish-panel-opacity, 100%)",
    "--bolerish-material-filter": "var(--bolerish-panel-filter, none)",
  },
  floating: {
    "--bolerish-material-highlight": "var(--bolerish-surface-highlight, 0 0 transparent)",
    "--bolerish-material-shadow": shadowVars.floating,
    "--bolerish-material-color": colorVars.bgRaised,
    "--bolerish-material-opacity": "var(--bolerish-floating-opacity, 100%)",
    "--bolerish-material-filter": "var(--bolerish-floating-filter, none)",
  },
});

export const surfaceStyles = {
  edge: styles.edge,
  panel: [styles.material, styles.panel],
  control: [styles.material, styles.control],
  subtle: [styles.material, styles.subtle],
  outline: [styles.material, styles.outline],
  raised: [styles.material, styles.raised],
  translucent: [styles.material, styles.translucent],
  floating: [styles.material, styles.floating],
};
