import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

export type AspectRatioProps = StyledProps<ComponentProps<"div">> & {
  ratio?: number;
  xstyle?: stylex.StyleXStyles;
};

export function AspectRatio({ className, style, ratio = 1, xstyle, ...props }: AspectRatioProps) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.root(ratio), xstyle), className, style)} />
  );
}

const styles = stylex.create({
  root: (ratio: number) => ({
    aspectRatio: ratio,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  }),
});
