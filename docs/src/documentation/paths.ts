import type { DocumentationGlobals } from "./settings";

type Page = { section: string; slug: string };
export function localizedPath(path: string, locale: DocumentationGlobals["locale"]) {
  const base = path.replace(/\/ko\/?$/, "").replace(/\/$/, "");
  return locale === "ko" ? `${base}/ko` : base || "/";
}
export function documentPath(page: Page, locale: DocumentationGlobals["locale"] = "en") {
  return localizedPath(
    page.section === "guide" ? "/docs/getting-started" : `/docs/${page.section}/${page.slug}`,
    locale,
  );
}
export function documentLink(page: Page, locale: DocumentationGlobals["locale"]) {
  const language = locale === "ko" ? "ko" : undefined;
  return page.section === "guide"
    ? { to: "/docs/getting-started/{-$locale}" as const, params: { locale: language } }
    : {
        to: "/docs/$section/$slug/{-$locale}" as const,
        params: { section: page.section, slug: page.slug, locale: language },
      };
}
export function legacyDocumentPath(path: string) {
  if (/^\/docs(?:\/ko)?$/.test(path)) return path.replace("/docs", "/docs/getting-started");
  if (path.startsWith("/docs/guide/getting-started"))
    return path.replace("/docs/guide/getting-started", "/docs/getting-started");
  return path.replace(/^\/(components|foundations|patterns)\//, "/docs/$1/");
}
