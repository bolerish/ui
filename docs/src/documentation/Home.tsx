import { Button } from "@bolerish/ui/button";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Suspense, useEffect, useRef, useState } from "react";

import { catalog } from "./catalog";
import { examples, loadedExamples, loadExample } from "./examples";
import { documentLink } from "./paths";
import { useDocumentationGlobals } from "./useDocumentationGlobals";

const featured = ["card", "calendar", "search-and-filter"];
const items = catalog
  .filter((page) => page.section === "components" || page.section === "patterns")
  .sort((a, b) => {
    const position = (slug: string) => {
      const index = featured.indexOf(slug);
      return index < 0 ? featured.length : index;
    };
    return position(a.slug) - position(b.slug);
  })
  .map((page) => ({
    ...page,
    example:
      page.slug === "card"
        ? "card--AccountCreationForm"
        : Object.hasOwn(examples, `${page.slug}--Default`)
          ? `${page.slug}--Default`
          : Object.keys(examples).find((name) => name.startsWith(`${page.slug}--`))!,
  }));
export async function preloadHome() {
  await Promise.all(items.slice(0, 3).map((page) => loadExample(page.example)));
  return null;
}
export function Home() {
  const { locale } = useDocumentationGlobals();
  const ko = locale === "ko";
  return (
    <div className="home">
      <section className="home-hero">
        <h1>
          bolerish<span>/ui</span>
        </h1>
        <p>
          {ko
            ? "일관된 표면과 상호작용을 위한 React 컴포넌트."
            : "React components for consistent surfaces and interactions."}
        </p>
        <Button
          nativeButton={false}
          render={
            <Link
              {...documentLink({ section: "guide", slug: "getting-started" }, locale)}
              search={{}}
            />
          }
        >
          {ko ? "시작하기" : "Get started"}
          <ArrowUpRightIcon aria-hidden="true" />
        </Button>
      </section>
      <section id="components" className="home-gallery" aria-labelledby="gallery-title">
        <h2 id="gallery-title" className="gallery-title">
          {ko ? "컴포넌트와 블록" : "Components & blocks"}
        </h2>
        <div className="gallery-grid">
          {items.map((page, index) => (
            <article key={`${page.section}/${page.slug}`} className="gallery-item">
              <header>
                <h3>{page.title}</h3>
                <Link
                  {...documentLink(page, locale)}
                  search={{}}
                  aria-label={`${page.title} ${ko ? "문서" : "documentation"}`}
                >
                  {ko ? "문서" : "Docs"}
                  <ArrowUpRightIcon aria-hidden="true" />
                </Link>
              </header>
              <GalleryExample name={page.example} initial={index < 3} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
function GalleryExample({ name, initial }: { name: string; initial: boolean }) {
  const [visible, setVisible] = useState(initial);
  const root = useRef<HTMLDivElement>(null);
  const Example = loadedExamples[name] ?? examples[name];
  useEffect(() => {
    if (visible || !root.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [visible]);
  return (
    <div ref={root} className="gallery-preview" lang="en">
      {visible ? (
        <Suspense fallback={<div className="gallery-placeholder" aria-hidden="true" />}>
          <Example />
        </Suspense>
      ) : (
        <div className="gallery-placeholder" aria-hidden="true" />
      )}
    </div>
  );
}
