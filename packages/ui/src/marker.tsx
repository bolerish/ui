import { colorVars, sizeVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

export type MarkerProps = StyledProps<ComponentProps<"div">> & {
  variant?: "border" | "default" | "separator";
  xstyle?: stylex.StyleXStyles;
};

export function Marker({ className, style, variant = "default", xstyle, ...props }: MarkerProps) {
  return (
    <div
      {...props}
      {...mergeStyles(stylex.props(styles.root, variantStyles[variant], xstyle), className, style)}
    />
  );
}

export function MarkerIcon({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"span">> & { xstyle?: ControlPlacementStyles }) {
  return (
    <span
      aria-hidden="true"
      {...props}
      {...mergeStyles(stylex.props(styles.icon, xstyle), className, style)}
    />
  );
}

export function MarkerContent({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"span">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <span {...props} {...mergeStyles(stylex.props(styles.content, xstyle), className, style)} />
  );
}

const styles = stylex.create({
  root: {
    alignItems: "center",
    color: colorVars.fgSecondary,
    display: "inline-flex",
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    gap: spacingVars.space2,
    lineHeight: typo.lineHeightNormal,
    minWidth: 0,
  },

  icon: { alignItems: "center", display: "inline-flex", flexShrink: 0 },
  content: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
});

const variantStyles = stylex.create({
  default: {},
  border: {
    borderBottomColor: colorVars.strokeDefault,
    borderBottomStyle: "solid",
    borderBottomWidth: sizeVars.stroke,
    paddingBottom: spacingVars.space2,
  },
  separator: {
    display: "flex",
    width: "100%",
    "::before": {
      backgroundColor: colorVars.strokeDefault,
      content: "",
      flex: 1,
      height: sizeVars.stroke,
    },
    "::after": {
      backgroundColor: colorVars.strokeDefault,
      content: "",
      flex: 1,
      height: sizeVars.stroke,
    },
  },
});
