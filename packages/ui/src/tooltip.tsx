"use client";

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
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

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  positioner: { zIndex: layerVars.notification },
  popup: {
    backgroundColor: colorVars.bgRaised,
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    borderRadius: radiusVars.sm,
    boxShadow: shadowVars.floating,
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeXs,
    lineHeight: typo.lineHeightNormal,
    maxWidth: sizeVars.contentXs,
    paddingBlock: spacingVars.space1,
    paddingInline: spacingVars.space3,
    transform: "scale(1)",
    transformOrigin: "var(--transform-origin)",
    transitionDuration: motionVars.durationNormal,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: motionVars.easingEnter,
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
  arrow: {
    fill: {
      default: colorVars.bgRaised,
      "@supports (backdrop-filter: blur(1px)) and (background-color: color-mix(in srgb, white, transparent))": `color-mix(in srgb, ${colorVars.bgRaised} var(--bolerish-material-opacity, 100%), transparent)`,
    },
    height: spacingVars.space2,
    width: spacingVars.space3,
    "@media (prefers-reduced-transparency: reduce)": { fill: colorVars.bgRaised },
    "@media (forced-colors: active)": { fill: "Canvas" },
  },
});

export const Tooltip = TooltipPrimitive.Root;
export const TooltipProvider = TooltipPrimitive.Provider;
export function TooltipTrigger({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof TooltipPrimitive.Trigger>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <TooltipPrimitive.Trigger {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />
  );
}

type TooltipContentProps = StyledProps<ComponentProps<typeof TooltipPrimitive.Popup>> &
  Pick<ComponentProps<typeof TooltipPrimitive.Positioner>, "align" | "side" | "sideOffset"> & {
    xstyle?: stylex.StyleXStyles;
  };

export function TooltipContent({
  className,
  style,
  align = "center",
  side = "top",
  sideOffset = 6,
  xstyle,
  ...props
}: TooltipContentProps) {
  function getPopupStyles(state: TooltipPrimitive.Popup.State) {
    return mergeStyles(
      stylex.props(
        styles.popup,
        surfaceStyles.raised,
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
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <TooltipPrimitive.Popup
          {...props}
          className={(state) => getPopupStyles(state).className}
          style={(state) => getPopupStyles(state).style}
        >
          {props.children}
          <TooltipPrimitive.Arrow {...stylex.props(styles.arrow)} />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}
