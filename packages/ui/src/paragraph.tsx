import { colorVars } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlLayoutStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { typographyStyles } from "./typography";

export type ParagraphProps = StyledProps<ComponentProps<"p">> & {
  variant?: "body" | "description" | "caption";
  xstyle?: ControlLayoutStyles;
};

export function Paragraph({
  className,
  style,
  variant = "body",
  xstyle,
  ...props
}: ParagraphProps) {
  return (
    <p
      {...props}
      {...mergeStyles(
        stylex.props(
          styles.root,
          typographyStyles[variant],
          variant !== "body" && styles[variant],
          xstyle,
        ),
        className,
        style,
      )}
    />
  );
}

const styles = stylex.create({
  root: { color: colorVars.fgPrimary, margin: 0 },
  description: { color: colorVars.fgSecondary },
  caption: { color: colorVars.fgTertiary },
});
