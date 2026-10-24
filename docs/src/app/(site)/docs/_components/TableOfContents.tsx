import { useEffect, useState } from "react";

import { useLocale } from "../../../../shared/model/locale";
export function TableOfContents() {
  const locale = useLocale();
  const [headings, setHeadings] = useState<{ id: string; title: string }[]>([]);
  useEffect(() => {
    const article = document.querySelector("article.document");
    if (!article) return;
    const update = () =>
      setHeadings(
        Array.from(article.querySelectorAll("h2[id]")).map((node) => ({
          id: node.id,
          title: node.textContent ?? "",
        })),
      );
    update();
    const observer = new MutationObserver(update);
    observer.observe(article, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);
  return (
    <nav
      className="table-of-contents"
      aria-label={locale === "ko" ? "이 페이지에서" : "On this page"}
    >
      <p>{locale === "ko" ? "이 페이지에서" : "On this page"}</p>
      {headings.map((heading) => (
        <a href={`#${heading.id}`} key={heading.id}>
          {heading.title}
        </a>
      ))}
    </nav>
  );
}
