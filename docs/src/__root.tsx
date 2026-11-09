import { colorVars, typo } from "@bolerish/tokens/semantic.stylex";
import { surface } from "@bolerish/ui/surface";
import * as stylex from "@stylexjs/stylex";
import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
  redirect,
  useHydrated,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import { catalog } from "@/_shared/catalog";
import { DocumentError, DocumentNotFound } from "@/_shared/DocumentError";
import { documentPath, legacyDocumentPath, localizedPath } from "@/shared/lib/paths";
import { previewTabBootstrap } from "@/shared/lib/preview-tab";
import { useColorMode } from "@/shared/lib/useColorMode";
import { LocaleContext } from "@/shared/model/locale";
import { validateSettings, validateSearch, parseSavedPreferences } from "@/shared/model/settings";
import {
  DocumentationContext,
  DocumentationPreferencesContext,
} from "@/shared/model/useDocumentationGlobals";

import { SiteLayout } from "./layout";
import { documentMarker } from "./shared/styles/document-marker.stylex";

import stylesheet from "@bolerish/ui/global.css?url";

function canonicalRedirect(
  location: { pathname: string; searchStr: string; hash: string },
  search: ReturnType<typeof validateSearch>,
) {
  const isolated = location.pathname.startsWith("/preview/");
  if (!isolated) {
    const legacy = new URLSearchParams(location.searchStr).get("path");
    const legacyPage = legacy
      ? catalog.find((page) => legacy === `/docs/${page.section}-${page.slug}--docs`)
      : undefined;
    let base = legacyDocumentPath(location.pathname);
    if (legacy) base = legacyPage ? documentPath(legacyPage) : "/docs/getting-started";
    const locale = search.locale ?? (location.pathname.endsWith("/ko") ? "ko" : "en");
    const target = localizedPath(base, locale);
    if (legacy || target !== location.pathname || search.locale !== undefined) {
      const { locale: _locale, ...preferences } = validateSearch(search);
      const query = new URLSearchParams(Object.entries(preferences));
      return `${target}${query.size ? `?${query}` : ""}${location.hash ? `#${location.hash}` : ""}`;
    }
  }
}

export const Route = createRootRoute({
  validateSearch,
  beforeLoad: ({ location, search }) => {
    const href = canonicalRedirect(location, search);
    if (href) throw redirect({ href, replace: true, statusCode: 308 });
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "google-site-verification",
        content: "ByC-52mQ53y_BZbeD-iTfMwLwziODclutXymZRPl37E",
      },
      { title: "bolerish/ui" },
    ],
    links: [
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" },
      { rel: "manifest", href: "/favicon/site.webmanifest" },
      { rel: "describedby", type: "text/plain", href: "/llms.txt" },
      { rel: "stylesheet", href: stylesheet },
      ...(import.meta.env.DEV ? [{ rel: "stylesheet", href: "/virtual:stylex.css" }] : []),
    ],
  }),
  component: SiteLayout,
  shellComponent: Document,
  notFoundComponent: DocumentNotFound,
  errorComponent: DocumentError,
});
function Document({ children }: { children: ReactNode }) {
  const location = useRouterState({ select: (state) => state.location });
  const { search, pathname } = location;
  const hydrated = useHydrated();
  const savedPreferences = useMemo(
    () =>
      hydrated
        ? parseSavedPreferences(
            document.cookie
              .split("; ")
              .find((cookie) => cookie.startsWith("bolerish-docs-settings="))
              ?.slice("bolerish-docs-settings=".length),
          )
        : null,
    [hydrated],
  );
  const [preferences, setPreferences] = useState<Partial<ReturnType<typeof validateSettings>>>({});
  const isolatedPath = pathname.startsWith("/preview/");
  let locale = pathname.endsWith("/ko") ? "ko" : "en";
  if (isolatedPath) locale = search.locale ?? "en";
  const routeSettings = useMemo(
    () =>
      validateSettings({
        ...savedPreferences,
        ...preferences,
        ...(hydrated ? search : {}),
        locale,
      }),
    [savedPreferences, preferences, search, locale, hydrated],
  );
  useEffect(() => {
    if (!hydrated) return;
    const href = canonicalRedirect(location, search);
    if (href) window.location.replace(href);
  }, [hydrated, location, search]);
  const [frameSettings, setFrameSettings] = useState<typeof routeSettings | null>(null);
  const settings = frameSettings ?? routeSettings;
  const mode = useColorMode(settings.colorMode);
  const isolated = useRouterState({
    select: (state) => state.location.pathname.startsWith("/preview/"),
  });
  useEffect(() => {
    if (isolated) {
      const receive = (event: MessageEvent) => {
        if (
          event.origin === window.location.origin &&
          event.source === window.parent &&
          event.data?.type === "bolerish-preview-globals"
        ) {
          setFrameSettings(validateSettings(event.data.globals ?? {}));
        }
      };
      window.addEventListener("message", receive);
      window.parent.postMessage({ type: "bolerish-preview-ready" }, window.location.origin);
      return () => window.removeEventListener("message", receive);
    }
    if (!hydrated) return;
    const { locale: _locale, q: _query, ...saved } = routeSettings;
    document.cookie = `bolerish-docs-settings=${encodeURIComponent(JSON.stringify(saved))}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === "https:" ? "; Secure" : ""}`;
  }, [routeSettings, isolated, hydrated]);
  const runtimeStyle = {
    "--docs-background": colorVars.bgCanvas,
    "--docs-surface": colorVars.bgSurface,
    "--docs-subtle": colorVars.bgSubtle,
    "--docs-selected": colorVars.bgSelected,
    "--docs-foreground": colorVars.fgPrimary,
    "--docs-muted": colorVars.fgSecondary,
    "--docs-primary": colorVars.bgActionPrimary,
    "--docs-border": colorVars.strokeDefault,
    "--docs-control": colorVars.strokeControl,
    "--docs-focus": colorVars.strokeFocus,
    "--bolerish-unit": settings.unit === "px" ? "16px" : "1rem",
    "--bolerish-density": { default: "1", compact: "0.875", spacious: "1.125" }[settings.density],
    "--bolerish-font-heading":
      settings.fontPreset === "serif-heading" ? "Georgia, serif" : "var(--bolerish-font-body)",
  } as CSSProperties;
  return (
    <html
      {...stylex.props(styles.html, documentMarker)}
      suppressHydrationWarning
      lang={settings.locale}
      data-bolerish-theme={mode}
      {...surface.props({ mode: settings.surface })}
      data-bolerish-motion={
        { system: "system", reduce: "off", "no-preference": "on" }[settings.motionPreference]
      }
      style={runtimeStyle}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const value=document.cookie.split('; ').find(c=>c.startsWith('bolerish-docs-settings='))?.slice('bolerish-docs-settings='.length);let saved={};try{saved=JSON.parse(decodeURIComponent(value||''))||{}}catch{}const preference=new URLSearchParams(location.search).get('colorMode')||saved.colorMode;const mode=preference==='dark'||preference==='system'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.bolerishTheme=mode;document.documentElement.dataset.bolerishSurface=new URLSearchParams(location.search).get('surface')||saved.surface||'solid'}catch{}`,
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: previewTabBootstrap }} />
        <HeadContent />
      </head>
      <body {...stylex.props(styles.body)}>
        {pathname === "/404" ? (
          <DocumentNotFound />
        ) : (
          <>
            <DocumentationContext.Provider value={settings}>
              <DocumentationPreferencesContext.Provider
                value={(changes) => setPreferences({ ...routeSettings, ...changes })}
              >
                <LocaleContext.Provider value={settings.locale}>{children}</LocaleContext.Provider>
              </DocumentationPreferencesContext.Provider>
            </DocumentationContext.Provider>
            {import.meta.env.DEV ? (
              <script type="module" src="/@id/virtual:stylex:runtime" />
            ) : null}
            <Scripts />
          </>
        )}
      </body>
    </html>
  );
}

const styles = stylex.create({
  html: {
    background: colorVars.bgCanvas,
    color: colorVars.fgPrimary,
    fontFamily: typo.fontFamilyBody,
    scrollbarColor: "var(--docs-control) transparent",
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
  },
  body: {
    marginTop: "0",
    marginRight: "0",
    marginBottom: "0",
    marginLeft: "0",
  },
});
