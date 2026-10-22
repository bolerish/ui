"use client";

import {
  colorVars,
  motionVars,
  radiusVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import * as stylex from "@stylexjs/stylex";
import { useState } from "react";

import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const styles = stylex.create({
  root: { display: "inline-flex", minWidth: "13rem" },
  trigger: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: colorVars.bgSurface,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "inline-flex",
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightRegular,
    height: sizeVars.controlMd,
    outline: "none",
    paddingInline: spacingVars.space3,
    textAlign: "left",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, border-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    width: "100%",
    ":hover": { borderColor: colorVars.strokeDefault },
    ":focus-visible": {
      borderColor: colorVars.strokeFocus,
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    ":disabled": {
      backgroundColor: colorVars.bgSubtle,
      borderColor: colorVars.strokeDefault,
      color: colorVars.fgDisabled,
      cursor: "not-allowed",
    },
  },
  placeholder: { color: colorVars.fgSecondary },
  calendar: { padding: 0, width: "fit-content" },
  value: { fontWeight: typo.fontWeightRegular },
});

export type DatePickerProps = {
  defaultValue?: Date;
  disabled?: boolean;
  format?: (date: Date) => string;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  value?: Date;
  xstyle?: stylex.StyleXStyles;
};

function defaultFormat(date: Date) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

export function DatePicker(props: DatePickerProps) {
  const {
    defaultValue,
    disabled,
    format = defaultFormat,
    onValueChange,
    placeholder = "Pick a date",
    value,
    xstyle,
  } = props;
  const [open, setOpen] = useState(false);
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const isControlled = Object.hasOwn(props, "value");
  const selectedValue = isControlled ? value : uncontrolledValue;

  function handleSelect(date: Date | undefined) {
    if (!isControlled) setUncontrolledValue(date);
    onValueChange?.(date);
    setOpen(false);
  }

  return (
    <span {...stylex.props(styles.root, xstyle)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button disabled={disabled} type="button" {...stylex.props(styles.trigger)}>
              {selectedValue ? (
                <span {...stylex.props(styles.value)}>{format(selectedValue)}</span>
              ) : (
                <span {...stylex.props(styles.placeholder)}>{placeholder}</span>
              )}
            </button>
          }
        />
        <PopoverContent xstyle={styles.calendar}>
          <Calendar mode="single" onSelect={handleSelect} selected={selectedValue} />
        </PopoverContent>
      </Popover>
    </span>
  );
}
