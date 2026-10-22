"use client";

import { Input as InputPrimitive } from "@base-ui/react/input";
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

const styles = stylex.create({
  root: {
    appearance: "none",
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeSm,
    fontFamily: typo.fontFamilyBody,
    height: sizeVars.controlMd,
    lineHeight: typo.lineHeightNormal,
    minWidth: 0,
    outline: "none",
    paddingInline: spacingVars.space3,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "border-color, opacity",
    transitionTimingFunction: motionVars.easingStandard,
    width: "100%",
    "::placeholder": {
      color: colorVars.fgTertiary,
    },
    ":hover:not(:disabled):not([aria-invalid='true']):not(:user-invalid):not(:focus-visible)": {
      borderColor: colorVars.strokeDefault,
    },
    ":focus-visible": {
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
    ":user-invalid": {
      borderColor: colorVars.strokeFeedbackError,
      ":focus-visible": {
        outlineColor: colorVars.strokeFeedbackError,
      },
    },
  },
  inline: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: 0,
    paddingInline: spacingVars.space1,
    paddingBlock: 0,
    fontSize: "inherit",
    fontWeight: "inherit",
    lineHeight: "inherit",
    color: "inherit",
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
      outlineOffset: sizeVars.stroke,
    },
  },
  invalid: {
    borderColor: colorVars.strokeFeedbackError,
    ":focus-visible": {
      outlineColor: colorVars.strokeFeedbackError,
    },
  },
});

export type InputProps = StyledProps<ComponentProps<typeof InputPrimitive>> & {
  xstyle?: ControlLayoutStyles;
  variant?: "outline" | "inline";
};

export function Input({
  className,
  style,
  "aria-invalid": ariaInvalid,
  variant = "outline",
  xstyle,
  ...props
}: InputProps) {
  const isInvalid = ariaInvalid === true || ariaInvalid === "true";
  return (
    <InputPrimitive
      {...props}
      aria-invalid={ariaInvalid}
      {...mergeStyles(
        stylex.props(
          styles.root,
          variant === "inline" && styles.inline,
          isInvalid && styles.invalid,
          xstyle,
        ),
        className,
        style,
      )}
    />
  );
}
