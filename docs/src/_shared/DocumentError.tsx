import { spacingVars } from "@bolerish/tokens/semantic.stylex";
import { Button } from "@bolerish/ui/button";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@bolerish/ui/empty";
import * as stylex from "@stylexjs/stylex";

import { useLocale } from "@/shared/model/locale";

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

// These dimensions preserve the documentation layout; controls keep their own DS behavior.
const styles = stylex.create({
  error: {
    minHeight: "50dvh",
    marginTop: spacingVars.space12,
    marginRight: spacingVars.space6,
    marginBottom: spacingVars.space12,
    marginLeft: spacingVars.space6,
  },
});
