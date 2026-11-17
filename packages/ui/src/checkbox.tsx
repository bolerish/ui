"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import {
  colorVars,
  motionVars,
  opacityVars,
  radiusVars,
  sizeVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { CheckIcon } from "@phosphor-icons/react/ssr";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

export type CheckboxProps = StyledProps<ComponentProps<typeof CheckboxPrimitive.Root>> & {
  xstyle?: ControlPlacementStyles;
};

export function Checkbox({ className, style, xstyle, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      {...props}
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
    >
      <CheckboxPrimitive.Indicator {...stylex.props(styles.indicator)}>
        <CheckIcon aria-hidden="true" weight="bold" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

const styles = stylex.create({
  root: {
    alignItems: "center",
    backgroundColor: {
      default: colorVars.bgSurface,
      ":is([data-checked])": colorVars.bgActionPrimary,
    },
    borderColor: {
      default: colorVars.strokeControl,
      ":is([data-checked])": colorVars.bgActionPrimary,
    },
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgOnActionPrimary,
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    display: "inline-flex",
    flexShrink: 0,
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    lineHeight: typo.lineHeightNormal,
    height: sizeVars.iconLg,
    justifyContent: "center",
    minHeight: sizeVars.iconLg,
    minWidth: sizeVars.iconLg,
    opacity: { default: 1, ":is([data-disabled])": opacityVars.disabled },
    outline: "none",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, border-color, opacity",
    transitionTimingFunction: motionVars.easingStandard,
    width: sizeVars.iconLg,
    // Keep a text baseline whether the checked indicator is mounted or not.
    "::before": { content: '"\\200b"' },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.focusRing,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  indicator: {
    alignItems: "center",
    display: "inline-flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
});
