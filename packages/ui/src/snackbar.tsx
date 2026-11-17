"use client";

import {
  colorVars,
  layerVars,
  radiusVars,
  spacingVars,
  sizeVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import {
  BellIcon,
  CheckCircleIcon,
  InfoIcon,
  WarningIcon,
  XCircleIcon,
} from "@phosphor-icons/react/ssr";
import * as stylex from "@stylexjs/stylex";
import {
  useSyncExternalStore,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";

import type { ControlPlacementStyles } from "./styles/control-layout";
import { mergeStyles, type StyledProps } from "./styles/merge-styles";

const toneIcons = {
  neutral: BellIcon,
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: XCircleIcon,
  info: InfoIcon,
};
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export type SnackbarPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type SnackbarProps = StyledProps<ComponentProps<"span">> & {
  tone?: keyof typeof tones;
  /** Defaults to bottom-center; null renders inline. Small screens center horizontally. */
  position?: SnackbarPosition | null;
  /** Edge gap, in px for numbers. Defaults to 16px mobile / 24px desktop, plus safe area. */
  offset?: string | number;
  /** Keep mounted while open changes so exit motion can finish. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Milliseconds before dismissal; 0 disables the timer. */
  duration?: number;
  xstyle?: ControlPlacementStyles;
};

/** A non-interactive status label with a decorative color echo on visibility changes. */
export function Snackbar({
  tone = "neutral",
  position = "bottom-center",
  offset,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  duration = 3000,
  children,
  className,
  style,
  xstyle,
  ...props
}: SnackbarProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const controlled = controlledOpen !== undefined;
  const visible = controlled ? controlledOpen : uncontrolledOpen;
  const onOpenChangeRef = useRef(onOpenChange);
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  }, [onOpenChange]);
  useEffect(() => {
    if (!visible || !Number.isFinite(duration) || duration <= 0) return;
    const timer = window.setTimeout(() => {
      if (!controlled) setUncontrolledOpen(false);
      onOpenChangeRef.current?.(false);
    }, duration);
    return () => window.clearTimeout(timer);
  }, [visible, duration, controlled]);
  const mounted = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  const ToneIcon = toneIcons[tone];
  const pill = (
    <span
      {...props}
      {...mergeStyles(stylex.props(styles.root, tones[tone], xstyle), className, style)}
      data-bolerish-status-pill=""
      data-visible={visible ? "true" : "false"}
      aria-hidden={visible ? props["aria-hidden"] : true}
    >
      <ToneIcon aria-hidden="true" {...stylex.props(styles.icon)} />
      {children}
    </span>
  );
  if (!position) return pill;
  if (!mounted) return null;
  return createPortal(
    <div
      {...stylex.props(floatingStyles.layer)}
      data-bolerish-status-position={position}
      style={
        offset === undefined
          ? undefined
          : ({
              "--bolerish-status-offset": typeof offset === "number" ? `${offset}px` : offset,
            } as CSSProperties)
      }
    >
      {pill}
    </div>,
    document.body,
  );
}

const styles = stylex.create({
  root: {
    alignItems: "center",
    borderRadius: radiusVars.full,
    borderStyle: "solid",
    borderWidth: 1,
    display: "inline-flex",
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    gap: spacingVars.space2,
    isolation: "isolate",
    lineHeight: typo.lineHeightTight,
    paddingBlock: spacingVars.space1,
    paddingInline: spacingVars.space3,
    position: "relative",
    whiteSpace: "nowrap",
  },
  icon: {
    flexShrink: 0,
    height: sizeVars.iconSm,
    width: sizeVars.iconSm,
  },
});

const tones = stylex.create({
  success: {
    backgroundColor: colorVars.bgFeedbackSuccess,
    color: colorVars.fgFeedbackSuccess,
    borderColor: colorVars.strokeFeedbackSuccess,
  },
  warning: {
    backgroundColor: colorVars.bgFeedbackWarning,
    color: colorVars.fgFeedbackWarning,
    borderColor: colorVars.strokeFeedbackWarning,
  },
  error: {
    backgroundColor: colorVars.bgFeedbackError,
    color: colorVars.fgFeedbackError,
    borderColor: colorVars.strokeFeedbackError,
  },
  info: {
    backgroundColor: colorVars.bgFeedbackInfo,
    color: colorVars.fgFeedbackInfo,
    borderColor: colorVars.strokeFeedbackInfo,
  },
  neutral: {
    backgroundColor: colorVars.bgSubtle,
    color: colorVars.fgSecondary,
    borderColor: colorVars.strokeDefault,
  },
});

const floatingStyles = stylex.create({
  layer: { zIndex: layerVars.notification },
});
