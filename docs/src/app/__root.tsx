import { themeClassNames } from "@bolerish/ui/theme";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
  redirect,
  useHydrated,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import { catalog } from "../shared/lib/catalog";
import { documentPath, legacyDocumentPath, localizedPath } from "../shared/lib/paths";
import { useColorMode } from "../shared/lib/useColorMode";
import { LocaleContext } from "../shared/model/locale";
import { validateSettings, validateSearch, parseSavedPreferences } from "../shared/model/settings";
import {
  DocumentationContext,
  DocumentationPreferencesContext,
} from "../shared/model/useDocumentationGlobals";
import { Shell } from "./(site)/_components/Shell";
import { DocumentError, DocumentNotFound } from "./_components/DocumentError";

import stylesheet from "./styles.css?url";

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
    const base = legacy
      ? legacyPage
        ? documentPath(legacyPage)
        : "/docs/getting-started"
      : legacyDocumentPath(location.pathname);
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
  component: Outlet,
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
  const routeSettings = useMemo(
    () =>
      validateSettings({
        ...savedPreferences,
        ...preferences,
        ...(hydrated ? search : {}),
        locale: pathname.startsWith("/preview/")
          ? search.locale
          : pathname.endsWith("/ko")
            ? "ko"
            : "en",
      }),
    [savedPreferences, preferences, search, pathname, hydrated],
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
    "--bolerish-unit": settings.unit === "px" ? "16px" : "1rem",
    "--bolerish-density": { default: "1", compact: "0.875", spacious: "1.125" }[settings.density],
    "--bolerish-font-heading":
      settings.fontPreset === "serif-heading" ? "Georgia, serif" : "var(--bolerish-font-body)",
  } as CSSProperties;
  return (
    <html
      suppressHydrationWarning
      lang={settings.locale}
      className={themeClassNames[mode]}
      data-color-mode={mode}
      data-bolerish-surface={settings.surface}
      data-bolerish-motion={
        { system: "system", reduce: "off", "no-preference": "on" }[settings.motionPreference]
      }
      style={runtimeStyle}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const value=document.cookie.split('; ').find(c=>c.startsWith('bolerish-docs-settings='))?.slice('bolerish-docs-settings='.length);let saved={};try{saved=JSON.parse(decodeURIComponent(value||''))||{}}catch{}const preference=new URLSearchParams(location.search).get('colorMode')||saved.colorMode;const mode=preference==='dark'||preference==='system'&&matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';document.documentElement.dataset.colorMode=mode;document.documentElement.className=${JSON.stringify(themeClassNames)}[mode]}catch{}`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {pathname === "/404" ? (
          <DocumentNotFound />
        ) : (
          <>
            <DocumentationContext.Provider value={settings}>
              <DocumentationPreferencesContext.Provider
                value={(changes) => setPreferences({ ...routeSettings, ...changes })}
              >
                <LocaleContext.Provider value={settings.locale}>
                  {isolated ? children : <Shell>{children}</Shell>}
                </LocaleContext.Provider>
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
