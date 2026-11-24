"use client";

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { useRender } from "@base-ui/react/use-render";
import {
  motionVars,
  colorVars,
  radiusVars,
  spacingVars,
  typo,
} from "@bolerish/tokens/semantic.stylex";
import { CaretDownIcon } from "@phosphor-icons/react/ssr";
import * as stylex from "@stylexjs/stylex";
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  type ComponentProps,
  type ReactNode,
} from "react";

import { Button, type ButtonProps } from "./button";
import { Dialog, DialogContent } from "./dialog";
import type { StyledProps } from "./styles/merge-styles";
import { mergeStyles } from "./styles/merge-styles";

export type SidebarProviderProps = {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openMobile?: boolean;
  defaultOpenMobile?: boolean;
  onOpenMobileChange?: (open: boolean) => void;
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  width?: string;
  mobileWidth?: string;
  iconWidth?: string;
  portalContainer?: ComponentProps<typeof DialogContent>["portalContainer"];
  mobileModal?: ComponentProps<typeof Dialog>["modal"];
};

type SidebarState = Required<
  Pick<
    SidebarProviderProps,
    "side" | "variant" | "collapsible" | "width" | "mobileWidth" | "iconWidth"
  >
> & {
  portalContainer?: SidebarProviderProps["portalContainer"];
  mobileModal?: SidebarProviderProps["mobileModal"];
  open: boolean;
  openMobile: boolean;
  isMobile: boolean;
  id: string;
  returnFocus: () => HTMLElement | null;
  setTrigger: (element: HTMLElement | null) => void;
  state: "expanded" | "collapsed";
  toggleSidebar: () => void;
  setOpen: (open: boolean) => void;
  setOpenMobile: (open: boolean) => void;
};
const SidebarContext = createContext<SidebarState | null>(null);

export function SidebarProvider({
  children,
  open: controlledOpen,
  defaultOpen = true,
  onOpenChange,
  openMobile: controlledMobile,
  defaultOpenMobile = false,
  onOpenMobileChange,
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  width = "16rem",
  mobileWidth = "18rem",
  iconWidth = "3rem",
  portalContainer,
  mobileModal = true,
}: SidebarProviderProps) {
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const [localMobile, setLocalMobile] = useState(defaultOpenMobile);
  const [isMobile, setIsMobile] = useState(false);
  const id = useId();
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(null);
  const open = controlledOpen ?? localOpen;
  const openMobile = controlledMobile ?? localMobile;
  function setOpen(value: boolean) {
    if (controlledOpen === undefined) setLocalOpen(value);
    onOpenChange?.(value);
  }
  function setOpenMobile(value: boolean) {
    if (controlledMobile === undefined) setLocalMobile(value);
    onOpenMobileChange?.(value);
  }
  useEffect(() => {
    const media = window.matchMedia("(max-width: 47.999rem)");
    function update() {
      setIsMobile(media.matches);
      if (!media.matches) {
        if (controlledMobile === undefined) setLocalMobile(false);
        onOpenMobileChange?.(false);
      }
    }
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [controlledMobile, onOpenMobileChange]);

  return (
    <SidebarContext
      value={{
        open,
        openMobile,
        isMobile,
        id,
        returnFocus: () => triggerElement,
        setTrigger: setTriggerElement,
        state: open ? "expanded" : "collapsed",
        toggleSidebar: () => (isMobile ? setOpenMobile(!openMobile) : setOpen(!open)),
        setOpen,
        setOpenMobile,
        side,
        variant,
        collapsible,
        width,
        mobileWidth,
        iconWidth,
        portalContainer,
        mobileModal,
      }}
    >
      <div {...stylex.props(styles.provider)}>{children}</div>
    </SidebarContext>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("Sidebar components require SidebarProvider.");
  return context;
}

export function Sidebar({
  "aria-label": ariaLabel = "Navigation",
  children,
  className,
  style,
  ...props
}: ComponentProps<"nav">) {
  const state = useSidebar();
  const collapsed = !state.open && state.collapsible !== "none";
  const nav = (
    <nav
      {...props}
      id={state.id}
      aria-label={ariaLabel}
      {...mergeStyles(
        stylex.props(styles.nav, state.variant === "floating" && styles.floating),
        className,
        style,
      )}
    >
      {children}
    </nav>
  );
  if (state.isMobile)
    return (
      <Dialog modal={state.mobileModal} open={state.openMobile} onOpenChange={state.setOpenMobile}>
        <DialogContent
          portalContainer={state.portalContainer}
          finalFocus={state.returnFocus}
          aria-label={ariaLabel}
          xstyle={[
            styles.mobile(state.mobileWidth),
            state.side === "left" ? styles.left : styles.right,
          ]}
        >
          {nav}
        </DialogContent>
      </Dialog>
    );
  const width = collapsed ? (state.collapsible === "icon" ? state.iconWidth : "0px") : state.width;
  return (
    <div
      aria-hidden={collapsed && state.collapsible === "offcanvas"}
      inert={collapsed && state.collapsible === "offcanvas"}
      data-state={collapsed ? "collapsed" : "expanded"}
      {...stylex.props(
        styles.desktop(width),
        state.side === "right" && styles.desktopRight,
        state.variant !== "sidebar" && styles.frame,
      )}
    >
      {nav}
    </div>
  );
}

export function SidebarTrigger({ onClick, children = "Toggle sidebar", ...props }: ButtonProps) {
  const { isMobile, openMobile, open: desktopOpen, setTrigger, toggleSidebar, id } = useSidebar();
  const open = isMobile ? openMobile : desktopOpen;
  return (
    <Button
      variant="ghost"
      {...props}
      ref={setTrigger}
      aria-controls={id}
      aria-expanded={open}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          toggleSidebar();
        }
      }}
    >
      {children}
    </Button>
  );
}

export function SidebarInset({
  className,
  style,
  render,
  ref,
  ...props
}: useRender.ComponentProps<"main">) {
  const { variant } = useSidebar();
  return useRender({
    defaultTagName: "main",
    render,
    ref,
    props: {
      ...props,
      ...mergeStyles(
        stylex.props(styles.inset, variant === "inset" && styles.insetSurface),
        className,
        style,
      ),
    },
  });
}
export function SidebarHeader({ className, style, ...props }: ComponentProps<"div">) {
  return <div {...props} {...mergeStyles(stylex.props(styles.section), className, style)} />;
}
export function SidebarFooter({ className, style, ...props }: ComponentProps<"div">) {
  return <div {...props} {...mergeStyles(stylex.props(styles.section), className, style)} />;
}
export function SidebarContent({ className, style, ...props }: ComponentProps<"div">) {
  return <div {...props} {...mergeStyles(stylex.props(styles.content), className, style)} />;
}
const SidebarGroupContext = createContext({
  hasTrigger: false,
  setHasTrigger: (_value: boolean) => {},
});

export type SidebarGroupProps = StyledProps<ComponentProps<typeof CollapsiblePrimitive.Root>>;
export function SidebarGroup({
  className,
  style,
  defaultOpen = true,
  ...props
}: SidebarGroupProps) {
  const [hasTrigger, setHasTrigger] = useState(false);
  const generatedId = useId();
  const groupId = props.id ?? generatedId;
  const sidebar = useSidebar();
  const compact =
    hasTrigger && !sidebar.isMobile && !sidebar.open && sidebar.collapsible === "icon";
  useEffect(() => {
    if (compact && document.getElementById(groupId)?.contains(document.activeElement)) {
      sidebar.returnFocus()?.focus();
    }
  }, [compact, groupId, sidebar]);
  return (
    <SidebarGroupContext.Provider value={{ hasTrigger, setHasTrigger }}>
      <CollapsiblePrimitive.Root
        render={<section />}
        {...props}
        id={groupId}
        defaultOpen={defaultOpen}
        {...mergeStyles(stylex.props(styles.section), className, style)}
      />
    </SidebarGroupContext.Provider>
  );
}
export type SidebarGroupTriggerProps = StyledProps<
  ComponentProps<typeof CollapsiblePrimitive.Trigger>
>;
export function SidebarGroupTrigger({
  children,
  className,
  style,
  ...props
}: SidebarGroupTriggerProps) {
  const { setHasTrigger } = useContext(SidebarGroupContext);
  useEffect(() => {
    setHasTrigger(true);
    return () => setHasTrigger(false);
  }, [setHasTrigger]);
  const state = useSidebar();
  const compact = !state.isMobile && !state.open && state.collapsible === "icon";
  return (
    <CollapsiblePrimitive.Trigger
      {...props}
      hidden={compact || props.hidden}
      {...mergeStyles(stylex.props(styles.groupTrigger), className, style)}
    >
      {children}
      <CaretDownIcon aria-hidden="true" {...stylex.props(styles.groupArrow)} />
    </CollapsiblePrimitive.Trigger>
  );
}
export function SidebarGroupLabel({
  render,
  ref,
  className,
  style,
  ...props
}: useRender.ComponentProps<"div">) {
  const state = useSidebar();
  const collapsed = !state.isMobile && !state.open && state.collapsible === "icon";
  return useRender({
    defaultTagName: "div",
    render,
    ref,
    props: {
      ...props,
      ...mergeStyles(stylex.props(styles.label, collapsed && styles.srOnly), className, style),
    },
  });
}
export type SidebarGroupContentProps = StyledProps<
  ComponentProps<typeof CollapsiblePrimitive.Panel>
>;
export function SidebarGroupContent({ className, style, ...props }: SidebarGroupContentProps) {
  const { hasTrigger } = useContext(SidebarGroupContext);
  const state = useSidebar();
  const compact = hasTrigger && !state.isMobile && !state.open && state.collapsible === "icon";
  return (
    <CollapsiblePrimitive.Panel
      {...props}
      hidden={compact || props.hidden}
      {...mergeStyles(stylex.props(styles.group), className, style)}
    />
  );
}
export function SidebarMenu({ className, style, ...props }: ComponentProps<"ul">) {
  return <ul {...props} {...mergeStyles(stylex.props(styles.menu), className, style)} />;
}
export function SidebarMenuItem({ className, style, ...props }: ComponentProps<"li">) {
  return <li {...props} {...mergeStyles(stylex.props(styles.item), className, style)} />;
}
export function SidebarMenuSub(props: ComponentProps<"ul">) {
  const state = useSidebar();
  const collapsed = !state.isMobile && !state.open && state.collapsible === "icon";
  return (
    <ul
      {...props}
      hidden={collapsed || props.hidden}
      inert={collapsed}
      {...mergeStyles(
        stylex.props(styles.menu, styles.sub, collapsed && styles.hidden),
        props.className,
        props.style,
      )}
    />
  );
}
export function SidebarMenuSubItem({ className, style, ...props }: ComponentProps<"li">) {
  return <li {...props} {...mergeStyles(stylex.props(styles.item), className, style)} />;
}
export function SidebarMenuButton({
  icon,
  isActive,
  tooltip,
  className,
  style,
  children,
  ...props
}: ButtonProps & { icon?: ReactNode; isActive?: boolean; tooltip?: string }) {
  const state = useSidebar();
  const iconOnly = !state.isMobile && !state.open && state.collapsible === "icon";
  return (
    <Button
      variant="ghost"
      size="sm"
      align={iconOnly ? "center" : "start"}
      {...props}
      aria-current={isActive ? "page" : undefined}
      {...mergeStyles(
        stylex.props(styles.menuButton, iconOnly && styles.iconButton, isActive && styles.active),
        className,
        {
          paddingInline: spacingVars.space2,
          textDecoration: "none",
          fontWeight: isActive ? typo.fontWeightMedium : typo.fontWeightRegular,
          ...(isActive ? { backgroundColor: colorVars.bgSelected } : {}),
          height: state.isMobile ? 44 : 32,
          ...(iconOnly ? { width: 32, paddingInline: 0 } : {}),
          ...style,
        },
      )}
      title={tooltip}
    >
      {icon ? (
        <span
          style={{
            display: "inline-flex",
            flexShrink: 0,
            width: iconOnly ? 16 : 32,
            justifyContent: "center",
            height: 16,
            fontSize: typo.fontSizeMd,
          }}
        >
          {icon}
        </span>
      ) : null}
      <span {...stylex.props(styles.menuText, iconOnly && styles.srOnly)}>{children}</span>
    </Button>
  );
}
export function SidebarMenuSubButton(props: Parameters<typeof SidebarMenuButton>[0]) {
  const { isMobile } = useSidebar();
  return <SidebarMenuButton {...props} style={{ height: isMobile ? 44 : 28, ...props.style }} />;
}

const styles = stylex.create({
  menuText: {
    display: "flex",
    alignItems: "center",
    gap: spacingVars.space2,
    flex: 1,
    minWidth: 0,
    textAlign: "start",
  },
  hidden: { display: "none" },
  left: { left: 0 },
  right: { right: 0 },
  desktopRight: { order: 1 },
  desktop: (width: string) => ({
    position: "relative",
    height: "100%",
    minHeight: 0,
    flexShrink: 0,
    width,
    overflow: "hidden",
    transitionProperty: "width",
    "@media (prefers-reduced-motion: reduce)": {
      ":not(:root[data-bolerish-motion='on'] *)": {
        transitionDuration: motionVars.durationInstant,
      },
    },
    transitionDuration: motionVars.durationNormal,
    transitionTimingFunction: motionVars.easingStandard,
  }),
  mobile: (width: string) => ({
    position: "fixed",
    top: 0,
    bottom: 0,
    width,
    maxWidth: "100%",
    maxHeight: "100dvh",
    borderRadius: 0,
    padding: 0,
    overflow: "hidden",
  }),
  frame: { padding: spacingVars.space2 },
  inset: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  insetSurface: {
    margin: spacingVars.space2,
    borderRadius: radiusVars.lg,
    backgroundColor: colorVars.bgSurface,
  },
  menu: {
    listStyle: "none",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: spacingVars.space1,
  },
  item: { minWidth: 0 },
  group: { minWidth: 0 },
  groupTrigger: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: 32,
    paddingInline: spacingVars.space2,
    color: colorVars.fgSecondary,
    backgroundColor: "transparent",
    borderWidth: 0,
    cursor: "pointer",
    fontFamily: typo.fontFamilyBody,
    borderRadius: radiusVars.sm,
    ":focus-visible": { outline: `2px solid ${colorVars.strokeFocus}`, outlineOffset: 2 },
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
    ":is([hidden])": { display: "none" },
  },
  groupArrow: {
    marginInlineStart: "auto",
    flexShrink: 0,
    transform: { default: "rotate(0deg)", ":is([data-panel-open] > *)": "rotate(180deg)" },
    transitionProperty: "transform",
    transitionDuration: motionVars.durationNormal,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: motionVars.durationInstant },
  },
  label: {
    color: colorVars.fgSecondary,
    paddingInline: spacingVars.space2,
    height: 32,
    display: "flex",
    alignItems: "center",
    fontSize: typo.fontSizeXs,
    fontWeight: typo.fontWeightMedium,
  },
  sub: {
    marginInlineStart: spacingVars.space4,
    paddingInlineStart: spacingVars.space2,
    borderInlineStart: `1px solid ${colorVars.strokeDefault}`,
  },
  iconButton: { justifyContent: "center" },
  menuButton: { width: "100%", justifyContent: "flex-start", borderRadius: radiusVars.md },
  active: { backgroundColor: colorVars.bgSelected },
  floating: { borderRadius: radiusVars.lg, border: `1px solid ${colorVars.strokeDefault}` },
  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: 0,
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
  provider: { display: "flex", height: "100%", minHeight: 0, width: "100%" },
  nav: {
    borderInlineEnd: `1px solid ${colorVars.strokeDefault}`,
    backgroundColor: colorVars.bgSubtle,
    color: colorVars.fgPrimary,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
  },
  section: { flexShrink: 0, padding: spacingVars.space2 },
  content: {
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    scrollbarWidth: "none",
    "::-webkit-scrollbar": { display: "none" },
  },
});
