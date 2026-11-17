"use client";

import { Field as FieldPrimitive } from "@base-ui/react/field";
import { colorVars, spacingRoleVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { typographyStyles } from "./typography";

type StyleProps = { xstyle?: stylex.StyleXStyles };
type FieldOrientation = "horizontal" | "vertical";

export type FieldProps = StyledProps<ComponentProps<typeof FieldPrimitive.Root>> &
  StyleProps & { orientation?: FieldOrientation };

export function Field({
  className,
  style,
  orientation = "vertical",
  xstyle,
  ...props
}: FieldProps) {
  return (
    <FieldPrimitive.Root
      {...props}
      data-orientation={orientation}
      {...mergeStyles(
        stylex.props(styles.root, orientationStyles[orientation], xstyle),
        className,
        style,
      )}
    />
  );
}

export function FieldLabel({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof FieldPrimitive.Label>> & StyleProps) {
  return (
    <FieldPrimitive.Label
      {...props}
      {...mergeStyles(stylex.props(typographyStyles.label, styles.label, xstyle), className, style)}
    />
  );
}

export function FieldDescription({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof FieldPrimitive.Description>> & StyleProps) {
  return (
    <FieldPrimitive.Description
      {...props}
      {...mergeStyles(
        stylex.props(typographyStyles.description, styles.description, xstyle),
        className,
        style,
      )}
    />
  );
}

export function FieldError({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof FieldPrimitive.Error>> & StyleProps) {
  return (
    <FieldPrimitive.Error
      {...props}
      {...mergeStyles(
        stylex.props(typographyStyles.description, styles.error, xstyle),
        className,
        style,
      )}
    />
  );
}

export function FieldSet({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"fieldset">> & StyleProps) {
  return (
    <fieldset {...props} {...mergeStyles(stylex.props(styles.set, xstyle), className, style)} />
  );
}

export function FieldLegend({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"legend">> & StyleProps) {
  return (
    <legend {...props} {...mergeStyles(stylex.props(styles.legend, xstyle), className, style)} />
  );
}

export function FieldGroup({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return <div {...props} {...mergeStyles(stylex.props(styles.group, xstyle), className, style)} />;
}

export function FieldContent({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.content, xstyle), className, style)} />
  );
}

export function FieldTitle({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return (
    <div
      {...props}
      {...mergeStyles(stylex.props(typographyStyles.label, styles.title, xstyle), className, style)}
    />
  );
}

const styles = stylex.create({
  root: { display: "flex", gap: spacingRoleVars.labelGap, width: "100%" },

  label: {
    color: colorVars.fgPrimary,
    cursor: "default",
  },
  description: {
    color: colorVars.fgSecondary,
    margin: 0,
  },
  error: {
    color: colorVars.fgFeedbackError,
  },
  set: {
    borderStyle: "none",
    borderWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: spacingRoleVars.fieldGap,
    margin: 0,
    minWidth: 0,
    padding: 0,
  },
  legend: {
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeMd,
    fontWeight: typo.fontWeightMedium,
    marginBottom: spacingVars.space3,
    padding: 0,
  },
  group: { display: "flex", flexDirection: "column", gap: spacingRoleVars.fieldGap, width: "100%" },
  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: spacingRoleVars.textGap,
    minWidth: 0,
  },
  title: {
    color: colorVars.fgPrimary,
  },
});

const orientationStyles = stylex.create({
  horizontal: { alignItems: "baseline", flexDirection: "row", gap: spacingRoleVars.fieldGap },
  vertical: { flexDirection: "column" },
});
