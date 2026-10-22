"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import {
  colorVars,
  motionVars,
  opacityVars,
  radiusVars,
  sizeVars,
  spacingVars,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlLayoutStyles, ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  group: { display: "flex", flexDirection: "column", gap: spacingVars.space3 },
  item: {
    alignItems: "center",
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.full,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    display: "inline-flex",
    height: sizeVars.controlXs,
    justifyContent: "center",
    opacity: { default: 1, ":is([data-disabled])": opacityVars.disabled },
    outline: "none",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "border-color, opacity",
    transitionTimingFunction: motionVars.easingStandard,
    width: sizeVars.controlXs,
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.focusRing,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  indicator: { alignItems: "center", display: "inline-flex", justifyContent: "center" },
  dot: {
    backgroundColor: colorVars.bgActionPrimary,
    borderRadius: radiusVars.full,
    height: sizeVars.iconXs,
    width: sizeVars.iconXs,
  },
});

export type RadioGroupProps = StyledProps<ComponentProps<typeof RadioGroupPrimitive>> & {
  xstyle?: ControlLayoutStyles;
};

export function RadioGroup({ className, style, xstyle, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      {...props}
      {...mergeStyles(stylex.props(styles.group, xstyle), className, style)}
    />
  );
}

export type RadioGroupItemProps = StyledProps<ComponentProps<typeof RadioPrimitive.Root>> & {
  xstyle?: ControlPlacementStyles;
};

export function RadioGroupItem({ className, style, xstyle, ...props }: RadioGroupItemProps) {
  return (
    <RadioPrimitive.Root
      {...props}
      {...mergeStyles(stylex.props(styles.item, xstyle), className, style)}
    >
      <RadioPrimitive.Indicator {...stylex.props(styles.indicator)}>
        <span {...stylex.props(styles.dot)} />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  );
}
