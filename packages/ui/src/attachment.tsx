"use client";

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

import { Button, type ButtonProps } from "./button";
import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  root: {
    alignItems: "center",
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    display: "flex",
    minWidth: 0,
    position: "relative",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, border-color",
    transitionTimingFunction: motionVars.easingStandard,
  },

  error: {
    backgroundColor: colorVars.bgFeedbackError,
    borderColor: "transparent",
  },
  media: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    overflow: "hidden",
  },

  content: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: spacingVars.space1,
    minWidth: 0,
    paddingInlineEnd: spacingVars.space5,
    paddingInlineStart: spacingVars.space2,
  },
  title: {
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    lineHeight: typo.lineHeightTight,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  description: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeXs,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
  actions: {
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    gap: spacingVars.space1,
    position: "relative",
    zIndex: 2,
  },
  action: { minWidth: sizeVars.controlSm },
  trigger: {
    backgroundColor: "transparent",
    borderWidth: 0,
    borderRadius: "inherit",
    cursor: "pointer",
    inset: 0,
    outline: {
      default: "none",
      ":focus-visible": `${sizeVars.focusRing} solid ${colorVars.strokeFocus}`,
    },
    outlineOffset: { default: 0, ":focus-visible": 2 },
    position: "absolute",
    zIndex: 1,
  },
  group: {
    display: "flex",
    gap: spacingVars.space3,
    overflowX: "auto",
    paddingBlock: spacingVars.space1,
    scrollSnapType: "x proximity",
    width: "100%",
  },
});

const orientationStyles = stylex.create({
  horizontal: { flexDirection: "row" },
  vertical: { alignItems: "stretch", flexDirection: "column" },
});

const mediaVariantStyles = stylex.create({
  icon: {
    backgroundColor: colorVars.bgSubtle,
    borderRadius: radiusVars.sm,
    color: colorVars.fgSecondary,
    height: sizeVars.controlLg,
    width: sizeVars.controlLg,
  },
  image: {
    borderRadius: radiusVars.sm,
    height: "3rem",
    objectFit: "cover",
    width: "3rem",
  },
});

const sizeStyles = stylex.create({
  default: { gap: spacingVars.space3, minHeight: "4.5rem", padding: spacingVars.space3 },
  sm: { gap: spacingVars.space2, minHeight: sizeVars.touchTarget, padding: spacingVars.space2 },
  xs: { gap: spacingVars.space2, minHeight: sizeVars.controlMd, padding: spacingVars.space1 },
});

export type AttachmentState = "done" | "error" | "idle" | "processing" | "uploading";
export type AttachmentSize = "default" | "sm" | "xs";

export type AttachmentProps = StyledProps<Omit<ComponentProps<"div">, "title">> & {
  orientation?: "horizontal" | "vertical";
  size?: AttachmentSize;
  state?: AttachmentState;
  xstyle?: stylex.StyleXStyles;
};

export function Attachment({
  className,
  style,
  orientation = "horizontal",
  size = "default",
  state = "done",
  xstyle,
  ...props
}: AttachmentProps) {
  return (
    <div
      {...props}
      data-orientation={orientation}
      data-state={state}
      {...mergeStyles(
        stylex.props(
          styles.root,
          state !== "error" && surfaceStyles.panel,
          orientationStyles[orientation],
          sizeStyles[size],
          state === "error" && styles.error,
          xstyle,
        ),
        className,
        style,
      )}
    />
  );
}

export type AttachmentMediaProps = StyledProps<ComponentProps<"div">> & {
  variant?: "icon" | "image";
  xstyle?: stylex.StyleXStyles;
};

export function AttachmentMedia({
  className,
  style,
  xstyle,
  variant = "icon",
  ...props
}: AttachmentMediaProps) {
  return (
    <div
      {...props}
      {...mergeStyles(
        stylex.props(styles.media, mediaVariantStyles[variant], xstyle),
        className,
        style,
      )}
    />
  );
}

export function AttachmentContent({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.content, xstyle), className, style)} />
  );
}

export function AttachmentTitle({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: ControlPlacementStyles }) {
  return <div {...props} {...mergeStyles(stylex.props(styles.title, xstyle), className, style)} />;
}

export function AttachmentDescription({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"p">> & { xstyle?: ControlPlacementStyles }) {
  return (
    <p {...props} {...mergeStyles(stylex.props(styles.description, xstyle), className, style)} />
  );
}

export function AttachmentActions({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.actions, xstyle), className, style)} />
  );
}

export type AttachmentActionProps = Omit<ButtonProps, "size" | "variant">;

export function AttachmentAction({ xstyle, ...props }: AttachmentActionProps) {
  return <Button {...props} size="sm" variant="ghost" xstyle={[styles.action, xstyle]} />;
}

export function AttachmentTrigger({
  className,
  style,
  xstyle,
  type = "button",
  ...props
}: StyledProps<ComponentProps<"button">> & { xstyle?: ControlPlacementStyles }) {
  return (
    <button
      {...props}
      type={type}
      {...mergeStyles(stylex.props(styles.trigger, xstyle), className, style)}
    />
  );
}

export function AttachmentGroup({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return <div {...props} {...mergeStyles(stylex.props(styles.group, xstyle), className, style)} />;
}
