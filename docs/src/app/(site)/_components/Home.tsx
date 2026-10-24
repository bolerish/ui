import { Button } from "@bolerish/ui/button";
import { Separator } from "@bolerish/ui/separator";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

import { getHomeGallery } from "@/app/(site)/_lib/home-gallery";
import { documentLink } from "@/shared/lib/paths";
import { useDocumentationGlobals } from "@/shared/model/useDocumentationGlobals";

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
            ? "일관된 인터페이스를 위한 React 디자인 시스템."
            : "A React design system for consistent interfaces."}
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
      <HomeGallery items={getHomeGallery()} />
    </div>
  );
}
function HomeGallery({ items }: { items: ReturnType<typeof getHomeGallery> }) {
  const { locale } = useDocumentationGlobals();
  const ko = locale === "ko";
  return (
    <section id="components" className="home-gallery" aria-labelledby="gallery-title">
      <h2 id="gallery-title" className="gallery-title">
        {ko ? "컴포넌트와 블록" : "Components & blocks"}
      </h2>
      <div className="gallery-grid">
        {items.map((page) => (
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
            <Separator />
            <div className="gallery-preview" lang="en">
              <page.Example />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
