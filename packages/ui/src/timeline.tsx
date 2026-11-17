import {
  colorVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

export type TimelineIndicatorVariant = "active" | "complete" | "default" | "error";

export type TimelineProps = StyledProps<ComponentProps<"ol">> & {
  xstyle?: stylex.StyleXStyles;
};

export function Timeline({ className, style, xstyle, ...props }: TimelineProps) {
  return <ol {...props} {...mergeStyles(stylex.props(styles.root, xstyle), className, style)} />;
}

export type TimelineItemProps = StyledProps<ComponentProps<"li">> & {
  xstyle?: stylex.StyleXStyles;
};

export function TimelineItem({ className, style, xstyle, ...props }: TimelineItemProps) {
  return <li {...props} {...mergeStyles(stylex.props(styles.item, xstyle), className, style)} />;
}

export type TimelineIndicatorProps = StyledProps<ComponentProps<"span">> & {
  variant?: TimelineIndicatorVariant;
  xstyle?: stylex.StyleXStyles;
};

export function TimelineIndicator({
  className,
  style,
  xstyle,
  variant = "default",
  ...props
}: TimelineIndicatorProps) {
  return (
    <span
      aria-hidden={props["aria-label"] === undefined ? true : undefined}
      {...props}
      {...mergeStyles(
        stylex.props(styles.indicator, indicatorVariantStyles[variant], xstyle),
        className,
        style,
      )}
    />
  );
}

export function TimelineContent({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.content, xstyle), className, style)} />
  );
}

export function TimelineTitle({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: ControlPlacementStyles }) {
  return <div {...props} {...mergeStyles(stylex.props(styles.title, xstyle), className, style)} />;
}

export function TimelineDescription({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"p">> & { xstyle?: ControlPlacementStyles }) {
  return (
    <p {...props} {...mergeStyles(stylex.props(styles.description, xstyle), className, style)} />
  );
}

export function TimelineTime({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"time">> & { xstyle?: ControlPlacementStyles }) {
  return <time {...props} {...mergeStyles(stylex.props(styles.time, xstyle), className, style)} />;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space4,
    margin: 0,
    padding: 0,
  },
  item: {
    columnGap: spacingVars.space3,
    display: "grid",
    gridTemplateColumns: `${sizeVars.controlXs} minmax(0, 1fr)`,
    listStyle: "none",
    minWidth: 0,
    position: "relative",
    "::before": {
      backgroundColor: colorVars.strokeDefault,
      bottom: `calc(${spacingVars.space4} * -1)`,
      content: '""',
      left: `calc((${sizeVars.controlXs} - ${sizeVars.stroke}) / 2)`,
      position: "absolute",
      top: 0,
      width: sizeVars.stroke,
      zIndex: 0,
    },
    ":last-child": {
      "::before": { display: "none" },
    },
  },
  indicator: {
    alignItems: "center",
    backgroundColor: colorVars.bgSurface,
    borderRadius: radiusVars.full,
    color: colorVars.fgSecondary,
    display: "inline-flex",
    fontSize: sizeVars.iconSm,
    gridColumn: 1,
    height: sizeVars.controlXs,
    justifyContent: "center",
    position: "relative",
    width: sizeVars.controlXs,
    zIndex: 1,
    boxShadow: "none",
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space1,
    gridColumn: 2,
    minWidth: 0,
    paddingBlock: spacingVars.space1,
  },
  title: {
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    lineHeight: typo.lineHeightTight,
  },
  description: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
  time: {
    color: colorVars.fgTertiary,
    fontSize: typo.fontSizeXs,
    lineHeight: typo.lineHeightNormal,
  },
});

const indicatorVariantStyles = stylex.create({
  default: {},
  active: {
    backgroundColor: colorVars.bgActionPrimary,
    borderColor: colorVars.strokeAction,
    color: colorVars.fgOnActionPrimary,
  },
  complete: {
    backgroundColor: colorVars.bgCurrent,
    color: colorVars.fgPrimary,
  },
  error: {
    backgroundColor: colorVars.bgFeedbackError,
    color: colorVars.fgFeedbackError,
  },
});
