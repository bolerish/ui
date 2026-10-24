"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import {
  colorVars,
  motionVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlLayoutStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  root: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    gap: spacingVars.space1,
    justifyContent: "center",
    isolation: "isolate",
    outline: "none",
    position: "relative",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, border-color, color, opacity",
    transitionTimingFunction: motionVars.easingStandard,
    "::after": {
      backgroundColor: {
        default: colorVars.interactionDefault,
        ":not(:disabled):hover": colorVars.interactionHover,
        ":not(:disabled):active": colorVars.interactionPressed,
      },
      borderRadius: "inherit",
      content: '""',
      inset: 0,
      pointerEvents: "none",
      position: "absolute",
      transitionDuration: motionVars.durationFast,
      transitionProperty: "background-color",
      transitionTimingFunction: motionVars.easingStandard,
      zIndex: -1,
    },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.focusRing,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    ":disabled": { cursor: "not-allowed" },
  },

  softPressed: {
    backgroundColor: colorVars.bgSelected,
  },
  pressed: {
    backgroundColor: colorVars.bgSelected,
    color: colorVars.fgPrimary,
  },
  outlinePressed: {
    boxShadow: `inset 0 0 0 ${sizeVars.stroke} ${colorVars.strokeDefault}`,
  },
  unavailable: { backgroundColor: colorVars.interactionDisabled },
  disabled: {
    color: colorVars.fgDisabled,
    cursor: "not-allowed",
  },
});

const sizeStyles = stylex.create({
  sm: {
    height: sizeVars.controlSm,
    minWidth: sizeVars.controlSm,
    paddingInline: spacingVars.space2,
  },
  md: {
    height: sizeVars.controlMd,
    minWidth: sizeVars.controlMd,
    paddingInline: spacingVars.space3,
  },
  lg: {
    height: sizeVars.controlLg,
    minWidth: sizeVars.controlLg,
    paddingInline: spacingVars.space4,
  },
});

const variantStyles = stylex.create({
  default: { backgroundColor: "transparent" },
  soft: { backgroundColor: "transparent" },
  outline: { backgroundColor: colorVars.bgSurface, borderColor: colorVars.strokeDefault },
});

export type ToggleSize = "lg" | "md" | "sm";
export type ToggleVariant = "default" | "outline" | "soft";

export type ToggleProps = StyledProps<ComponentProps<typeof TogglePrimitive>> & {
  size?: ToggleSize;
  variant?: ToggleVariant;
  xstyle?: ControlLayoutStyles;
};

export function Toggle({
  className,
  style,
  size = "md",
  variant = "default",
  xstyle,
  ...props
}: ToggleProps) {
  function getToggleStyles(state: TogglePrimitive.State) {
    return mergeStyles(
      stylex.props(
        styles.root,
        sizeStyles[size],
        variantStyles[variant],
        variant === "outline" && !state.pressed && !state.disabled && surfaceStyles.control,
        state.pressed && styles.pressed,
        state.pressed && variant === "outline" && styles.outlinePressed,
        state.pressed && variant === "soft" && styles.softPressed,
        state.disabled && !state.pressed && styles.unavailable,
        state.disabled && styles.disabled,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <TogglePrimitive
      {...props}
      className={(state) => getToggleStyles(state).className}
      style={(state) => getToggleStyles(state).style}
    />
  );
}
