"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import {
  colorVars,
  motionVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { ArrowsDownUpIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlLayoutStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space2,
    minWidth: 0,
    width: "100%",
  },
  trigger: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "flex",
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    flexShrink: 0,
    minHeight: sizeVars.controlSm,
    gap: spacingVars.space2,
    lineHeight: typo.lineHeightNormal,
    justifyContent: "center",
    outline: "none",
    paddingBlock: spacingVars.space1,
    paddingInline: spacingVars.space3,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    width: "fit-content",
    maxWidth: "100%",
    overflowWrap: "anywhere",
    textAlign: "start",
    ":hover": { backgroundColor: colorVars.interactionHover },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.focusRing,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    ":disabled": { cursor: "not-allowed" },
  },
  triggerDisabled: {
    backgroundColor: colorVars.interactionDisabled,
    color: colorVars.fgDisabled,
    cursor: "not-allowed",
    ":hover": { backgroundColor: colorVars.interactionDisabled },
  },
  panel: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeSm,
    height: "var(--collapsible-panel-height)",
    lineHeight: typo.lineHeightNormal,
    minWidth: 0,
    opacity: 1,
    overflow: "clip",
    // Leave room for control focus outlines without exposing collapsed content.
    overflowClipMargin: `calc(${sizeVars.focusRing} * 2)`,
    transitionDuration: motionVars.durationNormal,
    transitionProperty: "height, opacity",
    transitionTimingFunction: motionVars.easingStandard,
    width: "100%",
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transitionDuration: motionVars.durationInstant,
      },
    },
  },
  panelTransitioning: { height: 0, opacity: 0 },
  panelContent: { display: "flex", flexDirection: "column", gap: spacingVars.space2 },
  icon: {
    flexShrink: 0,
    alignItems: "center",
    display: "inline-flex",
  },
});

export function Collapsible({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof CollapsiblePrimitive.Root>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <CollapsiblePrimitive.Root
      {...props}
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
    />
  );
}

export function CollapsibleTrigger({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<typeof CollapsiblePrimitive.Trigger>> & {
  xstyle?: ControlLayoutStyles;
}) {
  function getTriggerStyles(state: CollapsiblePrimitive.Trigger.State) {
    return mergeStyles(
      stylex.props(styles.trigger, state.disabled && styles.triggerDisabled, xstyle),
      className,
      style,
    );
  }
  return (
    <CollapsiblePrimitive.Trigger
      {...props}
      className={(state) => getTriggerStyles(state).className}
      style={(state) => getTriggerStyles(state).style}
    >
      {children}
      <span aria-hidden="true" {...stylex.props(styles.icon)}>
        <ArrowsDownUpIcon />
      </span>
    </CollapsiblePrimitive.Trigger>
  );
}

export function CollapsiblePanel({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<typeof CollapsiblePrimitive.Panel>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  function getPanelStyles(state: CollapsiblePrimitive.Panel.State) {
    return mergeStyles(
      stylex.props(
        styles.panel,
        (state.transitionStatus === "starting" || state.transitionStatus === "ending") &&
          styles.panelTransitioning,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <CollapsiblePrimitive.Panel
      {...props}
      className={(state) => getPanelStyles(state).className}
      style={(state) => getPanelStyles(state).style}
    >
      {children}
    </CollapsiblePrimitive.Panel>
  );
}

export function CollapsibleContent({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.panelContent, xstyle), className, style)} />
  );
}
