import {
  colorVars,
  motionVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

export type TableProps = StyledProps<ComponentProps<"table">> & {
  xstyle?: stylex.StyleXStyles;
};

export function Table({ className, style, xstyle, ...props }: TableProps) {
  return (
    <table {...props} {...mergeStyles(stylex.props(styles.table, xstyle), className, style)} />
  );
}

export function TableHeader({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"thead">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <thead {...props} {...mergeStyles(stylex.props(styles.header, xstyle), className, style)} />
  );
}

export function TableBody({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"tbody">> & { xstyle?: stylex.StyleXStyles }) {
  return <tbody {...props} {...mergeStyles(stylex.props(styles.body, xstyle), className, style)} />;
}

export function TableFooter({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"tfoot">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <tfoot {...props} {...mergeStyles(stylex.props(styles.footer, xstyle), className, style)} />
  );
}

export function TableRow({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"tr">> & { xstyle?: stylex.StyleXStyles }) {
  return <tr {...props} {...mergeStyles(stylex.props(styles.row, xstyle), className, style)} />;
}

export function TableHead({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"th">> & { xstyle?: stylex.StyleXStyles }) {
  return <th {...props} {...mergeStyles(stylex.props(styles.head, xstyle), className, style)} />;
}

export function TableCell({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"td">> & { xstyle?: stylex.StyleXStyles }) {
  return <td {...props} {...mergeStyles(stylex.props(styles.cell, xstyle), className, style)} />;
}

export function TableCaption({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"caption">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <caption {...props} {...mergeStyles(stylex.props(styles.caption, xstyle), className, style)} />
  );
}

export function TableContainer({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return (
    <div {...props} {...mergeStyles(stylex.props(styles.container, xstyle), className, style)} />
  );
}

const styles = stylex.create({
  container: { overflowX: "auto", position: "relative", width: "100%" },
  table: {
    borderCollapse: "collapse",
    captionSide: "bottom",
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeSm,
    width: "100%",
  },
  header: {
    borderBottomColor: colorVars.strokeDefault,
    borderBottomStyle: "solid",
    borderBottomWidth: sizeVars.stroke,
  },
  body: {},
  footer: {
    backgroundColor: colorVars.bgSubtle,
    borderTopColor: colorVars.strokeDefault,
    borderTopStyle: "solid",
    borderTopWidth: sizeVars.stroke,
    fontWeight: typo.fontWeightMedium,
  },
  row: {
    borderBottomColor: colorVars.strokeDefault,
    borderBottomStyle: "solid",
    borderBottomWidth: sizeVars.stroke,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color",
    transitionTimingFunction: motionVars.easingStandard,
    backgroundColor: {
      default: "transparent",
      ":hover": colorVars.interactionHover,
    },
  },
  head: {
    color: colorVars.fgSecondary,
    fontWeight: typo.fontWeightMedium,
    height: sizeVars.controlLg,
    paddingInline: spacingVars.space3,
    textAlign: "left",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  cell: {
    paddingBlock: spacingVars.space3,
    paddingInline: spacingVars.space3,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  },
  caption: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeSm,
    marginTop: spacingVars.space4,
    textAlign: "left",
    paddingInline: spacingVars.space1,
    paddingBlock: spacingVars.space3,
  },
});
