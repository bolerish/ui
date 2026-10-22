"use client";

import { PreviewCard } from "@base-ui/react/preview-card";
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

const styles = stylex.create({
  popup: {
    backgroundColor: colorVars.bgRaised,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    boxShadow: shadowVars.floating,
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeSm,
    maxWidth: "20rem",
    outline: "none",
    padding: spacingVars.space4,
    transform: "translateY(0) scale(1)",
    transformOrigin: "var(--transform-origin)",
    transitionDuration: motionVars.durationNormal,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: motionVars.easingEnter,
    zIndex: layerVars.popup,
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transform: "none",
        transitionDuration: motionVars.durationInstant,
      },
    },
  },
  transitioning: { opacity: 0, transform: "translateY(0.25rem) scale(0.98)" },
  trigger: {
    color: colorVars.fgPrimary,
    textDecorationLine: "none",
    textDecorationThickness: sizeVars.stroke,
    textUnderlineOffset: "0.25em",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "text-decoration-color",
    transitionTimingFunction: motionVars.easingStandard,
    ":focus-visible": { textDecorationLine: "underline" },
    ":hover": { textDecorationLine: "underline" },
  },
});

export const HoverCard = PreviewCard.Root;

export type HoverCardTriggerProps = StyledProps<ComponentProps<typeof PreviewCard.Trigger>> & {
  xstyle?: stylex.StyleXStyles;
};

export function HoverCardTrigger({ className, style, xstyle, ...props }: HoverCardTriggerProps) {
  return (
    <PreviewCard.Trigger
      {...props}
      {...mergeStyles(stylex.props(styles.trigger, xstyle), className, style)}
    />
  );
}

export type HoverCardContentProps = StyledProps<ComponentProps<typeof PreviewCard.Popup>> & {
  align?: StyledProps<ComponentProps<typeof PreviewCard.Positioner>>["align"];
  side?: StyledProps<ComponentProps<typeof PreviewCard.Positioner>>["side"];
  sideOffset?: number;
  xstyle?: stylex.StyleXStyles;
};

export function HoverCardContent({
  className,
  style,
  align = "center",
  side = "bottom",
  sideOffset = 6,
  xstyle,
  ...props
}: HoverCardContentProps) {
  function getPopupStyles(state: PreviewCard.Popup.State) {
    return mergeStyles(
      stylex.props(
        styles.popup,
        xstyle,
        (state.transitionStatus === "starting" || state.transitionStatus === "ending") &&
          styles.transitioning,
      ),
      className,
      style,
    );
  }

  return (
    <PreviewCard.Portal>
      <PreviewCard.Positioner align={align} side={side} sideOffset={sideOffset}>
        <PreviewCard.Popup
          {...props}
          className={(state) => getPopupStyles(state).className}
          style={(state) => getPopupStyles(state).style}
        />
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  );
}
