import { colorVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { typographyStyles } from "./typography";

export type HeadingProps = StyledProps<ComponentProps<"h1">> & {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "page" | "section" | "subsection";
  xstyle?: ControlPlacementStyles;
};

const elements = { 1: "h1", 2: "h2", 3: "h3", 4: "h4", 5: "h5", 6: "h6" } as const;

export function Heading({
  className,
  style,
  xstyle,
  level,
  size = "section",
  ...props
}: HeadingProps) {
  const Element = elements[level];
  return (
    <Element
      {...props}
      {...mergeStyles(stylex.props(styles.root, typographyStyles[size], xstyle), className, style)}
    />
  );
}

const styles = stylex.create({
  root: { color: colorVars.fgPrimary, margin: 0 },
});
