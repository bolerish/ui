import { themeClassNames } from "@bolerish/ui/theme";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
  redirect,
} from "@tanstack/react-router";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import { catalog } from "../documentation/catalog";
import { DocumentError } from "../documentation/DocumentError";
import { LocaleContext } from "../documentation/locale";
import { documentPath, legacyDocumentPath, localizedPath } from "../documentation/paths";
import { getSavedPreferences } from "../documentation/preferences";
import { validateSettings, validateSearch, parseSavedPreferences } from "../documentation/settings";
import { Shell } from "../documentation/Shell";
import { useColorMode } from "../documentation/useColorMode";
import {
  DocumentationContext,
  DocumentationPreferencesContext,
} from "../documentation/useDocumentationGlobals";

import stylesheet from "../styles.css?url";

export const Route = createRootRoute({
  validateSearch,
  beforeLoad: async ({ location, search }) => {
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
        throw redirect({
          href: `${target}${query.size ? `?${query}` : ""}${location.hash ? `#${location.hash}` : ""}`,
          replace: true,
          statusCode: 308,
        });
      }
    }
    const savedPreferences = import.meta.env.SSR
      ? await getSavedPreferences()
      : parseSavedPreferences(
          document.cookie
            .split("; ")
            .find((cookie) => cookie.startsWith("bolerish-docs-settings="))
            ?.split("=")
            .slice(1)
            .join("="),
        );
    return { savedPreferences };
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
  notFoundComponent: () => (
    <article className="document">
      <h1>Page not found</h1>
      <p>Choose a document from the navigation.</p>
    </article>
  ),
  errorComponent: DocumentError,
});
function Document({ children }: { children: ReactNode }) {
  const search = useRouterState({ select: (state) => state.location.search });
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { savedPreferences } = Route.useRouteContext();
  const [preferences, setPreferences] = useState(() =>
    validateSettings({ ...savedPreferences, ...search }),
  );
  const routeSettings = useMemo(
    () =>
      validateSettings({
        ...preferences,
        ...search,
        locale: pathname.startsWith("/preview/")
          ? search.locale
          : pathname.endsWith("/ko")
            ? "ko"
            : "en",
      }),
    [preferences, search, pathname],
  );
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
    const { locale: _locale, q: _query, ...saved } = routeSettings;
    document.cookie = `bolerish-docs-settings=${encodeURIComponent(JSON.stringify(saved))}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  }, [routeSettings, isolated]);
  const runtimeStyle = {
    "--bolerish-unit": settings.unit === "px" ? "16px" : "1rem",
    "--bolerish-density": { default: "1", compact: "0.875", spacious: "1.125" }[settings.density],
    "--bolerish-font-heading":
      settings.fontPreset === "serif-heading" ? "Georgia, serif" : "var(--bolerish-font-body)",
  } as CSSProperties;
  return (
    <html
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
        <HeadContent />
      </head>
      <body>
        <DocumentationContext.Provider value={settings}>
          <DocumentationPreferencesContext.Provider
            value={(changes) => setPreferences((previous) => ({ ...previous, ...changes }))}
          >
            <LocaleContext.Provider value={settings.locale}>
              {isolated ? children : <Shell>{children}</Shell>}
            </LocaleContext.Provider>
          </DocumentationPreferencesContext.Provider>
        </DocumentationContext.Provider>
        {import.meta.env.DEV ? <script type="module" src="/@id/virtual:stylex:runtime" /> : null}
        <Scripts />
      </body>
    </html>
  );
}
