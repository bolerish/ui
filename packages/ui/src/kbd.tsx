import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

export function Kbd({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"kbd">> & { xstyle?: ControlPlacementStyles }) {
  return <kbd {...props} {...mergeStyles(stylex.props(styles.root, xstyle), className, style)} />;
}

export function KbdGroup({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"span">> & { xstyle?: stylex.StyleXStyles }) {
  return <span {...props} {...mergeStyles(stylex.props(styles.group, xstyle), className, style)} />;
}

const styles = stylex.create({
  root: {
    alignItems: "center",
    backgroundColor: colorVars.bgSubtle,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgSecondary,
    display: "inline-flex",
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    justifyContent: "center",
    minHeight: sizeVars.iconLg,
    minWidth: sizeVars.iconLg,
    paddingInline: spacingVars.space1,
    userSelect: "none",
  },
  group: { alignItems: "center", display: "inline-flex", gap: spacingVars.space1 },
});
