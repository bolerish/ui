"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
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
import { XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";

const styles = stylex.create({
  backdrop: {
    backgroundColor: colorVars.bgOverlay,
    inset: 0,
    position: "fixed",
    transitionDuration: motionVars.durationSlow,
    transitionProperty: "opacity",
    transitionTimingFunction: motionVars.easingEnter,
    zIndex: layerVars.modalBackdrop,
    ":is([data-starting-style])": { opacity: 0 },
    ":is([data-ending-style])": {
      opacity: 0,
      transitionDuration: motionVars.durationNormal,
      transitionTimingFunction: motionVars.easingExit,
    },
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transitionDuration: motionVars.durationInstant,
        ":is([data-ending-style])": { transitionDuration: motionVars.durationInstant },
      },
    },
  },
  viewport: {
    alignItems: "center",
    display: "flex",
    inset: 0,
    justifyContent: "center",
    padding: spacingVars.space4,
    position: "fixed",
    zIndex: layerVars.modal,
  },
  popup: {
    backgroundColor: colorVars.bgRaised,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.md,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    boxShadow: shadowVars.overlay,
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space4,
    maxHeight: "calc(100dvh - 2rem)",
    maxWidth: sizeVars.contentMd,
    outline: "none",
    overflow: "auto",
    padding: spacingVars.space6,
    position: "relative",
    transitionDuration: motionVars.durationSlow,
    transitionProperty: "opacity, transform",
    transitionTimingFunction: motionVars.easingEnter,
    width: "100%",
    ":is([data-starting-style], [data-ending-style])": {
      opacity: 0,
      transform: "scale(0.95)",
    },
    ":is([data-ending-style])": {
      transitionDuration: motionVars.durationNormal,
      transitionTimingFunction: motionVars.easingExit,
    },
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transitionDuration: motionVars.durationInstant,
        ":is([data-ending-style])": { transitionDuration: motionVars.durationInstant },
        ":is([data-starting-style], [data-ending-style])": { transform: "scale(0.99)" },
      },
    },
  },
  close: {
    alignItems: "center",
    appearance: "none",
    backgroundColor: "transparent",
    borderStyle: "none",
    borderWidth: 0,
    borderRadius: radiusVars.sm,
    color: colorVars.fgSecondary,
    cursor: "pointer",
    display: "inline-flex",
    height: sizeVars.touchTarget,
    justifyContent: "center",
    outline: "none",
    position: "absolute",
    right: spacingVars.space3,
    top: spacingVars.space3,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    width: sizeVars.touchTarget,
    ":hover": { backgroundColor: colorVars.interactionHover, color: colorVars.fgPrimary },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space2,
    paddingInlineEnd: spacingVars.space8,
  },
  footer: {
    alignItems: "center",
    display: "flex",
    flexWrap: "wrap",
    gap: spacingVars.space2,
    justifyContent: "flex-end",
  },
  title: {
    color: colorVars.fgPrimary,
    fontSize: typo.fontSizeLg,
    fontWeight: typo.fontWeightSemibold,
    lineHeight: typo.lineHeightTight,
    margin: 0,
  },
  description: {
    color: colorVars.fgSecondary,
    fontSize: typo.fontSizeSm,
    lineHeight: typo.lineHeightNormal,
    margin: 0,
  },
});

export const Dialog = DialogPrimitive.Root;
export function DialogTrigger({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof DialogPrimitive.Trigger>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <DialogPrimitive.Trigger {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />
  );
}
export function DialogClose({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof DialogPrimitive.Close>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <DialogPrimitive.Close {...props} {...mergeStyles(stylex.props(xstyle), className, style)} />
  );
}

type DialogContentProps = StyledProps<ComponentProps<typeof DialogPrimitive.Popup>> & {
  children: ReactNode;
  /** Accessible name for the optional close button. @default "Close" */
  closeLabel?: string;
  showCloseButton?: boolean;
  xstyle?: stylex.StyleXStyles;
};

export function DialogContent({
  className,
  style,
  children,
  closeLabel = "Close",
  showCloseButton = true,
  xstyle,
  ...props
}: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop {...stylex.props(styles.backdrop)} />
      <DialogPrimitive.Viewport {...stylex.props(styles.viewport)}>
        <DialogPrimitive.Popup
          {...props}
          {...mergeStyles(
            stylex.props(styles.popup, surfaceStyles.raised, surfaceStyles.edge, xstyle),
            className,
            style,
          )}
        >
          {children}
          {showCloseButton ? (
            <DialogPrimitive.Close aria-label={closeLabel} {...stylex.props(styles.close)}>
              <XIcon aria-hidden="true" />
            </DialogPrimitive.Close>
          ) : null}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return <div {...props} {...mergeStyles(stylex.props(styles.header, xstyle), className, style)} />;
}

export function DialogFooter({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return <div {...props} {...mergeStyles(stylex.props(styles.footer, xstyle), className, style)} />;
}

export function DialogTitle({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof DialogPrimitive.Title>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <DialogPrimitive.Title
      {...props}
      {...mergeStyles(stylex.props(styles.title, xstyle), className, style)}
    />
  );
}

export function DialogDescription({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof DialogPrimitive.Description>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <DialogPrimitive.Description
      {...props}
      {...mergeStyles(stylex.props(styles.description, xstyle), className, style)}
    />
  );
}
