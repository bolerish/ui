"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
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
import { CheckCircleIcon, InfoIcon, WarningIcon, XCircleIcon, XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps } from "react";

import { mergeStyles } from "./styles/merge-styles";
import type { StyledProps } from "./styles/merge-styles";
import { surfaceStyles } from "./styles/surface";
import { toastViewportVars } from "./toast.stylex";
import { typographyStyles } from "./typography";

const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } });

const styles = stylex.create({
  viewport: {
    maxWidth: sizeVars.contentSm,
    outline: "none",
    pointerEvents: "none",
    position: "fixed",
    width: `calc(100vw - ${spacingVars.space4} * 2)`,
    zIndex: layerVars.notification,
    [toastViewportVars.stackPointerEvents]: {
      default: "none",
      ":is([data-expanded])": "auto",
    },
    [toastViewportVars.clearActionOffset]: {
      default: "0px",
      ":is([data-expanded])": `calc(${sizeVars.controlSm} + ${spacingVars.space2})`,
    },
    [toastViewportVars.clearActionOpacity]: {
      default: "0",
      ":is([data-expanded])": "1",
    },
    [toastViewportVars.clearActionPointerEvents]: {
      default: "none",
      ":is([data-expanded])": "auto",
    },
  },

  stack: (height: number | string) => ({
    bottom: 0,
    height,
    columnGap: spacingVars.space3,
    left: 0,
    pointerEvents: toastViewportVars.stackPointerEvents,
    position: "absolute",
    right: 0,
  }),
  stackTop: { bottom: "auto", top: 0 },
  root: {
    backgroundColor: colorVars.bgRaised,
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    bottom: 0,
    boxShadow: shadowVars.overlay,
    color: colorVars.fgPrimary,
    height: "var(--toast-frontmost-height, var(--toast-height))",
    outline: "none",
    overflow: "hidden",
    pointerEvents: "auto",
    position: "absolute",
    left: "calc(min(var(--toast-index), 2) * 5%)",
    right: "calc(min(var(--toast-index), 2) * 5%)",
    transform: `translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) - (var(--toast-index) * ${spacingVars.space3})))`,
    transformOrigin: "bottom",
    transition: `transform ${motionVars.durationSlow} ${motionVars.easingEnter}, opacity ${motionVars.durationNormal} ${motionVars.easingStandard}, height ${motionVars.durationNormal} ${motionVars.easingStandard}, left ${motionVars.durationSlow} ${motionVars.easingEnter}, right ${motionVars.durationSlow} ${motionVars.easingEnter}`,
    userSelect: "none",
    width: "auto",
    zIndex: "calc(1000 - var(--toast-index))",
    "::after": {
      content: '""',
      height: `calc(${spacingVars.space3} + ${sizeVars.stroke})`,
      left: 0,
      position: "absolute",
      top: "100%",
      width: "100%",
    },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
    ":is([data-expanded])": {
      height: "var(--toast-height)",
      left: 0,
      right: 0,
      overflow: "visible",
      transform: `translateX(var(--toast-swipe-movement-x)) translateY(calc((var(--toast-offset-y) * -1) - (var(--toast-index) * ${spacingVars.space3}) + var(--toast-swipe-movement-y)))`,
    },
    ":is([data-limited])": { opacity: 0, pointerEvents: "none" },
    ":is([data-swiping])": { transitionDuration: "0ms" },
    ":is([data-starting-style])": { opacity: 0, transform: "translateY(150%)" },
    ":is([data-ending-style])": { opacity: 0, transform: "translateY(150%)" },
    ":is([data-ending-style][data-swipe-direction='up'])": {
      transform: "translateY(calc(var(--toast-swipe-movement-y) - 150%))",
    },
    ":is([data-ending-style][data-swipe-direction='down'])": {
      transform: "translateY(calc(var(--toast-swipe-movement-y) + 150%))",
    },
    ":is([data-ending-style][data-swipe-direction='left'])": {
      transform: `translateX(calc(var(--toast-swipe-movement-x) - 150%)) translateY(calc((var(--toast-offset-y) * -1) - (var(--toast-index) * ${spacingVars.space3}) + var(--toast-swipe-movement-y)))`,
    },
    ":is([data-ending-style][data-swipe-direction='right'])": {
      transform: `translateX(calc(var(--toast-swipe-movement-x) + 150%)) translateY(calc((var(--toast-offset-y) * -1) - (var(--toast-index) * ${spacingVars.space3}) + var(--toast-swipe-movement-y)))`,
    },
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transitionDuration: motionVars.durationInstant,
        ":is([data-starting-style])": { transform: "translateY(24%)" },
        ":is([data-ending-style])": { transform: "translateY(24%)" },
      },
    },
  },
  rootTop: {
    bottom: "auto",
    top: 0,
    transform: `translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-swipe-movement-y) + (var(--toast-index) * ${spacingVars.space3})))`,
    transformOrigin: "top",
    ":is([data-expanded])": {
      transform: `translateX(var(--toast-swipe-movement-x)) translateY(calc(var(--toast-offset-y) + (var(--toast-index) * ${spacingVars.space3}) + var(--toast-swipe-movement-y)))`,
    },
    ":is([data-starting-style])": { transform: "translateY(-150%)" },
    ":is([data-ending-style])": { transform: "translateY(-150%)" },
    ":is([data-ending-style][data-swipe-direction='left'])": {
      transform: `translateX(calc(var(--toast-swipe-movement-x) - 150%)) translateY(calc(var(--toast-offset-y) + (var(--toast-index) * ${spacingVars.space3}) + var(--toast-swipe-movement-y)))`,
    },
    ":is([data-ending-style][data-swipe-direction='right'])": {
      transform: `translateX(calc(var(--toast-swipe-movement-x) + 150%)) translateY(calc(var(--toast-offset-y) + (var(--toast-index) * ${spacingVars.space3}) + var(--toast-swipe-movement-y)))`,
    },
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        ":is([data-starting-style])": { transform: "translateY(-24%)" },
        ":is([data-ending-style])": { transform: "translateY(-24%)" },
      },
    },
  },
  content: {
    alignItems: "center",
    display: "flex",
    gap: spacingVars.space3,
    height: "100%",
    minHeight: toastViewportVars.contentMinHeight,
    overflow: "hidden",
    padding: spacingVars.space4,
    position: "relative",
    transitionDuration: motionVars.durationNormal,
    transitionProperty: "opacity",
    transitionTimingFunction: motionVars.easingStandard,
    ":is([data-behind]:not([data-expanded]))": { opacity: 0, pointerEvents: "none" },
  },
  message: {
    alignSelf: "baseline",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: spacingVars.space1,
    minWidth: 0,
  },
  title: {
    margin: 0,
  },
  description: {
    color: colorVars.fgSecondary,
    margin: 0,
  },
  statusIcon: {
    alignSelf: "baseline",
    alignItems: "center",
    display: "inline-flex",
    flexShrink: 0,
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    lineHeight: typo.lineHeightTight,
    justifyContent: "center",
    width: sizeVars.iconMd,
    "::before": { content: '"\\200b"' },
  },
  loadingIcon: {
    animationDuration: motionVars.durationLoading,
    animationIterationCount: "infinite",
    animationName: spin,
    animationTimingFunction: "linear",
    borderColor: colorVars.strokeDefault,
    borderRadius: radiusVars.full,
    borderStyle: "solid",
    borderWidth: sizeVars.focusRing,
    flexShrink: 0,
    height: sizeVars.iconMd,
    width: sizeVars.iconMd,
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        animationDuration: motionVars.durationLoadingReduced,
      },
    },
  },
  action: {
    alignSelf: "baseline",
    alignItems: "center",
    appearance: "none",
    backgroundColor: "transparent",
    borderRadius: radiusVars.sm,
    borderStyle: "none",
    borderWidth: 0,
    color: colorVars.fgPrimary,
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    lineHeight: typo.lineHeightTight,
    height: sizeVars.controlXs,
    justifyContent: "center",
    outline: "none",
    paddingInline: spacingVars.space3,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "color",
    transitionTimingFunction: motionVars.easingStandard,
    ":hover": { textDecoration: "underline" },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  close: {
    alignSelf: "baseline",
    alignItems: "center",
    appearance: "none",
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderRadius: radiusVars.sm,
    borderStyle: "solid",
    borderWidth: sizeVars.stroke,
    color: colorVars.fgSecondary,
    cursor: "pointer",
    display: "inline-flex",
    flexShrink: 0,
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeSm,
    fontWeight: typo.fontWeightMedium,
    lineHeight: typo.lineHeightTight,
    height: sizeVars.controlXs,
    justifyContent: "center",
    outline: "none",
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, color",
    transitionTimingFunction: motionVars.easingStandard,
    width: sizeVars.controlXs,
    // Match the title's text baseline while centering the icon in its hit area.
    "::before": { content: '"\\200b"' },
    ":hover": { backgroundColor: colorVars.interactionHover, color: colorVars.fgPrimary },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  clearAll: {
    appearance: "none",
    backgroundColor: colorVars.bgRaised,
    borderColor: colorVars.strokeDefault,
    borderStyle: "solid",
    borderRadius: radiusVars.sm,
    borderWidth: sizeVars.stroke,
    color: colorVars.fgSecondary,
    cursor: "pointer",
    fontFamily: typo.fontFamilyBody,
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    height: sizeVars.controlSm,
    outline: "none",
    paddingBlock: spacingVars.space1,
    paddingInline: spacingVars.space2,
    opacity: toastViewportVars.clearActionOpacity,
    pointerEvents: toastViewportVars.clearActionPointerEvents,
    position: "absolute",
    right: 0,
    top: 0,
    transitionDuration: motionVars.durationFast,
    transitionProperty: "background-color, color, opacity",
    transitionTimingFunction: motionVars.easingStandard,
    zIndex: 1001,
    ":hover": { backgroundColor: colorVars.bgRaised, color: colorVars.fgPrimary },
    ":focus-visible": {
      outlineColor: colorVars.strokeFocus,
      outlineOffset: sizeVars.stroke,
      outlineStyle: "solid",
      outlineWidth: sizeVars.focusRing,
    },
  },
  clearAllTop: { bottom: 0, top: "auto" },
});

const verticalPositionStyles = stylex.create({
  top: { top: spacingVars.space4 },
  bottom: { bottom: spacingVars.space4 },
});

const horizontalPositionStyles = stylex.create({
  left: { left: spacingVars.space4 },
  center: { left: "50%", transform: "translateX(-50%)" },
  right: { right: spacingVars.space4 },
});

export type ToastPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

export type ToasterProps = StyledProps<
  Omit<ComponentProps<typeof ToastPrimitive.Provider>, "children" | "toastManager">
> & {
  /** Toast viewport position. @default "bottom-right" */
  position?: ToastPosition;
  /** Content and accessible label for the action that dismisses all toasts. */
  clearAllProps?: Pick<ComponentProps<"button">, "children" | "aria-label">;
  /** Accessible name for each dismiss button. @default "Close toast" */
  closeLabel?: string;
  xstyle?: stylex.StyleXStyles;
};

export const toast = ToastPrimitive.createToastManager();

type ToastIconType = "success" | "info" | "warning" | "error";

const toastIcons = {
  success: CheckCircleIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: XCircleIcon,
} satisfies Record<ToastIconType, typeof InfoIcon>;

function hasToastIcon(type: string): type is ToastIconType {
  return Object.hasOwn(toastIcons, type);
}

function ToastStatusIcon({ type }: { type?: string }) {
  if (!type || type === "default") {
    return null;
  }

  if (type === "loading") {
    return (
      <span aria-hidden="true" {...stylex.props(styles.statusIcon)}>
        <span {...stylex.props(styles.loadingIcon)} />
      </span>
    );
  }

  if (!hasToastIcon(type)) return null;
  const IconComponent = toastIcons[type];

  return (
    <span aria-hidden="true" {...stylex.props(styles.statusIcon)}>
      <IconComponent />
    </span>
  );
}

function ToastStack({
  position,
  clearAllProps,
  closeLabel,
}: {
  position: ToastPosition;
  clearAllProps: ToasterProps["clearAllProps"];
  closeLabel: string;
}) {
  const { toasts } = ToastPrimitive.useToastManager();
  const stackRef = useRef<HTMLDivElement>(null);
  const dismissedIds = useRef(new Set<string>());
  const [height, setHeight] = useState(0);
  const isTop = position.startsWith("top");
  const hasClearAction = toasts.length > 1;
  const stackHeight = hasClearAction
    ? `calc(${height}px + ${toastViewportVars.clearActionOffset})`
    : height;

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;

    const document = stack.ownerDocument;
    const currentIds = new Set(toasts.map((item) => item.id));
    for (const id of dismissedIds.current) {
      if (!currentIds.has(id)) dismissedIds.current.delete(id);
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented || event.isComposing) return;
      // Editors own Escape; toast actions retain their keyboard dismissal.
      const target = event.target;
      if (
        target instanceof Element &&
        !stack.contains(target) &&
        target.closest(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]',
        )
      )
        return;
      const latest = toasts.find(
        (item) => item.transitionStatus !== "ending" && !dismissedIds.current.has(item.id),
      );
      if (!latest) return;

      event.preventDefault();
      event.stopPropagation();
      if (event.repeat) return;
      dismissedIds.current.add(latest.id);
      toast.close(latest.id);
    };

    // Intercept Toast's own focused-item dismissal so one key closes only the newest item.
    stack.addEventListener("keydown", handleEscape, true);
    document.addEventListener("keydown", handleEscape);
    return () => {
      stack.removeEventListener("keydown", handleEscape, true);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [toasts]);

  useLayoutEffect(() => {
    const stack = stackRef.current;

    if (!stack) {
      return;
    }

    const updateHeight = () => {
      const rootList = Array.from(
        stack.querySelectorAll<HTMLElement>("[data-bolerish-toast-root]:not([data-limited])"),
      );
      const toastGap = Number.parseFloat(getComputedStyle(stack).columnGap) || 0;
      let nextHeight = 0;
      for (const root of rootList) {
        const rootStyles = getComputedStyle(root);
        const offset = Number.parseFloat(rootStyles.getPropertyValue("--toast-offset-y")) || 0;
        const index = Number.parseFloat(rootStyles.getPropertyValue("--toast-index")) || 0;
        const rootHeight =
          Number.parseFloat(rootStyles.getPropertyValue("--toast-height")) || root.offsetHeight;

        nextHeight = Math.max(nextHeight, offset + index * toastGap + rootHeight);
      }

      setHeight(nextHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    const rootList = stack.querySelectorAll<HTMLElement>("[data-bolerish-toast-root]");
    rootList.forEach((root) => resizeObserver.observe(root));
    window.addEventListener("resize", updateHeight);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, [toasts]);

  return (
    <div ref={stackRef} {...stylex.props(styles.stack(stackHeight), isTop && styles.stackTop)}>
      {toasts.map((item) => (
        <ToastPrimitive.Root
          key={item.id}
          toast={item}
          data-bolerish-toast-root=""
          {...stylex.props(
            styles.root,
            surfaceStyles.raised,
            surfaceStyles.edge,
            isTop && styles.rootTop,
          )}
        >
          <ToastPrimitive.Content {...stylex.props(styles.content)}>
            <ToastStatusIcon type={item.type} />
            <div {...stylex.props(styles.message)}>
              <ToastPrimitive.Title {...stylex.props(typographyStyles.title, styles.title)} />
              <ToastPrimitive.Description
                {...stylex.props(typographyStyles.description, styles.description)}
              />
            </div>
            {item.actionProps ? <ToastPrimitive.Action {...stylex.props(styles.action)} /> : null}
            <ToastPrimitive.Close aria-label={closeLabel} {...stylex.props(styles.close)}>
              <XIcon aria-hidden="true" />
            </ToastPrimitive.Close>
          </ToastPrimitive.Content>
        </ToastPrimitive.Root>
      ))}
      {hasClearAction ? (
        <button
          {...clearAllProps}
          type="button"
          onClick={() => toast.close()}
          {...stylex.props(styles.clearAll, isTop && styles.clearAllTop)}
        >
          {clearAllProps?.children ?? "Clear all"}
        </button>
      ) : null}
    </div>
  );
}

export function Toaster({
  className,
  style,
  xstyle,
  limit = 3,
  position = "bottom-right",
  clearAllProps,
  closeLabel = "Close toast",
  ...props
}: ToasterProps) {
  const [verticalPosition, horizontalPosition] = position.split("-") as [
    "bottom" | "top",
    "center" | "left" | "right",
  ];

  return (
    <ToastPrimitive.Provider {...props} limit={limit} toastManager={toast}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          {...mergeStyles(
            stylex.props(
              styles.viewport,
              verticalPositionStyles[verticalPosition],
              horizontalPositionStyles[horizontalPosition],
              xstyle,
            ),
            className,
            style,
          )}
        >
          <ToastStack position={position} clearAllProps={clearAllProps} closeLabel={closeLabel} />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}
