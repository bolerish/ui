import {
  BookOpenIcon,
  CubeIcon,
  PaletteIcon,
  TextTIcon,
  StackIcon,
  DiamondsFourIcon,
} from "@phosphor-icons/react";
import React, { useEffect } from "react";
import { addons, types, useGlobals } from "storybook/manager-api";

import "./manager.css";
import { create } from "storybook/theming";

import { ui } from "../src/documentation/locale";

function SidebarLabel({ name, id, type }: { name: string; id: string; type: string }) {
  if (type !== "docs") return name;
  let Icon = BookOpenIcon;
  if (id.startsWith("components-")) Icon = CubeIcon;
  else if (id.startsWith("foundations-")) Icon = DiamondsFourIcon;
  if (id === "foundations-color--docs") Icon = PaletteIcon;
  if (id === "foundations-typography--docs") Icon = TextTIcon;
  if (id === "foundations-elevation--docs") Icon = StackIcon;
  return (
    <span className="bolerish-sidebar-label">
      <Icon size={16} aria-hidden="true" />
      <span>{name}</span>
    </span>
  );
}

function setManagerTheme(mode: "light" | "dark") {
  document.documentElement.dataset.colorMode = mode;
  const values = getComputedStyle(document.documentElement);
  const color = (name: string) => values.getPropertyValue(`--docs-${name}`).trim();
  addons.setConfig({
    theme: create({
      base: mode,
      brandTitle: "bolerish/ui",
      brandUrl: "?path=/docs/getting-started--docs",
      colorPrimary: color("primary"),
      colorSecondary: color("primary"),
      appBg: color("surface"),
      appContentBg: color("background"),
      appBorderColor: color("border"),
      textColor: color("foreground"),
      textMutedColor: color("muted"),
      barBg: color("surface"),
      barTextColor: color("muted"),
      barSelectedColor: color("primary"),
      inputBg: color("surface"),
      inputBorder: color("border"),
      inputTextColor: color("foreground"),
      appBorderRadius: 8,
      fontBase: "var(--bolerish-font-body)",
      fontCode: "var(--bolerish-font-code)",
    }),
  });
}

function DocumentationTools() {
  const [globals, updateGlobals] = useGlobals();
  const locale = globals.locale === "en" ? "en" : "ko";
  const mode = globals.colorMode === "dark" ? "dark" : "light";
  useEffect(() => {
    setManagerTheme(mode);
  }, [mode]);
  return (
    <div className="bolerish-doc-tools">
      <select
        aria-label={ui.language}
        value={locale}
        onChange={(event) => updateGlobals({ locale: event.target.value })}
      >
        <option value="ko">한국어</option>
        <option value="en">English</option>
      </select>
      <select
        aria-label={ui.colorMode}
        value={globals.colorMode ?? "light"}
        onChange={(event) => updateGlobals({ colorMode: event.target.value })}
      >
        <option value="light">{ui.light}</option>
        <option value="dark">{ui.dark}</option>
      </select>
      <select
        aria-label="Token unit"
        value={globals.unit ?? "rem"}
        onChange={(event) => updateGlobals({ unit: event.target.value })}
      >
        <option value="rem">rem</option>
        <option value="px">px</option>
      </select>
      <select
        aria-label="Density"
        value={globals.density ?? "default"}
        onChange={(event) => updateGlobals({ density: event.target.value })}
      >
        <option value="default">Default (1)</option>
        <option value="compact">Compact (0.875)</option>
        <option value="spacious">Spacious (1.125)</option>
      </select>
      <select
        aria-label="Heading font"
        value={globals.fontPreset ?? "default"}
        onChange={(event) => updateGlobals({ fontPreset: event.target.value })}
      >
        <option value="default">Default font</option>
        <option value="serif-heading">Serif heading</option>
      </select>
      <select
        aria-label={ui.motion}
        value={globals.motionPreference ?? "system"}
        onChange={(event) => updateGlobals({ motionPreference: event.target.value })}
      >
        <option value="system">{ui.system}</option>
        <option value="reduce">{ui.reduce}</option>
        <option value="no-preference">{ui.allowMotion}</option>
      </select>
    </div>
  );
}

addons.register("bolerish/documentation", () =>
  addons.add("bolerish/documentation/preferences", {
    type: types.TOOL,
    title: "Documentation",
    render: DocumentationTools,
  }),
);

addons.setConfig({
  sidebar: {
    renderLabel: (item) => <SidebarLabel name={item.name} id={item.id} type={item.type} />,
  },
});

setManagerTheme("light");
