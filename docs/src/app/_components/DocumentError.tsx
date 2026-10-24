import { Button } from "@bolerish/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@bolerish/ui/empty";

import { useLocale } from "../../shared/model/locale";

export function DocumentError() {
  const ko = useLocale() === "ko";
  return (
    <Empty className="document-error">
      <EmptyHeader>
        <EmptyTitle>{ko ? "문서를 불러오지 못했어요" : "Could not load this page"}</EmptyTitle>
        <EmptyDescription>
          {ko ? "새로고침해서 다시 시도해 주세요." : "Refresh the page to try again."}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => window.location.reload()}>{ko ? "다시 시도" : "Try again"}</Button>
      </EmptyContent>
    </Empty>
  );
}

export function DocumentNotFound() {
  return (
    <article className="document">
      <h1>Page not found</h1>
      <p>Choose a document from the navigation.</p>
      <a href="/docs/getting-started">Go to documentation</a>
    </article>
  );
}
