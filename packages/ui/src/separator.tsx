"use client";

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { colorVars, sizeVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

export type SeparatorProps = StyledProps<ComponentProps<typeof SeparatorPrimitive>> & {
  decorative?: boolean;
  xstyle?: stylex.StyleXStyles;
};

export function Separator({
  className,
  style,
  decorative = true,
  orientation = "horizontal",
  xstyle,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      {...props}
      aria-hidden={decorative || undefined}
      orientation={orientation}
      role={decorative ? "presentation" : undefined}
      {...mergeStyles(
        stylex.props(styles.root, orientationStyles[orientation], xstyle),
        className,
        style,
      )}
    />
  );
}

const styles = stylex.create({
  root: { backgroundColor: colorVars.strokeDefault, flexShrink: 0 },
});

const orientationStyles = stylex.create({
  horizontal: { height: sizeVars.stroke, width: "100%" },
  vertical: { alignSelf: "stretch", minHeight: sizeVars.touchTarget, width: sizeVars.stroke },
});
