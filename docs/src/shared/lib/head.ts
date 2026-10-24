import { documentPath, localizedPath } from "./paths.ts";
import { siteOrigin } from "./site.ts";

type Page = { section: string; slug: string; title: string };

export function localizedLinks(path: string, locale: "en" | "ko") {
  const english = new URL(localizedPath(path, "en"), siteOrigin).href;
  const korean = new URL(localizedPath(path, "ko"), siteOrigin).href;
  return [
    { rel: "canonical", href: locale === "ko" ? korean : english },
    { rel: "alternate", hrefLang: "en", href: english },
    { rel: "alternate", hrefLang: "ko", href: korean },
    { rel: "alternate", hrefLang: "x-default", href: english },
  ];
}

export function documentHead(page: Page | undefined, locale: "en" | "ko") {
  if (!page) return { meta: [{ name: "robots", content: "noindex" }] };
  const suffix = locale === "en" ? ".en" : "";
  const markdown =
    page.section === "guide"
      ? `/guides/${page.slug}${suffix}.md`
      : `/guidelines/${page.slug}${suffix}.md`;
  return {
    meta: [
      { title: `${page.title} · bolerish/ui` },
      {
        name: "description",
        content:
          locale === "ko"
            ? `${page.title}: bolerish/ui의 사용 방법, 예제와 디자인 지침.`
            : `${page.title}: usage, examples and design guidance for bolerish/ui.`,
      },
    ],
    links: [
      ...localizedLinks(documentPath(page), locale),
      { rel: "alternate", type: "text/markdown", href: markdown },
    ],
  };
}
