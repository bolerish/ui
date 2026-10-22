"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import {
  colorVars,
  layerVars,
  motionVars,
  radiusVars,
  shadowVars,
  sizeVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { CaretRightIcon, CheckIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import type { ControlLayoutStyles, ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

const styles = stylex.create({
  positioner: { zIndex: layerVars.popup },
  popup: {
    backgroundColor: colorVars.bgRaised,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    boxShadow: shadowVars.floating,
    color: colorVars.fgPrimary,
    minWidth: "12rem",
    outline: "none",
    padding: spacingVars.space1,
    transform: "scale(1)",
    transformOrigin: "var(--transform-origin)",
    transitionDuration: motionVars.durationNormal,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: motionVars.easingEnter,
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transform: "none",
        transitionDuration: motionVars.durationInstant,
      },
    },
  },
  popupTransitioning: { opacity: 0, transform: "scale(0.98)" },
  popupEnding: {
    transitionDuration: motionVars.durationFast,
    transitionTimingFunction: motionVars.easingExit,
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transitionDuration: motionVars.durationInstant,
      },
    },
  },
  item: {
    alignItems: "center",
    borderRadius: radiusVars.sm,
    color: colorVars.fgPrimary,
    cursor: "default",
    display: "flex",
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    gap: spacingVars.space2,
    minHeight: sizeVars.controlSm,
    outline: "none",
    paddingInline: spacingVars.space2,
    position: "relative",
    userSelect: "none",
    ":disabled": { cursor: "not-allowed" },
  },
  itemHighlighted: { backgroundColor: colorVars.interactionHover },
  itemDisabled: {
    backgroundColor: "transparent",
    color: colorVars.fgDisabled,
    cursor: "not-allowed",
  },
  inset: { paddingInlineStart: spacingVars.space8 },
  destructive: { color: colorVars.fgFeedbackError },
  choiceItem: { paddingInlineStart: spacingVars.space8 },
  indicator: {
    alignItems: "center",
    display: "inline-flex",
    insetInlineStart: spacingVars.space2,
    justifyContent: "center",
    position: "absolute",
  },
  radioDot: {
    backgroundColor: "currentColor",
    borderRadius: radiusVars.full,
    height: spacingVars.space2,
    width: spacingVars.space2,
  },
  label: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    paddingBlock: spacingVars.space2,
    paddingInline: spacingVars.space2,
  },
  separator: {
    backgroundColor: colorVars.strokeStrong,
    height: sizeVars.stroke,
    marginBlock: spacingVars.space1,
  },
  shortcut: {
    color: colorVars.fgTertiary,
    fontSize: typo.fontSizeXs,
    marginInlineStart: "auto",
  },
  subIcon: { marginInlineStart: "auto" },
});

export const DropdownMenu = MenuPrimitive.Root;
export function DropdownMenuTrigger({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof MenuPrimitive.Trigger>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <MenuPrimitive.Trigger {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />
  );
}
export function DropdownMenuGroup({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof MenuPrimitive.Group>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <MenuPrimitive.Group {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />
  );
}
export function DropdownMenuRadioGroup({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof MenuPrimitive.RadioGroup>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <MenuPrimitive.RadioGroup {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />
  );
}
export const DropdownMenuSub = MenuPrimitive.SubmenuRoot;

type DropdownMenuContentProps = StyledProps<ComponentProps<typeof MenuPrimitive.Popup>> &
  Pick<
    ComponentProps<typeof MenuPrimitive.Positioner>,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & { xstyle?: stylex.StyleXStyles };

export function DropdownMenuContent({
  className,
  style,
  xstyle,
  align = "start",
  alignOffset,
  side = "bottom",
  sideOffset = 4,
  ...props
}: DropdownMenuContentProps) {
  function getPopupStyles(state: MenuPrimitive.Popup.State) {
    return mergeStyles(
      stylex.props(
        styles.popup,
        (state.transitionStatus === "starting" || state.transitionStatus === "ending") &&
          styles.popupTransitioning,
        state.transitionStatus === "ending" && styles.popupEnding,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <MenuPrimitive.Popup
          {...props}
          className={(state) => getPopupStyles(state).className}
          style={(state) => getPopupStyles(state).style}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

type DropdownMenuItemProps = StyledProps<ComponentProps<typeof MenuPrimitive.Item>> & {
  destructive?: boolean;
  inset?: boolean;
  xstyle?: ControlLayoutStyles;
};

export function DropdownMenuItem({
  className,
  style,
  xstyle,
  destructive = false,
  inset = false,
  ...props
}: DropdownMenuItemProps) {
  function getItemStyles(state: MenuPrimitive.Item.State) {
    return mergeStyles(
      stylex.props(
        styles.item,
        state.highlighted && styles.itemHighlighted,
        state.disabled && styles.itemDisabled,
        inset && styles.inset,
        destructive && styles.destructive,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <MenuPrimitive.Item
      {...props}
      className={(state) => getItemStyles(state).className}
      style={(state) => getItemStyles(state).style}
    />
  );
}

export function DropdownMenuCheckboxItem({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<typeof MenuPrimitive.CheckboxItem>> & {
  xstyle?: ControlLayoutStyles;
}) {
  function getCheckboxItemStyles(state: MenuPrimitive.CheckboxItem.State) {
    return mergeStyles(
      stylex.props(
        styles.item,
        styles.choiceItem,
        state.highlighted && styles.itemHighlighted,
        state.disabled && styles.itemDisabled,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <MenuPrimitive.CheckboxItem
      {...props}
      className={(state) => getCheckboxItemStyles(state).className}
      style={(state) => getCheckboxItemStyles(state).style}
    >
      <MenuPrimitive.CheckboxItemIndicator {...stylex.props(styles.indicator)}>
        <CheckIcon aria-hidden="true" />
      </MenuPrimitive.CheckboxItemIndicator>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

export function DropdownMenuRadioItem({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<typeof MenuPrimitive.RadioItem>> & {
  xstyle?: ControlLayoutStyles;
}) {
  function getRadioItemStyles(state: MenuPrimitive.RadioItem.State) {
    return mergeStyles(
      stylex.props(
        styles.item,
        styles.choiceItem,
        state.highlighted && styles.itemHighlighted,
        state.disabled && styles.itemDisabled,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <MenuPrimitive.RadioItem
      {...props}
      className={(state) => getRadioItemStyles(state).className}
      style={(state) => getRadioItemStyles(state).style}
    >
      <MenuPrimitive.RadioItemIndicator {...stylex.props(styles.indicator)}>
        <span {...stylex.props(styles.radioDot)} />
      </MenuPrimitive.RadioItemIndicator>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

export function DropdownMenuLabel({
  className,
  style,
  xstyle,
  inset = false,
  ...props
}: StyledProps<ComponentProps<typeof MenuPrimitive.GroupLabel>> & {
  inset?: boolean;
} & { xstyle?: ControlPlacementStyles }) {
  return (
    <MenuPrimitive.GroupLabel
      {...props}
      {...mergeStyles(stylex.props(styles.label, inset && styles.inset, xstyle), className, style)}
    />
  );
}

export function DropdownMenuSeparator({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof MenuPrimitive.Separator>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <MenuPrimitive.Separator
      {...props}
      {...mergeStyles(stylex.props(styles.separator, xstyle), className, style)}
    />
  );
}

export function DropdownMenuShortcut({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<"span">> & { children: ReactNode } & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <span {...props} {...mergeStyles(stylex.props(styles.shortcut, xstyle), className, style)}>
      {children}
    </span>
  );
}

export function DropdownMenuSubTrigger({
  className,
  style,
  xstyle,
  children,
  inset = false,
  ...props
}: StyledProps<ComponentProps<typeof MenuPrimitive.SubmenuTrigger>> & {
  inset?: boolean;
} & { xstyle?: ControlLayoutStyles }) {
  function getSubmenuTriggerStyles(state: MenuPrimitive.SubmenuTrigger.State) {
    return mergeStyles(
      stylex.props(
        styles.item,
        state.highlighted && styles.itemHighlighted,
        state.disabled && styles.itemDisabled,
        inset && styles.inset,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <MenuPrimitive.SubmenuTrigger
      {...props}
      className={(state) => getSubmenuTriggerStyles(state).className}
      style={(state) => getSubmenuTriggerStyles(state).style}
    >
      {children}
      <CaretRightIcon aria-hidden="true" {...stylex.props(styles.subIcon)} />
    </MenuPrimitive.SubmenuTrigger>
  );
}

export const DropdownMenuSubContent = DropdownMenuContent;
