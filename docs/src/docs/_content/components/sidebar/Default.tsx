/* @example-preserve-indent */
import { colorVars, spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Collapsible, CollapsiblePanel } from "@bolerish/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@bolerish/ui/dropdown-menu";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarInset,
  type SidebarProviderProps,
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupTrigger,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarTrigger,
} from "@bolerish/ui/sidebar";
import {
  CommandIcon,
  TerminalIcon,
  StackIcon,
  BookOpenIcon,
  GearIcon,
  ChartPieIcon,
  MapTrifoldIcon,
  FrameCornersIcon,
  CaretRightIcon,
  SidebarSimpleIcon,
} from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useState, useRef, type ReactNode } from "react";

import PreviewContent from "./PreviewContent";

/* @example-start */
export default function Default(
  props: Pick<
    SidebarProviderProps,
    | "collapsible"
    | "side"
    | "variant"
    | "open"
    | "onOpenChange"
    | "openMobile"
    | "onOpenMobileChange"
  > & { children?: ReactNode },
) {
  const portalRef = useRef<HTMLDivElement>(null);
  // oxfmt-ignore
  const { children
  /* @example-end */
    = <><WorkspaceHeader /><PreviewContent /></>
  /* @example-start */
  } = props;
  return (
    <>
      {/* @example-end */}
      <div
        ref={portalRef}
        style={{ position: "relative", contain: "layout", height: "100%", overflow: "hidden" }}
      >
        {/* @example-start */}
        <SidebarProvider
          collapsible="icon"
          {...props}
          /* @example-end */
          portalContainer={portalRef}
          mobileModal="trap-focus"
          /* @example-start */
        >
          <Sidebar>
            {/* @example-end */}
            <WorkspaceSwitcher />
            {/* @example-start */}
            <SidebarContent>
              <SidebarNavigation />
            </SidebarContent>
            {/* @example-end */}
            <UserMenu />
            {/* @example-start */}
          </Sidebar>
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
        {/* @example-end */}
      </div>
      {/* @example-start */}
    </>
  );
}
/* @example-end */

function WorkspaceSwitcher() {
  const state = useSidebar();
  const compact = !state.isMobile && !state.open && state.collapsible === "icon";
  return (
    <SidebarHeader>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton style={{ height: compact ? 32 : 48 }}>
              <span {...stylex.props(switcherStyles.avatar)}>
                <CommandIcon size={16} />
              </span>
              <span {...stylex.props(switcherStyles.detail, compact && switcherStyles.hidden)}>
                <strong>Acme Inc</strong>
                <br />
                Enterprise
              </span>
            </SidebarMenuButton>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem>Acme Inc</DropdownMenuItem>
          <DropdownMenuItem>Add workspace</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarHeader>
  );
}
const switcherStyles = stylex.create({
  avatar: {
    display: "inline-flex",
    width: 32,
    height: 32,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colorVars.bgSelected,
  },
  detail: {
    textAlign: "left",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  hidden: { display: "none" },
});

/* @example-start */
function SidebarNavigation() {
  /* @example-end */
  /* @example-start */
  const [expanded, setExpanded] = useState(true);
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <Collapsible
              open={expanded}
              onOpenChange={setExpanded}
              style={{ gap: spacingVars.space1 }}
            >
              <SidebarMenuButton
                icon={<TerminalIcon />}
                aria-expanded={expanded}
                onClick={() => setExpanded(!expanded)}
              >
                Playground
                <CaretRightIcon
                  style={{
                    marginLeft: "auto",
                    transform: expanded ? "rotate(90deg)" : undefined,
                  }}
                />
              </SidebarMenuButton>
              <CollapsiblePanel>
                <SidebarMenuSub>
                  {["History", "Starred", "Settings"].map((name) => (
                    <SidebarMenuSubItem key={name}>
                      <SidebarMenuSubButton
                        isActive={name === "History"}
                        render={<a href={`#${name.toLowerCase()}`} aria-label={name} />}
                      >
                        {name}
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsiblePanel>
            </Collapsible>
          </SidebarMenuItem>
          {(
            [
              ["Models", StackIcon],
              ["Documentation", BookOpenIcon],
              ["Settings", GearIcon],
            ] as const
          ).map(([name, Icon]) => (
            <SidebarMenuItem key={String(name)}>
              <SidebarMenuButton
                icon={<Icon aria-hidden="true" />}
                render={<a href={`#${String(name).toLowerCase()}`} aria-label={String(name)} />}
              >
                {String(name)}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupTrigger>Projects</SidebarGroupTrigger>
        <SidebarGroupContent>
          <SidebarMenu>
            {(
              [
                ["Design Engineering", FrameCornersIcon],
                ["Sales & Marketing", ChartPieIcon],
                ["Travel", MapTrifoldIcon],
              ] as const
            ).map(([name, Icon]) => (
              <SidebarMenuItem key={String(name)}>
                <SidebarMenuButton
                  icon={<Icon aria-hidden="true" />}
                  render={<a href="#project" aria-label={String(name)} />}
                >
                  {String(name)}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
}
/* @example-end */
function UserMenu() {
  const state = useSidebar();
  const compact = !state.isMobile && !state.open && state.collapsible === "icon";
  return (
    <SidebarFooter>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <SidebarMenuButton style={{ height: compact ? 32 : 48 }}>
              <span {...stylex.props(userStyles.avatar)}>B</span>
              <span {...stylex.props(userStyles.detail, compact && userStyles.hidden)}>
                <strong>bolerish</strong>
                <br />
                bolerish@example.com
              </span>
            </SidebarMenuButton>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuItem>Account</DropdownMenuItem>
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}
const userStyles = stylex.create({
  avatar: {
    display: "inline-flex",
    width: 32,
    height: 32,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: colorVars.bgSelected,
  },
  detail: {
    textAlign: "left",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  hidden: { display: "none" },
});

function WorkspaceHeader() {
  const state = useSidebar();
  const compact = !state.isMobile && !state.open && state.collapsible === "icon";
  return (
    <header
      style={{
        height: compact ? 48 : 64,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: spacingVars.space4,
        paddingInline: spacingVars.space4,
      }}
    >
      <SidebarTrigger size="sm" shape="square" aria-label="Toggle sidebar">
        <SidebarSimpleIcon size={16} />
      </SidebarTrigger>
      <span style={{ height: 16, borderInlineStart: `1px solid ${colorVars.strokeDefault}` }} />
      <span
        style={{
          color: colorVars.fgSecondary,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        Building Your Application
      </span>
      <CaretRightIcon size={12} />
      <span>Data Fetching</span>
    </header>
  );
}
