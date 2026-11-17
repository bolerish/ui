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

type StyleProps = { xstyle?: stylex.StyleXStyles };

export function Empty({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return <div {...props} {...mergeStyles(stylex.props(styles.root, xstyle), className, style)} />;
}

export function EmptyHeader({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return <div {...props} {...mergeStyles(stylex.props(styles.header, xstyle), className, style)} />;
}

export function EmptyMedia({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      {...mergeStyles(stylex.props(styles.media, xstyle), className, style)}
    />
  );
}

export function EmptyTitle({
  className,
  style,
  children,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"h3">> & StyleProps) {
  return (
    <h3 {...props} {...mergeStyles(stylex.props(styles.title, xstyle), className, style)}>
      {children}
    </h3>
  );
}

export function EmptyDescription({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"p">> & StyleProps) {
  return (
    <p {...props} {...mergeStyles(stylex.props(styles.description, xstyle), className, style)} />
  );
}

export function EmptyContent({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.content, xstyle), className, style)} />
  );
}

const styles = stylex.create({
  root: {
    alignItems: "center",
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.xl,
    borderStyle: "dashed",
    borderWidth: sizeVars.stroke,
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space6,
    justifyContent: "center",
    minWidth: 0,
    padding: spacingVars.space8,
    textAlign: "center",
  },
  header: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space2,
    maxWidth: sizeVars.contentSm,
  },
  media: {
    alignItems: "center",
    backgroundColor: colorVars.bgSubtle,
    borderRadius: radiusVars.md,
    color: colorVars.fgSecondary,
    display: "flex",
    height: sizeVars.touchTarget,
    justifyContent: "center",
    width: sizeVars.touchTarget,
  },
  title: {
    color: colorVars.fgPrimary,
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
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space4,
    maxWidth: sizeVars.contentSm,
    width: "100%",
  },
});
