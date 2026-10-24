import type { DocumentationGlobals } from "../model/settings";

type Page = { section: string; slug: string };
export function localizedPath(path: string, locale: DocumentationGlobals["locale"]) {
  const base = path.replace(/\/ko\/?$/, "").replace(/\/$/, "");
  return locale === "ko" ? `${base}/ko` : base || "/";
}
export function documentPath(page: Page, locale: DocumentationGlobals["locale"] = "en") {
  return localizedPath(
    page.section === "guide" ? `/docs/${page.slug}` : `/docs/${page.section}/${page.slug}`,
    locale,
  );
}
export function documentLink(page: Page, locale: DocumentationGlobals["locale"]) {
  const language = locale === "ko" ? "ko" : undefined;
  return page.section === "guide"
    ? {
        to: locale === "ko" ? ("/docs/$guide/ko" as const) : ("/docs/$guide" as const),
        params: { guide: page.slug },
      }
    : {
        to: "/docs/$section/$slug/{-$locale}" as const,
        params: { section: page.section, slug: page.slug, locale: language },
      };
}
export function legacyDocumentPath(path: string) {
  if (/^\/docs(?:\/ko)?$/.test(path)) return path.replace("/docs", "/docs/getting-started");
  if (path.startsWith("/docs/guide/")) return path.replace("/docs/guide/", "/docs/");
  return path.replace(/^\/(components|foundations|patterns)\//, "/docs/$1/");
}
