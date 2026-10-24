"use client";

import {
  colorVars,
  motionVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { CaretDownIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlLayoutStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  root: { display: "inline-flex", position: "relative", width: "fit-content" },
  select: {
    appearance: "none",
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeSm,
    minWidth: "10rem",
    outline: "none",
    paddingInlineStart: spacingVars.space3,
    paddingInlineEnd: spacingVars.space8,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, border-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    width: "100%",
    ":hover:not(:disabled):not(:user-invalid):not(:focus-visible)": {
      borderColor: colorVars.strokeDefault,
    },
    ":focus-visible": {
      borderColor: colorVars.strokeFocus,
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    ":disabled": {
      backgroundColor: colorVars.bgSubtle,
      borderColor: colorVars.strokeDefault,
      color: colorVars.fgDisabled,
      cursor: "not-allowed",
      ":hover": { borderColor: colorVars.strokeDefault },
    },
  },

  icon: {
    color: colorVars.fgSecondary,
    pointerEvents: "none",
    position: "absolute",
    right: spacingVars.space3,
    top: "50%",
    transform: "translateY(-50%)",
  },
});

const sizeStyles = stylex.create({
  sm: { height: sizeVars.controlSm },
  md: { height: sizeVars.controlMd },
});

export type NativeSelectProps = StyledProps<Omit<ComponentProps<"select">, "size">> & {
  size?: "md" | "sm";
  xstyle?: ControlLayoutStyles;
};

export function NativeSelect({
  className,
  style,
  children,
  size = "md",
  xstyle,
  ...props
}: NativeSelectProps) {
  return (
    <span {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}>
      <select
        {...props}
        {...stylex.props(styles.select, !props.disabled && surfaceStyles.control, sizeStyles[size])}
      >
        {children}
      </select>
      <CaretDownIcon aria-hidden="true" {...stylex.props(styles.icon)} />
    </span>
  );
}

export function NativeSelectOption({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"option">> & { xstyle?: stylex.StyleXStyles }) {
  return <option {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />;
}
export function NativeSelectOptGroup({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"optgroup">> & { xstyle?: stylex.StyleXStyles }) {
  return <optgroup {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />;
}
