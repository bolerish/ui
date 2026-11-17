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

type BadgeVariant = "primary" | "secondary" | "destructive" | "outline" | "ghost";

export type BadgeProps = StyledProps<ComponentProps<"span">> & {
  variant?: BadgeVariant;
  xstyle?: ControlPlacementStyles;
};

export function Badge({ className, style, xstyle, variant = "primary", ...props }: BadgeProps) {
  return (
    <span
      {...props}
      {...mergeStyles(stylex.props(styles.root, variantStyles[variant], xstyle), className, style)}
    />
  );
}

const styles = stylex.create({
  root: {
    alignItems: "center",
    borderRadius: radiusVars.full,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    display: "inline-flex",
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    gap: spacingVars.space1,
    justifyContent: "center",
    lineHeight: typo.lineHeightTight,
    minHeight: sizeVars.iconMd,
    paddingBlock: spacingVars.space1,
    paddingInline: spacingVars.space2,
    whiteSpace: "nowrap",
  },
});

const variantStyles = stylex.create({
  primary: {
    backgroundColor: colorVars.bgActionPrimary,
    borderColor: colorVars.bgActionPrimary,
    color: colorVars.fgOnActionPrimary,
  },
  secondary: {
    backgroundColor: colorVars.bgSubtle,
    borderColor: colorVars.bgSubtle,
    color: colorVars.fgPrimary,
  },
  ghost: {
    backgroundColor: colorVars.interactionDefault,
    borderColor: colorVars.interactionDefault,
    color: colorVars.fgPrimary,
  },
  destructive: {
    backgroundColor: colorVars.bgFeedbackError,
    borderColor: "transparent",
    color: colorVars.fgFeedbackError,
  },
  outline: {
    backgroundColor: colorVars.interactionDefault,
    borderColor: colorVars.strokeDefault,
    color: colorVars.fgPrimary,
  },
});
