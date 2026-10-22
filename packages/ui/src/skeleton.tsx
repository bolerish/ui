import { colorVars, radiusVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const pulse = stylex.keyframes({ "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.5 } });

const styles = stylex.create({
  root: {
    animationDuration: "1.5s",
    animationIterationCount: "infinite",
    animationName: pulse,
    animationTimingFunction: "ease-in-out",
    backgroundColor: colorVars.bgSkeleton,
    borderRadius: radiusVars.sm,
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": { animationName: "none" },
    },
  },
});

export type SkeletonProps = StyledProps<ComponentProps<"div">> & {
  xstyle?: stylex.StyleXStyles;
};

export function Skeleton({ className, style, xstyle, ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
    />
  );
}
