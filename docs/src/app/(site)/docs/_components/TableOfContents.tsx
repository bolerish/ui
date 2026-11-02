import { useLocale } from "@/shared/model/locale";

export function TableOfContents({
  headings,
}: {
  headings: Record<string, { id: string; title: string }[]>;
}) {
  const locale = useLocale();
  return (
    <nav
      className="table-of-contents"
      aria-label={locale === "ko" ? "이 페이지에서" : "On this page"}
    >
      <p>{locale === "ko" ? "이 페이지에서" : "On this page"}</p>
      {(headings[locale] ?? []).map((heading) => (
        <a href={`#${heading.id}`} key={heading.id}>
          {heading.title}
        </a>
      ))}
    </nav>
  );
}
