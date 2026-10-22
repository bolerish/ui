"use client";

import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import {
  colorVars,
  layerVars,
  motionVars,
  radiusVars,
  shadowVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  positioner: { zIndex: layerVars.popup },
  popup: {
    backgroundColor: colorVars.bgRaised,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    boxShadow: shadowVars.floating,
    color: colorVars.fgPrimary,
    maxWidth: "calc(100vw - 2rem)",
    outline: "none",
    padding: spacingVars.space4,
    transform: "scale(1)",
    transformOrigin: "var(--transform-origin)",
    transitionDuration: motionVars.durationNormal,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: motionVars.easingEnter,
    width: sizeVars.contentXs,
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transform: "none",
        transitionDuration: motionVars.durationInstant,
      },
    },
  },
  popupTransitioning: { opacity: 0, transform: "scale(0.98)" },
  popupEnding: {
    transitionDuration: motionVars.durationFast,
    transitionTimingFunction: motionVars.easingExit,
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transitionDuration: motionVars.durationInstant,
      },
    },
  },
  header: { display: "flex", flexDirection: "column", gap: spacingVars.space1 },
  title: {
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
  description: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
});

export const Popover = PopoverPrimitive.Root;
export function PopoverTrigger({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof PopoverPrimitive.Trigger>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <PopoverPrimitive.Trigger {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />
  );
}
export function PopoverClose({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof PopoverPrimitive.Close>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <PopoverPrimitive.Close {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />
  );
}

type PopoverContentProps = StyledProps<ComponentProps<typeof PopoverPrimitive.Popup>> &
  Pick<ComponentProps<typeof PopoverPrimitive.Positioner>, "align" | "side" | "sideOffset"> & {
    xstyle?: stylex.StyleXStyles;
  };

export function PopoverContent({
  className,
  style,
  align = "start",
  side = "bottom",
  sideOffset = 6,
  xstyle,
  ...props
}: PopoverContentProps) {
  function getPopupStyles(state: PopoverPrimitive.Popup.State) {
    return mergeStyles(
      stylex.props(
        styles.popup,
        surfaceStyles.edge,
        surfaceStyles.floating,
        (state.transitionStatus === "starting" || state.transitionStatus === "ending") &&
          styles.popupTransitioning,
        state.transitionStatus === "ending" && styles.popupEnding,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <PopoverPrimitive.Popup
          {...props}
          className={(state) => getPopupStyles(state).className}
          style={(state) => getPopupStyles(state).style}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export function PopoverHeader({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return <div {...props} {...mergeStyles(stylex.props(styles.header, xstyle), className, style)} />;
}
export function PopoverTitle({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<"h2">> & { xstyle?: ControlPlacementStyles }) {
  return (
    <h2 {...props} {...mergeStyles(stylex.props(styles.title, xstyle), className, style)}>
      {children}
    </h2>
  );
}
export function PopoverDescription({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"p">> & { xstyle?: ControlPlacementStyles }) {
  return (
    <p {...props} {...mergeStyles(stylex.props(styles.description, xstyle), className, style)} />
  );
}
