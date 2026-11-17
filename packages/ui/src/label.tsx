import { colorVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
/* oxlint-disable jsx-a11y/label-has-associated-control -- The caller provides htmlFor or nests the control. */
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { typographyStyles } from "./typography";

export type LabelProps = StyledProps<ComponentProps<"label">> & {
  xstyle?: ControlPlacementStyles;
};

export function Label({ className, style, xstyle, ...props }: LabelProps) {
  return (
    <label
      {...props}
      {...mergeStyles(stylex.props(typographyStyles.title, styles.root, xstyle), className, style)}
    />
  );
}

const styles = stylex.create({
  root: {
    alignItems: "center",
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "inline-flex",
    gap: spacingVars.space2,
    userSelect: "none",
  },
});
