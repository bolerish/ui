"use client";

import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
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
import { CaretDownIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps } from "react";

import type { ControlLayoutStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  root: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    maxWidth: "max-content",
    position: "relative",
    zIndex: 10,
  },
  list: {
    alignItems: "center",
    display: "flex",
    flex: 1,
    gap: 0,
    justifyContent: "center",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  item: { position: "relative" },
  trigger: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: "transparent",
    borderStyle: "none",
    borderWidth: 0,
    borderRadius: radiusVars.sm,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "inline-flex",
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    gap: spacingVars.space1,
    height: sizeVars.controlMd,
    outline: "none",
    paddingInline: spacingVars.space3,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    ":hover": { backgroundColor: colorVars.interactionHover },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    ":disabled": {
      backgroundColor: "transparent",
      color: colorVars.fgDisabled,
      cursor: "not-allowed",
      ":hover": { backgroundColor: "transparent" },
    },
  },
  triggerOpen: { backgroundColor: colorVars.interactionHover },
  icon: {
    alignItems: "center",
    display: "inline-flex",
    position: "relative",
    top: sizeVars.stroke,
    transform: "rotate(0deg)",
    ":is([data-popup-open] *)": { transform: "rotate(180deg)" },
  },
  content: {
    height: "100%",
    padding: spacingVars.space1,
    transitionDuration: motionVars.durationNormal,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: motionVars.easingStandard,
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transitionDuration: motionVars.durationInstant,
      },
    },
    width: "auto",
  },

  link: {
    alignItems: "center",
    borderRadius: radiusVars.sm,
    color: colorVars.fgPrimary,
    display: "flex",
    gap: spacingVars.space2,
    outline: "none",
    padding: spacingVars.space2,
    textDecoration: "none",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    ":hover": { backgroundColor: colorVars.interactionHover },
    ":focus-visible": {
      backgroundColor: colorVars.interactionHover,
      outlineColor: colorVars.strokeFocus,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  positioner: {
    height: "var(--positioner-height)",
    maxWidth: "var(--available-width)",
    transitionDuration: motionVars.durationNormal,
    transitionProperty: "inset, width, height",
    transitionTimingFunction: motionVars.easingStandard,
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transitionDuration: motionVars.durationInstant,
      },
    },
    width: "var(--positioner-width)",
    zIndex: layerVars.popup,
  },
  popup: {
    backgroundColor: colorVars.bgRaised,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    boxShadow: shadowVars.floating,
    color: colorVars.fgPrimary,
    height: "var(--popup-height)",
    outline: "none",
    overflow: "hidden",
    position: "relative",
    transformOrigin: "var(--transform-origin)",
    transitionDuration: motionVars.durationNormal,
    transitionProperty: "opacity, transform, width, height",
    transitionTimingFunction: motionVars.easingEnter,
    width: "var(--popup-width)",
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transitionDuration: motionVars.durationInstant,
      },
    },
  },
  popupTransitioning: { opacity: 0, transform: "scale(0.9)" },
  viewport: {
    fontFamily: typo.fontFamilyBody,
    height: "100%",
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },
});
const enterStyles = stylex.create({
  left: { opacity: 0, transform: "translateX(-50%)" },
  right: { opacity: 0, transform: "translateX(50%)" },
});
const exitStyles = stylex.create({
  left: { opacity: 0, transform: "translateX(50%)" },
  right: { opacity: 0, transform: "translateX(-50%)" },
});

export function NavigationMenu({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof NavigationMenuPrimitive.Root>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <NavigationMenuPrimitive.Root
      {...props}
      {...mergeStyles(stylex.props(styles.root, xstyle), className, style)}
    />
  );
}

export function NavigationMenuList({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof NavigationMenuPrimitive.List>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <NavigationMenuPrimitive.List
      {...props}
      {...mergeStyles(stylex.props(styles.list, xstyle), className, style)}
    />
  );
}

export function NavigationMenuItem({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof NavigationMenuPrimitive.Item>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <NavigationMenuPrimitive.Item
      {...props}
      {...mergeStyles(stylex.props(styles.item, xstyle), className, style)}
    />
  );
}

export function NavigationMenuContent({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof NavigationMenuPrimitive.Content>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  function getContentStyles(state: NavigationMenuPrimitive.Content.State) {
    const { transitionStatus, activationDirection } = state;
    const hasDirection = activationDirection === "left" || activationDirection === "right";
    return mergeStyles(
      stylex.props(
        styles.content,
        hasDirection && transitionStatus === "starting" && enterStyles[activationDirection],
        hasDirection && transitionStatus === "ending" && exitStyles[activationDirection],
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <NavigationMenuPrimitive.Content
      {...props}
      className={(state) => getContentStyles(state).className}
      style={(state) => getContentStyles(state).style}
    />
  );
}

export function NavigationMenuTrigger({
  className,
  style,
  xstyle,
  children,
  ...props
}: StyledProps<ComponentProps<typeof NavigationMenuPrimitive.Trigger>> & {
  xstyle?: ControlLayoutStyles;
}) {
  function getTriggerStyles(state: NavigationMenuPrimitive.Trigger.State) {
    return mergeStyles(
      stylex.props(styles.trigger, state.open && styles.triggerOpen, xstyle),
      className,
      style,
    );
  }
  return (
    <NavigationMenuPrimitive.Trigger
      {...props}
      className={(state) => getTriggerStyles(state).className}
      style={(state) => getTriggerStyles(state).style}
    >
      {children}
      <NavigationMenuPrimitive.Icon {...stylex.props(styles.icon)}>
        <CaretDownIcon aria-hidden="true" />
      </NavigationMenuPrimitive.Icon>
    </NavigationMenuPrimitive.Trigger>
  );
}

export function NavigationMenuLink({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof NavigationMenuPrimitive.Link>> & {
  xstyle?: ControlLayoutStyles;
}) {
  return (
    <NavigationMenuPrimitive.Link
      {...props}
      {...mergeStyles(stylex.props(styles.link, xstyle), className, style)}
    />
  );
}

type NavigationMenuViewportProps = StyledProps<
  ComponentProps<typeof NavigationMenuPrimitive.Popup>
> &
  Pick<
    ComponentProps<typeof NavigationMenuPrimitive.Positioner>,
    "align" | "side" | "sideOffset"
  > & { xstyle?: stylex.StyleXStyles };

export function NavigationMenuViewport({
  className,
  style,
  xstyle,
  align = "start",
  side = "bottom",
  sideOffset = 8,
  ...props
}: NavigationMenuViewportProps) {
  function getPopupStyles(state: NavigationMenuPrimitive.Popup.State) {
    return mergeStyles(
      stylex.props(
        styles.popup,
        surfaceStyles.edge,
        surfaceStyles.floating,
        (state.transitionStatus === "starting" || state.transitionStatus === "ending") &&
          styles.popupTransitioning,
        xstyle,
      ),
      className,
      style,
    );
  }
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        align={align}
        side={side}
        sideOffset={sideOffset}
        {...stylex.props(styles.positioner)}
      >
        <NavigationMenuPrimitive.Popup
          {...props}
          className={(state) => getPopupStyles(state).className}
          style={(state) => getPopupStyles(state).style}
        >
          <NavigationMenuPrimitive.Viewport {...stylex.props(styles.viewport)} />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}
