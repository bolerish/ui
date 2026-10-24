"use client";

import { OTPField } from "@base-ui/react/otp-field";
import {
  colorVars,
  motionVars,
  opacityVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlLayoutStyles, ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  root: { alignItems: "center", display: "flex", gap: spacingVars.space2 },
  group: { display: "flex" },
  slot: {
    appearance: "none",
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: 0,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    height: sizeVars.controlLg,
    marginInlineStart: `calc(${sizeVars.stroke} * -1)`,
    outline: "none",
    textAlign: "center",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, border-color, box-shadow, opacity",
    transitionTimingFunction: motionVars.easingStandard,
    width: sizeVars.controlLg,
    ":first-child": {
      borderBottomLeftRadius: radiusVars.sm,
      borderTopLeftRadius: radiusVars.sm,
      marginInlineStart: 0,
    },
    ":last-child": { borderBottomRightRadius: radiusVars.sm, borderTopRightRadius: radiusVars.sm },
    ":hover:not(:disabled)": { borderColor: colorVars.strokeDefault },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
      zIndex: 1,
    },
    ":disabled": { cursor: "not-allowed", opacity: opacityVars.disabled },
  },
  separator: { color: colorVars.fgTertiary, paddingInline: spacingVars.space1 },
});

export type InputOTPProps = StyledProps<ComponentProps<typeof OTPField.Root>> & {
  xstyle?: ControlLayoutStyles;
};

export function InputOTP({ className, style, xstyle, ...props }: InputOTPProps) {
  return (
    <OTPField.Root
      {...props}
      {...mergeStyles(stylex.props(styles.root, surfaceStyles.control, xstyle), className, style)}
    />
  );
}

export function InputOTPGroup({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return <div {...props} {...mergeStyles(stylex.props(styles.group, xstyle), className, style)} />;
}

export function InputOTPSlot({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof OTPField.Input>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <OTPField.Input
      {...props}
      {...mergeStyles(stylex.props(styles.slot, xstyle), className, style)}
    />
  );
}

export function InputOTPSeparator({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"span">> & { xstyle?: ControlPlacementStyles }) {
  return (
    <span
      aria-hidden="true"
      {...props}
      {...mergeStyles(stylex.props(styles.separator, xstyle), className, style)}
    >
      {props.children ?? "–"}
    </span>
  );
}
