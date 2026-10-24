import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  card: {
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    display: "flex",
    flexDirection: "column",
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeMd,
    lineHeight: typo.lineHeightNormal,
    minWidth: 0,
    width: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space1,
    paddingBlock: spacingVars.space6,
    paddingInline: spacingVars.space6,
  },
  title: {
    fontSize: typo.fontSizeLg,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightTight,
    margin: 0,
  },
  description: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
  content: {
    paddingBlockEnd: spacingVars.space6,
    paddingInline: spacingVars.space6,
  },
  footer: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: spacingVars.space3,
    justifyContent: "flex-end",
    paddingBlockEnd: spacingVars.space6,
    paddingInline: spacingVars.space6,
  },
});

type StyleProps = {
  xstyle?: stylex.StyleXStyles;
};

type ElementProps = StyledProps<ComponentProps<"div">> & StyleProps;
type HeadingProps = StyledProps<ComponentProps<"h3">> & StyleProps;
type ParagraphProps = StyledProps<ComponentProps<"p">> & StyleProps;

export function Card({
  className,
  style,
  variant = "default",
  xstyle,
  ...props
}: ElementProps & { variant?: "default" | "translucent" }) {
  return (
    <div
      {...props}
      {...mergeStyles(
        stylex.props(
          styles.card,
          surfaceStyles.panel,
          surfaceStyles.edge,
          variant === "translucent" && surfaceStyles.translucent,
          xstyle,
        ),
        className,
        style,
      )}
    />
  );
}

export function CardHeader({ className, style, xstyle, ...props }: ElementProps) {
  return <div {...props} {...mergeStyles(stylex.props(styles.header, xstyle), className, style)} />;
}

export function CardTitle({ className, style, children, xstyle, ...props }: HeadingProps) {
  return (
    <h3 {...props} {...mergeStyles(stylex.props(styles.title, xstyle), className, style)}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, style, xstyle, ...props }: ParagraphProps) {
  return (
    <p {...props} {...mergeStyles(stylex.props(styles.description, xstyle), className, style)} />
  );
}

export function CardContent({ className, style, xstyle, ...props }: ElementProps) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.content, xstyle), className, style)} />
  );
}

export function CardFooter({ className, style, xstyle, ...props }: ElementProps) {
  return <div {...props} {...mergeStyles(stylex.props(styles.footer, xstyle), className, style)} />;
}
