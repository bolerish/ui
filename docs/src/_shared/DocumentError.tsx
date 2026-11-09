import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@bolerish/ui/empty";
import * as stylex from "@stylexjs/stylex";

import { useLocale } from "@/shared/model/locale";
import { documentStyles } from "@/shared/styles/document";

export function DocumentError() {
  const ko = useLocale() === "ko";
  return (
    <Empty xstyle={styles.error}>
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
    <article {...stylex.props(documentStyles.article)} data-docs="document">
      <h1 {...stylex.props(documentStyles.title)}>Page not found</h1>
      <p {...stylex.props(documentStyles.paragraph)}>Choose a document from the navigation.</p>
      <a {...stylex.props(styles.link)} href="/docs/getting-started">
        Go to documentation
      </a>
    </article>
  );
}

// These dimensions preserve the documentation layout; controls keep their own DS behavior.
const styles = stylex.create({
  link: { color: "inherit", textUnderlineOffset: 3 },
  error: {
    minHeight: "50dvh",
    marginTop: spacingVars.space12,
    marginRight: spacingVars.space6,
    marginBottom: spacingVars.space12,
    marginLeft: spacingVars.space6,
  },
});
