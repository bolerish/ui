import { colorVars, motionVars, radiusVars, sizeVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } });

const styles = stylex.create({
  root: {
    animationDuration: motionVars.durationLoading,
    animationIterationCount: "infinite",
    animationName: spin,
    animationTimingFunction: "linear",
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.full,
    borderRightColor: colorVars.fgPrimary,
    borderStyle: "solid",
    borderWidth: sizeVars.focusRing,
    display: "inline-block",
    height: sizeVars.iconMd,
    width: sizeVars.iconMd,
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        animationDuration: motionVars.durationLoadingReduced,
      },
    },
  },
});

export type SpinnerProps = StyledProps<ComponentProps<"output">> & {
  label?: string;
  xstyle?: ControlPlacementStyles;
};

export function Spinner({ className, style, xstyle, label = "Loading", ...props }: SpinnerProps) {
  return (
    <output
      {...props}
      aria-label={label}
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
    />
  );
}
