"use client";

import {
  colorVars,
  motionVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { DayButton, DayPicker, type DayButtonProps, type DayPickerProps } from "@daypicker/react";
import * as stylex from "@stylexjs/stylex";

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  root: {
    color: colorVars.fgPrimary,
    display: "inline-flex",
    fontSize: typo.fontSizeSm,
    maxWidth: "100%",
    minWidth: 0,
    padding: spacingVars.space3,
    width: "fit-content",
  },
  months: { display: "flex", flexDirection: "column", gap: spacingVars.space8, minWidth: 0 },
  month: { position: "relative", width: "17.5rem", maxWidth: "100%" },
  monthCaption: {
    alignItems: "center",
    display: "flex",
    height: sizeVars.controlSm,
    justifyContent: "center",
    paddingInline: sizeVars.controlSm,
  },
  captionLabel: { fontWeight: typo.fontWeightMedium },
  nav: {
    alignItems: "center",
    display: "flex",
    height: sizeVars.controlSm,
    insetInline: 0,
    justifyContent: "space-between",
    position: "absolute",
    insetBlockStart: 0,
  },
  navButton: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: colorVars.interactionDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "none",
    borderWidth: 0,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "inline-flex",
    height: sizeVars.controlSm,
    justifyContent: "center",
    outline: "none",
    padding: 0,
    position: "absolute",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    width: sizeVars.controlSm,
    ":hover": { backgroundColor: colorVars.interactionHover },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.focusRing,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  previous: { insetInlineStart: 0, insetBlockStart: 0 },
  next: { insetInlineEnd: 0, insetBlockStart: 0 },
  monthGrid: { borderCollapse: "collapse", tableLayout: "fixed", width: "100%" },
  weekdays: { color: colorVars.fgSecondary },
  weekday: {
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    height: sizeVars.controlSm,
    textAlign: "center",
  },
  week: { height: sizeVars.controlMd },
  day: { height: sizeVars.controlMd, padding: 0, textAlign: "center" },
  dayButton: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: colorVars.interactionDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "none",
    borderWidth: 0,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "flex",
    font: "inherit",
    height: sizeVars.controlMd,
    justifyContent: "center",
    outline: "none",
    padding: 0,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    width: "100%",
    ":hover": { backgroundColor: colorVars.interactionHover },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.focusRing,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  selected: {
    backgroundColor: colorVars.bgActionPrimary,
    borderRadius: radiusVars.sm,
    color: colorVars.fgOnActionPrimary,
    fontWeight: typo.fontWeightMedium,
    ":hover": { backgroundColor: colorVars.bgActionPrimary },
  },
  today: {
    backgroundColor: colorVars.bgCurrent,
    color: colorVars.fgAction,
    fontWeight: typo.fontWeightSemibold,
    ":hover": { backgroundColor: colorVars.interactionPressed },
  },
  outside: { color: colorVars.fgTertiary },
  disabled: { color: colorVars.fgDisabled, cursor: "not-allowed" },
  rangeMiddle: {
    backgroundColor: colorVars.interactionSelected,
    borderRadius: 0,
    color: colorVars.fgPrimary,
  },
  dayLabel: { color: "inherit" },
  chevron: {
    fill: colorVars.fgPrimary,
    height: sizeVars.iconMd,
    width: sizeVars.iconMd,
  },
});

const classNames = {
  button_next: stylex.props(styles.navButton, styles.next).className,
  button_previous: stylex.props(styles.navButton, styles.previous).className,
  caption_label: stylex.props(styles.captionLabel).className,
  day: stylex.props(styles.day).className,
  chevron: stylex.props(styles.chevron).className,
  month: stylex.props(styles.month).className,
  month_caption: stylex.props(styles.monthCaption).className,
  month_grid: stylex.props(styles.monthGrid).className,
  months: stylex.props(styles.months).className,
  nav: stylex.props(styles.nav).className,
  week: stylex.props(styles.week).className,
  weekday: stylex.props(styles.weekday).className,
  weekdays: stylex.props(styles.weekdays).className,
};

function CalendarDayButton({ children, modifiers, ...props }: DayButtonProps) {
  const isSelected =
    modifiers.range_start || modifiers.range_end || (modifiers.selected && !modifiers.range_middle);

  const visibleLabel =
    typeof children === "string" || typeof children === "number" ? children : null;
  // Include the displayed numeral as a complete token alongside the full date.
  const accessibleLabel =
    props["aria-label"] && visibleLabel !== null
      ? `${visibleLabel}, ${props["aria-label"]}`
      : props["aria-label"];

  return (
    <DayButton
      {...props}
      aria-label={accessibleLabel}
      modifiers={modifiers}
      {...stylex.props(
        styles.dayButton,
        modifiers.outside && styles.outside,
        modifiers.range_middle && styles.rangeMiddle,
        isSelected && styles.selected,
        modifiers.today && !modifiers.selected && styles.today,
        modifiers.disabled && styles.disabled,
      )}
    >
      <span {...stylex.props(styles.dayLabel)}>{children}</span>
    </DayButton>
  );
}

type WithoutCalendarStyling<Props> = Props extends unknown
  ? StyledProps<
      Omit<
        Props,
        "classNames" | "components" | "modifiersClassNames" | "modifiersStyles" | "styles"
      >
    >
  : never;

type CalendarDayPickerProps = WithoutCalendarStyling<DayPickerProps>;

export type CalendarProps = CalendarDayPickerProps & {
  xstyle?: stylex.StyleXStyles;
};

export function Calendar({
  className,
  style,
  navLayout = "around",
  xstyle,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      {...props}
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
      classNames={classNames}
      components={{ DayButton: CalendarDayButton }}
      navLayout={navLayout}
    />
  );
}
