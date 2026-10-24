"use client";

import {
  colorVars,
  motionVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlLayoutStyles, ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: { display: "flex", justifyContent: "center", width: "100%" },
  content: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacingVars.space1,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  item: { display: "inline-flex" },
  link: {
    alignItems: "center",
    backgroundColor: {
      default: "transparent",
      ":hover": colorVars.interactionHover,
      ":active": colorVars.interactionPressed,
    },
    borderColor: "transparent",
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    display: "inline-flex",
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    gap: spacingVars.space1,
    justifyContent: "center",
    minHeight: sizeVars.controlMd,
    outline: "none",
    textDecoration: "none",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, border-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    "[aria-disabled='true']": {
      color: colorVars.fgDisabled,
      cursor: "not-allowed",
      pointerEvents: "none",
    },
  },

  active: { backgroundColor: colorVars.bgSurfacePressed, borderColor: colorVars.strokeDefault },
  ellipsis: {
    alignItems: "center",
    color: colorVars.fgTertiary,
    display: "inline-flex",
    height: sizeVars.controlMd,
    justifyContent: "center",
    width: sizeVars.controlMd,
  },
});

const sizeStyles = stylex.create({
  default: { paddingInline: spacingVars.space3 },
  icon: { width: sizeVars.controlMd },
});

export function Pagination({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"nav">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <nav
      aria-label="Pagination"
      {...props}
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
    />
  );
}

export function PaginationContent({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"ul">> & { xstyle?: stylex.StyleXStyles }) {
  return <ul {...props} {...mergeStyles(stylex.props(styles.content, xstyle), className, style)} />;
}

export function PaginationItem({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"li">> & { xstyle?: stylex.StyleXStyles }) {
  return <li {...props} {...mergeStyles(stylex.props(styles.item, xstyle), className, style)} />;
}

export type PaginationLinkProps = StyledProps<ComponentProps<"a">> & {
  isActive?: boolean;
  size?: "default" | "icon";
  xstyle?: ControlLayoutStyles;
};

export function PaginationLink({
  className,
  style,
  xstyle,
  children,
  isActive = false,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      {...props}
      {...mergeStyles(
        stylex.props(styles.link, sizeStyles[size], isActive && styles.active, xstyle),
        className,
        style,
      )}
    >
      {children}
    </a>
  );
}

export function PaginationPrevious({ children, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Previous page" size="default" {...props}>
      <CaretLeftIcon aria-hidden="true" />
      {children ?? "Previous"}
    </PaginationLink>
  );
}

export function PaginationNext({ children, ...props }: PaginationLinkProps) {
  return (
    <PaginationLink aria-label="Next page" size="default" {...props}>
      {children ?? "Next"}
      <CaretRightIcon aria-hidden="true" />
    </PaginationLink>
  );
}

export function PaginationEllipsis({
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
