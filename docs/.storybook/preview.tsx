import { colorVars, spacingVars, typo } from "@bolerish/tokens/semantic.stylex";
import {
  darkColorTheme,
  darkShadowTheme,
  lightColorTheme,
  lightShadowTheme,
} from "@bolerish/tokens/themes.stylex";
import {
  DocsContainer,
  TableOfContents,
  type DocsContainerProps,
} from "@storybook/addon-docs/blocks";
import type { Preview } from "@storybook/react-vite";

import "@bolerish/ui/global.css";
import "./preview.css";
import * as stylex from "@stylexjs/stylex";
import { type ReactNode, useLayoutEffect, useEffect, useState } from "react";
import { themes } from "storybook/theming";

import { documentationComponents } from "../src/documentation/components";
import { LocaleContext, ui } from "../src/documentation/locale";
import { useColorMode } from "../src/documentation/useColorMode";
import type { DocumentationGlobals } from "../src/documentation/useDocumentationGlobals";
import { useDocumentationGlobals } from "../src/documentation/useDocumentationGlobals";

type ColorMode = "system" | "light" | "dark";
const typographyTheme = stylex.createTheme(typo, {
  fontFamily: "var(--bolerish-font-body)",
  fontFamilyBody: "var(--bolerish-font-body)",
  fontFamilyHeading: "var(--bolerish-font-heading, var(--bolerish-font-body))",
});

const styles = stylex.create({
  document: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 12rem",
    gap: spacingVars.space8,
    "@media (max-width: 60rem)": { gridTemplateColumns: "minmax(0, 1fr)" },
  },
  article: { minWidth: 0 },
  toc: {
    alignSelf: "start",
    position: "sticky",
    top: spacingVars.space6,
    "@media (max-width: 60rem)": { display: "none" },
  },
  compact: { minHeight: 0, display: "block" },
  root: {
    backgroundColor: colorVars.bgCanvas,
    color: colorVars.fgPrimary,
    fontFamily: typo.fontFamilyBody,
    minHeight: `calc(100vh - ${spacingVars.space4} * 2)`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
});

function handlePreviewClick(event: MouseEvent) {
  if (!(event.target instanceof Element)) return;

  const placeholderLink = event.target.closest('a[href="#"]');
  if (placeholderLink) event.preventDefault();
}

function ThemeScope({
  children,
  mode,
  compact,
}: {
  children: ReactNode;
  mode: ColorMode;
  compact: boolean;
}) {
  const colorMode = useColorMode(mode);
  const colorTheme = colorMode === "dark" ? darkColorTheme : lightColorTheme;
  const shadowTheme = colorMode === "dark" ? darkShadowTheme : lightShadowTheme;
  const themeClassName = stylex.props(colorTheme, shadowTheme, typographyTheme).className ?? "";

  useLayoutEffect(() => {
    const themeClassList = themeClassName.split(" ").filter(Boolean);
    document.documentElement.classList.add(...themeClassList);
    document.addEventListener("click", handlePreviewClick);

    return () => {
      document.documentElement.classList.remove(...themeClassList);
      document.removeEventListener("click", handlePreviewClick);
    };
  }, [themeClassName]);

  return (
    <div
      {...stylex.props(
        styles.root,
        compact && styles.compact,
        colorTheme,
        shadowTheme,
        typographyTheme,
      )}
    >
      {children}
    </div>
  );
}

function TokenPreferenceScope({
  children,
  settings,
}: {
  children: ReactNode;
  settings: DocumentationGlobals;
}) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const values = {
      "--bolerish-unit": settings.unit === "px" ? "16px" : "1rem",
      "--bolerish-density":
        settings.density === "compact" ? "0.875" : settings.density === "spacious" ? "1.125" : "1",
      "--bolerish-font-heading":
        settings.fontPreset === "serif-heading" ? "Georgia, serif" : "var(--bolerish-font-body)",
    };
    const previous = Object.entries(values).map(([name]) => [
      name,
      root.style.getPropertyValue(name),
    ]);
    const motion = root.getAttribute("data-bolerish-motion");
    for (const [name, value] of Object.entries(values)) root.style.setProperty(name, value);
    root.setAttribute(
      "data-bolerish-motion",
      { system: "system", reduce: "off", "no-preference": "on" }[settings.motionPreference],
    );
    return () => {
      for (const [name, value] of previous) {
        if (value) root.style.setProperty(name, value);
        else root.style.removeProperty(name);
      }
      if (motion === null) root.removeAttribute("data-bolerish-motion");
      else root.setAttribute("data-bolerish-motion", motion);
    };
  }, [settings.unit, settings.density, settings.fontPreset, settings.motionPreference]);
  return children;
}

function DocumentationContainer({
  children,
  context,
}: DocsContainerProps & { children?: ReactNode }) {
  const settings = useDocumentationGlobals(context);
  const { colorMode, locale } = settings;
  const mode = useColorMode(colorMode);

  return (
    <LocaleContext.Provider value={locale}>
      <TokenPreferenceScope settings={settings}>
        <ThemeScope mode={mode} compact>
          <DocsContainer
            context={context}
            theme={{
              ...themes[mode],
              appContentBg: "transparent",
              colorSecondary: "currentColor",
              fontBase: "var(--bolerish-font-body)",
              fontCode: "var(--bolerish-font-code)",
            }}
          >
            <div {...stylex.props(styles.document)}>
              <div
                className={`sb-unstyled ${stylex.props(styles.article).className}`}
                data-document-locale={locale}
                lang={locale}
              >
                {children}
              </div>
              <aside {...stylex.props(styles.toc)}>
                <TableOfContents
                  contentsSelector={`[data-document-locale="${locale}"]`}
                  title={ui.onThisPage}
                  channel={context.channel}
                  headingSelector="h2, h3"
                  ignoreSelector=".bolerish-example h2, .bolerish-example h3, #table-of-contents"
                />
              </aside>
            </div>
          </DocsContainer>
        </ThemeScope>
      </TokenPreferenceScope>
    </LocaleContext.Provider>
  );
}

function StoryPreview({
  children,
  globals,
  isolated,
}: {
  children: ReactNode;
  globals: DocumentationGlobals;
  isolated: boolean;
}) {
  const [settings, setSettings] = useState<DocumentationGlobals | null>(null);
  useEffect(() => {
    if (!isolated) return;
    const update = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== window.parent ||
        event.data?.type !== "bolerish-preview-globals"
      )
        return;
      const {
        colorMode,
        motionPreference,
        locale,
        unit = "rem",
        density = "default",
        fontPreset = "default",
      } = event.data.globals ?? {};
      if (
        !["system", "light", "dark"].includes(colorMode) ||
        !["system", "reduce", "no-preference"].includes(motionPreference) ||
        !["ko", "en"].includes(locale) ||
        !["rem", "px"].includes(unit) ||
        !["default", "compact", "spacious"].includes(density) ||
        !["default", "serif-heading"].includes(fontPreset)
      )
        return;
      setSettings({ colorMode, motionPreference, locale, unit, density, fontPreset });
    };
    window.addEventListener("message", update);
    window.parent.postMessage({ type: "bolerish-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", update);
  }, [isolated]);
  const current = settings ?? globals;
  return (
    <LocaleContext.Provider value={current.locale}>
      <TokenPreferenceScope settings={current}>
        <ThemeScope mode={current.colorMode} compact={isolated}>
          {children}
        </ThemeScope>
      </TokenPreferenceScope>
    </LocaleContext.Provider>
  );
}

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <StoryPreview
        globals={context.globals as DocumentationGlobals}
        isolated={context.id === "internal-preview--example"}
      >
        <Story />
      </StoryPreview>
    ),
  ],
  globalTypes: {
    unit: { description: "Token unit" },
    density: { description: "Shared density" },
    fontPreset: { description: "Heading font" },
    locale: { description: "Language" },
    colorMode: { description: "Color mode" },
    motionPreference: { description: "Motion" },
  },
  initialGlobals: {
    unit: "rem",
    density: "default",
    fontPreset: "default",
    locale: "ko",
    colorMode: "light",
    motionPreference: "system",
  },
  parameters: {
    docs: {
      renderer: async () => (await import("../src/documentation/renderer")).renderer,
      container: DocumentationContainer,
      components: documentationComponents,
      toc: false,
    },
    a11y: {
      config: {
        rules: [{ id: "color-contrast", enabled: true }],
      },
    },
    layout: "padded",
    options: {
      storySort: {
        includeNames: true,
        method: "alphabetical",
        order: [
          "Getting Started",
          "Foundations",
          [
            "Overview",
            "Accessibility",
            "Design Token",
            "Color",
            "Typography",
            "Iconography",
            "Layout",
            "Spacing",
            "Radius",
            "Elevation",
            "State",
            "Motion",
            "Feedback",
            "Voice and Tone",
            "Writing",
          ],
          "Components",
          "Patterns",
          ["Search and Filter"],
        ],
      },
    },
  },
};

export default preview;
