"use client";

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import {
  colorVars,
  motionVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { CaretDownIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlLayoutStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: { minWidth: 0, width: "100%" },
  item: {
    borderBottomColor: colorVars.strokeDefault,
    borderBottomStyle: "solid",
    borderBottomWidth: sizeVars.stroke,
  },
  header: { display: "flex", margin: 0 },
  trigger: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: "transparent",
    borderStyle: "none",
    borderWidth: 0,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "flex",
    flex: 1,
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    justifyContent: "space-between",
    lineHeight: typo.lineHeightNormal,
    outline: "none",
    paddingBlock: spacingVars.space4,
    paddingInline: 0,
    textAlign: "start",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "color",
    transitionTimingFunction: motionVars.easingStandard,
    ":hover": { textDecoration: "underline", textUnderlineOffset: spacingVars.space1 },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.focusRing,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    ":disabled": { cursor: "not-allowed" },
  },
  triggerDisabled: {
    color: colorVars.fgDisabled,
    cursor: "not-allowed",
    ":hover": { textDecoration: "none" },
  },
  icon: {
    alignItems: "center",
    display: "inline-flex",
    flexShrink: 0,
    height: sizeVars.iconMd,
    justifyContent: "center",
    transform: "rotate(0deg)",
    width: sizeVars.iconMd,
    ":is([data-panel-open] *)": { transform: "rotate(180deg)" },
  },
  panel: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeSm,
    height: "var(--accordion-panel-height)",
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
  panelContent: {
    paddingBottom: spacingVars.space4,
    paddingInlineEnd: spacingVars.space6,
    width: "100%",
  },
});

export function Accordion({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof AccordionPrimitive.Root>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <AccordionPrimitive.Root
      {...props}
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
    />
  );
}

export function AccordionItem({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof AccordionPrimitive.Item>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <AccordionPrimitive.Item
      {...props}
      {...mergeStyles(stylex.props(styles.item, xstyle), className, style)}
    />
  );
}

export function AccordionTrigger({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<typeof AccordionPrimitive.Trigger>> & {
  xstyle?: ControlLayoutStyles;
}) {
  function getTriggerStyles(state: AccordionPrimitive.Trigger.State) {
    return mergeStyles(
      stylex.props(styles.trigger, state.disabled && styles.triggerDisabled, xstyle),
      className,
      style,
    );
  }
  return (
    <AccordionPrimitive.Header {...stylex.props(styles.header)}>
      <AccordionPrimitive.Trigger
        {...props}
        className={(state) => getTriggerStyles(state).className}
        style={(state) => getTriggerStyles(state).style}
      >
        {children}
        <span aria-hidden="true" {...stylex.props(styles.icon)}>
          <CaretDownIcon />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<typeof AccordionPrimitive.Panel>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  function getPanelStyles(state: AccordionPrimitive.Panel.State) {
    return stylex.props(
      styles.panel,
      (state.transitionStatus === "starting" || state.transitionStatus === "ending") &&
        styles.panelTransitioning,
    );
  }
  return (
    <AccordionPrimitive.Panel
      {...props}
      className={(state) => getPanelStyles(state).className}
      style={(state) => getPanelStyles(state).style}
    >
      <div {...mergeStyles(stylex.props(styles.panelContent, xstyle), className, style)}>
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}
