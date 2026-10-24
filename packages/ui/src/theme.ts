import { colorVars, typo } from "@bolerish/tokens/semantic.stylex";
import {
  darkColorTheme,
  darkShadowTheme,
  lightColorTheme,
  lightShadowTheme,
} from "@bolerish/tokens/themes.stylex";
import * as stylex from "@stylexjs/stylex";

const styles = stylex.create({
  root: {
    backgroundColor: colorVars.bgCanvas,
    color: colorVars.fgPrimary,
    fontFamily: typo.fontFamilyBody,
  },
  light: { colorScheme: "light" },
  dark: { colorScheme: "dark" },
});

/** Apply to html so portaled controls inherit the same theme. */
export const themeClassNames = {
  light: stylex.props(lightColorTheme, lightShadowTheme, styles.root, styles.light).className ?? "",
  dark: stylex.props(darkColorTheme, darkShadowTheme, styles.root, styles.dark).className ?? "",
};
