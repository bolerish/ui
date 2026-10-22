"use client";

import { useRender } from "@base-ui/react/use-render";
import { colorVars, motionVars, sizeVars, typo } from "@bolerish/tokens/semantic.stylex";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  externalIcon: {
    alignSelf: "flex-start",
    flexShrink: 0,
    marginBlockStart: "0.05em",
  },
  root: {
    alignItems: "center",
    borderRadius: "0.125rem",
    display: "inline-flex",
    fontFamily: typo.fontFamilyBody,
    gap: "0.1875em",
    outline: "none",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "color, opacity, text-decoration-color",
    transitionTimingFunction: motionVars.easingStandard,
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
});

const variantStyles = stylex.create({
  inline: {
    color: colorVars.fgAction,
    textDecorationLine: "underline",
    textDecorationThickness: sizeVars.stroke,
    textUnderlineOffset: "0.15em",
    ":hover": { opacity: 0.72 },
  },
  current: {
    color: "currentColor",
    textDecorationLine: "underline",
    textDecorationThickness: sizeVars.stroke,
    textUnderlineOffset: "0.15em",
    ":hover": { opacity: 0.72 },
  },
  plain: {
    color: colorVars.fgAction,
    textDecorationLine: "none",
    ":hover": { opacity: 0.72 },
  },
});

export type LinkVariant = "current" | "inline" | "plain";

export type LinkProps = StyledProps<useRender.ComponentProps<"a">> & {
  variant?: LinkVariant;
  xstyle?: ControlPlacementStyles;
};

function LinkBase({
  className,
  style,
  xstyle,
  ref,
  render,
  variant = "inline",
  ...props
}: LinkProps) {
  return useRender({
    defaultTagName: "a",
    props: {
      ...props,
      ...mergeStyles(stylex.props(styles.root, variantStyles[variant], xstyle), className, style),
    },
    ref,
    render,
  });
}

function ExternalIcon({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof ArrowSquareOutIcon>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <ArrowSquareOutIcon
      aria-hidden="true"
      size="0.8em"
      {...props}
      {...mergeStyles(stylex.props(styles.externalIcon, xstyle), className, style)}
    />
  );
}

export const Link = Object.assign(LinkBase, { ExternalIcon });
