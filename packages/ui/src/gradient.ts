import { colorVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";

export type GradientOptions = {
  colors: readonly [string, string];
};
export type GradientProps = ReturnType<typeof stylex.props>;

const styles = stylex.create({
  background: {
    backgroundColor: colorVars.bgCanvas,
    backgroundImage: {
      default: "none",
      "@supports (background-color: color-mix(in srgb, white, transparent))": `linear-gradient(to bottom, color-mix(in srgb, ${colorVars.bgCanvas} 62%, transparent), ${colorVars.bgCanvas}), radial-gradient(ellipse at 0% 0%, var(--bolerish-gradient-accent), transparent 75%), radial-gradient(ellipse at 100% 15%, var(--bolerish-gradient-glow), transparent 80%)`,
      "@media (prefers-reduced-transparency: reduce)": "none",
      "@media (forced-colors: active)": "none",
    },
    backgroundRepeat: "no-repeat",
    "@media (forced-colors: active)": { backgroundColor: "Canvas" },
  },
  colors: (accent: string, glow: string) => ({
    "--bolerish-gradient-accent": accent,
    "--bolerish-gradient-glow": glow,
  }),
});

function props({ colors }: GradientOptions, ...xstyle: stylex.StyleXStyles[]): GradientProps {
  if (
    !Array.isArray(colors) ||
    colors.length !== 2 ||
    colors.some((color) => typeof color !== "string" || color.trim().length === 0)
  ) {
    throw new TypeError("gradient.props requires exactly two non-empty CSS colors.");
  }
  return stylex.props(styles.background, styles.colors(colors[0], colors[1]), xstyle);
}

/** Adds a themed background to an existing element without creating a wrapper. */
export const gradient = { props };
