"use client";

import {
  colorVars,
  motionVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: { minWidth: 0 },
  list: {
    alignItems: "center",
    color: colorVars.fgSecondary,
    display: "flex",
    flexWrap: "wrap",
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space2,
    lineHeight: typo.lineHeightNormal,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  item: { alignItems: "center", display: "inline-flex", gap: spacingVars.space2 },
  link: {
    borderRadius: radiusVars.sm,
    color: colorVars.fgSecondary,
    outline: "none",
    textDecoration: "none",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "color, text-decoration-color",
    transitionTimingFunction: motionVars.easingStandard,
    ":hover": { color: colorVars.fgPrimary, textDecoration: "underline" },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  page: { color: colorVars.fgPrimary, fontWeight: typo.fontWeightMedium },
  separator: { alignItems: "center", color: colorVars.fgTertiary, display: "inline-flex" },
  ellipsis: {
    alignItems: "center",
    color: colorVars.fgTertiary,
    display: "inline-flex",
    height: sizeVars.iconMd,
    justifyContent: "center",
    width: sizeVars.iconMd,
  },
});

export function Breadcrumb({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"nav">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <nav
      aria-label="Breadcrumb"
      {...props}
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
    />
  );
}

export function BreadcrumbList({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"ol">> & { xstyle?: stylex.StyleXStyles }) {
  return <ol {...props} {...mergeStyles(stylex.props(styles.list, xstyle), className, style)} />;
}

export function BreadcrumbItem({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"li">> & { xstyle?: stylex.StyleXStyles }) {
  return <li {...props} {...mergeStyles(stylex.props(styles.item, xstyle), className, style)} />;
}

export function BreadcrumbLink({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<"a">> & { xstyle?: ControlPlacementStyles }) {
  return (
    <a {...props} {...mergeStyles(stylex.props(styles.link, xstyle), className, style)}>
      {children}
    </a>
  );
}

export function BreadcrumbPage({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"span">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <span
      aria-current="page"
      {...props}
      {...mergeStyles(stylex.props(styles.page, xstyle), className, style)}
    />
  );
}

export function BreadcrumbSeparator({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<"li">> & { children?: ReactNode } & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <li
      aria-hidden="true"
      role="presentation"
      {...props}
      {...mergeStyles(stylex.props(styles.separator, xstyle), className, style)}
    >
      {children ?? <CaretRightIcon />}
    </li>
  );
}

export function BreadcrumbEllipsis({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"span">> & { xstyle?: ControlPlacementStyles }) {
  return (
    <span
      aria-hidden="true"
      {...props}
      {...mergeStyles(stylex.props(styles.ellipsis, xstyle), className, style)}
    >
      …
    </span>
  );
}
