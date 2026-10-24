"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import {
  colorVars,
  motionVars,
  opacityVars,
  radiusVars,
  sizeVars,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlLayoutStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: {
    opacity: { default: 1, ":disabled": opacityVars.disabled },
    transitionDuration: motionVars.durationFast,
    transitionProperty: "opacity",
    transitionTimingFunction: motionVars.easingStandard,
    width: "100%",
  },
  control: {
    alignItems: "center",
    display: "flex",
    height: sizeVars.touchTarget,
    position: "relative",
    touchAction: "none",
    width: "100%",
  },
  track: {
    backgroundColor: colorVars.bgSubtle,
    borderRadius: radiusVars.full,
    height: sizeVars.trackSm,
    overflow: "hidden",
    width: "100%",
  },
  indicator: {
    backgroundColor: colorVars.bgActionPrimary,
    borderRadius: radiusVars.full,
    height: "100%",
  },
  thumb: {
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeAction,
    borderRadius: radiusVars.full,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    height: sizeVars.iconLg,
    outline: "none",
    width: sizeVars.iconLg,
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.focusRing,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
});

export type SliderProps = StyledProps<ComponentProps<typeof SliderPrimitive.Root>> & {
  /** Returns an accessible name for each thumb in a range slider. */
  getAriaLabel?: (index: number) => string;
  xstyle?: ControlLayoutStyles;
};

export function Slider({
  className,
  style,
  defaultValue,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  getAriaLabel,
  value,
  xstyle,
  ...props
}: SliderProps) {
  const currentValue = value ?? defaultValue;
  const thumbCount = Array.isArray(currentValue) ? currentValue.length : 1;
  return (
    <SliderPrimitive.Root
      {...props}
      defaultValue={defaultValue}
      value={value}
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
    >
      <SliderPrimitive.Control {...stylex.props(styles.control)}>
        <SliderPrimitive.Track {...stylex.props(styles.track)}>
          <SliderPrimitive.Indicator {...stylex.props(styles.indicator)} />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }, (_, index) => (
          <SliderPrimitive.Thumb
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            getAriaLabel={getAriaLabel}
            index={index}
            key={index}
            {...stylex.props(styles.thumb)}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}
