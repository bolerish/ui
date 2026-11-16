import { colorVars, radiusVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: {
    backgroundColor: colorVars.bgSubtle,
    borderRadius: radiusVars.md,
    color: colorVars.fgPrimary,
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },

  content: { display: "grid", gap: spacingVars.space1, minWidth: 0 },
  action: { alignItems: "center", display: "flex", gap: spacingVars.space2 },
  title: {
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightTight,
  },
  description: {
    color: "currentColor",
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    opacity: 0.82,
  },
});

const sizeStyles = stylex.create({
  sm: {
    borderRadius: radiusVars.md,
    gap: spacingVars.space1,
    paddingBlock: spacingVars.space2,
    paddingInline: spacingVars.space3,
  },
  md: {
    gap: spacingVars.space2,
    paddingBlock: spacingVars.space3,
    paddingInline: spacingVars.space4,
  },
});

export type BannerSize = "md" | "sm";
export type BannerAnnounce = "assertive" | "polite";

type StyleProps = { xstyle?: stylex.StyleXStyles };

export type BannerProps = StyledProps<Omit<ComponentProps<"div">, "title">> &
  StyleProps & {
    /** Announces a Banner that is added or updated after the initial page render. */
    announce?: BannerAnnounce;
    size?: BannerSize;
  };

export function Banner({
  className,
  style,
  announce,
  children,
  role,
  size = "md",
  xstyle,
  ...props
}: BannerProps) {
  let liveRole: "alert" | "status" | undefined;
  if (announce === "assertive") {
    liveRole = "alert";
  } else if (announce === "polite") {
    liveRole = "status";
  }

  return (
    <div
      {...props}
      role={role ?? liveRole}
      {...mergeStyles(stylex.props(styles.root, sizeStyles[size], xstyle), className, style)}
    >
      {children}
    </div>
  );
}

export function BannerTitle({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return <div {...props} {...mergeStyles(stylex.props(styles.title, xstyle), className, style)} />;
}

export function BannerDescription({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.description, xstyle), className, style)} />
  );
}

export function BannerContent({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.content, xstyle), className, style)} />
  );
}

export function BannerActions({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & StyleProps) {
  return <div {...props} {...mergeStyles(stylex.props(styles.action, xstyle), className, style)} />;
}
