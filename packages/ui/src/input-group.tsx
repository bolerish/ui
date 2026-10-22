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
import type { ComponentProps, MouseEvent } from "react";

import { Button, type ButtonProps } from "./button";
import type { InputProps } from "./input";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import type { TextareaProps } from "./textarea";

const styles = stylex.create({
  root: {
    alignItems: "center",
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    display: "flex",
    flexWrap: "wrap",
    minHeight: sizeVars.controlMd,
    minWidth: 0,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "border-color",
    transitionTimingFunction: motionVars.easingStandard,
    width: "100%",
    ":focus-within": {
      borderColor: colorVars.strokeFocus,
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  invalid: {
    borderColor: colorVars.strokeFeedbackError,
    ":focus-within": {
      borderColor: colorVars.strokeFeedbackError,
      outlineColor: colorVars.strokeFeedbackError,
    },
  },
  addon: {
    alignItems: "center",
    color: colorVars.fgSecondary,
    cursor: "text",
    display: "flex",
    flexShrink: 0,
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space2,
    minHeight: sizeVars.controlMd,
  },

  control: {
    appearance: "none",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderStyle: "none",
    borderWidth: 0,
    borderRadius: radiusVars.sm,
    boxShadow: "none",
    flex: 1,
    minWidth: 0,
    outline: "none",
    ":hover": { borderColor: "transparent" },
    ":focus-visible": {
      borderColor: "transparent",
      outlineColor: "transparent",
      outlineOffset: 0,
      outlineStyle: "none",
      outlineWidth: 0,
    },
  },
  textarea: { minHeight: "5rem" },
  input: {
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeSm,
    fontFamily: typo.fontFamilyBody,
    height: sizeVars.controlMd,
    lineHeight: typo.lineHeightNormal,
    paddingInline: spacingVars.space3,
    width: "100%",
    "::placeholder": { color: colorVars.fgTertiary },
    ":disabled": {
      backgroundColor: colorVars.bgSubtle,
      color: colorVars.fgDisabled,
      cursor: "not-allowed",
    },
  },
  button: { flexShrink: 0, margin: spacingVars.space1 },
  text: {
    alignItems: "center",
    color: colorVars.fgSecondary,
    display: "inline-flex",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space2,
  },
});

const alignStyles = stylex.create({
  "inline-start": { order: -1, paddingInlineStart: spacingVars.space3 },
  "inline-end": { order: 1, paddingInlineEnd: spacingVars.space3 },
  "block-start": {
    alignSelf: "stretch",
    justifyContent: "flex-start",
    order: -1,
    paddingInline: spacingVars.space3,
    width: "100%",
  },
  "block-end": {
    alignSelf: "stretch",
    justifyContent: "flex-start",
    order: 1,
    paddingInline: spacingVars.space3,
    width: "100%",
  },
});

type StyleProps = { xstyle?: stylex.StyleXStyles };
type AddonAlignment = "block-end" | "block-start" | "inline-end" | "inline-start";

export type InputGroupProps = StyledProps<ComponentProps<"div">> &
  StyleProps & { invalid?: boolean };

export function InputGroup({
  className,
  style,
  invalid = false,
  xstyle,
  ...props
}: InputGroupProps) {
  return (
    <div
      {...props}
      data-invalid={invalid || undefined}
      {...mergeStyles(
        stylex.props(styles.root, invalid && styles.invalid, xstyle),
        className,
        style,
      )}
    />
  );
}

export function InputGroupAddon({
  className,
  style,
  align = "inline-start",
  onClick,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps & { align?: AddonAlignment }) {
  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || (event.target as HTMLElement).closest("button")) return;
    event.currentTarget.parentElement?.querySelector<HTMLElement>("input, textarea")?.focus();
  };

  return (
    <div
      {...props}
      role="presentation"
      data-align={align}
      onClick={handleClick}
      {...mergeStyles(stylex.props(styles.addon, alignStyles[align], xstyle), className, style)}
    />
  );
}

export function InputGroupInput({
  className,
  style,
  xstyle,
  ...props
}: Omit<InputProps, "variant">) {
  return (
    <InputPrimitive
      {...props}
      {...mergeStyles(stylex.props(styles.input, styles.control, xstyle), className, style)}
    />
  );
}

export function InputGroupTextarea({ className, style, xstyle, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      {...mergeStyles(stylex.props(styles.control, styles.textarea, xstyle), className, style)}
    />
  );
}

export function InputGroupButton({
  size = "sm",
  variant = "ghost",
  xstyle,
  ...props
}: ButtonProps) {
  return <Button {...props} size={size} variant={variant} xstyle={[styles.button, xstyle]} />;
}

export function InputGroupText({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"span">> & StyleProps) {
  return <span {...props} {...mergeStyles(stylex.props(styles.text, xstyle), className, style)} />;
}
