"use client";

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

export type AvatarSize = "lg" | "md" | "sm";

export type AvatarProps = StyledProps<ComponentProps<typeof AvatarPrimitive.Root>> & {
  size?: AvatarSize;
  xstyle?: ControlPlacementStyles;
};

export function Avatar({ className, style, xstyle, size = "md", ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      {...props}
      {...mergeStyles(stylex.props(styles.root, sizeStyles[size], xstyle), className, style)}
    />
  );
}

export function AvatarImage({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof AvatarPrimitive.Image>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <AvatarPrimitive.Image
      {...props}
      {...mergeStyles(stylex.props(styles.image, xstyle), className, style)}
    />
  );
}

export function AvatarFallback({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof AvatarPrimitive.Fallback>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <AvatarPrimitive.Fallback
      {...props}
      {...mergeStyles(stylex.props(styles.fallback, xstyle), className, style)}
    />
  );
}

export function AvatarBadge({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"span">> & { xstyle?: ControlPlacementStyles }) {
  return <span {...props} {...mergeStyles(stylex.props(styles.badge, xstyle), className, style)} />;
}

export function AvatarGroup({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return <div {...props} {...mergeStyles(stylex.props(styles.group, xstyle), className, style)} />;
}

export function AvatarGroupCount({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"span">> & { xstyle?: ControlPlacementStyles }) {
  return (
    <span {...props} {...mergeStyles(stylex.props(styles.groupCount, xstyle), className, style)} />
  );
}

const styles = stylex.create({
  root: {
    backgroundColor: colorVars.bgSubtle,
    borderColor: colorVars.bgSurface,
    borderRadius: radiusVars.full,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgSecondary,
    display: "inline-flex",
    flexShrink: 0,
    overflow: "visible",
    position: "relative",
  },

  image: {
    borderRadius: "inherit",
    height: "100%",
    objectFit: "cover",
    overflow: "hidden",
    width: "100%",
  },
  fallback: {
    alignItems: "center",
    borderRadius: "inherit",
    display: "flex",
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    height: "100%",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
  },
  badge: {
    backgroundColor: colorVars.fgFeedbackSuccess,
    borderColor: colorVars.bgSurface,
    borderRadius: radiusVars.full,
    borderStyle: "solid",
    borderWidth: "0.125rem",
    bottom: "-0.0625rem",
    height: "0.75rem",
    position: "absolute",
    right: "-0.0625rem",
    width: "0.75rem",
  },
  group: { display: "flex", gap: spacingVars.space1 },
  groupCount: {
    alignItems: "center",
    backgroundColor: colorVars.bgSubtle,
    borderColor: colorVars.bgSurface,
    borderRadius: radiusVars.full,
    borderStyle: "solid",
    borderWidth: "0.125rem",
    color: colorVars.fgSecondary,
    display: "inline-flex",
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    height: sizeVars.controlMd,
    justifyContent: "center",
    width: sizeVars.controlMd,
  },
});

const sizeStyles = stylex.create({
  sm: { height: sizeVars.controlSm, width: sizeVars.controlSm },
  md: { height: sizeVars.controlMd, width: sizeVars.controlMd },
  lg: { height: sizeVars.controlLg, width: sizeVars.controlLg },
});
