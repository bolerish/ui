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

type StyleProps = {
  xstyle?: stylex.StyleXStyles;
};

type ElementProps = StyledProps<ComponentProps<"div">> & StyleProps;
type HeadingProps = StyledProps<ComponentProps<"h3">> & StyleProps;
type ParagraphProps = StyledProps<ComponentProps<"p">> & StyleProps;

export function Card({ className, style, xstyle, ...props }: ElementProps) {
  return (
    <div
      {...props}
      {...mergeStyles(
        stylex.props(styles.card, surfaceStyles.panel, surfaceStyles.edge, xstyle),
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

const styles = stylex.create({
  card: {
    paddingBlock: spacingVars.space6,
    gap: spacingVars.space6,
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.xl,
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
    gap: spacingVars.space2,
    paddingInline: spacingVars.space6,
  },
  title: {
    fontSize: typo.fontSizeLg,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
  description: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
  content: {
    paddingInline: spacingVars.space6,
  },
  footer: {
    borderTopColor: colorVars.strokeDefault,
    borderTopStyle: "solid",
    borderTopWidth: sizeVars.stroke,
    borderBottomLeftRadius: radiusVars.xl,
    borderBottomRightRadius: radiusVars.xl,
    paddingBlock: spacingVars.space6,
    paddingInline: spacingVars.space6,
  },
});
