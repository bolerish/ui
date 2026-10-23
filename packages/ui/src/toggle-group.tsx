"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import {
  colorVars,
  motionVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { createContext, useContext, type ComponentProps, type ReactNode } from "react";

import type { ControlLayoutStyles, ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import type { ToggleSize, ToggleVariant } from "./toggle";

const styles = stylex.create({
  root: { alignItems: "center", display: "inline-flex", width: "fit-content" },

  outlineItem: {
    borderColor: "transparent",
    borderRadius: 0,
    marginInlineStart: `calc(${sizeVars.stroke} * -1)`,
    ":first-child": {
      borderStartStartRadius: radiusVars.sm,
      borderEndStartRadius: radiusVars.sm,
    },
    ":last-child": {
      borderStartEndRadius: radiusVars.sm,
      borderEndEndRadius: radiusVars.sm,
    },
  },
  item: {
    alignItems: "center",
    borderColor: "transparent",
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    gap: spacingVars.space1,
    justifyContent: "center",
    isolation: "isolate",
    outline: "none",
    position: "relative",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, border-color, color, opacity",
    transitionTimingFunction: motionVars.easingStandard,
    "::after": {
      backgroundColor: {
        default: colorVars.interactionDefault,
        ":not(:disabled):hover": colorVars.interactionHover,
        ":not(:disabled):active": colorVars.interactionPressed,
      },
      borderRadius: "inherit",
      content: '""',
      inset: 0,
      pointerEvents: "none",
      position: "absolute",
      transitionDuration: motionVars.durationFast,
      transitionProperty: "background-color",
      transitionTimingFunction: motionVars.easingStandard,
      zIndex: -1,
    },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.focusRing,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    ":disabled": { cursor: "not-allowed" },
  },

  softPressed: {
    backgroundColor: colorVars.interactionSelected,
  },
  itemPressed: {
    backgroundColor: colorVars.bgSelected,
    color: colorVars.fgPrimary,
  },
  outlinePressed: {
    boxShadow: `inset 0 0 0 ${sizeVars.stroke} ${colorVars.strokeDefault}`,
  },
  unavailable: { backgroundColor: colorVars.interactionDisabled },
  itemDisabled: {
    color: colorVars.fgDisabled,
    cursor: "not-allowed",
  },
});

const variantStyles = stylex.create({
  default: { gap: spacingVars.space1 },
  soft: {
    gap: spacingVars.space0_5,
    padding: spacingVars.space0_5,
    backgroundColor: colorVars.bgSubtle,
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    borderRadius: radiusVars.sm,
  },
  outline: {
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    gap: 0,
  },
});

const itemSizeStyles = stylex.create({
  sm: {
    height: sizeVars.controlSm,
    minWidth: sizeVars.controlSm,
    paddingInline: spacingVars.space2,
  },
  md: {
    height: sizeVars.controlMd,
    minWidth: sizeVars.controlMd,
    paddingInline: spacingVars.space3,
  },
  lg: {
    height: sizeVars.controlLg,
    minWidth: sizeVars.controlLg,
    paddingInline: spacingVars.space4,
  },
});

const itemVariantStyles = stylex.create({
  default: { backgroundColor: "transparent" },
  soft: { backgroundColor: "transparent" },
  outline: { backgroundColor: colorVars.bgSurface, borderColor: colorVars.strokeDefault },
});

type ToggleGroupContextValue = { size: ToggleSize; variant: ToggleVariant };
const ToggleGroupContext = createContext<ToggleGroupContextValue>({
  size: "md",
  variant: "default",
});

export type ToggleGroupProps = StyledProps<ComponentProps<typeof ToggleGroupPrimitive>> & {
  children: ReactNode;
  size?: ToggleSize;
  variant?: ToggleVariant;
  xstyle?: ControlLayoutStyles;
};

export function ToggleGroup({
  className,
  style,
  children,
  size = "md",
  variant = "default",
  xstyle,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive
      {...props}
      {...mergeStyles(stylex.props(styles.root, variantStyles[variant], xstyle), className, style)}
    >
      <ToggleGroupContext value={{ size, variant }}>{children}</ToggleGroupContext>
    </ToggleGroupPrimitive>
  );
}

export type ToggleGroupItemProps = StyledProps<ComponentProps<typeof TogglePrimitive>> & {
  size?: ToggleSize;
  variant?: ToggleVariant;
  xstyle?: ControlPlacementStyles;
};

export function ToggleGroupItem({
  className,
  style,
  size,
  variant,
  xstyle,
  ...props
}: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);
  const finalSize = size ?? context.size;
  const finalVariant = variant ?? context.variant;
  function getToggleStyles(state: TogglePrimitive.State) {
    return mergeStyles(
      stylex.props(
        styles.item,
        itemSizeStyles[finalSize],
        itemVariantStyles[finalVariant],
        state.pressed && styles.itemPressed,
        state.pressed && finalVariant === "outline" && styles.outlinePressed,
        state.pressed && finalVariant === "soft" && styles.softPressed,
        state.disabled && !state.pressed && styles.unavailable,
        state.disabled && styles.itemDisabled,
        finalVariant === "outline" && styles.outlineItem,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <TogglePrimitive
      {...props}
      className={(state) => getToggleStyles(state).className}
      style={(state) => getToggleStyles(state).style}
    />
  );
}
