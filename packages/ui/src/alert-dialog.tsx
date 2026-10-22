"use client";

import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
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
import * as stylex from "@stylexjs/stylex";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "./button";
import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";

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
    maxWidth: "28rem",
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
  header: { display: "flex", flexDirection: "column", gap: spacingVars.space2 },
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

export const AlertDialog = AlertDialogPrimitive.Root;
export function AlertDialogTrigger({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof AlertDialogPrimitive.Trigger>> & {
  xstyle?: stylex.StyleXStyles;
}) {
  return (
    <AlertDialogPrimitive.Trigger
      {...props}
      {...mergeStyles(stylex.props(xstyle), className, style)}
    />
  );
}

type AlertDialogContentProps = StyledProps<ComponentProps<typeof AlertDialogPrimitive.Popup>> & {
  children: ReactNode;
  xstyle?: stylex.StyleXStyles;
};

export function AlertDialogContent({
  className,
  style,
  children,
  xstyle,
  ...props
}: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Backdrop {...stylex.props(styles.backdrop)} />
      <AlertDialogPrimitive.Viewport {...stylex.props(styles.viewport)}>
        <AlertDialogPrimitive.Popup
          {...props}
          {...mergeStyles(stylex.props(styles.popup, xstyle), className, style)}
        >
          {children}
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPrimitive.Portal>
  );
}

export function AlertDialogHeader({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return <div {...props} {...mergeStyles(stylex.props(styles.header, xstyle), className, style)} />;
}

export function AlertDialogFooter({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<"div">> & { xstyle?: stylex.StyleXStyles }) {
  return <div {...props} {...mergeStyles(stylex.props(styles.footer, xstyle), className, style)} />;
}

export function AlertDialogTitle({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof AlertDialogPrimitive.Title>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <AlertDialogPrimitive.Title
      {...props}
      {...mergeStyles(stylex.props(styles.title, xstyle), className, style)}
    />
  );
}

export function AlertDialogDescription({
  className,
  style,
  xstyle,
  ...props
}: StyledProps<ComponentProps<typeof AlertDialogPrimitive.Description>> & {
  xstyle?: ControlPlacementStyles;
}) {
  return (
    <AlertDialogPrimitive.Description
      {...props}
      {...mergeStyles(stylex.props(styles.description, xstyle), className, style)}
    />
  );
}

type AlertDialogButtonProps = StyledProps<ComponentProps<typeof AlertDialogPrimitive.Close>>;

export function AlertDialogCancel({ children, ...props }: AlertDialogButtonProps) {
  return (
    <AlertDialogPrimitive.Close
      {...props}
      render={<Button variant="secondary">{children}</Button>}
    />
  );
}

export function AlertDialogAction({ children, ...props }: AlertDialogButtonProps) {
  return (
    <AlertDialogPrimitive.Close
      {...props}
      render={<Button variant="destructive">{children}</Button>}
    />
  );
}
