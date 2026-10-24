import { colorVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  edge: {
    borderColor: colorVars.strokeDefault,
    "@media (forced-colors: active)": { borderColor: "CanvasText" },
  },
  material: {
    backgroundColor: {
      default: `var(--bolerish-material-color, ${colorVars.bgSurface})`,
      "@supports (backdrop-filter: blur(1px)) and (background-color: color-mix(in srgb, white, transparent))": `color-mix(in srgb, var(--bolerish-material-color, ${colorVars.bgSurface}) var(--bolerish-material-opacity), transparent)`,
    },
    backdropFilter: {
      default: "none",
      "@supports (backdrop-filter: blur(1px)) and (background-color: color-mix(in srgb, white, transparent))":
        "var(--bolerish-material-filter)",
    },
    backgroundImage: "var(--bolerish-surface-sheen, none)",
    "@media (prefers-reduced-transparency: reduce)": {
      backgroundColor: `var(--bolerish-material-color, ${colorVars.bgSurface})`,
      backdropFilter: "none",
      backgroundImage: "none",
    },
    "@media (forced-colors: active)": {
      backgroundColor: "Canvas",
      backdropFilter: "none",
      backgroundImage: "none",
    },
  },
  panel: {
    "--bolerish-material-color": colorVars.bgSurface,
    "--bolerish-material-opacity": "var(--bolerish-panel-opacity, 100%)",
    "--bolerish-material-filter": "var(--bolerish-panel-filter, none)",
  },
  control: {
    "--bolerish-material-color": colorVars.bgSurface,
    "--bolerish-material-opacity": "var(--bolerish-control-opacity, 100%)",
    "--bolerish-material-filter": "var(--bolerish-control-filter, none)",
  },
  subtle: {
    "--bolerish-material-color": colorVars.bgSubtle,
    "--bolerish-material-opacity": "var(--bolerish-control-opacity, 100%)",
    "--bolerish-material-filter": "var(--bolerish-control-filter, none)",
  },
  outline: {
    "--bolerish-material-color": colorVars.interactionDefault,
    "--bolerish-material-opacity": "var(--bolerish-control-opacity, 100%)",
    "--bolerish-material-filter": "var(--bolerish-control-filter, none)",
  },
  raised: {
    "--bolerish-material-color": colorVars.bgRaised,
    "--bolerish-material-opacity": "var(--bolerish-floating-opacity, 100%)",
    "--bolerish-material-filter": "var(--bolerish-floating-filter, none)",
  },
  translucent: {
    "--bolerish-material-color": colorVars.bgSurface,
    "--bolerish-material-opacity": "var(--bolerish-panel-opacity, 92%)",
    "--bolerish-material-filter": "var(--bolerish-panel-filter, blur(16px))",
  },
  floating: {
    "--bolerish-material-color": colorVars.bgRaised,
    "--bolerish-material-opacity": "var(--bolerish-floating-opacity, 94%)",
    "--bolerish-material-filter": "var(--bolerish-floating-filter, blur(16px))",
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
