"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { colorVars, motionVars, radiusVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: { overflow: "hidden", position: "relative" },
  viewport: { height: "100%", width: "100%" },
  content: { minWidth: "100%" },
  scrollbar: {
    display: "flex",
    padding: spacingVars.space0_5,
    opacity: { default: 0, ":is([data-hovering], [data-scrolling])": 1 },
    pointerEvents: { default: "none", ":is([data-hovering], [data-scrolling])": "auto" },
    touchAction: "none",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, opacity",
    transitionTimingFunction: motionVars.easingStandard,
    userSelect: "none",
  },

  thumb: {
    backgroundColor: colorVars.strokeControl,
    borderRadius: radiusVars.full,
    flexShrink: 0,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color",
    transitionTimingFunction: motionVars.easingStandard,
    ":hover": { backgroundColor: colorVars.strokeStrong },
  },
  corner: { backgroundColor: "transparent" },
});

const orientationStyles = stylex.create({
  horizontal: { flexDirection: "row", height: 8, width: "100%" },
  vertical: { flexDirection: "column", height: "100%", width: 8 },
});

const thumbOrientationStyles = stylex.create({
  horizontal: { height: "100%", minWidth: 20 },
  vertical: { width: "100%", minHeight: 20 },
});

export type ScrollAreaProps = StyledProps<ComponentProps<typeof ScrollAreaPrimitive.Root>> & {
  children: ReactNode;
  scrollbars?: "both" | "horizontal" | "vertical";
  xstyle?: stylex.StyleXStyles;
};

export function ScrollArea({
  className,
  style,
  children,
  scrollbars = "vertical",
  xstyle,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root
      {...props}
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
    >
      {children}
      {scrollbars === "vertical" || scrollbars === "both" ? (
        <ScrollBar orientation="vertical" />
      ) : null}
      {scrollbars === "horizontal" || scrollbars === "both" ? (
        <ScrollBar orientation="horizontal" />
      ) : null}
      <ScrollAreaPrimitive.Corner {...stylex.props(styles.corner)} />
    </ScrollAreaPrimitive.Root>
  );
}

export function ScrollBar({
  className,
  style,
  xstyle,
  orientation = "vertical",
  ...props
}: StyledProps<ComponentProps<typeof ScrollAreaPrimitive.Scrollbar>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      {...props}
      {...mergeStyles(
        stylex.props(styles.scrollbar, orientationStyles[orientation], xstyle),
        className,
        style,
      )}
      orientation={orientation}
    >
      <ScrollAreaPrimitive.Thumb
        {...stylex.props(styles.thumb, thumbOrientationStyles[orientation])}
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export function ScrollAreaViewport({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof ScrollAreaPrimitive.Viewport>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <ScrollAreaPrimitive.Viewport
      {...props}
      {...mergeStyles(stylex.props(styles.viewport, xstyle), className, style)}
    />
  );
}

export function ScrollAreaContent({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof ScrollAreaPrimitive.Content>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <ScrollAreaPrimitive.Content
      {...props}
      {...mergeStyles(stylex.props(styles.content, xstyle), className, style)}
    />
  );
}
