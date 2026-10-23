"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import {
  colorVars,
  motionVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import type { ControlLayoutStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: {
    alignItems: "center",
    appearance: "none",
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    gap: spacingVars.space2,
    isolation: "isolate",
    lineHeight: typo.lineHeightTight,
    outline: "none",
    overflow: "hidden",
    position: "relative",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, border-color, color, opacity",
    transitionTimingFunction: motionVars.easingStandard,
    userSelect: "none",
    whiteSpace: "nowrap",
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.focusRing,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    ":disabled": {
      cursor: "not-allowed",
    },
    "::after": {
      backgroundColor: colorVars.interactionDefault,
      content: '""',
      inset: 0,
      pointerEvents: "none",
      position: "absolute",
      transitionDuration: motionVars.durationFast,
      transitionProperty: "background-color",
      transitionTimingFunction: motionVars.easingStandard,
      zIndex: -1,
    },
  },
  primaryInteraction: {
    backgroundColor: {
      default: colorVars.bgActionPrimary,
      ":hover": colorVars.bgActionPrimaryHover,
      ":active": colorVars.bgActionPrimary,
    },
    "::after": { backgroundColor: colorVars.interactionDefault },
  },
  solidInteraction: {
    "::after": {
      backgroundColor: {
        default: colorVars.interactionDefault,
        ":hover": colorVars.interactionSolidHover,
        ":active": colorVars.interactionSolidPressed,
      },
    },
  },
  surfaceInteraction: {
    "::after": {
      backgroundColor: {
        default: colorVars.interactionDefault,
        ":hover": colorVars.interactionHover,
        ":active": colorVars.interactionPressed,
      },
    },
  },
  iconContent: {
    gap: 0,
    // Give icon-only buttons a text baseline without adding visible content.
    "::before": { content: '"\\200b"' },
  },

  disabled: {
    backgroundColor: colorVars.interactionDisabled,
    borderColor: colorVars.strokeDefault,
    color: colorVars.fgDisabled,
    "::after": { backgroundColor: colorVars.interactionDefault },
  },
  disabledGhost: {
    backgroundColor: colorVars.interactionDefault,
    borderColor: colorVars.interactionDefault,
  },
});

const alignStyles = stylex.create({
  start: { justifyContent: "flex-start" },
  center: { justifyContent: "center" },
  end: { justifyContent: "flex-end" },
  "space-between": { justifyContent: "space-between" },
});

const sizeStyles = stylex.create({
  sm: {
    borderRadius: radiusVars.sm,
    height: sizeVars.controlSm,
    paddingInline: spacingVars.space3,
  },
  md: {
    borderRadius: radiusVars.sm,
    height: sizeVars.controlMd,
    paddingInline: spacingVars.space4,
  },
  lg: {
    borderRadius: radiusVars.sm,
    height: sizeVars.controlLg,
    paddingInline: spacingVars.space5,
  },
  icon: {
    borderRadius: radiusVars.sm,
    height: sizeVars.controlMd,
    paddingInline: 0,
    width: sizeVars.controlMd,
  },
});

const variantStyles = stylex.create({
  primary: {
    backgroundColor: colorVars.bgActionPrimary,
    borderColor: colorVars.strokeAction,
    color: colorVars.fgOnActionPrimary,
  },
  secondary: {
    backgroundColor: colorVars.bgSubtle,
    borderColor: colorVars.strokeDefault,
    color: colorVars.fgPrimary,
  },
  outline: {
    backgroundColor: colorVars.interactionDefault,
    borderColor: colorVars.strokeDefault,
    color: colorVars.fgPrimary,
  },
  ghost: {
    backgroundColor: colorVars.interactionDefault,
    borderColor: colorVars.interactionDefault,
    color: colorVars.fgPrimary,
  },
  destructive: {
    backgroundColor: colorVars.bgActionDestructive,
    borderColor: colorVars.bgActionDestructive,
    color: colorVars.fgOnActionDestructive,
  },
});

const shapeStyles = stylex.create({
  default: {},
  square: { paddingInline: 0 },
  circle: { borderRadius: radiusVars.full, paddingInline: 0 },
});

const squareStyles = stylex.create({
  sm: { width: sizeVars.controlSm },
  md: { width: sizeVars.controlMd },
  lg: { width: sizeVars.controlLg },
});

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps = StyledProps<ComponentProps<typeof ButtonPrimitive>> & {
  align?: "start" | "center" | "end" | "space-between";
  children: ReactNode;
  size?: ButtonSize;
  /** Use size="icon" for icon-only buttons, and add an accessible name. */
  shape?: "default" | "square" | "circle";
  variant?: ButtonVariant;
  xstyle?: ControlLayoutStyles;
};

export function Button({
  className,
  style,
  align = "center",
  children,
  disabled,
  size = "md",
  shape = "default",
  variant = "primary",
  xstyle,
  ...props
}: ButtonProps) {
  const isStandardSize = size === "sm" || size === "md" || size === "lg";
  const shapeWidth = isStandardSize && shape !== "default" && squareStyles[size];
  const hasSolidBackground = variant === "primary" || variant === "destructive";

  return (
    <ButtonPrimitive
      {...props}
      disabled={disabled}
      {...mergeStyles(
        stylex.props(
          styles.root,
          alignStyles[align],
          variantStyles[variant],
          sizeStyles[size],
          !isStandardSize && styles.iconContent,
          shapeStyles[shape],
          shapeWidth,
          hasSolidBackground ? styles.solidInteraction : styles.surfaceInteraction,
          variant === "primary" && styles.primaryInteraction,
          disabled && styles.disabled,
          disabled && variant === "ghost" && styles.disabledGhost,
          xstyle,
        ),
        className,
        style,
      )}
    >
      {children}
    </ButtonPrimitive>
  );
}
