"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
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
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import type { ControlLayoutStyles, ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  trigger: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "inline-flex",
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space2,
    height: sizeVars.controlMd,
    justifyContent: "space-between",
    width: "11rem",
    outline: "none",
    paddingInline: spacingVars.space3,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, border-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    ":hover": { backgroundColor: colorVars.bgSurfacePressed },
    ":focus-visible": {
      borderColor: colorVars.strokeFocus,
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    ":disabled": { cursor: "not-allowed" },
  },
  triggerDisabled: {
    backgroundColor: colorVars.bgSubtle,
    borderColor: colorVars.strokeDefault,
    color: colorVars.fgDisabled,
    cursor: "not-allowed",
    ":hover": { backgroundColor: colorVars.bgSubtle },
  },
  triggerIcon: {
    alignItems: "center",
    color: colorVars.fgSecondary,
    display: "inline-flex",
    flexShrink: 0,
  },
  positioner: { zIndex: layerVars.popup },
  popup: {
    backgroundColor: colorVars.bgRaised,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    boxShadow: shadowVars.floating,
    color: colorVars.fgPrimary,
    maxHeight: "min(20rem, var(--available-height))",
    minWidth: "var(--anchor-width)",
    outline: "none",
    overflow: "hidden",
    padding: spacingVars.space1,
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
  list: {
    overflowX: "hidden",
    minWidth: 0,
    overflowY: "auto",
    overscrollBehavior: "contain",
    padding: 0,
  },
  item: {
    alignItems: "center",
    borderRadius: radiusVars.sm,
    color: colorVars.fgPrimary,
    cursor: "default",
    display: "flex",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space2,
    minHeight: sizeVars.controlSm,
    outline: "none",
    paddingInlineEnd: spacingVars.space3,
    paddingInlineStart: spacingVars.space8,
    position: "relative",
    userSelect: "none",
  },
  itemHighlighted: { backgroundColor: colorVars.interactionHover },
  itemDisabled: {
    backgroundColor: "transparent",
    color: colorVars.fgDisabled,
    cursor: "not-allowed",
  },
  indicator: {
    alignItems: "center",
    display: "inline-flex",
    insetInlineStart: spacingVars.space2,
    justifyContent: "center",
    position: "absolute",
  },
  label: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    paddingBlock: spacingVars.space2,
    paddingInline: spacingVars.space2,
  },
  separator: {
    backgroundColor: colorVars.strokeDefault,
    height: sizeVars.stroke,
    marginBlock: spacingVars.space1,
    marginInline: `calc(${spacingVars.space1} * -1)`,
  },
});

export const Select = SelectPrimitive.Root;
export function SelectValue({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof SelectPrimitive.Value>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <SelectPrimitive.Value {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />
  );
}
export function SelectGroup({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof SelectPrimitive.Group>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <SelectPrimitive.Group {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />
  );
}

export function SelectTrigger({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<typeof SelectPrimitive.Trigger>> & {
  xstyle?: ControlLayoutStyles;
}) {
  function getTriggerStyles(state: SelectPrimitive.Trigger.State) {
    return mergeStyles(
      stylex.props(
        styles.trigger,
        !state.disabled && surfaceStyles.control,
        state.disabled && styles.triggerDisabled,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <SelectPrimitive.Trigger
      {...props}
      className={(state) => getTriggerStyles(state).className}
      style={(state) => getTriggerStyles(state).style}
    >
      {children}
      <SelectPrimitive.Icon {...stylex.props(styles.triggerIcon)}>
        <CaretDownIcon aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

type SelectPopupProps = StyledProps<ComponentProps<typeof SelectPrimitive.Popup>> &
  Pick<
    ComponentProps<typeof SelectPrimitive.Positioner>,
    "align" | "alignItemWithTrigger" | "side" | "sideOffset"
  > & { children: ReactNode } & {
    xstyle?: stylex.StyleXStyles;
  };

export function SelectPopup({
  className,
  style,
  xstyle,
  align = "start",
  alignItemWithTrigger = false,
  children,
  side = "bottom",
  sideOffset = 4,
  ...props
}: SelectPopupProps) {
  function getPopupStyles(state: SelectPrimitive.Popup.State) {
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
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        align={align}
        alignItemWithTrigger={alignItemWithTrigger}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <SelectPrimitive.Popup
          {...props}
          className={(state) => getPopupStyles(state).className}
          style={(state) => getPopupStyles(state).style}
        >
          {children}
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<typeof SelectPrimitive.Item>> & {
  xstyle?: ControlLayoutStyles;
}) {
  function getItemStyles(state: SelectPrimitive.Item.State) {
    return mergeStyles(
      stylex.props(
        styles.item,
        state.highlighted && styles.itemHighlighted,
        state.disabled && styles.itemDisabled,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <SelectPrimitive.Item
      {...props}
      className={(state) => getItemStyles(state).className}
      style={(state) => getItemStyles(state).style}
    >
      <SelectPrimitive.ItemIndicator {...stylex.props(styles.indicator)}>
        <CheckIcon aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

export function SelectLabel({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof SelectPrimitive.GroupLabel>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <SelectPrimitive.GroupLabel
      {...props}
      {...mergeStyles(stylex.props(styles.label, xstyle), className, style)}
    />
  );
}

export function SelectSeparator({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof SelectPrimitive.Separator>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <SelectPrimitive.Separator
      {...props}
      {...mergeStyles(stylex.props(styles.separator, xstyle), className, style)}
    />
  );
}

export function SelectList({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof SelectPrimitive.List>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <SelectPrimitive.List
      {...props}
      {...mergeStyles(stylex.props(styles.list, xstyle), className, style)}
    />
  );
}
